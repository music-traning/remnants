const fs = require('fs');

// InventoryView.tsx
let invContent = fs.readFileSync('src/components/InventoryView.tsx', 'utf8');

if (!invContent.includes('useI18n')) {
  invContent = `import { useI18n } from '../contexts/I18nContext';\n` + invContent;
}

invContent = invContent.replace(/export const InventoryView: React\.FC<InventoryViewProps> = \(\{ items, selectedItem, onSelect, inlineAction \}\) => \{/, "export const InventoryView: React.FC<InventoryViewProps> = ({ items, selectedItem, onSelect, inlineAction }) => {\n  const { t, language } = useI18n();");

invContent = invContent.replace(/\(\(window as any\)\.__lang === 'en' \? 'Select an item from the list' : 'リストからアイテムを選択してください'\)/g, "t('inv_select')");
invContent = invContent.replace(/\(\(window as any\)\.__lang === 'en' \? 'Unidentified Memory' : '未鑑定の記憶'\)/g, "t('inv_unidentified')");
invContent = invContent.replace(/\(\(window as any\)\.__lang === 'en' \? m\.flavorText\.itemNameEn : m\.flavorText\.itemName\)/g, "(language === 'en' && m.flavorText.itemNameEn ? m.flavorText.itemNameEn : m.flavorText.itemName)");

fs.writeFileSync('src/components/InventoryView.tsx', invContent);

// MemoryDetail.tsx
let memContent = fs.readFileSync('src/components/MemoryDetail.tsx', 'utf8');

if (!memContent.includes('useI18n')) {
  memContent = `import { useI18n } from '../contexts/I18nContext';\n` + memContent;
}

memContent = memContent.replace(/export const MemoryDetail: React\.FC<MemoryDetailProps> = \(\{ memory, onEquip, onRemove, onIdentify, canEquip, canAffordIdentify, identifyCost \}\) => \{/, "export const MemoryDetail: React.FC<MemoryDetailProps> = ({ memory, onEquip, onRemove, onIdentify, canEquip, canAffordIdentify, identifyCost }) => {\n  const { t, language } = useI18n();");

memContent = memContent.replace(/\{\(window as any\)\.__lang === 'en' \? 'Unidentified Memory' : '未鑑定の記憶'\}/g, "{t('inv_unidentified')}");
memContent = memContent.replace(/\{\(window as any\)\.__lang === 'en' \? flavorText\.itemNameEn : flavorText\.itemName\}/g, "{language === 'en' && flavorText.itemNameEn ? flavorText.itemNameEn : flavorText.itemName}");
memContent = memContent.replace(/\{\(window as any\)\.__lang === 'en' \? flavorText\.originTextEn : flavorText\.originText\}/g, "{language === 'en' && flavorText.originTextEn ? flavorText.originTextEn : flavorText.originText}");
memContent = memContent.replace(/\{\(window as any\)\.__lang === 'en' \? flavorText\.priestMemoEn : \`「\$\{flavorText\.priestMemo\}」\`\}/g, "{language === 'en' && flavorText.priestMemoEn ? flavorText.priestMemoEn : `「${flavorText.priestMemo}」`}");

memContent = memContent.replace(/\{\(window as any\)\.__lang === 'en' \? 'Rarity: ' : 'レアリティ: '\}/g, "{t('detail_rarity')} ");
memContent = memContent.replace(/\{\(window as any\)\.__lang === 'en' \? 'Category: ' : 'カテゴリ: '\}/g, "{t('detail_category')} ");
memContent = memContent.replace(/\{\(window as any\)\.__lang === 'en' \? 'Cost: ' : 'コスト: '\}/g, "{t('detail_cost')} ");
memContent = memContent.replace(/\{\(window as any\)\.__lang === 'en' \? 'Equip Effects' : '装備効果'\}/g, "{t('detail_equip_effect')}");
memContent = memContent.replace(/\{\(window as any\)\.__lang === 'en' \? 'Enchanted Spell' : '付与魔法'\}/g, "{t('detail_spell')}");
memContent = memContent.replace(/\{\(window as any\)\.__lang === 'en' \? 'MP Cost:' : '消費MP:'\}/g, "{t('detail_mp_cost')}");

memContent = memContent.replace(/\[ \{\(window as any\)\.__lang === 'en' \? 'Unequip' : '外す'\} \]/g, "[ {t('btn_unequip')} ]");
memContent = memContent.replace(/\[ \{\(window as any\)\.__lang === 'en' \? 'Equip' : '装備する'\} \]/g, "[ {t('btn_equip')} ]");
memContent = memContent.replace(/\[ \{\(window as any\)\.__lang === 'en' \? \`Identify \(\$\{identifyCost\} En\)\` : \`鑑定する\(\{identifyCost\} En\)\`\} \]/g, "[ {t('btn_identify', { cost: identifyCost })} ]");

fs.writeFileSync('src/components/MemoryDetail.tsx', memContent);

// Fix identify string in App.tsx just in case
let app = fs.readFileSync('src/App.tsx', 'utf8');
app = app.replace(/\[ 鑑定する\(\{cost\} En\) \]/g, "[ {t('btn_identify', { cost })} ]");
fs.writeFileSync('src/App.tsx', app);

console.log('Components refactored to use t().');
