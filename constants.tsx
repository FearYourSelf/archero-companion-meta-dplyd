
import { Hero, BaseItem, Jewel, Relic, SlotBonus, ArcheroEvent } from './types';

// --- 1. HERO ROSTER (Comprehensive V6.3) ---
export const HERO_DATA: Hero[] = [
  { 
    id: 'zeus', name: 'Zeus', tier: 'SSS', category: 'Hero', isGodTier: true, globalBonus120: '+8% Max HP', 
    desc: 'The Lightning Sovereign.', deepLogic: "Attacks bypass standard projectile collision. 6-Star: Unlocks 'Static Field' (red lightning) that denies area to enemies. 3-Star: Lightning chains gain Critical Hit capability.", 
    evo4Star: 'Sustained attacks ramp up Atk Speed permanently for the room.', bestPairs: ['Celestial Hammer', 'Celestial Warplate'],
    bio: 'A celestial entity who descended to purge the darkness with righteous thunder.',
    bestSkin: 'Olympus Overlord', shardCost: '60 Shards to unlock (Premium Event / $31.99)', assistHeroes: ['Wukong', 'Stella', 'Dragon Girl'],
    trivia: 'Currently the highest DPS hero in the game for wave chapters.',
    uniqueEffect: 'Thunder Chain: Hits bounce to 3 nearby enemies.',
    historicalTiers: [
      { update: "v6.0 Launch", tier: "SSS" },
      { update: "v6.1 Patch", tier: "SSS" },
      { update: "v6.3 Current", tier: "SSS" }
    ],
    starMilestones: [
      { stars: 3, effect: "Lightning Chain can trigger Critical Hits." },
      { stars: 4, effect: "Attack Speed ramp-up per hit (Room duration)." },
      { stars: 6, effect: "Static Field: Red lightning aura damages and stuns." },
      { stars: 7, effect: "+10% Projectile Resistance (Global)", isGlobal: true }
    ],
    sunMilestones: [
      { level: 1, effect: "Static Field duration +50%." },
      { level: 2, effect: "+15% Lightning Damage (Global)", isGlobal: true },
      { level: 3, effect: "Thunder Chain jumps to 2 extra targets." },
      { level: 4, effect: "Static Field duration +75%." }
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
      }
    ]
  },
  { 
    id: 'wukong', name: 'Wukong', tier: 'SSS', category: 'Hero', isGodTier: true, globalBonus120: '+8% Attack', 
    desc: 'Master of transformation.', deepLogic: "The Golden Cudgel neutralizes enemy projectiles. 4-Star: 'Phantom Hair' summons a decoy clone on lethal damage. 5-Star: '72 Forms' grants temporary immunity and spinning nova attacks.", 
    evo4Star: 'Phantom Hair: Spawns mirror decoy every 10s.', bestPairs: ['Expedition Fist', 'Phantom Cloak'],
    bio: 'The Monkey King, escaped from his mountain prison to seek new challenges.',
    bestSkin: 'Cosmic Traveler', shardCost: '60 Shards to unlock (Premium Event / $31.99)', assistHeroes: ['Zeus', 'Dragon Girl', 'Melinda'],
    trivia: 'His clones count as "Spirits" for certain equipment buffs.',
    historicalTiers: [
      { update: "v5.8 Intro", tier: "SS" },
      { update: "v5.9 Buff", tier: "SSS" },
      { update: "v6.3 Current", tier: "SSS" }
    ],
    starMilestones: [
      { stars: 3, effect: "Cudgel shockwaves deal +50% Area Damage." },
      { stars: 4, effect: "Phantom Hair: Spawns mirror decoy on room entry." },
      { stars: 6, effect: "72 Forms: Temporary invincibility during transformation." },
      { stars: 7, effect: "+10% Attack (Global)", isGlobal: true }
    ],
    sunMilestones: [
      { level: 1, effect: "Clone damage increased by 100%." },
      { level: 2, effect: "+10% Critical Chance (Global)", isGlobal: true },
      { level: 3, effect: "Golden Cudgel deflects larger projectiles." },
      { level: 4, effect: "+10% Attack Speed (Global)", isGlobal: true },
      { level: 5, effect: "Golden Cudgel has a 20% chance to spawn a temporary decoy." }
    ]
  },
  { 
    id: 'melinda', name: 'Melinda', tier: 'SSS', category: 'Hero', isGodTier: true, globalBonus120: '+5% Attack', 
    desc: 'The Barrage Queen.', deepLogic: "Barrage scales exponentially with 'Diagonal Arrows' and 'Bouncy Wall'. 4-Star Trait: Acts as a Berserker modifier, increasing projectile count as HP decreases.", 
    evo4Star: 'Barrage projectiles auto-target enemies (Smart Homing).', bestPairs: ['Expedition Fist', 'Dragon Ring'],
    bio: 'A high-society sharpshooter who prefers the heat of battle to the ballroom.',
    bestSkin: 'Baker Melinda', shardCost: '50 Shards to unlock (Soulstone Shop / $19.99)', assistHeroes: ['Iris', 'Elaine', 'Meowgik'],
    trivia: 'Her Barrage skill is considered a "Physical" attack and benefits from raw ATK buffs.',
    historicalTiers: [
      { update: "v4.2 Intro", tier: "S" },
      { update: "v5.0 Mastery", tier: "SS" },
      { update: "v6.3 Current", tier: "SSS" }
    ],
    starMilestones: [
      { stars: 3, effect: "Barrage arrows have +20% Critical Chance." },
      { stars: 4, effect: "Smart Homing: Barrage tracks moving targets." },
      { stars: 6, effect: "Soul Seeker: Barrage hits restore small amount of HP." },
      { stars: 7, effect: "+15% Critical Damage (Global)", isGlobal: true }
    ],
    sunMilestones: [
      { level: 1, effect: "Barrage arrows pierce through the first target." },
      { level: 2, effect: "+12% Max HP (Global)", isGlobal: true },
      { level: 3, effect: "Barrage activation threshold increased to 95% HP." },
      { level: 4, effect: "+15% Barrage Damage (Global)", isGlobal: true }
    ]
  },
  { 
    id: 'dragon_girl', name: 'Dragon Girl', tier: 'SS', category: 'Hero', globalBonus120: '+5% Attack', 
    desc: 'Dragon companion warrior.', deepLogic: "Summons 'Riri' (Homing Ricochet). 4-Star: 'Dragon's Ire' grants the companion Critical Hits and a stacking Blaze effect.", 
    evo4Star: 'Dragon Breath applies Burn.', bestPairs: ['Demon Blade'], 
    bio: 'Raised by dragons in the forgotten peaks.', shardCost: '50 Shards to unlock (Special Events / $19.99)', 
    assistHeroes: ['Wukong', 'Shingen', 'Meowgik'], historicalTiers: [{update: "Launch", tier: "SS"}, {update: "v6.3", tier: "SS"}],
    starMilestones: [
      { stars: 3, effect: "Riri's movement speed increased by 30%." },
      { stars: 7, effect: "+10% Attack (Global)", isGlobal: true }
    ],
    sunMilestones: [
      { level: 1, effect: "Riri's attack range increased by 40%." },
      { level: 3, effect: "+5% Damage Resistance (Global)", isGlobal: true }
    ]
  },
  { 
    id: 'taiga', name: 'Taiga', tier: 'SS', category: 'Hero', globalBonus120: '+17% Crit Damage', 
    desc: 'Meteor-calling monk.', deepLogic: "Mandatory for Endgame: Grants +17% Global Crit Damage at Level 120.", 
    bestPairs: ['Brightspear'], bio: 'A monk from the Far East who controls the falling stars.', 
    shardCost: '50 Shards to unlock (Soulstone Shop / $19.99)', assistHeroes: ['Taranis', 'Phoren', 'Urasil'],
    starMilestones: [
      { stars: 3, effect: "Meteor impact radius increased." },
      { stars: 7, effect: "+10% Critical Damage (Global)", isGlobal: true }
    ],
    sunMilestones: [
      { level: 4, effect: "+15% Critical Damage (Global)", isGlobal: true },
      { level: 5, effect: "Meteor impacts leave a burning ground for 3 seconds." }
    ]
  },
  { 
    id: 'stella', name: 'Stella', tier: 'SS', category: 'Hero', globalBonus120: '+5% Attack', 
    desc: 'Star-weaver mage.', deepLogic: 'Star-power builds up to trigger a screen-wide supernova.', 
    bestPairs: ['Celestial Hammer'], bio: 'She weaves the constellations into deadly weapons.', 
    shardCost: '50 Shards to unlock (Soulstone Shop / $19.99)', assistHeroes: ['Zeus', 'Iris', 'Elaine'],
    starMilestones: [
      { stars: 7, effect: "+5% Attack (Global)", isGlobal: true }
    ]
  },
  { 
    id: 'elaine', name: 'Elaine', tier: 'SS', category: 'Hero', globalBonus120: '+5% Attack', 
    desc: 'Cherry blossom shields.', deepLogic: "Defensive Meta setup. Shields reflect damage at 3-stars.", 
    bestPairs: ['Expedition Plate'], bio: 'The guardian of the sacred sakura tree.', 
    shardCost: '50 Shards to unlock (Soulstone Shop / $19.99)', assistHeroes: ['Melinda', 'Iris', 'Ophelia'],
    starMilestones: [
      { stars: 3, effect: "Shields reflect 50% of projectile damage." },
      { stars: 7, effect: "+5% Max HP (Global)", isGlobal: true }
    ]
  },
  { 
    id: 'iris', name: 'Iris', tier: 'S', category: 'Hero', globalBonus120: '+5% Attack', 
    desc: 'The wind-born archer.', deepLogic: 'Increases dodge after moving 3 meters.', 
    bestPairs: ['Vest of Dexterity'], shardCost: '50 Shards to unlock (Soulstone Shop / $14.99)', 
    assistHeroes: ['Melinda', 'Elaine', 'Lina'],
    starMilestones: [
      { stars: 7, effect: "+5% Dodge (Global)", isGlobal: true }
    ]
  },
  { 
    id: 'blazo', name: 'Blazo', tier: 'S', category: 'Hero', globalBonus120: '+5% Attack', 
    desc: 'Demonic gunslinger.', deepLogic: 'Overheat mechanic triples damage but slows movement.', 
    bestPairs: ['Demon Blade'], shardCost: '50 Shards to unlock (Soulstone Shop / $14.99)', 
    assistHeroes: ['Shade', 'Shingen', 'Phoren'],
    starMilestones: [
      { stars: 7, effect: "+5% Attack (Global)", isGlobal: true }
    ]
  },
  { 
    id: 'shingen', name: 'Shingen', tier: 'S', category: 'Hero', globalBonus120: '+5% Attack', 
    desc: 'The blade master.', deepLogic: 'Attacks faster as he hits the same enemy.', 
    bestPairs: ['Demon Blade'], shardCost: '50 Shards to unlock (Soulstone Shop / $14.99)', 
    assistHeroes: ['Dragon Girl', 'Lina', 'Sylvan'],
    starMilestones: [
      { stars: 7, effect: "+5% Attack Speed (Global)", isGlobal: true }
    ]
  },
  { 
    id: 'lina', name: 'Lina', tier: 'S', category: 'Hero', globalBonus120: '+5% Attack', 
    desc: 'Summons dancers.', deepLogic: 'Dancers apply a stacking slow to all enemies.', 
    bestPairs: ['Brightspear'], shardCost: '50 Shards to unlock (Soulstone Shop / $14.99)', 
    assistHeroes: ['Sylvan', 'Iris', 'Shade'],
    starMilestones: [
      { stars: 7, effect: "+5% Elemental Damage (Global)", isGlobal: true }
    ]
  },
  { 
    id: 'gugu', name: 'Gugu', tier: 'S', category: 'Hero', globalBonus120: '+5% Max HP', 
    desc: 'Owl guardian.', deepLogic: 'Birds provide 30% damage reduction shields.', 
    bestPairs: ['Bull Ring'], shardCost: '50 Shards to unlock (Clan Shop / Clan Points)', 
    assistHeroes: ['Helix', 'Meowgik', 'Onir'],
    starMilestones: [
      { stars: 7, effect: "+10% Projectile Resistance (Global)", isGlobal: true }
    ]
  },
  { 
    id: 'shade', name: 'Shade', tier: 'S', category: 'Hero', globalBonus120: '+5% Attack', 
    desc: 'The shadow assassin.', deepLogic: 'Shadow form grants +75% Attack Speed.', 
    bestPairs: ['Demon Blade'], shardCost: '50 Shards to unlock (Soulstone Shop / $14.99)', 
    assistHeroes: ['Lina', 'Sylvan', 'Ophelia'],
    starMilestones: [
      { stars: 7, effect: "+5% Attack (Global)", isGlobal: true }
    ]
  },
  { 
    id: 'sylvan', name: 'Sylvan', tier: 'S', category: 'Hero', globalBonus120: '+5% Elemental Damage', 
    desc: 'Elf prince.', deepLogic: 'Removes elemental skills from RNG pool.', 
    bestPairs: ['Brightspear'], shardCost: '50 Shards to unlock (Soulstone Shop / $12.99)', 
    assistHeroes: ['Lina', 'Shade', 'Rolla'],
    starMilestones: [
      { stars: 7, effect: "+5% Elemental Damage (Global)", isGlobal: true }
    ]
  },
  { 
    id: 'helix', name: 'Helix', tier: 'S', category: 'Hero', globalBonus120: '+5% Attack', 
    desc: 'The OG Fury king.', deepLogic: 'Damage increases as HP drops. Highest stability.', 
    bestPairs: ['Demon Blade'], bio: 'The son of a legendary warrior who draws power from his wounds.', 
    shardCost: '30 Shards to unlock (1,500 Gems / Soulstones)', assistHeroes: ['Gugu', 'Meowgik', 'Onir'],
    starMilestones: [
      { stars: 3, effect: "Fury effect starts at 100% HP." },
      { stars: 7, effect: "+15% Critical Damage (Global)", isGlobal: true }
    ]
  },
  { 
    id: 'meowgik', name: 'Meowgik', tier: 'A', category: 'Hero', globalBonus120: '+5% Attack', 
    desc: 'The kitten mage.', deepLogic: 'Spawns homing kittens that ignore walls.', 
    bestPairs: ['Brightspear'], shardCost: '30 Shards to unlock (1,800 Gems / Soulstones)', 
    assistHeroes: ['Helix', 'Gugu', 'Ayana'],
    starMilestones: [
      { stars: 3, effect: "Kittens travel faster and deal splash damage." },
      { stars: 7, effect: "+5% Attack (Global)", isGlobal: true }
    ]
  },
  { 
    id: 'ayana', name: 'Ayana', tier: 'A', category: 'Hero', globalBonus120: '+5% Attack', 
    desc: 'Enchanted witch.', deepLogic: 'Portals provide temporary i-frames during travel.', 
    bestPairs: ['Phantom Cloak'], shardCost: '30 Shards to unlock (2,500 Gems / Soulstones)', 
    assistHeroes: ['Meowgik', 'Ophelia', 'Rolla'],
    starMilestones: [
      { stars: 7, effect: "+5% Attack (Global)", isGlobal: true }
    ]
  },
  { 
    id: 'ophelia', name: 'Ophelia', tier: 'A', category: 'Hero', globalBonus120: '+5% Attack', 
    desc: 'Spirit hunter.', deepLogic: 'Soul shards provide varying elemental buffs.', 
    bestPairs: ['Demon Blade'], shardCost: '50 Shards to unlock (Soulstone Shop / $9.99)', 
    assistHeroes: ['Shade', 'Lina', 'Ayana'],
    starMilestones: [
      { stars: 7, effect: "+5% Attack (Global)", isGlobal: true }
    ]
  },
  { 
    id: 'onir', name: 'Onir', tier: 'A', category: 'Hero', globalBonus120: '+10% Projectile Resistance', 
    desc: 'Holy knight.', deepLogic: 'Best used for 10% Global Projectile Resistance at 7-stars.', 
    uniqueEffect: 'Global Proj Resist (7-Star)', shardCost: '50 Shards to unlock (Soulstone Shop / $9.99)', 
    assistHeroes: ['Atreus', 'Helix', 'Phoren'],
    starMilestones: [
      { stars: 7, effect: "+10% Projectile Resistance (Global)", isGlobal: true }
    ]
  },
  { 
    id: 'rolla', name: 'Rolla', tier: 'B', category: 'Hero', globalBonus120: '+5% Attack', 
    desc: 'Ice goddess.', deepLogic: 'Freezes enemies for longer than standard frozen effect.', 
    bestPairs: ['Death Scythe'], shardCost: '30 Shards to unlock (3,000 Gems / $9.99)', 
    assistHeroes: ['Sylvan', 'Ayana', 'Meowgik'],
    starMilestones: [
      { stars: 7, effect: "+5% Attack (Global)", isGlobal: true }
    ]
  },
  { 
    id: 'taranis', name: 'Taranis', tier: 'B', category: 'Hero', globalBonus120: '+5% Attack', 
    desc: 'Thunder master.', deepLogic: 'Lightning arcs deal 35% splash damage.', 
    bestPairs: ['Tornado'], shardCost: '30 Shards to unlock (1,000 Gems / $4.99)', 
    assistHeroes: ['Atreus', 'Urasil', 'Phoren'],
    starMilestones: [
      { stars: 7, effect: "+5% Attack (Global)", isGlobal: true }
    ]
  },
  { 
    id: 'phoren', name: 'Phoren', tier: 'C', category: 'Hero', globalBonus120: '+5% Attack', 
    desc: 'Fire master.', deepLogic: 'Burn damage lasts twice as long.', 
    bestPairs: ['Saw Blade'], shardCost: '30 Shards to unlock (50,000 Gold / Chapter 7)', 
    assistHeroes: ['Atreus', 'Taranis', 'Urasil'],
    starMilestones: [
      { stars: 7, effect: "+5% Attack (Global)", isGlobal: true }
    ]
  },
  { 
    id: 'atreus', name: 'Atreus', tier: 'C', category: 'Hero', globalBonus120: '+7% Projectile Resistance', 
    desc: 'The rookie.', deepLogic: 'Mandatory L80/L120 for Immunity Build.', uniqueEffect: 'Immunity Key', 
    bio: 'The hero who started it all.', shardCost: 'Starter Hero (Unlock via Chapter 1)', 
    assistHeroes: ['Helix', 'Phoren', 'Urasil'],
    starMilestones: [
      { stars: 7, effect: "+10% Max HP (Global)", isGlobal: true }
    ]
  },
  { 
    id: 'uruana', name: 'Urasil', tier: 'F', category: 'Hero', globalBonus120: '+5% Attack', 
    desc: 'Poison master.', deepLogic: 'Poison damage scales poorly in late game.', 
    bestPairs: ['Tornado'], shardCost: '30 Shards to unlock (10,000 Gold / Chapter 2)', 
    assistHeroes: ['Atreus', 'Phoren', 'Taranis'],
    starMilestones: [
      { stars: 7, effect: "+5% Attack (Global)", isGlobal: true }
    ]
  }
];

