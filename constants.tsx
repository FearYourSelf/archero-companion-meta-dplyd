import { Hero, BaseItem, Jewel, Relic } from './types';

// --- 1. HERO ROSTER (Comprehensive V6.3) ---
export const HERO_DATA: Hero[] = [
  { 
    id: 'zeus', name: 'Zeus', tier: 'SSS', category: 'Hero', isGodTier: true, globalBonus120: '+8% Max HP', 
    desc: 'The Lightning Sovereign.', deepLogic: "Attacks bypass standard projectile collision. 6-Star: Unlocks 'Static Field' (red lightning) that denies area to enemies. 3-Star: Lightning chains gain Critical Hit capability.", 
    evo4Star: 'Sustained attacks ramp up Atk Speed permanently for the room.', bestPairs: ['Celestial Hammer', 'Celestial Warplate'],
    bio: 'A celestial entity who descended to purge the darkness with righteous thunder.',
    bestSkin: 'Olympus Overlord', shardCost: '50 (Premium)', assistHeroes: ['Wukong', 'Stella'],
    trivia: 'Currently the highest DPS hero in the game for wave chapters.',
    uniqueEffect: 'Thunder Chain: Hits bounce to 3 nearby enemies.',
    historicalTiers: [
      { update: "v6.0 Launch", tier: "SSS" },
      { update: "v6.1 Patch", tier: "SSS" },
      { update: "v6.3 Current", tier: "SSS" }
    ],
    gearSets: [
      {
        name: "Celestial Stormlord",
        weapon: "Celestial Hammer",
        armor: "Celestial Warplate",
        rings: ["Celestial Band", "Dragon Ring"],
        bracelet: "Celestial Bracer",
        locket: "Celestial Talisman",
        book: "Arcanum of Time",
        synergy: "Triggers Full Celestial Resonance. Lightning chain jumps are amplified by 40% and mana regen is doubled."
      },
      {
        name: "Expedition Juggernaut",
        weapon: "Expedition Fist",
        armor: "Expedition Plate",
        rings: ["Dragon Ring", "Dragon Ring"],
        bracelet: "Shield Bracelet",
        locket: "Expedition Locket",
        book: "Arcanum of Time",
        synergy: "Maximum damage resistance and healing. Invincibility shields trigger constantly from heart drops."
      }
    ]
  },
  { 
    id: 'wukong', name: 'Wukong', tier: 'SSS', category: 'Hero', isGodTier: true, globalBonus120: '+8% Attack', 
    desc: 'Master of transformation.', deepLogic: "The Golden Cudgel neutralizes enemy projectiles. 4-Star: 'Phantom Hair' summons a decoy clone on lethal damage. 5-Star: '72 Forms' grants temporary immunity and spinning nova attacks.", 
    evo4Star: 'Phantom Hair: Spawns mirror decoy every 10s.', bestPairs: ['Expedition Fist', 'Phantom Cloak'],
    bio: 'The Monkey King, escaped from his mountain prison to seek new challenges.',
    bestSkin: 'Cosmic Traveler', shardCost: '50 (Premium)', assistHeroes: ['Zeus', 'Dragon Girl'],
    trivia: 'His clones count as "Spirits" for certain equipment buffs.',
    historicalTiers: [
      { update: "v5.8 Intro", tier: "SS" },
      { update: "v5.9 Buff", tier: "SSS" },
      { update: "v6.3 Current", tier: "SSS" }
    ],
    gearSets: [
      {
        name: "King of Clones",
        weapon: "Expedition Fist",
        armor: "Phantom Cloak",
        rings: ["Dragon Ring", "Bull Ring"],
        bracelet: "Shield Bracelet",
        locket: "Bulletproof Locket",
        book: "Giants Contract",
        synergy: "Close-range dominance. Phantom Cloak freezes enemies while the Fist combo destroys them in seconds."
      },
      {
        name: "Thunder Monkey",
        weapon: "Celestial Hammer",
        armor: "Celestial Warplate",
        rings: ["Celestial Band", "Lion Ring"],
        bracelet: "Celestial Bracer",
        locket: "Celestial Talisman",
        book: "Arcanum of Time",
        synergy: "Hybrid lightning/clone build. Excellent for clearing high-difficulty wave chapters."
      }
    ]
  },
  { 
    id: 'melinda', name: 'Melinda', tier: 'SSS', category: 'Hero', isGodTier: true, globalBonus120: '+5% Dmg to All Units', 
    desc: 'The Barrage Queen.', deepLogic: "Barrage scales exponentially with 'Diagonal Arrows' and 'Bouncy Wall'. 4-Star Trait: Acts as a Berserker modifier, increasing projectile count as HP decreases.", 
    evo4Star: 'Barrage projectiles auto-target enemies (Smart Homing).', bestPairs: ['Expedition Fist', 'Dragon Ring'],
    bio: 'A high-society sharpshooter who prefers the heat of battle to the ballroom.',
    bestSkin: 'Baker Melinda', shardCost: '50 (Premium)', assistHeroes: ['Iris', 'Elaine'],
    trivia: 'Her Barrage skill is considered a "Physical" attack and benefits from raw ATK buffs.',
    historicalTiers: [
      { update: "v4.2 Intro", tier: "S" },
      { update: "v5.0 Mastery", tier: "SS" },
      { update: "v6.3 Current", tier: "SSS" }
    ],
    gearSets: [
      {
        name: "Meta Barrage",
        weapon: "Expedition Fist",
        armor: "Phantom Cloak",
        rings: ["Dragon Ring", "Dragon Ring"],
        bracelet: "Quickshot Bracelet",
        locket: "Bulletproof Locket",
        book: "Arcanum of Time",
        synergy: "The standard high-end meta. Maximizes projectile immunity and burst damage from low HP states."
      },
      {
        name: "Speed Striker",
        weapon: "Antiquated Sword",
        armor: "Bright Robe",
        rings: ["Lion Ring", "Dragon Ring"],
        bracelet: "Invincible Bracelet",
        locket: "Agile Locket",
        book: "Giants Contract",
        synergy: "High movement and attack speed. Focuses on using the sword's whirlwind to trigger Melinda's passive safely."
      }
    ]
  },
  { id: 'dragon_girl', name: 'Dragon Girl', tier: 'SS', category: 'Hero', globalBonus120: '+5% Dmg to Ranged', desc: 'Dragon companion warrior.', deepLogic: "Summons 'Riri' (Homing Ricochet). 4-Star: 'Dragon's Ire' grants the companion Critical Hits and a stacking Blaze effect.", evo4Star: 'Dragon Breath applies Burn.', bestPairs: ['Demon Blade'], bio: 'Raised by dragons in the forgotten peaks.', shardCost: '40 Shards', historicalTiers: [{update: "Launch", tier: "SS"}, {update: "v6.3", tier: "SS"}] },
  { id: 'taiga', name: 'Taiga', tier: 'SS', category: 'Hero', globalBonus120: '+17% Crit Damage', desc: 'Meteor-calling monk.', deepLogic: "Mandatory for Endgame: Grants +17% Global Crit Damage at Level 120. The 'Meteor' ability deals splash damage that ignores wall collision.", bestPairs: ['Brightspear'], bio: 'A monk from the Far East who controls the falling stars.', shardCost: '40 Shards', historicalTiers: [{update: "Launch", tier: "S"}, {update: "Buff", tier: "SS"}] },
  { id: 'stella', name: 'Stella', tier: 'SS', category: 'Hero', globalBonus120: '+5% Dmg to Melee', desc: 'Star-weaver mage.', deepLogic: 'Star-power builds up to trigger a screen-wide supernova.', bestPairs: ['Celestial Hammer'], bio: 'She weaves the constellations into deadly weapons.', shardCost: '40 Shards', historicalTiers: [{update: "v5.5", tier: "S"}, {update: "v6.3", tier: "SS"}] },
  { id: 'elaine', name: 'Elaine', tier: 'SS', category: 'Hero', globalBonus120: '+7% Max HP', desc: 'Cherry blossom shields.', deepLogic: "Defensive Meta. When equipped with Expedition Plate, generating hearts triggers the invincibility shield. 3-Star: Shield reflects damage back to attackers.", bestPairs: ['Expedition Plate'], bio: 'The guardian of the sacred sakura tree.', shardCost: '40 Shards', historicalTiers: [{update: "Launch", tier: "A"}, {update: "Skin release", tier: "SS"}] },
  { id: 'iris', name: 'Iris', tier: 'S', category: 'Hero', globalBonus120: '+5% Attack Speed', desc: 'The wind-born archer.', deepLogic: 'Increases dodge after moving 3 meters.', bestPairs: ['Vest of Dexterity'], shardCost: '30 Shards', historicalTiers: [{update: "Launch", tier: "A"}, {update: "v6.3", tier: "S"}] },
  { id: 'blazo', name: 'Blazo', tier: 'S', category: 'Hero', globalBonus120: '+6% Crit Rate', desc: 'Demonic gunslinger.', deepLogic: 'Overheat mechanic triples damage but slows movement.', bestPairs: ['Demon Blade'], shardCost: '30 Shards', historicalTiers: [{update: "v4.0", tier: "SSS"}, {update: "Nerf", tier: "SS"}, {update: "Current", tier: "S"}] },
  { id: 'shingen', name: 'Shingen', tier: 'S', category: 'Hero', globalBonus120: '+10% Crit Damage', desc: 'The blade master.', deepLogic: 'Attacks faster as he hits the same enemy.', bestPairs: ['Demon Blade'], shardCost: '30 Shards', historicalTiers: [{update: "Launch", tier: "SS"}, {update: "v6.3", tier: "S"}] },
  { id: 'lina', name: 'Lina', tier: 'S', category: 'Hero', globalBonus120: '+5% Dmg to Grounded', desc: 'Summons dancers.', deepLogic: 'Dancers apply a stacking slow to all enemies.', bestPairs: ['Brightspear'], shardCost: '30 Shards', historicalTiers: [{update: "v3.0", tier: "SSS"}, {update: "v6.3", tier: "S"}] },
  { id: 'gugu', name: 'Gugu', tier: 'S', category: 'Hero', globalBonus120: '+20% Healing Effect', desc: 'Owl guardian.', deepLogic: 'Birds provide 30% damage reduction shields.', bestPairs: ['Bull Ring'], shardCost: 'Free (Guild Store)', historicalTiers: [{update: "Nerf", tier: "A"}, {update: "Relic buff", tier: "S"}] },
  { id: 'shade', name: 'Shade', tier: 'S', category: 'Hero', globalBonus120: '+5% Attack', desc: 'The shadow assassin.', deepLogic: 'Shadow form grants +75% Attack Speed and +25% Dmg.', bestPairs: ['Demon Blade'], shardCost: '30 Shards', historicalTiers: [{update: "v2.0", tier: "SSS"}, {update: "v6.3", tier: "S"}] },
  { id: 'sylvan', name: 'Sylvan', tier: 'S', category: 'Hero', globalBonus120: '+5% Max HP', desc: 'Elf prince.', deepLogic: 'Removes elemental skills from RNG pool, inherent elemental master.', bestPairs: ['Brightspear'], shardCost: '30 Shards', historicalTiers: [{update: "v1.8", tier: "SSS"}, {update: "v6.3", tier: "S"}] },
  { id: 'helix', name: 'Helix', tier: 'S', category: 'Hero', globalBonus120: '+6% Max HP', desc: 'The OG Fury king.', deepLogic: 'Damage increases as HP drops. Highest stability.', bestPairs: ['Demon Blade'], bio: 'The son of a legendary warrior who draws power from his wounds.', shardCost: '1500 Gems',
    historicalTiers: [
      { update: "Classic", tier: "SSS" },
      { update: "Mid-Game", tier: "SS" },
      { update: "v6.3 Meta", tier: "S" }
    ],
    gearSets: [
      {
        name: "Classic Fury",
        weapon: "Demon Blade",
        armor: "Phantom Cloak",
        rings: ["Bull Ring", "Bull Ring"],
        bracelet: "Invincible Bracelet",
        locket: "Angel Locket",
        book: "Giants Contract",
        synergy: "Survival-focused. Allows Helix to stay at low HP safely while the Giant's Contract provides melee shields."
      }
    ]
  },
  { id: 'meowgik', name: 'Meowgik', tier: 'A', category: 'Hero', globalBonus120: '+5% Attack', desc: 'The kitten mage.', deepLogic: 'Spawns homing kittens that ignore walls.', bestPairs: ['Brightspear'], shardCost: '1800 Gems', historicalTiers: [{update: "Intro", tier: "SS"}, {update: "v6.3", tier: "A"}] },
  { id: 'ayana', name: 'Ayana', tier: 'A', category: 'Hero', globalBonus120: '+5% Dodge', desc: 'Enchanted witch.', deepLogic: 'Portals provide temporary i-frames during travel.', bestPairs: ['Phantom Cloak'], shardCost: '2500 Gems' },
  { id: 'ophelia', name: 'Ophelia', tier: 'A', category: 'Hero', globalBonus120: '+5% Dmg to Elites', desc: 'Spirit hunter.', deepLogic: 'Soul shards provide varying elemental buffs.', bestPairs: ['Demon Blade'], shardCost: 'Free (Events)' },
  { id: 'onir', name: 'Onir', tier: 'A', category: 'Hero', globalBonus120: '+20% Healing Effect', desc: 'Holy knight.', deepLogic: 'Global 10% Projectile Resistance at 7-stars.', uniqueEffect: 'Global Proj Resist', shardCost: '9.99 USD' },
  { id: 'rolla', name: 'Rolla', tier: 'B', category: 'Hero', globalBonus120: '+5% Attack', desc: 'Ice goddess.', deepLogic: 'Freezes enemies for longer than standard frozen effect.', bestPairs: ['Death Scythe'] },
  { id: 'taranis', name: 'Taranis', tier: 'B', category: 'Hero', globalBonus120: '+10% Crit Damage', desc: 'Thunder master.', deepLogic: 'Lightning arcs deal 35% splash damage.', bestPairs: ['Tornado'] },
  { id: 'phoren', name: 'Phoren', tier: 'C', category: 'Hero', globalBonus120: '+5% Crit Rate', desc: 'Fire master.', deepLogic: 'Burn damage lasts twice as long.', bestPairs: ['Saw Blade'] },
  { id: 'atreus', name: 'Atreus', tier: 'C', category: 'Hero', globalBonus120: '+7% Projectile Resistance', desc: 'The rookie.', deepLogic: 'Mandatory L120 for Immunity Build.', uniqueEffect: 'Immunity Key', bio: 'The hero who started it all.' },
  { id: 'uruana', name: 'Urasil', tier: 'F', category: 'Hero', globalBonus120: '+5% Max HP', desc: 'Poison master.', deepLogic: 'Poison damage scales poorly in late game.', bestPairs: ['Tornado'] }
];

