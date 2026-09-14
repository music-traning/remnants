const fs = require('fs');

let m = fs.readFileSync('src/hooks/useMemoryManagement.ts', 'utf8');

// Identify
m = m.replace(/message: '持EされたアイチEが見つかりません、E'/g, "message: { key: 'mem_not_found' }");
m = m.replace(/message: '既に鑑定済みのアイチEです、E'/g, "message: { key: 'mem_not_found' }"); // fallback
m = m.replace(/message: \`【エラー】鑑定には \$\{identifyCost\} 縁が忁Eです。\`/g, "message: { key: 'eco_no_en' }");
m = m.replace(/message: \`\$\{identifyCost\}縁を支払い、E定に成功しました。\`/g, "message: { key: 'eco_identified', params: { cost: identifyCost } }");

// Install
m = m.replace(/message: '未鑑定E記Eは裁Eできません、E'/g, "message: { key: 'mem_not_found' }");
m = m.replace(/message: \`レベルが足りず.*\`/, "message: { key: 'mem_not_found' }");
m = m.replace(/message: 'メモリスロチEの上限に達してぁEす、E'/g, "message: { key: 'mem_equip_full' }");
m = m.replace(/message: 'キャパシチEEコスト上限EをオーバEしてぁEす、E'/g, "message: { key: 'mem_cost_over', params: { current: currentTotalCost, max: player.totalCapacity } }");

// Uninstall
m = m.replace(/message: '持EされたアイチEは裁EされてぁEせん、E'/g, "message: { key: 'mem_not_found' }");
m = m.replace(/message: '【呪縛】この記Eは呪われており.*'/g, "message: { key: 'mem_cursed' }");
m = m.replace(/message: '【エラー】インベントリの空き容量がありません、E'/g, "message: { key: 'eco_inv_full' }");

// Train
m = m.replace(/message: '脳の許容量E既に限界.*'/g, "message: { key: 'mem_not_found' }");
m = m.replace(/message: '縁が足りなぁE.*'/g, "message: { key: 'eco_no_en' }");
m = m.replace(/message: '10,000 Enを支払い.*拡張した、E'/g, "message: { key: 'mem_not_found' }");
m = m.replace(/message: '記EスロチEは既に限界.*'/g, "message: { key: 'mem_not_found' }");
m = m.replace(/message: '100,000 Enを支払い.*拡張した、E'/g, "message: { key: 'mem_not_found' }");

// Uncurse
m = m.replace(/message: 'アイチEが見つかりません、E'/g, "message: { key: 'mem_not_found' }");
m = m.replace(/message: 'こE記Eは呪われてぁEせん、E'/g, "message: { key: 'mem_not_found' }");
m = m.replace(/message: '倉庫がいっぱぁE外せません、E'/g, "message: { key: 'eco_inv_full' }");
m = m.replace(/message: \`縁が足りません。.*\`/, "message: { key: 'eco_no_en' }");
m = m.replace(/message: \`\$\{cost\} Enを支払い.*剥がしました。\`/, "message: { key: 'mem_not_found' }");

fs.writeFileSync('src/hooks/useMemoryManagement.ts', m);

let e = fs.readFileSync('src/hooks/useEconomy.ts', 'utf8');

// Buy/Sell/Stash
e = e.replace(/message: 'アイチEが見つかりません、E'/g, "message: { key: 'mem_not_found' }");
e = e.replace(/message: '【エラー】インベントリの空き容量がありません、E'/g, "message: { key: 'eco_inv_full' }");
e = e.replace(/message: '買ぁEし期限.*'/g, "message: { key: 'eco_buyback_exp' }");
e = e.replace(/message: '縁が足りません.*'/g, "message: { key: 'eco_no_en' }");
e = e.replace(/message: '倉庫の縁が足りません、E'/g, "message: { key: 'eco_stash_no_en' }");
e = e.replace(/message: \`\$\{amount\} 縁を引き出しました、E\`/g, "message: { key: 'eco_withdrew', params: { amount: amount } }");
e = e.replace(/message: \`\$\{amount\} 縁を預けました、E\`/g, "message: { key: 'eco_deposited', params: { amount: amount } }");
e = e.replace(/message: 'これ以上倉庫を拡張できません、E'/g, "message: { key: 'eco_stash_max' }");
e = e.replace(/message: \`倉庫を拡張しました。.*\`/, "message: { key: 'eco_stash_expanded', params: { size: newSize } }");
e = e.replace(/message: '【エラー】縁が足りません.*'/g, "message: { key: 'eco_no_en' }");

fs.writeFileSync('src/hooks/useEconomy.ts', e);
