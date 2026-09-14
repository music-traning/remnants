const fs = require('fs');

['src/locales/ja.ts', 'src/locales/en.ts'].forEach(f => {
  let c = fs.readFileSync(f, 'utf8');
  c = c.replace(/  sys_save: "SLOT.*",\n/g, '');
  c = c.replace(/  sys_load: "SLOT.*",\n/g, '');
  c = c.replace(/  sys_confirm_load: "SLOT.*",\n/g, '');
  
  c = c.replace(/  sys_save: "Saved to SLOT.*",\n/g, '');
  c = c.replace(/  sys_load: "Loaded from SLOT.*",\n/g, '');
  c = c.replace(/  sys_confirm_load: "Load data from SLOT.*",\n/g, '');
  fs.writeFileSync(f, c);
});
