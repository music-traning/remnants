import React, { useState, useEffect, useRef, useMemo } from 'react';
import { initialInventory } from './data/mockData';
import type { Player, MemoryItem } from './types/game';
import { useGameLoop, GameState } from './hooks/useGameLoop';
import { useEconomy } from './hooks/useEconomy';
import { useMemoryManagement } from './hooks/useMemoryManagement';
import { recalculateStats } from './utils/statCalculator';
import { InventoryView } from './components/InventoryView';
import { saveGame, loadGame, deleteGame, getSaveList, type SaveData } from './utils/saveManager';
import './index.css';
import { useI18n } from './contexts/I18nContext';
import { Header } from './components/Header';
import { ManualModal } from './components/ManualModal';


const initialPlayer: Player = {
  level: 1,
  currentEXP: 0,
  maxHP: 500,
  currentHP: 500,
  maxMP: 50,
  currentMP: 50,
  totalCapacity: 10,
  maxSlots: 3,
  maxInventorySize: 30,
  currentEn: 1000,
  stashedEn: 0,
  installedMemories: [],
  inventory: initialInventory,
  buffs: {
    attackExpiresAtStep: 0,
    defenseExpiresAtStep: 0,
    speedExpiresAtStep: 0
  },
  playTimeSeconds: 0,
  maxReachedDepth: 0,
  totalDives: 0
};

const DungeonSVG: React.FC<{ seed: number }> = ({ seed }) => {
  const isAlt = seed > 0.4;
  const isJunction = seed > 0.7;
  return (
    <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" style={{ backgroundColor: '#000' }}>
      <rect x="0" y="0" width="100" height="100" fill="black" stroke="white" strokeWidth="1" />
      <line x1="0" y1="0" x2="30" y2="30" stroke="white" strokeWidth="1" />
      <line x1="100" y1="0" x2="70" y2="30" stroke="white" strokeWidth="1" />
      <line x1="0" y1="100" x2="30" y2="70" stroke="white" strokeWidth="1" />
      <line x1="100" y1="100" x2="70" y2="70" stroke="white" strokeWidth="1" />
      <rect x="30" y="30" width="40" height="40" fill="black" stroke="white" strokeWidth="1" />
      {isAlt && (
        <>
          <line x1="30" y1="30" x2="40" y2="40" stroke="white" strokeWidth="1" />
          <line x1="70" y1="30" x2="60" y2="40" stroke="white" strokeWidth="1" />
          <line x1="30" y1="70" x2="40" y2="60" stroke="white" strokeWidth="1" />
          <line x1="70" y1="70" x2="60" y2="60" stroke="white" strokeWidth="1" />
          <rect x="40" y="40" width="20" height="20" fill="black" stroke="white" strokeWidth="1" />
        </>
      )}
      {isJunction && <rect x="45" y="45" width="10" height="15" fill="black" stroke="white" strokeWidth="1" />}
    </svg>
  );
};


const formatTime = (secs: number) => {
  const h = Math.floor(secs / 3600);
  const m = Math.floor((secs % 3600) / 60);
  const s = secs % 60;
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
};

