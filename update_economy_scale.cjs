const fs = require('fs');

// 1. Update useEconomy.ts
let ecoContent = fs.readFileSync('src/hooks/useEconomy.ts', 'utf8');

const oldGetBasePrice = `export const getMemoryBasePrice = (cost: number): number => {
  return Math.floor(Math.pow(cost, 2) * 20 + cost * 50);
};`;

const newGetBasePrice = `export const getMemoryBasePrice = (cost: number): number => {
  return Math.floor(Math.pow(cost, 2.5) * 150 + cost * 500);
};`;

if (ecoContent.includes(oldGetBasePrice)) {
  ecoContent = ecoContent.replace(oldGetBasePrice, newGetBasePrice);
  fs.writeFileSync('src/hooks/useEconomy.ts', ecoContent);
  console.log('Updated useEconomy.ts');
}

// 2. Update App.tsx
let appContent = fs.readFileSync('src/App.tsx', 'utf8');

// Replace Sell Formula
const oldSellAction = `const sellPrice = Math.floor(Math.pow(mem.cost, 2) * 20 + mem.cost * 50);`;
const newSellAction = `const sellPrice = Math.floor(Math.pow(mem.cost, 2.5) * 150 + mem.cost * 500);`;
if (appContent.includes(oldSellAction)) {
  appContent = appContent.replace(oldSellAction, newSellAction);
}

// Replace BuyBack Formula
const oldBuyBackAction = `const basePrice = Math.floor(Math.pow(mem.cost, 2) * 20 + mem.cost * 50);`;
const newBuyBackAction = `const basePrice = Math.floor(Math.pow(mem.cost, 2.5) * 150 + mem.cost * 500);`;
if (appContent.includes(oldBuyBackAction)) {
  appContent = appContent.replace(oldBuyBackAction, newBuyBackAction);
}

fs.writeFileSync('src/App.tsx', appContent);
console.log('Updated App.tsx');
