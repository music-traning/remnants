import { useI18n } from '../contexts/I18nContext';
import { useCallback } from 'react';
import type { Player, MemoryItem, StatModifiers } from '../types/game';
import { recalculateStats, type BaseStats } from '../utils/statCalculator';

export interface ActionResult {
  success: boolean;
  message: string;
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
    if (targetIndex === -1) return { success: false, message: '指定されたアイテムが見つかりません。' };
    
    const target = player.inventory[targetIndex];
    if (target.isIdentified) return { success: false, message: '既に鑑定済みのアイテムです。' };

    const identifyCost = target.cost * 25;
    if (player.currentEn < identifyCost) return { success: false, message: `【エラー】鑑定には ${identifyCost} 縁が必要です。` };

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
        priestMemo: identifiedMemory.flavorText.priestMemo + ' さらに呪い付きだ。愚か者め。'
      };
    }

    setPlayer(prev => {
      const newInventory = [...prev.inventory];
      newInventory[targetIndex] = identifiedMemory;
      return { ...prev, inventory: newInventory, currentEn: prev.currentEn - identifyCost };
    });
    
    return { success: true, message: `${identifyCost}縁を支払い、鑑定に成功しました。` };
  }, [player.inventory, player.currentEn, setPlayer]);

  // ==========================================
  // 2. インストール（装備）ロジック (Install)
  // ==========================================
  const installMemory = useCallback((memoryId: string): ActionResult => {
    const target = player.inventory.find(m => m.id === memoryId);
    if (!target) return { success: false, message: '指定されたアイテムが見つかりません。' };
    if (!target.isIdentified) return { success: false, message: '未鑑定の記憶は装備できません。' };

    const reqLevel = target.cost * 2;
    if (player.level < reqLevel) {
      return { success: false, message: `レベルが足りず、自我が崩壊するため装備できません。（必要Lv: ${reqLevel}）` };
    }

    if (player.installedMemories.length >= player.maxSlots) {
      return { success: false, message: 'メモリスロットの上限に達しています。' };
    }

    const currentTotalCost = player.installedMemories.reduce((sum, mem) => sum + mem.cost, 0);
    if (currentTotalCost + target.cost > player.totalCapacity) {
      return { success: false, message: 'キャパシティ（コスト上限）をオーバーしています。' };
    }

    setPlayer(prev => {
      const newInventory = prev.inventory.filter(m => m.id !== memoryId);
      const newInstalled = [...prev.installedMemories, target];
      const updatedPlayer = { ...prev, inventory: newInventory, installedMemories: newInstalled };
      
      const { clampedPlayer } = recalculateStats(updatedPlayer, baseStats);
      return clampedPlayer;
    });
    
    return { success: true, message: `${target.flavorText.itemName} をインストールしました。` };
  }, [player, baseStats, setPlayer]);

  // ==========================================
  // 3. アンインストール（装備解除）ロジック (Uninstall)
  // ==========================================
  const uninstallMemory = useCallback((memoryId: string): ActionResult => {
    const target = player.installedMemories.find(m => m.id === memoryId);
    if (!target) return { success: false, message: '指定されたアイテムは装備されていません。' };
    
    if (target.hasCurse) {
      return { success: false, message: '【呪縛】この記憶は呪われており、外すことができません！' };
    }
    
    if (player.inventory.length >= player.maxInventorySize) {
      return { success: false, message: '【エラー】インベントリの空き容量がありません。' };
    }

    setPlayer(prev => {
      const newInstalled = prev.installedMemories.filter(m => m.id !== memoryId);
      const newInventory = [...prev.inventory, target];
      const updatedPlayer = { ...prev, inventory: newInventory, installedMemories: newInstalled };
      
      const { clampedPlayer } = recalculateStats(updatedPlayer, baseStats);
      return clampedPlayer;
    });
    
    return { success: true, message: `${target.flavorText.itemName} をアンインストールしました。` };
  }, [player, baseStats, setPlayer]);

  // ==========================================
  // 4. 破棄（忘却）ロジック (Discard)
  // ==========================================
  const discardMemory = useCallback((memoryId: string): ActionResult => {
    const target = player.inventory.find(m => m.id === memoryId);
    if (!target) return { success: false, message: 'アイテムが見つかりません。' };

    setPlayer(prev => ({
      ...prev,
      inventory: prev.inventory.filter(m => m.id !== memoryId)
    }));
    
    return { success: true, message: `${target.flavorText?.itemName || '記憶'} を破棄（忘却）しました。` };
  }, [player.inventory, setPlayer]);

  // ==========================================
  // 5. 破戒僧の庵：脳の許容量拡張 (Train Capacity)
  // ==========================================
  const trainCapacity = useCallback((): ActionResult => {
    if (player.totalCapacity >= 30) return { success: false, message: '脳の許容量は既に限界（30）だ。' };
    if (player.currentEn < 10000) return { success: false, message: '縁が足りない。（必要: 10,000 En）' };
    setPlayer(prev => ({ ...prev, totalCapacity: prev.totalCapacity + 1, currentEn: prev.currentEn - 10000 }));
    return { success: true, message: '10,000 Enを支払い、修行で脳の許容量（Capacity）を拡張した。' };
  }, [player.totalCapacity, player.currentEn, setPlayer]);

  // ==========================================
  // 6. 破戒僧の庵：記憶スロット拡張 (Train Slots)
  // ==========================================
  const trainSlots = useCallback((): ActionResult => {
    if (player.maxSlots >= 6) return { success: false, message: '記憶スロットは既に限界（6）だ。' };
    if (player.currentEn < 100000) return { success: false, message: '縁が足りない。（必要: 100,000 En）' };
    setPlayer(prev => ({ ...prev, maxSlots: prev.maxSlots + 1, currentEn: prev.currentEn - 100000 }));
    return { success: true, message: '100,000 Enを支払い、修行で記憶スロットを拡張した。' };
  }, [player.maxSlots, player.currentEn, setPlayer]);

  // ==========================================
  // 7. 破戒僧の庵：呪い解除 (Uncurse)
  // ==========================================
  const uncurseMemory = useCallback((memoryId: string): ActionResult => {
    const target = player.installedMemories.find(m => m.id === memoryId);
    if (!target) return { success: false, message: 'アイテムが見つかりません。' };
    if (!target.hasCurse) return { success: false, message: 'この記憶は呪われていません。' };
    if (player.inventory.length >= player.maxInventorySize) return { success: false, message: '倉庫がいっぱいで外せません。' };
    
    const cost = target.cost * 1000;
    if (player.currentEn < cost) return { success: false, message: `縁が足りません。（必要: ${cost} En）` };

    setPlayer(prev => {
      const newInstalled = prev.installedMemories.filter(m => m.id !== memoryId);
      const newInventory = [...prev.inventory, target];
      const updatedPlayer = { ...prev, inventory: newInventory, installedMemories: newInstalled, currentEn: prev.currentEn - cost };
      const { clampedPlayer } = recalculateStats(updatedPlayer, baseStats);
      return clampedPlayer;
    });
    return { success: true, message: `${cost} Enを支払い、強引に呪いを引き剥がしました。` };
  }, [player, baseStats, setPlayer]);

  return { actions: { identifyMemory, installMemory, uninstallMemory, discardMemory, trainCapacity, trainSlots, uncurseMemory } };
};
