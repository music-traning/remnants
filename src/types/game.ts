/**
 * 8ビット風テキストダンジョンRPG
 * コアデータ構造・型定義
 */

// 通貨単位「縁（En）」
export type En = number;

// 記憶の欠片のカテゴリ
export type MemoryCategory = 'Physical' | 'Magic' | 'Defense' | 'Healing' | 'Support';

// 記憶の欠片のレアリティ
export type Rarity = 'Common' | 'Uncommon' | 'Rare' | 'Epic' | 'Legendary';

// ステータス補正値（マイナス値も許容）
export interface StatModifiers {
  maxHP?: number;
  maxMP?: number;
  attack?: number;
  defense?: number;
  speed?: number;
}

// 画面表示用のメタデータ（フレーバーテキスト）
export interface FlavorText {
  itemName: string;     // 例：「万夫不当の孤絶」など
  originText: string;   // アイテムの由来や背景テキスト
  priestMemo: string;   // 破戒僧によるシニカルなメモテキスト
  itemNameEn?: string;
  originTextEn?: string;
  priestMemoEn?: string;
}

export interface MemoryTemplate {
  category: MemoryCategory;
  rarity: Rarity;
  cost: number;
  baseValue: En;
  statModifiers?: StatModifiers;
  hasCurse?: boolean;
  requiredUncurseItem?: string | null;
  itemName: string;
  originText: string;
  priestMemo: string;
  itemNameEn?: string;
  originTextEn?: string;
  priestMemoEn?: string;
}

export type SpellType = 'Heal' | 'AtkUp' | 'DefUp' | 'SpdUp' | 'MagicAttack' | 'Return';

export interface Spell {
  id: string;
  type: SpellType;
  name: string;
  powerMultiplier: number;
  mpCost: number;
}

// 記憶の欠片（装備アイテム）
export interface MemoryItem {
  id: string;                          // 一意な識別子
  isIdentified: boolean;               // 鑑定済みフラグ
  category: MemoryCategory;            // 内部処理のジャンル
  rarity: Rarity;                      // レアリティ設定
  cost: number;                        // 装備時に消費するキャパシティ値
  statModifiers: StatModifiers;        // ステータス増減値
  hasCurse: boolean;                   // 呪いの有無
  requiredUncurseItem: string | null;  // 呪い解除に必要なアイテムID（不要な場合はnull）
  baseValue: En;                       // 閻魔屋での売却基本価格（縁）
  attachedSpell?: Spell;               // 付与された魔法（ランダム）
  soldAtDiveCount?: number;            // 売却された時点での潜行回数
  flavorText: FlavorText;
}

// プレイヤーのステータス情報
export interface Player {
  level: number;
  currentEXP: number;                  // 経験値
  maxHP: number;
  currentHP: number;
  maxMP: number;
  currentMP: number;
  
  totalCapacity: number;               // 記憶を装備するためのコスト上限値
  maxSlots: number;                    // 記憶を装備できる枠数（レベルアップで増加）
  maxInventorySize: number;            // 倉庫（インベントリ）の最大容量
  currentEn: En;                       // 所持している縁
  stashedEn: En;                       // 倉庫に預けた縁（フェーズ4追加）
  
  installedMemories: MemoryItem[];     // 現在スロットに装備している記憶の配列
  inventory: MemoryItem[];             // 倉庫に保管している未鑑定・鑑定済みの記憶の配列

  buffs: {
    attackExpiresAtStep: number;
    defenseExpiresAtStep: number;
    speedExpiresAtStep: number;
  };
  playTimeSeconds: number;
  maxReachedDepth: number;
  totalDives: number;
}
