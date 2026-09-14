const fs = require('fs');

let appContent = fs.readFileSync('src/App.tsx', 'utf8');

const brokenLine = `▶ {t('閻魔の計量所（{(window as any).__lang === 'en' ? 'Sell' : '売却'}）', 'Enma Station (Sell)')}`;
const fixedLine = `▶ {t('閻魔の計量所（売却）', 'Enma Station (Sell)')}`;

if (appContent.includes(brokenLine)) {
  appContent = appContent.replace(brokenLine, fixedLine);
  fs.writeFileSync('src/App.tsx', appContent);
} else {
  // Let's just use regex to fix any corrupted t() calls
  appContent = appContent.replace(/\{t\('閻魔の計量所（\{\(window as any\)\.__lang === 'en' \? 'Sell' : '売却'\}）', 'Enma Station \(Sell\)'\)\}/, "{t('閻魔の計量所（売却）', 'Enma Station (Sell)')}");
  fs.writeFileSync('src/App.tsx', appContent);
}
