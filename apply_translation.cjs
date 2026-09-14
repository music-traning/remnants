const fs = require('fs');

// 1. Update InventoryView.tsx
let invContent = fs.readFileSync('src/components/InventoryView.tsx', 'utf8');

const oldInvText = `{m.isIdentified ? (m.attachedSpell ? \`★ \${m.flavorText.itemName}\` : m.flavorText.itemName) : '未鑑定の記憶'}`;
const newInvText = `
{m.isIdentified 
  ? (m.attachedSpell 
      ? \`★ \${(window as any).__lang === 'en' ? m.flavorText.itemNameEn : m.flavorText.itemName}\` 
      : ((window as any).__lang === 'en' ? m.flavorText.itemNameEn : m.flavorText.itemName)) 
  : ((window as any).__lang === 'en' ? 'Unidentified Memory' : '未鑑定の記憶')}
`.trim();

invContent = invContent.replace(oldInvText, newInvText);
fs.writeFileSync('src/components/InventoryView.tsx', invContent);

// 2. Update MemoryDetail.tsx
let memContent = fs.readFileSync('src/components/MemoryDetail.tsx', 'utf8');

const oldUnidentifiedTitle = `<h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', margin: '0 0 12px 0' }}>未鑑定の記憶</h2>`;
const newUnidentifiedTitle = `<h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', margin: '0 0 12px 0' }}>{(window as any).__lang === 'en' ? 'Unidentified Memory' : '未鑑定の記憶'}</h2>`;
memContent = memContent.replace(oldUnidentifiedTitle, newUnidentifiedTitle);

const oldItemName = `{flavorText.itemName}`;
const newItemName = `{(window as any).__lang === 'en' ? flavorText.itemNameEn : flavorText.itemName}`;
memContent = memContent.replace(oldItemName, newItemName);

const oldOriginText = `{flavorText.originText}`;
const newOriginText = `{(window as any).__lang === 'en' ? flavorText.originTextEn : flavorText.originText}`;
memContent = memContent.replace(oldOriginText, newOriginText);

const oldPriestMemo = `「{flavorText.priestMemo}」`;
const newPriestMemo = `{(window as any).__lang === 'en' ? flavorText.priestMemoEn : \`「\${flavorText.priestMemo}」\`}`;
memContent = memContent.replace(oldPriestMemo, newPriestMemo);

fs.writeFileSync('src/components/MemoryDetail.tsx', memContent);

// 3. Update App.tsx logic for lang
let appContent = fs.readFileSync('src/App.tsx', 'utf8');

// Inside App component, whenever lang changes, update window.__lang
const oldLangBtn = `onClick={() => setLang(lang === 'ja' ? 'en' : 'ja')}`;
const newLangBtn = `onClick={() => { const next = lang === 'ja' ? 'en' : 'ja'; setLang(next); (window as any).__lang = next; }}`;
appContent = appContent.replace(oldLangBtn, newLangBtn);

// In App init
const oldAppStart = `function App() {
  const [lang, setLang] = useState<'ja' | 'en'>('ja');`;
const newAppStart = `function App() {
  const [lang, setLang] = useState<'ja' | 'en'>('ja');
  React.useEffect(() => { (window as any).__lang = lang; }, [lang]);`;
appContent = appContent.replace(oldAppStart, newAppStart);

fs.writeFileSync('src/App.tsx', appContent);

console.log('Applied full translation toggles.');
