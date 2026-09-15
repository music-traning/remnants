export interface CombatEntity {
  attack: number;
  defense: number;
  speed: number;
  hp: number;
}

export type StatusEffectType = 'poison' | 'paralysis' | null;

export interface DamageResult {
  damage: number;
  isCritical: boolean;
  isEvaded: boolean;
  remainingHp: number;
}

export interface StatusTickResult {
  damage: number;
  remainingHp: number;
}

export function calculateDamage(attacker: CombatEntity, defender: CombatEntity): DamageResult {
  // Evade chance: base on defender speed. e.g. 0.5% per speed. max 25%
  // But wait, the user specifically mentioned earlier "プレイヤーのspeedが敵より高い場合..." 
  // Let's just use defender speed for evasion:
  const evasionRate = Math.min(0.25, defender.speed * 0.005);
  const isEvaded = Math.random() < evasionRate;

  if (isEvaded) {
    return {
      damage: 0,
      isCritical: false,
      isEvaded: true,
      remainingHp: defender.hp
    };
  }

  // Base critical chance 5%, +0.5% per speed difference, max 30%
  const speedDiff = Math.max(0, attacker.speed - defender.speed);
  const criticalChance = Math.min(0.3, 0.05 + speedDiff * 0.005);
  const isCritical = Math.random() < criticalChance;

  let baseDmg = Math.max(1, attacker.attack - defender.defense);
  let finalDmg = isCritical ? Math.floor(baseDmg * 1.5) : baseDmg;

  return {
    damage: finalDmg,
    isCritical,
    isEvaded: false,
    remainingHp: Math.max(0, defender.hp - finalDmg)
  };
}

export function applyStatusTick(target: CombatEntity, effect: StatusEffectType): StatusTickResult {
  if (effect === 'poison') {
    // Poison takes 5% of max/current HP or a flat amount. Let's do fixed 5.
    // The prompt says: "'poison'の場合、targetのhpから固定ダメージ（仮に5%程度）を減算し" (subtract fixed damage, say around 5% of HP, but without knowing max HP, we can just use 5% of current HP or fixed. We'll do 5% of current HP rounded up).
    const poisonDamage = Math.max(1, Math.floor(target.hp * 0.05));
    return {
      damage: poisonDamage,
      remainingHp: Math.max(0, target.hp - poisonDamage)
    };
  }

  return {
    damage: 0,
    remainingHp: target.hp
  };
}

export function calculateFleeChance(playerSpeed: number, baseSpeed: number): number {
  // Base flee chance is 70% (0.7).
  // speedに応じたボーナス: (playerSpeed - baseSpeed) * 0.01 とか。
  // 10高ければ +10%、10低ければ -10%
  const speedDiff = playerSpeed - baseSpeed;
  const chance = 0.7 + speedDiff * 0.01;
  return Math.max(0.55, Math.min(0.85, chance));
}

