const fs = require('fs');

let m = fs.readFileSync('src/hooks/useMemoryManagement.ts', 'utf8');

m = m.replace(/itemNameEn: target\.flavorText\.itemNameEn(?! \|\|)/g, "itemNameEn: target.flavorText.itemNameEn || target.flavorText.itemName");
m = m.replace(/itemNameEn: target\.flavorText\?\.itemNameEn(?! \|\|)/g, "itemNameEn: target.flavorText?.itemNameEn || target.flavorText?.itemName || 'Memory'");

fs.writeFileSync('src/hooks/useMemoryManagement.ts', m);

let e = fs.readFileSync('src/hooks/useEconomy.ts', 'utf8');
e = e.replace(/itemNameEn: target\.flavorText\?\.itemNameEn(?! \|\|)/g, "itemNameEn: target.flavorText?.itemNameEn || target.flavorText?.itemName || 'Memory'");
fs.writeFileSync('src/hooks/useEconomy.ts', e);
