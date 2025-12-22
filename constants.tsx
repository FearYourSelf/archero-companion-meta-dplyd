import { Hero, BaseItem, Jewel, Relic } from './types';

// --- 1. HERO ROSTER (V6.0 Complete - Meta 2025/2026 Injected) ---
export const HERO_DATA: Hero[] = [
  // SSS TIER
  { 
    id: 'zeus', 
    name: 'Zeus', 
    tier: 'SSS', 
    category: 'Hero', 
    isGodTier: true, 
    globalBonus120: '+8% Max HP', 
    desc: 'Lightning Sovereign.', 
    deepLogic: 'Lightning chains ignore 15% Dmg Resist. 6-Star "Static Field" denies area.', 
    evo4Star: 'Sustained attacks ramp up Atk Speed', 
    trivia: 'Zeus was released alongside the 2024 Anniversary event.', 
    bestPairs: ['Celestial Hammer', 'Celestial Warplate'] 
  },
  { 
    id: 'wukong', 
    name: 'Wukong', 
    tier: 'SSS', 
    category: 'Hero', 
    isGodTier: true, 
    globalBonus120: '+8% Attack', 
    desc: 'Monkey King.', 
    deepLogic: 'Summons "Golden Cudgel" (blocks projectiles). 4-Star spawns clones on lethal dmg.', 
    evo4Star: 'Phantom Hair (Decoy).', 
    trivia: 'The Golden Cudgel has a hidden collision damage multiplier.' 
  },
  { 
    id: 'melinda', 
    name: 'Melinda', 
    tier: 'SSS', 
    category: 'Hero', 
    isGodTier: true, 
    globalBonus120: '+5% Dmg to All Units', 
    desc: 'Barrage Queen.', 
    deepLogic: 'Barrage intensity doubles at low HP (Berserker).', 
    evo4Star: 'More projectiles at lower HP.', 
    bestPairs: ['Expedition Fist', 'Phantom Cloak'] 
  },
  // SS TIER
  { id: 'dragon_girl', name: 'Dragon Girl', tier: 'SS', category: 'Hero', globalBonus120: '+5% Dmg to Ranged', desc: 'Wyvern Summoner.', deepLogic: 'Summons "Riri" (Homing Ricochet). 4-Star grants Dragon Crit + Blaze.', trivia: 'Riri inherits 80% of your critical damage stat.' },
  { 
    id: 'taiga', 
    name: 'Taiga', 
    tier: 'SS', 
    category: 'Hero', 
    globalBonus120: '+17% Crit Damage', 
    desc: 'Meteor Tank.', 
    deepLogic: 'Mandatory L120 for massive global Crit Dmg.', 
    uniqueEffect: 'Global Crit King' 
  },
  { id: 'elaine', name: 'Elaine', tier: 'SS', category: 'Hero', globalBonus120: '+7% Max HP', desc: 'Invulnerability.', deepLogic: 'Cherry Blossom skin + Expedition Plate = Infinite Shield.' },
  { id: 'stella', name: 'Stella', tier: 'SS', category: 'Hero', globalBonus120: '+6% Attack', desc: 'Star Caster.' },
  // S TIER
  { id: 'helix', name: 'Helix', tier: 'S', category: 'Hero', globalBonus120: '+6% Max HP', desc: 'Rage King.', deepLogic: 'Damage +1.2% per 1% HP lost. Best F2P Hero.', bestPairs: ['Demon Blade', 'Bull Ring'], trivia: 'Helix remains the most used hero in F2P history.' },
  { id: 'meowgik', name: 'Meowgik', tier: 'S', category: 'Hero', globalBonus120: '+3% Dodge', desc: 'Cat Summoner.', deepLogic: 'Cats spawn based on Atk Speed.' },
  { id: 'shingen', name: 'Shingen', tier: 'S', category: 'Hero', globalBonus120: '+120 Dmg to Melee', desc: 'Blade Specialist.' },
  { id: 'gugu', name: 'Gugu', tier: 'S', category: 'Hero', globalBonus120: '+5% Dmg to Undead', desc: 'Owl Guardian.' },
  { id: 'iris', name: 'Iris', tier: 'S', category: 'Hero', globalBonus120: '+5% Attack', desc: 'RNG Master.' },
  { id: 'blazo', name: 'Blazo', tier: 'S', category: 'Hero', globalBonus120: '+8% Max HP', desc: 'Assassin.' },
  // A TIER
  { id: 'onir', name: 'Onir', tier: 'A', category: 'Hero', globalBonus120: '+20% Healing Effect', desc: 'Holy Light.', deepLogic: '7-Star Evolution grants Global +10% Projectile Resistance.', uniqueEffect: 'Global Proj Resist' },
  { id: 'sylvan', name: 'Sylvan', tier: 'A', category: 'Hero', globalBonus120: '+5% Attack', desc: 'Elementalist.', deepLogic: 'Removes elemental arrows from RNG pool.' },
  { id: 'shade', name: 'Shade', tier: 'A', category: 'Hero', globalBonus120: '+10% Crit Dmg', desc: 'Shadow Form.' },
  { id: 'ayana', name: 'Ayana', tier: 'A', category: 'Hero', globalBonus120: '+4% Attack', desc: 'Portal Mage.' },
  { id: 'rolla', name: 'Rolla', tier: 'A', category: 'Hero', globalBonus120: '+5% Attack', desc: 'Ice Queen.' },
  { id: 'ophelia', name: 'Ophelia', tier: 'A', category: 'Hero', globalBonus120: '+120 Attack', desc: 'Soul Hunter.' },
  { id: 'ryan', name: 'Ryan', tier: 'A', category: 'Hero', globalBonus120: '+250 Dmg to Airborne', desc: 'Revive Tank.' },
  { id: 'lina', name: 'Lina', tier: 'A', category: 'Hero', globalBonus120: '+6% Max HP', desc: 'Debuff Dancer.' },
  { id: 'aquea', name: 'Aquea', tier: 'A', category: 'Hero', globalBonus120: '+5% Attack', desc: 'Sea Combatant.' },
  { id: 'bobo', name: 'Bobo', tier: 'A', category: 'Hero', globalBonus120: '+5% Dmg to All Units', desc: 'Chaos Debuffer.' },
  // B & C TIER
  { id: 'taranis', name: 'Taranis', tier: 'B', category: 'Hero', globalBonus120: '+4% Attack', desc: 'Thunder.' },
  { id: 'phoren', name: 'Phoren', tier: 'B', category: 'Hero', globalBonus120: '+2% Crit Chance', desc: 'Fire.' },
  { id: 'urasil', name: 'Urasil', tier: 'B', category: 'Hero', globalBonus120: '+15% Crit Dmg', desc: 'Poison.' },
  { id: 'shari', name: 'Shari', tier: 'C', category: 'Hero', globalBonus120: '+8% Max HP', desc: 'Vine Summoner.' },
  { id: 'bonnie', name: 'Bonnie', tier: 'C', category: 'Hero', globalBonus120: '+5% Max HP', desc: 'Clone Spammer.' },
  { 
    id: 'atreus', 
    name: 'Atreus', 
    tier: 'C', 
    category: 'Hero', 
    globalBonus120: '+7% Projectile Resistance', 
    desc: 'The Rookie.', 
    deepLogic: 'MANDATORY for 100% Immunity Build.', 
    uniqueEffect: 'Immunity Key' 
  }
];

