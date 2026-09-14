const fs = require('fs');

let appContent = fs.readFileSync('src/App.tsx', 'utf8');

// Replace the old Magic Overlay with the new one
const oldMagicOverlayStart = `{activeOverlay === '魔法（スキル）' && (() => {`;
const oldMagicOverlayEnd = `);})()}`;
if (appContent.includes(oldMagicOverlayStart)) {
  const startIndex = appContent.indexOf(oldMagicOverlayStart);
  let endIndex = appContent.indexOf(oldMagicOverlayEnd, startIndex);
  if (endIndex > -1) {
    endIndex += oldMagicOverlayEnd.length;
    
    const newMagicOverlayStr = `{activeOverlay === '魔法（スキル）' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <h3 style={{ color: '#0f0', margin: '0 0 16px 0' }}>装備中の魔法</h3>
                  {player.installedMemories.filter(m => m.attachedSpell).map(mem => {
                    const spell = mem.attachedSpell!;
                    return (
                      <button key={mem.id} className="cmd-btn" style={{ width: 'auto' }} onClick={() => {
                        actions.castSpell(mem.id);
                        setActiveOverlay(null);
                      }}>
                        ▶ {spell.name} ({spell.mpCost} MP) - [元記憶Cost: {mem.cost} による効力]
                      </button>
                    )
                  })}
                  {player.installedMemories.filter(m => m.attachedSpell).length === 0 && (
                    <p style={{ color: '#aaa' }}>使用できる魔法がありません。魔法が付与された記憶を装備してください。</p>
                  )}
                </div>
              )}`;
    appContent = appContent.substring(0, startIndex) + newMagicOverlayStr + appContent.substring(endIndex);
  }
}

// Update Explore buttons to close overlay
appContent = appContent.replace(
  `onClick={actions.explore}>▶ 探索を進める</button>`, 
  `onClick={() => { actions.explore(); setActiveOverlay(null); }}>▶ 探索を進める</button>`
);
appContent = appContent.replace(
  `onClick={actions.returnToTown}>▶ 街へ戻る`, 
  `onClick={() => { actions.returnToTown(); setActiveOverlay(null); }}>▶ 街へ戻る`
);

// Update Encounter buttons to close overlay
appContent = appContent.replace(
  `onClick={actions.fight}>▶ 戦う</button>`, 
  `onClick={() => { actions.fight(); setActiveOverlay(null); }}>▶ 戦う</button>`
);
appContent = appContent.replace(
  `onClick={actions.run}>▶ 逃げる</button>`, 
  `onClick={() => { actions.run(); setActiveOverlay(null); }}>▶ 逃げる</button>`
);


fs.writeFileSync('src/App.tsx', appContent);
console.log('App.tsx updated for new magic overlay and UX bugs.');