export const GEAR_DATA: BaseItem[] = [
  // --- WEAPONS ---
  { id: 'exp_fist', name: 'Expedition Fist', tier: 'SSS', category: 'Weapon', desc: 'Hybrid Fist.', mythicPerk: 'Titan: Weapon Dmg +15% (Final Multiplier).', deepLogic: 'Melee hits heal 15% Dmg. Maintains Combo stacks while moving.', bestPairs: ['Expedition Plate', 'Dragon Ring'] },
  { id: 'celestial_hammer', name: 'Celestial Hammer', tier: 'SSS', category: 'Weapon', desc: 'Lightning Hammer.', mythicPerk: 'Titan: Perpetual Charge.', deepLogic: 'Lightning form pierces walls. Pairs with Warplate for Chain Lightning.', bestPairs: ['Celestial Warplate', 'Celestial Band'] },
  { id: 'ant_sword', name: 'Antiquated Sword', tier: 'SS', category: 'Weapon', desc: 'Greatsword.', mythicPerk: 'Titan: Whirlwind Reflects 30% Dmg.', deepLogic: 'Broadsword has hidden +40% Dmg vs Bosses.', bestPairs: ['Bright Robe', 'Giants Contract'] },
  { id: 'demon_blade', name: 'Demon Blade', tier: 'SS', category: 'Weapon', desc: 'Katana.', mythicPerk: 'Titan: Shadows inherit 100% Element.', deepLogic: 'Melee hits deal 1.8x damage. Do NOT take Front Arrow.', bestPairs: ['Phantom Cloak', 'Giants Contract'] },
  { id: 'stalker_staff', name: 'Stalker Staff', tier: 'S', category: 'Weapon', desc: 'Staff.', mythicPerk: 'Titan: +15% Flight Speed.', deepLogic: 'Best for Bosses. Stack Diagonal Arrows.', bestPairs: ['Arcane Archer'] },
  { id: 'brightspear', name: 'Brightspear', tier: 'A', category: 'Weapon', desc: 'Laser.', mythicPerk: 'Titan: Beam splits to 2 targets.', bestPairs: ['Quickshot Bracelet'] },
  { id: 'death_scythe', name: 'Death Scythe', tier: 'A', category: 'Weapon', desc: 'Scythe.', mythicPerk: 'Titan: Execute threshold <35% HP.', bestPairs: ['Phantom Cloak'] },
  { id: 'tornado', name: 'Tornado', tier: 'A', category: 'Weapon', desc: 'Boomerang. Built-in Pierce and Ricochet.' },
  { id: 'gale_force', name: 'Gale Force', tier: 'B', category: 'Weapon', desc: 'Crossbow. Charged Shot.' },
  { id: 'saw_blade', name: 'Saw Blade', tier: 'C', category: 'Weapon', desc: 'Dagger. Fastest Attack Speed.' },
  { id: 'brave_bow', name: 'Brave Bow', tier: 'C', category: 'Weapon', desc: 'Bow.', mythicPerk: 'Titan: High Crit Synergy.' },
  { id: 'mini_atreus', name: 'Mini Atreus', tier: 'D', category: 'Weapon', desc: 'Meme Weapon. Just for fun.' },

  // --- ARMOR ---
  { id: 'c_warplate', name: 'Celestial Warplate', tier: 'SSS', category: 'Armor', desc: 'Lightning Plate.', mythicPerk: 'Titan: Collision Resist +20%.', deepLogic: 'Converts dmg to Heavenly Energy. Best for wave chapters.', bestPairs: ['Celestial Hammer', 'Celestial Talisman'] },
  { id: 'exp_plate', name: 'Expedition Plate', tier: 'SSS', category: 'Armor', desc: 'Heart Plate.', mythicPerk: 'Titan: Heart Drop +20%.', deepLogic: 'Picking up hearts grants Invincibility Shield.', bestPairs: ['Expedition Fist', 'Expedition Locket'] },
  { id: 'p_cloak', name: 'Phantom Cloak', tier: 'SS', category: 'Armor', desc: 'Ice Cloak.', mythicPerk: 'Titan: Freeze +2.5s. Frozen enemies take +30% Dmg.', deepLogic: 'Meta for Boss chapters.', bestPairs: ['Demon Blade', 'Bulletproof Locket'] },
  { id: 'bright_robe', name: 'Bright Robe', tier: 'A', category: 'Armor', desc: 'Front Dmg Resistance + XP Boost.', bestPairs: ['Antiquated Sword'] },
  { id: 'shadow_robe', name: 'Shadow Robe', tier: 'A', category: 'Armor', desc: 'Deals Dark damage to nearby enemies.' },
  { id: 'void_robe', name: 'Void Robe', tier: 'B', category: 'Armor', desc: 'Poisons all enemies in room.' },
  { id: 'vest_dex', name: 'Vest of Dexterity', tier: 'B', category: 'Armor', desc: 'Dodge Vest.', deepLogic: '+7% Dodge.', bestPairs: ['Agile Locket'] },
  { id: 'golden_chest', name: 'Golden Chestplate', tier: 'C', category: 'Armor', desc: 'Flame Chest.', mythicPerk: 'Titan: 5% Dmg Reduction.' },

  // --- RINGS ---
  { id: 'dragon_ring', name: 'Dragon Ring', tier: 'SS', category: 'Ring', desc: 'Proj Resist.', mythicPerk: 'Titan: Proj Resist +13.8%.', deepLogic: 'Essential for Immunity Build. Stacks additively.', bestPairs: ['Bulletproof Locket'] },
  { id: 'celestial_ring', name: 'Celestial Band', tier: 'SS', category: 'Ring', desc: 'Lightning Ring.', mythicPerk: 'Titan: Collision Resist +15%.', deepLogic: 'Chain Lightning scales with S-Locket.', bestPairs: ['Celestial Hammer'] },
  { id: 'bull_ring', name: 'Bull Ring', tier: 'S', category: 'Ring', desc: 'Tank Ring.', mythicPerk: 'Titan: Dmg Resist +10%.', deepLogic: 'Best for farming Gold. DR applies after Proj Resist.' },
  { id: 'lion_ring', name: 'Lion Ring', tier: 'S', category: 'Ring', desc: 'Boss Ring.', mythicPerk: 'Titan: Crit Dmg +20%.', deepLogic: 'Pure DPS. Mandatory for Boss Chapters.' },
  { id: 'vilebat_ring', name: 'Vilebat Ring', tier: 'A', category: 'Ring', desc: 'Heal on Kill.' },
  { id: 'wolf_ring', name: 'Wolf Ring', tier: 'B', category: 'Ring', desc: 'Melee Crit Chance.' },
  { id: 'serpent_ring', name: 'Serpent Ring', tier: 'B', category: 'Ring', desc: 'Dodge Chance +7%.' },
  { id: 'falcon_ring', name: 'Falcon Ring', tier: 'C', category: 'Ring', desc: 'Attack Speed +5%.' },
  { id: 'bear_ring', name: 'Bear Ring', tier: 'C', category: 'Ring', desc: 'HP + Ground Dmg.' },

  // --- BRACELETS ---
  { id: 'celestial_bracer', name: 'Celestial Bracer', tier: 'SS', category: 'Bracelet', desc: 'Lightning.', mythicPerk: 'Titan: Lightning Dmg +20%.' },
  { id: 'shield_bracer', name: 'Shield Bracelet', tier: 'SS', category: 'Bracelet', desc: 'Shield.', mythicPerk: 'Titan: Atk +12%.' },
  { id: 'invincible', name: 'Invincible Bracelet', tier: 'S', category: 'Bracelet', desc: 'Invincibility.', deepLogic: '2.5s God Mode on room entry.' },
  { id: 'quickshot', name: 'Quickshot Bracelet', tier: 'A', category: 'Bracelet', desc: 'Multishot.' },
  { id: 'thunder_bracer', name: 'Thunder Bracelet', tier: 'B', category: 'Bracelet', desc: 'Zap.' },
  { id: 'frozen_bracer', name: 'Frozen Bracelet', tier: 'B', category: 'Bracelet', desc: 'Freeze.' },
  { id: 'blazing_bracer', name: 'Blazing Bracelet', tier: 'C', category: 'Bracelet', desc: 'Fire.' },
  { id: 'split_bracer', name: 'Split Bracelet', tier: 'C', category: 'Bracelet', desc: 'Clones.' },

  // --- LOCKETS ---
  { id: 'bulletproof', name: 'Bulletproof Locket', tier: 'SS', category: 'Locket', desc: 'Proj Tank.', mythicPerk: 'Titan: +15% Proj Resist (<25% HP).', deepLogic: 'Key to 100% Immunity.', bestPairs: ['Dragon Ring'] },
  { id: 'celestial_talisman', name: 'Celestial Talisman', tier: 'SS', category: 'Locket', desc: 'MP Gen.', deepLogic: 'Best for Mana-hungry heroes.', bestPairs: ['Celestial Hammer'] },
  { id: 'exp_locket', name: 'Expedition Locket', tier: 'S', category: 'Locket', desc: 'Revive.', mythicPerk: 'Titan: Atk +25% after heal.', bestPairs: ['Expedition Plate'] },
  { id: 'angel', name: 'Angel Locket', tier: 'A', category: 'Locket', desc: 'Revive Chance.' },
  { id: 'bloodthirsty', name: 'Bloodthirsty Locket', tier: 'A', category: 'Locket', desc: 'Lifesteal.' },
  { id: 'agile', name: 'Agile Locket', tier: 'B', category: 'Locket', desc: 'Dodge.', deepLogic: 'Dodge at low HP.', bestPairs: ['Vest of Dexterity'] },
  { id: 'counterattack', name: 'Counterattack Charm', tier: 'C', category: 'Locket', desc: 'Reflect.' },
  { id: 'iron', name: 'Iron Locket', tier: 'C', category: 'Locket', desc: 'Collision.' },
  { id: 'piercer', name: 'Piercer Locket', tier: 'C', category: 'Locket', desc: 'Wall Pass.' },

  // --- BOOKS ---
  { id: 'enlightenment', name: 'Enlightenment', tier: 'SS', category: 'Book', desc: 'Skills.', mythicPerk: 'Titan: Dmg Resist +5%.', deepLogic: 'Best for Infinite Adventure. Breaks RNG limit.' },
  { id: 'arcanum', name: 'Arcanum of Time', tier: 'SS', category: 'Book', desc: 'Time Stop.', mythicPerk: 'Titan: Duration +1s.', deepLogic: 'Freezes projectiles. Ultimate defense.' },
  { id: 'giant', name: 'Giants Contract', tier: 'S', category: 'Book', desc: 'Melee.', deepLogic: 'Synergy King with Demon Blade/Fist.', bestPairs: ['Demon Blade', 'Expedition Fist'] },
  { id: 'art_combat', name: 'Art of Combat', tier: 'A', category: 'Book', desc: 'Knockback.' },
  { id: 'arcane_archer', name: 'Arcane Archer', tier: 'A', category: 'Book', desc: 'Arrows.', mythicPerk: 'Titan: Duration +1s.', bestPairs: ['Stalker Staff'] },
  { id: 'ice_realm', name: 'Ice Realm', tier: 'B', category: 'Book', desc: 'Freeze.' },
  { id: 'spectre', name: 'Spectre Book', tier: 'C', category: 'Book', desc: 'Summons.' },
  { id: 'mystery_time', name: 'Time of Mysteries', tier: 'C', category: 'Book', desc: 'Ultimate CDR & Healing.' },

  // --- SPIRITS ---
  { id: 'laser_bat', name: 'Laser Bat', tier: 'A', category: 'Spirit', desc: 'Wall Pierce.', deepLogic: 'Shoots through walls. Best for applying Element debuffs safely.' },
  { id: 'noisy_owl', name: 'Noisy Owl', tier: 'A', category: 'Spirit', desc: 'Knockback.', deepLogic: 'Good for knockback, but can mess up melee grouping.' },
  { id: 'flaming_ghost', name: 'Flaming Ghost', tier: 'B', category: 'Spirit', desc: 'Pierce.', deepLogic: 'Decent on-hit effects.' },
  { id: 'scythe_mage', name: 'Scythe Mage', tier: 'C', category: 'Spirit', desc: 'Bounce.' },
  { id: 'elf', name: 'Elf', tier: 'C', category: 'Spirit', desc: 'Fast Atk.' },
  { id: 'living_bomb', name: 'Living Bomb', tier: 'D', category: 'Spirit', desc: 'Useless.' },
  { id: 'bone_warrior', name: 'Bone Warrior', tier: 'A', category: 'Spirit', desc: 'Melee Tank & Aggro', ability: 'Melee Shield & Aggro' },

  // --- PETS (New Ground Units) ---
  { id: 'frothy', name: 'Frothy Capy', tier: 'SS', category: 'Pet', desc: 'Immunity Bubble.', deepLogic: 'Bubble = 100% Immunity.' },
  { id: 'unicorn', name: 'Empyrean Unicorn', tier: 'SS', category: 'Pet', desc: 'Block %.' },
  { id: 'blitzbeak', name: 'Furious Blitzbeak', tier: 'S', category: 'Pet', desc: 'Lightning.' },

  // --- TOTEMS ---
  { id: 'totem_might', name: 'Oathblade', tier: 'SS', category: 'Totem', desc: 'Hero Stats %.' },
  { id: 'totem_celerity', name: 'Void Crystal', tier: 'S', category: 'Totem', desc: 'Gear Stats %.' },
  { id: 'totem_vigor', name: 'Totem of Vigor', tier: 'A', category: 'Totem', desc: 'HP.' },

  // --- EGGS ---
  { id: 'fire_demon', name: 'Fire Demon', tier: 'SS', category: 'Pet Farm Eggs', desc: 'Crit Dmg +5%.' },
  { id: 'ice_mage', name: 'Ice Mage', tier: 'S', category: 'Pet Farm Eggs', desc: 'Airborne Dmg.' },
  { id: 'scarlet_mage', name: 'Scarlet Mage', tier: 'S', category: 'Pet Farm Eggs', desc: 'Crit Chance.' },

  // --- GLYPHS ---
  { id: 'glyph_devour', name: 'Glyph: Devour', tier: 'SS', category: 'Glyph', desc: 'Atk on Kill.' },
  { id: 'glyph_ironclad', name: 'Glyph: Ironclad', tier: 'S', category: 'Glyph', desc: 'Rear Resist.' },
  { id: 'glyph_potential', name: 'Glyph: Potential', tier: 'A', category: 'Glyph', desc: 'Level Speed.' }
];