export const GEAR_DATA: BaseItem[] = [
  // --- WEAPONS ---
  { 
    id: 'exp_fist', name: 'Expedition Fist', tier: 'SSS', category: 'Weapon', desc: 'Hybrid Gauntlets.', 
    mythicPerk: 'Titan: Weapon Dmg +15% (Final Multiplier).', 
    deepLogic: 'Primary Melee/Ranged hybrid. High-speed punch combo system: the final hit triggers a "Roar" shockwave for massive AoE damage. Stacks a hidden "Combo" count on hit that increases Critical Chance. IMPORTANT: This weapon does NOT provide healing; healing in Expedition builds is derived from the "Expedition Plate" (Armor) resonance effect.' 
  },
  { 
    id: 'celestial_hammer', name: 'Celestial Hammer', tier: 'SSS', category: 'Weapon', desc: 'Lightning Maul.', 
    mythicPerk: 'Titan: Perpetual Charge.', 
    deepLogic: 'Switching to Lightning Form (Charge full) makes projectiles pierce all obstacles. While in lightning form, attack speed is capped but damage is tripled. Pairs with Celestial Warplate for 100% mana sustain.' 
  },
  { id: 'ant_sword', name: 'Antiquated Sword', tier: 'SS', category: 'Weapon', desc: 'Greatsword.', mythicPerk: 'Titan: Whirlwind Reflects 30% Dmg.', deepLogic: 'Broadsword has hidden +40% Dmg vs Bosses.' },
  { id: 'demon_blade', name: 'Demon Blade', tier: 'SS', category: 'Weapon', desc: 'Katana.', mythicPerk: 'Titan: Shadows inherit 100% Element.', deepLogic: 'Melee hits deal 1.8x damage. Do NOT take Front Arrow.' },
  { id: 'stalker_staff', name: 'Stalker Staff', tier: 'S', category: 'Weapon', desc: 'Staff.', mythicPerk: 'Titan: +15% Flight Speed.', deepLogic: 'Best for Bosses. Stack Diagonal Arrows.' },
  { id: 'brightspear', name: 'Brightspear', tier: 'A', category: 'Weapon', desc: 'Laser.', mythicPerk: 'Titan: Beam splits to 2 targets.', deepLogic: 'Projectile travel time is near-zero. Best for farming fast-moving mobs or long-range sniping in wave chapters.' },
  { id: 'death_scythe', name: 'Death Scythe', tier: 'A', category: 'Weapon', desc: 'Scythe.', mythicPerk: 'Titan: Execute threshold <35% HP.', deepLogic: 'High knockback value helps with crowd control. The execution perk makes it a top-tier choice for high-HP mobs in late-game chapters.' },
  { id: 'tornado', name: 'Tornado', tier: 'A', category: 'Weapon', desc: 'Boomerang. Built-in Pierce and Ricochet.', deepLogic: 'Built-in Pierce and Return. Return hits deal 50% extra damage. Recommendation: Avoid Ricochet and Pierce skills as they reduce return damage.' },
  { id: 'gale_force', name: 'Gale Force', tier: 'B', category: 'Weapon', desc: 'Crossbow. Charged Shot.', deepLogic: 'High base damage but slow reload. The charged shot bypasses standard armor and deals massive crit damage.' },
  { id: 'saw_blade', name: 'Saw Blade', tier: 'C', category: 'Weapon', desc: 'Dagger. Fastest Attack Speed.', deepLogic: 'Entering a room provides a 3-second attack speed boost. Best used with "Freeze" or "Headshot" builds to maximize hit frequency.' },
  { id: 'brave_bow', name: 'Brave Bow', tier: 'C', category: 'Weapon', desc: 'Bow.', mythicPerk: 'Titan: High Crit Synergy.', deepLogic: 'The most balanced weapon. Scales exceptionally well with Critical Damage buffs and stays viable through early-mid game.' },
  { id: 'mini_atreus', name: 'Mini Atreus', tier: 'D', category: 'Weapon', desc: 'Meme Weapon. Just for fun.', deepLogic: 'Shoots random projectiles (Arrow, Scythe, etc). Not recommended for serious pushes.' },

  // --- ARMOR ---
  { id: 'c_warplate', name: 'Celestial Warplate', tier: 'SSS', category: 'Armor', desc: 'Lightning Plate.', mythicPerk: 'Titan: Collision Resist +20%.', deepLogic: 'Converts dmg to Heavenly Energy. Best for wave chapters.' },
  { id: 'exp_plate', name: 'Expedition Plate', tier: 'SSS', category: 'Armor', desc: 'Heart Plate.', mythicPerk: 'Titan: Heart Drop +20%.', deepLogic: 'The core of Expedition sustain. Picking up hearts grants an Invincibility Shield and triggers Divine Grace healing.' },
  { id: 'p_cloak', name: 'Phantom Cloak', tier: 'SS', category: 'Armor', desc: 'Ice Cloak.', mythicPerk: 'Titan: Freeze +2.5s. Frozen enemies take +30% Dmg.', deepLogic: 'Meta for Boss chapters.' },
  { id: 'bright_robe', name: 'Bright Robe', tier: 'A', category: 'Armor', desc: 'Front Dmg Resistance + XP Boost.', deepLogic: 'The level-up speed bonus is critical for Infinite Adventure and long wave chapters to reach level 10-11 faster.' },
  { id: 'shadow_robe', name: 'Shadow Robe', tier: 'A', category: 'Armor', desc: 'Deals Dark damage to nearby enemies.', deepLogic: 'Dark AoE damage scales with Hero Attack. Extremely effective in cramped wave rooms with high enemy density.' },
  { id: 'void_robe', name: 'Void Robe', tier: 'B', category: 'Armor', desc: 'Poisons all enemies in room.', deepLogic: 'Applies permanent poison to every enemy on room entry. Best for long, slow-paced wave chapters where poison can tick down high HP.' },
  { id: 'vest_dex', name: 'Vest of Dexterity', tier: 'B', category: 'Armor', desc: 'Dodge Logic.', deepLogic: '+7% Global Dodge. Essential for "Full Dodge" niche builds when paired with Serpent Rings.' },
  { id: 'golden_chest', name: 'Golden Chestplate', tier: 'C', category: 'Armor', desc: 'Flame Chest.', mythicPerk: 'Titan: 5% Dmg Reduction.', deepLogic: 'Flat 5% damage reduction from all sources. Stacks additively with Bull Rings for ultra-tanky setups.' },

  // --- RINGS ---
  { id: 'dragon_ring', name: 'Dragon Ring', tier: 'SS', category: 'Ring', desc: 'Proj Resist.', mythicPerk: 'Titan: Proj Resist +13.8%.', deepLogic: 'Essential for Immunity Build. Stacks additively.' },
  { id: 'celestial_ring', name: 'Celestial Band', tier: 'SS', category: 'Ring', desc: 'Lightning Ring.', mythicPerk: 'Titan: Collision Resist +15%.', deepLogic: 'Chain Lightning scales with S-Locket.' },
  { id: 'bull_ring', name: 'Bull Ring', tier: 'S', category: 'Ring', desc: 'Tank Ring.', mythicPerk: 'Titan: Dmg Resist +10%.', deepLogic: 'Best for farming Gold. DR applies after Proj Resist.' },
  { id: 'lion_ring', name: 'Lion Ring', tier: 'S', category: 'Ring', desc: 'Boss Ring.', mythicPerk: 'Titan: Crit Dmg +20%.', deepLogic: 'Pure DPS. Mandatory for Boss Chapters.' },
  { id: 'vilebat_ring', name: 'Vilebat Ring', tier: 'A', category: 'Ring', desc: 'Heal on Kill.', deepLogic: 'Restores a small % of HP per kill. Effectively doubles the yield of "Heal on Kill" skills.' },
  { id: 'wolf_ring', name: 'Wolf Ring', tier: 'B', category: 'Ring', desc: 'Melee Crit Chance.', deepLogic: 'Provides 5% Crit Chance. Useful for Melee-focused heroes like Melinda or Shingen.' },
  { id: 'userpent_ring', name: 'Serpent Ring', tier: 'B', category: 'Ring', desc: 'Dodge Chance +7%.', deepLogic: 'Core ring for Dodge builds. Also provides +10% Damage to Ranged units.' },
  { id: 'falcon_ring', name: 'Falcon Ring', tier: 'C', category: 'Ring', desc: 'Attack Speed +5%.', deepLogic: 'Pure attack speed buff. Recommended for slow weapons like Death Scythe.' },
  { id: 'bear_ring', name: 'Bear Ring', tier: 'C', category: 'Ring', desc: 'HP + Ground Dmg.', deepLogic: 'Increases Max HP by 5%. Best used in early-game for general survivability.' },

  // --- BRACELETS ---
  { id: 'celestial_bracer', name: 'Celestial Bracer', tier: 'SS', category: 'Bracelet', desc: 'Lightning.', mythicPerk: 'Titan: Lightning Dmg +20%.' },
  { id: 'shield_bracer', name: 'Shield Bracelet', tier: 'SS', category: 'Bracelet', desc: 'Shield.', mythicPerk: 'Titan: Atk +12%.' },
  { id: 'invincible', name: 'Invincible Bracelet', tier: 'S', category: 'Bracelet', desc: 'Invincibility.', deepLogic: '2.5s God Mode on room entry.' },
  { id: 'quickshot', name: 'Quickshot Bracelet', tier: 'A', category: 'Bracelet', desc: 'Multishot.', deepLogic: 'Entering a room gives a 2-second boost to Attack and speed. Essential for high-burst room clears.' },
  { id: 'thunder_bracer', name: 'Thunder Bracelet', tier: 'B', category: 'Bracelet', desc: 'Zap.', deepLogic: 'Deals random lightning damage to enemies on room entry. Damage scales with character level.' },
  { id: 'frozen_bracer', name: 'Frozen Bracelet', tier: 'B', category: 'Bracelet', desc: 'Freeze.', deepLogic: 'Freezes random enemies for 2.5s on room entry. Useful for preventing immediate damage in high-density rooms.' },
  { id: 'blazing_bracer', name: 'Blazing Bracelet', tier: 'C', category: 'Bracelet', desc: 'Fire.', deepLogic: 'Ignites random enemies on room entry. Burn damage is flat and scales poorly in late game.' },
  { id: 'split_bracer', name: 'Split Bracelet', tier: 'C', category: 'Bracelet', desc: 'Clones.', deepLogic: 'Spawns 2 temporary clones on room entry. Clones deal minimal damage but can take aggro.' },

  // --- LOCKETS ---
  { id: 'bulletproof', name: 'Bulletproof Locket', tier: 'SS', category: 'Locket', desc: 'Proj Tank.', mythicPerk: 'Titan: +15% Proj Resist (<25% HP).', deepLogic: 'Key to 100% Immunity.' },
  { id: 'celestial_talisman', name: 'Celestial Talisman', tier: 'SS', category: 'Locket', desc: 'MP Gen.', deepLogic: 'Best for Mana-hungry heroes.' },
  { id: 'exp_locket', name: 'Expedition Locket', tier: 'S', category: 'Locket', desc: 'Revive.', mythicPerk: 'Titan: Atk +25% after heal.' },
  { id: 'angel', name: 'Angel Locket', tier: 'A', category: 'Locket', desc: 'Revive Chance.', deepLogic: 'Gives a chance to revive with 25% HP upon lethal damage. Reliability increases with rarity.' },
  { id: 'bloodthirsty', name: 'Bloodthirsty Locket', tier: 'A', category: 'Locket', desc: 'Lifesteal.', deepLogic: 'Provides a small percentage of Lifesteal when HP is below 20%. Niche survivability tool.' },
  { id: 'agile', name: 'Agile Locket', tier: 'B', category: 'Locket', desc: 'Dodge.', deepLogic: 'Increases Dodge rate significantly when HP falls below 20%.' },
  { id: 'counterattack', name: 'Counterattack Charm', tier: 'C', category: 'Locket', desc: 'Reflect.', deepLogic: 'Reflect a portion of taken damage back to the attacker. Generally weak due to high enemy HP pools.' },
  { id: 'iron', name: 'Iron Locket', tier: 'C', category: 'Locket', desc: 'Collision.', deepLogic: 'Reduces collision damage when HP is low. Use only for collision-heavy chapters.' },
  { id: 'piercer', name: 'Piercer Locket', tier: 'C', category: 'Locket', desc: 'Wall Pass.', deepLogic: 'Grants the ability to pass through walls for 3 seconds when HP is low.' },

  // --- BOOKS ---
  { id: 'enlightenment', name: 'Enlightenment', tier: 'SS', category: 'Book', desc: 'Skills.', mythicPerk: 'Titan: Dmg Resist +5%.', deepLogic: 'Best for Infinite Adventure. Breaks RNG limit.' },
  { id: 'arcanum', name: 'Arcanum of Time', tier: 'SS', category: 'Book', desc: 'Time Stop.', mythicPerk: 'Titan: Duration +1s.', deepLogic: 'Freezes projectiles. Ultimate defense.' },
  { id: 'giant', name: 'Giants Contract', tier: 'S', category: 'Book', desc: 'Melee.', deepLogic: 'Synergy King with Demon Blade/Fist.' },
  { id: 'art_combat', name: 'Art of Combat', tier: 'A', category: 'Book', desc: 'Knockback.', deepLogic: 'Passive increases knockback force. Active provides a huge DPS boost through attack speed.' },
  { id: 'arcane_archer', name: 'Arcane Archer', tier: 'A', category: 'Book', desc: 'Arrows.', mythicPerk: 'Titan: Duration +1s.', deepLogic: 'Best for boss rushing. Adds additional Front Arrows during activation.' },
  { id: 'ice_realm', name: 'Ice Realm', tier: 'B', category: 'Book', desc: 'Freeze.', deepLogic: 'Freezes all nearby enemies on activation and increases hero damage.' },
  { id: 'spectre', name: 'Spectre Book', tier: 'C', category: 'Book', desc: 'Summons.', deepLogic: 'Summons shadow minions to fight for you. Damage is relatively low in the current meta.' },
  { id: 'mystery_time', name: 'Time of Mysteries', tier: 'C', category: 'Book', desc: 'Ultimate CDR & Healing.', deepLogic: 'Focuses on reducing Ultimate skill cooldown and provides minor healing over time.' },

  // --- SPIRITS ---
  { id: 'laser_bat', name: 'Laser Bat', tier: 'A', category: 'Spirit', desc: 'Wall Pierce.', deepLogic: 'Laser attacks penetrate all obstacles. Best for applying elemental debuffs safely from behind walls.' },
  { id: 'noisy_owl', name: 'Noisy Owl', tier: 'A', category: 'Spirit', desc: 'Knockback.', deepLogic: 'High knockback value. Useful for ranged kite builds, but can disrupt melee combos.' },
  { id: 'flaming_ghost', name: 'Flaming Ghost', tier: 'B', category: 'Spirit', desc: 'Pierce.', deepLogic: 'Inherits Fire damage. Projectiles pierce 1 target. Good for applying Burn to multiple enemies.' },
  { id: 'scythe_mage', name: 'Scythe Mage', tier: 'C', category: 'Spirit', desc: 'Bounce.', deepLogic: 'Inherits high knockback from the Hero. Excellent for keeping melee enemies away from the Hero in narrow rooms.' },
  { id: 'elf', name: 'Elf', tier: 'C', category: 'Spirit', desc: 'Fast Atk.', deepLogic: 'Fastest attack speed among spirits. Best utilized for applying frequent "On Hit" elemental debuffs.' },
  { id: 'living_bomb', name: 'Living Bomb', tier: 'D', category: 'Spirit', desc: 'Useless.', deepLogic: 'AoE explosions can hit multiple enemies but travel speed is extremely low. Useful in narrow corridors.' },
  { id: 'bone_warrior', name: 'Bone Warrior', tier: 'A', category: 'Spirit', desc: 'Melee Tank & Aggro', deepLogic: 'Inherits Hero aggro. Can draw fire from Elite mobs in Wave chapters. High HP scaling.' },

  // --- PETS (New Ground Units) ---
  { id: 'frothy', name: 'Frothy Capy', tier: 'SS', category: 'Pet', desc: 'Immunity Bubble.', deepLogic: 'Bubble = 100% Immunity.' },
  { id: 'unicorn', name: 'Empyrean Unicorn', tier: 'SS', category: 'Pet', desc: 'Block %.', deepLogic: 'Provides a percentage chance to completely block incoming damage instances.' },
  { id: 'blitzbeak', name: 'Furious Blitzbeak', tier: 'S', category: 'Pet', desc: 'Lightning.', deepLogic: 'Periodic chain lightning attacks that stun enemies for 0.5s.' },

  // --- TOTEMS ---
  { id: 'totem_atk', name: 'Attack Totem', tier: 'SS', category: 'Totem', desc: 'Boosts Attack stats.' },
  { id: 'totem_hp', name: 'HP Totem', tier: 'S', category: 'Totem', desc: 'Boosts Max HP.' },
  { id: 'totem_hero', name: 'Hero Totem', tier: 'S', category: 'Totem', desc: 'Boosts Hero-specific stats (e.g., Crit, Elemental Dmg).' },
  { id: 'totem_equip', name: 'Equipment Totem', tier: 'A', category: 'Totem', desc: 'Boosts base stats of Weapons/Armor.' },
  { id: 'totem_relic', name: 'Relic Totem', tier: 'S', category: 'Totem', desc: 'Unlocks at higher chapters (N80+). Boosts Relic stats.' },
  { id: 'totem_dragon', name: 'Dragon Totem', tier: 'S', category: 'Totem', desc: 'Unlocks at higher chapters (N100+). Boosts Dragon stats.' },
  { id: 'totem_jewel', name: 'Jewel Totem', tier: 'A', category: 'Totem', desc: 'Boosts Jewel stats (often grouped with Equipment).' },
  { id: 'totem_def', name: 'Defense Totem', tier: 'SS', category: 'Totem', desc: 'Boosts Damage Resistance / Defense (Rare).' },

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
  { id: 'ruby', name: 'Ruby', color: 'Red', statType: 'Attack', baseStat: 15, statPerLevel: 35, slots: ['Weapon', 'Ring', 'Bracelet'], lore: 'Crystallized essence of raw destructive power.' },
  { id: 'lapis', name: 'Lapis', color: 'Blue', statType: 'Max HP', baseStat: 80, statPerLevel: 145, slots: ['Armor', 'Locket'], lore: 'Deep azure gem carrying standard vitality.' },
  { id: 'emerald', name: 'Emerald', color: 'Green', statType: 'Attack Speed', baseStat: 0.5, statPerLevel: 1.2, slots: ['Weapon', 'Ring'], lore: 'Verdant mineral focused on swift execution.' },
  { id: 'topaz', name: 'Topaz', color: 'Yellow', statType: 'Crit Damage', baseStat: 1, statPerLevel: 2.5, slots: ['Bracelet', 'Ring'], lore: 'Solar-charged stone enhancing critical impact.' },
  { id: 'amethyst', name: 'Amethyst', color: 'Purple', statType: 'Crit Chance', baseStat: 0.2, statPerLevel: 0.6, slots: ['Weapon', 'Bracelet'], lore: 'Mystical quartz improving tactical focus.' },
  { id: 'kunzite', name: 'Kunzite', color: 'Teal', statType: 'Dmg to Elites/Bosses', baseStat: 12, statPerLevel: 28, slots: ['Armor', 'Book'], lore: 'Slayer\'s choice for high-priority targets.' }
];

