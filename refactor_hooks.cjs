const fs = require('fs');

// --- 1. useEconomy.ts ---
let ecoContent = fs.readFileSync('src/hooks/useEconomy.ts', 'utf8');

// Add import
if (!ecoContent.includes('useI18n')) {
  ecoContent = `import { useI18n } from '../contexts/I18nContext';\n` + ecoContent;
}
ecoContent = ecoContent.replace(/export const useEconomy = \(player: Player, setPlayer: \(p: Player \| \(\(prev: Player\) => Player\)\) => void\) => \{/, "export const useEconomy = (player: Player, setPlayer: (p: Player | ((prev: Player) => Player)) => void) => {\n  const { t } = useI18n();");

// Replace strings
ecoContent = ecoContent.replace(/message: '所持枠が一杯です。'/g, "message: t('eco_inv_full')");
ecoContent = ecoContent.replace(/message: \`未鑑定の記憶を \$\{cost\} Enで鑑定しました。\`/, "message: t('eco_identified', { cost })");
ecoContent = ecoContent.replace(/message: '縁が足りません。'/g, "message: t('eco_no_en')");
ecoContent = ecoContent.replace(/message: '未鑑定の記憶がありません。'/g, "message: t('eco_no_unidentified')");
ecoContent = ecoContent.replace(/message: '倉庫の縁が足りません。'/g, "message: t('eco_stash_no_en')");
ecoContent = ecoContent.replace(/message: \`\$\{amount\} 縁を引き出しました。\`/, "message: t('eco_withdrew', { amount })");
ecoContent = ecoContent.replace(/message: \`\$\{amount\} 縁を預けました。\`/, "message: t('eco_deposited', { amount })");
ecoContent = ecoContent.replace(/message: 'これ以上倉庫を拡張できません。'/g, "message: t('eco_stash_max')");
ecoContent = ecoContent.replace(/message: \`倉庫を拡張しました。最大容量: \$\{newSize\}\`/, "message: t('eco_stash_expanded', { size: newSize })");
ecoContent = ecoContent.replace(/message: \`\$\{itemToSell.flavorText.itemName\} を \$\{sellPrice\} Enで売却しました。\`/, "message: t('eco_sold', { name: itemToSell.flavorText.itemName, price: sellPrice })");
ecoContent = ecoContent.replace(/message: \`\$\{itemToBuyBack.flavorText.itemName\} を \$\{cost\} Enで買い戻しました。\`/, "message: t('eco_bought', { name: itemToBuyBack.flavorText.itemName, price: cost })");
ecoContent = ecoContent.replace(/message: '買い戻し期限が切れています。'/g, "message: t('eco_buyback_exp')");
ecoContent = ecoContent.replace(/message: '宿屋で身体を休め、HPとMPが全回復しました。'/g, "message: t('eco_rested')");

fs.writeFileSync('src/hooks/useEconomy.ts', ecoContent);


// --- 2. useMemoryManagement.ts ---
let memContent = fs.readFileSync('src/hooks/useMemoryManagement.ts', 'utf8');

if (!memContent.includes('useI18n')) {
  memContent = `import { useI18n } from '../contexts/I18nContext';\n` + memContent;
}
memContent = memContent.replace(/export const useMemoryManagement = \(player: Player, setPlayer: \(p: Player \| \(\(prev: Player\) => Player\)\) => void\) => \{/, "export const useMemoryManagement = (player: Player, setPlayer: (p: Player | ((prev: Player) => Player)) => void) => {\n  const { t } = useI18n();");

memContent = memContent.replace(/message: '装備枠が一杯です。'/g, "message: t('mem_equip_full')");
memContent = memContent.replace(/message: \`コストオーバーです。（現在: \$\{currentCost \+ mem.cost\}, 上限: \$\{player.totalCapacity\}\}\)\`/g, "message: t('mem_cost_over', { current: currentCost + mem.cost, max: player.totalCapacity })");
memContent = memContent.replace(/message: \`\$\{mem.flavorText.itemName\} をインストールしました。\`/, "message: t('mem_installed', { name: mem.flavorText.itemName })");
memContent = memContent.replace(/message: '指定された記憶が見つかりません。'/g, "message: t('mem_not_found')");
memContent = memContent.replace(/message: '呪われているため、外すことができません！'/g, "message: t('mem_cursed')");
memContent = memContent.replace(/message: \`\$\{memToRemove.flavorText.itemName\} を取り外しました。\`/, "message: t('mem_removed', { name: memToRemove.flavorText.itemName })");

fs.writeFileSync('src/hooks/useMemoryManagement.ts', memContent);

// --- 3. useGameLoop.ts ---
let glContent = fs.readFileSync('src/hooks/useGameLoop.ts', 'utf8');

if (!glContent.includes('useI18n')) {
  glContent = `import { useI18n } from '../contexts/I18nContext';\n` + glContent;
}
glContent = glContent.replace(/export function useGameLoop\(initialPlayer: Player\) \{/, "export function useGameLoop(initialPlayer: Player) {\n  const { t } = useI18n();");

glContent = glContent.replace(/addLog\(\`街を出て、深度 \$\{d\} から探索を開始した。\`\)/g, "addLog(t('gl_start_explore', { depth: d }))");
glContent = glContent.replace(/addLog\(\`魔物と遭遇した！ \\(深度: \$\{depth\}\\)\`\)/g, "addLog(t('gl_encounter', { depth }))");
glContent = glContent.replace(/addLog\(\`【警告】圧倒的な絶望が立ち塞がる……。失われた『俺』の影が現れた！（深度: \$\{depth\}）\`\)/g, "addLog(t('gl_encounter_boss', { depth }))");
glContent = glContent.replace(/addLog\(\`何も見つからなかった……。 \\(深度: \$\{depth\}\\)\`\)/g, "addLog(t('gl_nothing', { depth }))");
glContent = glContent.replace(/addLog\(\`敵を打ち倒し、\$\{template.itemName\} を獲得した！\`\)/g, "addLog(t('gl_drop', { name: template.itemName }))");
glContent = glContent.replace(/addLog\('敵を打ち倒したが、めぼしいものは無かった。'\)/g, "addLog(t('gl_no_drop'))");
glContent = glContent.replace(/addLog\('逃走に成功した！'\)/g, "addLog(t('gl_flee_success'))");
glContent = glContent.replace(/addLog\('逃走に失敗した！'\)/g, "addLog(t('gl_flee_fail'))");
glContent = glContent.replace(/addLog\(\`\$\{currentEnemy.name\} の攻撃！ \$\{dmg\} のダメージを受けた！\`\)/g, "addLog(t('gl_enemy_atk', { name: currentEnemy.name, dmg }))");
glContent = glContent.replace(/addLog\(\`\$\{player.currentHP\} は倒れた……。\`\)/g, "addLog(t('gl_dead'))");
glContent = glContent.replace(/addLog\(\`レベルアップ！ レベルが \$\{newLevel\} になった！\`\)/g, "addLog(t('gl_levelup', { level: newLevel }))");
glContent = glContent.replace(/addLog\('街へ帰還した。'\)/g, "addLog(t('gl_return'))");
glContent = glContent.replace(/addLog\('縁が足りず、業の強制取り立てが発生した……。'\)/g, "addLog(t('gl_karma'))");
glContent = glContent.replace(/addLog\(\`\$\{confiscated.flavorText.itemName\} を失った。\`\)/g, "addLog(t('gl_lost_item', { name: confiscated.flavorText.itemName }))");
glContent = glContent.replace(/addLog\('最大HPが 5 減少した……。'\)/g, "addLog(t('gl_hp_down'))");

glContent = glContent.replace(/addLog\('（MPが足りない！）'\)/g, "addLog(t('gl_no_mp'))");
glContent = glContent.replace(/addLog\('（装備していない！）'\)/g, "addLog(t('gl_no_equip'))");

glContent = glContent.replace(/addLog\('魔法を発動！ \$\{mem.flavorText.itemName\} に大ダメージ！'\)/g, "addLog(t('gl_magic_atk', { name: mem.flavorText.itemName }))");
glContent = glContent.replace(/addLog\(\`魔法を発動！ HPが \$\{heal\} 回復した。\`\)/g, "addLog(t('gl_magic_heal', { heal }))");
glContent = glContent.replace(/addLog\('魔法を発動！ 攻撃力がアップした！'\)/g, "addLog(t('gl_magic_atkup'))");
glContent = glContent.replace(/addLog\('魔法を発動！ 防御力がアップした！'\)/g, "addLog(t('gl_magic_defup'))");
glContent = glContent.replace(/addLog\('魔法を発動！ 素早さがアップした！'\)/g, "addLog(t('gl_magic_spdup'))");
glContent = glContent.replace(/addLog\('帰還魔法を発動！ 縁を消費せずに街へ帰還した！'\)/g, "addLog(t('gl_magic_return'))");

fs.writeFileSync('src/hooks/useGameLoop.ts', glContent);

console.log('Hooks updated for i18n.');
