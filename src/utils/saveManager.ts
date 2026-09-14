import type { Player, MemoryItem } from '../types/game';

const SAVE_PREFIX = '8bit_rpg_save_';

export interface SaveData {
  timestamp: number;
  player: Player;
  shopInventory?: MemoryItem[];
}

export const saveGame = (slotIndex: number, player: Player, shopInventory: MemoryItem[]): void => {
  const data: SaveData = {
    timestamp: Date.now(),
    player,
    shopInventory
  };
  localStorage.setItem(`${SAVE_PREFIX}${slotIndex}`, JSON.stringify(data));
};

export const loadGame = (slotIndex: number): SaveData | null => {
  const dataStr = localStorage.getItem(`${SAVE_PREFIX}${slotIndex}`);
  if (!dataStr) return null;
  try {
    const data: SaveData = JSON.parse(dataStr);
    // Backward compatibility: if loadGame used to return just Player, 
    // we now return SaveData.
    return data;
  } catch (e) {
    return null;
  }
};

export const deleteGame = (slotIndex: number): void => {
  localStorage.removeItem(`${SAVE_PREFIX}${slotIndex}`);
};

export const getSaveList = (): (SaveData | null)[] => {
  const list = [];
  for (let i = 1; i <= 5; i++) {
    const dataStr = localStorage.getItem(`${SAVE_PREFIX}${i}`);
    if (dataStr) {
      try {
        list.push(JSON.parse(dataStr) as SaveData);
      } catch (e) {
        list.push(null);
      }
    } else {
      list.push(null);
    }
  }
  return list;
};
