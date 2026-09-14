const fs = require('fs');

let appContent = fs.readFileSync('src/App.tsx', 'utf8');

// 1. Add lang state to App
const appFuncStart = `function App() {`;
const langState = `function App() {
  const [lang, setLang] = useState<'ja' | 'en'>('ja');
  const t = (ja: string, en: string) => lang === 'ja' ? ja : en;
`;
appContent = appContent.replace(appFuncStart, langState);

// 2. Change Header and Add Footer
const oldHeader = `<h1 style={{ borderBottom: '2px solid #fff', paddingBottom: '8px', marginBottom: '16px', fontSize: '1.5rem' }}>
        8-BIT DUNGEON RPG (PoC)
      </h1>`;
const newHeader = `<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderBottom: '2px solid #fff', paddingBottom: '8px', marginBottom: '16px' }}>
        <h1 style={{ margin: 0, fontSize: '1.8rem', letterSpacing: '2px', textShadow: '0 0 5px #fff', color: '#fff' }}>
          REMNANTS OF THE ABYSS
        </h1>
        <button className="cmd-btn" style={{ width: 'auto', padding: '4px 8px', borderColor: '#fff' }} onClick={() => setLang(lang === 'ja' ? 'en' : 'ja')}>
          {lang === 'ja' ? 'English' : '日本語'}
        </button>
      </div>`;
appContent = appContent.replace(oldHeader, newHeader);

const oldContainerEnd = `</div>
    </div>
  );`;
const newContainerEnd = `</div>
      <footer style={{ textAlign: 'center', marginTop: '12px', fontSize: '0.8rem', color: '#888' }}>
        &copy; 2026 buro | <a href="https://note.com/jazzy_begin" target="_blank" rel="noopener noreferrer" style={{ color: '#0ff', textDecoration: 'none' }}>https://note.com/jazzy_begin</a>
      </footer>
    </div>
  );`;
appContent = appContent.replace(oldContainerEnd, newContainerEnd);

// 3. Translate Town Commands
appContent = appContent.replace(
  `onClick={() => openOverlay('自身の状態を確認')}>▶ 自身の状態を確認する</button>`,
  `onClick={() => openOverlay('自身の状態を確認')}>▶ {t('自身の状態を確認する', 'Check Status')}</button>`
);
appContent = appContent.replace(
  `onClick={() => openOverlay('インベントリ（装備）')}>▶ インベントリ（装備）</button>`,
  `onClick={() => openOverlay('インベントリ（装備）')}>▶ {t('インベントリ（装備）', 'Inventory & Equip')}</button>`
);
appContent = appContent.replace(
  `onClick={() => openOverlay('破戒僧の庵')}>▶ 破戒僧の庵（鑑定・強化）</button>`,
  `onClick={() => openOverlay('破戒僧の庵')}>▶ {t('破戒僧の庵（鑑定・強化）', 'Priest Hut (Identify/Upgrade)')}</button>`
);
appContent = appContent.replace(
  `onClick={() => openOverlay('閻魔の計量所')}>▶ 閻魔の計量所（売却）</button>`,
  `onClick={() => openOverlay('閻魔の計量所')}>▶ {t('閻魔の計量所（売却）', 'Enma Station (Sell)')}</button>`
);
appContent = appContent.replace(
  `onClick={() => openOverlay('記憶を買い戻す')}>▶ 記憶を買い戻す</button>`,
  `onClick={() => openOverlay('記憶を買い戻す')}>▶ {t('記憶を買い戻す', 'Buyback Memories')}</button>`
);
appContent = appContent.replace(
  `onClick={() => openOverlay('倉庫')}>▶ 倉庫（縁の預入・保管）</button>`,
  `onClick={() => openOverlay('倉庫')}>▶ {t('倉庫（縁の預入・保管）', 'Stash (En Vault)')}</button>`
);
appContent = appContent.replace(
  `onClick={() => openOverlay('システム')}>▶ システム（セーブ・ロード）</button>`,
  `onClick={() => openOverlay('システム')}>▶ {t('システム（セーブ・ロード）', 'System (Save/Load)')}</button>`
);
appContent = appContent.replace(
  `onClick={() => openOverlay('微睡みの寝床')}>▶ 微睡みの寝床（宿屋）</button>`,
  `onClick={() => openOverlay('微睡みの寝床')}>▶ {t('微睡みの寝床（宿屋）', 'Slumber Inn (Rest)')}</button>`
);
appContent = appContent.replace(
  `onClick={() => openOverlay('迷宮の入り口')}>▶ 薄暗い迷宮へ向かう</button>`,
  `onClick={() => openOverlay('迷宮の入り口')}>▶ {t('薄暗い迷宮へ向かう', 'Enter the Labyrinth')}</button>`
);

// 4. Translate Explore/Combat Commands
appContent = appContent.replace(
  `onClick={() => { actions.explore(); setActiveOverlay(null); }}>▶ 探索を進める</button>`,
  `onClick={() => { actions.explore(); setActiveOverlay(null); }}>▶ {t('探索を進める', 'Explore Further')}</button>`
);
appContent = appContent.replace(
  `onClick={() => openOverlay('魔法（スキル）')}>▶ 魔法（スキル）</button>`,
  `onClick={() => openOverlay('魔法（スキル）')}>▶ {t('魔法（スキル）', 'Magic / Skills')}</button>`
);
appContent = appContent.replace(
  `onClick={() => { actions.returnToTown(); setActiveOverlay(null); }}>▶ 街へ戻る`,
  `onClick={() => { actions.returnToTown(); setActiveOverlay(null); }}>▶ {t('街へ戻る', 'Return to Town')}`
);
appContent = appContent.replace(
  `onClick={() => { actions.fight(); setActiveOverlay(null); }}>▶ 戦う</button>`,
  `onClick={() => { actions.fight(); setActiveOverlay(null); }}>▶ {t('戦う', 'Fight')}</button>`
);
appContent = appContent.replace(
  `onClick={() => { actions.run(); setActiveOverlay(null); }}>▶ 逃げる</button>`,
  `onClick={() => { actions.run(); setActiveOverlay(null); }}>▶ {t('逃げる', 'Flee')}</button>`
);
appContent = appContent.replace(
  `onClick={actions.continueFromCombat}>▶ 次へ</button>`,
  `onClick={actions.continueFromCombat}>▶ {t('次へ', 'Next')}</button>`
);

fs.writeFileSync('src/App.tsx', appContent);
console.log('App.tsx updated for i18n, responsive, title and footer.');
