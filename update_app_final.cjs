const fs = require('fs');

let appContent = fs.readFileSync('src/App.tsx', 'utf8');

// 1. Initial Player
appContent = appContent.replace(
  `maxReachedDepth: 0\n};`,
  `maxReachedDepth: 0,\n  totalDives: 0\n};`
);

// 2. handleLeaveTown replacement
const oldLeaveTown = `  const handleLeaveTown = () => {
    setActiveOverlay(null);
    setGameState(GameState.EXPLORING);
    setSteps(1); // 1歩目
    actions.addLog('街を出て、薄暗いダンジョンの探索を開始した。');
  };`;

const newEnterDungeon = `  const handleEnterDungeon = (startDepth: number) => {
    const newDives = (player.totalDives || 0) + 1;
    setPlayer(p => ({ ...p, totalDives: newDives }));
    setShopInventory(prev => prev.filter(m => (newDives - (m.soldAtDiveCount || 0)) < 3));
    setSteps(startDepth * 5);
    setGameState(GameState.EXPLORING);
    setActiveOverlay(null);
    actions.addLog(\`街を出て、深度 \${startDepth} から探索を開始した。\`);
  };`;
if (appContent.includes(oldLeaveTown)) {
  appContent = appContent.replace(oldLeaveTown, newEnterDungeon);
} else {
  // Try regex if formatting differs
  appContent = appContent.replace(/const handleLeaveTown = \(\) => \{[\s\S]*?探索を開始した。'\);\n  \};/, newEnterDungeon);
}

// 3. Save / Load Confirm
const oldSaveBtn = `onClick={() => {
                          saveGame(i + 1, player);
                          setSaveList(getSaveList());
                          actions.addLog(\`SLOT \${i + 1} にセーブしました。\`);
                        }}>セーブ</button>`;
const newSaveBtn = `onClick={() => {
                          if (window.confirm(\`SLOT \${i + 1} にセーブしますか？\`)) {
                            saveGame(i + 1, player);
                            setSaveList(getSaveList());
                            actions.addLog(\`SLOT \${i + 1} にセーブしました。\`);
                          }
                        }}>セーブ</button>`;
appContent = appContent.replace(oldSaveBtn, newSaveBtn);

const oldLoadBtn = `onClick={() => {
                              const p = loadGame(i + 1);
                              if (p) {
                                setPlayer(p);
                                setActiveOverlay(null);
                                actions.addLog(\`SLOT \${i + 1} からロードしました。\`);
                              }
                            }}>ロード</button>`;
const newLoadBtn = `onClick={() => {
                              if (window.confirm(\`SLOT \${i + 1} からロードしますか？\\n（現在の進行状況は失われます）\`)) {
                                const p = loadGame(i + 1);
                                if (p) {
                                  setPlayer(p);
                                  setActiveOverlay(null);
                                  actions.addLog(\`SLOT \${i + 1} からロードしました。\`);
                                }
                              }
                            }}>ロード</button>`;
appContent = appContent.replace(oldLoadBtn, newLoadBtn);

// 4. 閻魔の計量所 inline action
const oldSellAction = `actionButton={(mem) => (
                          <button className="cmd-btn" style={{ borderColor: '#f00', color: '#f00', width: 'auto' }} onClick={() => handleSell(mem)}>
                            [ 売却する (+{mem.baseValue} En) ]
                          </button>
                        )}`;
const newSellAction = `inlineAction={(mem) => (
                          <button className="cmd-btn" style={{ borderColor: '#f00', color: '#f00', width: 'auto', padding: '2px 8px', fontSize: '0.8rem', marginLeft: '8px' }} onClick={(e) => { e.stopPropagation(); handleSell(mem); }}>
                            売却 (+{mem.baseValue} En)
                          </button>
                        )}`;
appContent = appContent.replace(oldSellAction, newSellAction);

// 5. 記憶を買い戻す inline action
const oldBuyBackAction = `actionButton={(mem) => (
                    <button className="cmd-btn" style={{ borderColor: '#0f0', color: '#0f0', width: 'auto' }} onClick={() => handleBuyBack(mem)}>
                      [ 買い戻す (-{Math.floor(mem.baseValue * 1.5)} En) ]
                    </button>
                  )}`;
const newBuyBackAction = `inlineAction={(mem) => {
                    const cost = Math.floor(mem.baseValue * 1.5);
                    const canAfford = player.currentEn >= cost;
                    const divesLeft = 3 - ((player.totalDives || 0) - (mem.soldAtDiveCount || 0));
                    return (
                      <div style={{ marginLeft: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '0.75rem', color: '#aaa' }}>あと{divesLeft}回</span>
                        <button className="cmd-btn" disabled={!canAfford} style={{ borderColor: canAfford ? '#0f0' : '#555', color: canAfford ? '#0f0' : '#555', width: 'auto', padding: '2px 8px', fontSize: '0.8rem' }} onClick={(e) => { e.stopPropagation(); if(canAfford) handleBuyBack(mem); }}>
                          買戻 (-{cost} En)
                        </button>
                      </div>
                    );
                  }}`;
appContent = appContent.replace(oldBuyBackAction, newBuyBackAction);

// 6. Dungeon Entrance Overlay
const dungeonEntranceOverlay = `
              {activeOverlay === '迷宮の入り口' && (() => {
                const maxDepth = player.maxReachedDepth || 0;
                const maxCheckpoint = Math.floor(maxDepth / 5) * 5;
                const checkpoints = [];
                for (let d = 0; d <= maxCheckpoint; d += 5) {
                  checkpoints.push(d);
                }
                return (
                  <div>
                    <h3 style={{ color: '#0f0', margin: '0 0 16px 0' }}>迷宮の入り口</h3>
                    <p style={{ marginBottom: '16px' }}>どの深度から探索を開始しますか？</p>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '8px' }}>
                      {checkpoints.map(d => (
                        <button key={d} className="cmd-btn" onClick={() => handleEnterDungeon(d)}>
                          ▶ 深度 {d} から
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })()}
`;

// Insert the overlay right before 倉庫 overlay
appContent = appContent.replace(`{activeOverlay === '倉庫' && (`, dungeonEntranceOverlay + `\n              {activeOverlay === '倉庫' && (`);

// 7. Replace the explore button
appContent = appContent.replace(
  `<button className="cmd-btn" onClick={handleLeaveTown}>▶ 薄暗い迷宮へ向かう</button>`,
  `<button className="cmd-btn" onClick={() => openOverlay('迷宮の入り口')}>▶ 薄暗い迷宮へ向かう</button>`
);

fs.writeFileSync('src/App.tsx', appContent);
console.log('Finished updating App.tsx for inline actions, confirm dialogs, and dungeon checkpoints.');
