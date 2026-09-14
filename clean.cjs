const fs = require('fs');
['src/locales/ja.ts', 'src/locales/en.ts'].forEach(f => {
  let c = fs.readFileSync(f, 'utf8');
  c = c.replace(/};\n/g, '');
  c = c.replace(/};\r\n/g, '');
  c = c.replace(/};\\n/g, '');
  fs.writeFileSync(f, c);
});
