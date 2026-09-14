const fs = require('fs');
let appContent = fs.readFileSync('src/App.tsx', 'utf8');

// Fix dangling strings from previous regex
appContent = appContent.replace(/\{t\('btn_sell', \{ price: sellPrice \}\)\} \(\+\{sellPrice\} En\)/g, "{t('btn_sell', { price: sellPrice })}");
appContent = appContent.replace(/\{t\('btn_buyback_act', \{ price: cost \}\)\} \(-\{cost\} En\)/g, "{t('btn_buyback_act', { price: cost })}");

// Let's also translate the Close button properly
appContent = appContent.replace(/\[ \{\(window as any\)\.__lang === 'en' \? 'Close' : '閉じる'\} \]/g, "[ {t('close')} ]");

// Remove the old lang toggle since it's now in the header
const headerDivRegex = /<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderBottom: '2px solid #fff', paddingBottom: '8px', marginBottom: '16px' }}>[\s\S]*?<\/div>/;
appContent = appContent.replace(headerDivRegex, ""); // If it's still there

fs.writeFileSync('src/App.tsx', appContent);