// --- 2. THE ARMORY (V6.0 Merged Database - Meta 2025 + Legacy Items) ---
export const GEAR_DATA: BaseItem[] = [
  // --- WEAPONS ---
  { 
    id: 'exp_fist', 
    name: 'Expedition Fist', 
    tier: 'SSS', 
    category: 'Weapon', 
    desc: 'Hybrid Fist.', 
    mythicPerk: 'Titan Tales: Weapon Damage +15% (Final Multiplier)', 
    deepLogic: 'Melee heals 15% Dmg. Boxing and Striker modes.', 
    bestPairs: ['Expedition Plate', 'Expedition Locket'], 
    trivia: 'The most versatile weapon for melee-hybrid Melinda builds.' 
  },
  { 
    id: 'celestial_hammer', 
    name: 'Celestial Hammer', 
    tier: 'SSS', 
    category: 'Weapon', 
    desc: 'Lightning Hammer.', 
    mythicPerk: 'Titan Tales: Perpetual Charge (No cooldown switch)', 
    deepLogic: 'Lightning pierces walls. Heavenly Energy charges 20% faster when stationary.', 
    trivia: 'Released for Zeus meta, it completely changes the "standing still" gameplay.' 
  },
  { 
    id: 'ant_sword', 
    name: 'Antiquated Sword', 
    tier: 'SS', 
    category: 'Weapon', 
    desc: 'Greatsword.', 
    mythicPerk: 'Titan Tales: Whirlwind Reflects 30% Dmg', 
    deepLogic: '+40% Dmg vs Bosses. Broadsword mode has massive hidden reach increase.', 
    trivia: 'Preferred by Shingen mains for the Parry mechanic.' 
  },
  { 
    id: 'demon_blade', 
    name: 'Demon Blade', 
    tier: 'SS', 
    category: 'Weapon', 
    desc: 'Katana.', 
    mythicPerk: 'Titan Tales: Shadows inherit 100% Elemental Status', 
    deepLogic: 'Melee 1.8x Dmg. No Front Arrow synergy (decreases DPS).', 
    bestPairs: ['Giants Contract', 'Helix'], 
    trivia: 'Demon Blade was the first weapon to introduce high-damage melee to Archero.' 
  },
  { id: 'stalker_staff', name: 'Stalker Staff', tier: 'S', category: 'Weapon', desc: 'Homing Staff.', mythicPerk: 'Titan: +15% Flight Speed.', deepLogic: 'Stack Diagonal Arrows for triple output.', trivia: 'Staff projectiles follow targets even through walls.' },
  { id: 'brightspear', name: 'Brightspear', tier: 'A', category: 'Weapon', desc: 'Laser.', mythicPerk: 'Titan: Split Beam.', uniqueEffect: 'Instant Travel Time' },
  { id: 'tornado', name: 'Tornado', tier: 'A', category: 'Weapon', desc: 'Boomerang effect.', uniqueEffect: 'Built-in Pierce and Ricochet.', trivia: 'Tornado deals double damage on the return flight.' },
  { 
    id: 'death_scythe', 
    name: 'Death Scythe', 
    tier: 'A', 
    category: 'Weapon', 
    desc: 'Heavy Scythe.', 
    mythicPerk: 'Titan Tales: Headshot threshold <35% HP', 
    deepLogic: 'High knockback, best for crowd control in mob rooms.'
  },
  { id: 'gale_force', name: 'Gale Force', tier: 'B', category: 'Weapon', desc: 'Charged Crossbow.', uniqueEffect: 'High burst, slow wind-up.', deepLogic: 'Auto-attacks charge up a powerful single arrow.' },
  { id: 'saw_blade', name: 'Saw Blade', tier: 'C', category: 'Weapon', desc: 'Fastest attack speed.', uniqueEffect: 'High Speed Protocol', trivia: 'Excellent for proccing "on hit" elemental effects.' },
  { id: 'brave_bow', name: 'Brave Bow', tier: 'C', category: 'Weapon', desc: 'Standard Bow.', mythicPerk: 'Titan: High Crit Synergy.', deepLogic: 'Balance weapon, no major weaknesses.' },
  { id: 'mini_atreus', name: 'Mini Atreus', tier: 'D', category: 'Weapon', desc: 'Meme weapon.', uniqueEffect: 'Just for fun.', trivia: 'Shoots cute projectiles including candies and balls.' },

  // --- ARMOR ---
  { id: 'c_warplate', name: 'Celestial Warplate', tier: 'SSS', category: 'Armor', desc: 'Lightning Plate.', mythicPerk: 'Titan: Collision Resist +20%.', bestPairs: ['Celestial Hammer'], trivia: 'Collision resistance is capped at 85%.' },
  { id: 'exp_plate', name: 'Expedition Plate', tier: 'SSS', category: 'Armor', desc: 'Heart Plate.', mythicPerk: 'Titan: Heart Drop +20%.', trivia: 'Hearts also grant a temporary damage reduction shield.' },
  { 
    id: 'p_cloak', 
    name: 'Phantom Cloak', 
    tier: 'SS', 
    category: 'Armor', 
    desc: 'Ice Cloak.', 
    mythicPerk: 'Titan Tales: Freeze +2.5s. Frozen enemies take +30% Dmg', 
    deepLogic: 'Best single-slot defense for bossing.', 
    trivia: 'Still the meta for high-level bosses.' 
  },
  { id: 'bright_robe', name: 'Bright Robe', tier: 'A', category: 'Armor', desc: 'Front Dmg Resistance + XP Boost.', deepLogic: 'Level up faster in-chapter to unlock more skills.' },
  { id: 'shadow_robe', name: 'Shadow Robe', tier: 'A', category: 'Armor', desc: 'Dark damage nearby.', deepLogic: 'Excellent for mobbing chapters with high density.' },
  { id: 'void_robe', name: 'Void Robe', tier: 'B', category: 'Armor', desc: 'Room Poison.', deepLogic: 'Poisons all enemies in the room upon entry.' },
  { id: 'vest_dex', name: 'Vest of Dexterity', tier: 'B', category: 'Armor', desc: 'Dodge +7%.', uniqueEffect: 'Lightning Splash', deepLogic: 'Pairs with Serpent Rings for a pure dodge build.' },
  { id: 'golden_chest', name: 'Golden Chestplate', tier: 'C', category: 'Armor', desc: 'Flame Chest.', mythicPerk: 'Titan: Dmg Reduction +5%.' },

  // --- RINGS ---
  { 
    id: 'dragon_ring', 
    name: 'Dragon Ring', 
    tier: 'SS', 
    category: 'Ring', 
    desc: 'Proj Resist.', 
    mythicPerk: 'Titan Tales: Proj Resist +13.8%', 
    deepLogic: 'Mandatory for the 100% Projectile Immunity build.', 
    bestPairs: ['Bulletproof Locket'], 
    trivia: 'Two Dragon Rings are mandatory for late-game survival.' 
  },
  { id: 'celestial_ring', name: 'Celestial Band', tier: 'SS', category: 'Ring', desc: 'Lightning Ring.', mythicPerk: 'Titan: Collision Resist +15%.' },
  { id: 'bull_ring', name: 'Bull Ring', tier: 'S', category: 'Ring', desc: 'Tank Ring.', mythicPerk: 'Titan: Dmg Resist +10%.' },
  { id: 'lion_ring', name: 'Lion Ring', tier: 'S', category: 'Ring', desc: 'Boss Ring.', mythicPerk: 'Titan: Crit Dmg +20%.' },
  { id: 'vilebat_ring', name: 'Vilebat Ring', tier: 'A', category: 'Ring', desc: 'Heals on kill.', deepLogic: 'Sustain build key.' },
  { id: 'wolf_ring', name: 'Wolf Ring', tier: 'B', category: 'Ring', desc: 'Melee Crit Chance +5%.', deepLogic: 'Niche crit builds.' },
  { id: 'serpent_ring', name: 'Serpent Ring', tier: 'B', category: 'Ring', desc: 'Dodge Chance +7%.', deepLogic: 'Legacy dodge meta.' },
  { id: 'falcon_ring', name: 'Falcon Ring', tier: 'C', category: 'Ring', desc: 'Attack Speed +5%.', deepLogic: 'Early game pacing.' },
  { id: 'bear_ring', name: 'Bear Ring', tier: 'C', category: 'Ring', desc: 'HP +5% and Ground Unit Damage.', deepLogic: 'Tanky early game.' },

  // --- LOCKETS ---
  { id: 'bulletproof', name: 'Bulletproof Locket', tier: 'SS', category: 'Locket', desc: 'Proj Tank.', mythicPerk: 'Titan: +15% Proj Resist (<25% HP).', trivia: 'The +15% Proj Resist is global and additive.' },
  { id: 'celestial_talisman', name: 'Celestial Talisman', tier: 'SS', category: 'Locket', desc: 'MP Gen.' },
  { id: 'exp_locket', name: 'Expedition Locket', tier: 'S', category: 'Locket', desc: 'Revive.', mythicPerk: 'Titan: Atk +25% after heal.' },
  { id: 'angel', name: 'Angel Locket', tier: 'A', category: 'Locket', desc: 'Revive Chance.' },

  // --- COMPANIONS (DRAGONS & PETS) ---
  { 
    id: 'magmar', 
    name: 'Magmar', 
    tier: 'SS', 
    category: 'Dragon', 
    desc: 'Mana Regen.', 
    uniqueEffect: 'Passive: Converts lost HP to Mana.',
    trivia: 'Magmar is currently the top-tier mana dragon for ability spam builds.' 
  },
  { 
    id: 'starrite', 
    name: 'Starrite', 
    tier: 'SS', 
    category: 'Dragon', 
    desc: 'Meteors.', 
    uniqueEffect: 'Active: Summons Meteors.' 
  },
  { 
    id: 'voideon', 
    name: 'Voideon', 
    tier: 'SS', 
    category: 'Dragon', 
    desc: 'Portals.', 
    uniqueEffect: 'Active: Summons Portals.' 
  },
  { id: 'necrogon', name: 'Necrogon', tier: 'S', category: 'Dragon', desc: 'Proj Resist.' },
  { id: 'jadeon', name: 'Jadeon', tier: 'B', category: 'Dragon', desc: 'Active skill grants Gold.', deepLogic: 'Economy Dragon.' },
  { id: 'ferron', name: 'Ferron', tier: 'B', category: 'Dragon', desc: 'Slash attack.', deepLogic: 'Physical damage Dragon.' },
  { id: 'glaciem', name: 'Glaciem', tier: 'C', category: 'Dragon', desc: 'Ice breath.', deepLogic: 'Freeze utility.' },
  { id: 'noxion', name: 'Noxion', tier: 'C', category: 'Dragon', desc: 'Poison spray.', deepLogic: 'DoT utility.' },

  { 
    id: 'frothy', 
    name: 'Frothy Capy', 
    tier: 'SS', 
    category: 'Pet', 
    desc: 'Bubble Shield grants 3s Immunity.', 
    deepLogic: 'Bubble = 100% Immunity to all damage.', 
    trivia: 'The bubble persists for 2 seconds after being touched.' 
  },
  { 
    id: 'unicorn', 
    name: 'Empyrean Unicorn', 
    tier: 'SS', 
    category: 'Pet', 
    desc: '20% chance to block projectiles.', 
    deepLogic: 'Passive RNG defense.' 
  },
  { id: 'laser_bat', name: 'Laser Bat', tier: 'A', category: 'Pet', desc: 'Wall Pierce.', trivia: 'Laser Bat is the only pet whose shots cannot be blocked by obstacles.' },

  // --- TOTEMS & OTHERS ---
  { id: 'totem_might', name: 'Totem of Might', tier: 'SS', category: 'Totem', desc: 'Hero Stats %.' },
  { id: 'totem_celerity', name: 'Totem of Celerity', tier: 'S', category: 'Totem', desc: 'Gear Stats %.' },
  { id: 'totem_vigor', name: 'Totem of Vigor', tier: 'A', category: 'Totem', desc: 'HP Stats %.' }
];

