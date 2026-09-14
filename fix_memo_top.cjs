const fs = require('fs');

let c = fs.readFileSync('src/components/MemoryDetail.tsx', 'utf8');

// Add priestLabelTop
c = c.replace(
  "const displayMemo = language === 'en' ? (flavorText?.priestMemoEn || flavorText?.priestMemo) : flavorText?.priestMemo;",
  "const displayMemo = language === 'en' ? (flavorText?.priestMemoEn || flavorText?.priestMemo) : flavorText?.priestMemo;\n  const priestLabelTop = language === 'ja' ? '-20px' : '-10px';"
);

// Replace the two occurrences of top: '-10px'
c = c.replace(/top:\s*'-10px'/g, "top: priestLabelTop");
// Note: for the unidentified block, it might not have priestLabelTop if I put it below, wait, I put it below the first block?
// No, the first block is `!isIdentified`. The variable declarations are before it! So `priestLabelTop` will be accessible to both.

// Also wait, I see `『{t('mem_enchant')} 』` and `「${displayMemo}」` might be corrupted due to PowerShell output. Let's fix them too.
c = c.replace(/、E\{t\('mem_enchant'\)\} 、E\/div>/g, "『{t('mem_enchant')}』</div>");
c = c.replace(/`、E\{displayMemo\}」`/g, "`「${displayMemo}」`");

fs.writeFileSync('src/components/MemoryDetail.tsx', c);
