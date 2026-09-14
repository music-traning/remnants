const fs = require('fs');
let appContent = fs.readFileSync('src/App.tsx', 'utf8');

// Also need to import getMemoryBasePrice if it's exported from useEconomy?
// Yes, or I can just re-implement the formula in App.tsx for the UI.
// It's easier to just compute it in App.tsx for the inline action UI to avoid messing with imports.

// 1. Update Sell UI
const oldSellAction = `inlineAction={(mem) => (
                          <button className="cmd-btn" style={{ borderColor: '#f00', color: '#f00', width: 'auto', padding: '2px 8px', fontSize: '0.8rem', marginLeft: '8px' }} onClick={(e) => { e.stopPropagation(); handleSell(mem); }}>
                            売却 (+{mem.baseValue} En)
                          </button>
                        )}`;

const newSellAction = `inlineAction={(mem) => {
                          const sellPrice = Math.floor(Math.pow(mem.cost, 2) * 20 + mem.cost * 50);
                          return (
                            <button className="cmd-btn" style={{ borderColor: '#f00', color: '#f00', width: 'auto', padding: '2px 8px', fontSize: '0.8rem', marginLeft: '8px' }} onClick={(e) => { e.stopPropagation(); handleSell(mem); }}>
                              売却 (+{sellPrice} En)
                            </button>
                          );
                        }}`;
appContent = appContent.replace(oldSellAction, newSellAction);


// 2. Update BuyBack UI
const oldBuyBackAction = `inlineAction={(mem) => {
                    const cost = Math.floor(mem.baseValue * 1.5);
                    const canAfford = player.currentEn >= cost;`;

const newBuyBackAction = `inlineAction={(mem) => {
                    const basePrice = Math.floor(Math.pow(mem.cost, 2) * 20 + mem.cost * 50);
                    const cost = Math.floor(basePrice * 1.5);
                    const canAfford = player.currentEn >= cost;`;
appContent = appContent.replace(oldBuyBackAction, newBuyBackAction);

fs.writeFileSync('src/App.tsx', appContent);
console.log('Updated App.tsx to show cost-based pricing.');