export const JEWEL_DATA: Jewel[] = [
  { id: 'ruby', name: 'Ruby (Weapon)', color: 'Red', statPerLevel: '+Atk', bonus16: 'Dmg to >75% HP', bonus28: 'Dmg +30% to >75% HP' },
  { id: 'kunzite', name: 'Kunzite (Weapon)', color: 'Red', statPerLevel: '+Atk', bonus16: 'Boss Dmg', bonus28: 'Mob Dmg +10%' },
  { id: 'lapis', name: 'Lapis (Armor)', color: 'Blue', statPerLevel: '+HP', bonus16: 'HP +5%', bonus28: 'Dmg Resist +5%' },
  { id: 'sapphire', name: 'Sapphire (Armor)', color: 'Blue', statPerLevel: '+HP', bonus16: 'Heart Drop', bonus28: 'Proj Resist +10%' }
];

export const RELIC_DATA: Relic[] = [
  { 
    id: 'holy_grail', 
    name: 'Holy Grail', 
    tier: 'Holy', 
    effect: 'HP +%', 
    setBonus: 'Radiant Lustre',
    iconType: 'Cup',
    lore: 'An ancient vessel rumored to grant immortality.',
    source: 'Mysterious Vendor / S-Rank Relic Chests',
    stars: ['1★: Max HP +3%', '2★: Healing Effect +10%', '3★: Max HP +5%']
  }
];