export const RELIC_DATA: Relic[] = [
  // --- HOLY RELICS (Pink/Red - SS Tier) ---
  { id: 'spear_yggdrasil', name: 'Spear of Yggdrasil', tier: 'Holy', effect: 'Attack +% & Attack Speed +%', lore: 'The ultimate offensive relic. Boosts both raw damage and how fast you hit.', source: 'Relic Chest / Events', iconType: 'Arrow' },
  { id: 'bloodstained_sword', name: 'Bloodstained Sword', tier: 'Holy', effect: 'Attack +% & Crit Rate +%', lore: 'Best for Critical Hit builds. Often mistranslated as "Cursed Sword."', source: 'Relic Chest / Events', iconType: 'Sword' },
  { id: 'starcluster_rage', name: 'Starcluster Rage', tier: 'Holy', effect: 'Crit Damage +%', lore: 'Massive boost to critical hit damage. Essential for "Big Number" builds.', source: 'Relic Chest / Events', iconType: 'Gem' },
  { id: 'demon_king_eye', name: "Demon King's Eye", tier: 'Holy', effect: 'Projectile Resistance +% & Dark Damage +%', lore: 'Mandatory for the endgame "Immunity Build" to reduce incoming damage.', source: 'Relic Chest / Events', iconType: 'Eye' },
  { id: 'gilded_medal', name: 'Gilded Medal', tier: 'Holy', effect: 'Max HP +% & Damage Resistance +%', lore: 'The best defensive relic in the game. Pure tank stats.', source: 'Relic Chest / Events', iconType: 'Gem' },
  { id: 'dragon_gem', name: 'Dragon Gem', tier: 'Holy', effect: 'All Elemental Damage +%', lore: 'Boosts Fire, Ice, Poison, and Lightning damage globally.', source: 'Relic Chest / Events', iconType: 'Gem' },
  { id: 'radiant_heart', name: 'Radiant Heart', tier: 'Holy', effect: 'Healing Effect +% & HP Drop Rate +%', lore: 'A pulsing heart of pure light that revitalizes the weary.', source: 'Relic Chest / Events', iconType: 'Cup' },
  { id: 'ring_dragon', name: 'Ring of the Dragon', tier: 'Holy', effect: 'Crit Chance +% & Dragon Dmg +%', lore: 'Forged in dragonfire, it grants the ferocity of the beasts.', source: 'Relic Chest / Events', iconType: 'Gem' },
  { id: 'sword_brave', name: 'Sword of the Brave', tier: 'Holy', effect: 'Attack +% & Boss Dmg +%', lore: 'A legendary blade said to have slain a thousand tyrants.', source: 'Relic Chest / Events', iconType: 'Sword' },

  // --- RADIANT RELICS (Yellow/Gold - S Tier) ---
  { id: 'golden_apple', name: 'Golden Apple', tier: 'Radiant', effect: 'Max HP +% & Healing Effect +%', lore: 'Makes Red Hearts heal for more. Great for survival.', source: 'Chapters / Chests', iconType: 'Cup' },
  { id: 'mirror_truth', name: 'Mirror of Truth', tier: 'Radiant', effect: 'Crit Chance +% & Accuracy', lore: 'Helps hit enemies that have high dodge rates.', source: 'Chapters / Chests', iconType: 'Mirror' },
  { id: 'ancient_map', name: 'Ancient Map', tier: 'Radiant', effect: 'Movement Speed +% & Trap Resistance', lore: 'Reduces damage from spikes/saws and makes you move faster.', source: 'Expedition', iconType: 'Map' },
  { id: 'hero_cape', name: "Hero's Cape", tier: 'Radiant', effect: 'Damage Resistance +%', lore: 'General damage reduction. Good all-rounder for defense.', source: 'Chapters / Chests', iconType: 'Shield' },
  { id: 'pharaoh_scepter', name: "Pharaoh's Scepter", tier: 'Radiant', effect: 'Crit Chance +% & Skill Damage +%', lore: 'Boosts damage from abilities (like Meteors/Stars).', source: 'Chapters / Chests', iconType: 'Sword' },
  { id: 'prometheus_fire', name: "Prometheus's Fire", tier: 'Radiant', effect: 'Attack + (Flat) & Fire Damage +%', lore: 'Specifically buffs Fire damage (good for Phoren/Lina).', source: 'Tower Defense', iconType: 'Gem' },
  { id: 'golden_bunny', name: 'Golden Bunny', tier: 'Radiant', effect: 'Attack +5% (at 4★)', lore: 'Event Exclusive. Highly sought after for its massive raw Attack boost.', source: 'Special Events Only', iconType: 'Dog' },
  { id: 'fabled_arrow', name: 'Fabled Arrow', tier: 'Radiant', effect: 'Attack +3-5% (Gem Spend)', lore: 'A legendary arrow that pierces through time. Resonance with Smiling Mask.', source: 'Gem Spending Events', iconType: 'Arrow' },
  { id: 'smiling_mask', name: 'Smiling Mask', tier: 'Radiant', effect: 'Damage to Mobs +%', lore: 'A mysterious mask that seems to mock your enemies. Completes the set with Fabled Arrow.', source: 'Relic Chest / Events', iconType: 'Eye' },
  { id: 'prophets_crystal', name: "Prophet's Crystal", tier: 'Radiant', effect: 'Spellbook Mana Speed +%', lore: 'Gazes into the future to hasten your magical recovery.', source: 'Chapters / Chests', iconType: 'Gem' },

  // --- FAINT RELICS (Blue/Purple - A/B Tier) ---
  { id: 'broken_sword', name: 'Broken Sword', tier: 'Faint', effect: 'Flat Attack +', lore: 'A simple, raw number boost to your Attack stat.', source: 'Common Drops', iconType: 'Sword' },
  { id: 'rusty_key', name: 'Rusty Key', tier: 'Faint', effect: 'Gold Drop Rate +%', lore: 'Essential for farming runs (Up-Close Dangers).', source: 'Common Drops', iconType: 'Gem' },
  { id: 'dusty_tome', name: 'Dusty Tome', tier: 'Faint', effect: 'Scroll Drop Rate +%', lore: 'Helps you find more upgrade scrolls for your equipment.', source: 'Common Drops', iconType: 'Book' },
  { id: 'lost_cross', name: 'Lost Cross', tier: 'Faint', effect: 'Flat HP +', lore: 'A simple, raw number boost to your HP.', source: 'Common Drops', iconType: 'Shield' },
  { id: 'strange_stone', name: 'Strange Stone', tier: 'Faint', effect: 'Flat Damage Resistance', lore: 'Reduces damage by a flat amount (e.g., -50).', source: 'Common Drops', iconType: 'Gem' },
  { id: 'magic_lamp', name: 'Magic Lamp', tier: 'Faint', effect: 'Ground Dmg Reduction +%', lore: 'Reduces damage taken from ground traps and melee units.', source: 'Common Drops', iconType: 'Cup' },
  { id: 'magic_carpet', name: 'Magic Carpet', tier: 'Faint', effect: 'Gold in Cave +% & HP +%', lore: 'A flying carpet that brings fortune in hidden places.', source: 'Common Drops', iconType: 'Scroll' },
  { id: 'poison_apple', name: 'Poison Apple', tier: 'Faint', effect: 'Movement Speed +%', lore: 'A deceptive fruit that quickens the step.', source: 'Common Drops', iconType: 'Cup' },
  { id: 'laurel_wreath', name: 'Laurel Wreath', tier: 'Faint', effect: 'Dmg Reduce vs Elite +%', lore: 'A symbol of victory that protects against strong foes.', source: 'Common Drops', iconType: 'Shield' },
  { id: 'four_leaf', name: 'Four-Leaf Clover', tier: 'Faint', effect: 'Dmg Reduce vs Minion +%', lore: 'Lucky charm that wards off the swarm.', source: 'Common Drops', iconType: 'Gem' },
  { id: 'crystal_shoe', name: 'Crystal Shoe', tier: 'Faint', effect: 'Dmg Reduce vs Boss +%', lore: 'Fragile but protects against the hardest hits.', source: 'Common Drops', iconType: 'Arrow' },
  { id: 'red_hood', name: 'Red Hood', tier: 'Faint', effect: 'Dmg Reduce vs Airborne +%', lore: 'Protects against threats from above.', source: 'Common Drops', iconType: 'Shield' },
  { id: 'arcane_crystal', name: 'Arcane Crystal', tier: 'Faint', effect: 'Flat HP & MP Recovery', lore: 'A faint glowing stone that restores vitality.', source: 'Common Drops', iconType: 'Gem' }
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
- Expedition Logic: The S-Tier Fist is a pure DPS weapon with no built-in healing. Sustain comes solely from the S-Tier Plate resonance.
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

export const JEWEL_SLOT_BONUSES: Record<string, SlotBonus[]> = {
  'Weapon': [
    { level: 16, effect: 'Attack +3%' },
    { level: 28, effect: 'Damage to Air Units +10%' },
    { level: 33, effect: 'Attack +5%' },
    { level: 38, effect: 'Final Attack +5%' }
  ],
  'Armor': [
    { level: 16, effect: 'Max HP +3%' },
    { level: 28, effect: 'Damage Resistance +2%' },
    { level: 33, effect: 'Max HP +5%' },
    { level: 38, effect: 'Damage Resistance +5%' }
  ],
  'Ring': [
    { level: 16, effect: 'Gold Drop +5%' },
    { level: 28, effect: 'Critical Chance +2%' },
    { level: 33, effect: 'Gold Drop +10%' },
    { level: 38, effect: 'Critical Chance +5%' }
  ],
  'Bracelet': [
    { level: 16, effect: 'Attack +2%' },
    { level: 28, effect: 'Critical Damage +10%' },
    { level: 33, effect: 'Attack +4%' },
    { level: 38, effect: 'Critical Damage +15%' }
  ],
  'Locket': [
    { level: 16, effect: 'Healing +5%' },
    { level: 28, effect: 'Max HP +3%' },
    { level: 33, effect: 'Healing +10%' },
    { level: 38, effect: 'Max HP +6%' }
  ],
  'Book': [
    { level: 16, effect: 'Mana Regeneration +5%' },
    { level: 28, effect: 'Skill Damage +5%' },
    { level: 33, effect: 'Mana Regeneration +10%' },
    { level: 38, effect: 'Spellbook Effect +10%' }
  ]
};

export const DAILY_EVENTS: ArcheroEvent[] = [
  {
    id: 'ucd',
    name: 'Up-Close Dangers',
    days: ['Monday', 'Wednesday', 'Friday', 'Sunday'],
    rewards: ['Massive Gold', 'High Exp'],
    desc: 'The best source for gold. Melee enemies rush you at high speed.',
    proTip: 'Equip 2x Bull Rings for gold bonus. Prioritize "Greed" and "Richochet" to keep mobs at bay.',
    color: 'orange'
  },
  {
    id: 'fb',
    name: 'Flying Bullets',
    days: ['Tuesday', 'Thursday', 'Saturday', 'Sunday'],
    rewards: ['Gear Drops', 'Scrolls'],
    desc: 'Focuses on gear drops. Many ranged enemies spamming projectiles.',
    proTip: 'Dodge focus is key. Phantom Cloak and Bulletproof Locket help survive high-density bullet rooms.',
    color: 'blue'
  },
  {
    id: 'maze',
    name: 'Ancient Maze',
    days: ['Monday', 'Wednesday', 'Friday', 'Sunday'],
    rewards: ['Soulstones', 'Hero Shards'],
    desc: 'Deep maze with varying difficulty levels. Soulstones are traded for Hero Shards.',
    proTip: 'Choose the Orange (hardest) path for maximum Soulstone yield. Meowgik is excellent here for safe wall-peeking.',
    color: 'purple'
  },
  {
    id: 'mine',
    name: 'Mystery Mine',
    days: ['Tuesday', 'Thursday', 'Saturday', 'Sunday'],
    rewards: ['Jewels', 'Equipment'],
    desc: 'Choose your own modifiers for better loot. Primary source for late-game jewels.',
    proTip: 'Don\'t over-greed on difficulty modifiers. Focus on "Jewel Drop Chance" above all else.',
    color: 'teal'
  },
  {
    id: 'duo',
    name: 'Hero Duo',
    days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    rewards: ['Gems', 'Gold Keys', 'Honor Stones'],
    desc: 'Co-op mode with another player. Pure skill-based as gear stats are equalized.',
    proTip: 'Communicate with your partner (emotes). Staying alive is better than rushing damage.',
    color: 'red'
  },
  {
    id: 'arena',
    name: 'Monster Arena',
    days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    rewards: ['Monster Eggs', 'Pet Training Material'],
    desc: 'PVP-style pet battles. Build your monster team to defend and attack.',
    proTip: 'Check the current Season Meta monsters. High-tier eggs yield stronger arena units.',
    color: 'green'
  },
  {
    id: 'ia',
    name: 'Infinite Adventure',
    days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    rewards: ['Rare Scrolls', 'Jewels', 'Relics'],
    desc: 'Push as far as you can. Reset every 14 days.',
    proTip: 'Enlightenment Book is mandatory. Focus on Damage Resistance over time as mobs scale infinitely.',
    color: 'amber'
  }
];
