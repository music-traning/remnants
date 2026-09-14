const fs = require('fs');

// 1. Update index.css
let cssContent = fs.readFileSync('src/index.css', 'utf8');

const statusGridCSS = `
.status-grid {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.status-grid p {
  margin: 0;
}

@media (max-width: 768px), (max-height: 450px) {
  .status-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px;
  }
}
`;

if (!cssContent.includes('.status-grid')) {
  cssContent += statusGridCSS;
  fs.writeFileSync('src/index.css', cssContent);
}

// 2. Update App.tsx
let appContent = fs.readFileSync('src/App.tsx', 'utf8');

const oldStatus = `<h3 style={{ margin: '0 0 16px 0', borderBottom: '1px solid #aaa', paddingBottom: '8px' }}>STATUS</h3>
          <p>Lv: {player.level}</p>
          <p>EXP: {player.currentEXP} / {player.level * 100}</p>
          <p>HP: {player.currentHP} / {player.maxHP}</p>
          <p>MP: {player.currentMP} / {player.maxMP}</p>
          <p className="text-green">En: {player.currentEn}</p>
          <p>ITEM: {player.inventory.length} / {player.maxInventorySize}</p>
          <p>COST: {currentCost} / {player.totalCapacity}</p>`;

const newStatus = `<h3 style={{ margin: '0 0 16px 0', borderBottom: '1px solid #aaa', paddingBottom: '8px' }}>STATUS</h3>
          <div className="status-grid">
            <p>Lv: {player.level}</p>
            <p>EXP: {player.currentEXP} / {player.level * 100}</p>
            <p>HP: {player.currentHP} / {player.maxHP}</p>
            <p>MP: {player.currentMP} / {player.maxMP}</p>
            <p className="text-green">En: {player.currentEn}</p>
            <p>ITEM: {player.inventory.length} / {player.maxInventorySize}</p>
            <p>COST: {currentCost} / {player.totalCapacity}</p>
          </div>`;

if (appContent.includes(oldStatus)) {
  appContent = appContent.replace(oldStatus, newStatus);
  fs.writeFileSync('src/App.tsx', appContent);
  console.log('App.tsx status pane updated.');
} else {
  console.log('Could not find status pane in App.tsx');
}
