const fs = require('fs');

let appContent = fs.readFileSync('src/App.tsx', 'utf8');

// 1. Update saveGame call
const oldSaveBtn = `saveGame(i + 1, player);`;
const newSaveBtn = `saveGame(i + 1, player, shopInventory);`;
if (appContent.includes(oldSaveBtn)) {
  appContent = appContent.replace(oldSaveBtn, newSaveBtn);
}

// 2. Update loadGame call
const oldLoadBtn = `const p = loadGame(i + 1);
                                if (p) {
                                  setPlayer(p);
                                  setActiveOverlay(null);
                                  actions.addLog(\`SLOT \${i + 1} からロードしました。\`);
                                }`;
const newLoadBtn = `const data = loadGame(i + 1);
                                if (data) {
                                  // Backwards compatibility check in case old save data format was just returning player implicitly
                                  const p = data.player || data;
                                  setPlayer(p);
                                  setShopInventory(data.shopInventory || []);
                                  setActiveOverlay(null);
                                  actions.addLog(\`SLOT \${i + 1} からロードしました。\`);
                                }`;
if (appContent.includes(oldLoadBtn)) {
  appContent = appContent.replace(oldLoadBtn, newLoadBtn);
}

fs.writeFileSync('src/App.tsx', appContent);
console.log('Updated App.tsx to save and load shopInventory.');
