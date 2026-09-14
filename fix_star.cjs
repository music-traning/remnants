const fs = require('fs');
let content = fs.readFileSync('src/components/InventoryView.tsx', 'utf8');
content = content.replace(/☁E/g, '★ ');
fs.writeFileSync('src/components/InventoryView.tsx', content);

let appContent = fs.readFileSync('src/App.tsx', 'utf8');
appContent = appContent.replace(
  `<span>{mem.flavorText.itemName} (Cost: {mem.cost})</span>`,
  `<span>{mem.attachedSpell ? '★ ' : ''}{mem.flavorText.itemName} (Cost: {mem.cost})</span>`
);
fs.writeFileSync('src/App.tsx', appContent);
