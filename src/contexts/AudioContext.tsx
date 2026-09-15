import React, { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

interface AudioContextType {
  musicEnabled: boolean;
  setMusicEnabled: (enabled: boolean) => void;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export const AudioProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [musicEnabled, setMusicEnabled] = useState(false);

  return (
    <AudioContext.Provider value={{ musicEnabled, setMusicEnabled }}>
      {children}
    </AudioContext.Provider>
  );
};

export const useAudioContext = () => {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error('useAudioContext must be used within an AudioProvider');
  }
  return context;
};
