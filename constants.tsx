
import { Hero, BaseItem, Ability } from './types';

export const HERO_DATA: Hero[] = [
  { 
    id: 'zeus', name: 'Zeus', tier: 'SSS', type: 'God Meta', 
    desc: 'Lightning God. Attacks deal Chain Lightning.', 
    details: 'Thunder God\'s Wrath triggers with Celestial Set (Hammer + Band). Unbeatable in high PVP/PVE.',
    bestSkin: 'Celestial God', stats: { atk: 10, hp: 10 }, category: 'Hero', isGodTier: true 
  },
  { 
    id: 'wukong', name: 'Wukong', tier: 'SSS', type: 'End-Game Meta', 
    desc: 'Monkey King. Summons Rotating Staff & Clones.', 
    details: 'Amazing utility at 0-1 Stars. God Tier scaling at 4+. Lv120 gives +8% Attack to ALL heroes.',
    stats: { atk: 10, hp: 9 }, category: 'Hero', isGodTier: true 
  },
  { 
    id: 'arthur', name: 'King Arthur', tier: 'SSS', type: 'Melee Meta', 
    desc: 'Excalibur Master. Massive AOE.', 
    details: 'Sheathed/Unsheathed mechanic. Heals on kill. High survivability and damage reduction.',
    stats: { atk: 10, hp: 10 }, category: 'Hero', isGodTier: true 
  },
  { id: 'melinda', name: 'Melinda', tier: 'SSS', type: 'Premium DPS', desc: 'Best non-God DPS. Barrage skill.', bestSkin: 'Baker', stats: { atk: 10, hp: 8 }, category: 'Hero' },
  { id: 'helix', name: 'Helix', tier: 'S', type: 'F2P King', desc: 'Rage ability. Damage increases as HP drops.', bestSkin: 'Coast Guard', stats: { atk: 8, hp: 10 }, category: 'Hero' },
];

export const GEAR_DATA: BaseItem[] = [
  // Weapons
  { id: 'hammer', name: 'Celestial Might Hammer', tier: 'SSS', category: 'Weapon', desc: 'Zeus\'s weapon. Lightning AOE.', details: 'Triggers "Thunder God\'s Wrath" synergy with Celestial Band.', isGodTier: true },
  { id: 'fist', name: 'Expedition Fist', tier: 'SSS', category: 'Weapon', desc: 'Melee/Ranged Hybrid. One Punch explosive stacks.', details: 'Melee hits build "One Punch" stacks; max stacks = massive AOE explosion.', synergy: 'Scales wildly with Melinda barrage.' },
  { id: 'sword', name: 'Antiquated Sword', tier: 'SS', category: 'Weapon', desc: 'Whirlwind blocks projectiles.', details: 'High skill ceiling. Active Whirlwind provides 360-degree projectile defense.' },
  { id: 'staff', name: 'Stalker Staff', tier: 'B', category: 'Weapon', desc: 'Tracking projectiles.', details: 'Normally low tier, but tracking makes it broken with specific skills.', synergy: "BEST: Diagonal Arrows (SSS God Tier). WORST: Front Arrow (DPS Loss)." },
  { id: 'blade', name: 'Demon Blade', tier: 'S', category: 'Weapon', desc: 'Melee kills heal HP.', details: 'Melee attacks do 2x damage. Essential for stutter-stepping and wave healing.' },
  { id: 'scythe', name: 'Death Scythe', tier: 'A', category: 'Weapon', desc: 'High knockback.', details: 'Hidden Stat: 30% HP Headshot (Insta-kill) chance on mobs.' },
  
  // Armor
  { id: 'celestial_armor', name: 'Celestial Plate', tier: 'SSS', category: 'Armor', desc: 'God-tier set piece.', details: 'Part of the Celestial Set for Zeus synergy.', isGodTier: true },
  { id: 'golden_chest', name: 'Golden Chestplate', tier: 'S', category: 'Armor', desc: 'Damage Reduction.', details: 'Highest flat damage reduction for wave tanking.' },
  
  // Rings
  { id: 'bull', name: 'Bull Ring', tier: 'SSS', category: 'Ring', desc: '10% Mob Damage Resistance.', details: 'Best in Slot for survival. Resistance > Attack in late game.' },
  { id: 'dragon_ring', name: 'Dragon Ring', tier: 'SS', category: 'Ring', desc: '12% Projectile Resistance.', details: 'Essential for bullet-hell bosses. Note: PR is capped in H90+.' },
  { id: 'celestial_band', name: 'Celestial Band', tier: 'SSS', category: 'Ring', desc: 'Zeus Synergy. Lightning Crit.', details: 'Mandatory piece for the Lightning God build.' },
  
  // Lockets
  { id: 'bloodthirst_locket', name: 'Bloodthirst Locket', tier: 'S', category: 'Locket', desc: 'Heals % HP on kill.', details: 'Essential for Mob chapters and long wave chapters to sustain HP.' },
  { id: 'angel_locket', name: 'Angel Locket', tier: 'S', category: 'Locket', desc: 'Chance to revive on death.', details: 'Best for Boss-only chapters where you might get one-shotted.' },
  { id: 'bulletproof_locket', name: 'Bulletproof Locket', tier: 'A', category: 'Locket', desc: 'Reduces Projectile Damage.', details: 'Decent for ranged-heavy chapters.' },
  
  // Pets (Spirits)
  { id: 'unicorn', name: 'Empyrean Unicorn', tier: 'SS', category: 'Pet', desc: 'Massive Hero Stat boosts.', details: 'The new meta pet. Boosts hero stats directly.' },
  { id: 'cappy', name: 'Frothy Cappy', tier: 'SS', category: 'Pet', desc: 'Shield/Resist focus.', details: 'Provides damage reduction and protection shields.' },
  { id: 'bat', name: 'Laser Bat', tier: 'S', category: 'Pet', desc: 'Shoots through walls.', details: 'F2P favorite. Reliability over damage. Bat projectiles never miss due to walls.' },
  { id: 'owl', name: 'Noisy Owl', tier: 'A', category: 'Pet', desc: 'Knockback specialist.', details: 'Great for keeping melee mobs at a distance.' },

  // Dragons
  { id: 'magmar', name: 'Magmar', tier: 'SSS', category: 'Dragon', desc: 'Mana Consumption Reduced.', details: 'The #1 Dragon for competitive play. Allows skill spamming.' },
  { id: 'necrogon', name: 'Necrogon', tier: 'SS', category: 'Dragon', desc: 'Projectile Resist Passive.', details: 'Crucial for Inferno mode PR passives.' },
  
  // Relics
  { id: 'holy_grail', name: 'Holy Grail', tier: 'SSS', category: 'Relic', desc: '#1 Relic (Max HP %).', details: 'Radiant tier relic providing the highest HP scaling in game.', isGodTier: true },
  { id: 'demon_king_eye', name: 'Demon King\'s Eye', tier: 'SSS', category: 'Relic', desc: 'Crit Rate & Dmg.', details: 'Radiant tier relic. Essential for end-game DPS builds.', isGodTier: true },
];

