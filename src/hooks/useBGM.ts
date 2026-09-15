import { useEffect, useRef } from 'react';
import { GameState } from './useGameLoop';
import { useAudioContext } from '../contexts/AudioContext';

export const useBGM = (gameState: GameState, depth: number) => {
  const { musicEnabled } = useAudioContext();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const currentSrcRef = useRef<string | null>(null);

  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.loop = true;
    }

    const audio = audioRef.current;

    if (!musicEnabled) {
      audio.pause();
      audio.currentTime = 0;
      currentSrcRef.current = null;
      return;
    }

    let targetSrc = '';
    
    if (gameState === GameState.TOWN) {
      targetSrc = '/audio/town.mp3';
    } else if (gameState === GameState.EXPLORING) {
      targetSrc = '/audio/dungeon.mp3';
    } else if (gameState === GameState.ENCOUNTER || gameState === GameState.COMBAT_RESULT) {
      if (depth === 30) {
        targetSrc = '/audio/lastbattle.mp3';
      } else {
        targetSrc = '/audio/battle.mp3';
      }
    }

    if (targetSrc && currentSrcRef.current !== targetSrc) {
      audio.pause();
      audio.currentTime = 0;
      audio.src = targetSrc;
      audio.play().catch(e => console.warn('BGM Auto-play prevented', e));
      currentSrcRef.current = targetSrc;
    }
  }, [gameState, depth, musicEnabled]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
        audioRef.current = null;
      }
    };
  }, []);
};