export const JEWEL_DATA: Jewel[] = [
  { id: 'ruby', name: 'Ruby', color: 'Red', statType: 'Attack', baseStat: 20, statPerLevel: 35, slots: ['Weapon', 'Ring'], bonus16: 'Damage +10% to enemies with >75% HP', bonus28: 'Damage +30% to enemies with >75% HP', bonus40: 'Final Attack +5% (Global)', lore: 'Burning stone of raw power.' },
  { id: 'kunzite', name: 'Kunzite', color: 'Red', statType: 'Attack', baseStat: 15, statPerLevel: 30, slots: ['Weapon', 'Ring'], bonus16: 'Boss Damage +5%', bonus28: 'Elite/Boss Damage +10%', bonus40: 'Boss Damage +15%', lore: 'Destroyer of massive foes.' },
  { id: 'lapis', name: 'Lapis', color: 'Blue', statType: 'Max HP', baseStat: 80, statPerLevel: 140, slots: ['Armor', 'Locket'], bonus16: 'HP +5% during battle', bonus28: 'Damage Resistance +5% (Global)', bonus40: 'Max HP +15%', lore: 'Deep reservoir of vitality.' },
  { id: 'topaz', name: 'Topaz', color: 'Green', statType: 'Crit Chance', baseStat: 0.5, statPerLevel: 0.8, slots: ['Ring', 'Bracelet'], bonus16: 'Attack Speed +3%', bonus28: 'Critical Chance +5%', bonus40: 'Critical Damage +15%', lore: 'Sharp focus mineral.' }
];

