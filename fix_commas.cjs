const fs = require('fs');
let ja = fs.readFileSync('src/locales/ja.ts', 'utf8');
ja = ja.replace(/データを削除しますか？"\r?\n  \/\/ Missing/, 'データを削除しますか？",\n  // Missing');
fs.writeFileSync('src/locales/ja.ts', ja);

let en = fs.readFileSync('src/locales/en.ts', 'utf8');
en = en.replace(/SLOT \{\{slot\}\}\?"\r?\n  \/\/ Missing/, 'SLOT {{slot}}?",\n  // Missing');
fs.writeFileSync('src/locales/en.ts', en);
