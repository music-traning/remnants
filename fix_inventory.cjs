const fs = require('fs');

// --- 1. InventoryView.tsx ---
let invContent = fs.readFileSync('src/components/InventoryView.tsx', 'utf8');

// Replace Japanese texts with lang check
invContent = invContent.replace(/'リストからアイテムを選択してください'/g, `((window as any).__lang === 'en' ? 'Select an item from the list' : 'リストからアイテムを選択してください')`);

// Remove the priestMemo from the list to make it much more compact and prevent scrolling
const oldListItem = `{m.isIdentified && (
                    <div style={{ fontSize: '0.85rem', color: '#ccc', marginTop: '4px', fontStyle: 'italic' }}>
                      『{(window as any).__lang === 'en' ? m.flavorText.priestMemoEn : m.flavorText.priestMemo}』
                    </div>
                  )}`;
const oldListItemAlt = `{m.isIdentified && (
                    <div style={{ fontSize: '0.85rem', color: '#ccc', marginTop: '4px' }}>
                      『{m.flavorText.priestMemo}』
                    </div>
                  )}`;

// Let's just use regex to remove the priest memo from the list view completely to save space
invContent = invContent.replace(/\{m\.isIdentified && \([\s\S]*?priestMemo[\s\S]*?\)\}/, '');

// Make padding smaller in the list items
invContent = invContent.replace(/padding: '8px'/g, `padding: '4px 8px'`);
invContent = invContent.replace(/marginBottom: '16px'/g, `marginBottom: '8px'`);

// Make grid columns more flexible
invContent = invContent.replace(/gridTemplateColumns: '1fr 1fr'/g, `gridTemplateColumns: 'minmax(120px, 1fr) minmax(150px, 1fr)'`);

fs.writeFileSync('src/components/InventoryView.tsx', invContent);


// --- 2. MemoryDetail.tsx ---
let memContent = fs.readFileSync('src/components/MemoryDetail.tsx', 'utf8');

// Translate stats and words
memContent = memContent.replace(/>レアリティ: /g, `>{(window as any).__lang === 'en' ? 'Rarity: ' : 'レアリティ: '}`);
memContent = memContent.replace(/>カテゴリ: /g, `>{(window as any).__lang === 'en' ? 'Category: ' : 'カテゴリ: '}`);
memContent = memContent.replace(/>コスト: /g, `>{(window as any).__lang === 'en' ? 'Cost: ' : 'コスト: '}`);
memContent = memContent.replace(/>装備効果/g, `>{(window as any).__lang === 'en' ? 'Equip Effects' : '装備効果'}`);
memContent = memContent.replace(/>付与魔法/g, `>{(window as any).__lang === 'en' ? 'Enchanted Spell' : '付与魔法'}`);
memContent = memContent.replace(/>消費MP:/g, `>{(window as any).__lang === 'en' ? 'MP Cost:' : '消費MP:'}`);

// Reduce font sizes and margins in MemoryDetail to save vertical space
memContent = memContent.replace(/fontSize: '1.5rem'/g, `fontSize: '1.2rem'`);
memContent = memContent.replace(/marginBottom: '16px'/g, `marginBottom: '8px'`);
memContent = memContent.replace(/marginBottom: '24px'/g, `marginBottom: '12px'`);
memContent = memContent.replace(/marginTop: '24px'/g, `marginTop: '12px'`);
memContent = memContent.replace(/padding: '16px'/g, `padding: '8px'`);

fs.writeFileSync('src/components/MemoryDetail.tsx', memContent);


// --- 3. App.tsx Overlays ---
let appContent = fs.readFileSync('src/App.tsx', 'utf8');

// Translate Close button
appContent = appContent.replace(/>\[ 閉じる \]/g, `>[ {(window as any).__lang === 'en' ? 'Close' : '閉じる'} ]`);

