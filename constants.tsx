
import { Hero, BaseItem, Ability } from './types';

export const HERO_DATA: Hero[] = [
  { 
    id: 'zeus', name: 'Zeus', tier: 'SSS', type: 'God Meta', 
    desc: 'Lightning God. Attacks deal Chain Lightning.', 
    details: 'MUST use with Celestial Set (Hammer + Band) for God-Tier synergy.',
    bestSkin: 'Celestial God', stats: { atk: 10, hp: 10 }, category: 'Hero', isGodTier: true 
  },
  { 
    id: 'wukong', name: 'Wukong', tier: 'SSS', type: 'End-Game Meta', 
    desc: 'Monkey King. Summons Rotating Staff & Clones.', 
    details: 'Utility God. Lv120 evolution gives +8% Global Attack to all heroes.',
    stats: { atk: 10, hp: 9 }, category: 'Hero', isGodTier: true 
  },
  { 
    id: 'arthur', name: 'King Arthur', tier: 'SSS', type: 'Melee Meta', 
    desc: 'Excalibur Master. Heals on kill.', 
    details: 'Highest sustain for end-game chapters. Massive AOE coverage.',
    stats: { atk: 10, hp: 10 }, category: 'Hero', isGodTier: true 
  },
  { id: 'melinda', name: 'Melinda', tier: 'SSS', type: 'Premium DPS', desc: 'Best non-God Burst DPS.', details: 'Barrage skill scales with projectile count.', bestSkin: 'Baker', stats: { atk: 10, hp: 8 }, category: 'Hero' },
  { id: 'helix', name: 'Helix', tier: 'S', type: 'F2P King', desc: 'Rage ability builds massive DPS.', details: '4-Star Evolution buffs Rage significantly. Best F2P investment.', bestSkin: 'Coast Guard', stats: { atk: 8, hp: 10 }, category: 'Hero' },
];

