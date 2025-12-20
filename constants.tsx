
import { Hero, BaseItem } from './types';

export const HERO_DATA: Hero[] = [
  { id: 'zeus', name: 'Zeus', tier: 'SSS', type: 'God Meta', desc: 'Lightning God. Chain Lightning.', details: 'MUST use with Celestial Set (Hammer + Band).', stats: { atk: 10, hp: 10 }, category: 'Hero', isGodTier: true, lv120Efficiency: 'Medium' },
  { id: 'wukong', name: 'Wukong', tier: 'SSS', type: 'Global Buff Meta', desc: 'Monkey King. Clones & Rotating Staff.', details: 'Lv120 gives +8% Global Attack.', stats: { atk: 10, hp: 9 }, category: 'Hero', isGodTier: true, lv120Efficiency: 'SSS (MAX)' },
  { id: 'melinda', name: 'Melinda', tier: 'SSS', type: 'Best Overall Investment', desc: 'Barrage Master. Best Burst DPS.', details: 'Barrage scales with LOST HP.', stats: { atk: 10, hp: 8 }, category: 'Hero', lv120Efficiency: 'SSS (High)' },
  { id: 'dragon_girl', name: 'Dragon Girl', tier: 'SSS', type: 'Burst/Summoner', desc: 'Summons dragon. High burst fire AOE.', stats: { atk: 9, hp: 9 }, category: 'Hero', lv120Efficiency: 'SS (High)' },
  { id: 'helix', name: 'Helix', tier: 'S', type: 'Best F2P Starter', desc: 'Aggressive Rage specialist.', details: 'DPS increases as HP drops.', stats: { atk: 8, hp: 10 }, category: 'Hero', lv120Efficiency: 'Low' },
  { id: 'meowgik', name: 'Meowgik', tier: 'S', type: 'Defensive Strategy', desc: 'Summons cats through walls.', stats: { atk: 8, hp: 9 }, category: 'Hero', lv120Efficiency: 'Medium' },
  { id: 'taranis', name: 'Taranis', tier: 'B', type: 'Starter', desc: 'Lightning chain damage.', stats: { atk: 6, hp: 6 }, category: 'Hero' },
  { id: 'phoren', name: 'Phoren', tier: 'B', type: 'Starter', desc: 'Fire burn damage.', stats: { atk: 5, hp: 6 }, category: 'Hero' },
  { id: 'urasil', name: 'Urasil', tier: 'D', type: 'Starter', desc: 'Poison damage.', stats: { atk: 3, hp: 4 }, category: 'Hero' },
  { id: 'atreus', name: 'Atreus', tier: 'F', type: 'Starter', desc: 'Basic starting hero.', stats: { atk: 2, hp: 4 }, category: 'Hero' },
];

