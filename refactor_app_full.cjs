const fs = require('fs');

let app = fs.readFileSync('src/App.tsx', 'utf8');

// Replacements in App.tsx
app = app.replace(/'システム'/g, "'system'");
app = app.replace(/'自身の状態を確認'/g, "'status'");
app = app.replace(/'インベントリ（装備変更）'/g, "'inventory'");
app = app.replace(/'破戒僧の庵'/g, "'priest'");
app = app.replace(/'閻魔の計量所'/g, "'enma'");
app = app.replace(/'記憶を買い戻す'/g, "'buyback'");
app = app.replace(/'倉庫'/g, "'stash'");
app = app.replace(/'微睡みの寝床'/g, "'inn'");
app = app.replace(/'魔法（スキル）'/g, "'magic'");
app = app.replace(/'迷宮の入り口'/g, "'dungeon'");

// The text UI inside the overlays
app = app.replace(/\[ 閉じる \]/g, "[ {t('sys_close')} ]");

// System menu
app = app.replace(/Lv: \{save\.player\.level\} \| 縁: \{save\.player\.currentEn\} En \| HP: \{save\.player\.currentHP\}\/\{save\.player\.maxHP\}/g, "{t('sys_lvl', { lvl: save.player.level })} | En: {save.player.currentEn} | HP: {save.player.currentHP}/{save.player.maxHP}");
app = app.replace(/最大深度: \{save\.player\.maxReachedDepth\} \| プレイ時間: \{formatTime\(save\.player\.playTimeSeconds\)\}/g, "{t('sys_max_depth', { depth: save.player.maxReachedDepth })} | {t('sys_playtime', { time: formatTime(save.player.playTimeSeconds) })}");

