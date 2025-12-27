import { Hero, BaseItem, Jewel, Relic, SlotBonus, ArcheroEvent } from './types';

// --- 1. HERO ROSTER (Comprehensive V6.3) ---
export const HERO_DATA: Hero[] = [
  { 
    id: 'arthur', name: 'King Arthur', tier: 'SSS', category: 'Hero', isGodTier: true, globalBonus120: 'Damage Resistance +6%', 
    desc: 'The Once and Future King.', deepLogic: "Enter 'Night King Form' after moving for 1.25s (Summons Holy Shell reducing dmg by 30%). Attacks charge Excalibur to unleash a screen-clearing slash.", 
    evo4Star: 'Excalibur Slash cooldown reduced by 0.5s each time you take damage.', bestPairs: ['Demon King Spearshield', 'Celestial Warplate'],
    bio: 'Wielding the Sword in the Stone, he has returned to claim his throne and purge the darkness.',
    bestSkin: 'Young Knight', shardCost: '60 Shards to unlock (Special Event)', assistHeroes: ['Zeus', 'Wukong', 'Melinda'],
    trivia: 'His "Holy Shell" makes him the tankiest hero in the game, surpassing even Helix.',
    uniqueEffect: 'Night King Form: Grants 30% Dmg Resist while moving.',
    historicalTiers: [
      { update: "v6.4 Launch", tier: "SSS" }
    ],
    starMilestones: [
      { stars: 3, effect: "Excalibur charge speed +30%." },
      { stars: 4, effect: "Night King Form lingers for 2s after stopping." },
      { stars: 6, effect: "Sword in the Stone: Summons a static turret relic on room entry." },
      { stars: 7, effect: "+8% Damage vs Bosses (Global)", isGlobal: true }
    ],
    sunMilestones: [
      { level: 1, effect: "Holy Shell reflects 20% damage." },
      { level: 2, effect: "+10% Max HP (Global)", isGlobal: true },
      { level: 3, effect: "Excalibur Slash executes enemies under 15% HP." },
      { level: 4, effect: "+5% Projectile Resistance (Global)", isGlobal: true }
    ],
    gearSets: [
      {
        name: "Camelot's Defense",
        weapon: "Demon King Spearshield",
        armor: "Golden Chestplate",
        rings: ["Dragon Ring", "Celestial Band"],
        bracelet: "Shield Bracelet",
        locket: "Counterattack Locket (S)",
        book: "Giants Contract",
        synergy: "Maximizes the Holy Shell reduction to hit nearly 85% Damage Resistance cap."
      }
    ]
  },
  { 
    id: 'zeus', name: 'Zeus', tier: 'SSS', category: 'Hero', isGodTier: true, globalBonus120: 'Max HP +8%', 
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
    id: 'wukong', name: 'Wukong', tier: 'SSS', category: 'Hero', isGodTier: true, globalBonus120: 'Max HP +10%', 
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
    id: 'melinda', name: 'Melinda', tier: 'SSS', category: 'Hero', isGodTier: true, globalBonus120: 'Damage to Ranged Units +8%', 
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
    id: 'dragon_girl', name: 'Dragon Girl', tier: 'SS', category: 'Hero', globalBonus120: 'Damage to Ranged Units +10%', 
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
    id: 'raidara', name: 'Raidara', tier: 'SS', category: 'Hero', globalBonus120: 'Critical Damage +17%', 
    desc: 'The shadow blade ninja.', deepLogic: 'Invisibility during dash. Massive Critical Damage stacking at L120.', 
    bestPairs: ['Demon Blade'], bio: 'A ninja who moves faster than the human eye can track.', 
    shardCost: '50 Shards to unlock (Special Events)', assistHeroes: ['Shade', 'Shingen', 'Melinda'],
    starMilestones: [
      { stars: 7, effect: "+15% Critical Damage (Global)", isGlobal: true }
    ]
  },
  { 
    id: 'taiga', name: 'Taiga', tier: 'SS', category: 'Hero', globalBonus120: 'Critical Damage +17%', 
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
    id: 'stella', name: 'Stella', tier: 'SS', category: 'Hero', globalBonus120: 'HP Drop Rate +7%', 
    desc: 'Star-weaver mage.', deepLogic: 'Star-power builds up to trigger a screen-wide supernova.', 
    bestPairs: ['Celestial Hammer'], bio: 'She weaves the constellations into deadly weapons.', 
    shardCost: '50 Shards to unlock (Soulstone Shop / $19.99)', assistHeroes: ['Zeus', 'Iris', 'Elaine'],
    starMilestones: [
      { stars: 7, effect: "+5% Attack (Global)", isGlobal: true }
    ]
  },
  { 
    id: 'elaine', name: 'Elaine', tier: 'SS', category: 'Hero', globalBonus120: 'Damage to Ground Units +9%', 
    desc: 'Cherry blossom shields.', deepLogic: "Defensive Meta setup. Shields reflect damage at 3-stars.", 
    bestPairs: ['Expedition Plate'], bio: 'The guardian of the sacred sakura tree.', 
    shardCost: '50 Shards to unlock (Soulstone Shop / $19.99)', assistHeroes: ['Melinda', 'Iris', 'Ophelia'],
    starMilestones: [
      { stars: 3, effect: "Shields reflect 50% of projectile damage." },
      { stars: 7, effect: "+5% Max HP (Global)", isGlobal: true }
    ]
  },
  { 
    id: 'iris', name: 'Iris', tier: 'S', category: 'Hero', globalBonus120: 'Damage to Airborne Units +10%', 
    desc: 'The wind-born archer.', deepLogic: 'Increases dodge after moving 3 meters.', 
    bestPairs: ['Vest of Dexterity'], shardCost: '50 Shards to unlock (Soulstone Shop / $14.99)', 
    assistHeroes: ['Melinda', 'Elaine', 'Lina'],
    starMilestones: [
      { stars: 7, effect: "+5% Dodge (Global)", isGlobal: true }
    ]
  },
  { 
    id: 'aquaea', name: 'Aquaea', tier: 'S', category: 'Hero', globalBonus120: 'Healing Effect of Red Hearts +12%', 
    desc: 'Tide sovereign.', deepLogic: 'Water element attacks slow enemies. Best-in-class L120 healing bonus.', 
    bestPairs: ['Tornado'], bio: 'The queen of the deep seas, commanding the tides.', 
    shardCost: '50 Shards to unlock (Special Event)', assistHeroes: ['Sylvan', 'Rolla', 'Meowgik'],
    starMilestones: [
      { stars: 7, effect: "+10% Healing (Global)", isGlobal: true }
    ]
  },
  { 
    id: 'blazo', name: 'Blazo', tier: 'S', category: 'Hero', globalBonus120: 'Max HP +8%', 
    desc: 'Demonic gunslinger.', deepLogic: 'Overheat mechanic triples damage but slows movement.', 
    bestPairs: ['Demon Blade'], shardCost: '50 Shards to unlock (Soulstone Shop / $14.99)', 
    assistHeroes: ['Shade', 'Shingen', 'Phoren'],
    starMilestones: [
      { stars: 7, effect: "+5% Attack (Global)", isGlobal: true }
    ]
  },
  { 
    id: 'shingen', name: 'Shingen', tier: 'S', category: 'Hero', globalBonus120: 'Damage to Ground Units +6%', 
    desc: 'The blade master.', deepLogic: 'Attacks faster as he hits the same enemy.', 
    bestPairs: ['Demon Blade'], shardCost: '50 Shards to unlock (Soulstone Shop / $14.99)', 
    assistHeroes: ['Dragon Girl', 'Lina', 'Sylvan'],
    starMilestones: [
      { stars: 7, effect: "+5% Attack Speed (Global)", isGlobal: true }
    ]
  },
  { 
    id: 'lina', name: 'Lina', tier: 'S', category: 'Hero', globalBonus120: 'Damage to Melee Units +9%', 
    desc: 'Summons dancers.', deepLogic: 'Dancers apply a stacking slow to all enemies.', 
    bestPairs: ['Brightspear'], shardCost: '50 Shards to unlock (Soulstone Shop / $14.99)', 
    assistHeroes: ['Sylvan', 'Iris', 'Shade'],
    starMilestones: [
      { stars: 7, effect: "+5% Elemental Damage (Global)", isGlobal: true }
    ]
  },
  { 
    id: 'gugu', name: 'Gugu', tier: 'S', category: 'Hero', globalBonus120: 'Max HP +8%', 
    desc: 'Owl guardian.', deepLogic: 'Birds provide 30% damage reduction shields.', 
    bestPairs: ['Bull Ring'], shardCost: '50 Shards to unlock (Clan Shop / Clan Points)', 
    assistHeroes: ['Helix', 'Meowgik', 'Onir'],
    starMilestones: [
      { stars: 7, effect: "+10% Projectile Resistance (Global)", isGlobal: true }
    ]
  },
  { 
    id: 'shade', name: 'Shade', tier: 'S', category: 'Hero', globalBonus120: 'Critical Damage +10%', 
    desc: 'The shadow assassin.', deepLogic: 'Shadow form grants +75% Attack Speed.', 
    bestPairs: ['Demon Blade'], shardCost: '50 Shards to unlock (Soulstone Shop / $14.99)', 
    assistHeroes: ['Lina', 'Sylvan', 'Ophelia'],
    starMilestones: [
      { stars: 7, effect: "+5% Attack (Global)", isGlobal: true }
    ]
  },
  { 
    id: 'sylvan', name: 'Sylvan', tier: 'S', category: 'Hero', globalBonus120: 'Damage to Ranged Units +9%', 
    desc: 'Elf prince.', deepLogic: 'Removes elemental skills from RNG pool.', 
    bestPairs: ['Brightspear'], shardCost: '50 Shards to unlock (Soulstone Shop / $12.99)', 
    assistHeroes: ['Lina', 'Shade', 'Rolla'],
    starMilestones: [
      { stars: 7, effect: "+5% Elemental Damage (Global)", isGlobal: true }
    ]
  },
  { 
    id: 'helix', name: 'Helix', tier: 'S', category: 'Hero', globalBonus120: 'Healing Effect of Red Hearts +10%', 
    desc: 'The OG Fury king.', deepLogic: 'Damage increases as HP drops. Highest stability.', 
    bestPairs: ['Demon Blade'], bio: 'The son of a legendary warrior who draws power from his wounds.', 
    shardCost: '30 Shards to unlock (1,500 Gems / Soulstones)', assistHeroes: ['Gugu', 'Meowgik', 'Onir'],
    starMilestones: [
      { stars: 3, effect: "Fury effect starts at 100% HP." },
      { stars: 7, effect: "+15% Critical Damage (Global)", isGlobal: true }
    ]
  },
  { 
    id: 'ryan', name: 'Ryan', tier: 'A', category: 'Hero', globalBonus120: 'Max HP +8%', 
    desc: 'Festive warrior.', deepLogic: 'Has a revival passive. Essential for Max HP growth.', 
    bestPairs: ['Bright Robe'], shardCost: '50 Shards to unlock (Soulstone Shop)', 
    assistHeroes: ['Helix', 'Gugu', 'Ayana'],
    starMilestones: [
      { stars: 7, effect: "+5% Max HP (Global)", isGlobal: true }
    ]
  },
  { 
    id: 'bobo', name: 'Bobo', tier: 'A', category: 'Hero', globalBonus120: 'Attack +6%', 
    desc: 'The explosive expert.', deepLogic: 'Builds up buffs per level. High raw Attack yield.', 
    bestPairs: ['Saw Blade'], shardCost: '30 Shards to unlock', 
    assistHeroes: ['Helix', 'Meowgik', 'Taranis'],
    starMilestones: [
      { stars: 7, effect: "+5% Attack (Global)", isGlobal: true }
    ]
  },
  { 
    id: 'meowgik', name: 'Meowgik', tier: 'A', category: 'Hero', globalBonus120: 'Dodge Chance +3%', 
    desc: 'The kitten mage.', deepLogic: 'Spawns homing kittens that ignore walls.', 
    bestPairs: ['Brightspear'], shardCost: '30 Shards to unlock (1,800 Gems / Soulstones)', 
    assistHeroes: ['Helix', 'Gugu', 'Ayana'],
    starMilestones: [
      { stars: 3, effect: "Kittens travel faster and deal splash damage." },
      { stars: 7, effect: "+5% Attack (Global)", isGlobal: true }
    ]
  },
  { 
    id: 'ayana', name: 'Ayana', tier: 'A', category: 'Hero', globalBonus120: 'Damage to Ranged Units +9%', 
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
    id: 'onir', name: 'Onir', tier: 'A', category: 'Hero', globalBonus120: 'Damage to Ground Units +6%', 
    desc: 'Holy knight.', deepLogic: 'Best used for 10% Global Projectile Resistance at 7-stars.', 
    uniqueEffect: 'Global Proj Resist (7-Star)', shardCost: '50 Shards to unlock (Soulstone Shop / $9.99)', 
    assistHeroes: ['Atreus', 'Helix', 'Phoren'],
    starMilestones: [
      { stars: 7, effect: "+10% Projectile Resistance (Global)", isGlobal: true }
    ]
  },
  { 
    id: 'shari', name: 'Shari', tier: 'B', category: 'Hero', globalBonus120: 'Max HP +8%', 
    desc: 'Vine summoner.', deepLogic: 'Summons static vines. Essential for Global HP bonus.', 
    bestPairs: ['Tornado'], shardCost: '30 Shards (Soulstones / Gems)', 
    assistHeroes: ['Helix', 'Meowgik', 'Ayana'],
    starMilestones: [
      { stars: 7, effect: "+5% Max HP (Global)", isGlobal: true }
    ]
  },
  { 
    id: 'rolla', name: 'Rolla', tier: 'B', category: 'Hero', globalBonus120: 'Collision Damage Resistance +7%', 
    desc: 'Ice goddess.', deepLogic: 'Freezes enemies for longer than standard frozen effect.', 
    bestPairs: ['Death Scythe'], shardCost: '30 Shards to unlock (3,000 Gems / $9.99)', 
    assistHeroes: ['Sylvan', 'Ayana', 'Meowgik'],
    starMilestones: [
      { stars: 7, effect: "+5% Attack (Global)", isGlobal: true }
    ]
  },
  { 
    id: 'taranis', name: 'Taranis', tier: 'B', category: 'Hero', globalBonus120: 'Damage to Airborne Units +9%', 
    desc: 'Thunder master.', deepLogic: 'Lightning arcs deal 35% splash damage.', 
    bestPairs: ['Tornado'], shardCost: '30 Shards to unlock (1,000 Gems / $4.99)', 
    assistHeroes: ['Atreus', 'Urasil', 'Phoren'],
    starMilestones: [
      { stars: 7, effect: "+5% Attack (Global)", isGlobal: true }
    ]
  },
  { 
    id: 'phoren', name: 'Phoren', tier: 'C', category: 'Hero', globalBonus120: 'Damage to Ranged Units +9%', 
    desc: 'Fire master.', deepLogic: 'Burn damage lasts twice as long.', 
    bestPairs: ['Saw Blade'], shardCost: '30 Shards to unlock (50,000 Gold / Chapter 7)', 
    assistHeroes: ['Atreus', 'Taranis', 'Urasil'],
    starMilestones: [
      { stars: 7, effect: "+5% Attack (Global)", isGlobal: true }
    ]
  },
  { 
    id: 'atreus', name: 'Atreus', tier: 'C', category: 'Hero', globalBonus120: 'Projectile Resistance +7%', 
    desc: 'The rookie.', deepLogic: 'Mandatory L80/L120 for Immunity Build.', uniqueEffect: 'Immunity Key', 
    bio: 'The hero who started it all.', shardCost: 'Starter Hero (Unlock via Chapter 1)', 
    assistHeroes: ['Helix', 'Phoren', 'Urasil'],
    starMilestones: [
      { stars: 7, effect: "+10% Max HP (Global)", isGlobal: true }
    ]
  },
  { 
    id: 'uruana', name: 'Urasil', tier: 'F', category: 'Hero', globalBonus120: 'Damage to Melee Units +9%', 
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
  { 
    id: 'demon_spearshield', name: 'Demon King Spearshield', tier: 'SSS', category: 'Weapon', desc: 'Hybrid Shield-Cannon.', 
    mythicPerk: 'Titan: Cannon Mode Crit Dmg +20%.', 
    deepLogic: 'The ultimate offense/defense hybrid. Toggles between "Shield Mode" (Blocks projectiles, melee attacks) and "Cannon Mode" (Ranged explosive AoE). Cannon mode deals splash damage, while Shield mode offers the highest survival rate in the game.' 
  },
  { id: 'ant_sword', name: 'Antiquated Sword', tier: 'SS', category: 'Weapon', desc: 'Greatsword.', mythicPerk: 'Titan: Whirlwind Reflects 30% Dmg.', deepLogic: 'Broadsword has hidden +40% Dmg vs Bosses.' },
  { id: 'demon_blade', name: 'Demon Blade', tier: 'SS', category: 'Weapon', desc: 'Katana.', mythicPerk: 'Titan: Shadows inherit 100% Element.', deepLogic: 'Melee hits deal 1.8x damage. Do NOT take Front Arrow.' },
  { id: 'stalker_staff', name: 'Stalker Staff', tier: 'S', category: 'Weapon', desc: 'Staff.', mythicPerk: 'Titan: +15% Flight Speed.', deepLogic: 'Best for Bosses. Stack Diagonal Arrows.' },
  { id: 'brightspear', name: 'Brightspear', tier: 'A', category: 'Weapon', desc: 'Laser.', mythicPerk: 'Titan: Beam splits to 2 targets.', deepLogic: 'Projectile travel time is near-zero. Best for farming fast-moving mobs or long-range sniping in wave chapters.' },
  { id: 'bright_robe', name: 'Bright Robe', tier: 'A', category: 'Armor', desc: 'Front Dmg Resistance + XP Boost.', deepLogic: 'The level-up speed bonus is critical for Infinite Adventure and long wave chapters to reach level 10-11 faster.' },
  { id: 'death_scythe', name: 'Death Scythe', tier: 'A', category: 'Weapon', desc: 'Scythe.', mythicPerk: 'Titan: Execute threshold <35% HP.', deepLogic: 'High knockback value helps with crowd control. The execution perk makes it a top-tier choice for high-HP mobs in late-game chapters.' },
  { id: 'tornado', name: 'Tornado', tier: 'A', category: 'Weapon', desc: 'Boomerang. Built-in Pierce and Ricochet.', deepLogic: 'Built-in Pierce and Return. Return hits deal 50% extra damage. Recommendation: Avoid Ricochet and Pierce skills as they reduce return damage.' },
  { id: 'gale_force', name: 'Gale Force', tier: 'B', category: 'Weapon', desc: 'Crossbow. Charged Shot.', deepLogic: 'High base damage but slow reload. The charged shot bypasses standard armor and deals massive crit damage.' },
  { id: 'saw_blade', name: 'Saw Blade', tier: 'C', category: 'Weapon', desc: 'Dagger. Fastest Attack Speed.', deepLogic: 'Entering a room provides a 3-second attack speed boost. Best used with "Freeze" or "Headshot" builds to maximize hit frequency.' },
  { id: 'brave_bow', name: 'Brave Bow', tier: 'C', category: 'Weapon', desc: 'Bow.', mythicPerk: 'Titan: High Crit Synergy.', deepLogic: 'The most balanced weapon. Scales exceptionally well with Critical Damage buffs and stays viable through early-mid game.' },
  { id: 'mini_atreus', name: 'Mini Atreus', tier: 'D', category: 'Weapon', desc: 'Meme Weapon. Just for fun.', deepLogic: 'Shoots random projectiles (Arrow, Scythe, etc). Not recommended for serious pushes.' },

  // --- ARMOR ---
  
  { 
    id: 'demon_robe', name: 'Demon King Robe', tier: 'SSS', category: 'Armor', desc: 'Dark Driver.', 
    mythicPerk: 'Titan: Dark Dmg +20%.', 
    deepLogic: 'THE CORE DRIVER. Releases dark pulses that afflict enemies with "Dark Status". Without this armor, the Demon King Ring and Locket bonuses are dormant (useless).' 
  },
  { id: 'c_warplate', name: 'Celestial Warplate', tier: 'SSS', category: 'Armor', desc: 'Lightning Plate.', mythicPerk: 'Titan: Collision Resist +20%.', deepLogic: 'Converts dmg to Heavenly Energy. Best for wave chapters.' },
  { id: 'exp_plate', name: 'Expedition Plate', tier: 'SSS', category: 'Armor', desc: 'Heart Plate.', mythicPerk: 'Titan: Heart Drop +20%.', deepLogic: 'The core of Expedition sustain. Picking up hearts grants an Invincibility Shield and triggers Divine Grace healing.' },
  { id: 'p_cloak', name: 'Phantom Cloak', tier: 'SS', category: 'Armor', desc: 'Ice Cloak.', mythicPerk: 'Titan: Freeze +2.5s. Frozen enemies take +30% Dmg.', deepLogic: 'Meta for Boss chapters.' },
  { id: 'shadow_robe', name: 'Shadow Robe', tier: 'A', category: 'Armor', desc: 'Deals Dark damage to nearby enemies.', deepLogic: 'Dark AoE damage scales with Hero Attack. Extremely effective in cramped wave rooms with high enemy density.' },
  { id: 'void_robe', name: 'Void Robe', tier: 'B', category: 'Armor', desc: 'Poisons all enemies in room.', deepLogic: 'Applies permanent poison to every enemy on room entry. Best for long, slow-paced wave chapters where poison can tick down high HP.' },
  { id: 'vest_dex', name: 'Vest of Dexterity', tier: 'B', category: 'Armor', desc: 'Dodge Logic.', deepLogic: '+7% Global Dodge. Essential for "Full Dodge" niche builds when paired with Serpent Rings.' },
  { id: 'golden_chest', name: 'Golden Chestplate', tier: 'C', category: 'Armor', desc: 'Flame Chest.', mythicPerk: 'Titan: 5% Dmg Reduction.', deepLogic: 'Flat 5% damage reduction from all sources. Stacks additively with Bull Rings for ultra-tanky setups.' },

  // --- RINGS ---
  { 
    id: 'demon_ring', name: 'Demon King Band', tier: 'SSS', category: 'Ring', desc: 'Dark Exploiter.', 
    deepLogic: 'Parasitic Synergy: Deals massive extra damage to enemies afflicted by Dark Status. Requires the Demon King Armor to function effectively.' 
  },
  { id: 'dragon_ring', name: 'Dragon Ring', tier: 'SS', category: 'Ring', desc: 'Proj Resist.', mythicPerk: 'Titan: Proj Resist +13.8%.', deepLogic: 'Essential for Immunity Build. Stacks additively.' },
  { id: 'celestial_ring', name: 'Celestial Band', tier: 'SS', category: 'Ring', desc: 'Lightning Ring.', mythicPerk: 'Titan: Collision Resist +15%.', deepLogic: 'Chain Lightning scales with S-Locket.' },
  { 
    id: 'exp_ring', name: 'Expedition Ring', tier: 'S', category: 'Ring', desc: 'Boss Killer.', 
    deepLogic: 'Grants raw Attack % and high Crit Chance. Unique Effect: Increases Damage to Bosses by roughly 10% (stacking). Essential for completing the Expedition Set Resonance.' 
  },
  { id: 'bull_ring', name: 'Bull Ring', tier: 'S', category: 'Ring', desc: 'Tank Ring.', mythicPerk: 'Titan: Dmg Resist +10%.', deepLogic: 'Best for farming Gold. DR applies after Proj Resist.' },
  { id: 'lion_ring', name: 'Lion Ring', tier: 'S', category: 'Ring', desc: 'Boss Ring.', mythicPerk: 'Titan: Crit Dmg +20%.', deepLogic: 'Pure DPS. Mandatory for Boss Chapters.' },
  { id: 'vilebat_ring', name: 'Vilebat Ring', tier: 'A', category: 'Ring', desc: 'Heal on Kill.', deepLogic: 'Restores a small % of HP per kill. Effectively doubles the yield of "Heal on Kill" skills.' },
  { id: 'wolf_ring', name: 'Wolf Ring', tier: 'B', category: 'Ring', desc: 'Melee Crit Chance.', deepLogic: 'Provides 5% Crit Chance. Useful for Melee-focused heroes like Melinda or Shingen.' },
  { id: 'userpent_ring', name: 'Serpent Ring', tier: 'B', category: 'Ring', desc: 'Dodge Chance +7%.', deepLogic: 'Core ring for Dodge builds. Also provides +10% Damage to Ranged units.' },
  { id: 'falcon_ring', name: 'Falcon Ring', tier: 'C', category: 'Ring', desc: 'Attack Speed +5%.', deepLogic: 'Pure attack speed buff. Recommended for slow weapons like Death Scythe.' },
  { id: 'bear_ring', name: 'Bear Ring', tier: 'C', category: 'Ring', desc: 'HP + Ground Dmg.', deepLogic: 'Increases Max HP by 5%. Best used in early-game for general survivability.' },

  // --- BRACELETS ---
  { 
    id: 'demon_guards', name: 'Demon King Legguards', tier: 'SSS', category: 'Bracelet', desc: 'Dark Thorns.', 
    deepLogic: 'Provides collision resistance and reflects damage to enemies who touch you. Synergizes with the Spearshield\'s defensive stance.' 
  },
  { id: 'celestial_bracer', name: 'Celestial Bracer', tier: 'SS', category: 'Bracelet', desc: 'Lightning.', mythicPerk: 'Titan: Lightning Dmg +20%.' },
  { id: 'shield_bracer', name: 'Shield Bracelet', tier: 'SS', category: 'Bracelet', desc: 'Shield.', mythicPerk: 'Titan: Atk +12%.' },
  { 
    id: 'exp_bracelet', name: 'Expedition Bracelet', tier: 'S', category: 'Bracelet', desc: 'Crit Burst.', 
    deepLogic: 'On entering a room, grants a massive Crit Damage boost for 3 seconds. Killing enemies extends this duration.' 
  },
  { id: 'invincible', name: 'Invincible Bracelet', tier: 'S', category: 'Bracelet', desc: 'Invincibility.', deepLogic: '2.5s God Mode on room entry.' },
  { id: 'quickshot', name: 'Quickshot Bracelet', tier: 'A', category: 'Bracelet', desc: 'Multishot.', deepLogic: 'Entering a room gives a 2-second boost to Attack and speed. Essential for high-burst room clears.' },
  { id: 'thunder_bracer', name: 'Thunder Bracelet', tier: 'B', category: 'Bracelet', desc: 'Zap.', deepLogic: 'Deals random lightning damage to enemies on room entry. Damage scales with character level.' },
  { id: 'frozen_bracer', name: 'Frozen Bracelet', tier: 'B', category: 'Bracelet', desc: 'Freeze.', deepLogic: 'Freezes random enemies for 2.5s on room entry. Useful for preventing immediate damage in high-density rooms.' },
  { id: 'blazing_bracer', name: 'Blazing Bracelet', tier: 'C', category: 'Bracelet', desc: 'Fire.', deepLogic: 'Ignites random enemies on room entry. Burn damage is flat and scales poorly in late game.' },
  { id: 'split_bracer', name: 'Split Bracelet', tier: 'C', category: 'Bracelet', desc: 'Clones.', deepLogic: 'Spawns 2 temporary clones on room entry. Clones deal minimal damage but can take aggro.' },

  // --- LOCKETS ---
  { 
    id: 'demon_locket', name: 'Demon King Talisman', tier: 'SSS', category: 'Locket', desc: 'Energy Siphon.', 
    deepLogic: 'Drains life from Dark-afflicted enemies to generate an active shield. Essential for the "High-Risk, High-Burst" playstyle of the DK set.' 
  },
  { id: 'bulletproof', name: 'Bulletproof Locket', tier: 'SS', category: 'Locket', desc: 'Proj Tank.', mythicPerk: 'Titan: +15% Proj Resist (<25% HP).', deepLogic: 'Key to 100% Immunity.' },
  { id: 'celestial_talisman', name: 'Celestial Talisman', tier: 'SS', category: 'Locket', desc: 'MP Gen.', deepLogic: 'Best for Mana-hungry heroes.' },
  { id: 'exp_locket', name: 'Expedition Locket', tier: 'S', category: 'Locket', desc: 'Revive.', mythicPerk: 'Titan: Atk +25% after heal.' },
  { 
    id: 'counter_locket_s', name: 'Counterattack Locket (S)', tier: 'S', category: 'Locket', desc: 'Fatal Counter.', 
    deepLogic: 'When taking lethal damage, prevents death and immediately releases a massive shockwave dealing 500% Attack damage. (Cooldown: 1 per room).' 
  },
  { id: 'angel', name: 'Angel Locket', tier: 'A', category: 'Locket', desc: 'Revive Chance.', deepLogic: 'Gives a chance to revive with 25% HP upon lethal damage. Reliability increases with rarity.' },
  { id: 'bloodthirsty', name: 'Bloodthirsty Locket', tier: 'A', category: 'Locket', desc: 'Lifesteal.', deepLogic: 'Provides a small percentage of Lifesteal when HP is below 20%. Niche survivability tool.' },
  { id: 'agile', name: 'Agile Locket', tier: 'B', category: 'Locket', desc: 'Dodge.', deepLogic: 'Increases Dodge rate significantly when HP falls below 20%.' },
  { id: 'counterattack', name: 'Counterattack Charm', tier: 'C', category: 'Locket', desc: 'Reflect.', deepLogic: 'Reflect a portion of taken damage back to the attacker. Generally weak due to high enemy HP pools.' },
  { id: 'iron', name: 'Iron Locket', tier: 'C', category: 'Locket', desc: 'Collision.', deepLogic: 'Reduces collision damage when HP is low. Use only for collision-heavy chapters.' },
  { id: 'piercer', name: 'Piercer Locket', tier: 'C', category: 'Locket', desc: 'Wall Pass.', deepLogic: 'Grants the ability to pass through walls for 3 seconds when HP is low.' },

  // --- BOOKS ---
  { id: 'enlightenment', name: 'Enlightenment', tier: 'SS', category: 'Book', desc: 'Skills.', mythicPerk: 'Titan: Dmg Resist +5%.', deepLogic: 'Best for Infinite Adventure. Breaks RNG limit.' },
  { id: 'arcanum', name: 'Arcanum of Time', tier: 'SS', category: 'Book', desc: 'Time Stop.', mythicPerk: 'Titan: Duration +1s.', deepLogic: 'Freezes projectiles. Ultimate defense.' },
  { 
    id: 'celestial_book', name: 'Celestial Enchiridion', tier: 'SS', category: 'Book', desc: 'Lightning Form.', 
    deepLogic: 'Active: Transforms hero into a pure Lightning entity. While active, projectiles pierce walls and deal Chain Lightning damage to all screen enemies.' 
  },
  { id: 'giant', name: 'Giants Contract', tier: 'S', category: 'Book', desc: 'Melee.', deepLogic: 'Synergy King with Demon Blade/Fist.' },
  { 
    id: 'exp_book', name: 'Expedition Spellbook', tier: 'S', category: 'Book', desc: 'Auto-Heal & Haste.', 
    deepLogic: 'Passive: Automatically generates HP hearts when moving. Active: Enters "Overdrive" state, increasing Attack Speed and Movement Speed significantly. Best for sustain.' 
  },
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
  { id: 'penguin_king', name: 'Polar Penguin King', tier: 'SS', category: 'Pet', desc: 'Arctic Ruler.', deepLogic: 'Newest SS Meta. "Piercing Cold" aura slows enemy projectiles by 25% and freezes enemies on contact. Essential for late-game projectile spam chapters.' },
  { id: 'phoenix', name: 'Radiant Phoenix', tier: 'SS', category: 'Pet', desc: 'Rebirth Flame.', deepLogic: 'Deals massive screen-wide Fire damage. Unique Passive: "Ashes to Ashes" prevents death once per run, healing you for 20% HP (stacks with Angel Locket).' },
  { id: 'frothy', name: 'Frothy Capy', tier: 'SS', category: 'Pet', desc: 'Immunity Bubble.', deepLogic: 'The defensive king. Grants a "Bubble" that provides 100% damage immunity for 3 seconds. High uptime when awakened.' },
  { id: 'unicorn', name: 'Empyrean Unicorn', tier: 'SS', category: 'Pet', desc: 'Block & Shield.', deepLogic: 'Provides a % chance to completely block incoming damage. At 3-Stars, summons rotating shields that destroy projectiles.' },
  
  // S-TIER PETS
  { id: 'ignitus', name: 'Ignitus Bird', tier: 'S', category: 'Pet', desc: 'Crit Specialist.', deepLogic: 'Best offensive S-Pet. Increases Hero Critical Damage. 3-Star Perk: Critical hits have a 30% chance to trigger a fiery explosion.' },
  { id: 'verdafrost', name: 'Verdafrost Bear', tier: 'S', category: 'Pet', desc: 'Collision Tank.', deepLogic: 'Triggers freezing shockwaves when you take collision damage. Best used in "Up-Close Dangers" or melee-heavy chapters.' },
  { id: 'blitzbeak', name: 'Furious Blitzbeak', tier: 'S', category: 'Pet', desc: 'Chain Lightning.', deepLogic: 'Attacks arc to 3 nearby enemies, stunning them for 0.5s. Excellent crowd control for wave chapters.' },
  { id: 'butterfly', name: 'Spirit Butterfly', tier: 'S', category: 'Pet', desc: 'Evasion Support.', deepLogic: 'Increases Hero Dodge rate and Projectile Resistance. Passive: Periodically clears a debuff (Burn/Poison/Freeze) from the hero.' },
  
  // A-TIER / ASSIST
  { id: 'swamp_toad', name: 'Swamp Toad', tier: 'A', category: 'Pet', desc: 'Poison Area.', deepLogic: 'Leaves poison puddles that slow enemies. Decent for kiting, but outclassed by Penguin King.' },
  { id: 'crimson_fox', name: 'Crimson Fox', tier: 'A', category: 'Pet', desc: 'Raw Damage.', deepLogic: 'High single-target damage. Good for boss killing if you lack SS pets.' },

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
  // --- OFFENSIVE (Red/Pink) ---
  { id: 'ruby', name: 'Ruby', color: 'Red', statType: 'Attack', baseStat: 20, statPerLevel: 45, slots: ['Weapon', 'Ring', 'Spirit'], lore: 'Crystallized essence of raw destructive power.' },
  { id: 'kunzite', name: 'Kunzite', color: 'Red', statType: 'Dmg to Bosses', baseStat: 15, statPerLevel: 35, slots: ['Weapon', 'Ring', 'Book'], lore: 'Slayer\'s choice. Essential for Boss Chapters (H21+).' },

  // --- DEFENSIVE (Blue/Cyan) ---
  { id: 'lapis', name: 'Lapis', color: 'Blue', statType: 'Max HP', baseStat: 100, statPerLevel: 220, slots: ['Armor', 'Locket', 'Book'], lore: 'Deep azure gem carrying standard vitality.' },
  { id: 'tourmaline', name: 'Tourmaline', color: 'Teal', statType: 'Atk + HP (Hybrid)', baseStat: 25, statPerLevel: 55, slots: ['Armor', 'Locket', 'Spirit'], lore: 'The Crown Jewel. rare bi-color gem granting both Attack and Health. S-Tier.' },

  // --- TACTICAL (Yellow/Orange) ---
  { id: 'topaz', name: 'Topaz', color: 'Yellow', statType: 'Crit Chance', baseStat: 0.5, statPerLevel: 1.2, slots: ['Weapon', 'Bracelet'], lore: 'Solar-charged stone enhancing precision and critical strikes.' },
  { id: 'amber', name: 'Amber', color: 'Yellow', statType: 'Elemental Dmg', baseStat: 30, statPerLevel: 65, slots: ['Weapon', 'Spirit', 'Bracelet'], lore: 'Fossilized resin boosting Fire, Poison, and Lightning ticks.' },

  // --- UTILITY (Green/Purple) ---
  { id: 'emerald', name: 'Emerald', color: 'Green', statType: 'Crit Damage', baseStat: 2, statPerLevel: 5, slots: ['Armor', 'Book', 'Locket'], lore: 'Verdant mineral that amplifies the impact of critical hits.' },
  { id: 'amethyst', name: 'Amethyst', color: 'Purple', statType: 'Defense', baseStat: 10, statPerLevel: 25, slots: ['Ring', 'Book', 'Armor'], lore: 'Mystical quartz providing flat damage mitigation.' },
  { id: 'calla', name: 'Calla', color: 'Green', statType: 'Drop Rate', baseStat: 1, statPerLevel: 0.5, slots: ['Ring', 'Spirit'], lore: 'Lucky stone increasing equipment and scroll drops.' }
];

export const RELIC_DATA: Relic[] = [
  // --- SUPREME TREASURES (Red / SSS Tier) ---
  { id: 'goldwish_cudgel', name: 'Goldwish Cudgel', tier: 'Supreme', effect: 'Wukong Transform & Atk +%', lore: 'The Monkey King\'s weapon. Grants invincibility during transformation. True Endgame.', source: 'Supreme Chest', iconType: 'Sword' },
  { id: 'zeus_belt', name: 'Zeus Belt', tier: 'Supreme', effect: 'S-Grade Shard Drop Rate +%', lore: 'The only relic that directly increases the drop rate of S-Tier Hero Shards.', source: 'Supreme Chest', iconType: 'Zap' },
  { id: 'sword_stone', name: 'Sword in Stone', tier: 'Supreme', effect: 'Equip Stats +30%', lore: 'Arthur\'s legacy. Enhances King Arthur\'s Excalibur charge attacks.', source: 'Supreme Chest', iconType: 'Sword' },
  { id: 'angel_judgment', name: 'Angel of Judgment', tier: 'Supreme', effect: 'Resurrection & Frontal Def', lore: 'The ultimate defensive artifact. Grants a second layer of resurrection.', source: 'Supreme Chest', iconType: 'Shield' },

  // --- HOLY RELICS (Gold / SS Tier) ---
  { id: 'healing_grail', name: 'Healing Holy Grail', tier: 'Holy', effect: 'Unlocks "Grace" Skill', lore: 'Unlocks the hidden "Grace" skill that boosts healing as HP gets lower.', source: 'Relic Chest', iconType: 'Cup' },
  { id: 'blood_grail', name: 'Bloodthirsty Grail', tier: 'Holy', effect: 'HP Drop Rate +%', lore: 'Combines lifesteal mechanics with massive HP scaling.', source: 'Relic Chest', iconType: 'Cup' },
  { id: 'first_lightning', name: 'First Lightning', tier: 'Holy', effect: 'Lightning Dmg +35%', lore: 'Best-in-slot for Zeus. Massive multiplier for all lightning procs.', source: 'Relic Chest', iconType: 'Zap' },
  { id: 'yggdrasil_spear', name: 'Spear of Yggdrasil', tier: 'Holy', effect: 'Attack Speed +2%', lore: 'One of the few sources of raw, permanent Attack Speed.', source: 'Relic Chest', iconType: 'Sword' },
  { id: 'primal_fire', name: 'Primal Fire', tier: 'Holy', effect: 'Fire Dmg +25%', lore: 'Essential for Phoren/Lina. Rewards revives with permanent Attack.', source: 'Relic Chest', iconType: 'Flame' },
  { id: 'prophet_quill', name: 'Prophet\'s Quill', tier: 'Holy', effect: 'Resurrection Prob +%', lore: 'Stacks with Angel Locket to cheat death multiple times.', source: 'Relic Chest', iconType: 'Scroll' },
  { id: 'demon_eye', name: 'Demon King\'s Eye', tier: 'Holy', effect: 'Atk % & Boss Dmg %', lore: 'Hybrid offense/defense. Not to be confused with the weapon.', source: 'Relic Chest', iconType: 'Eye' },

  // --- RADIANT RELICS (Purple / S Tier) ---
  { id: 'smiling_mask', name: 'Smiling Mask', tier: 'Radiant', effect: 'Dragon Chest Timer -%', lore: 'Economic King. Reduces free Dragon Chest timer. Essential for F2P.', source: 'Chapters', iconType: 'Ghost' },
  { id: 'clown_mask', name: 'Clown Mask', tier: 'Radiant', effect: 'Atk per Daily Event', lore: 'Scales Attack indefinitely based on daily participation.', source: 'Chapters', iconType: 'Ghost' },
  { id: 'treasure_belt', name: 'Glimmering Belt', tier: 'Radiant', effect: 'Relic Chest Timer -%', lore: 'Reduces timer for free Relic Chests. Long-term value is immense.', source: 'Chapters', iconType: 'Box' },
  { id: 'book_bravery', name: 'Book of Bravery', tier: 'Radiant', effect: 'Melee Dmg +%', lore: 'Critical for Demon Blade/Fist users to boost melee strikes.', source: 'Chapters', iconType: 'Book' },
  { id: 'golden_apple', name: 'Golden Apple', tier: 'Radiant', effect: 'Max HP per Daily Event', lore: 'Massive HP scaler. Often confused for SS-tier due to power level.', source: 'Chapters', iconType: 'Cup' },
  { id: 'stone_wisdom', name: 'Stone of Wisdom', tier: 'Radiant', effect: 'Jewel Chest Timer -%', lore: 'Accelerates Jewel progression significantly over time.', source: 'Chapters', iconType: 'Gem' },

  // --- RARE RELICS (Green / A Tier) ---
  { id: 'precision_slingshot', name: 'Precision Slingshot', tier: 'Rare', effect: 'Patrol Gear Drop +%', lore: 'THE farming relic. Increases passive gear income from patrol. Max this first.', source: 'Common', iconType: 'Arrow' },
  { id: 'pirate_shank', name: 'Pirate\'s Shank', tier: 'Rare', effect: 'Patrol Coin Drop +%', lore: 'The Gold generator. Essential for affording late-game talent upgrades.', source: 'Common', iconType: 'Sword' },
  { id: 'special_lance', name: 'Special Lance', tier: 'Rare', effect: 'Atk per Ad Viewed', lore: 'Turns ad-watching into raw power. Great for active F2P players.', source: 'Common', iconType: 'Sword' },
  { id: 'scholar_scope', name: 'Scholar\'s Telescope', tier: 'Rare', effect: 'Patrol General +%', lore: 'Boosts overall account economy from Hero Patrol.', source: 'Common', iconType: 'Search' },
  { id: 'princess_bear', name: 'Princess Teddy', tier: 'Rare', effect: 'Equip Drop Rate +%', lore: 'The "Three Brothers" rarity. Hard to find, but best farming stat in the game.', source: 'Common', iconType: 'Dog' }
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
  { 
    id: 'thunderfrost', name: 'Thunderfrost Wings', tier: 'SS', category: 'Dragon', dragonType: 'Balanced', desc: 'Ice/Lightning Control.', 
    deepLogic: 'Rivals Magmar. Uses a hybrid Ice/Lightning breath that freezes enemies AND deals chain damage. Top-tier Crowd Control.' 
  },
  { 
    id: 'viridax', name: 'Viridax', tier: 'SS', category: 'Dragon', dragonType: 'Defense', desc: 'Terraformer.', 
    deepLogic: 'Generates walls and cover in open maps. Extremely tactical for "Glass Cannon" builds that need to hide to survive.' 
  },
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
    days: ['Tuesday', 'Thursday', 'Saturday', 'Sunday'], // Fixed: Tue/Thu/Sat/Sun
    rewards: ['Massive Gold', 'High Exp'],
    desc: 'The best source for gold. Melee enemies rush you at high speed.',
    proTip: 'Equip 2x Bull Rings for gold bonus. Prioritize "Greed" and "Richochet" to keep mobs at bay.',
    color: 'orange'
  },
  {
    id: 'fb',
    name: 'Flying Bullets',
    days: ['Monday', 'Wednesday', 'Friday', 'Sunday'], // Fixed: Mon/Wed/Fri/Sun
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

// --- RUNE ORACLE DATA ---
export const RUNE_DATA = [
  {
    id: 'power', name: 'Power Rune', color: 'red', focus: 'Offense',
    godRolls: [
      { stat: 'All Damage Increased %', val: '+3% to +5%', tier: 'SSS' },
      { stat: 'Crit Damage %', val: '+20% to +40%', tier: 'SS' },
      { stat: 'Attack %', val: '+3% to +5%', tier: 'S' }
    ]
  },
  {
    id: 'savior', name: 'Savior Rune', color: 'blue', focus: 'Defense',
    godRolls: [
      { stat: 'Damage Resistance %', val: '+4% to +6%', tier: 'SSS' },
      { stat: 'Projectile Resistance %', val: '+5% to +8%', tier: 'SS' },
      { stat: 'Collision Resistance %', val: '+5% to +8%', tier: 'S' }
    ]
  },
  {
    id: 'recovery', name: 'Recovery Rune', color: 'green', focus: 'Utility',
    godRolls: [
      { stat: 'Diagonal Arrows +1', val: 'Rare Skill', tier: 'SSS' },
      { stat: 'Rage (Skill)', val: 'Rare Skill', tier: 'SSS' },
      { stat: 'Healing Effect %', val: '+10% to +20%', tier: 'S' }
    ]
  },
  {
    id: 'courage', name: 'Courage Rune', color: 'orange', focus: 'Hero',
    godRolls: [
      { stat: 'Attack +% (Base)', val: '+4% to +7%', tier: 'SSS' },
      { stat: 'Hero Base Stats %', val: '+3% to +5%', tier: 'SS' },
      { stat: 'Battle XP Gain %', val: '+10% to +15%', tier: 'A' }
    ]
  },
  {
    id: 'luck', name: 'Luck Rune', color: 'purple', focus: 'Drops',
    godRolls: [
      { stat: 'Monster Egg Drop %', val: 'High Priority', tier: 'SSS' },
      { stat: 'Equipment Drop Rate %', val: 'High Priority', tier: 'SSS' }
    ]
  }
];

// --- SYNERGY TEMPLE DATA ---
export const SYNERGY_DATA: Record<string, { partners: Array<{ name: string; buff: string; tier: 'S' | 'A' | 'B' }> }> = {
  arthur: {
    partners: [
      { name: 'Zeus', buff: 'Adds Lightning Chain to Excalibur strikes.', tier: 'S' },
      { name: 'Melinda', buff: 'Barrage triggers on Critical Hits.', tier: 'S' },
      { name: 'Helix', buff: 'Survival Instinct: Dmg +20% when HP < 30%.', tier: 'A' }
    ]
  },
  wukong: {
    partners: [
      { name: 'Melinda', buff: 'Spinning Staff shoots Barrage arrows.', tier: 'S' },
      { name: 'Stella', buff: 'Adds Starfall effect to clone attacks.', tier: 'S' },
      { name: 'Taiga', buff: 'Increases Crit Dmg by 15% flat.', tier: 'A' }
    ]
  },
  zeus: {
    partners: [
      { name: 'Taranis', buff: 'Lightning Dmg +25% (Thunder God Synergy).', tier: 'S' },
      { name: 'Phoren', buff: 'Crits apply Burn (Elemental Overload).', tier: 'A' },
      { name: 'Sylvan', buff: 'Adds random elemental proc to bolts.', tier: 'B' }
    ]
  },
  melinda: {
    partners: [
      { name: 'Dragon Girl', buff: 'Explosion radius +30%.', tier: 'S' },
      { name: 'Shade', buff: 'Adds Dark Touch to Barrage.', tier: 'A' },
      { name: 'Rolla', buff: 'Freezes enemies hit by barrage.', tier: 'B' }
    ]
  },
  helix: {
    partners: [
      { name: 'Meowgik', buff: 'Dodge +5%, Cat spirit spawns on hit.', tier: 'S' },
      { name: 'Gugu', buff: 'Owl summon protects from 1 hit.', tier: 'A' },
      { name: 'Ayana', buff: 'Charm effect duration +2s.', tier: 'B' }
    ]
  },
  dragon_girl: {
    partners: [
      { name: 'Melinda', buff: 'Dragon projectiles split on impact.', tier: 'S' },
      { name: 'Starrite (Pet)', buff: 'Dragon stats +15%.', tier: 'A' },
      { name: 'Ophelia', buff: 'Soul sucking effectiveness +20%.', tier: 'B' }
    ]
  }
};