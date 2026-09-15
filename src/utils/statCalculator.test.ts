import { describe, it, expect } from 'vitest';
import { getBaseStats, recalculateStats } from './statCalculator';
import type { Player, MemoryItem } from '../types/game';

describe('statCalculator', () => {
  it('getBaseStats increases with level', () => {
    const stats1 = getBaseStats(1);
    const stats2 = getBaseStats(10);
    
    expect(stats2.attack).toBeGreaterThan(stats1.attack);
    expect(stats2.defense).toBeGreaterThan(stats1.defense);
    expect(stats2.speed).toBeGreaterThan(stats1.speed);
  });

  it('recalculateStats sets hpDrainCurse when a cursed memory is equipped', () => {
    const basePlayer = {
      level: 1, currentHP: 10, maxHP: 10, currentMP: 10, maxMP: 10,
      currentEXP: 0, currentEn: 0, stashedEn: 0, totalDives: 0, maxReachedDepth: 0,
      inventory: [], installedMemories: [],
      maxInventorySize: 10, totalCapacity: 10, maxSlots: 3,
      buffs: { attackExpiresAtStep: 0, defenseExpiresAtStep: 0, speedExpiresAtStep: 0, currentDepthStep: 0 }
    } as unknown as Player;

    const cursedMemory = {
      id: 'curse_1',
      cost: 5,
      hasCurse: true,
      isIdentified: true,
      statModifiers: { attack: 10 },
      flavorText: { itemName: 'Cursed Item', originText: '', priestMemo: '' }
    } as unknown as MemoryItem;

    basePlayer.installedMemories.push(cursedMemory);

    const baseStats = getBaseStats(basePlayer.level);
    const { calculatedStats } = recalculateStats(basePlayer, baseStats);
    
    expect(calculatedStats.specialFlags.hpDrainCurse).toBe(true);
  });

  it('recalculateStats clamps maxHP to at least 1 and maxMP to at least 0', () => {
    const basePlayer = {
      level: 1, currentHP: 10, maxHP: 10, currentMP: 10, maxMP: 10,
      currentEXP: 0, currentEn: 0, stashedEn: 0, totalDives: 0, maxReachedDepth: 0,
      inventory: [], installedMemories: [],
      maxInventorySize: 10, totalCapacity: 10, maxSlots: 3,
      buffs: { attackExpiresAtStep: 0, defenseExpiresAtStep: 0, speedExpiresAtStep: 0, currentDepthStep: 0 }
    } as unknown as Player;

    const debuffMemory = {
      id: 'debuff_1',
      cost: 5,
      hasCurse: false,
      isIdentified: true,
      statModifiers: { maxHP: -9999, maxMP: -9999 }, // Extreme debuff
      flavorText: { itemName: 'Debuff Item', originText: '', priestMemo: '' }
    } as unknown as MemoryItem;

    basePlayer.installedMemories.push(debuffMemory);

    const baseStats = getBaseStats(basePlayer.level);
    const { calculatedStats, clampedPlayer } = recalculateStats(basePlayer, baseStats);
    
    expect(calculatedStats.maxHP).toBe(1);
    expect(calculatedStats.maxMP).toBe(0);
    expect(clampedPlayer.maxHP).toBe(1);
    expect(clampedPlayer.maxMP).toBe(0);
  });
});
