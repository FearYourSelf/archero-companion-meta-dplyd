
import { Hero, BaseItem } from './types';

export const HERO_DATA: Hero[] = [
  { id: 'zeus', name: 'Zeus', tier: 'SSS', category: 'Hero', isGodTier: true, type: 'God Meta', desc: 'Lightning God. Absolute peak stats. Chain lightning hits jump 5+ times.', globalBonus120: '+8% Max HP', bestSkin: 'Thunder Overlord' },
  { id: 'wukong', name: 'Wukong', tier: 'SSS', category: 'Hero', isGodTier: true, type: 'Utility God', desc: 'Monkey King. Clones inherit 100% Attack. Massive sustainability.', globalBonus120: '+10% Max HP (Lv60: +8% Atk)', bestSkin: 'Celestial Sage' },
  { id: 'melinda', name: 'Melinda', tier: 'SSS', category: 'Hero', isGodTier: true, type: 'DPS Meta', desc: 'Barrage scales with 1.5% per 1% HP lost. Best for boss rushing.', globalBonus120: '+5% Global Atk', bestSkin: 'Baking Sweetie' },
  { id: 'stella', name: 'Stella', tier: 'SS', category: 'Hero', type: 'Burst', desc: 'Star power triggers on 3rd attack. High burst potential.', globalBonus120: '+5% Crit Rate', bestSkin: 'Neon Star' },
  { id: 'helix', name: 'Helix', tier: 'S', category: 'Hero', type: 'F2P King', desc: 'Rage: 1.2% Atk per 1% HP lost. 4-Star Evo increases scaling to 1.5%.', globalBonus120: '+15% Collision Res', assistSlots: ['Meowgik (Offense)', 'Gugu (Defense)', 'Melinda (Stats)'] },
  { id: 'meowgik', name: 'Meowgik', tier: 'S', category: 'Hero', type: 'Support/DPS', desc: 'Cats track through walls. Excellent assist character.', globalBonus120: '+30% Red Heart Healing' },
  { id: 'taranis', name: 'Taranis', tier: 'B', category: 'Hero', type: 'Global Buff', desc: 'Critical global mastery anchor.', globalBonus120: '+50% Crit Damage' },
  { id: 'atreus', name: 'Atreus', tier: 'F', category: 'Hero', type: 'Global Buff', desc: 'Essential for the Immortal PR Build.', globalBonus120: '+7% Projectile Res' }
];

