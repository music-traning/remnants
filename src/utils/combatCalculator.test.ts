import { describe, it, expect } from 'vitest';
import { calculateDamage, applyStatusTick } from './combatCalculator';
import type { CombatEntity } from './combatCalculator';

describe('combatCalculator', () => {
  describe('calculateDamage', () => {
    it('deals at least (attack - defense) damage', () => {
      const attacker: CombatEntity = { attack: 50, defense: 10, speed: 10, hp: 100 };
      const defender: CombatEntity = { attack: 10, defense: 20, speed: 10, hp: 100 };
      
      const result = calculateDamage(attacker, defender);
      
      // base is 30, critical makes it 45
      expect(result.damage).toBeGreaterThanOrEqual(30);
    });

    it('clamps minimum damage to 1 when defense is higher than attack', () => {
      const attacker: CombatEntity = { attack: 10, defense: 10, speed: 10, hp: 100 };
      const defender: CombatEntity = { attack: 10, defense: 50, speed: 10, hp: 100 };
      
      // Force no evasion by mocking Math.random for this test? 
      // Evasion rate is defender.speed * 0.005 = 0.05.
      // If it evades, damage is 0.
      let hasOneDamage = false;
      for (let i = 0; i < 50; i++) {
        const result = calculateDamage(attacker, defender);
        if (!result.isEvaded && result.damage === 1) {
          hasOneDamage = true;
          break;
        }
      }
      
      expect(hasOneDamage).toBe(true);
    });

    it('critical hit probability is within the expected range when speed is much higher', () => {
      const attacker: CombatEntity = { attack: 50, defense: 10, speed: 100, hp: 100 }; // 100 speed
      const defender: CombatEntity = { attack: 10, defense: 10, speed: 10, hp: 100 };  // 10 speed
      // speed diff = 90 -> chance = 0.05 + 0.45 = 0.5, clamped to 0.3.
      
      let crits = 0;
      const trials = 1000;
      
      for (let i = 0; i < trials; i++) {
        const result = calculateDamage(attacker, defender);
        if (result.isCritical) {
          crits++;
        }
      }
      
      const critRate = crits / trials;
      // Expected around 0.3, check if it's between 0.25 and 0.35
      expect(critRate).toBeGreaterThan(0.25);
      expect(critRate).toBeLessThan(0.35);
    });
  });

  describe('applyStatusTick', () => {
    it('deals poison damage and reduces remaining hp', () => {
      const target: CombatEntity = { attack: 10, defense: 10, speed: 10, hp: 100 };
      const result = applyStatusTick(target, 'poison');
      
      expect(result.damage).toBe(5); // 5% of 100
      expect(result.remainingHp).toBe(95);
    });

    it('does not reduce hp below 0 from poison', () => {
      const target: CombatEntity = { attack: 10, defense: 10, speed: 10, hp: 2 };
      const result = applyStatusTick(target, 'poison');
      
      // 5% of 2 is 0.1, clamped to 1.
      expect(result.damage).toBe(1);
      expect(result.remainingHp).toBe(1);
      
      const target2: CombatEntity = { attack: 10, defense: 10, speed: 10, hp: 1 };
      const result2 = applyStatusTick(target2, 'poison');
      expect(result2.remainingHp).toBe(0);
    });

    it('does nothing when effect is null', () => {
      const target: CombatEntity = { attack: 10, defense: 10, speed: 10, hp: 100 };
      const result = applyStatusTick(target, null);
      
      expect(result.damage).toBe(0);
      expect(result.remainingHp).toBe(100);
    });
  });
});
