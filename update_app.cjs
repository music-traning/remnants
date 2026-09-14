const fs = require('fs');

let appContent = fs.readFileSync('src/App.tsx', 'utf8');

const formatTimeFunc = `
const formatTime = (secs: number) => {
  const h = Math.floor(secs / 3600);
  const m = Math.floor((secs % 3600) / 60);
  const s = secs % 60;
  return \`\${h.toString().padStart(2, '0')}:\${m.toString().padStart(2, '0')}:\${s.toString().padStart(2, '0')}\`;
};
`;

if (!appContent.includes('const formatTime =')) {
  appContent = appContent.replace('function App() {', formatTimeFunc + '\nfunction App() {');
}

// Add system save UI details
const oldSaveUI = `                            Lv: {save.player.level} | 縁: {save.player.currentEn} En | HP: {save.player.currentHP}/{save.player.maxHP}<br/>`;
const newSaveUI = `                            Lv: {save.player.level} | 縁: {save.player.currentEn} En | HP: {save.player.currentHP}/{save.player.maxHP}<br/>
                            最大深度: {save.player.maxReachedDepth} | プレイ時間: {formatTime(save.player.playTimeSeconds)}<br/>`;
appContent = appContent.replace(oldSaveUI, newSaveUI);


// Add Inn UI in TOWN
const townMenuButtonStr = `<button className="cmd-btn" onClick={() => openOverlay('システム')}>▶ システム（セーブ・ロード）</button>`;
const newTownMenuStr = `<button className="cmd-btn" onClick={() => openOverlay('システム')}>▶ システム（セーブ・ロード）</button>\n                <button className="cmd-btn" onClick={() => openOverlay('微睡みの寝床')}>▶ 微睡みの寝床（宿屋）</button>`;
appContent = appContent.replace(townMenuButtonStr, newTownMenuStr);

const oldOverlayCheck = `{activeOverlay === '倉庫' && (`;
const innOverlayStr = `{activeOverlay === '微睡みの寝床' && (
                <div>
                  <h3 style={{ color: '#0f0' }}>微睡みの寝床（宿屋）</h3>
                  <p>疲れた身体と心を休め、HPとMPを全回復します。</p>
                  <p>現在のHP: {player.currentHP} / {player.maxHP}</p>
                  <p>現在のMP: {player.currentMP} / {player.maxMP}</p>
                  <button className="cmd-btn" style={{ width: 'auto', borderColor: '#0f0', color: '#0f0' }} onClick={() => {
                    const res = ecoActions.restAtInn();
                    actions.addLog(res.message);
                  }}>
                    [ 休息する (費用: {Math.floor(player.maxHP * 0.1 + player.maxMP * 0.5)} En) ]
                  </button>
                </div>
              )}
              
              `;
appContent = appContent.replace(oldOverlayCheck, innOverlayStr + oldOverlayCheck);


// Add Magic to Command Menu in Exploring/Encounter
const exploreMenuStr = `{gameState === GameState.EXPLORING && (
              <>
                <div style={{ color: '#0f0', gridColumn: '1 / -1', marginBottom: '8px' }}>【 深度: {depth} 】</div>
                <button className="cmd-btn" onClick={actions.explore}>▶ 探索を進める</button>
                <button className="cmd-btn" onClick={actions.returnToTown}>▶ 街へ戻る (帰還コスト: {depth * 100} En)</button>
              </>`;
const newExploreMenuStr = `{gameState === GameState.EXPLORING && (
              <>
                <div style={{ color: '#0f0', gridColumn: '1 / -1', marginBottom: '8px' }}>【 深度: {depth} 】</div>
                <button className="cmd-btn" onClick={actions.explore}>▶ 探索を進める</button>
                <button className="cmd-btn" onClick={() => openOverlay('魔法（スキル）')}>▶ 魔法（スキル）</button>
                <button className="cmd-btn" onClick={actions.returnToTown}>▶ 街へ戻る (帰還コスト: {depth * 100} En)</button>
              </>`;
appContent = appContent.replace(exploreMenuStr, newExploreMenuStr);

const encounterMenuStr = `{gameState === GameState.ENCOUNTER && (
              <>
                <button className="cmd-btn" onClick={actions.fight}>▶ 戦う</button>
                <button className="cmd-btn" onClick={actions.run}>▶ 逃げる</button>
              </>`;
const newEncounterMenuStr = `{gameState === GameState.ENCOUNTER && (
              <>
                <button className="cmd-btn" onClick={actions.fight}>▶ 戦う</button>
                <button className="cmd-btn" onClick={() => openOverlay('魔法（スキル）')}>▶ 魔法（スキル）</button>
                <button className="cmd-btn" onClick={actions.run}>▶ 逃げる</button>
              </>`;
appContent = appContent.replace(encounterMenuStr, newEncounterMenuStr);

const magicOverlayStr = `{activeOverlay === '魔法（スキル）' && (() => {
                const hasHealing = player.installedMemories.some(m => m.category === 'Healing');
                const hasPhysical = player.installedMemories.some(m => m.category === 'Physical');
                const hasMagic = player.installedMemories.some(m => m.category === 'Magic');
                const hasSupport = player.installedMemories.some(m => m.category === 'Support');
                
                return (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <h3 style={{ color: '#0f0', margin: '0 0 16px 0' }}>使用可能な魔法</h3>
                  {hasHealing && (
                    <>
                      <button className="cmd-btn" onClick={() => actions.castSpell('HealSmall')}>▶ 小回復 (5 MP) - HP50回復</button>
                      <button className="cmd-btn" onClick={() => actions.castSpell('HealMedium')}>▶ 中回復 (15 MP) - HP200回復</button>
                      <button className="cmd-btn" onClick={() => actions.castSpell('HealFull')}>▶ 完全回復 (30 MP) - HP全回復</button>
                    </>
                  )}
                  {hasPhysical && (
                    <button className="cmd-btn" onClick={() => actions.castSpell('AtkUp')}>▶ 攻撃力アップ (20 MP) - 深度が2進むまでATK x1.5</button>
                  )}
                  {hasMagic && gameState === GameState.ENCOUNTER && (
                    <button className="cmd-btn" onClick={() => { actions.castSpell('MagicAttack'); setActiveOverlay(null); }}>▶ 魔法攻撃 (20 MP) - 敵に大ダメージ</button>
                  )}
                  {hasSupport && (
                    <>
                      <button className="cmd-btn" onClick={() => actions.castSpell('DefUp')}>▶ 防御力アップ (15 MP) - 深度が2進むまでDEF x1.5</button>
                      <button className="cmd-btn" onClick={() => actions.castSpell('SpdUp')}>▶ 素早さアップ (15 MP) - 深度が2進むまでSPD x1.5</button>
                      <button className="cmd-btn" onClick={() => { actions.castSpell('Return'); setActiveOverlay(null); }}>▶ 帰還魔法 (40 MP) - 縁を消費せず即座に帰還</button>
                    </>
                  )}
                  {!hasHealing && !hasPhysical && !hasMagic && !hasSupport && (
                    <p style={{ color: '#aaa' }}>使用できる魔法がありません。該当する記憶をインストールしてください。</p>
                  )}
                </div>
              );})()}
              
              `;
appContent = appContent.replace(oldOverlayCheck, magicOverlayStr + oldOverlayCheck);


fs.writeFileSync('src/App.tsx', appContent);
console.log('App.tsx injected successfully');
