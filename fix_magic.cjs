const fs = require('fs');

let c = fs.readFileSync('src/hooks/useGameLoop.ts', 'utf8');

c = c.replace(/msg = \`\$\{spell\.name\}.*HP.*\{healAmount\}.*回復した。\`;/, 
              "msg = { key: 'gl_magic_heal', params: { name: spell.name, heal: healAmount } };");

c = c.replace(/msg = \`\$\{spell\.name\}.*攻.*深度.*\`;/, 
              "msg = { key: 'gl_magic_atkup', params: { name: spell.name, dur: (costAmount * 5)/5 } };");

c = c.replace(/msg = \`\$\{spell\.name\}.*防.*深度.*\`;/, 
              "msg = { key: 'gl_magic_defup', params: { name: spell.name, dur: (costAmount * 5)/5 } };");

c = c.replace(/msg = \`\$\{spell\.name\}.*素.*深度.*\`;/, 
              "msg = { key: 'gl_magic_spdup', params: { name: spell.name, dur: (costAmount * 5)/5 } };");

c = c.replace(/msg = \`\$\{spell\.name\}.*帰.*\`;/, 
              "msg = { key: 'gl_magic_return', params: { name: spell.name } };");

c = c.replace(/msg = \`\$\{spell\.name\}.*敵に \$\{combatDmgToEnemy\}.*\`;/, 
              "msg = { key: 'gl_magic_atk', params: { name: spell.name, dmg: combatDmgToEnemy } };");


fs.writeFileSync('src/hooks/useGameLoop.ts', c);
