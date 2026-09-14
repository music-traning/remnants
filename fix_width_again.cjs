const fs = require('fs');

// 1. App.tsx: Make container 100% width
let appContent = fs.readFileSync('src/App.tsx', 'utf8');

const oldContainer = `<div style={{ padding: '16px', maxWidth: '1600px', margin: '0 auto', height: '100vh', boxSizing: 'border-box', display: 'flex', flexDirection: 'column' }}>`;
const newContainer = `<div style={{ padding: '16px', width: '100%', maxWidth: '100%', margin: '0', height: '100vh', boxSizing: 'border-box', display: 'flex', flexDirection: 'column' }}>`;

if (appContent.includes(oldContainer)) {
  appContent = appContent.replace(oldContainer, newContainer);
  fs.writeFileSync('src/App.tsx', appContent);
}

// 2. index.css: Fix cmd-grid to never collapse to 1 column
let cssContent = fs.readFileSync('src/index.css', 'utf8');

const oldCmdGrid = `.cmd-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 8px;
}`;
const newCmdGrid = `.cmd-grid {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 8px;
}`;

if (cssContent.includes(oldCmdGrid)) {
  cssContent = cssContent.replace(oldCmdGrid, newCmdGrid);
  fs.writeFileSync('src/index.css', cssContent);
}

console.log('Fixed width and cmd-grid columns.');