export const ABILITIES_DATA: Ability[] = [
  { name: 'Ricochet', tier: 'SSS', desc: 'Bounces between enemies.', whenToPick: 'Mandatory for mobs.' },
  { name: 'Diagonal Arrows', tier: 'SSS', desc: '3x Tracking arrows for Staff.', whenToPick: 'S-tier only with Stalker Staff. God tier synergy.' },
  { name: 'Front Arrow +1', tier: 'SS', desc: '+1 Arrow, -25% Dmg.', whenToPick: 'Good for most. BAD for Staff.' },
];

export const ARCHERO_KNOWLEDGE_BASE = `
[JP WIKI - ULTIMATE ARCHERO 2025 META]
GODS:
- Zeus (SSS): Lightning God. Use Celestial Hammer + Band for "Thunder God's Wrath".
- Wukong (SSS): Monkey King. Lv120 = +8% global Attack. Excellent clones and utility.
- Arthur (SSS): Excalibur AOE. Heals on kill. Massive sustain.

INFERNO META (H90+):
- Projectile Resistance (PR) is capped. Shift focus to Raw HP and Collision Resist.
- Necrogon dragon is essential for PR passives.
- Magmar is #1 Dragon for mana management.

WEAPON SYNERGIES:
- Stalker Staff + Diagonal Arrows = SSS Tier.
- Stalker Staff + Front Arrow = DPS LOSS (BAD).
- Expedition Fist + Melinda = Highest burst potential.

EQUIPMENT:
- Bloodthirst Locket: Essential for wave chapters.
- Angel Locket: Essential for boss chapters.
- Laser Bat: Best utility pet (shoots through walls).
- Empyrean Unicorn: Best end-game stat pet.

FARMING:
- Gold: Up-Close Dangers (Daily).
- Scrolls: H10/H21.
`;

export const MECHANICS = [
  { title: 'Stutter Stepping', desc: 'Animation canceling for +35% speed. Rhythm: Attack -> Tap -> Attack.' },
  { title: 'Inferno Resistance', desc: 'Endgame chapters (H90+) require Raw HP over capped PR stats.' },
];
