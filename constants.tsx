
import { Hero, BaseItem } from './types';

export const HERO_DATA: Hero[] = [
  // SSS TIER
  { 
    id: 'zeus', name: 'Zeus', tier: 'SSS', category: 'Hero', isGodTier: true, 
    desc: 'The Lightning Sovereign. Chain lightning jumps between enemies and ignores 15% Damage Resistance.', 
    globalBonus120: '+8% Max HP', 
    bestSkin: 'Thunder Overlord', 
    deepLogic: 'MANDATORY for Ch 80+. His lightning damage scales multiplicatively with the Celestial Hammer. 6-Star Evolution grants immunity frames.',
    bestPairs: ['Celestial Hammer', 'Celestial Warplate'],
    uniqueEffect: 'Thunder Sovereign: Critical hits proc "Godbolt" dealing 500% Lightning Damage.',
    bio: 'The supreme ruler of Olympus. His arrival in the Archero dimension shifted the meta forever, bringing unmatched lightning devastation.',
    rarityPerks: []
  },
  { 
    id: 'wukong', name: 'Wukong', tier: 'SSS', category: 'Hero', isGodTier: true, 
    desc: 'The Monkey King. Hybrid Melee/Ranged. Uses rotating staff (Cudgel) to zone enemies.', 
    globalBonus120: '+8% Attack',
    deepLogic: 'Clones inherit 100% of your Attack/Crit stats. Hidden Stat: Innate 20% Fire Resistance (Crucial for Inferno).',
    bestPairs: ['Expedition Fist', 'Dragon Ring'],
    uniqueEffect: 'Staff Mastery: Melee phase reflects 40% of incoming projectiles.',
    bio: 'Born from a stone, this trickster god defies the rules of combat with his infinite clones and mystical staff.',
    rarityPerks: []
  },
  { 
    id: 'melinda', name: 'Melinda', tier: 'SSS', category: 'Hero', isGodTier: true, 
    desc: 'The Barrage Queen. Best boss killer due to inverse HP scaling.', 
    globalBonus120: '+5% Dmg to Airborne',
    deepLogic: '"Barrage" counts as projectile damage and works with Ricochet. Barrage intensity doubles when HP < 20%.',
    uniqueEffect: 'Desperation Barrage: Attack Speed +30% when below 40% HP.',
    bio: 'A baker with a hidden talent for extreme violence. Her barrage of projectiles is the nightmare of every chapter boss.',
    rarityPerks: []
  },

  // SS TIER
  { 
    id: 'dragon_girl', name: 'Dragon Girl', tier: 'SS', category: 'Hero', 
    desc: 'Wyvern Form specialist. Breath reduces enemy healing.', 
    globalBonus120: '+5% Boss Damage',
    deepLogic: 'Requires 3-Stars to unlock "Dragon Crit". Without it, she is weaker than Helix.',
    rarityPerks: [],
    bio: 'A girl raised by dragons, she channels their primal fury into every strike.'
  },
  { 
    id: 'taiga', name: 'Taiga', tier: 'SS', category: 'Hero', 
    desc: 'Meteor Tank.', 
    globalBonus120: '+17% Crit Damage (Unique Global Buff)',
    deepLogic: "You MUST level him to 120 for the massive global Crit Damage boost, even if you don't play him.",
    rarityPerks: [],
    bio: 'A wanderer from the fire peaks, Taiga calls down burning stars to crush his foes.'
  },
  { 
    id: 'elaine', name: 'Elaine', tier: 'SS', category: 'Hero', 
    desc: 'Defensive Caster.', 
    globalBonus120: '+7% Max HP', 
    deepLogic: 'With "Cherry Blossom" skin + Expedition Plate, she generates infinite Red Hearts (Invincibility).',
    rarityPerks: [],
    bio: 'A magical scholar whose cherry blossoms offer both protection and destruction.'
  },

  // S TIER
  { 
    id: 'helix', name: 'Helix', tier: 'S', category: 'Hero', 
    desc: 'The F2P King. "Fury" grants +1.2% Dmg per 1% HP lost.', 
    globalBonus120: '+5% Max HP',
    deepLogic: 'Passive is multiplicative. Essential for F2P players pushing Hero Mode.',
    bestPairs: ['Demon Blade', 'Dragon Ring'],
    rarityPerks: [],
    bio: 'The half-beast warrior who thrives when the odds are against him.'
  },
  { 
    id: 'meowgik', name: 'Meowgik', tier: 'S', category: 'Hero', 
    desc: 'Spirit Summoner. Cats track through walls.', 
    globalBonus120: '+3% Dodge',
    deepLogic: 'Cat spawn rate tied to Attack Speed.',
    rarityPerks: [],
    bio: 'A cat mage whose feline spirits are as deadly as they are adorable.'
  },
  { 
    id: 'shingen', name: 'Shingen', tier: 'S', category: 'Hero', 
    desc: 'Melee Specialist.', 
    globalBonus120: '+6% Max HP',
    deepLogic: 'Highest Attack Speed scaling. Only viable with Sword/Fist.',
    rarityPerks: [],
    bio: 'A samurai master who values speed and precision above all else.'
  },

  // A/B TIER (Global Buffs)
  { id: 'onir', name: 'Onir', tier: 'A', category: 'Hero', desc: 'Holy Light warrior.', globalBonus120: '+20% Healing', deepLogic: 'Evolve to 7-Stars for Global +10% Projectile Resistance (Essential for Immunity).', rarityPerks: [] },
  { id: 'atreus', name: 'Atreus', tier: 'C', category: 'Hero', desc: 'The Starter hero.', globalBonus120: '+7% Projectile Resistance', deepLogic: 'Useless in combat, but mandatory for the "100% Resistance" cap.', rarityPerks: [] },
  { id: 'bobo', name: 'Bobo', tier: 'B', category: 'Hero', desc: 'Utility Farmer.', globalBonus120: '+5% Dmg to Units', deepLogic: 'Farmable in events.', rarityPerks: [] },
  { id: 'phoren', name: 'Phoren', tier: 'B', category: 'Hero', desc: 'Fire Warrior.', globalBonus120: '+2% Crit Chance', deepLogic: 'Mandatory L120 for F2P crit builds.', rarityPerks: [] },
  { id: 'urasil', name: 'Urasil', tier: 'B', category: 'Hero', desc: 'Poison Specialist.', globalBonus120: '+15% Crit Damage', deepLogic: 'Early game global buff essential.', rarityPerks: [] },
  { id: 'taranis', name: 'Taranis', tier: 'B', category: 'Hero', desc: 'Thunder Specialist.', globalBonus120: '+4% Attack', deepLogic: 'Standard attack buff at 120.', rarityPerks: [] },
  { id: 'sylvan', name: 'Sylvan', tier: 'A', category: 'Hero', desc: 'Elemental Master.', globalBonus120: '+5% Attack', deepLogic: 'Removes elemental arrows from RNG pool.', rarityPerks: [] },
  { id: 'shade', name: 'Shade', tier: 'A', category: 'Hero', desc: 'Shadow Assassin.', globalBonus120: '+5% Max HP', deepLogic: 'Solid HP global.', rarityPerks: [] },
  { id: 'ayana', name: 'Ayana', tier: 'A', category: 'Hero', desc: 'Portal Witch.', globalBonus120: '+4% Attack', deepLogic: 'Standard attack buff.', rarityPerks: [] },
  { id: 'rolla', name: 'Rolla', tier: 'A', category: 'Hero', desc: 'Ice Queen.', globalBonus120: '+5% Attack', deepLogic: 'High value global attack.', rarityPerks: [] },
  { id: 'ophelia', name: 'Ophelia', tier: 'A', category: 'Hero', desc: 'Soul Hunter.', globalBonus120: '+120 Attack', deepLogic: 'Flat attack bonus for base stat scaling.', rarityPerks: [] },
];