function App() {
  const { t, language } = useI18n();
  const [isManualOpen, setIsManualOpen] = useState(false);

  const { player, setPlayer, setGameState, gameState, currentEnemy, logMessages, shopInventory, setShopInventory, depth, setSteps, actions } = useGameLoop(initialPlayer);
  const ecoActions = useEconomy(player, setPlayer, gameState, shopInventory, setShopInventory).actions;

  const baseStats = useMemo(() => ({
    maxHP: 500,
    maxMP: 50,
    attack: 10 + player.level * 2,
    defense: 5 + player.level,
    speed: 10 + player.level
  }), [player.level]);

  const memoryActions = useMemoryManagement(player, setPlayer, baseStats).actions;
  const { calculatedStats } = recalculateStats(player, baseStats);

  const [activeOverlay, setActiveOverlay] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<MemoryItem | null>(null);
  const [stashAmount, setStashAmount] = useState<number>(100);
  const [saveList, setSaveList] = useState<(SaveData | null)[]>([]);
  
  const dungeonSeed = useMemo(() => Math.random(), [logMessages.length]);
  const logEndRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logMessages]);

  const handleSell = (mem: MemoryItem) => {
    const res = ecoActions.sellMemory(mem.id);
    actions.addLog(res.message);
    if (res.success) setSelectedItem(null);
  };

  const handleBuyBack = (mem: MemoryItem) => {
    const res = ecoActions.buyBackMemory(mem.id);
    actions.addLog(res.message);
    if (res.success) setSelectedItem(null);
  };

  const openOverlay = (menu: string) => {
    if (menu === 'system') {
      setSaveList(getSaveList());
    }
    setActiveOverlay(menu);
    setSelectedItem(null);
  };

  const handleEnterDungeon = (startDepth: number) => {
    const newDives = (player.totalDives || 0) + 1;
    setPlayer(p => ({ ...p, totalDives: newDives }));
    setShopInventory(prev => prev.filter(m => (newDives - (m.soldAtDiveCount || 0)) < 3));
    setSteps(startDepth * 5);
    setGameState(GameState.EXPLORING);
    setActiveOverlay(null);
    actions.addLog(t('dung_from', { depth: startDepth }));
  };

  const currentCost = player.installedMemories.reduce((acc, mem) => acc + mem.cost, 0);
  const inventoryCount = player.inventory.length;
  const nextExpNeeded = player.level * 100;

  return (
    <div style={{ padding: '16px', width: '100%', maxWidth: '100%', margin: '0', height: '100vh', boxSizing: 'border-box', display: 'flex', flexDirection: 'column' }}>
      <Header onOpenManual={() => setIsManualOpen(true)} />
        <ManualModal isOpen={isManualOpen} onClose={() => setIsManualOpen(false)} />
      
      <div className="crpg-container">
        
        {/* 1. Main Viewport */}
        <div className="pane main-viewport">
          {activeOverlay ? (
            <div className="overlay" style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed #fff', paddingBottom: '8px', marginBottom: '16px' }}>
                <h2 style={{ margin: 0 }}>{activeOverlay}</h2>
                <button className="cmd-btn" onClick={() => setActiveOverlay(null)} style={{ color: '#0f0', width: 'auto' }}>
                  [ {t('sys_close')} ]
                </button>
              </div>

              {activeOverlay === 'system' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', overflowY: 'auto' }}>
                  {saveList.map((save, i) => (
                    <div key={i} style={{ border: '1px solid #555', padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <h3 style={{ margin: '0 0 8px 0', color: '#0f0' }}>SLOT {i + 1}</h3>
                        {save ? (
                          <div style={{ fontSize: '0.9rem', color: '#ccc' }}>
                            {t('sys_lvl', { lvl: save.player.level })} | En: {save.player.currentEn} | HP: {save.player.currentHP}/{save.player.maxHP}<br/>
                            {t('sys_max_depth', { depth: save.player.maxReachedDepth })} | {t('sys_playtime', { time: formatTime(save.player.playTimeSeconds) })}<br/>
                            {new Date(save.timestamp).toLocaleString()}
                          </div>
                        ) : (
                          <div style={{ color: '#555' }}>{t('sys_no_data')}</div>
                        )}
                      </div>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button className="cmd-btn" style={{ width: 'auto', padding: '4px 12px' }} onClick={() => {
                          if (window.confirm(`${t('sys_confirm_save', { slot: i + 1 })}`)) {
                            saveGame(i + 1, player, shopInventory);
                            setSaveList(getSaveList());
                            actions.addLog(t('sys_saved', { slot: i + 1 }));
                          }
                        }}>{t('sys_save')}</button>
                        
                        {save && (
                          <>
                            <button className="cmd-btn" style={{ width: 'auto', padding: '4px 12px', borderColor: '#0f0', color: '#0f0' }} onClick={() => {
                              if (window.confirm(t('sys_confirm_load', { slot: i + 1 }))) {
                                const data = loadGame(i + 1);
                                if (data) {
                                  // Backwards compatibility check in case old save data format was just returning player implicitly
                                  const p = data.player || data;
                                  setPlayer(p);
                                  setShopInventory(data.shopInventory || []);
                                  setActiveOverlay(null);
                                  actions.addLog(t('sys_loaded', { slot: i + 1 }));
                                }
                              }
                            }}>{t('sys_load')}</button>
                            <button className="cmd-btn" style={{ width: 'auto', padding: '4px 12px', borderColor: '#f00', color: '#f00' }} onClick={() => {
                              if (window.confirm(t('sys_confirm_erase', { slot: i + 1 }))) {
                                deleteGame(i + 1);
                                setSaveList(getSaveList());
                                actions.addLog(t('sys_erased', { slot: i + 1 }));
                              }
                            }}>{t('sys_erase')}</button>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeOverlay === 'status' && (
                <div style={{ flex: 1, overflowY: 'auto' }}>
                  <div style={{ display: 'flex', gap: '32px', marginBottom: '24px' }}>
                    <div>
                      <h3 style={{ color: '#0f0', margin: '0 0 8px 0' }}>{t('status_title')}</h3>
                      <p style={{ margin: '4px 0' }}>Level: {player.level}</p>
                      <p style={{ margin: '4px 0' }}>{t('exp')}: {player.currentEXP} / {nextExpNeeded}</p>
                      <p style={{ margin: '4px 0' }}>{t('hp')}: {player.currentHP} / {player.maxHP}</p>
                      <p style={{ margin: '4px 0' }}>{t('mp')}: {player.currentMP} / {player.maxMP}</p>
                      <p style={{ margin: '4px 0' }}>{t('en')}: {player.currentEn}</p>
                      <p style={{ margin: '4px 0' }}>Capacity: {currentCost} / {player.totalCapacity}</p>
                      <p style={{ margin: '4px 0' }}>Slots: {player.installedMemories.length} / {player.maxSlots}</p>
                    </div>
                    <div>
                      <h3 style={{ color: '#0f0', margin: '0 0 8px 0' }}>COMBAT STATS</h3>
                      <p style={{ margin: '4px 0' }}>ATK: {calculatedStats.attack}</p>
                      <p style={{ margin: '4px 0' }}>DEF: {calculatedStats.defense}</p>
                      <p style={{ margin: '4px 0' }}>SPD: {calculatedStats.speed}</p>
                    </div>
                  </div>
                  
                  <h3 style={{ color: '#0f0', margin: '0 0 8px 0', borderBottom: '1px solid #aaa' }}>INSTALLED MEMORIES</h3>
                  {player.installedMemories.length === 0 ? <p>{t('stat_no_equip')}</p> : (
                    <InventoryView 
                      items={player.installedMemories} 
                      selectedItem={selectedItem} 
                      onSelect={setSelectedItem}
                      actionButton={(mem) => (
                        <button className="cmd-btn" style={{ borderColor: '#f00', color: '#f00' }} onClick={() => {
                          const res = memoryActions.uninstallMemory(mem.id);
                          actions.addLog(res.message);
                          if (res.success) setSelectedItem(null);
                        }}>
                          [ {t('stat_unequip')} ]
                        </button>
                      )}
                    />
                  )}
                </div>
              )}

              {activeOverlay === 'inventory' && (
                <InventoryView 
                  items={player.inventory.filter(m => m.isIdentified)} 
                  selectedItem={selectedItem} 
                  onSelect={setSelectedItem}
                  actionButton={(mem) => {
                    const reqLevel = mem.cost * 2;
                    const canEquip = player.level >= reqLevel;
                    return (
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button 
                          className="cmd-btn" 
                          disabled={!canEquip}
                          style={{ borderColor: canEquip ? '#0f0' : '#777', color: canEquip ? '#0f0' : '#777', width: 'auto' }} 
                          onClick={() => {
                            const res = memoryActions.installMemory(mem.id);
                            actions.addLog(res.message);
                            if (res.success) setSelectedItem(null);
                          }}
                        >
                          [ {t('inv_equip', { cost: mem.cost, reqLevel })} ]
                        </button>
                        <button className="cmd-btn" style={{ borderColor: '#888', color: '#888', width: 'auto' }} onClick={() => {
                          const res = memoryActions.discardMemory(mem.id);
                          actions.addLog(res.message);
                          if (res.success) setSelectedItem(null);
                        }}>
                          [ {t('inv_discard')} ]
                        </button>
                      </div>
                    );
                  }}
                />
              )}

              {activeOverlay === 'priest' && (
                <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                  <div style={{ marginBottom: '16px', display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    <button 
                      className="cmd-btn" 
                      style={{ width: 'auto', borderColor: player.totalCapacity >= 30 ? '#555' : '#fff', color: player.totalCapacity >= 30 ? '#555' : '#fff' }} 
                      disabled={player.totalCapacity >= 30}
                      onClick={() => {
                        const res = memoryActions.trainCapacity();
                        actions.addLog(res.message);
                      }}
                    >
                      {t('priest_expand_cap')}
                    </button>
                    <button 
                      className="cmd-btn" 
                      style={{ width: 'auto', borderColor: player.maxSlots >= 6 ? '#555' : '#fff', color: player.maxSlots >= 6 ? '#555' : '#fff' }} 
                      disabled={player.maxSlots >= 6}
                      onClick={() => {
                        const res = memoryActions.trainSlots();
                        actions.addLog(res.message);
                      }}
                    >
                      {t('priest_expand_slot')}
                    </button>
                  </div>

                  {player.installedMemories.filter(m => m.hasCurse).length > 0 && (
                    <div style={{ border: '1px solid #f00', padding: '8px', marginBottom: '16px' }}>
                      <h3 style={{ color: '#f00', margin: '0 0 8px 0', fontSize: '1rem' }}>{t('priest_cursed_equip')}</h3>
                      {player.installedMemories.filter(m => m.hasCurse).map(mem => (
                        <div key={mem.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                          <span>{mem.attachedSpell ? '☁ ' : ''}{language === 'en' ? (mem.flavorText?.itemNameEn || mem.flavorText?.itemName) : mem.flavorText?.itemName} (Cost: {mem.cost})</span>
                          <button className="cmd-btn" style={{ width: 'auto', padding: '2px 8px', color: '#f00', borderColor: '#f00' }} onClick={() => {
                            const res = memoryActions.uncurseMemory(mem.id);
                            actions.addLog(res.message);
                          }}>[ {t('priest_uncurse', { cost: mem.cost * 1000 })} ]</button>
                        </div>
                      ))}
                    </div>
                  )}

                  <div style={{ flex: 1 }}>
                    <h3 style={{ color: '#0f0', margin: '0 0 8px 0', fontSize: '1rem' }}>{t('priest_unidentified')}</h3>
                    <InventoryView 
                      items={player.inventory.filter(m => !m.isIdentified)} 
                      selectedItem={selectedItem} 
                      onSelect={setSelectedItem}
                      inlineAction={(mem) => {
                        const cost = mem.cost * 25;
                        const canAfford = player.currentEn >= cost;
                        return (
                          <div style={{ marginLeft: '8px', display: 'flex', alignItems: 'center' }}>
                            <span style={{ color: '#aaa', marginRight: '8px', fontSize: '0.9rem' }}>{cost} En</span>
                            <button 
                              className="cmd-btn"
                              style={{ 
                                padding: '2px 8px', 
                                width: 'auto', 
                                fontSize: '0.8rem',
                                borderColor: canAfford ? '#0f0' : '#555',
                                color: canAfford ? '#0f0' : '#555'
                              }}
                              onClick={(e) => {
                                e.stopPropagation();
                                if (!canAfford) return;
                                const res = memoryActions.identifyMemory(mem.id);
                                actions.addLog(res.message);
                                if (res.success) setSelectedItem(null);
                              }}
                            >{t('priest_identify').split(' ')[0]}</button>
                          </div>
                        )
                      }}
                      actionButton={(mem) => {
                        const cost = mem.cost * 25;
                        const canAfford = player.currentEn >= cost;
                        return (
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <button 
                              className="cmd-btn" 
                              disabled={!canAfford}
                              style={{ 
                                borderColor: canAfford ? '#0f0' : '#555', 
                                color: canAfford ? '#0f0' : '#555', 
                                width: 'auto',
                                cursor: canAfford ? 'pointer' : 'not-allowed'
                              }} 
                              onClick={() => {
                                if (!canAfford) return;
                                const res = memoryActions.identifyMemory(mem.id);
                                actions.addLog(res.message);
                                if (res.success) setSelectedItem(null);
                              }}
                            >
                              [ {t('priest_identify', { cost })} ]
                            </button>
                            <button className="cmd-btn" style={{ borderColor: '#888', color: '#888', width: 'auto' }} onClick={() => {
                              const res = memoryActions.discardMemory(mem.id);
                              actions.addLog(res.message);
                              if (res.success) setSelectedItem(null);
                            }}>
                              [ {t('inv_discard')} ]
                            </button>
                          </div>
                        );
                      }}
                    />
                  </div>
                </div>
              )}

              {activeOverlay === 'enma' && (() => {
                const getExpandCost = (size: number) => {
                  if (size === 30) return 5000;
                  if (size === 35) return 20000;
                  if (size === 40) return 50000;
                  if (size === 45) return 100000;
                  return null;
                };
                const expandCost = getExpandCost(player.maxInventorySize);

                return (
                  <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                    <div style={{ marginBottom: '16px', display: 'flex', gap: '16px' }}>
                      <button 
                        className="cmd-btn" 
                        style={{ width: 'auto', borderColor: expandCost === null ? '#555' : '#fff', color: expandCost === null ? '#555' : '#fff' }} 
                        disabled={expandCost === null}
                        onClick={() => {
                          const res = ecoActions.expandInventory();
                          actions.addLog(res.message);
                        }}
                      >
                        {expandCost === null ? t('enma_stash_max') : t('enma_stash_expand', { cost: expandCost })}
                      </button>
                    </div>
                    <div style={{ flex: 1 }}>
                      <InventoryView 
                        items={player.inventory} 
                        selectedItem={selectedItem} 
                        onSelect={setSelectedItem}
                        inlineAction={(mem) => {
                          const sellPrice = Math.floor(Math.pow(mem.cost, 2.5) * 150 + mem.cost * 500);
                          return (
                            <button className="cmd-btn" style={{ borderColor: '#f00', color: '#f00', width: 'auto', padding: '2px 8px', fontSize: '0.8rem', marginLeft: '8px' }} onClick={(e) => { e.stopPropagation(); handleSell(mem); }}>
                              {t('btn_sell', { price: sellPrice })}
                            </button>
                          );
                        }}
                      />
                    </div>
                  </div>
                );
              })()}

              {activeOverlay === 'buyback' && (
                <InventoryView 
                  items={shopInventory} 
                  selectedItem={selectedItem} 
                  onSelect={setSelectedItem}
                  inlineAction={(mem) => {
                    const basePrice = Math.floor(Math.pow(mem.cost, 2.5) * 150 + mem.cost * 500);
                    const cost = Math.floor(basePrice * 1.5);
                    const canAfford = player.currentEn >= cost;
                    const divesLeft = 3 - ((player.totalDives || 0) - (mem.soldAtDiveCount || 0));
                    return (
                      <div style={{ marginLeft: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '0.75rem', color: '#aaa' }}>{t('buyback_left', { dives: divesLeft })}</span>
                        <button className="cmd-btn" disabled={!canAfford} style={{ borderColor: canAfford ? '#0f0' : '#555', color: canAfford ? '#0f0' : '#555', width: 'auto', padding: '2px 8px', fontSize: '0.8rem' }} onClick={(e) => { e.stopPropagation(); if(canAfford) handleBuyBack(mem); }}>
                          {t('btn_buyback_act', { price: cost })}
                        </button>
                      </div>
                    );
                  }}
                />
              )}

              {activeOverlay === 'inn' && (
                <div>
                  <h3 style={{ color: '#0f0' }}>{t('inn_title')}</h3>
                  <p>{t('inn_desc1')}</p>
                  <p>{t('inn_hp', { hp: player.currentHP, maxHp: player.maxHP })}</p>
                  <p>{t('inn_mp', { mp: player.currentMP, maxMp: player.maxMP })}</p>
                  <button className="cmd-btn" style={{ width: 'auto', borderColor: '#0f0', color: '#0f0' }} onClick={() => {
                    const res = ecoActions.restAtInn();
                    actions.addLog(res.message);
                  }}>
                    [ {t('inn_rest', { cost: Math.floor(player.maxHP * 0.1 + player.maxMP * 0.5) })} ]
                  </button>
                </div>
              )}
              
              {activeOverlay === 'magic' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <h3 style={{ color: '#0f0', margin: '0 0 16px 0' }}>{t('mag_title')}</h3>
                  {player.installedMemories.filter(m => m.attachedSpell).map(mem => {
                    const spell = mem.attachedSpell!;
                    return (
                      <button key={mem.id} className="cmd-btn" style={{ width: 'auto' }} onClick={() => {
                        actions.castSpell(mem.id);
                        setActiveOverlay(null);
                      }}>
                        ▶ {spell.name} ({spell.mpCost} MP) - {t('mag_effect', { cost: mem.cost })}
                      </button>
                    )
                  })}
                  {player.installedMemories.filter(m => m.attachedSpell).length === 0 && (
                    <p style={{ color: '#aaa' }}>{t('mag_no_magic')}</p>
                  )}
                </div>
              )}
              
              
              {activeOverlay === 'dungeon' && (() => {
                const maxDepth = player.maxReachedDepth || 0;
                const maxCheckpoint = Math.floor(maxDepth / 5) * 5;
                const checkpoints = [];
                for (let d = 0; d <= maxCheckpoint; d += 5) {
                  checkpoints.push(d);
                }
                return (
                  <div>
                    <h3 style={{ color: '#0f0', margin: '0 0 16px 0' }}>{t('dung_title')}</h3>
                    <p style={{ marginBottom: '16px' }}>{t('dungeon_select')}</p>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '8px' }}>
                      {checkpoints.map(d => (
                        <button key={d} className="cmd-btn" onClick={() => handleEnterDungeon(d)}>
                          {t('dung_from', { depth: d })}
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })()}

              {activeOverlay === 'stash' && (
                <div>
                  <div style={{ fontSize: '1.2rem', marginBottom: '24px' }}>
                    <p>{t('stash_hand')} <span className="text-green">{player.currentEn} En</span></p>
                    <p>{t('stash_vault')} <span className="text-green">{player.stashedEn} En</span></p>
                  </div>
                  
                  <div style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span>{t('stash_amount')}</span>
                    <input 
                      type="number" 
                      value={stashAmount} 
                      onChange={e => setStashAmount(Number(e.target.value))} 
                      style={{ background: '#000', color: '#fff', border: '1px solid #fff', padding: '8px', fontSize: '1rem', width: '150px' }}
                      min="1"
                    />
                    <span>En</span>
                  </div>

                  <div style={{ display: 'flex', gap: '16px' }}>
                    <button className="cmd-btn" style={{ width: 'auto', border: '1px solid #fff' }} onClick={() => {
                      const res = ecoActions.depositEn(stashAmount);
                      actions.addLog(res.message);
                    }}>{t('stash_deposit')}</button>
                    
                    <button className="cmd-btn" style={{ width: 'auto', border: '1px solid #fff' }} onClick={() => {
                      const res = ecoActions.withdrawEn(stashAmount);
                      actions.addLog(res.message);
                    }}>{t('stash_withdraw')}</button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div style={{ width: '100%', height: '100%', position: 'relative' }}>
              {gameState === GameState.TOWN && (
                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <h2 style={{ fontSize: '3rem', letterSpacing: '4px' }}>TOWN</h2>
                </div>
              )}
              {gameState !== GameState.TOWN && <DungeonSVG seed={dungeonSeed} />}
              {gameState === GameState.ENCOUNTER && currentEnemy && (
                <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', background: '#000', padding: '16px', border: '2px solid #f00', textAlign: 'center' }}>
                  <h2 className="text-red" style={{ margin: 0 }}>{currentEnemy.name}</h2>
                  <p style={{ margin: '8px 0 0 0' }}>{t('ui_stands')}</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* 2. Status Pane */}
        <div className="pane status-pane">
          <h3 style={{ margin: '0 0 16px 0', borderBottom: '1px solid #aaa', paddingBottom: '8px' }}>{t('status_title')}</h3>
          <div className="status-grid">
            <div>{t('level')}: {player.level}</div>
            <div style={{ fontSize: '0.8rem', color: '#ccc' }}>{t('exp')}: {player.currentEXP} / {nextExpNeeded}</div>
            <div>{t('hp')}: {player.currentHP} / {player.maxHP}</div>
            <div>{t('mp')}: {player.currentMP} / {player.maxMP}</div>
            <div className="text-green">{t('en')}: {player.currentEn}</div>
            <div style={{ color: inventoryCount >= player.maxInventorySize ? '#f00' : '#fff' }}>
              ITEM: {inventoryCount} / {player.maxInventorySize}
            </div>
            <div>{t('cost')}: {currentCost} / {player.totalCapacity}</div>
          </div>
        </div>

        {/* 3. Command Menu */}
        <div className="pane command-menu">
          <h3 style={{ margin: '0 0 16px 0', borderBottom: '1px solid #aaa', paddingBottom: '8px' }}>{t('command_title')}</h3>
          <div className="cmd-grid">
            {gameState === GameState.TOWN && (
              <>
                <button className="cmd-btn" onClick={() => openOverlay('status')}>▶ {t('cmd_status')}</button>
                <button className="cmd-btn" onClick={() => openOverlay('inventory')}>▶ {t('cmd_inv')}</button>
                <button className="cmd-btn" onClick={() => openOverlay('priest')}>▶ {t('cmd_priest')}</button>
                <button className="cmd-btn" onClick={() => openOverlay('enma')}>▶ {t('cmd_enma')}</button>
                <button className="cmd-btn" onClick={() => openOverlay('buyback')}>▶ {t('cmd_buyback')}</button>
                <button className="cmd-btn" onClick={() => openOverlay('stash')}>▶ {t('cmd_stash')}</button>
                <button className="cmd-btn" onClick={() => openOverlay('system')}>▶ {t('cmd_system')}</button>
                <button className="cmd-btn" onClick={() => openOverlay('inn')}>▶ {t('cmd_inn')}</button>
                <button className="cmd-btn" onClick={() => openOverlay('dungeon')}>▶ {t('cmd_dungeon')}</button>
              </>
            )}
            {gameState === GameState.EXPLORING && (
              <>
                <div style={{ color: '#0f0', gridColumn: '1 / -1', marginBottom: '8px' }}>{t('ui_depth', { depth })}</div>
                <button className="cmd-btn" onClick={() => { actions.explore(); setActiveOverlay(null); }}>▶ {t('cmd_explore')}</button>
                <button className="cmd-btn" onClick={() => openOverlay('magic')}>▶ {t('cmd_magic')}</button>
                <button className="cmd-btn" onClick={() => { actions.returnToTown(); setActiveOverlay(null); }}>▶ {t('cmd_return', { cost: depth * 100 })}</button>
              </>
            )}
            {gameState === GameState.ENCOUNTER && (
              <>
                <div style={{ color: '#0f0', gridColumn: '1 / -1', marginBottom: '8px' }}>{t('ui_depth', { depth })}</div>
                <button className="cmd-btn" onClick={() => { actions.fight(); setActiveOverlay(null); }}>▶ {t('cmd_fight')}</button>
                <button className="cmd-btn" onClick={() => openOverlay('magic')}>▶ {t('mag_btn_combat')}</button>
                <button className="cmd-btn" onClick={() => { actions.run(); setActiveOverlay(null); }}>▶ {t('cmd_run')}</button>
              </>
            )}
            {gameState === GameState.COMBAT_RESULT && (
              <>
                <div style={{ color: '#0f0', gridColumn: '1 / -1', marginBottom: '8px' }}>{t('ui_depth', { depth })}</div>
                <button className="cmd-btn" onClick={actions.continueFromCombat}>▶ {t('cmd_next')}</button>
              </>
            )}
          </div>
        </div>

        {/* 4. Text Log */}
        <div className="pane text-log">
          <h3 style={{ margin: '0 0 8px 0', position: 'sticky', top: '0', background: '#000', borderBottom: '1px solid #aaa', paddingBottom: '8px' }}>{t('log_title')}</h3>
            {logMessages.map((msg, i) => (
              <div key={i} style={{ marginBottom: '8px', fontSize: '0.95rem' }}>
                <span style={{ color: '#555' }}>&gt;</span> {typeof msg === 'string' ? msg : t(msg.key as any, msg.params as Record<string, string | number>)}
              </div>
            ))}
          <div ref={logEndRef} />
        </div>
      </div>
      <footer style={{ textAlign: 'center', marginTop: '12px', fontSize: '0.8rem', color: '#888' }}>
        &copy; 2026 <a href="https://note.com/jazzy_begin" target="_blank" rel="noopener noreferrer" style={{ color: '#0ff', textDecoration: 'none' }}>buro</a>
      </footer>
    </div>
  );
}

export default App;
