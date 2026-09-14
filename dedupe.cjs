const fs = require('fs');

['src/locales/ja.ts', 'src/locales/en.ts'].forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let dict = {};
  
  content.split('\n').forEach(line => {
    // skip comments or empty
    if (!line.trim() || line.trim().startsWith('//') || line.trim().startsWith('export') || line.trim().startsWith('}')) return;
    
    // Match key: value
    const match = line.match(/^\s*([a-zA-Z0-9_]+)\s*:\s*(.*)$/);
    if (match) {
      const key = match[1];
      let val = match[2];
      
      // If the line ended with comma, keep it, else add it just to be safe
      if (!val.endsWith(',')) {
        val += ',';
      }
      
      // we take the LAST definition to overwrite the earlier ones
      dict[key] = val;
    }
  });

  const output = `export const ${file.includes('ja.ts') ? 'ja' : 'en'} = {\n` + 
    Object.entries(dict).map(([k, v]) => `  ${k}: ${v}`).join('\n') + 
    '\n};\n';
    
  fs.writeFileSync(file, output);
});
