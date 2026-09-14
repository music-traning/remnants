const fs = require('fs');

let c = fs.readFileSync('src/components/InventoryView.tsx', 'utf8');
c = c.replace(/\? \(m\.attachedSpell \? '☁E : ''\)/g, "? (m.attachedSpell ? '☁' : '')");
fs.writeFileSync('src/components/InventoryView.tsx', c);

let a = fs.readFileSync('src/App.tsx', 'utf8');
a = a.replace(/\{mem\.attachedSpell \? '☁E' : ''\}/g, "{mem.attachedSpell ? '☁' : ''}");
fs.writeFileSync('src/App.tsx', a);
