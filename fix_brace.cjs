const fs = require('fs');
['src/locales/ja.ts', 'src/locales/en.ts'].forEach(f => {
  let c = fs.readFileSync(f, 'utf8');
  c = c.replace(/\\n};\\n/g, '\n};\n');
  fs.writeFileSync(f, c);
});
