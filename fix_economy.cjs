const fs = require('fs');

let ecoContent = fs.readFileSync('src/hooks/useEconomy.ts', 'utf8');

const missingFunc = `export const getMemoryBasePrice = (cost: number): number => {
  return Math.floor(Math.pow(cost, 2.5) * 150 + cost * 500);
};

export const useEconomy = (`;

ecoContent = ecoContent.replace('export const useEconomy = (', missingFunc);
fs.writeFileSync('src/hooks/useEconomy.ts', ecoContent);
console.log('Fixed useEconomy.ts');
