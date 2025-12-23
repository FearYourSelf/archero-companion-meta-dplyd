import { Hero, BaseItem, Jewel, Relic, SlotResonance } from './types';

// --- 1. HERO ROSTER (Comprehensive V6.3) ---
export const HERO_DATA: Hero[] = [
  { 
    id: 'zeus', name: 'Zeus', tier: 'SSS', category: 'Hero', isGodTier: true, globalBonus120: '+8% Max HP', 
    desc: 'The Lightning Sovereign.', deepLogic: "Attacks bypass standard projectile collision. 6-Star: Unlocks 'Static Field' (red lightning) that denies area to enemies. 3-Star: Lightning chains gain Critical Hit capability.", 
    evo4Star: 'Sustained attacks ramp up Atk Speed permanently for the room.', bestPairs: ['Celestial Hammer', 'Celestial Warplate'],
    bio: 'A celestial entity who descended to purge the darkness with righteous thunder.',
    bestSkin: 'Olympus Overlord', shardCost: '60 Shards to unlock (Premium/Event)', assistHeroes: ['Wukong', 'Stella', 'Dragon Girl'],
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
    bestSkin: 'Cosmic Traveler', shardCost: '60 Shards to unlock (Premium/Event)', assistHeroes: ['Zeus', 'Dragon Girl', 'Melinda'],
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
        bracelet: "Shield Bracelet",
        locket: "Bulletproof Locket",
        book: "Arcanum of Time",
        synergy: "Hybrid lightning/clone build. Excellent for clearing high-difficulty wave chapters."
      }
    ]
  },
  { 
    id: 'melinda', name: 'Melinda', tier: 'SSS', category: 'Hero', isGodTier: true, globalBonus120: '+5% Attack', 
    desc: 'The Barrage Queen.', deepLogic: "Barrage scales exponentially with 'Diagonal Arrows' and 'Bouncy Wall'. 4-Star Trait: Acts as a Berserker modifier, increasing projectile count as HP decreases.", 
    evo4Star: 'Barrage projectiles auto-target enemies (Smart Homing).', bestPairs: ['Expedition Fist', 'Dragon Ring'],
    bio: 'A high-society sharpshooter who prefers the heat of battle to the ballroom.',
    bestSkin: 'Baker Melinda', shardCost: '50 Shards to unlock (Premium/Events)', assistHeroes: ['Iris', 'Elaine', 'Meowgik'],
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
  { id: 'dragon_girl', name: 'Dragon Girl', tier: 'SS', category: 'Hero', globalBonus120: '+5% Attack', desc: 'Dragon companion warrior.', deepLogic: "Summons 'Riri' (Homing Ricochet). 4-Star: 'Dragon's Ire' grants the companion Critical Hits and a stacking Blaze effect.", evo4Star: 'Dragon Breath applies Burn.', bestPairs: ['Demon Blade'], bio: 'Raised by dragons in the forgotten peaks.', shardCost: '50 Shards to unlock (Premium/Events)', assistHeroes: ['Wukong', 'Shingen', 'Meowgik'], historicalTiers: [{update: "Launch", tier: "SS"}, {update: "v6.3", tier: "SS"}] },
  { id: 'taiga', name: 'Taiga', tier: 'SS', category: 'Hero', globalBonus120: '+17% Crit Damage', desc: 'Meteor-calling monk.', deepLogic: "Mandatory for Endgame: Grants +17% Global Crit Damage at Level 120. The 'Meteor' ability deals splash damage that ignores wall collision.", bestPairs: ['Brightspear'], bio: 'A monk from the Far East who controls the falling stars.', shardCost: '50 Shards to unlock (Premium/Events)', assistHeroes: ['Taranis', 'Phoren', 'Urasil'], historicalTiers: [{update: "Launch", tier: "S"}, {update: "Buff", tier: "SS"}] },
  { id: 'stella', name: 'Stella', tier: 'SS', category: 'Hero', globalBonus120: '+5% Attack', desc: 'Star-weaver mage.', deepLogic: 'Star-power builds up to trigger a screen-wide supernova.', bestPairs: ['Celestial Hammer'], bio: 'She weaves the constellations into deadly weapons.', shardCost: '50 Shards to unlock (Premium/Events)', assistHeroes: ['Zeus', 'Iris', 'Elaine'], historicalTiers: [{update: "v5.5", tier: "S"}, {update: "v6.3", tier: "SS"}] },
  { id: 'elaine', name: 'Elaine', tier: 'SS', category: 'Hero', globalBonus120: '+5% Attack', desc: 'Cherry blossom shields.', deepLogic: "Defensive Meta. When equipped with Expedition Plate, generating hearts triggers the invincibility shield. 3-Star: Shield reflects damage back to attackers.", bestPairs: ['Expedition Plate'], bio: 'The guardian of the sacred sakura tree.', shardCost: '50 Shards to unlock (Premium/Events)', assistHeroes: ['Melinda', 'Iris', 'Ophelia'], historicalTiers: [{update: "Launch", tier: "A"}, {update: "Skin release", tier: "SS"}] },
  { id: 'iris', name: 'Iris', tier: 'S', category: 'Hero', globalBonus120: '+5% Attack', desc: 'The wind-born archer.', deepLogic: 'Increases dodge after moving 3 meters.', bestPairs: ['Vest of Dexterity'], shardCost: '50 Shards to unlock (Soulstone/Shop)', assistHeroes: ['Melinda', 'Elaine', 'Lina'], historicalTiers: [{update: "Launch", tier: "A"}, {update: "v6.3", tier: "S"}] },
  { id: 'blazo', name: 'Blazo', tier: 'S', category: 'Hero', globalBonus120: '+5% Attack', desc: 'Demonic gunslinger.', deepLogic: 'Overheat mechanic triples damage but slows movement.', bestPairs: ['Demon Blade'], shardCost: '50 Shards to unlock (Premium/Events)', assistHeroes: ['Shade', 'Shingen', 'Phoren'], historicalTiers: [{update: "v4.0", tier: "SSS"}, {update: "Nerf", tier: "SS"}, {update: "Current", tier: "S"}] },
  { id: 'shingen', name: 'Shingen', tier: 'S', category: 'Hero', globalBonus120: '+5% Attack', desc: 'The blade master.', deepLogic: 'Attacks faster as he hits the same enemy.', bestPairs: ['Demon Blade'], shardCost: '50 Shards to unlock (Premium/Events)', assistHeroes: ['Dragon Girl', 'Lina', 'Sylvan'], historicalTiers: [{update: "Launch", tier: "SS"}, {update: "v6.3", tier: "S"}] },
  { id: 'lina', name: 'Lina', tier: 'S', category: 'Hero', globalBonus120: '+5% Attack', desc: 'Summons dancers.', deepLogic: 'Dancers apply a stacking slow to all enemies.', bestPairs: ['Brightspear'], shardCost: '50 Shards to unlock (Premium/Events)', assistHeroes: ['Sylvan', 'Iris', 'Shade'], historicalTiers: [{update: "v3.0", tier: "SSS"}, {update: "v6.3", tier: "S"}] },
  { id: 'gugu', name: 'Gugu', tier: 'S', category: 'Hero', globalBonus120: '+5% Max HP', desc: 'Owl guardian.', deepLogic: 'Birds provide 30% damage reduction shields.', bestPairs: ['Bull Ring'], shardCost: '50 Shards to unlock (Clan/Guild Store)', assistHeroes: ['Helix', 'Meowgik', 'Onir'], historicalTiers: [{update: "Nerf", tier: "A"}, {update: "Relic buff", tier: "S"}] },
  { id: 'shade', name: 'Shade', tier: 'S', category: 'Hero', globalBonus120: '+5% Attack', desc: 'The shadow assassin.', deepLogic: 'Shadow form grants +75% Attack Speed and +25% Dmg.', bestPairs: ['Demon Blade'], shardCost: '50 Shards to unlock (Soulstone/Shop)', assistHeroes: ['Lina', 'Sylvan', 'Ophelia'], historicalTiers: [{update: "v2.0", tier: "SSS"}, {update: "v6.3", tier: "S"}] },
  { id: 'sylvan', name: 'Sylvan', tier: 'S', category: 'Hero', globalBonus120: '+5% Attack', desc: 'Elf prince.', deepLogic: 'Removes elemental skills from RNG pool, inherent elemental master.', bestPairs: ['Brightspear'], shardCost: '50 Shards to unlock (Soulstone/Shop)', assistHeroes: ['Lina', 'Shade', 'Rolla'], historicalTiers: [{update: "v1.8", tier: "SSS"}, {update: "v6.3", tier: "S"}] },
  { 
    id: 'helix', name: 'Helix', tier: 'S', category: 'Hero', globalBonus120: '+5% Critical Chance', desc: 'The OG Fury king.', deepLogic: 'Damage increases as HP drops. Highest stability.', bestPairs: ['Demon Blade'], bio: 'The son of a legendary warrior who draws power from his wounds.', shardCost: '30 Shards to unlock (1,500 Gems/Soulstone)', assistHeroes: ['Gugu', 'Meowgik', 'Onir'],
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
  { id: 'meowgik', name: 'Meowgik', tier: 'A', category: 'Hero', globalBonus120: '+5% Dodge', desc: 'The kitten mage.', deepLogic: 'Spawns homing kittens that ignore walls.', bestPairs: ['Brightspear'], shardCost: '30 Shards to unlock (1,800 Gems/Soulstone)', assistHeroes: ['Helix', 'Gugu', 'Ayana'], historicalTiers: [{update: "Intro", tier: "SS"}, {update: "v6.3", tier: "A"}] },
  { id: 'ayana', name: 'Ayana', tier: 'A', category: 'Hero', globalBonus120: '+10% Damage to Ranged Units', desc: 'Enchanted witch.', deepLogic: 'Portals provide temporary i-frames during travel.', bestPairs: ['Phantom Cloak'], shardCost: '30 Shards to unlock (2,500 Gems/Soulstone)', assistHeroes: ['Meowgik', 'Ophelia', 'Rolla'] },
  { id: 'ophelia', name: 'Ophelia', tier: 'A', category: 'Hero', globalBonus120: '+5% Attack', desc: 'Spirit hunter.', deepLogic: 'Soul shards provide varying elemental buffs.', bestPairs: ['Demon Blade'], shardCost: '50 Shards to unlock (Events/Shop)', assistHeroes: ['Shade', 'Lina', 'Ayana'] },
  { id: 'onir', name: 'Onir', tier: 'A', category: 'Hero', globalBonus120: '+10% Projectile Resistance', desc: 'Holy knight.', deepLogic: 'Global 10% Projectile Resistance at 7-stars.', uniqueEffect: 'Global Proj Resist', shardCost: '50 Shards to unlock (Soulstone/Shop)', assistHeroes: ['Atreus', 'Helix', 'Phoren'] },
  { id: 'rolla', name: 'Rolla', tier: 'B', category: 'Hero', globalBonus120: '+10% Resistance to All Elemental Damage', desc: 'Ice goddess.', deepLogic: 'Freezes enemies for longer than standard frozen effect.', bestPairs: ['Death Scythe'], shardCost: '30 Shards to unlock (3,000 Gems/Shop)', assistHeroes: ['Sylvan', 'Ayana', 'Meowgik'] },
  { id: 'taranis', name: 'Taranis', tier: 'B', category: 'Hero', globalBonus120: '+15% Lightning Damage', desc: 'Thunder master.', deepLogic: 'Lightning arcs deal 35% splash damage.', bestPairs: ['Tornado'], shardCost: '30 Shards to unlock (1,000 Gems/Shop)', assistHeroes: ['Atreus', 'Urasil', 'Phoren'] },
  { id: 'phoren', name: 'Phoren', tier: 'C', category: 'Hero', globalBonus120: '+15% Fire Damage', desc: 'Fire master.', deepLogic: 'Burn damage lasts twice as long.', bestPairs: ['Saw Blade'], shardCost: '30 Shards to unlock (50,000 Gold/Shop)', assistHeroes: ['Atreus', 'Taranis', 'Urasil'] },
  { id: 'atreus', name: 'Atreus', tier: 'C', category: 'Hero', globalBonus120: '+7% Projectile Resistance', desc: 'The rookie.', deepLogic: 'Mandatory L120 for Immunity Build.', uniqueEffect: 'Immunity Key', bio: 'The hero who started it all.', shardCost: 'Starter Hero (Unlocked by default)', assistHeroes: ['Helix', 'Phoren', 'Urasil'] },
  { id: 'uruana', name: 'Urasil', tier: 'F', category: 'Hero', globalBonus120: '+15% Poison Damage', desc: 'Poison master.', deepLogic: 'Poison damage scales poorly in late game.', bestPairs: ['Tornado'], shardCost: '30 Shards to unlock (10,000 Gold/Shop)', assistHeroes: ['Atreus', 'Phoren', 'Taranis'] }
];

export const GEAR_DATA: BaseItem[] = [
  // --- WEAPONS ---
  { 
    id: 'exp_fist', name: 'Expedition Fist', tier: 'SSS', category: 'Weapon', desc: 'Hybrid Gauntlets.', 
    mythicPerk: 'Titan: Weapon Dmg +15% (Final Multiplier).', 
    deepLogic: 'Melee/Ranged hybrid. Combo system: 2nd melee hit triggers "Roar" AoE shockwaves. Stacks "Combo" on hits, scaling Crit Chance exponentially. NOTE: Does NOT heal on hit; survivability relies on "Expedition Plate" heart-shield synergy.' 
  },
  { 
    id: 'celestial_hammer', name: 'Celestial Hammer', tier: 'SSS', category: 'Weapon', desc: 'Lightning Maul.', 
    mythicPerk: 'Titan: Perpetual Charge.', 
    deepLogic: 'Switching to Lightning Form (Charge full) makes projectiles pierce all obstacles. While in lightning form, attack speed is capped but damage is tripled. Pairs with Celestial Warplate for 100% mana sustain.' 
  },
  { id: 'ant_sword', name: 'Antiquated Sword', tier: 'SS', category: 'Weapon', desc: 'Greatsword.', mythicPerk: 'Titan: Whirlwind Reflects 30% Dmg.', deepLogic: 'Broadsword has hidden +40% Dmg vs Bosses.' },
  { id: 'demon_blade', name: 'Demon Blade', tier: 'SS', category: 'Weapon', desc: 'Katana.', mythicPerk: 'Titan: Shadows inherit 100% Element.', deepLogic: 'Melee hits deal 1.8x damage. Do NOT take Front Arrow.' },
  { id: 'stalker_staff', name: 'Stalker Staff', tier: 'S', category: 'Weapon', desc: 'Staff.', mythicPerk: 'Titan: +15% Flight Speed.', deepLogic: 'Best for Bosses. Stack Diagonal Arrows.' },
  { id: 'brightspear', name: 'Brightspear', tier: 'A', category: 'Weapon', desc: 'Laser.', mythicPerk: 'Titan: Beam splits to 2 targets.' },
  { id: 'death_scythe', name: 'Death Scythe', tier: 'A', category: 'Weapon', desc: 'Scythe.', mythicPerk: 'Titan: Execute threshold <35% HP.' },
  { id: 'tornado', name: 'Tornado', tier: 'A', category: 'Weapon', desc: 'Boomerang. Built-in Pierce and Ricochet.' },
  { id: 'gale_force', name: 'Gale Force', tier: 'B', category: 'Weapon', desc: 'Crossbow. Charged Shot.' },
  { id: 'saw_blade', name: 'Saw Blade', tier: 'C', category: 'Weapon', desc: 'Dagger. Fastest Attack Speed.' },
  { id: 'brave_bow', name: 'Brave Bow', tier: 'C', category: 'Weapon', desc: 'Bow.', mythicPerk: 'Titan: High Crit Synergy.' },
  { id: 'mini_atreus', name: 'Mini Atreus', tier: 'D', category: 'Weapon', desc: 'Meme Weapon. Just for fun.' },

  // --- ARMOR ---
  { id: 'c_warplate', name: 'Celestial Warplate', tier: 'SSS', category: 'Armor', desc: 'Lightning Plate.', mythicPerk: 'Titan: Collision Resist +20%.', deepLogic: 'Converts dmg to Heavenly Energy. Best for wave chapters.' },
  { id: 'exp_plate', name: 'Expedition Plate', tier: 'SSS', category: 'Armor', desc: 'Heart Plate.', mythicPerk: 'Titan: Heart Drop +20%.', deepLogic: 'Picking up hearts grants Invincibility Shield.' },
  { id: 'p_cloak', name: 'Phantom Cloak', tier: 'SS', category: 'Armor', desc: 'Ice Cloak.', mythicPerk: 'Titan: Freeze +2.5s. Frozen enemies take +30% Dmg.', deepLogic: 'Meta for Boss chapters.' },
  { id: 'bright_robe', name: 'Bright Robe', tier: 'A', category: 'Armor', desc: 'Front Dmg Resistance + XP Boost.' },
  { id: 'shadow_robe', name: 'Shadow Robe', tier: 'A', category: 'Armor', desc: 'Deals Dark damage to nearby enemies.' },
  { id: 'void_robe', name: 'Void Robe', tier: 'B', category: 'Armor', desc: 'Poisons all enemies in room.' },
  { id: 'vest_dex', name: 'Vest of Dexterity', tier: 'B', category: 'Armor', desc: 'Dodge Vest.', deepLogic: '+7% Dodge.' },
  { id: 'golden_chest', name: 'Golden Chestplate', tier: 'C', category: 'Armor', desc: 'Flame Chest.', mythicPerk: 'Titan: 5% Dmg Reduction.' },

  // --- RINGS ---
  { id: 'dragon_ring', name: 'Dragon Ring', tier: 'SS', category: 'Ring', desc: 'Proj Resist.', mythicPerk: 'Titan: Proj Resist +13.8%.', deepLogic: 'Essential for Immunity Build. Stacks additively.' },
  { id: 'celestial_ring', name: 'Celestial Band', tier: 'SS', category: 'Ring', desc: 'Lightning Ring.', mythicPerk: 'Titan: Collision Resist +15%.', deepLogic: 'Chain Lightning scales with S-Locket.' },
  { id: 'bull_ring', name: 'Bull Ring', tier: 'S', category: 'Ring', desc: 'Tank Ring.', mythicPerk: 'Titan: Dmg Resist +10%.', deepLogic: 'Best for farming Gold. DR applies after Proj Resist.' },
  { id: 'lion_ring', name: 'Lion Ring', tier: 'S', category: 'Ring', desc: 'Boss Ring.', mythicPerk: 'Titan: Crit Dmg +20%.', deepLogic: 'Pure DPS. Mandatory for Boss Chapters.' },
  { id: 'vilebat_ring', name: 'Vilebat Ring', tier: 'A', category: 'Ring', desc: 'Heal on Kill.', deepLogic: 'Restores a small % of HP per kill. Effectively doubles the yield of "Heal on Kill" skills.' },
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
  { id: 'bulletproof', name: 'Bulletproof Locket', tier: 'SS', category: 'Locket', desc: 'Proj Tank.', mythicPerk: 'Titan: +15% Proj Resist (<25% HP).', deepLogic: 'Key to 100% Immunity.' },
  { id: 'celestial_talisman', name: 'Celestial Talisman', tier: 'SS', category: 'Locket', desc: 'MP Gen.', deepLogic: 'Best for Mana-hungry heroes.' },
  { id: 'exp_locket', name: 'Expedition Locket', tier: 'S', category: 'Locket', desc: 'Revive.', mythicPerk: 'Titan: Atk +25% after heal.' },
  { id: 'angel', name: 'Angel Locket', tier: 'A', category: 'Locket', desc: 'Revive Chance.' },
  { id: 'bloodthirsty', name: 'Bloodthirsty Locket', tier: 'A', category: 'Locket', desc: 'Lifesteal.' },
  { id: 'agile', name: 'Agile Locket', tier: 'B', category: 'Locket', desc: 'Dodge.', deepLogic: 'Dodge at low HP.' },
  { id: 'counterattack', name: 'Counterattack Charm', tier: 'C', category: 'Locket', desc: 'Reflect.' },
  { id: 'iron', name: 'Iron Locket', tier: 'C', category: 'Locket', desc: 'Collision.' },
  { id: 'piercer', name: 'Piercer Locket', tier: 'C', category: 'Locket', desc: 'Wall Pass.' },

  // --- BOOKS ---
  { id: 'enlightenment', name: 'Enlightenment', tier: 'SS', category: 'Book', desc: 'Skills.', mythicPerk: 'Titan: Dmg Resist +5%.', deepLogic: 'Best for Infinite Adventure. Breaks RNG limit.' },
  { id: 'arcanum', name: 'Arcanum of Time', tier: 'SS', category: 'Book', desc: 'Time Stop.', mythicPerk: 'Titan: Duration +1s.', deepLogic: 'Freezes projectiles. Ultimate defense.' },
  { id: 'giant', name: 'Giants Contract', tier: 'S', category: 'Book', desc: 'Melee.', deepLogic: 'Synergy King with Demon Blade/Fist.' },
  { id: 'art_combat', name: 'Art of Combat', tier: 'A', category: 'Book', desc: 'Knockback.' },
  { id: 'arcane_archer', name: 'Arcane Archer', tier: 'A', category: 'Book', desc: 'Arrows.', mythicPerk: 'Titan: Duration +1s.' },
  { id: 'ice_realm', name: 'Ice Realm', tier: 'B', category: 'Book', desc: 'Freeze.' },
  { id: 'spectre', name: 'Spectre Book', tier: 'C', category: 'Book', desc: 'Summons.' },
  { id: 'mystery_time', name: 'Time of Mysteries', tier: 'C', category: 'Book', desc: 'Ultimate CDR & Healing.' },

  // --- SPIRITS ---
  { id: 'laser_bat', name: 'Laser Bat', tier: 'A', category: 'Spirit', desc: 'Wall Pierce.', deepLogic: 'Laser attacks penetrate all obstacles. Best for applying elemental debuffs safely from behind walls.' },
  { id: 'noisy_owl', name: 'Noisy Owl', tier: 'A', category: 'Spirit', desc: 'Knockback.', deepLogic: 'High knockback value. Useful for ranged kite builds, but can disrupt melee combos.' },
  { id: 'flaming_ghost', name: 'Flaming Ghost', tier: 'B', category: 'Spirit', desc: 'Pierce.', deepLogic: 'Inherits Fire damage. Projectiles pierce 1 target.' },
  { id: 'scythe_mage', name: 'Scythe Mage', tier: 'C', category: 'Spirit', desc: 'Bounce.' },
  { id: 'elf', name: 'Elf', tier: 'C', category: 'Spirit', desc: 'Fast Atk.' },
  { id: 'living_bomb', name: 'Living Bomb', tier: 'D', category: 'Spirit', desc: 'Useless.' },
  { id: 'bone_warrior', name: 'Bone Warrior', tier: 'A', category: 'Spirit', desc: 'Melee Tank & Aggro', deepLogic: 'Inherits Hero aggro. Can draw fire from Elite mobs in Wave chapters. High HP scaling.' },

  // --- PETS (New Ground Units) ---
  { id: 'frothy', name: 'Frothy Capy', tier: 'SS', category: 'Pet', desc: 'Immunity Bubble.', deepLogic: 'Bubble = 100% Immunity.' },
  { id: 'unicorn', name: 'Empyrean Unicorn', tier: 'SS', category: 'Pet', desc: 'Block %.' },
  { id: 'blitzbeak', name: 'Furious Blitzbeak', tier: 'S', category: 'Pet', desc: 'Lightning.' },

  // --- TOTEMS ---
  { id: 'totem_atk', name: 'Attack Totem', tier: 'SS', category: 'Totem', desc: 'Boosts Attack stats.' },
  { id: 'totem_hp', name: 'HP Totem', tier: 'SS', category: 'Totem', desc: 'Boosts Max HP.' },
  { id: 'totem_hero', name: 'Hero Totem', tier: 'S', category: 'Totem', desc: 'Boosts Hero-specific stats (e.g., Crit, Elemental Dmg).' },
  { id: 'totem_equip', name: 'Equipment Totem', tier: 'S', category: 'Totem', desc: 'Boosts base stats of Weapons/Armor.' },
  { id: 'totem_relic', name: 'Relic Totem', tier: 'A', category: 'Totem', desc: 'Unlocks at higher chapters (N80+). Boosts Relic stats.' },
  { id: 'totem_dragon', name: 'Dragon Totem', tier: 'A', category: 'Totem', desc: 'Unlocks at higher chapters (N100+). Boosts Dragon stats.' },
  { id: 'totem_jewel', name: 'Jewel Totem', tier: 'B', category: 'Totem', desc: 'Boosts Jewel stats (often inferred, usually grouped with Equipment).' },
  { id: 'totem_defense', name: 'Defense Totem', tier: 'A', category: 'Totem', desc: 'Boosts Damage Resistance / Defense (Rare drop).' },

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
  { id: 'ruby', name: 'Ruby', color: 'Red', statType: 'Attack', baseStat: 20, statPerLevel: 35, slots: ['Weapon', 'Ring'], lore: 'Burning stone of raw power. Essential for DPS builds.' },
  { id: 'kunzite', name: 'Kunzite', color: 'Red', statType: 'Attack', baseStat: 15, statPerLevel: 30, slots: ['Weapon', 'Ring'], lore: 'Destroyer of massive foes. Specializes in raw blunt trauma.' },
  { id: 'lapis', name: 'Lapis', color: 'Blue', statType: 'Max HP', baseStat: 80, statPerLevel: 140, slots: ['Armor', 'Locket'], lore: 'Deep reservoir of vitality. The foundation of high-HP tanks.' },
  { id: 'topaz', name: 'Topaz', color: 'Green', statType: 'Crit Chance', baseStat: 0.5, statPerLevel: 0.8, slots: ['Ring', 'Bracelet'], lore: 'Sharp focus mineral. Key for triggering "On-Crit" effects.' },
  { id: 'emerald', name: 'Emerald', color: 'Teal', statType: 'Attack Speed', baseStat: 0.3, statPerLevel: 0.5, slots: ['Weapon', 'Bracelet'], lore: 'Agile resonance crystal. Best paired with slow, heavy weapons.' }
];

export const JEWEL_RESONANCE_DATA: SlotResonance[] = [
  { slot: 'Weapon', lv16: 'Damage +10% to enemies with >75% HP', lv28: 'Critical Damage +10%', lv33: 'Attack Speed +3%', lv38: 'Final Attack +5% (Global)' },
  { slot: 'Armor', lv16: 'HP +5% during battle', lv28: 'Damage Resistance +5% (Global)', lv33: 'Heart Healing +15%', lv38: 'Max HP +15%' },
  { slot: 'Ring', lv16: 'Boss Damage +5%', lv28: 'Elite Damage +10%', lv33: 'Gold Drop +15%', lv38: 'Critical Chance +5%' },
  { slot: 'Bracelet', lv16: 'Attack Speed +3%', lv28: 'Critical Chance +5%', lv33: 'Dmg to Elites +10%', lv38: 'Critical Damage +15%' },
  { slot: 'Locket', lv16: 'Dodge Chance +2%', lv28: 'Projectile Resistance +7%', lv33: 'Collision Resistance +7%', lv38: 'Dodge Chance +10%' },
  { slot: 'Spellbook', lv16: 'Mana Regen +10%', lv28: 'Spellbook Effect +15%', lv33: 'Ultimate CDR -5%', lv38: 'Mana Regen +25%' }
];

export const RELIC_DATA: Relic[] = [
  // Holy Relics (Pink/Red)
  { id: 'spear_yggdrasil', name: 'Spear of Yggdrasil', tier: 'Holy', effect: 'Attack +% & Attack Speed +%', iconType: 'Arrow', lore: 'The ultimate offensive relic. Boosts both raw damage and how fast you hit. Radiates eternal growth.', source: 'Relic Chests' },
  { id: 'bloodstained_sword', name: 'Bloodstained Sword', tier: 'Holy', effect: 'Attack +% & Crit Rate +%', iconType: 'Sword', lore: 'Best for Critical Hit builds. Often mistranslated as "Cursed Sword." Thirsts for blood.', source: 'Elite Drops' },
  { id: 'starcluster_rage', name: 'Starcluster Rage', tier: 'Holy', effect: 'Crit Damage +%', iconType: 'Gem', lore: 'Massive boost to critical hit damage. Essential for "Big Number" builds. Contains the fury of dying stars.', source: 'Stellar Events' },
  { id: 'demon_king_eye', name: 'Demon King\'s Eye', tier: 'Holy', effect: 'Projectile Resistance +% & Dark Damage +%', iconType: 'Eye', lore: 'Mandatory for the endgame "Immunity Build" to reduce incoming damage. Petrified gaze of the original overlord.', source: 'Demon King Event' },
  { id: 'gilded_medal', name: 'Gilded Medal', tier: 'Holy', effect: 'Max HP +% & Damage Resistance +%', iconType: 'Shield', lore: 'The best defensive relic in the game. Pure tank stats. Granted only to divine champions.', source: 'Legendary Feats' },
  { id: 'dragon_gem', name: 'Dragon Gem', tier: 'Holy', effect: 'All Elemental Damage +%', iconType: 'Gem', lore: 'Boosts Fire, Ice, Poison, and Lightning damage globally. The soul of a dragon trapped in crystal.', source: 'Dragon Trials' },

  // Radiant Relics (Yellow/Gold)
  { id: 'golden_apple', name: 'Golden Apple', tier: 'Radiant', effect: 'Max HP +% & Healing Effect +%', iconType: 'Gem', lore: 'Makes Red Hearts heal for more. Great for survival. Acts as a source of life.', source: 'Normal Chapters' },
  { id: 'mirror_of_truth', name: 'Mirror of Truth', tier: 'Radiant', effect: 'Crit Chance +% & Accuracy', iconType: 'Eye', lore: 'Helps hit enemies that have high dodge rates. Shows exactly where they are weak.', source: 'Hero Chapters' },
  { id: 'ancient_map', name: 'Ancient Map', tier: 'Radiant', effect: 'Movement Speed +% & Trap Resistance', iconType: 'Scroll', lore: 'Reduces damage from spikes/saws and makes you move faster. A map of lands that no longer exist.', source: 'Expedition Mode' },
  { id: 'hero_cape', name: 'Hero\'s Cape', tier: 'Radiant', effect: 'Damage Resistance +%', iconType: 'Shield', lore: 'General damage reduction. Good all-rounder for defense. A radiant symbol of courage.', source: 'Daily Challenges' },
  { id: 'pharaoh_scepter', name: 'Pharaoh\'s Scepter', tier: 'Radiant', effect: 'Crit Chance +% & Skill Damage +%', iconType: 'Sword', lore: 'Boosts damage from abilities (like Meteors/Stars). The scepter of a king who ruled with an iron fist.', source: 'Tomb Exploration' },
  { id: 'prometheus_fire', name: 'Prometheus\'s Fire', tier: 'Radiant', effect: 'Attack + (Flat) & Fire Damage +%', iconType: 'Flame', lore: 'Specifically buffs Fire damage (good for Phoren/Lina). The fire stolen from the gods.', source: 'Tower Defense' },

  // Faint Relics (Blue/Purple)
  { id: 'broken_sword', name: 'Broken Sword', tier: 'Faint', effect: 'Flat Attack +', iconType: 'Sword', lore: 'A simple, raw number boost to your Attack stat. A piece of steel with history.', source: 'Common Drops' },
  { id: 'rusty_key', name: 'Rusty Key', tier: 'Faint', effect: 'Gold Drop Rate +%', iconType: 'Gem', lore: 'Essential for farming runs (Up-Close Dangers). Probably doesn\'t open anything important.', source: 'Common Drops' },
  { id: 'dusty_tome', name: 'Dusty Tome', tier: 'Faint', effect: 'Scroll Drop Rate +%', iconType: 'Book', lore: 'Helps you find more upgrade scrolls for your equipment. The writing is almost faded away.', source: 'Common Drops' },
  { id: 'lost_cross', name: 'Lost Cross', tier: 'Faint', effect: 'Flat HP +', iconType: 'Shield', lore: 'A simple, raw number boost to your HP. A relic from a forgotten faith.', source: 'Normal Chapters' },
  { id: 'strange_stone', name: 'Strange Stone', tier: 'Faint', effect: 'Flat Damage Resistance', iconType: 'Gem', lore: 'Reduces damage by a flat amount (e.g., -50 damage). Seems to absorb impact.', source: 'Common Drops' }
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
- Jewel Resonance: Milestones reached at slot total levels 16, 28, 33, and 38.
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