const fs = require('fs');

let appContent = fs.readFileSync('src/App.tsx', 'utf8');

// 1. Add Imports
const importsToAdd = `import { useI18n } from './contexts/I18nContext';
import { Header } from './components/Header';
import { ManualModal } from './components/ManualModal';
`;
appContent = appContent.replace(`import './index.css';`, `import './index.css';\n${importsToAdd}`);

// 2. Add Hooks and State
const oldAppStart = `function App() {
  const [lang, setLang] = useState<'ja' | 'en'>('ja');
  React.useEffect(() => { (window as any).__lang = lang; }, [lang]);
  const t = (ja: string, en: string) => lang === 'ja' ? ja : en;`;

const newAppStart = `function App() {
  const { t } = useI18n();
  const [isManualOpen, setIsManualOpen] = useState(false);`;

if(appContent.includes(oldAppStart)) {
  appContent = appContent.replace(oldAppStart, newAppStart);
} else {
  // Try fallback replacement for lang states
  appContent = appContent.replace(/const \[lang, setLang\] = useState.*?;/, '');
  appContent = appContent.replace(/React\.useEffect\(\(\) => \{ \(window as any\)\.__lang = lang; \}, \[lang\]\);/, '');
  appContent = appContent.replace(/const t = \(ja: string, en: string\) => lang === 'ja' \? ja : en;/, 'const { t } = useI18n();\n  const [isManualOpen, setIsManualOpen] = useState(false);');
}

// 3. Replace Header
const oldHeaderRegex = /<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderBottom: '2px solid #fff', paddingBottom: '8px', marginBottom: '16px' }}>[\s\S]*?<\/div>/;
const newHeader = `<Header onOpenManual={() => setIsManualOpen(true)} />
        <ManualModal isOpen={isManualOpen} onClose={() => setIsManualOpen(false)} />`;
appContent = appContent.replace(oldHeaderRegex, newHeader);

// 4. Translate App Overlays and Texts
// Use precise replacements for t() commands
appContent = appContent.replace(/\{t\('自身の状態を確認する', 'Check Status'\)\}/g, "{t('cmd_status')}");
appContent = appContent.replace(/\{t\('インベントリ（装備）', 'Inventory & Equip'\)\}/g, "{t('cmd_inv')}");
appContent = appContent.replace(/\{t\('破戒僧の庵（鑑定・強化）', 'Priest Hut \(Identify\/Upgrade\)'\)\}/g, "{t('cmd_priest')}");
appContent = appContent.replace(/\{t\('閻魔の計量所（売却）', 'Enma Station \(Sell\)'\)\}/g, "{t('cmd_enma')}");
appContent = appContent.replace(/\{t\('記憶を買い戻す', 'Buyback Memories'\)\}/g, "{t('cmd_buyback')}");
appContent = appContent.replace(/\{t\('倉庫（縁の預入・保管）', 'Stash \(En Vault\)'\)\}/g, "{t('cmd_stash')}");
appContent = appContent.replace(/\{t\('システム（セーブ・ロード）', 'System \(Save\/Load\)'\)\}/g, "{t('cmd_system')}");
appContent = appContent.replace(/\{t\('微睡みの寝床（宿屋）', 'Slumber Inn \(Rest\)'\)\}/g, "{t('cmd_inn')}");
appContent = appContent.replace(/\{t\('薄暗い迷宮へ向かう', 'Enter the Labyrinth'\)\}/g, "{t('cmd_dungeon')}");
appContent = appContent.replace(/\{t\('探索を進める', 'Explore Further'\)\}/g, "{t('cmd_explore')}");
appContent = appContent.replace(/\{t\('魔法（スキル）', 'Magic \/ Skills'\)\}/g, "{t('cmd_magic')}");
appContent = appContent.replace(/\{t\('戦う', 'Fight'\)\}/g, "{t('cmd_fight')}");
appContent = appContent.replace(/\{t\('逃げる', 'Flee'\)\}/g, "{t('cmd_run')}");
appContent = appContent.replace(/\{t\('次へ', 'Next'\)\}/g, "{t('cmd_next')}");

// Return button which has dynamic cost
const oldReturnBtn = /\{t\('街へ戻る', 'Return to Town'\)\} \(帰還コスト: \{depth \* 100\} En\)/g;
appContent = appContent.replace(oldReturnBtn, "{t('cmd_return', { cost: depth * 100 })}");

