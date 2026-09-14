const fs = require('fs');

let appContent = fs.readFileSync('src/App.tsx', 'utf8');

const oldStatus = `<div style={{ fontSize: '1.1rem', lineHeight: '2' }}>
            <div>Lv: {player.level}</div>
            <div style={{ fontSize: '0.8rem', color: '#ccc' }}>EXP: {player.currentEXP} / {nextExpNeeded}</div>
            <div>HP: {player.currentHP} / {player.maxHP}</div>
            <div>MP: {player.currentMP} / {player.maxMP}</div>
            <div className="text-green">En: {player.currentEn}</div>
            <div style={{ color: inventoryCount >= player.maxInventorySize ? '#f00' : '#fff' }}>
              ITEM: {inventoryCount} / {player.maxInventorySize}
            </div>
            <div>COST: {currentCost} / {player.totalCapacity}</div>
          </div>`;

const newStatus = `<div className="status-grid">
            <div>Lv: {player.level}</div>
            <div style={{ fontSize: '0.8rem', color: '#ccc' }}>EXP: {player.currentEXP} / {nextExpNeeded}</div>
            <div>HP: {player.currentHP} / {player.maxHP}</div>
            <div>MP: {player.currentMP} / {player.maxMP}</div>
            <div className="text-green">En: {player.currentEn}</div>
            <div style={{ color: inventoryCount >= player.maxInventorySize ? '#f00' : '#fff' }}>
              ITEM: {inventoryCount} / {player.maxInventorySize}
            </div>
            <div>COST: {currentCost} / {player.totalCapacity}</div>
          </div>`;

if (appContent.includes(oldStatus)) {
  appContent = appContent.replace(oldStatus, newStatus);
  fs.writeFileSync('src/App.tsx', appContent);
  console.log('App.tsx updated for status-grid.');
} else {
  console.log('Could not find status div');
}

let cssContent = fs.readFileSync('src/index.css', 'utf8');

const statusCss = `
.status-grid {
  font-size: 1.1rem;
  line-height: 2;
  display: flex;
  flex-direction: column;
}

@media (max-width: 768px), (max-height: 450px) {
  .status-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0;
    line-height: 1.5;
  }
}
`;

if (!cssContent.includes('.status-grid {')) {
  cssContent += statusCss;
  fs.writeFileSync('src/index.css', cssContent);
} else {
  // Replace the old status grid if it exists
  cssContent = cssContent.replace(/\.status-grid \{[\s\S]*?\n\}\n/g, statusCss);
  fs.writeFileSync('src/index.css', cssContent);
}
