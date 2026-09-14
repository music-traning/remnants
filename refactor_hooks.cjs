const fs = require('fs');

function refactorFile(path) {
  let c = fs.readFileSync(path, 'utf8');

  // Fix import for LogEntry
  if (!c.includes('import type { LogEntry }')) {
    c = c.replace(/import type \{ (.*) \} from '\.\.\/types\/game';/, "import type { $1 } from '../types/game';\nimport type { LogEntry } from './useGameLoop';");
  }

  // Change ActionResult signature
  c = c.replace(/message: string;/g, "message: string | LogEntry;");

  // Fix corrupted strings and logic in useMemoryManagement
  if (path.includes('useMemoryManagement')) {
    c = c.replace(/itemName: \`【呪.*/, "itemName: `【呪】${identifiedMemory.flavorText.itemName}`,\n        itemNameEn: `[Cursed] ${identifiedMemory.flavorText.itemNameEn || identifiedMemory.flavorText.itemName}`,");
    c = c.replace(/priestMemo: identifiedMemory\.flavorText\.priestMemo.*老.*/, "priestMemo: identifiedMemory.flavorText.priestMemo + ' さらに呪い付きだ。どうかしてる。',\n        priestMemoEn: (identifiedMemory.flavorText.priestMemoEn || identifiedMemory.flavorText.priestMemo) + ' It is also cursed. You must be crazy.',");

    c = c.replace(/return \{ success: true, message: \`\$\{target\.flavorText\.itemName\} をインスト.*\` \};/g, 
      "return { success: true, message: { key: 'sys_install', params: { itemName: target.flavorText.itemName, itemNameEn: target.flavorText.itemNameEn } } };");

    c = c.replace(/return \{ success: true, message: \`\$\{target\.flavorText\.itemName\} をアンインスト.*\` \};/g, 
      "return { success: true, message: { key: 'sys_uninstall', params: { itemName: target.flavorText.itemName, itemNameEn: target.flavorText.itemNameEn } } };");

    c = c.replace(/return \{ success: true, message: \`\$\{target\.flavorText\?\.itemName \|\| '記.*\} を破.*\` \};/g, 
      "return { success: true, message: { key: 'sys_discard', params: { itemName: target.flavorText?.itemName || '記憶', itemNameEn: target.flavorText?.itemNameEn || 'Memory' } } };");
  }

  // Fix corrupted strings in useEconomy
  if (path.includes('useEconomy')) {
    c = c.replace(/return \{ success: true, message: \`\$\{target\.flavorText\?\.itemName \|\| '未.*\} .* \$\{sellPrice\} 縁で売.*\` \};/g, 
      "return { success: true, message: { key: 'sys_sell', params: { itemName: target.flavorText?.itemName || '未鑑定の記憶', itemNameEn: target.flavorText?.itemNameEn || 'Unidentified Memory', price: sellPrice } } };");

    c = c.replace(/return \{ success: true, message: \`\$\{target\.flavorText\?\.itemName \|\| '未.*\} .* \$\{buyPrice\} 縁で買.*\` \};/g, 
      "return { success: true, message: { key: 'sys_buy', params: { itemName: target.flavorText?.itemName || '未鑑定の記憶', itemNameEn: target.flavorText?.itemNameEn || 'Unidentified Memory', price: buyPrice } } };");
  }

  fs.writeFileSync(path, c);
}

refactorFile('src/hooks/useMemoryManagement.ts');
refactorFile('src/hooks/useEconomy.ts');
