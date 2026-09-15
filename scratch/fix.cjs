const fs = require('fs');
let content = fs.readFileSync('src/hooks/useMemoryManagement.ts', 'utf8');

content = content.replace(/message: '指定されたアイテムが見つかりません。'/g, "message: { key: 'eco_not_found' }");
content = content.replace(/message: '既に鑑定済みのアイテムです。'/g, "message: { key: 'eco_already_identified' }");
content = content.replace(/message: `【エラー】鑑定には \$\{identifyCost\} 縁が必要です。`/g, "message: { key: 'eco_need_en', params: { cost: identifyCost } }");
content = content.replace(/message: `\$\{identifyCost\}縁を支払い、鑑定に成功しました。`/g, "message: { key: 'eco_identified', params: { cost: identifyCost } }");

content = content.replace(/message: '未鑑定の記憶は装備できません。'/g, "message: { key: 'mem_unidentified_equip' }");
content = content.replace(/message: `レベルが足りず、自我が崩壊するため装備できません。（必要Lv: \$\{reqLevel\}）`/g, "message: { key: 'mem_req_level', params: { level: reqLevel } }");
content = content.replace(/message: 'メモリスロットの上限に達しています。'/g, "message: { key: 'mem_slot_full' }");
content = content.replace(/message: 'キャパシティ（コスト上限）をオーバーしています。'/g, "message: { key: 'mem_cost_over', params: { current: currentTotalCost + target.cost, max: player.totalCapacity } }");

content = content.replace(/message: '指定されたアイテムは装備していません。'/g, "message: { key: 'mem_not_equipped' }");
content = content.replace(/message: '【呪縛】この記憶は呪われており、外すことができません！'/g, "message: { key: 'mem_cursed_unequip' }");
content = content.replace(/message: '【エラー】インベントリの空き容量がありません。'/g, "message: { key: 'eco_inv_full' }");

content = content.replace(/message: 'アイテムが見つかりません。'/g, "message: { key: 'eco_not_found' }");

content = content.replace(/message: '脳の許容量は既に限界（30）だ。'/g, "message: { key: 'mem_cap_max' }");
content = content.replace(/message: '縁が足りない。（必要: 10,000 En）'/g, "message: { key: 'eco_need_en', params: { cost: 10000 } }");
content = content.replace(/message: '10,000 Enを支払い、修行で脳の許容量（Capacity）を拡張した。'/g, "message: { key: 'mem_cap_trained' }");

content = content.replace(/message: '記憶スロットは既に限界（6）だ。'/g, "message: { key: 'mem_slot_max' }");
content = content.replace(/message: '縁が足りない。（必要: 100,000 En）'/g, "message: { key: 'eco_need_en', params: { cost: 100000 } }");
content = content.replace(/message: '100,000 Enを支払い、修行で記憶スロットを拡張した。'/g, "message: { key: 'mem_slot_trained' }");

content = content.replace(/message: 'この記憶は呪われていません。'/g, "message: { key: 'mem_not_cursed' }");
content = content.replace(/message: '倉庫がいっぱいで外せません。'/g, "message: { key: 'eco_inv_full' }");
content = content.replace(/message: `縁が足りません。（必要: \$\{cost\} En）`/g, "message: { key: 'eco_need_en', params: { cost } }");
content = content.replace(/message: `\$\{cost\} Enを支払い、強引に呪いを引き剥がしました。`/g, "message: { key: 'mem_uncursed' }");

fs.writeFileSync('src/hooks/useMemoryManagement.ts', content);