export const GEAR_DATA: BaseItem[] = [
  // Weapons
  { id: 'fist', name: 'Expedition Fist', tier: 'SSS', category: 'Weapon', desc: 'Melee/Ranged Hybrid. Explosive stacks.', isGodTier: true },
  { id: 'hammer', name: 'Celestial Might Hammer', tier: 'SSS', category: 'Weapon', desc: 'Zeus\'s weapon. Lightning AOE.', isGodTier: true },
  { id: 'asword', name: 'Antiquated Sword', tier: 'SS', category: 'Weapon', desc: 'Whirlwind blocks projectiles.' },
  { id: 'db', name: 'Demon Blade', tier: 'S', category: 'Weapon', desc: 'Melee hits heal HP. Essential for stutter-stepping.' },
  { id: 'scythe', name: 'Death Scythe', tier: 'A', category: 'Weapon', desc: 'Knockback + 30% HP Headshot.' },
  { id: 'spear', name: 'Brightspear', tier: 'A', category: 'Weapon', desc: 'Instant laser fire.' },
  { id: 'staff', name: 'Stalker Staff', tier: 'B', category: 'Weapon', desc: 'Homing projectiles. SSS ONLY with Diagonal Arrows.' },
  { id: 'bow', name: 'Brave Bow', tier: 'B', category: 'Weapon', desc: 'Standard starter weapon.' },
  { id: 'tornado', name: 'Tornado', tier: 'C', category: 'Weapon', desc: 'Return damage boomerang.' },
  { id: 'saw', name: 'Saw Blade', tier: 'C', category: 'Weapon', desc: 'Very fast attack speed starter.' },

  // Armor
  { id: 'golden', name: 'Golden Chestplate', tier: 'S', category: 'Armor', desc: 'Dmg Resistance. Best for chapters.' },
  { id: 'phantom', name: 'Phantom Cloak', tier: 'S', category: 'Armor', desc: 'Freezes enemies. Best for Bosses.' },
  { id: 'bright_robe', name: 'Bright Robe', tier: 'A', category: 'Armor', desc: 'XP gain & frontal resist.' },
  { id: 'inferno_robe', name: 'Inferno Robe', tier: 'S', category: 'Armor', desc: 'Fire aura resistance.' },

  // Rings
  { id: 'bull', name: 'Bull Ring', tier: 'SS', category: 'Ring', desc: '10% Dmg Resistance (Mobs).' },
  { id: 'dragon_ring', name: 'Dragon Ring', tier: 'SS', category: 'Ring', desc: '12% Projectile Resistance.' },
  { id: 'celestial_band', name: 'Celestial Band', tier: 'S', category: 'Ring', desc: 'Essential for Zeus synergy.' },

  // Lockets
  { id: 'bloodthirst', name: 'Bloodthirst Locket', tier: 'S', category: 'Locket', desc: 'Heal on kill. Essential for Mobs.' },
  { id: 'angel', name: 'Angel Locket', tier: 'S', category: 'Locket', desc: 'Revive chance. Essential for Bosses.' },
  { id: 'bulletproof', name: 'Bulletproof Locket', tier: 'S', category: 'Locket', desc: 'Projectile Resist. PR Build.' },

  // Books
  { id: 'giants', name: 'Giant\'s Contract', tier: 'SS', category: 'Book', desc: 'Shield + Melee buff.' },
  { id: 'arc_time', name: 'Arcanum of Time', tier: 'SS', category: 'Book', desc: 'Freezes time.' },
  { id: 'enlight', name: 'Enlightenment', tier: 'S', category: 'Book', desc: 'Free skills over time.' },

  // Spirits
  { id: 'bat', name: 'Laser Bat', tier: 'S', category: 'Spirit', desc: 'Shoots through walls. Best.' },
  { id: 'owl', name: 'Noisy Owl', tier: 'A', category: 'Spirit', desc: 'High knockback shots.' },

  // Pets
  { id: 'uni', name: 'Empyrean Unicorn', tier: 'SS', category: 'Pet', desc: 'Massive Hero Stat boosts.' },
  { id: 'cappy', name: 'Frothy Cappy', tier: 'SS', category: 'Pet', desc: 'Provides active shields.' },
  { id: 'phoenix', name: 'Blazing Phoenix', tier: 'SS', category: 'Pet', desc: 'Revive assist and fire rain.' },

  // Dragons
  { id: 'magmar', name: 'Magmar', tier: 'SS', category: 'Dragon', desc: 'Mana Regen & Fire Resistance.' },
  { id: 'starrite', name: 'Starrite', tier: 'SS', category: 'Dragon', desc: 'Meteor falling damage.' },
  { id: 'necro', name: 'Necrogon', tier: 'S', category: 'Dragon', desc: 'Passive Projectile Resistance.' },
  { id: 'geo', name: 'Geogon', tier: 'S', category: 'Dragon', desc: 'Rock Shield invincibility.' },

  // Totems
  { id: 'totem_atk', name: 'Attack Totem', tier: 'SSS', category: 'Totem', desc: 'Global Attack. Upgrade FIRST.', isGodTier: true },
  { id: 'totem_hp', name: 'Health Totem', tier: 'SS', category: 'Totem', desc: 'Global HP. Upgrade SECOND.' },
];

export const HERO_EFFICIENCY_DATA = [
  { name: 'Wukong', bonus: '+8% Global Attack', priority: '10/10' },
  { name: 'Melinda', bonus: '+5% Global Attack', priority: '9.5/10' },
  { name: 'Dragon Girl', bonus: '+5% Global Attack', priority: '8.5/10' },
  { name: 'Taiga', bonus: '+5% Global Attack', priority: '8/10' },
  { name: 'Stella', bonus: '+5% Global Attack', priority: '8/10' },
  { name: 'Bobo', bonus: '+5% Max HP', priority: '4/10' },
  { name: 'Atreus', bonus: '+2% Max HP', priority: '1/10' },
];

export const SKIN_VALUE_DATA = [
  { name: 'Baker (Melinda)', boost: 'Attack +3%', value: '3000 Raw ATK' },
  { name: 'Cherry (Meowgik)', boost: 'Attack +2%', value: '2000 Raw ATK' },
  { name: 'Coast Guard (Helix)', boost: 'Attack +250', value: '250 Flat' },
  { name: 'Lightning God (Zeus)', boost: 'Atk +5%', value: '5000+ Raw ATK' },
];

export const EQUIPMENT_META_DATA = [
  { slot: 'Weapon', bis: 'Expedition Fist', alt: 'Celestial Hammer' },
  { slot: 'Armor', bis: 'Golden Chestplate', alt: 'Phantom Cloak' },
  { slot: 'Ring', bis: '2x Dragon Ring', alt: '1x Bull / 1x Dragon' },
  { slot: 'Pet', bis: 'Empyrean Unicorn', alt: 'Frothy Cappy' },
];

export const ARCHERO_KNOWLEDGE_BASE = `
[ARCHERO 2025 ULTIMATE WIKI DATA]
HERO EFFICIENCY:
- Lv120 Priority: Wukong (+8% Atk), Melinda (+5% Atk), Dragon Girl (+5% Atk).
- Skin Value: +2% Attack is approx 2000 raw attack in late game. Always buy Global Atk skins first.

IMMORTAL BUILD (PR):
- Goal: 100% Projectile Resistance. Take 0 damage from bullets.
- Core: Mythic Dragon Rings, Bulletproof Locket, Necrogon Dragon, Enlightenment Book.
- Warning: PR is capped/nerfed in H90+ Inferno Mode. Focus on Collision Resist.

ESTATE STRATEGY:
- Upgrade Attack Totem first, then HP Totem.

META WEAPONS:
- Stalker Staff MUST use Diagonal Arrows. Avoid Front Arrow.
- Expedition Fist is currently the strongest hybrid weapon.
- Demon Blade: Essential for stutter-stepping mastery.
`;
