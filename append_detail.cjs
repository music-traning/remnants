const fs = require('fs');

const jaKeys = `  mem_unidentified_desc: "何かの念がこもっているようだ…",
  mem_priest_label: "破戒僧のメモ",
  mem_priest_unidentified: "「持ち込まれても分からんぞ。まずは鑑定しろ。」",
  mem_enchant: "エンチャント魔法",
`;

const enKeys = `  mem_unidentified_desc: "It seems to hold some sort of malice...",
  mem_priest_label: "Corrupt Priest's Memo",
  mem_priest_unidentified: "'I don't know what this is. Get it identified first.'",
  mem_enchant: "Enchantment Magic",
`;

['src/locales/ja.ts', 'src/locales/en.ts'].forEach(f => {
  let c = fs.readFileSync(f, 'utf8');
  let keys = f.includes('ja.ts') ? jaKeys : enKeys;
  c = c.replace(/};\s*$/, keys + '};\n');
  fs.writeFileSync(f, c);
});
