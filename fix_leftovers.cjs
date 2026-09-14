const fs = require('fs');

// --- App.tsx ---
let app = fs.readFileSync('src/App.tsx', 'utf8');

app = app.replace(/'インベントリ（装備）'/g, "'inventory'");
app = app.replace(/>鑑定<\/button>/g, ">{t('priest_identify').split(' ')[0]}</button>");
app = app.replace(/\[ 鑑定する \(\{cost\} En\) \]/g, "[ {t('priest_identify', { cost })} ]");
app = app.replace(/\[元記憶Cost: \{mem\.cost\} による効力\]/g, "{t('mag_effect', { cost: mem.cost })}");
app = app.replace(/が立ちはだかる……/g, "{t('ui_stands')}");

fs.writeFileSync('src/App.tsx', app);

// --- useGameLoop.ts ---
let gl = fs.readFileSync('src/hooks/useGameLoop.ts', 'utf8');

gl = gl.replace(/addLog\('這うようにして街へ逃げ帰った。HPが全回復し、手持ちの縁を半分失った…'\);/g, "addLog(t('gl_wipeout'));");
gl = gl.replace(/addLog\(\`魔物と遭遇した！\\(深度: \$\{currentDepth\}\\)\`\);/g, "addLog(t('gl_encounter', { depth: currentDepth }));");
gl = gl.replace(/addLog\(\`探索を進めた。\\(深度: \$\{currentDepth\}\\)\`\);/g, "addLog(t('gl_explore_more', { depth: currentDepth }));");
gl = gl.replace(/addLog\('逃走に失敗し、背後から致命傷を受けた……'\);/g, "addLog(t('gl_flee_fail'));");

gl = gl.replace(/itemName: '『俺が失う前の記憶』',/g, "itemName: t('gl_boss_item'),");
gl = gl.replace(/'…まさか、これを本当に見つけるとはな。だが、お前が誰だったかを知って、どうなるというのだ……'/g, "t('gl_boss_item_priest')");
gl = gl.replace(/addLog\(\`『俺が失う前の記憶』を手に入れた……。\`\);/g, "addLog(t('gl_boss_drop'));");
gl = gl.replace(/addLog\(\`インベントリが満杯で『俺が失う前の記憶』を拾えなかった……！\`\);/g, "addLog(t('gl_boss_drop_full'));");
gl = gl.replace(/addLog\(\`「未鑑定の記憶」を拾い、インベントリに収納した。\`\)/g, "addLog(t('gl_unidentified_drop'))");
gl = gl.replace(/addLog\(\`持ち物がいっぱいで記憶を拾えなかった…。\`\)/g, "addLog(t('gl_inv_full_drop'))");
gl = gl.replace(/addLog\(\`【呪い】『俺が失う前の記憶』の強烈な負荷により、戦闘中に命が削られた！\`\);/g, "addLog(t('gl_curse_dmg'));");

gl = gl.replace(/msg = \`\$\{spell\.name\}！HPが \$\{healAmount\} 回復した。\`/g, "msg = t('gl_magic_heal', { name: spell.name, heal: healAmount })");
gl = gl.replace(/msg = \`\$\{spell\.name\}！攻撃力が上昇した……（深度 \$\{\(costAmount \* 5\)\/5\} 進むまで）\`/g, "msg = t('gl_magic_atkup', { name: spell.name, dur: (costAmount * 5)/5 })");
gl = gl.replace(/msg = \`\$\{spell\.name\}！防御力が上昇した……（深度 \$\{\(costAmount \* 5\)\/5\} 進むまで）\`/g, "msg = t('gl_magic_defup', { name: spell.name, dur: (costAmount * 5)/5 })");
gl = gl.replace(/msg = \`\$\{spell\.name\}！素早さが上昇した……（深度 \$\{\(costAmount \* 5\)\/5\} 進むまで）\`/g, "msg = t('gl_magic_spdup', { name: spell.name, dur: (costAmount * 5)/5 })");
gl = gl.replace(/msg = \`\$\{spell\.name\}！縁を消費せずに街へ帰還する……。\`/g, "msg = t('gl_magic_return', { name: spell.name })");
gl = gl.replace(/msg = \`\$\{spell\.name\}！敵に \$\{combatDmgToEnemy\} の魔法大ダメージ！\`/g, "msg = t('gl_magic_atk', { name: spell.name, dmg: combatDmgToEnemy })");
gl = gl.replace(/addLog\(\`\$\{currentEnemy\.name\} は耐え抜き、反撃してきた……\$\{dmgToPlayer\} のダメージ！\`\);/g, "addLog(t('gl_magic_rebound', { name: currentEnemy.name, dmg: dmgToPlayer }));");

gl = gl.replace(/addLog\(\`【業の強制取り立て】縁が不足している…。破戒僧が無理やり倉庫を探り、未装備の記憶を \$\{itemsDestroyed\} 個没収した。\`\);/g, "addLog(t('gl_karma_items', { count: itemsDestroyed }));");
gl = gl.replace(/addLog\(\`【業の強制取り立て】没収できる記憶が足りない。破戒僧はお前の肉体に呪いを刻み、最大HPを \$\{hpPenalty\} 減少させた…\`\);/g, "addLog(t('gl_karma_hp', { penalty: hpPenalty }));");
gl = gl.replace(/addLog\('「対価もなしに帰れると思ったか？この世界は甘くないのだよ」'\);/g, "addLog(t('gl_karma_msg'));");

fs.writeFileSync('src/hooks/useGameLoop.ts', gl);