export const GEAR_DATA: BaseItem[] = [
  // Weapons
  { id: 'dk_spear', name: 'Demon King Spear', tier: 'SSS', category: 'Weapon', isGodTier: true, desc: 'Gun Shield: Swap between Heavy Cannon (AOE) and Shield Bash (Defense/Charge).', mythicPerk: 'Shield bash deals 450% Splash Dmg.' },
  { id: 'fist', name: 'Expedition Fist', tier: 'SSS', category: 'Weapon', isGodTier: true, desc: 'Melee/Ranged hybrid. Highest frame-data burst in game.', mythicPerk: 'Melee hits heal for 20% of damage dealt.' },
  { id: 'hammer', name: 'Celestial Hammer', tier: 'SSS', category: 'Weapon', isGodTier: true, desc: 'Lightning focus. Lightning chains deal 100% weapon damage.', mythicPerk: 'Thunderous hit triggers explosion on crit.' },
  { id: 'asword', name: 'Antiquated Sword', tier: 'SS', category: 'Weapon', desc: 'Stance switch: Broadsword (DR) vs Rapier (Crit/Speed).', hiddenMultiplier: 1.7 },
  { id: 'db', name: 'Demon Blade', tier: 'SS', category: 'Weapon', desc: 'Melee kills heal. Massive 1.8x Melee multiplier.', hiddenMultiplier: 1.8 },
  { id: 'stalker', name: 'Stalker Staff', tier: 'B', category: 'Weapon', desc: 'SSS Tier ONLY with Diagonal Arrows. Built-in homing.', hiddenMultiplier: 1.0 },

  // Armor
  { id: 'c_warplate', name: 'Celestial Warplate', tier: 'SSS', category: 'Armor', isGodTier: true, desc: 'Triggers Lightning Nova when hit. Best synergy with Zeus.', mythicPerk: '+15% Damage Resistance.' },
  { id: 'e_plate', name: 'Expedition Plate', tier: 'SSS', category: 'Armor', isGodTier: true, desc: 'Heals 5% HP on kill. Core for healing loop builds.', mythicPerk: '+20% Healing Efficiency.' },
  { id: 'golden', name: 'Golden Chestplate', tier: 'S', category: 'Armor', desc: '10% Damage Resistance. Reliable for all stages.' },
  { id: 'phantom', name: 'Phantom Cloak', tier: 'S', category: 'Armor', desc: 'Freezes bosses. Essential for high-chapter boss rushes.' },

  // Rings
  { id: 'c_band', name: 'Celestial Band', tier: 'SSS', category: 'Ring', isGodTier: true, desc: 'Attack + Crit Rate + Lightning damage buff.', mythicPerk: '+50% Crit Damage.' },
  { id: 'e_ring', name: 'Expedition Ring', tier: 'SSS', category: 'Ring', isGodTier: true, desc: 'High raw Attack and HP. Best stat-stick.', mythicPerk: '+10% Attack.' },
  { id: 'dragon_ring', name: 'Dragon Ring', tier: 'SS', category: 'Ring', desc: '12% Projectile Resistance. Core of the Immortal Build.', mythicPerk: '+5% Crit Rate.' },
  { id: 'bull', name: 'Bull Ring', tier: 'SS', category: 'Ring', desc: '10% Mob Damage Resistance. Great for clearing chapters.' },

  // Lockets
  { id: 'bulletproof', name: 'Bulletproof Locket', tier: 'S', category: 'Locket', desc: 'Projectiles deal less damage when low HP.', mythicPerk: 'Multiplies Projectile Res by 1.3x.' },
  { id: 'bloodthirst', name: 'Bloodthirst Locket', tier: 'S', category: 'Locket', desc: 'Heal on kill. Best for mob-heavy chapters.' },

  // Dragons & Pets
  { id: 'magmar', name: 'Magmar', tier: 'SS', category: 'Dragon', desc: 'Mana Regen specialist. Enables infinite skill spam.', mythicPerk: 'Mana recovery speed +25%.' },
  { id: 'necrogon', name: 'Necrogon', tier: 'S', category: 'Dragon', desc: 'Passive Projectile Resistance. Required for Immortal Build.' },
  { id: 'uni', name: 'Empyrean Unicorn', tier: 'SS', category: 'Pet', desc: 'Massive hero stat boost. Highest passive stats.' },

  // Estate
  { id: 'totem_skin', name: 'Hero Skin Totem', tier: 'SSS', category: 'Totem', isGodTier: true, desc: 'Boosts all flat stats from hero skins. Math priority #1.' },
  { id: 'totem_atk', name: 'Attack Totem', tier: 'SSS', category: 'Totem', isGodTier: true, desc: 'Raw Attack % increase. Priority #2.' }
];

export const ARCHERO_KNOWLEDGE_BASE = `
[ARCHERO 2025-2026 ULTIMATE META ARCHIVE]

1. THE "IMMORTAL" BUILD:
- Requirements: Atreus Lv120 (+7% PR), 2x Dragon Rings (Mythic), Necrogon (Dragon), Bulletproof Locket (Mythic 1.3x Multiplier).
- Mechanic: Reaches near 100% Projectile Resistance.
- Warning: Inferno Mode (H90+) ignores 30% of this PR. You must supplement with Damage Resistance (DR) or Collision Resistance.

2. WEAPON MECHANICS:
- Demon Blade: 1.8x Melee Multiplier. Stutter-stepping is mandatory.
- Expedition Fist: 1.7x Hybrid Multiplier. Highest burst DPS when used with Melinda.
- Demon King Spear: Use Gun mode for bosses, Shield mode for charging through mobs.

3. ESTATE & TOTEMS:
- Skin Totem > Attack Totem. Why? Skin bonuses are flat and then multiplied by your global Atk%. Skin Totems buff the core value before multipliers.
- Workers: Daniel (Mob Dmg) and Ivan (Attack) are the highest priority.

4. CHAPTER 90+ (INFERNO):
- New Mechanic: "Resistance Penetration". Chapters ignore a flat % of your defensive stats. 
- Solution: Transition from PR to **Collision Resistance** (Celestial Bracer) and **Damage Resistance** (Celestial Warplate).

5. LEAKS (2026):
- Chaos Rarity +1 confirmed. "Titan Tales +3" will offer new unique passive skills.
- Hero Assist levels expanding to 120.
`;
