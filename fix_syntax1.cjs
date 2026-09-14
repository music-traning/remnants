const fs = require('fs');

let appContent = fs.readFileSync('src/App.tsx', 'utf8');

const brokenLine1 = `                        {expandCost === null ? '{(window as any).__lang === 'en' ? '▶ Stash fully expanded' : '▶ 倉庫は最大まで拡張済み'}' : \`{(window as any).__lang === 'en' ? '▶ Expand Stash' : '▶ 倉庫を拡張する'} (\${expandCost} En)\`}
`;
const fixedLine1 = `                        {expandCost === null ? ((window as any).__lang === 'en' ? '▶ Stash fully expanded' : '▶ 倉庫は最大まで拡張済み') : ((window as any).__lang === 'en' ? \`▶ Expand Stash (\${expandCost} En)\` : \`▶ 倉庫を拡張する (\${expandCost} En)\`)}
`;
appContent = appContent.replace(brokenLine1, fixedLine1);

// Also check line 601
// line 601 is probably around town commands
fs.writeFileSync('src/App.tsx', appContent);
