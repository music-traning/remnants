const fs = require('fs');

let appContent = fs.readFileSync('src/App.tsx', 'utf8');

const oldGrid = `<div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '8px' }}>`;
const newGrid = `<div className="cmd-grid">`;

if (appContent.includes(oldGrid)) {
  appContent = appContent.replace(oldGrid, newGrid);
  fs.writeFileSync('src/App.tsx', appContent);
  console.log('App.tsx updated to use cmd-grid class.');
} else {
  console.log('Could not find oldGrid in App.tsx');
}
