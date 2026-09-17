import { useI18n } from '../contexts/I18nContext';
import { useCallback } from 'react';
import type { Player, MemoryItem, StatModifiers } from '../types/game';
import type { LogEntry } from './useGameLoop';
import { recalculateStats, type BaseStats } from '../utils/statCalculator';

export interface ActionResult {
  success: boolean;
  message: string | LogEntry;
}

export const useMemoryManagement = (
  player: Player,
  setPlayer: React.Dispatch<React.SetStateAction<Player>>,
  baseStats: BaseStats
) => {
  // ==========================================
  // 1. 鑑定ロジック (Identify)
  // ==========================================
  const identifyMemory = useCallback((memoryId: string): ActionResult => {
    const targetIndex = player.inventory.findIndex(m => m.id === memoryId);
    if (targetIndex === -1) return { success: false, message: { key: 'eco_not_found' } };
    
    const target = player.inventory[targetIndex];
    if (target.isIdentified) return { success: false, message: { key: 'eco_already_identified' } };

    const identifyCost = target.cost * 25;
    if (player.currentEn < identifyCost) return { success: false, message: { key: 'eco_need_en', params: { cost: identifyCost } } };

    const c = target.cost;
    const stats: StatModifiers = {};
    switch (target.category) {
      case 'Physical':
        stats.attack = Math.floor(Math.random() * 5 * c) + c * 2;
        stats.maxHP = Math.floor(Math.random() * 10 * c) + c * 5;
        stats.maxMP = -(Math.floor(Math.random() * 5 * c));
        stats.speed = -(Math.floor(Math.random() * 3 * c));
        break;
      case 'Magic':
        stats.maxMP = Math.floor(Math.random() * 10 * c) + c * 5;
        stats.speed = Math.floor(Math.random() * 3 * c) + c;
        stats.maxHP = -(Math.floor(Math.random() * 10 * c));
        stats.defense = -(Math.floor(Math.random() * 3 * c));
        break;
      case 'Healing':
        stats.maxHP = Math.floor(Math.random() * 15 * c) + c * 5;
        stats.defense = Math.floor(Math.random() * 5 * c) + c * 2;
        stats.attack = -(Math.floor(Math.random() * 5 * c));
        break;
      case 'Support':
        stats.maxHP = c * 2;
        stats.maxMP = c * 2;
        stats.defense = c;
        stats.speed = c;
        break;
      case 'Defense':
        stats.defense = Math.floor(Math.random() * 8 * c) + c * 4;
        stats.maxHP = Math.floor(Math.random() * 8 * c) + c * 2;
        stats.attack = -(Math.floor(Math.random() * 4 * c) + c);
        stats.speed = -(Math.floor(Math.random() * 4 * c) + c);
        break;
      default:
        stats.maxHP = c * 3;
        break;
    }

    (Object.keys(stats) as Array<keyof StatModifiers>).forEach(key => {
      if (stats[key] === 0) delete stats[key];
    });

    const identifiedMemory: MemoryItem = {
      ...target,
      isIdentified: true,
      hasCurse: Math.random() < 0.2,
      statModifiers: stats,
      baseValue: target.cost * 150 + Math.floor(Math.random() * 50)
    };

    if (identifiedMemory.hasCurse) {
      identifiedMemory.flavorText = {
        ...identifiedMemory.flavorText,
        itemName: `【呪】${identifiedMemory.flavorText.itemName}`,
        itemNameEn: `[Cursed] ${identifiedMemory.flavorText.itemNameEn || identifiedMemory.flavorText.itemName}`,
        priestMemo: identifiedMemory.flavorText.priestMemo + ' さらに呪い付きだ。愚か者め。'
      };
    }

    setPlayer(prev => {
      const newInventory = [...prev.inventory];
      newInventory[targetIndex] = identifiedMemory;
      return { ...prev, inventory: newInventory, currentEn: prev.currentEn - identifyCost };
    });
    
    return { success: true, message: { key: 'eco_identified', params: { cost: identifyCost } } };
  }, [player.inventory, player.currentEn, setPlayer]);

  // ==========================================
  // 2. インストール（装備）ロジック (Install)
  // ==========================================
  const installMemory = useCallback((memoryId: string): ActionResult => {
    const target = player.inventory.find(m => m.id === memoryId);
    if (!target) return { success: false, message: { key: 'eco_not_found' } };
    if (!target.isIdentified) return { success: false, message: { key: 'mem_unidentified_equip' } };

    const reqLevel = target.cost * 2;
    if (player.level < reqLevel) {
      return { success: false, message: { key: 'mem_req_level', params: { level: reqLevel } } };
    }

    if (player.installedMemories.length >= player.maxSlots) {
      return { success: false, message: { key: 'mem_slot_full' } };
    }

    const currentTotalCost = player.installedMemories.reduce((sum, mem) => sum + mem.cost, 0);
    if (currentTotalCost + target.cost > player.totalCapacity) {
      return { success: false, message: { key: 'mem_cost_over', params: { current: currentTotalCost + target.cost, max: player.totalCapacity } } };
    }

    setPlayer(prev => {
      const newInventory = prev.inventory.filter(m => m.id !== memoryId);
      const newInstalled = [...prev.installedMemories, target];
      const updatedPlayer = { ...prev, inventory: newInventory, installedMemories: newInstalled };
      
      const { clampedPlayer } = recalculateStats(updatedPlayer, baseStats);
      return clampedPlayer;
    });
    
    return { success: true, message: { key: 'sys_install', params: { itemName: target.flavorText.itemName, itemNameEn: target.flavorText.itemNameEn || target.flavorText.itemName } } };
  }, [player, baseStats, setPlayer]);

  // ==========================================
  // 3. アンインストール（外す） (Uninstall)
  // ==========================================
  const uninstallMemory = useCallback((memoryId: string): ActionResult => {
    const target = player.installedMemories.find(m => m.id === memoryId);
    if (!target) return { success: false, message: { key: 'mem_not_equipped' } };
    
    if (target.hasCurse) {
      return { success: false, message: { key: 'mem_cursed_unequip' } };
    }
    
    if (player.inventory.length >= player.maxInventorySize) {
      return { success: false, message: { key: 'eco_inv_full' } };
    }

    setPlayer(prev => {
      const newInstalled = prev.installedMemories.filter(m => m.id !== memoryId);
      const newInventory = [...prev.inventory, target];
      const updatedPlayer = { ...prev, inventory: newInventory, installedMemories: newInstalled };
      
      const { clampedPlayer } = recalculateStats(updatedPlayer, baseStats);
      return clampedPlayer;
    });
    
    return { success: true, message: { key: 'sys_uninstall', params: { itemName: target.flavorText.itemName, itemNameEn: target.flavorText.itemNameEn || target.flavorText.itemName } } };
  }, [player, baseStats, setPlayer]);

  // ==========================================
  // 4. 破棄（忘却）ロジック (Discard)
  // ==========================================
  const discardMemory = useCallback((memoryId: string): ActionResult => {
    const target = player.inventory.find(m => m.id === memoryId);
    if (!target) return { success: false, message: { key: 'eco_not_found' } };

    setPlayer(prev => ({
      ...prev,
      inventory: prev.inventory.filter(m => m.id !== memoryId)
    }));
    
    return { success: true, message: { key: 'sys_discard', params: { itemName: target.flavorText?.itemName || '記憶', itemNameEn: target.flavorText?.itemNameEn || 'Memory' } } };
  }, [player.inventory, setPlayer]);

  // ==========================================
  // 5. 破戒僧の庵：脳の許容量拡張 (Train Capacity)
  // ==========================================
  const trainCapacity = useCallback((): ActionResult => {
    if (player.totalCapacity >= 30) return { success: false, message: { key: 'mem_cap_max' } };
    if (player.currentEn < 10000) return { success: false, message: { key: 'eco_need_en', params: { cost: 10000 } } };
    setPlayer(prev => ({ ...prev, totalCapacity: prev.totalCapacity + 1, currentEn: prev.currentEn - 10000 }));
    return { success: true, message: { key: 'mem_cap_trained' } };
  }, [player.totalCapacity, player.currentEn, setPlayer]);

  // ==========================================
  // 6. 破戒僧の庵：記憶スロット拡張 (Train Slots)
  // ==========================================
  const trainSlots = useCallback((): ActionResult => {
    if (player.maxSlots >= 6) return { success: false, message: { key: 'mem_slot_max' } };
    if (player.currentEn < 100000) return { success: false, message: { key: 'eco_need_en', params: { cost: 100000 } } };
    setPlayer(prev => ({ ...prev, maxSlots: prev.maxSlots + 1, currentEn: prev.currentEn - 100000 }));
    return { success: true, message: { key: 'mem_slot_trained' } };
  }, [player.maxSlots, player.currentEn, setPlayer]);

  // ==========================================
  // 7. 破戒僧の庵：呪い解除 (Uncurse)
  // ==========================================
  const uncurseMemory = useCallback((memoryId: string): ActionResult => {
    const target = player.installedMemories.find(m => m.id === memoryId);
    if (!target) return { success: false, message: { key: 'eco_not_found' } };
    if (!target.hasCurse) return { success: false, message: { key: 'mem_not_cursed' } };
    if (player.inventory.length >= player.maxInventorySize) return { success: false, message: { key: 'eco_inv_full' } };
    
    const cost = target.cost * 1000;
    if (player.currentEn < cost) return { success: false, message: { key: 'eco_need_en', params: { cost } } };

    setPlayer(prev => {
      const newInstalled = prev.installedMemories.filter(m => m.id !== memoryId);
      const newInventory = [...prev.inventory, target];
      const updatedPlayer = { ...prev, inventory: newInventory, installedMemories: newInstalled, currentEn: prev.currentEn - cost };
      const { clampedPlayer } = recalculateStats(updatedPlayer, baseStats);
      return clampedPlayer;
    });
    return { success: true, message: { key: 'mem_uncursed' } };
  }, [player, baseStats, setPlayer]);

  return { actions: { identifyMemory, installMemory, uninstallMemory, discardMemory, trainCapacity, trainSlots, uncurseMemory } };
};