export const GEAR_DATA: BaseItem[] = [
  // WEAPONS
  { 
    id: 'celestial_hammer', name: 'Celestial Hammer', tier: 'SSS', category: 'Weapon', isGodTier: true, 
    desc: 'Lightning Melee/Ranged switch.', 
    mythicPerk: 'Final strike deals 300% lightning damage.',
    deepLogic: 'Requires stutter-stepping to maximize DPS. 1.9x Attack Multiplier.',
    rarityPerks: [
      { rarity: 'Mythic', effect: 'Final strike deals 300% lightning damage.' },
      { rarity: 'Titan Tales', effect: 'Lightning chain jump count +2.' }
    ]
  },
  { 
    id: 'expedition_fist', name: 'Expedition Fist', tier: 'SSS', category: 'Weapon', isGodTier: true, 
    desc: 'Hybrid Melee/Ranged.', 
    mythicPerk: 'Melee hits heal 15% of damage dealt.',
    deepLogic: 'Melee has immunity frames. Best survivability weapon.',
    rarityPerks: [
      { rarity: 'Mythic', effect: 'Melee hits heal 15% of damage dealt.' }
    ]
  },
  { 
    id: 'demon_blade', name: 'Demon Blade', tier: 'SS', category: 'Weapon', 
    desc: 'The classic melee choice (1.8x Dmg).', 
    deepLogic: 'Melee hits deal 1.8x damage. Avoid "Front Arrow".',
    rarityPerks: [
      { rarity: 'Legendary', effect: 'Crit chance +5% in melee stance.' }
    ]
  },
  { 
    id: 'antiquated_sword', name: 'Antiquated Sword', tier: 'SS', category: 'Weapon', 
    desc: 'Giant sword with Whirlwind active.', 
    deepLogic: 'Whirlwind grants Invincibility.',
    rarityPerks: []
  },
  { 
    id: 'stalker_staff', name: 'Stalker Staff', tier: 'S', category: 'Weapon', 
    desc: 'Homing projectiles.', 
    deepLogic: 'Stack "Diagonal Arrows". NEVER take "Front Arrow".',
    rarityPerks: []
  },
  { id: 'death_scythe', name: 'Death Scythe', tier: 'A', category: 'Weapon', desc: 'Headshot low HP mobs.', rarityPerks: [] },
  { id: 'brightspear', name: 'Brightspear', tier: 'A', category: 'Weapon', desc: 'Instant hitscan projectiles.', rarityPerks: [] },
  { id: 'tornado', name: 'Tornado', tier: 'A', category: 'Weapon', desc: 'Native Pierce/Ricochet.', rarityPerks: [] },

  // ARMOR
  { 
    id: 'celestial_warplate', name: 'Celestial Warplate', tier: 'SSS', category: 'Armor', isGodTier: true, 
    desc: 'Lightning Resist & Reflection.', 
    deepLogic: 'Mandatory for H90+ Collision Resist.',
    rarityPerks: []
  },
  { 
    id: 'expedition_plate', name: 'Expedition Plate', tier: 'SSS', category: 'Armor', isGodTier: true, 
    desc: 'Heart Generation.', 
    deepLogic: 'Heals % HP on hit. Tank build core.',
    rarityPerks: []
  },
  { 
    id: 'phantom_cloak', name: 'Phantom Cloak', tier: 'SS', category: 'Armor', 
    desc: 'Freezes enemies on hit.', 
    deepLogic: 'Freeze ignores boss immunity. Best non-S armor.',
    rarityPerks: []
  },
  { id: 'golden_chestplate', name: 'Golden Chestplate', tier: 'S', category: 'Armor', desc: 'Flat Damage Reduction.', rarityPerks: [] },
  { id: 'void_robe', name: 'Void Robe', tier: 'A', category: 'Armor', desc: 'Poison entire room on entry.', rarityPerks: [] },
  { id: 'bright_robe', name: 'Bright Robe', tier: 'A', category: 'Armor', desc: 'Front Damage Resist + XP boost.', rarityPerks: [] },

  // RINGS
  { 
    id: 'dragon_ring', name: 'Dragon Ring', tier: 'SS', category: 'Ring', 
    desc: '+12% Proj Resist.', 
    deepLogic: 'Immunity Formula: 2x Dragon Rings + Phantom Cloak + Atreus/Onir Global + Bulletproof Locket = 100% Resist.',
    rarityPerks: []
  },
  { id: 'celestial_band', name: 'Celestial Band', tier: 'SS', category: 'Ring', desc: 'Chain Lightning + Crit.', rarityPerks: [] },
  { id: 'bull_ring', name: 'Bull Ring', tier: 'S', category: 'Ring', desc: '+10% Dmg Resist. Best for farming gold.', rarityPerks: [] },
  { id: 'lion_ring', name: 'Lion Ring', tier: 'A', category: 'Ring', desc: 'Boss Damage + Crit Dmg.', rarityPerks: [] },
  { id: 'wolf_ring', name: 'Wolf Ring', tier: 'B', category: 'Ring', desc: 'Crit Chance boost.', rarityPerks: [] },

  // BRACELETS
  { id: 'shield_bracelet', name: 'Shield Bracelet', tier: 'SS', category: 'Bracelet', desc: 'Blocks projectiles on entry/crit.', rarityPerks: [] },
  { id: 'invincible_bracelet', name: 'Invincible Bracelet', tier: 'S', category: 'Bracelet', desc: '2.5s Invulnerability on room entry.', rarityPerks: [] },
  { id: 'quickshot_bracelet', name: 'Quickshot Bracelet', tier: 'A', category: 'Bracelet', desc: '+6% Attack boost.', rarityPerks: [] },
  { id: 'celestial_bracer', name: 'Celestial Bracer', tier: 'SS', category: 'Bracelet', desc: 'Shockwave on hit.', rarityPerks: [] },

  // LOCKETS
  { 
    id: 'bulletproof_locket', name: 'Bulletproof Locket', tier: 'SS', category: 'Locket', 
    desc: 'Passive Proj Resist.', 
    deepLogic: '+30% Resist when HP < 25%. Key to 100% immunity.',
    rarityPerks: []
  },
  { id: 'angel_locket', name: 'Angel Locket', tier: 'S', category: 'Locket', desc: 'Chance to revive after death.', rarityPerks: [] },
  { id: 'counterattack_charm', name: 'Counterattack Charm', tier: 'A', category: 'Locket', desc: 'Reflects damage back to attackers.', rarityPerks: [] },
  { id: 'bloodthirsty_locket', name: 'Bloodthirsty Locket', tier: 'B', category: 'Locket', desc: 'Heals small amount of HP on kill.', rarityPerks: [] },

  // BOOKS
  { id: 'enlightenment', name: 'Enlightenment', tier: 'SS', category: 'Book', desc: 'Grants extra skills during run. Best for Infinite Adventure.', rarityPerks: [] },
  { id: 'arcanum_of_time', name: 'Arcanum of Time', tier: 'SS', category: 'Book', desc: 'Active Time Stop. Best for Boss chapters.', rarityPerks: [] },
  { id: 'giants_contract', name: 'Giant\'s Contract', tier: 'S', category: 'Book', desc: 'Melee steroid + temporary shield.', rarityPerks: [] },

  // DRAGONS
  { 
    id: 'magmar', name: 'Magmar', tier: 'SS', category: 'Dragon', 
    desc: 'Fire Nuke dragon.', 
    deepLogic: 'Passive: Mana Regen on HP loss (Infinite Spells).',
    rarityPerks: []
  },
  { id: 'necrogon', name: 'Necrogon', tier: 'S', category: 'Dragon', desc: 'Undead Shield. Passive: Grants Projectile Resistance.', rarityPerks: [] },
  { id: 'shadex', name: 'Shadex', tier: 'S', category: 'Dragon', desc: 'Collision Immunity. Active: 100% Immunity to touch damage.', rarityPerks: [] },
  { id: 'geogon', name: 'Geogon', tier: 'A', category: 'Dragon', desc: 'Rock Shield for defense.', rarityPerks: [] },
  { id: 'stormra', name: 'Stormra', tier: 'A', category: 'Dragon', desc: 'Lightning Shield for area damage.', rarityPerks: [] },

  // PETS
  { id: 'frothy_capy', name: 'Frothy Capy', tier: 'SS', category: 'Pet', desc: 'Creates Bubble. Standing in bubble = 100% Dmg Immunity.', rarityPerks: [] },
  { id: 'empyrean_unicorn', name: 'Empyrean Unicorn', tier: 'SS', category: 'Pet', desc: 'Transfers stats to hero.', rarityPerks: [] },
  { id: 'furious_blitzbeak', name: 'Furious Blitzbeak', tier: 'S', category: 'Pet', desc: 'High DPS ground pet.', rarityPerks: [] },

  // SPIRITS
  { id: 'laser_bat', name: 'Laser Bat', tier: 'S', category: 'Spirit', desc: 'Shoots through walls. Only use for Wingman blocking.', rarityPerks: [] },
  { id: 'noisy_owl', name: 'Noisy Owl', tier: 'S', category: 'Spirit', desc: 'Knockback + Shoot through walls.', rarityPerks: [] },

  // EGGS
  { id: 'fire_demon_egg', name: 'Fire Demon Egg', tier: 'SS', category: 'Egg', desc: 'Grants Crit Damage + Proj Resist.', rarityPerks: [] },
  { id: 'scarlet_mage_egg', name: 'Scarlet Mage Egg', tier: 'S', category: 'Egg', desc: 'Grants Crit Damage.', rarityPerks: [] },
  { id: 'ice_mage_egg', name: 'Ice Mage Egg', tier: 'S', category: 'Egg', desc: 'Grants Crit Damage.', rarityPerks: [] },

  // TOTEMS
  { id: 'totem_of_might', name: 'Totem of Might', tier: 'SS', category: 'Totem', desc: '+% Hero Skin Stats. Scales best late game.', rarityPerks: [] },
  { id: 'totem_of_celerity', name: 'Totem of Celerity', tier: 'S', category: 'Totem', desc: '+% Equipment Base Stats.', rarityPerks: [] },
];

