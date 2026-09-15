import type { Player, MemoryItem } from '../types/game';

export interface BaseStats {
  maxHP: number;
  maxMP: number;
  attack: number;
  defense: number;
  speed: number;
}

export interface CalculatedStats {
  maxHP: number;
  maxMP: number;
  attack: number;
  defense: number;
  speed: number;
  specialFlags: {
    hpDrainCurse: boolean; // 毎ターンHP減少などの特殊フラグ
  };
}

export function getBaseStats(level: number): BaseStats {
  return {
    maxHP: 500,
    maxMP: 50,
    attack: 10 + level * 2,
    defense: 5 + level,
    speed: 10 + level
  };
}

/**
 * プレイヤーの最終ステータスを算出し、異常値をクランプする純粋関数
 */
export function recalculateStats(player: Player, baseStats: BaseStats): { 
  calculatedStats: CalculatedStats; 
  clampedPlayer: Player; 
} {
  // 基礎ステータスをベースに初期化
  const finalStats: CalculatedStats = {
    ...baseStats,
    specialFlags: { hpDrainCurse: false }
  };

  // 全インストール済み記憶の補正値を合算
  for (const mem of player.installedMemories) {
    const mods = mem.statModifiers;
    if (mods.maxHP) finalStats.maxHP += mods.maxHP;
    if (mods.maxMP) finalStats.maxMP += mods.maxMP;
    if (mods.attack) finalStats.attack += mods.attack;
    if (mods.defense) finalStats.defense += mods.defense;
    if (mods.speed) finalStats.speed += mods.speed;

    // 特殊効果の集計
    if (mem.hasCurse) {
      finalStats.specialFlags.hpDrainCurse = true; 
    }
  }

  // 異常値の補正（MaxHPやMaxMPが0以下にならないように最低値を保証）
  finalStats.maxHP = Math.max(1, finalStats.maxHP);
  finalStats.maxMP = Math.max(0, finalStats.maxMP);

  // 【重要事項】現在のHP・MPが新しく計算された最大値を超えないようにClamp（切り捨て）
  const clampedPlayer: Player = {
    ...player,
    maxHP: finalStats.maxHP,
    maxMP: finalStats.maxMP,
    currentHP: Math.min(player.currentHP, finalStats.maxHP),
    currentMP: Math.min(player.currentMP, finalStats.maxMP),
  };

  return {
    calculatedStats: finalStats,
    clampedPlayer: clampedPlayer
  };
}
