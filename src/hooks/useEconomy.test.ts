import { describe, it, expect } from 'vitest';
import { getMemoryBasePrice, calculateSellPrice } from './useEconomy';
import type { MemoryItem } from '../types/game';

describe('useEconomy utils', () => {
  it('getMemoryBasePrice monotonically increases with cost', () => {
    const cost1 = 1;
    const cost2 = 5;
    const cost3 = 10;
    
    const price1 = getMemoryBasePrice(cost1);
    const price2 = getMemoryBasePrice(cost2);
    const price3 = getMemoryBasePrice(cost3);
    
    expect(price2).toBeGreaterThan(price1);
    expect(price3).toBeGreaterThan(price2);
  });

  it('calculateSellPrice applies 70% multiplier when unidentified', () => {
    const memory = {
      id: 'mem_1',
      cost: 10,
      hasCurse: false,
      isIdentified: false,
      statModifiers: {},
      flavorText: { itemName: 'Unknown', originText: '', priestMemo: '' }
    } as unknown as MemoryItem;
    
    const basePrice = getMemoryBasePrice(memory.cost);
    const sellPriceUnid = calculateSellPrice(memory);
    
    expect(sellPriceUnid).toBe(Math.floor(basePrice * 0.7));
    
    memory.isIdentified = true;
    const sellPriceId = calculateSellPrice(memory);
    expect(sellPriceId).toBe(basePrice);
  });
});
