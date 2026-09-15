import { useI18n } from '../contexts/I18nContext';
import { useCallback } from 'react';
import type { Player, MemoryItem, En } from '../types/game';
import type { LogEntry } from './useGameLoop';
import { GameState } from './useGameLoop';

export interface EconomyActionResult {
  success: boolean;
  message: string | LogEntry;
}

export const getMemoryBasePrice = (cost: number): number => {
  return Math.floor(Math.pow(cost, 2.5) * 150 + cost * 500);
};

export const calculateSellPrice = (memory: MemoryItem): number => {
  const basePrice = getMemoryBasePrice(memory.cost);
  return memory.isIdentified ? basePrice : Math.floor(basePrice * 0.7);
};

export const useEconomy = (
  player: Player,
  setPlayer: React.Dispatch<React.SetStateAction<Player>>,
  gameState: GameState,
  shopInventory: MemoryItem[],
  setShopInventory: React.Dispatch<React.SetStateAction<MemoryItem[]>>
) => {
  const { t } = useI18n();
  const depositEn = useCallback((amount: En): EconomyActionResult => {
    if (gameState !== GameState.TOWN) return { success: false, message: '預入は街でのみ可能です。' };
    if (amount <= 0 || player.currentEn < amount) return { success: false, message: '縁が不足しています。' };
    setPlayer(prev => ({ ...prev, currentEn: prev.currentEn - amount, stashedEn: prev.stashedEn + amount }));
    return { success: true, message: t('eco_deposited', { amount }) };
  }, [player.currentEn, gameState, setPlayer]);

  const withdrawEn = useCallback((amount: En): EconomyActionResult => {
    if (gameState !== GameState.TOWN) return { success: false, message: '引出は街でのみ可能です。' };
    if (amount <= 0 || player.stashedEn < amount) return { success: false, message: '縁が不足しています。' };
    setPlayer(prev => ({ ...prev, stashedEn: prev.stashedEn - amount, currentEn: prev.currentEn + amount }));
    return { success: true, message: t('eco_withdrew', { amount }) };
  }, [player.stashedEn, gameState, setPlayer]);

  // ==========================================
  // 1. 記憶の売却（閻魔の計量所）
  // ==========================================
  const sellMemory = useCallback((memoryId: string): EconomyActionResult => {
    if (gameState !== GameState.TOWN) return { success: false, message: '街にいる時のみ利用できます。' };
    
    const target = player.inventory.find(m => m.id === memoryId);
    if (!target) return { success: false, message: 'アイテムが見つかりません。' };

    const sellPrice = calculateSellPrice(target);
    const soldMemory = { ...target, soldAtDiveCount: player.totalDives || 0 };
    
    setPlayer(prev => ({
      ...prev,
      inventory: prev.inventory.filter(m => m.id !== memoryId),
      currentEn: prev.currentEn + sellPrice
    }));
    setShopInventory(prev => [...prev, soldMemory]);
    return { success: true, message: { key: 'sys_sell', params: { itemName: target.flavorText?.itemName || '未鑑定の記憶', itemNameEn: target.flavorText?.itemNameEn || 'Unidentified Memory', price: sellPrice } } };
  }, [player.inventory, player.totalDives, gameState, setPlayer, setShopInventory]);

  // ==========================================
  // 2. 記憶の買い戻し
  // ==========================================
  const buyBackMemory = useCallback((memoryId: string): EconomyActionResult => {
    if (gameState !== GameState.TOWN) return { success: false, message: '街にいる時のみ利用できます。' };
    
    const target = shopInventory.find(m => m.id === memoryId);
    if (!target) return { success: false, message: 'アイテムが見つかりません。' };

    const buyPrice = Math.floor(getMemoryBasePrice(target.cost) * 1.5);
    if (player.currentEn < buyPrice) {
      return { success: false, message: `縁が足りません。（必要: ${buyPrice} 縁）` };
    }
    
    if (player.inventory.length >= player.maxInventorySize) {
      return { success: false, message: '倉庫がいっぱいです。' };
    }

    setPlayer(prev => ({
      ...prev,
      currentEn: prev.currentEn - buyPrice,
      inventory: [...prev.inventory, target]
    }));
    setShopInventory(prev => prev.filter(m => m.id !== memoryId));
    
    return { success: true, message: { key: 'sys_buy', params: { itemName: target.flavorText?.itemName || '未鑑定の記憶', itemNameEn: target.flavorText?.itemNameEn || 'Unidentified Memory', price: buyPrice } } };
  }, [shopInventory, player.currentEn, player.inventory.length, player.maxInventorySize, gameState, setPlayer, setShopInventory]);

  const expandInventory = useCallback((): EconomyActionResult => {
    if (gameState !== GameState.TOWN) return { success: false, message: '街でのみ可能です。' };
    
    let cost = 0;
    let nextSize = player.maxInventorySize;
    if (player.maxInventorySize === 30) { cost = 5000; nextSize = 35; }
    else if (player.maxInventorySize === 35) { cost = 20000; nextSize = 40; }
    else if (player.maxInventorySize === 40) { cost = 50000; nextSize = 45; }
    else if (player.maxInventorySize === 45) { cost = 100000; nextSize = 50; }
    else { return { success: false, message: '倉庫は既に最大（50）まで拡張されています。' }; }

    if (player.currentEn < cost) return { success: false, message: `縁が不足しています。（必要: ${cost} En）` };

    setPlayer(prev => ({
      ...prev,
      currentEn: prev.currentEn - cost,
      maxInventorySize: nextSize
    }));
    return { success: true, message: `${cost} 縁を支払い、倉庫の容量を ${nextSize} に拡張しました！` };
  }, [player.maxInventorySize, player.currentEn, gameState, setPlayer]);

  // ==========================================
  // 5. 宿屋（微睡みの寝床）での休息
  // ==========================================
  const restAtInn = useCallback((): EconomyActionResult => {
    const cost = Math.floor(player.maxHP * 0.1 + player.maxMP * 0.5);
    if (player.currentEn < cost) {
       return { success: false, message: `縁が足りない。（必要: ${cost} En）` };
    }
    if (player.currentHP === player.maxHP && player.currentMP === player.maxMP) {
       return { success: false, message: `すでに体力も魔力も万全だ。` };
    }
    setPlayer(prev => ({ ...prev, currentHP: prev.maxHP, currentMP: prev.maxMP, currentEn: prev.currentEn - cost }));
    return { success: true, message: `${cost} Enを支払い、微睡みの寝床で十分に休息した。` };
  }, [player, setPlayer]);

  return { actions: { depositEn, withdrawEn, sellMemory, buyBackMemory, expandInventory, restAtInn } };
};