// Translate Overlay Titles
appContent = appContent.replace(/<h2 style={{ fontSize: '1.2rem', margin: 0 }}>自身の状態を確認<\/h2>/g, `<h2 style={{ fontSize: '1.2rem', margin: 0 }}>{(window as any).__lang === 'en' ? 'Status' : '自身の状態を確認'}</h2>`);
appContent = appContent.replace(/<h2 style={{ fontSize: '1.2rem', margin: 0 }}>インベントリ（装備）<\/h2>/g, `<h2 style={{ fontSize: '1.2rem', margin: 0 }}>{(window as any).__lang === 'en' ? 'Inventory (Equip)' : 'インベントリ（装備）'}</h2>`);
appContent = appContent.replace(/<h2 style={{ fontSize: '1.2rem', margin: 0 }}>破戒僧の庵<\/h2>/g, `<h2 style={{ fontSize: '1.2rem', margin: 0 }}>{(window as any).__lang === 'en' ? 'Priest Hut' : '破戒僧の庵'}</h2>`);
appContent = appContent.replace(/<h2 style={{ fontSize: '1.2rem', margin: 0 }}>閻魔の計量所<\/h2>/g, `<h2 style={{ fontSize: '1.2rem', margin: 0 }}>{(window as any).__lang === 'en' ? 'Enma Station' : '閻魔の計量所'}</h2>`);
appContent = appContent.replace(/<h2 style={{ fontSize: '1.2rem', margin: 0 }}>記憶を買い戻す<\/h2>/g, `<h2 style={{ fontSize: '1.2rem', margin: 0 }}>{(window as any).__lang === 'en' ? 'Buyback Memories' : '記憶を買い戻す'}</h2>`);
appContent = appContent.replace(/<h2 style={{ fontSize: '1.2rem', margin: 0 }}>倉庫<\/h2>/g, `<h2 style={{ fontSize: '1.2rem', margin: 0 }}>{(window as any).__lang === 'en' ? 'Stash' : '倉庫'}</h2>`);
appContent = appContent.replace(/<h2 style={{ fontSize: '1.2rem', margin: 0 }}>システム<\/h2>/g, `<h2 style={{ fontSize: '1.2rem', margin: 0 }}>{(window as any).__lang === 'en' ? 'System' : 'システム'}</h2>`);
appContent = appContent.replace(/<h2 style={{ fontSize: '1.2rem', margin: 0 }}>微睡みの寝床<\/h2>/g, `<h2 style={{ fontSize: '1.2rem', margin: 0 }}>{(window as any).__lang === 'en' ? 'Slumber Inn' : '微睡みの寝床'}</h2>`);
appContent = appContent.replace(/<h2 style={{ fontSize: '1.2rem', margin: 0 }}>迷宮の入り口<\/h2>/g, `<h2 style={{ fontSize: '1.2rem', margin: 0 }}>{(window as any).__lang === 'en' ? 'Labyrinth Entrance' : '迷宮の入り口'}</h2>`);
appContent = appContent.replace(/<h2 style={{ fontSize: '1.2rem', margin: 0 }}>魔法（スキル）<\/h2>/g, `<h2 style={{ fontSize: '1.2rem', margin: 0 }}>{(window as any).__lang === 'en' ? 'Magic (Skills)' : '魔法（スキル）'}</h2>`);

// Translate Overlay internal texts
appContent = appContent.replace(/▶ 倉庫は最大まで拡張済み/g, `{(window as any).__lang === 'en' ? '▶ Stash fully expanded' : '▶ 倉庫は最大まで拡張済み'}`);
appContent = appContent.replace(/▶ 倉庫を拡張する/g, `{(window as any).__lang === 'en' ? '▶ Expand Stash' : '▶ 倉庫を拡張する'}`);
appContent = appContent.replace(/売却/g, `{(window as any).__lang === 'en' ? 'Sell' : '売却'}`);
appContent = appContent.replace(/買戻/g, `{(window as any).__lang === 'en' ? 'Buyback' : '買戻'}`);
appContent = appContent.replace(/あと\{divesLeft\}回/g, `{(window as any).__lang === 'en' ? \`\${divesLeft} dives left\` : \`あと\${divesLeft}回\`}`);
appContent = appContent.replace(/手持ちの縁:/g, `{(window as any).__lang === 'en' ? 'En on hand:' : '手持ちの縁:'}`);
appContent = appContent.replace(/倉庫の縁:/g, `{(window as any).__lang === 'en' ? 'Stashed En:' : '倉庫の縁:'}`);
appContent = appContent.replace(/縁を預ける/g, `{(window as any).__lang === 'en' ? 'Deposit En' : '縁を預ける'}`);
appContent = appContent.replace(/縁を引き出す/g, `{(window as any).__lang === 'en' ? 'Withdraw En' : '縁を引き出す'}`);

fs.writeFileSync('src/App.tsx', appContent);
console.log('Overlay and Inventory translation and compacting done.');
