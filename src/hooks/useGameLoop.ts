import { useI18n } from '../contexts/I18nContext';
import { ja } from '../locales/ja';
import { en } from '../locales/en';
import { getBaseStats } from '../utils/statCalculator';
import { calculateDamage, calculateFleeChance } from '../utils/combatCalculator';
import { playHitSound, playCriticalSound, playEvadeSound } from '../utils/audio';
import { useState, useCallback, useEffect } from 'react';
import type { Player, MemoryItem, MemoryCategory, Rarity, SpellType, Spell, MemoryTemplate } from '../types/game';
import memoryMasterData from '../data/memoryMaster.json';

const memoryMaster = memoryMasterData as unknown as Record<string, Omit<MemoryTemplate, 'category' | 'baseValue'>[]>;

export enum GameState {
  TOWN = 'TOWN',
  EXPLORING = 'EXPLORING',
  ENCOUNTER = 'ENCOUNTER',
  COMBAT_RESULT = 'COMBAT_RESULT'
}

export interface LogEntry { key: string; params?: Record<string, string | number>; }

export interface Enemy {
  id: string;
  name: string;
  hp: number;
  maxHp: number;
  attack: number;
  defense: number;
  isBoss?: boolean;
}

export const useGameLoop = (initialPlayer: Player) => {
  const { t } = useI18n();
  const [player, setPlayer] = useState<Player>(initialPlayer);
  const [gameState, setGameState] = useState<GameState>(GameState.TOWN);
  const [currentEnemy, setCurrentEnemy] = useState<Enemy | null>(null);
  const [logMessages, setLogMessages] = useState<(string | LogEntry)[]>([{ key: 'gl_town_stay' }]);
  const [shopInventory, setShopInventory] = useState<MemoryItem[]>([]);
  const [steps, setSteps] = useState<number>(0);
  const [shakeTrigger, setShakeTrigger] = useState<number>(0);

  const triggerShake = useCallback(() => setShakeTrigger(prev => prev + 1), []);

  const depth = Math.floor(steps / 5);

  useEffect(() => {
    const timer = setInterval(() => {
      setPlayer(p => ({ ...p, playTimeSeconds: p.playTimeSeconds + 1 }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const addLog = useCallback((msg: string | LogEntry) => {
    setLogMessages(prev => [...prev, msg]);
  }, []);

  const calculatePlayerStat = useCallback((statName: 'attack' | 'defense' | 'speed'): number => {
    let total = getBaseStats(player.level)[statName];
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
    addLog({ key: 'gl_wipeout' });
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
          maxHp: 8000,
          attack: 180,
          defense: 90,
          isBoss: true
        });
        addLog({ key: 'gl_boss_warn', params: { depth: currentDepth } });
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
          maxHp: hp,
          attack,
          defense
        });
        addLog({ key: 'gl_encounter', params: { depth: currentDepth } });
      } else {
        addLog({ key: 'gl_explore_more', params: { depth: currentDepth } });
      }
      return newSteps;
    });
  }, [gameState, addLog]);

  const run = useCallback(() => {
    if (gameState !== GameState.ENCOUNTER || !currentEnemy) return;
    
    if (currentEnemy.isBoss) {
      addLog({ key: 'gl_flee_fail_boss' });
      return;
    }

    const pSpeed = calculatePlayerStat('speed');
    const baseSpeed = getBaseStats(player.level).speed;
    const escapeRate = calculateFleeChance(pSpeed, baseSpeed);
    
    if (Math.random() < escapeRate) {
      setGameState(GameState.EXPLORING);
      setCurrentEnemy(null);
      addLog({ key: 'gl_flee_success' });
    } else {
      addLog({ key: 'gl_flee_fail' });
      handleWipeout();
    }
  }, [gameState, currentEnemy, addLog, handleWipeout, calculatePlayerStat, player.level]);

  const processVictory = useCallback((dmgTaken: number, expMult: number = 1) => {
    if (!currentEnemy) return;
    setPlayer(p => {
        let newInventory = [...p.inventory];
        const isInventoryFull = p.inventory.length >= p.maxInventorySize;
        let expGained = Math.floor((currentEnemy.hp * 2 + currentEnemy.attack * 5) * expMult);
        
        if (currentEnemy.isBoss) {
          addLog({ key: 'gl_boss_defeat', params: { dmg: dmgTaken } });
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
              itemName: ja.gl_boss_item,
              originText: ja.gl_boss_item_origin,
              priestMemo: ja.gl_boss_item_priest,
              itemNameEn: en.gl_boss_item,
              originTextEn: en.gl_boss_item_origin,
              priestMemoEn: en.gl_boss_item_priest
            }
          };
          
          if (!isInventoryFull) {
             newInventory.push(finalMemory);
             addLog({ key: 'gl_boss_drop' });
          } else {
             addLog({ key: 'gl_boss_drop_full' });
          }
        } else {
          addLog({ key: 'gl_defeat', params: { name: currentEnemy.name, dmg: dmgTaken, exp: expGained } });
          if (!isInventoryFull) {
            newInventory.push(generateDropItem());
            addLog({ key: 'gl_unidentified_drop' });
          } else {
            addLog({ key: 'gl_inv_full_drop' });
          }
        }

        const hasFinalMemory = p.installedMemories.some(m => m.id === 'mem_final_boss');
        if (hasFinalMemory) {
          addLog({ key: 'gl_curse_dmg' });
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
          addLog({ key: 'gl_levelup', params: { level: newLevel } });
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
    const playerSpeed = calculatePlayerStat('speed');

    const pEntity = { attack: playerAttack, defense: playerDefense, speed: playerSpeed, hp: player.currentHP };
    const eEntity = { attack: currentEnemy.attack, defense: currentEnemy.defense, speed: 0, hp: currentEnemy.hp };

    const pDmgResult = calculateDamage(pEntity, eEntity);
    const eDmgResult = calculateDamage(eEntity, pEntity);

    const hasFinalMemory = player.installedMemories.some(m => m.id === 'mem_final_boss');
    const curseDamagePerTurn = hasFinalMemory ? 50 : 0;

    const enemyRemainingHP = pDmgResult.remainingHp;
    if (pDmgResult.isCritical) {
      triggerShake();
      playCriticalSound();
      addLog({ key: 'gl_critical_hit', params: { dmg: pDmgResult.damage } });
    } else {
      playHitSound();
    }
    addLog({ key: 'gl_combat_player_atk', params: { name: currentEnemy.name, dmg: pDmgResult.damage } });

    if (enemyRemainingHP <= 0) {
      setTimeout(() => processVictory(0, 1), 0);
      return;
    }

    let playerRemainingHP = eDmgResult.remainingHp;
    
    // 敵からの攻撃はisCritical判定はないがログを統一（将来的に敵クリティカルもあり得る）
    if (eDmgResult.isEvaded) {
      playEvadeSound();
      addLog({ key: 'gl_combat_evade', params: { name: currentEnemy.name } });
    } else {
      if (eDmgResult.isCritical) {
        triggerShake();
        playCriticalSound();
        addLog({ key: 'gl_critical_hit', params: { dmg: eDmgResult.damage } });
      } else {
        triggerShake();
        playHitSound();
      }
      addLog({ key: 'gl_combat_enemy_atk', params: { name: currentEnemy.name, dmg: eDmgResult.damage } });
    }

    if (curseDamagePerTurn > 0) {
      playerRemainingHP -= curseDamagePerTurn;
      addLog({ key: 'gl_curse_dmg' });
    }

    if (playerRemainingHP <= 0) {
      addLog({ key: 'gl_dead', params: { name: currentEnemy.name } });
      handleWipeout();
      return;
    }

    setPlayer(p => ({ ...p, currentHP: playerRemainingHP }));
    setCurrentEnemy({ ...currentEnemy, hp: enemyRemainingHP });
  }, [gameState, currentEnemy, player.currentHP, player.installedMemories, calculatePlayerStat, addLog, handleWipeout, processVictory, triggerShake]);

  const castSpell = useCallback((memoryId: string) => {
    if (gameState !== GameState.EXPLORING && gameState !== GameState.ENCOUNTER) return;
    
    setPlayer(p => {
      const memory = p.installedMemories.find(m => m.id === memoryId);
      if (!memory || !memory.attachedSpell) return p;
      
      const spell = memory.attachedSpell;
      const costAmount = memory.cost; // Memory Cost acts as scaling factor

      if (p.currentMP < spell.mpCost) {
        addLog({ key: 'gl_no_mp' });
        return p;
      }

      let newP = { ...p, currentMP: p.currentMP - spell.mpCost };
      let msg: string | LogEntry = '';
      let combatDmgToEnemy = 0;
      let isReturn = false;
      
      const buffs = newP.buffs || { attackExpiresAtStep: 0, defenseExpiresAtStep: 0, speedExpiresAtStep: 0 };
      newP.buffs = { ...buffs };

      switch(spell.type) {
        case 'Heal': {
          const healAmount = costAmount * 50; 
          newP.currentHP = Math.min(newP.maxHP, newP.currentHP + healAmount);
          msg = { key: 'gl_magic_heal', params: { name: spell.name, heal: healAmount } };
          break;
        }
        case 'AtkUp': {
          newP.buffs.attackExpiresAtStep = steps + (costAmount * 5); 
          msg = { key: 'gl_magic_atkup', params: { name: spell.name, dur: (costAmount * 5)/5 } };
          break;
        }
        case 'DefUp': {
          newP.buffs.defenseExpiresAtStep = steps + (costAmount * 5);
          msg = { key: 'gl_magic_defup', params: { name: spell.name, dur: (costAmount * 5)/5 } };
          break;
        }
        case 'SpdUp': {
          newP.buffs.speedExpiresAtStep = steps + (costAmount * 5);
          msg = { key: 'gl_magic_spdup', params: { name: spell.name, dur: (costAmount * 5)/5 } };
          break;
        }
        case 'Return': {
          isReturn = true;
          msg = { key: 'gl_magic_return', params: { name: spell.name } };
          break;
        }
        case 'MagicAttack': {
          combatDmgToEnemy = costAmount * 50 + newP.level * 5;
          msg = { key: 'gl_magic_atk', params: { name: spell.name, dmg: combatDmgToEnemy } };
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
           addLog({ key: 'gl_magic_rebound', params: { name: currentEnemy.name, dmg: dmgToPlayer } });
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
      addLog({ key: 'gl_dungeon_start' });
    }
  }, [gameState, addLog]);

  const returnToTown = useCallback(() => {
    if (gameState === GameState.EXPLORING) {
      const returnCost = depth * 100;
      setPlayer(p => {
        if (p.currentEn >= returnCost) {
          addLog({ key: 'gl_return_paid', params: { cost: returnCost } });
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
          
          addLog({ key: 'gl_karma_items', params: { count: itemsDestroyed } });
          
          let newMaxHP = p.maxHP;
          if (shortfall > 0) {
             const hpPenalty = shortfall * 5;
             newMaxHP = Math.max(1, p.maxHP - hpPenalty);
             addLog({ key: 'gl_karma_hp', params: { penalty: hpPenalty } });
          }
          addLog({ key: 'gl_karma_msg' });
          
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
      addLog({ key: 'gl_continue' });
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
    shakeTrigger,
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