app = app.replace(/actions\.addLog\(\`SLOT \$\{i \+ 1\} にセーブしました。\`\)/g, "actions.addLog(t('sys_saved', { slot: i + 1 }))");
app = app.replace(/>セーブ<\/button>/g, ">{t('sys_save')}</button>");
app = app.replace(/if \(window\.confirm\(\`SLOT \$\{i \+ 1\} からロードしますか？\\n（現在の進行状況は失われます）\`\)\)/g, "if (window.confirm(t('sys_confirm_load', { slot: i + 1 })))");
app = app.replace(/actions\.addLog\(\`SLOT \$\{i \+ 1\} からロードしました。\`\)/g, "actions.addLog(t('sys_loaded', { slot: i + 1 }))");
app = app.replace(/>ロード<\/button>/g, ">{t('sys_load')}</button>");
app = app.replace(/if \(window\.confirm\(\`SLOT \$\{i \+ 1\} のデータを消去しますか？\`\)\)/g, "if (window.confirm(t('sys_confirm_erase', { slot: i + 1 })))");
app = app.replace(/actions\.addLog\(\`SLOT \$\{i \+ 1\} を消去しました。\`\)/g, "actions.addLog(t('sys_erased', { slot: i + 1 }))");
app = app.replace(/>消去<\/button>/g, ">{t('sys_erase')}</button>");

// Status
app = app.replace(/<p>装備中の記憶はありません。<\/p>/g, "<p>{t('stat_no_equip')}</p>");
app = app.replace(/\[ アンインストール（装備解除） \]/g, "[ {t('stat_unequip')} ]");

// Inventory
app = app.replace(/\[ インストール \(COST: \{mem\.cost\}, 必須Lv: \{reqLevel\}\) \]/g, "[ {t('inv_equip', { cost: mem.cost, reqLevel })} ]");
app = app.replace(/\[ 破棄 \]/g, "[ {t('inv_discard')} ]");

// Priest
app = app.replace(/▶ 脳の許容量を拡張 \(10,000 En\)/g, "{t('priest_expand_cap')}");
app = app.replace(/▶ 記憶スロットを拡張 \(100,000 En\)/g, "{t('priest_expand_slot')}");
app = app.replace(/▼ 呪われた装備（解呪）/g, "{t('priest_cursed_equip')}");
app = app.replace(/\[ 呪いを解呪する \(\{mem\.cost \* 1000\} En\) \]/g, "[ {t('priest_uncurse', { cost: mem.cost * 1000 })} ]");
app = app.replace(/▼ 未鑑定の記憶/g, "{t('priest_unidentified')}");

// Enma
app = app.replace(/\(\(window as any\)\.__lang === 'en' \? '▶ Stash fully expanded' : '▶ 倉庫は最大まで拡張済み'\)/g, "t('enma_stash_max')");
app = app.replace(/\(\(window as any\)\.__lang === 'en' \? \`▶ Expand Stash \(\$\{expandCost\} En\)\` : \`▶ 倉庫を拡張する \(\$\{expandCost\} En\)\`\)/g, "t('enma_stash_expand', { cost: expandCost })");

// Inn
app = app.replace(/微睡みの寝床（宿屋）/g, "{t('inn_title')}");
app = app.replace(/疲れた身体と心を休め、HPとMPを全回復します。/g, "{t('inn_desc1')}");
app = app.replace(/現在のHP: \{player\.currentHP\} \/ \{player\.maxHP\}/g, "{t('inn_hp', { hp: player.currentHP, maxHp: player.maxHP })}");
app = app.replace(/現在のMP: \{player\.currentMP\} \/ \{player\.maxMP\}/g, "{t('inn_mp', { mp: player.currentMP, maxMp: player.maxMP })}");
app = app.replace(/\[ 休息する \(費用: \{Math\.floor\(player\.maxHP \* 0\.1 \+ player\.maxMP \* 0\.5\)\} En\) \]/g, "[ {t('inn_rest', { cost: Math.floor(player.maxHP * 0.1 + player.maxMP * 0.5) })} ]");

// Magic
app = app.replace(/装備中の魔法/g, "{t('mag_title')}");
app = app.replace(/\[消費Cost: \{mem\.cost\} による効力\]/g, "{t('mag_effect', { cost: mem.cost })}");
app = app.replace(/使用できる魔法がありません。魔法が付与された記憶を装備してください。/g, "{t('mag_no_magic')}");
app = app.replace(/▶ 魔法（スキル）<\/button>/g, "▶ {t('mag_btn_combat')}</button>"); // combat magic button

// Dungeon
app = app.replace(/迷宮の入り口/g, "{t('dung_title')}");
app = app.replace(/▶ \{t\('dungeon_from', \{ depth: d \}\)\}/g, "{t('dung_from', { depth: d })}");

// Stash
app = app.replace(/<span>金額: <\/span>/g, "<span>{t('stash_amount')}</span>");
app = app.replace(/▶ 預ける/g, "{t('stash_deposit')}");
app = app.replace(/▶ 引き出す/g, "{t('stash_withdraw')}");

app = app.replace(/が立ちはだかる……/g, "{t('ui_stands')}");
app = app.replace(/【 深度: \{depth\} 】/g, "{t('ui_depth', { depth })}");
app = app.replace(/actions\.addLog\(\`街を出て、深度 \$\{startDepth\} から探索を開始した。\`\);/g, "actions.addLog(t('dung_from', { depth: startDepth }));");

fs.writeFileSync('src/App.tsx', app);


// useGameLoop.ts
let gl = fs.readFileSync('src/hooks/useGameLoop.ts', 'utf8');

gl = gl.replace(/'街に滞在している。'/g, "t('gl_town_stay')");

gl = gl.replace(/name: '癒しの光'/g, "name: t('spell_heal')");
gl = gl.replace(/name: '力の鼓舞'/g, "name: t('spell_atkup')");
gl = gl.replace(/name: '守護の結界'/g, "name: t('spell_defup')");
gl = gl.replace(/name: '疾風の恩寵'/g, "name: t('spell_spdup')");
gl = gl.replace(/name: '魔力弾'/g, "name: t('spell_magic_atk')");
gl = gl.replace(/name: '帰還の道標'/g, "name: t('spell_return')");
gl = gl.replace(/name: '未知の魔法'/g, "name: t('spell_unknown')");

gl = gl.replace(/'這うようにして街へ逃げ帰った。HPが全回復し、手持ちの縁を半分失った…'/g, "t('gl_wipeout')");
gl = gl.replace(/'失われた『俺』の影'/g, "t('gl_boss_name')");
gl = gl.replace(/addLog\(\`【警告】圧倒的な絶望が立ち塞がる……。失われた『俺』の影が現れた！（深度: \$\{currentDepth\}）\`\)/g, "addLog(t('gl_boss_warn', { depth: currentDepth }))");

gl = gl.replace(/'奈落の亡霊'/g, "t('gl_mob_deep')");
gl = gl.replace(/'狂える探求者'/g, "t('gl_mob_mid')");
gl = gl.replace(/'彷徨う亡者'/g, "t('gl_mob_shallow')");

gl = gl.replace(/addLog\(\`魔物と遭遇した！（深度: \$\{currentDepth\}）\`\)/g, "addLog(t('gl_encounter', { depth: currentDepth }))");
gl = gl.replace(/addLog\(\`探索を進めた。（深度: \$\{currentDepth\}）\`\)/g, "addLog(t('gl_explore_more', { depth: currentDepth }))");

gl = gl.replace(/'この強大な存在からは逃げられない……！'/g, "t('gl_flee_fail_boss')");
gl = gl.replace(/'無事に逃げ切った！探索を継続する。'/g, "t('gl_flee_success')");
gl = gl.replace(/'逃走に失敗し、背後から致命傷を受けた……'/g, "t('gl_flee_fail')");

gl = gl.replace(/addLog\(\`【死闘の果てに】失われた『俺』の影を打ち破った！（受けたダメージ: \$\{dmgTaken\}\）\`\)/g, "addLog(t('gl_boss_defeat', { dmg: dmgTaken }))");

gl = gl.replace(/'『俺が失った記憶』'/g, "t('gl_boss_item')");
gl = gl.replace(/'全てを思い出した。俺が何者であり、何故この奈落へ落ちたのかを。全ステータスが劇的に上昇するが、凄まじい呪いが毎ターン命を削り続ける。'/g, "t('gl_boss_item_origin')");
gl = gl.replace(/'…まさか、これを本当に見つけるとはな。だが、お前が誰だったかを知って、どうするというのだ……'/g, "t('gl_boss_item_priest')");
gl = gl.replace(/addLog\(\`『俺が失った記憶』を手に入れた……。\`\)/g, "addLog(t('gl_boss_drop'))");
gl = gl.replace(/addLog\(\`インベントリが満杯で『俺が失った記憶』を拾えなかった……！\`\)/g, "addLog(t('gl_boss_drop_full'))");

gl = gl.replace(/addLog\(\`\$\{currentEnemy\.name\} を討ち取った！（受けたダメージ: \$\{dmgTaken\}, 獲得EXP: \$\{expGained\}）\`\)/g, "addLog(t('gl_defeat', { name: currentEnemy.name, dmg: dmgTaken, exp: expGained }))");
gl = gl.replace(/addLog\(\`「未鑑定の記憶」を拾いインベントリに収納した。\`\)/g, "addLog(t('gl_unidentified_drop'))");
gl = gl.replace(/addLog\(\`持ち物がいっぱいだ。記憶を拾えなかった…。\`\)/g, "addLog(t('gl_inv_full_drop'))");
gl = gl.replace(/addLog\(\`【呪い】『俺が失った記憶』の強烈な負荷により、戦闘中に命が削られた！\`\)/g, "addLog(t('gl_curse_dmg'))");
gl = gl.replace(/addLog\(\`【成長】レベルが \$\{newLevel\} に上がった！\`\)/g, "addLog(t('gl_levelup', { level: newLevel }))");
gl = gl.replace(/addLog\(\`\$\{currentEnemy\.name\} との戦闘で力尽きた……。\`\)/g, "addLog(t('gl_dead', { name: currentEnemy.name }))");
gl = gl.replace(/addLog\(\`MPが足りない！\`\)/g, "addLog(t('gl_no_mp'))");

gl = gl.replace(/msg = \`\$\{spell\.name\}！HPが \$\{healAmount\} 回復した。\`/g, "msg = t('gl_magic_heal', { name: spell.name, heal: healAmount })");
gl = gl.replace(/msg = \`\$\{spell\.name\}！攻撃力が上昇した……（深度 \$\{\(costAmount \* 5\)\/5\} 進むまで）\`/g, "msg = t('gl_magic_atkup', { name: spell.name, dur: (costAmount * 5)/5 })");
gl = gl.replace(/msg = \`\$\{spell\.name\}！防御力が上昇した……（深度 \$\{\(costAmount \* 5\)\/5\} 進むまで）\`/g, "msg = t('gl_magic_defup', { name: spell.name, dur: (costAmount * 5)/5 })");
gl = gl.replace(/msg = \`\$\{spell\.name\}！素早さが上昇した……（深度 \$\{\(costAmount \* 5\)\/5\} 進むまで）\`/g, "msg = t('gl_magic_spdup', { name: spell.name, dur: (costAmount * 5)/5 })");
gl = gl.replace(/msg = \`\$\{spell\.name\}！縁を消費せずに街へ帰還する……。\`/g, "msg = t('gl_magic_return', { name: spell.name })");
gl = gl.replace(/msg = \`\$\{spell\.name\}！敵に \$\{combatDmgToEnemy\} の魔法大ダメージ！\`/g, "msg = t('gl_magic_atk', { name: spell.name, dmg: combatDmgToEnemy })");
gl = gl.replace(/addLog\(\`\$\{currentEnemy\.name\} は耐え抜き、反撃してきた……\$\{dmgToPlayer\} のダメージ！\`\)/g, "addLog(t('gl_magic_rebound', { name: currentEnemy.name, dmg: dmgToPlayer }))");

gl = gl.replace(/'街を出て、薄暗いダンジョンの探索を開始した。'/g, "t('gl_dungeon_start')");
gl = gl.replace(/addLog\(\`帰還の道標として \$\{returnCost\} En を支払い、街へ帰還した。\`\)/g, "addLog(t('gl_return_paid', { cost: returnCost }))");
gl = gl.replace(/addLog\(\`【業の強制取り立て】縁が不足している…。破戒僧が無理やり倉庫を探り、未鑑定の記憶を \$\{itemsDestroyed\} 個没収した。\`\)/g, "addLog(t('gl_karma_items', { count: itemsDestroyed }))");
gl = gl.replace(/addLog\(\`【業の強制取り立て】没収できる記憶が足りない。破戒僧はお前の肉体に呪いを刻み、最大HPを \$\{hpPenalty\} 減少させた…\`\)/g, "addLog(t('gl_karma_hp', { penalty: hpPenalty }))");
gl = gl.replace(/'「対価もなしに帰れると思ったか？この世界は甘くないんだよ」'/g, "t('gl_karma_msg')");
gl = gl.replace(/'息を整え、再び探索を続ける。'/g, "t('gl_continue')");

fs.writeFileSync('src/hooks/useGameLoop.ts', gl);


// src/utils/statCalculator.ts might have some japanese too (I saw one in grep output). Let's check it manually later.
console.log('App and GameLoop updated.');
