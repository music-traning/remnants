const fs = require('fs');

const jaKeys = `  sys_install: "{itemName} をインストールしました。",
  sys_uninstall: "{itemName} をアンインストールしました。",
  sys_discard: "{itemName} を破棄しました。",
  sys_sell: "{itemName} を {price} 縁で売却しました。",
  sys_buy: "{itemName} を {price} 縁で買い戻しました。",
`;

const enKeys = `  sys_install: "Installed {itemNameEn}.",
  sys_uninstall: "Uninstalled {itemNameEn}.",
  sys_discard: "Discarded {itemNameEn}.",
  sys_sell: "Sold {itemNameEn} for {price} En.",
  sys_buy: "Bought back {itemNameEn} for {price} En.",
`;

['src/locales/ja.ts', 'src/locales/en.ts'].forEach(f => {
  let c = fs.readFileSync(f, 'utf8');
  let keys = f.includes('ja.ts') ? jaKeys : enKeys;
  c = c.replace(/};\s*$/, keys + '};\n');
  fs.writeFileSync(f, c);
});
