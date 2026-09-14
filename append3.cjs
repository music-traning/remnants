const fs = require('fs');

['src/locales/ja.ts', 'src/locales/en.ts'].forEach(f => {
  let c = fs.readFileSync(f, 'utf8');
  c = c.replace(/};\s*$/, '  sys_confirm_load: "Load data from SLOT {slot}?",\n  ui_depth: "[ Depth: {depth} ]",\n  sys_no_data: "NO DATA",\n};\n');
  fs.writeFileSync(f, c);
});