export const RELIC_DATA: Relic[] = [
  { id: 'demon_king_eye', name: 'Demon King Eye', tier: 'Holy', effect: 'Crit Dmg +15%', setBonus: 'Eternal Gaze', iconType: 'Eye', lore: 'Petrified gaze of the original overlord.', source: 'Demon King Event', stars: ['1★: Crit Dmg +10%', '2★: Dark Power +5%', '3★: Final Attack +3%'] },
  { id: 'holy_grail', name: 'Holy Grail', tier: 'Holy', effect: 'Max HP +10%', setBonus: 'Divine Vitality', iconType: 'Cup', lore: 'Rumored vessel of immortality.', source: 'Mysterious Vendor', stars: ['1★: Max HP +3%', '2★: Healing +15%', '3★: DR +2%'] },
  { id: 'phoenix_feather', name: 'Phoenix Feather', tier: 'Holy', effect: 'Attack +10%', setBonus: 'Rebirth Flame', iconType: 'Arrow', lore: 'A glowing feather that never stops burning.', source: 'Elite Chests', stars: ['1★: Fire Damage +15%', '2★: Atk Speed +5%', '3★: 1x Instant Revive per game'] },
  { id: 'jade_dragon_statue', name: 'Jade Dragon Statue', tier: 'Holy', effect: 'All Elemental Dmg +12%', setBonus: 'Eastern Spirit', iconType: 'Gem', lore: 'The soul of a dragon trapped in emerald.', source: 'Lunar New Year Event', stars: ['1★: Freeze Duration +20%', '2★: Lightning Damage +10%', '3★: Elemental Burst +5%'] },
  { id: 'thunder_hammer_relic', name: 'Thunder Hammer', tier: 'Holy', effect: 'Lightning Dmg +20%', setBonus: 'Storm Lord', iconType: 'Sword', lore: 'Miniature replica of a god\'s weapon.', source: 'Tower Defense Rewards', stars: ['1★: Chain Lightning +1 Jump', '2★: Atk +500', '3★: Thunder Strike Crit +15%'] },
  { id: 'dragon_ball_relic', name: 'Dragon Ball', tier: 'Holy', effect: '+10% Skill Damage', setBonus: 'Ancient Power', iconType: 'Gem', lore: 'A sphere containing the essence of ancient beasts.', source: 'World Boss Drops', stars: ['1★: Skill Damage +5%', '2★: Elemental Dmg +10%', '3★: Skill Crit Chance +8%'] },
  { id: 'golden_apple', name: 'Golden Apple', tier: 'Radiant', effect: 'Max HP +1200', setBonus: 'Fruity Fortune', iconType: 'Gem', lore: 'Looks delicious, but it\'s actually hard as rock.', source: 'Normal Chapters', stars: ['1★: Max HP +500', '2★: Dropped HP Hearts +20%', '3★: Healing +5%'] },
  { id: 'mirror_of_truth', name: 'Mirror of Truth', tier: 'Radiant', effect: 'Crit Chance +3%', setBonus: 'Clear Vision', iconType: 'Eye', lore: 'Shows the enemy exactly where they are weak.', source: 'Hero Chapters', stars: ['1★: Crit Dmg +5%', '2★: Accuracy +10%', '3★: Dodge +2%'] },
  { id: 'ancient_map', name: 'Ancient Map', tier: 'Radiant', effect: 'Movement Speed +5%', setBonus: 'Pathfinder', iconType: 'Scroll', lore: 'A map of lands that no longer exist.', source: 'Expedition Mode', stars: ['1★: Trap Damage -20%', '2★: Gold +10%', '3★: Collision Resist +5%'] },
  { id: 'hero_cape_relic', name: 'Hero\'s Cape', tier: 'Radiant', effect: 'Damage to Elites +8%', setBonus: 'Valiant Set', iconType: 'Shield', lore: 'Tattered but radiating courage.', source: 'Daily Challenges', stars: ['1★: Max HP +3%', '2★: Attack +2%', '3★: Dmg to Bosses +5%'] },
  { id: 'broken_sword_relic', name: 'Broken Sword', tier: 'Faint', effect: 'Attack +150', setBonus: 'Warrior Remnant', iconType: 'Sword', lore: 'A simple piece of steel with history.', source: 'Common Drops', stars: ['1★: Attack +50', '2★: Melee Dmg +3%', '3★: Attack Speed +2%'] },
  { id: 'rusty_key_relic', name: 'Rusty Key', tier: 'Faint', effect: 'Gold Drop +5%', setBonus: 'Scavenger', iconType: 'Gem', lore: 'Probably doesn\'t open anything important.', source: 'Common Drops', stars: ['1★: Gold +2%', '2★: Dropped Gear Rate +1%', '3★: XP +5%'] },
  { id: 'dusty_tome_relic', name: 'Dusty Tome', tier: 'Faint', effect: 'Skill Damage +5%', setBonus: 'Scholar', iconType: 'Book', lore: 'The writing is almost faded away.', source: 'Common Drops', stars: ['1★: Mana Regen +5%', '2★: Book Energy +10%', '3★: Spellbook Effect +5%'] }
];

