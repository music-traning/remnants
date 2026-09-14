const fs = require('fs');

let c = fs.readFileSync('src/hooks/useGameLoop.ts', 'utf8');

c = c.replace(/addLog\('這うようにして街へ.*'\);/g, "addLog({ key: 'gl_wipeout' });");
c = c.replace(/addLog\(`魔物と遭.*\\(深度: \$\{currentDepth\}\\)`\);/g, "addLog({ key: 'gl_encounter', params: { depth: currentDepth } });");
c = c.replace(/addLog\(`探索を進めた.*\\(深度: \$\{currentDepth\}\\)`\);/g, "addLog({ key: 'gl_explore_more', params: { depth: currentDepth } });");
c = c.replace(/addLog\('送Eに失敗し、背後から.*'\);/g, "addLog({ key: 'gl_flee_fail' });");
c = c.replace(/addLog\(`\$\{currentEnemy\.name\} は耐え抜き、反.* \$\{dmgToPlayer\} のダメージ.*`\);/g, "addLog({ key: 'gl_magic_rebound', params: { name: currentEnemy.name, dmg: dmgToPlayer } });");
c = c.replace(/addLog\(`【業の強制取り立て】没収できる記.*最大HP.* \$\{hpPenalty\} 減少させた.*`\);/g, "addLog({ key: 'gl_karma_hp', params: { penalty: hpPenalty } });");
c = c.replace(/addLog\('「対価もなしに帰れると思ったか.*'\);/g, "addLog({ key: 'gl_karma_msg' });");

fs.writeFileSync('src/hooks/useGameLoop.ts', c);
