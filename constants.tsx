
import { Hero, BaseItem, Ability } from './types';

export const HERO_DATA: Hero[] = [
  { 
    id: 'zeus', name: 'Zeus', tier: 'SSS', type: 'God Meta', 
    desc: 'Lightning God. Attacks deal Chain Lightning.', 
    details: 'MUST use with Celestial Set (Hammer + Band) for God-Tier synergy.',
    bestSkin: 'Celestial God', stats: { atk: 10, hp: 10 }, category: 'Hero', isGodTier: true 
  },
  { 
    id: 'wukong', name: 'Wukong', tier: 'SSS', type: 'Utility God', 
    desc: 'Monkey King. High utility even at low stars.', 
    details: 'Lv120 evolution gives +8% Global Attack to all heroes.',
    stats: { atk: 10, hp: 9 }, category: 'Hero', isGodTier: true 
  },
  { id: 'melinda', name: 'Melinda', tier: 'SSS', type: 'Burst DPS', desc: 'Best non-God Burst DPS.', details: 'Best with Baker skin. Massive barrage damage.', bestSkin: 'Baker', stats: { atk: 10, hp: 8 }, category: 'Hero' },
  { id: 'helix', name: 'Helix', tier: 'S', type: 'Aggressive F2P', desc: 'Consistent DPS through Rage.', details: 'Best for Aggressive play. 4-Star Evolution buffs Rage significantly.', bestSkin: 'Coast Guard', stats: { atk: 8, hp: 10 }, category: 'Hero' },
  { id: 'meowgik', name: 'Meowgik', tier: 'S', type: 'Defensive F2P', desc: 'Kitties track through walls.', details: 'Best for Defensive/Wall play. Excellent for Dodge builds.', stats: { atk: 8, hp: 9 }, category: 'Hero' },
];

export const GEAR_DATA: BaseItem[] = [
  // Weapons
  { id: 'fist', name: 'Expedition Fist', tier: 'SSS', category: 'Weapon', desc: 'Melee/Ranged Hybrid. Explosive stacks.', details: 'The top melee meta. Heals on melee kills.' },
  { id: 'hammer', name: 'Celestial Hammer', tier: 'SSS', category: 'Weapon', desc: 'Zeus weapon. Lighting AOE.', details: 'Thunder God synergy with Celestial Band.' },
  { id: 'sword', name: 'Antiquated Sword', tier: 'SS', category: 'Weapon', desc: 'Whirlwind blocks projectiles.', details: 'Active skill provides invincibility frame.' },
  { id: 'staff', name: 'Stalker Staff', tier: 'B', category: 'Weapon', desc: 'Homing projectiles.', details: 'SSS tier ONLY with Diagonal Arrows.', synergy: "BEST: Diagonal Arrows. WORST: Front Arrow." },
  { id: 'blade', name: 'Demon Blade', tier: 'S', category: 'Weapon', desc: 'Melee kills heal HP.', details: 'Classic wave-clearing meta.' },
  { id: 'scythe', name: 'Death Scythe', tier: 'A', category: 'Weapon', desc: 'High knockback.', details: "Hidden Stat: 30% HP Headshot chance on mobs." },

  // Armor
  { id: 'golden_chest', name: 'Golden Chestplate', tier: 'S', category: 'Armor', desc: 'Damage Resistance.', details: 'Best for late-game chapters survival.' },
  { id: 'phantom_cloak', name: 'Phantom Cloak', tier: 'S', category: 'Armor', desc: 'Freezes enemies.', details: 'Meta for Boss Rush chapters.' },

  // Rings
  { id: 'bull_ring', name: 'Bull Ring', tier: 'SS', category: 'Ring', desc: '10% Dmg Resistance (Mobs).', details: 'Essential for mob chapters.' },
  { id: 'dragon_ring', name: 'Dragon Ring', tier: 'SS', category: 'Ring', desc: '12% Projectile Resistance.', details: 'Essential for projectile bosses.' },
  { id: 'celestial_band', name: 'Celestial Band', tier: 'S', category: 'Ring', desc: 'Essential for Zeus.', details: 'Enables Thunder God set effects.' },

  // Books
  { id: 'giants_contract', name: 'Giant\'s Contract', tier: 'SS', category: 'Book', desc: 'Shield + Melee buff.', details: 'Turns you into a giant with massive damage reduction.' },
  { id: 'arcanum_time', name: 'Arcanum of Time', tier: 'SS', category: 'Book', desc: 'Time freeze.', details: 'Slows down the screen for burst damage.' },
  { id: 'enlightenment', name: 'Enlightenment', tier: 'S', category: 'Book', desc: 'Free skills.', details: 'Best for AFK/Endless runs.' },

  // Lockets
  { id: 'bloodthirst_locket', name: 'Bloodthirst Locket', tier: 'S', category: 'Locket', desc: 'Heals % HP on kill.', details: 'Essential for Mob/Wave chapters.' },
  { id: 'angel_locket', name: 'Angel Locket', tier: 'S', category: 'Locket', desc: 'Revive chance.', details: 'Best for Boss chapters.' },
  { id: 'bulletproof_locket', name: 'Bulletproof Locket', tier: 'A', category: 'Locket', desc: 'Proj Dmg Reduction.', details: 'Solid defensive alternative.' },

  // Spirits (Ghosts)
  { id: 'bat', name: 'Laser Bat', tier: 'S', category: 'Spirit', desc: 'Shoots through walls.', details: 'Most reliable spirit. Never misses due to obstacles.' },
  { id: 'owl', name: 'Noisy Owl', tier: 'A', category: 'Spirit', desc: 'Knockback focus.', details: 'Helps keep melee mobs away.' },

  // Pets (New System)
  { id: 'unicorn', name: 'Empyrean Unicorn', tier: 'SS', category: 'Pet', desc: 'Massive Hero Stat boosts.', details: 'New meta system pet. Direct scaling.' },
  { id: 'cappy', name: 'Frothy Cappy', tier: 'SS', category: 'Pet', desc: 'Shield/Resist focus.', details: 'Defensive pet for high-damage stages.' },

  // Dragons
  { id: 'magmar', name: 'Magmar', tier: 'SS', category: 'Dragon', desc: 'Mana Regen & Fire Resist.', details: '#1 Dragon for spell spamming.' },
  { id: 'necrogon', name: 'Necrogon', tier: 'S', category: 'Dragon', desc: 'Proj Resist Passive.', details: 'Crucial for Inferno meta caps.' },
  { id: 'geogon', name: 'Geogon', tier: 'S', category: 'Dragon', desc: 'Rock Shield.', details: 'Temporary invincibility skill.' },
];

export const ARCHERO_KNOWLEDGE_BASE = `
[JP WIKI META 2025]
HEROES:
- Zeus (SSS): Needs Celestial Set. Chain Lightning.
- Wukong (SSS): Clones + Utility.
- Melinda (SSS): Burst God.
- Helix (S): Aggressive Rage DPS.
- Meowgik (S-): Defensive Wall-play DPS.

INFERNO META (H90+):
- Projectile Resistance is capped.
- Switch focus to Raw HP and Collision Resistance.

FARMING:
- Hatch Crimson Witch & Skull Wizard for Crit Damage.
`;