export const SET_BONUS_DESCRIPTIONS: Record<string, string> = {
  'Eternal Gaze': 'Increases Dark Damage by 25% and reduces enemy dodge rate by 15%.',
  'Divine Vitality': 'Increases health recovery from all sources by 30% and grants a small shield when health drops below 30%.',
  'Rebirth Flame': 'Grants a 20% chance to ignite enemies on hit. Burn damage scales with 10% of Attack.',
  'Eastern Spirit': 'Boosts Elemental Burst frequency by 40% and adds +10% Resistance to all elements.',
  'Storm Lord': 'Lightning chains jump 2 additional times and have a 15% chance to stun targets.',
  'Ancient Power': 'Increases Ultimate Skill duration by 5s and Skill Damage by additional 15%.',
  'Fruity Fortune': 'Increases drop rate of HP hearts by 50% and small gems by 20%.',
  'Clear Vision': 'Increases Critical Damage by 40% when hitting enemies at full health.',
  'Pathfinder': 'Reduces trap damage by 50% and increases movement speed by 10% in unexplored rooms.',
  'Valiant Set': 'Increases Attack by 5% for every elite enemy present in the room.',
  'Warrior Remnant': 'Provides +10% Damage Resistance for 5s after taking damage (Cooldown: 10s).',
  'Scavenger': 'Increases Gold and XP gain from clearing rooms by 15%.',
  'Scholar': 'Reduces Spellbook energy requirement by 20% and increases Mana Regeneration by 10%.'
};

