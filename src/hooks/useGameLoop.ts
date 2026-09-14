import { useI18n } from '../contexts/I18nContext';
import { useState, useCallback, useEffect } from 'react';
import type { Player, MemoryItem, MemoryCategory, Rarity, SpellType, Spell } from '../types/game';
import memoryMasterData from '../data/memoryMaster.json';

type MemoryTemplate = { rarity: string; cost: number; itemName: string; originText: string; priestMemo: string; itemNameEn?: string; originTextEn?: string; priestMemoEn?: string; };
const memoryMaster = memoryMasterData as Record<string, MemoryTemplate[]>;

export enum GameState {
  TOWN = 'TOWN',
  EXPLORING = 'EXPLORING',
  ENCOUNTER = 'ENCOUNTER',
  COMBAT_RESULT = 'COMBAT_RESULT'
}

export interface Enemy {
  id: string;
  name: string;
  hp: number;
  attack: number;
  defense: number;
  isBoss?: boolean;
}

export const useGameLoop = (initialPlayer: Player) => {
  const { t } = useI18n();
  const [player, setPlayer] = useState<Player>(initialPlayer);
  const [gameState, setGameState] = useState<GameState>(GameState.TOWN);
  const [currentEnemy, setCurrentEnemy] = useState<Enemy | null>(null);
  const [logMessages, setLogMessages] = useState<string[]>([t('gl_town_stay')]);
  const [shopInventory, setShopInventory] = useState<MemoryItem[]>([]);
  const [steps, setSteps] = useState<number>(0);

  const depth = Math.floor(steps / 5);

  useEffect(() => {
    const timer = setInterval(() => {
      setPlayer(p => ({ ...p, playTimeSeconds: p.playTimeSeconds + 1 }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const addLog = useCallback((msg: string) => {
    setLogMessages(prev => [...prev, msg]);
  }, []);

  const calculatePlayerStat = useCallback((statName: 'attack' | 'defense' | 'speed'): number => {
    let total = statName === 'attack' ? 10 + player.level * 2 : statName === 'defense' ? 5 + player.level : 10 + player.level;
    for (const mem of player.installedMemories) {
      const modifier = mem.statModifiers[statName];
      if (modifier) total += modifier;
    }
    
    // Safety check for buffs object from old saves
    const buffs = player.buffs || { attackExpiresAtStep: 0, defenseExpiresAtStep: 0, speedExpiresAtStep: 0 };
    
    if (statName === 'attack' && steps < buffs.attackExpiresAtStep) total = Math.floor(total * 1.5);
    if (statName === 'defense' && steps < buffs.defenseExpiresAtStep) total = Math.floor(total * 1.5);
    if (statName === 'speed' && steps < buffs.speedExpiresAtStep) total = Math.floor(total * 1.5);
    
    return total;
  }, [player, steps]);

  const generateDropItem = useCallback((): MemoryItem => {
    const categories = Object.keys(memoryMaster) as MemoryCategory[];
    const randomCategory = categories[Math.floor(Math.random() * categories.length)];
    const templates = memoryMaster[randomCategory];
    const template = templates[Math.floor(Math.random() * templates.length)];

    let attachedSpell: Spell | undefined = undefined;
    if (Math.random() < 0.4) {
      const spellTypes: SpellType[] = ['Heal', 'AtkUp', 'DefUp', 'SpdUp', 'MagicAttack'];
      let chosenType = spellTypes[Math.floor(Math.random() * spellTypes.length)];
      
      // Return spell is ultra rare, mostly for Legendary
      if (template.rarity === 'Legendary' && Math.random() < 0.1) {
        chosenType = 'Return';
      } else if (template.rarity === 'Epic' && Math.random() < 0.02) {
        chosenType = 'Return'; // Still extremely rare chance for Epic
      }

      const getSpellInfo = (type: SpellType): {name: string, mpCost: number} => {
        switch (type) {
          case 'Heal': return { name: t('spell_heal'), mpCost: 15 };
          case 'AtkUp': return { name: t('spell_atkup'), mpCost: 20 };
          case 'DefUp': return { name: t('spell_defup'), mpCost: 15 };
          case 'SpdUp': return { name: t('spell_spdup'), mpCost: 15 };
          case 'MagicAttack': return { name: t('spell_magic_atk'), mpCost: 20 };
          case 'Return': return { name: t('spell_return'), mpCost: 50 };
          default: return { name: t('spell_unknown'), mpCost: 10 };
        }
      };

      const info = getSpellInfo(chosenType);
      attachedSpell = {
        id: `spell_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
        type: chosenType,
        name: info.name,
        powerMultiplier: 1.0,
        mpCost: info.mpCost
      };
    }

    return {
      id: `mem_${Date.now()}_${Math.floor(Math.random() * 10000)}`,
      isIdentified: false,
      category: randomCategory,
      rarity: template.rarity as Rarity,
      cost: template.cost,
      statModifiers: {},
      hasCurse: false,
      requiredUncurseItem: null,
      baseValue: 10,
      attachedSpell,
      flavorText: {
        itemName: template.itemName,
        originText: template.originText,
        priestMemo: template.priestMemo,
        itemNameEn: template.itemNameEn,
        originTextEn: template.originTextEn,
        priestMemoEn: template.priestMemoEn
      }
    };
  }, []);

  const handleWipeout = useCallback(() => {
    setPlayer(p => {
      const newCurrentEn = Math.floor(p.currentEn / 2);
      return { 
        ...p, 
        currentHP: p.maxHP,
        currentMP: p.maxMP,
        currentEn: newCurrentEn,
        buffs: { attackExpiresAtStep: 0, defenseExpiresAtStep: 0, speedExpiresAtStep: 0 }
      };
    });
    setGameState(GameState.TOWN);
    setSteps(0);
    setCurrentEnemy(null);
    addLog('這うようにして街へ逃げ帰った。HPが全回復し、手持ちの縁を半分失った…。');
  }, [addLog]);

  const explore = useCallback(() => {
    if (gameState !== GameState.TOWN && gameState !== GameState.EXPLORING) return;
    setGameState(GameState.EXPLORING);
    
    setSteps(s => {
      const newSteps = s + 1;
      const currentDepth = Math.floor(newSteps / 5);
      
      setPlayer(p => ({ ...p, maxReachedDepth: Math.max(p.maxReachedDepth || 0, currentDepth) }));
      
      if (currentDepth === 30 && newSteps % 5 === 0) {
        setGameState(GameState.ENCOUNTER);
        setCurrentEnemy({
          id: `boss_final`,
          name: t('gl_boss_name'),
          hp: 8000,
          attack: 180,
          defense: 90,
          isBoss: true
        });
        addLog(t('gl_boss_warn', { depth: currentDepth }));
        return newSteps;
      }

      if (Math.random() < 0.3) {
        setGameState(GameState.ENCOUNTER);
        
        // Quadratic scaling to make deeper floors brutally hard and bridge the gap to the boss
        const hp = Math.floor(10 + currentDepth * 15 + Math.pow(currentDepth, 2) * 1.5);
        const attack = Math.floor(5 + currentDepth * 2 + Math.pow(currentDepth, 2) * 0.1);
        const defense = Math.floor(2 + currentDepth * 1 + Math.pow(currentDepth, 2) * 0.05);
        
        setCurrentEnemy({
          id: `enemy_${Date.now()}`,
          name: currentDepth > 20 ? t('gl_mob_deep') : currentDepth > 10 ? t('gl_mob_mid') : t('gl_mob_shallow'),
          hp,
          attack,
          defense
        });
        addLog(`魔物と遭遇した！ (深度: ${currentDepth})`);
      } else {
        addLog(`探索を進めた。 (深度: ${currentDepth})`);
      }
      return newSteps;
    });
  }, [gameState, addLog]);

  const run = useCallback(() => {
    if (gameState !== GameState.ENCOUNTER || !currentEnemy) return;
    
    if (currentEnemy.isBoss) {
      addLog(t('gl_flee_fail_boss'));
      return;
    }

    if (Math.random() < 0.7) {
      setGameState(GameState.EXPLORING);
      setCurrentEnemy(null);
      addLog(t('gl_flee_success'));
    } else {
      addLog('逃走に失敗し、背後から致命傷を受けた！');
      handleWipeout();
    }
  }, [gameState, currentEnemy, addLog, handleWipeout]);

  const processVictory = useCallback((dmgTaken: number, expMult: number = 1) => {
    if (!currentEnemy) return;
    setPlayer(p => {
        let newInventory = [...p.inventory];
        const isInventoryFull = p.inventory.length >= p.maxInventorySize;
        let expGained = Math.floor((currentEnemy.hp * 2 + currentEnemy.attack * 5) * expMult);
        
        if (currentEnemy.isBoss) {
          addLog(t('gl_boss_defeat', { dmg: dmgTaken }));
          expGained = 9999;
          
          const finalMemory: MemoryItem = {
            id: 'mem_final_boss',
            isIdentified: true,
            category: 'Physical',
            rarity: 'Legendary',
            cost: 10,
            statModifiers: { attack: 300, defense: 300, speed: 300, maxHP: 500 },
            hasCurse: true,
            requiredUncurseItem: null,
            baseValue: 999999,
            flavorText: {
              itemName: t('gl_boss_item'),
              originText: t('gl_boss_item_origin'),
              priestMemo: '…まさか、これを本当に見つけるとはな。だが、お前が誰だったかを知って、どうなるというのだ？'
            }
          };
          
          if (!isInventoryFull) {
             newInventory.push(finalMemory);
             addLog(t('gl_boss_drop'));
          } else {
             addLog(t('gl_boss_drop_full'));
          }
        } else {
          addLog(t('gl_defeat', { name: currentEnemy.name, dmg: dmgTaken, exp: expGained }));
          if (!isInventoryFull) {
            newInventory.push(generateDropItem());
            addLog(t('gl_unidentified_drop'));
          } else {
            addLog(t('gl_inv_full_drop'));
          }
        }

        const hasFinalMemory = p.installedMemories.some(m => m.id === 'mem_final_boss');
        if (hasFinalMemory) {
          addLog(t('gl_curse_dmg'));
        }

        let newExp = p.currentEXP + expGained;
        let newLevel = p.level;
        let expNeeded = newLevel * 100;
        let leveledUp = false;
        
        while (newExp >= expNeeded) {
           newExp -= expNeeded;
           newLevel++;
           expNeeded = newLevel * 100;
           leveledUp = true;
        }
        
        if (leveledUp) {
          addLog(t('gl_levelup', { level: newLevel }));
        }

        return {
          ...p,
          inventory: newInventory,
          currentEXP: newExp,
          level: newLevel
        };
      });
      setGameState(GameState.COMBAT_RESULT);
  }, [currentEnemy, addLog, generateDropItem]);

  const fight = useCallback(() => {
    if (gameState !== GameState.ENCOUNTER || !currentEnemy) return;

    const playerAttack = calculatePlayerStat('attack');
    const playerDefense = calculatePlayerStat('defense');

    const damageToEnemy = Math.max(1, playerAttack - currentEnemy.defense);
    const damageToPlayer = Math.max(1, currentEnemy.attack - playerDefense);

    const hasFinalMemory = player.installedMemories.some(m => m.id === 'mem_final_boss');
    const curseDamagePerTurn = hasFinalMemory ? 50 : 0;

    let playerRemainingHP = player.currentHP;
    let enemyRemainingHP = currentEnemy.hp;
    
    while (playerRemainingHP > 0 && enemyRemainingHP > 0) {
      enemyRemainingHP -= damageToEnemy;
      if (enemyRemainingHP <= 0) break;
      
      playerRemainingHP -= damageToPlayer;
      playerRemainingHP -= curseDamagePerTurn;
    }

    if (playerRemainingHP > 0) {
      const damageTaken = player.currentHP - playerRemainingHP;
      
      // Fix: Update state using processVictory to avoid double setPlayer clashes causing bugs.
      setPlayer(p => {
        return { ...p, currentHP: playerRemainingHP };
      });
      
      // Ensure processVictory evaluates properly
      setTimeout(() => processVictory(damageTaken, 1), 0);
      
    } else {
      addLog(t('gl_dead', { name: currentEnemy.name }));
      handleWipeout();
    }
  }, [gameState, currentEnemy, player.currentHP, player.installedMemories, calculatePlayerStat, addLog, handleWipeout, processVictory]);

  const castSpell = useCallback((memoryId: string) => {
    if (gameState !== GameState.EXPLORING && gameState !== GameState.ENCOUNTER) return;
    
    setPlayer(p => {
      const memory = p.installedMemories.find(m => m.id === memoryId);
      if (!memory || !memory.attachedSpell) return p;
      
      const spell = memory.attachedSpell;
      const costAmount = memory.cost; // Memory Cost acts as scaling factor

      if (p.currentMP < spell.mpCost) {
        addLog(t('gl_no_mp'));
        return p;
      }

      let newP = { ...p, currentMP: p.currentMP - spell.mpCost };
      let msg = '';
      let combatDmgToEnemy = 0;
      let isReturn = false;
      
      const buffs = newP.buffs || { attackExpiresAtStep: 0, defenseExpiresAtStep: 0, speedExpiresAtStep: 0 };
      newP.buffs = { ...buffs };

      switch(spell.type) {
        case 'Heal': {
          const healAmount = costAmount * 50; 
          newP.currentHP = Math.min(newP.maxHP, newP.currentHP + healAmount);
          msg = `${spell.name}！ HPが ${healAmount} 回復した。`;
          break;
        }
        case 'AtkUp': {
          newP.buffs.attackExpiresAtStep = steps + (costAmount * 5); 
          msg = `${spell.name}！ 攻撃力が上昇した！（深度 ${(costAmount * 5)/5} 進むまで）`;
          break;
        }
        case 'DefUp': {
          newP.buffs.defenseExpiresAtStep = steps + (costAmount * 5);
          msg = `${spell.name}！ 防御力が上昇した！（深度 ${(costAmount * 5)/5} 進むまで）`;
          break;
        }
        case 'SpdUp': {
          newP.buffs.speedExpiresAtStep = steps + (costAmount * 5);
          msg = `${spell.name}！ 素早さが上昇した！（深度 ${(costAmount * 5)/5} 進むまで）`;
          break;
        }
        case 'Return': {
          isReturn = true;
          msg = `${spell.name}！ 縁を消費せずに街へ帰還する……。`;
          break;
        }
        case 'MagicAttack': {
          combatDmgToEnemy = costAmount * 50 + newP.level * 5;
          msg = `${spell.name}！ 敵に ${combatDmgToEnemy} の魔法大ダメージ！`;
          break;
        }
      }

      addLog(msg);

      if (isReturn) {
        setGameState(GameState.TOWN);
        setSteps(0);
        setCurrentEnemy(null);
        newP.buffs = { attackExpiresAtStep: 0, defenseExpiresAtStep: 0, speedExpiresAtStep: 0 };
        return newP;
      }

      if (combatDmgToEnemy > 0 && currentEnemy && gameState === GameState.ENCOUNTER) {
        const remainingEnemyHp = currentEnemy.hp - combatDmgToEnemy;
        if (remainingEnemyHp <= 0) {
           setTimeout(() => processVictory(0, 1), 0);
        } else {
           const pDef = calculatePlayerStat('defense');
           const dmgToPlayer = Math.max(1, currentEnemy.attack - pDef);
           newP.currentHP -= dmgToPlayer;
           addLog(`${currentEnemy.name} は耐え抜き、反撃してきた！ ${dmgToPlayer} のダメージ！`);
           if (newP.currentHP <= 0) {
             setTimeout(() => handleWipeout(), 0);
           } else {
             setCurrentEnemy({ ...currentEnemy, hp: remainingEnemyHp });
           }
        }
      }
      return newP;
    });
  }, [gameState, steps, currentEnemy, addLog, processVictory, handleWipeout, calculatePlayerStat]);

  const leaveTown = useCallback(() => {
    if (gameState === GameState.TOWN) {
      setGameState(GameState.EXPLORING);
      addLog(t('gl_dungeon_start'));
    }
  }, [gameState, addLog]);

  const returnToTown = useCallback(() => {
    if (gameState === GameState.EXPLORING) {
      const returnCost = depth * 100;
      setPlayer(p => {
        if (p.currentEn >= returnCost) {
          addLog(t('gl_return_paid', { cost: returnCost }));
          return { ...p, currentEn: p.currentEn - returnCost, buffs: { attackExpiresAtStep: 0, defenseExpiresAtStep: 0, speedExpiresAtStep: 0 } };
        } else {
          let newInventory = [...p.inventory];
          let itemsDestroyed = 0;
          
          while (itemsDestroyed < depth && newInventory.length > 0) {
            const randomIndex = Math.floor(Math.random() * newInventory.length);
            newInventory.splice(randomIndex, 1);
            itemsDestroyed++;
          }
          
          const shortfall = depth - itemsDestroyed;
          
          addLog(t('gl_karma_items', { count: itemsDestroyed }));
          
          let newMaxHP = p.maxHP;
          if (shortfall > 0) {
             const hpPenalty = shortfall * 5;
             newMaxHP = Math.max(1, p.maxHP - hpPenalty);
             addLog(`【業の強制取り立て】没収できる記憶が足りない…。破戒僧はお前の肉体に呪いを刻み、最大HPを ${hpPenalty} 減少させた！`);
          }
          addLog('「対価もなしに帰れると思ったか？ この世界は甘くないのだよ」');
          
          return { 
            ...p, 
            inventory: newInventory,
            maxHP: newMaxHP,
            currentHP: Math.min(p.currentHP, newMaxHP),
            currentEn: 0,
            buffs: { attackExpiresAtStep: 0, defenseExpiresAtStep: 0, speedExpiresAtStep: 0 }
          };
        }
      });
      setGameState(GameState.TOWN);
      setSteps(0);
    }
  }, [gameState, depth, addLog, setPlayer]);

  const continueFromCombat = useCallback(() => {
    if (gameState === GameState.COMBAT_RESULT) {
      setGameState(GameState.EXPLORING);
      setCurrentEnemy(null);
      addLog(t('gl_continue'));
    }
  }, [gameState, addLog]);

  return {
    player,
    setPlayer,
    setGameState,
    gameState,
    currentEnemy,
    logMessages,
    shopInventory,
    setShopInventory,
    depth,
    steps,
    setSteps,
    actions: {
      explore,
      run,
      fight,
      leaveTown,
      returnToTown,
      continueFromCombat,
      castSpell,
      addLog
    }
  };
};