export const FARMING_ROUTES = [
  { resource: 'Gear / Runes', chapter: 'Hero 5 (Anomaly)', note: 'Code anomaly allows H5 to drop more items than endgame.' },
  { resource: 'Scrolls', chapter: 'Hero 28', note: 'Highest density.' },
  { resource: 'Jewels', chapter: 'Hero 35', note: 'Best drop rate Lv3.' }
];

export const ARCHERO_KNOWLEDGE_BASE = `
ARCHERO V6.0 GRANDMASTER KNOWLEDGE:
- DR Cap: Typically 75%, Titan gear can push 80-85%.
- Immunity Formula: 2x Dragon Rings + Atreus/Onir Passive + Bulletproof Locket = Projectile Immune.
- Collision Meta: Celestial Warplate is mandatory for end-game boss collision protection.
- Stutter Stepping: Cancel animation after shot to increase fire rate by 40%.
`;

export const DRAGON_DATA = [
  { id: 'magmar', name: 'Magmar', type: 'Attack' },
  { id: 'voideon', name: 'Voideon', type: 'Defense' },
  { id: 'starrite', name: 'Starrite', type: 'Balance' },
  { id: 'jadeon', name: 'Jadeon', type: 'Balance' },
  { id: 'ferron', name: 'Ferron', type: 'Attack' },
  { id: 'glaciem', name: 'Glaciem', type: 'Balance' },
  { id: 'noxion', name: 'Noxion', type: 'Defense' }
];

export const GLYPH_DATA = [
  { name: 'Devour', slot: 'Weapon', desc: 'Attack increases on kill.' },
  { name: 'Ironclad', slot: 'Armor', desc: 'Reduces rear damage.' }
];