export const FARMING_ROUTES = [
  { resource: 'The H5 Anomaly', chapter: 'Hero 5', note: 'Code anomaly allows H5 to drop more items/runes per run than end-game chapters.' },
  { resource: 'Scrolls', chapter: 'Hero 28', note: 'Highest mob density for scrolls.' },
  { resource: 'Totems', chapter: 'N80+ / H75+', note: 'Unlock threshold for Totem drops.' },
  { resource: 'Gold/XP', chapter: 'Up-Close Dangers', note: 'Daily Event. Highest yields.' },
  { resource: 'Jewels', chapter: 'Hero 35', note: 'Best drop rate for Lvl 3 Jewels.' }
];

export const ARCHERO_KNOWLEDGE_BASE = `
ARCHERO CORE MECHANICS (2025 DATA):
- Damage Resistance (DR) Cap: Typically 75%, but certain Mythic gear can push it to 80-85%.
- Projectile Resistance: Stacked primarily through Dragon Rings, Celestial Armor, and Bulletproof Locket.
- Collision Resistance: Essential for wave chapters. Found on Golden Chestplate and Celestial Gear.
- Stutter-Stepping: Interrupting the attack animation by tapping or moving slightly. Increases effective DPS by up to 40%.
- Hero Assist: Unlocks at Level 50. Best synergies are Melinda/Wukong/Zeus.
- 100% Resistance Build: Possible with specific S-Tier gear and Dragon Rings.
`;