export interface FarmingRoute {
  id: string;
  resource: 'Gear' | 'Gold' | 'Shards' | 'Jewels' | 'Runes' | 'Exp';
  chapter: string;
  difficulty: 'Hero' | 'Normal';
  efficiency: 'SSS' | 'SS' | 'S' | 'A';
  avgTime: string;
  strategy: string;
  proTip: string;
  bestHero: string;
  lootRate: string;
}

export const FARMING_ROUTES: FarmingRoute[] = [
  { 
    id: 'gear-h7', 
    resource: 'Gear', 
    chapter: 'Hero 7', 
    difficulty: 'Hero', 
    efficiency: 'SS', 
    avgTime: '1.5 mins', 
    strategy: 'Fast wave-based chapter with high item drop density. Small rooms make it easy to clear with melee or high-speed projectiles.', 
    proTip: 'Use "Brightspear" or "Demon Blade" for instant travel between spawns. High agility is better than high damage here.', 
    bestHero: 'Meowgik', 
    lootRate: '3-4 items/run' 
  },
  { 
    id: 'gold-ucd', 
    resource: 'Gold', 
    chapter: 'Up-Close Dangers', 
    difficulty: 'Normal', 
    efficiency: 'SSS', 
    avgTime: '4 mins', 
    strategy: 'The primary source of gold. Enemies are mostly melee and move fast. Avoid getting cornered.', 
    proTip: 'Equip 2x Bull Rings for maximum gold bonus and damage resistance. Prioritize "Greed" skill early.', 
    bestHero: 'Helix', 
    lootRate: '200k - 1.2M Gold' 
  },
  { 
    id: 'shards-h21', 
    resource: 'Shards', 
    chapter: 'Hero 21', 
    difficulty: 'Hero', 
    efficiency: 'S', 
    avgTime: '5 mins', 
    strategy: 'Higher tier chapter with significantly increased shard drop rates for premium heroes.', 
    proTip: 'Focus on boss-killing skills. Antiquated Sword "Whirlwind" is highly effective against the double bosses.', 
    bestHero: 'Melinda', 
    lootRate: '2-3 shards/run' 
  },
  { 
    id: 'jewels-h28', 
    resource: 'Jewels', 
    chapter: 'Hero 28', 
    difficulty: 'Hero', 
    efficiency: 'SSS', 
    avgTime: '6 mins', 
    strategy: 'Elite wave chapter. The density of elite enemies guarantees at least one level 2-3 jewel drop per 5 runs.', 
    proTip: 'Stack "Richochet" and "Bouncy Wall" for maximum screen coverage in these larger wave rooms.', 
    bestHero: 'Wukong', 
    lootRate: 'Level 1-3 Jewels' 
  },
  { 
    id: 'runes-n14', 
    resource: 'Runes', 
    chapter: 'Normal 14', 
    difficulty: 'Normal', 
    efficiency: 'A', 
    avgTime: '2 mins', 
    strategy: 'Boss-only rush. Fast clear times allow for high volume of runs to stack runes quickly.', 
    proTip: 'Use Arcane Archer book to melt bosses in seconds. "Multi-shot" is mandatory.', 
    bestHero: 'Shingen', 
    lootRate: '15-20 Runes/hr' 
  },
  { 
    id: 'exp-h35', 
    resource: 'Exp', 
    chapter: 'Hero 35', 
    difficulty: 'Hero', 
    efficiency: 'SS', 
    avgTime: '8 mins', 
    strategy: 'Late-game high-intensity chapter. Massive EXP yield but requires high DR to survive projectile spam.', 
    proTip: '100% Projectile Immunity build is highly recommended for stable farming here.', 
    bestHero: 'Zeus', 
    lootRate: '40M - 65M EXP' 
  }
];