export const GEAR_DATA: BaseItem[] = [
  // Weapons
  { id: 'fist', name: 'Expedition Fist', tier: 'SSS', category: 'Weapon', desc: 'Melee/Ranged Hybrid. One Punch explosive stacks.', details: 'The broken melee meta weapon. High burst and healing.' },
  { id: 'hammer', name: 'Celestial Hammer', tier: 'SSS', category: 'Weapon', desc: 'Zeus weapon. Lightning AOE.', details: 'Required for Thunder God mode.' },
  { id: 'sword', name: 'Antiquated Sword', tier: 'SS', category: 'Weapon', desc: 'Whirlwind blocks projectiles.', details: 'Active skill provides invincibility frame against bullets.' },
  { id: 'staff', name: 'Stalker Staff', tier: 'B', category: 'Weapon', desc: 'Tracking homing projectiles.', details: 'Meta-dependent. Becomes God tier with specific skills.', synergy: "BEST: Diagonal Arrows. WORST: Front Arrow." },
  { id: 'blade', name: 'Demon Blade', tier: 'S', category: 'Weapon', desc: 'Melee kills heal HP.', details: 'Best weapon for wave chapters (H10, H21).' },
  { id: 'scythe', name: 'Death Scythe', tier: 'A', category: 'Weapon', desc: 'High knockback.', details: "Hidden Stat: 30% HP Headshot (Insta-kill) chance on mobs." },

  // Armor
  { id: 'golden_chest', name: 'Golden Chestplate', tier: 'S', category: 'Armor', desc: 'Damage Resistance.', details: 'Best for high chapters where survival is impossible.' },
  { id: 'phantom_cloak', name: 'Phantom Cloak', tier: 'S', category: 'Armor', desc: 'Freezes enemies.', details: 'Meta for Boss rush chapters (H14, H21).' },
  { id: 'celestial_armor', name: 'Celestial Plate', tier: 'SSS', category: 'Armor', desc: 'Set piece for Zeus.', details: 'Part of the God-Tier Celestial set.', isGodTier: true },
  { id: 'dex_vest', name: 'Vest of Dexterity', tier: 'B', category: 'Armor', desc: 'Outdated dodge armor.', details: 'Dodge meta is currently inferior to Damage Resistance.' },

  // Rings
  { id: 'bull_ring', name: 'Bull Ring', tier: 'SS', category: 'Ring', desc: '10% Dmg Resistance (Mobs).', details: 'Essential for progression. Never fodder these.' },
  { id: 'dragon_ring', name: 'Dragon Ring', tier: 'SS', category: 'Ring', desc: '12% Projectile Resistance.', details: 'Crucial for bullet-hell bosses.' },
  { id: 'celestial_band', name: 'Celestial Band', tier: 'S', category: 'Ring', desc: 'Essential for Zeus.', details: 'Required to complete Thunder God set.' },

  // Books
  { id: 'giants_contract', name: 'Giant\'s Contract', tier: 'SS', category: 'Book', desc: 'Shield + Melee buff.', details: 'Turns you into a giant with massive damage reduction.' },
  { id: 'arcanum_time', name: 'Arcanum of Time', tier: 'SS', category: 'Book', desc: 'Time freeze burst.', details: 'Best for burning down bosses in seconds.' },
  { id: 'enlightenment', name: 'Enlightenment', tier: 'S', category: 'Book', desc: 'AFK/Endless runs.', details: 'Generates free random skills over time.' },

  // Pets (Spirits)
  { id: 'unicorn', name: 'Empyrean Unicorn', tier: 'SS', category: 'Pet', desc: 'Massive Hero Stat boosts.', details: 'New meta pet. Actually provides useful scaling stats.' },
  { id: 'cappy', name: 'Frothy Cappy', tier: 'SS', category: 'Pet', desc: 'Shield/Resist focus.', details: 'Defensive pet that protects the hero.' },
  { id: 'bat', name: 'Laser Bat', tier: 'S', category: 'Pet', desc: 'Shoots through walls.', details: 'Classic F2P choice. Reliable damage that never misses.' },

  // Dragons
  { id: 'magmar', name: 'Magmar', tier: 'SS', category: 'Dragon', desc: 'Reduces Mana cost.', details: 'The #1 Dragon statue for high-end play.' },
  { id: 'necrogon', name: 'Necrogon', tier: 'S', category: 'Dragon', desc: 'Projectile Resistance Passive.', details: 'Critical for Inferno mode stat caps.' },
  { id: 'geogon', name: 'Geogon', tier: 'S', category: 'Dragon', desc: 'Rock Shield (Invincibility).', details: 'Lifesaver for tricky mob rooms.' },
];

export const ABILITIES_DATA: Ability[] = [
  { name: 'Ricochet', tier: 'SSS', desc: 'Bounces between enemies.', whenToPick: 'Mandatory for mobs.' },
  { name: 'Diagonal Arrows', tier: 'SSS', desc: 'Adds two side arrows.', whenToPick: 'S-tier with Staff. Good for melee.' },
  { name: 'Front Arrow +1', tier: 'SS', desc: '+1 Arrow, -25% Dmg.', whenToPick: 'Good for most. BAD for Staff.' },
];

export const ARCHERO_KNOWLEDGE_BASE = `
[ARCHERO 2025 ULTIMATE STRATEGY]
GODS:
- Zeus (SSS): Needs Celestial Set. Chain Lightning is king.
- Wukong (SSS): Clones and Rotating Staff provide defense.
- Arthur (SSS): Best for melee wave pushing.

WEAPON SYNERGIES:
- Stalker Staff + Diagonal Arrows = God Tier (300% Dmg).
- Stalker Staff + Front Arrow = DPS LOSS.
- Death Scythe has hidden 30% Headshot chance.

INFERNO META (H90+):
- Projectile Resistance is capped.
- Switch focus to Raw HP and Collision Resistance.
- Necrogon dragon is essential for PR passives.

FARMING:
- Gold: Up-Close Dangers (Always use Bull Rings).
- Items: H10, H21 Boss Rush.
`;

export const MECHANICS = [
  { title: 'Stutter Stepping', desc: 'Cancel animation after firing to fire ~35% faster. Essential for high chapters.' },
  { title: 'Resistance Caps', desc: 'Projectile Resistance is less effective in Inferno. Shift focus to Raw HP.' },
];