// Overlay Titles
appContent = appContent.replace(/\{\(window as any\)\.__lang === 'en' \? 'Status' : '自身の状態を確認'\}/g, "{t('overlay_status')}");
appContent = appContent.replace(/\{\(window as any\)\.__lang === 'en' \? 'Inventory \(Equip\)' : 'インベントリ（装備）'\}/g, "{t('overlay_inv')}");
appContent = appContent.replace(/\{\(window as any\)\.__lang === 'en' \? 'Priest Hut' : '破戒僧の庵'\}/g, "{t('overlay_priest')}");
appContent = appContent.replace(/\{\(window as any\)\.__lang === 'en' \? 'Enma Station' : '閻魔の計量所'\}/g, "{t('overlay_enma')}");
appContent = appContent.replace(/\{\(window as any\)\.__lang === 'en' \? 'Buyback Memories' : '記憶を買い戻す'\}/g, "{t('overlay_buyback')}");
appContent = appContent.replace(/\{\(window as any\)\.__lang === 'en' \? 'Stash' : '倉庫'\}/g, "{t('overlay_stash')}");
appContent = appContent.replace(/\{\(window as any\)\.__lang === 'en' \? 'System' : 'システム'\}/g, "{t('overlay_system')}");
appContent = appContent.replace(/\{\(window as any\)\.__lang === 'en' \? 'Slumber Inn' : '微睡みの寝床'\}/g, "{t('overlay_inn')}");
appContent = appContent.replace(/\{\(window as any\)\.__lang === 'en' \? 'Labyrinth Entrance' : '迷宮の入り口'\}/g, "{t('overlay_dungeon')}");
appContent = appContent.replace(/\{\(window as any\)\.__lang === 'en' \? 'Magic \(Skills\)' : '魔法（スキル）'\}/g, "{t('overlay_magic')}");

// Buttons and text inside overlays
appContent = appContent.replace(/\{\(window as any\)\.__lang === 'en' \? '▶ Stash fully expanded' : '▶ 倉庫は最大まで拡張済み'\}/g, "{t('stash_maxed')}");
appContent = appContent.replace(/\{\(window as any\)\.__lang === 'en' \? \`▶ Expand Stash \(\$\{expandCost\} En\)\` : \`▶ 倉庫を拡張する \(\$\{expandCost\} En\)\`\}/g, "{t('stash_expand', { cost: expandCost })}");

appContent = appContent.replace(/\{\(window as any\)\.__lang === 'en' \? 'Sell' : '売却'\}/g, "{t('btn_sell', { price: sellPrice })}");
appContent = appContent.replace(/\{\(window as any\)\.__lang === 'en' \? 'Buyback' : '買戻'\}/g, "{t('btn_buyback_act', { price: cost })}");
appContent = appContent.replace(/\{\(window as any\)\.__lang === 'en' \? \`\$\{divesLeft\} dives left\` : \`あと\$\{divesLeft\}回\`\}/g, "{t('buyback_left', { dives: divesLeft })}");

appContent = appContent.replace(/\{\(window as any\)\.__lang === 'en' \? 'En on hand:' : '手持ちの縁:'\}/g, "{t('stash_hand')}");
appContent = appContent.replace(/\{\(window as any\)\.__lang === 'en' \? 'Stashed En:' : '倉庫の縁:'\}/g, "{t('stash_vault')}");
appContent = appContent.replace(/\{\(window as any\)\.__lang === 'en' \? 'Deposit En' : '縁を預ける'\}/g, "{t('btn_deposit')}");
appContent = appContent.replace(/\{\(window as any\)\.__lang === 'en' \? 'Withdraw En' : '縁を引き出す'\}/g, "{t('btn_withdraw')}");

appContent = appContent.replace(/どの深度から探索を開始しますか？/g, "{t('dungeon_select')}");
appContent = appContent.replace(/▶ 深度 \{d\} から/g, "▶ {t('dungeon_from', { depth: d })}");

appContent = appContent.replace(/SLOT \{i \+ 1\} にセーブしました。/g, "t('sys_save', { slot: i + 1 })");
appContent = appContent.replace(/SLOT \{i \+ 1\} からロードしました。/g, "t('sys_load', { slot: i + 1 })");
appContent = appContent.replace(/SLOT \{i \+ 1\} のデータを削除しました。/g, "t('sys_delete', { slot: i + 1 })");
appContent = appContent.replace(/>NO DATA</g, ">{t('sys_no_data')}<");
appContent = appContent.replace(/SLOT \$\{i \+ 1\} にセーブしますか？/g, "${t('sys_confirm_save', { slot: i + 1 })}");
appContent = appContent.replace(/SLOT \$\{i \+ 1\} のデータをロードしますか？/g, "${t('sys_confirm_load', { slot: i + 1 })}");
appContent = appContent.replace(/SLOT \$\{i \+ 1\} のデータを削除しますか？/g, "${t('sys_confirm_del', { slot: i + 1 })}");

appContent = appContent.replace(/STATUS<\/h3>/g, "{t('status_title')}</h3>");
appContent = appContent.replace(/COMMAND<\/h3>/g, "{t('command_title')}</h3>");
appContent = appContent.replace(/LOG<\/h3>/g, "{t('log_title')}</h3>");

appContent = appContent.replace(/>Lv: /g, ">{t('level')}: ");
appContent = appContent.replace(/>EXP: /g, ">{t('exp')}: ");
appContent = appContent.replace(/>HP: /g, ">{t('hp')}: ");
appContent = appContent.replace(/>MP: /g, ">{t('mp')}: ");
appContent = appContent.replace(/>En: /g, ">{t('en')}: ");
appContent = appContent.replace(/>ITEM: /g, ">{t('item')}: ");
appContent = appContent.replace(/>COST: /g, ">{t('cost')}: ");

fs.writeFileSync('src/App.tsx', appContent);
console.log('App.tsx refactored for i18n.');
