const fs = require('fs');

// 1. Update ja.ts
let ja = fs.readFileSync('src/locales/ja.ts', 'utf8');
const jaAppend = `
  // Missing App.tsx
  sys_save: "セーブ",
  sys_load: "ロード",
  sys_erase: "消去",
  sys_close: "閉じる",
  sys_saved: "SLOT {slot} にセーブしました。",
  sys_confirm_load: "SLOT {slot} からロードしますか？\\n（現在の進行状況は失われます）",
  sys_loaded: "SLOT {slot} からロードしました。",
  sys_confirm_erase: "SLOT {slot} のデータを消去しますか？",
  sys_erased: "SLOT {slot} を消去しました。",
  sys_max_depth: "最大深度: {depth}",
  sys_playtime: "プレイ時間: {time}",
  sys_lvl: "Lv: {lvl}",
  
  stat_no_equip: "装備中の記憶はありません。",
  stat_unequip: "アンインストール（装備解除）",
  
  inv_equip: "インストール (COST: {cost}, 必須Lv: {reqLevel})",
  inv_discard: "破棄",
  
  priest_expand_cap: "▶ 脳の許容量を拡張 (10,000 En)",
  priest_expand_slot: "▶ 記憶スロットを拡張 (100,000 En)",
  priest_cursed_equip: "▼ 呪われた装備（解呪）",
  priest_uncurse: "呪いを解呪する ({cost} En)",
  priest_unidentified: "▼ 未鑑定の記憶",
  priest_identify: "鑑定する ({cost} En)",
  
  enma_stash_max: "▶ 倉庫は最大まで拡張済み",
  enma_stash_expand: "▶ 倉庫を拡張する ({cost} En)",
  
  inn_title: "微睡みの寝床（宿屋）",
  inn_desc1: "疲れた身体と心を休め、HPとMPを全回復します。",
  inn_hp: "現在のHP: {hp} / {maxHp}",
  inn_mp: "現在のMP: {mp} / {maxMp}",
  inn_rest: "休息する (費用: {cost} En)",
  
  mag_title: "装備中の魔法",
  mag_effect: "[消費Cost: {cost} による効力]",
  mag_no_magic: "使用できる魔法がありません。魔法が付与された記憶を装備してください。",
  mag_btn_combat: "魔法（スキル）",
  
  dung_title: "迷宮の入り口",
  dung_from: "▶ {depth} から探索開始",
  
  stash_amount: "金額: ",
  stash_deposit: "▶ 預ける",
  stash_withdraw: "▶ 引き出す",
  
  ui_stands: "が立ちはだかる……",
  
  // Missing useGameLoop.ts
  gl_town_stay: "街に滞在している。",
  spell_heal: "癒しの光",
  spell_atkup: "力の鼓舞",
  spell_defup: "守護の結界",
  spell_spdup: "疾風の恩寵",
  spell_magic_atk: "魔力弾",
  spell_return: "帰還の道標",
  spell_unknown: "未知の魔法",
  
  gl_wipeout: "這うようにして街へ逃げ帰った。HPが全回復し、手持ちの縁を半分失った…",
  gl_boss_name: "失われた『俺』の影",
  gl_boss_warn: "【警告】圧倒的な絶望が立ち塞がる……。失われた『俺』の影が現れた！（深度: {depth}）",
  gl_mob_deep: "奈落の亡霊",
  gl_mob_mid: "狂える探求者",
  gl_mob_shallow: "彷徨う亡者",
  
  gl_encounter: "魔物と遭遇した！（深度: {depth}）",
  gl_explore_more: "探索を進めた。（深度: {depth}）",
  gl_flee_fail_boss: "この強大な存在からは逃げられない……！",
  gl_flee_success: "無事に逃げ切った！探索を継続する。",
  gl_flee_fail: "逃走に失敗し、背後から致命傷を受けた……",
  
  gl_boss_defeat: "【死闘の果てに】失われた『俺』の影を打ち破った！（受けたダメージ: {dmg}）",
  gl_boss_item: "『俺が失った記憶』",
  gl_boss_item_origin: "全てを思い出した。俺が何者であり、何故この奈落へ落ちたのかを。全ステータスが劇的に上昇するが、凄まじい呪いが毎ターン命を削り続ける。",
  gl_boss_item_priest: "…まさか、これを本当に見つけるとはな。だが、お前が誰だったかを知って、どうするというのだ……",
  gl_boss_drop: "『俺が失った記憶』を手に入れた……。",
  gl_boss_drop_full: "インベントリが満杯で『俺が失った記憶』を拾えなかった……！",
  
  gl_defeat: "{name} を討ち取った！（受けたダメージ: {dmg}, 獲得EXP: {exp}）",
  gl_unidentified_drop: "「未鑑定の記憶」を拾いインベントリに収納した。",
  gl_inv_full_drop: "持ち物がいっぱいだ。記憶を拾えなかった…。",
  gl_curse_dmg: "【呪い】『俺が失った記憶』の強烈な負荷により、戦闘中に命が削られた！",
  gl_levelup: "【成長】レベルが {level} に上がった！",
  gl_dead: "{name} との戦闘で力尽きた……。",
  gl_no_mp: "MPが足りない！",
  gl_magic_heal: "{name}！HPが {heal} 回復した。",
  gl_magic_atkup: "{name}！攻撃力が上昇した……（深度 {dur} 進むまで）",
  gl_magic_defup: "{name}！防御力が上昇した……（深度 {dur} 進むまで）",
  gl_magic_spdup: "{name}！素早さが上昇した……（深度 {dur} 進むまで）",
  gl_magic_return: "{name}！縁を消費せずに街へ帰還する……。",
  gl_magic_atk: "{name}！敵に {dmg} の魔法大ダメージ！",
  gl_magic_rebound: "{name} は耐え抜き、反撃してきた……{dmg} のダメージ！",
  
  gl_dungeon_start: "街を出て、薄暗いダンジョンの探索を開始した。",
  gl_return_paid: "帰還の道標として {cost} En を支払い、街へ帰還した。",
  gl_karma_items: "【業の強制取り立て】縁が不足している…。破戒僧が無理やり倉庫を探り、未鑑定の記憶を {count} 個没収した。",
  gl_karma_hp: "【業の強制取り立て】没収できる記憶が足りない。破戒僧はお前の肉体に呪いを刻み、最大HPを {penalty} 減少させた…",
  gl_karma_msg: "「対価もなしに帰れると思ったか？この世界は甘くないんだよ」",
  gl_continue: "息を整え、再び探索を続ける。"
};
`;

