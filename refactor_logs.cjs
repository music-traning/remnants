const fs = require('fs');
let c = fs.readFileSync('src/hooks/useGameLoop.ts', 'utf8');

// Define LogEntry
c = c.replace('export interface Enemy', "export interface LogEntry { key: string; params?: Record<string, string | number>; }\n\nexport interface Enemy");

// Change state type
c = c.replace("useState<string[]>([t('gl_town_stay')]);", "useState<(string | LogEntry)[]>([{ key: 'gl_town_stay' }]);");

// update addLog signature
c = c.replace(/const addLog = useCallback\(\(msg: string\) => {/g, "const addLog = useCallback((msg: string | LogEntry) => {");

// Change t(...) calls in addLog to { key: ..., params: ... }
c = c.replace(/addLog\(t\('([^']+)'\)\)/g, "addLog({ key: '$1' })");
c = c.replace(/addLog\(t\('([^']+)',\s*(\{.*?\})\)\)/g, "addLog({ key: '$1', params: $2 })");

// Wait, what about `msg = t(...)` for spells?
c = c.replace(/msg = t\('([^']+)',\s*(\{.*?\})\);/g, "msg = { key: '$1', params: $2 };");
c = c.replace(/msg = t\('([^']+)'\);/g, "msg = { key: '$1' };");

// Fix `let msg = '';` to `let msg: string | LogEntry = '';`
c = c.replace(/let msg = '';/g, "let msg: string | LogEntry = '';");

fs.writeFileSync('src/hooks/useGameLoop.ts', c);
