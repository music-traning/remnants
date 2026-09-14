const fs = require('fs');

// 1. Update App.tsx to remove / increase maxWidth
let appContent = fs.readFileSync('src/App.tsx', 'utf8');

const oldContainer = `<div style={{ padding: '16px', maxWidth: '1200px', margin: '0 auto', height: '100vh', boxSizing: 'border-box', display: 'flex', flexDirection: 'column' }}>`;
const newContainer = `<div style={{ padding: '16px', maxWidth: '1600px', margin: '0 auto', height: '100vh', boxSizing: 'border-box', display: 'flex', flexDirection: 'column' }}>`;
appContent = appContent.replace(oldContainer, newContainer);
fs.writeFileSync('src/App.tsx', appContent);

// 2. Update index.css to default to 3 columns for .cmd-grid
let cssContent = fs.readFileSync('src/index.css', 'utf8');

const oldCmdGrid = `.cmd-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}`;
const newCmdGrid = `.cmd-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 8px;
}`;

cssContent = cssContent.replace(oldCmdGrid, newCmdGrid);
fs.writeFileSync('src/index.css', cssContent);

console.log('App width increased and cmd-grid updated to auto-fit columns.');
