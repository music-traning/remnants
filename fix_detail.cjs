const fs = require('fs');

let c = fs.readFileSync('src/components/MemoryDetail.tsx', 'utf8');

c = c.replace(/何かの念がこもって.*ようだ…/, "{t('mem_unidentified_desc')}");
c = c.replace(/破戒僧のメモ/, "{t('mem_priest_label')}");
c = c.replace(/「持ち込まれても.*からんぞ。まずは鑑定しろ。.*」/, "{t('mem_priest_unidentified')}");
c = c.replace(/破戒僧のメモ/, "{t('mem_priest_label')}");
c = c.replace(/【エンチャント魔法.*/, "【 {t('mem_enchant')} 】</div>");
c = c.replace(/呪ぁE>💀/, "呪い\">💀");
c = c.replace(/ↁE : 'ↁE/, "↑' : '↓'");

// Also use proper dynamic property evaluation for name, origin, memo
// The logic is already partly there:
// language === 'en' && flavorText.itemNameEn ? flavorText.itemNameEn : flavorText.itemName
// But we should make it foolproof. We can leave it as is or fix it.
// The user says "const displayName = currentLang === 'en' ? (item.itemNameEn || item.itemName) : item.itemName;"

fs.writeFileSync('src/components/MemoryDetail.tsx', c);