export const ARCHERO_KNOWLEDGE_BASE = `
ARCHERO V6.3 GRANDMASTER KNOWLEDGE:
- DR Cap: 75% normally, Titan pushes it to 85%.
- Immunity Formula: 2x Dragon Rings + Atreus/Onir Passive + Bulletproof Locket = Projectile Immune.
- Stutter Stepping: Cancel animation after shot to increase fire rate by 40%.
`;

// --- DRAGONS (Complete Roster) ---
export const DRAGON_DATA: BaseItem[] = [
  // SS TIER (The Holy Trinity)
  { id: 'magmar', name: 'Magmar', tier: 'SS', category: 'Dragon', dragonType: 'Attack', desc: 'Mana King.', deepLogic: 'Active destroys projectiles. Passive converts lost HP to Mana. Essential for spell spam.' },
  { id: 'starrite', name: 'Starrite', tier: 'SS', category: 'Dragon', dragonType: 'Balance', desc: 'Meteor Storm.', deepLogic: 'Massive AoE damage. Passive chance to cast spells for free.' },
  { id: 'voideon', name: 'Voideon', tier: 'SS', category: 'Dragon', dragonType: 'Defense', desc: 'Portal Master.', deepLogic: 'Summons portals that boost stats. High Dodge passive.' },

  // S TIER (Meta Essentials)
  { id: 'swordian', name: 'Swordian', tier: 'S', category: 'Dragon', dragonType: 'Attack', desc: 'Blade Spirit.', deepLogic: 'Best for Melee (Fist/Sword/Hammer). Buffs Hero stats and weapon range.' },
  { id: 'necrogon', name: 'Necrogon', tier: 'S', category: 'Dragon', dragonType: 'Balance', desc: 'Proj Resist.', deepLogic: 'Passive grants Projectile Resistance. Mandatory for the "Immunity Build".' },
  { id: 'geogon', name: 'Geogon', tier: 'S', category: 'Dragon', dragonType: 'Defense', desc: 'Rock Shield.', deepLogic: 'Active grants a Rock Shield that blocks damage. Great for boss tanking.' },
  { id: 'stormra', name: 'Stormra', tier: 'S', category: 'Dragon', dragonType: 'Attack', desc: 'Lightning Ball.', deepLogic: 'Summons a lightning ball that orbits you. Great for AFK farming.' },

  // A TIER (Specialists)
  { id: 'shadex', name: 'Shadex', tier: 'A', category: 'Dragon', dragonType: 'Defense', desc: 'Collision Immune.', deepLogic: 'Active grants 100% Collision Resistance. Key for "room hugger" strats.' },
  { id: 'infernox', name: 'Infernox', tier: 'A', category: 'Dragon', dragonType: 'Attack', desc: 'Fire Bomber.', deepLogic: 'Deals splash Fire damage. Good against swarms.' },
  { id: 'glacion', name: 'Glacion', tier: 'A', category: 'Dragon', dragonType: 'Defense', desc: 'Ice Breath.', deepLogic: 'Freezes enemies in a cone. Good crowd control.' },
  { id: 'dominus', name: 'Dominus', tier: 'A', category: 'Dragon', dragonType: 'Attack', desc: 'Trophy Dragon.', deepLogic: 'Boosts damage against Bosses. Situational.' },
  { id: 'jadeon', name: 'Jadeon', tier: 'A', category: 'Dragon', dragonType: 'Balance', desc: 'Gold Farmer.', deepLogic: 'Active skill drops Gold. Use for "Up-Close Dangers" event.' },
  { id: 'noxion', name: 'Noxion', tier: 'A', category: 'Dragon', dragonType: 'Defense', desc: 'Poison Cloud.', deepLogic: 'Leaves poison trails. Weak in endgame.' },

  // B TIER (Fodder)
  { id: 'ferron', name: 'Ferron', tier: 'B', category: 'Dragon', dragonType: 'Attack', desc: 'Slash.', deepLogic: 'Basic melee slash. Use as fodder for Magmar. Niche use only.' }
];

export const REFINE_TIPS = [
  "Efficiency Check: Never refine items needed for Mythic fuses.",
  "Essence Priority: Focus on Weapon slots first for maximum impact.",
  "Smelt Protocol: Ancient Legendaries yield the best late-game efficiency."
];