ja = ja.replace('};', jaAppend.substring(1));
fs.writeFileSync('src/locales/ja.ts', ja);

// 2. Update en.ts
let en = fs.readFileSync('src/locales/en.ts', 'utf8');
const enAppend = `
  // Missing App.tsx
  sys_save: "Save",
  sys_load: "Load",
  sys_erase: "Erase",
  sys_close: "Close",
  sys_saved: "Saved to SLOT {slot}.",
  sys_confirm_load: "Load from SLOT {slot}?\\n(Current progress will be lost)",
  sys_loaded: "Loaded from SLOT {slot}.",
  sys_confirm_erase: "Erase data in SLOT {slot}?",
  sys_erased: "Erased SLOT {slot}.",
  sys_max_depth: "Max Depth: {depth}",
  sys_playtime: "Playtime: {time}",
  sys_lvl: "Lv: {lvl}",
  
  stat_no_equip: "No memories equipped.",
  stat_unequip: "Uninstall (Unequip)",
  
  inv_equip: "Install (COST: {cost}, Req Lv: {reqLevel})",
  inv_discard: "Discard",
  
  priest_expand_cap: "▶ Expand Brain Capacity (10,000 En)",
  priest_expand_slot: "▶ Expand Memory Slots (100,000 En)",
  priest_cursed_equip: "▼ Cursed Equipment (Uncurse)",
  priest_uncurse: "Uncurse ({cost} En)",
  priest_unidentified: "▼ Unidentified Memories",
  priest_identify: "Identify ({cost} En)",
  
  enma_stash_max: "▶ Stash fully expanded",
  enma_stash_expand: "▶ Expand Stash ({cost} En)",
  
  inn_title: "Bed of Slumber (Inn)",
  inn_desc1: "Rest your weary body and mind, fully restoring HP and MP.",
  inn_hp: "Current HP: {hp} / {maxHp}",
  inn_mp: "Current MP: {mp} / {maxMp}",
  inn_rest: "Rest (Cost: {cost} En)",
  
  mag_title: "Equipped Magic",
  mag_effect: "[Effect by Cost: {cost}]",
  mag_no_magic: "No magic available. Equip a memory with an enchanted spell.",
  mag_btn_combat: "Magic (Skill)",
  
  dung_title: "Dungeon Entrance",
  dung_from: "▶ Start exploring from Depth {depth}",
  
  stash_amount: "Amount: ",
  stash_deposit: "▶ Deposit",
  stash_withdraw: "▶ Withdraw",
  
  ui_stands: " stands in your way...",
  
  // Missing useGameLoop.ts
  gl_town_stay: "Staying in the town.",
  spell_heal: "Light of Healing",
  spell_atkup: "Inspiration of Power",
  spell_defup: "Barrier of Protection",
  spell_spdup: "Grace of the Gale",
  spell_magic_atk: "Magic Bullet",
  spell_return: "Guidestone of Return",
  spell_unknown: "Unknown Magic",
  
  gl_wipeout: "Crawled back to town. HP restored, but half your current En is lost...",
  gl_boss_name: "Shadow of My Lost Self",
  gl_boss_warn: "[WARNING] An overwhelming despair blocks your path... Shadow of My Lost Self appears! (Depth: {depth})",
  gl_mob_deep: "Phantom of the Abyss",
  gl_mob_mid: "Maddened Seeker",
  gl_mob_shallow: "Wandering Soul",
  
  gl_encounter: "Encountered a monster! (Depth: {depth})",
  gl_explore_more: "Explored deeper. (Depth: {depth})",
  gl_flee_fail_boss: "You cannot flee from this almighty presence...!",
  gl_flee_success: "Successfully fled! Continuing exploration.",
  gl_flee_fail: "Failed to flee, receiving a fatal wound from behind...",
  
  gl_boss_defeat: "[AFTERMATH] Defeated the Shadow of My Lost Self! (Dmg Taken: {dmg})",
  gl_boss_item: "Memory I Lost",
  gl_boss_item_origin: "I remember everything. Who I was, and why I fell into this abyss. All stats rise dramatically, but a horrific curse shaves your life every turn.",
  gl_boss_item_priest: "...To think you actually found it. But what will you do now that you know who you were...?",
  gl_boss_drop: "Acquired 'Memory I Lost'...",
  gl_boss_drop_full: "Inventory full! Could not pick up 'Memory I Lost'...",
  
  gl_defeat: "Defeated {name}! (Dmg Taken: {dmg}, EXP: {exp})",
  gl_unidentified_drop: "Picked up an 'Unidentified Memory' and stashed it in inventory.",
  gl_inv_full_drop: "Inventory is full. Could not pick up the memory...",
  gl_curse_dmg: "[CURSE] The intense burden of 'Memory I Lost' shaves your life in combat!",
  gl_levelup: "[GROWTH] Level increased to {level}!",
  gl_dead: "Collapsed in combat against {name}...",
  gl_no_mp: "Not enough MP!",
  gl_magic_heal: "{name}! Recovered {heal} HP.",
  gl_magic_atkup: "{name}! ATK increased... (Until advancing {dur} depths)",
  gl_magic_defup: "{name}! DEF increased... (Until advancing {dur} depths)",
  gl_magic_spdup: "{name}! SPD increased... (Until advancing {dur} depths)",
  gl_magic_return: "{name}! Returning to town without spending En...",
  gl_magic_atk: "{name}! Dealt {dmg} massive magic damage!",
  gl_magic_rebound: "{name} endured and counterattacked... {dmg} damage!",
  
  gl_dungeon_start: "Left the town and began exploring the dim dungeon.",
  gl_return_paid: "Paid {cost} En for a guidestone and returned to town.",
  gl_karma_items: "[KARMA] Insufficient En. The corrupt priest forcibly searched your stash and confiscated {count} Unidentified Memories.",
  gl_karma_hp: "[KARMA] Not enough memories to confiscate. The corrupt priest etched a curse on your flesh, permanently reducing Max HP by {penalty}...",
  gl_karma_msg: "'Did you think you could return for free? The world isn't that sweet.'",
  gl_continue: "Catching your breath, you resume exploring."
};
`;
en = en.replace('};', enAppend.substring(1));
fs.writeFileSync('src/locales/en.ts', en);

console.log('Dictionaries updated.');
