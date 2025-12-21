
import { Hero, BaseItem } from './types';

export const HERO_DATA: Hero[] = [
  { 
    id: 'zeus', name: 'Zeus', tier: 'SSS', category: 'Hero', isGodTier: true, 
    desc: 'The Lightning Sovereign. Dominates the meta with unmatched base stats and chain lightning that ignores Damage Resistance.', 
    globalBonus120: '+8% Max HP (Global)', bestSkin: 'Thunder Overlord', evo4Star: 'Lightning chain +2',
    bio: 'Wielder of the heavens, Zeus brings divine wrath to the battlefield.',
    trivia: 'First hero in Archero history to have a base damage multiplier exceeding 2.0x.',
    deepLogic: 'Zeus is the undisputed King of 2025. His lightning jumps ignore 15% of enemy damage resistance. Mandatory for end-game pushing Chapters 80+. His synergy with the Celestial Hammer is unmatched.',
    assistHeroes: ['Melinda', 'Wukong'],
    shardCost: '50 to unlock',
    bestPairs: ['Celestial Hammer', 'Celestial Warplate', 'Celestial Talisman']
  },
  { 
    id: 'wukong', name: 'Wukong', tier: 'SSS', category: 'Hero', isGodTier: true, 
    desc: 'The Monkey King. DPS machine that relies on clones to overwhelm enemies and bypass high-defense mobs.', 
    globalBonus120: 'L120: +10% Max HP (Global)', bestSkin: 'Celestial Sage',
    bio: 'A trickster god who fought the heavens and won.',
    trivia: 'Clones actually inherit "Front Arrow" and "Multishot" if the main body has them.',
    deepLogic: 'Clones inherit 100% of your Attack and benefit from your Crit Rate. In wave chapters, Wukong outperforms almost everyone except Zeus.',
    assistHeroes: ['Dragon Girl', 'Stella'],
    shardCost: '50 to unlock',
    bestPairs: ['Expedition Fist', 'Dragon Ring']
  },
  { 
    id: 'melinda', name: 'Melinda', tier: 'SSS', category: 'Hero', isGodTier: true, 
    desc: 'The Barrage Specialist. Higher damage output at lower HP levels makes her a clutch boss killer.', 
    globalBonus120: '+5% Global Atk', bestSkin: 'Baking Sweetie',
    bio: 'A high-born lady who prefers the thrill of the hunt to the ballroom.',
    trivia: 'Her "Baking Sweetie" skin provides a hidden 5% projectile speed buff.',
    deepLogic: 'Melinda remains the gold standard for burst DPS. Her barrage counts as projectile damage, making her exceptionally strong with Brawler-style relics.',
    assistHeroes: ['Helix', 'Meowgik'],
    shardCost: '50 to unlock',
    bestPairs: ['Demon Blade', 'Phantom Cloak']
  },
  { 
    id: 'dragon_girl', name: 'Dragon Girl', tier: 'SS', category: 'Hero', 
    desc: 'Explosive AOE damage through dragon breath. Exceptional for clearing dense rooms.', 
    globalBonus120: '+5% Crit Damage (Global)',
    bio: 'Raised by drakes in the northern peaks, she is fire incarnate.',
    deepLogic: 'Her dragon breath applies a burn that reduces enemy healing. Essential for certain Hero Mode bosses with regeneration.',
    assistHeroes: ['Melinda', 'Stella']
  },
  { 
    id: 'helix', name: 'Helix', tier: 'S', category: 'Hero', 
    desc: 'The F2P Champion. Inherently gains "Fury" which increases Attack significantly as HP decreases.', 
    globalBonus120: '+5% Crit Chance (Global)', bestSkin: 'Bear Man',
    bio: 'A tribal warrior whose strength grows with his wounds.',
    trivia: 'Fury is the only ability that scales attack power linearly with missing HP percentage.',
    deepLogic: 'Fury grants +1.2% Attack for every 1% HP lost. At 1 HP, Helix is one of the hardest hitters in the game. Essential to pair with Meowgik assist for homing coverage.',
    assistHeroes: ['Meowgik', 'Gugu'],
    bestPairs: ['Demon Blade', 'Dragon Ring']
  },
  { 
    id: 'meowgik', name: 'Meowgik', tier: 'S', category: 'Hero', 
    desc: 'Homing Spirit Specialist. Spirits can pass through walls and track enemies with 100% accuracy.', 
    globalBonus120: '+4% Atk (Global)', bestSkin: 'Chef Mew',
    bio: 'A cat from another dimension with a penchant for magic and fish.',
    deepLogic: 'Spirit spawn rate is directly tied to Attack Speed. High speed builds (Bracelet/Locket) turn Meowgik into a constant stream of homing damage.',
    assistHeroes: ['Helix', 'Taranis']
  }
];

export const GEAR_DATA: BaseItem[] = [
  { 
    id: 'c_hammer', name: 'Celestial Hammer', tier: 'SSS', category: 'Weapon', isGodTier: true, 
    desc: 'The current Meta-Dominant weapon. Massive AOE lightning strikes and unique heavy-hit animation.', 
    mythicPerk: 'Final strike deals 300% lightning damage to all nearby enemies.',
    rarityPerks: [
      { rarity: 'Epic', effect: 'Lightning Damage +20%' },
      { rarity: 'Legendary', effect: 'Crit Rate +10%' },
      { rarity: 'Mythic', effect: 'Lightning hits apply "Conductive" (increases damage by 15%)' }
    ],
    deepLogic: 'Requires stutter-stepping to maximize the lightning proc. The heavy-hit chain is slow but deletes elites instantly.',
    bestPairs: ['Celestial Warplate', 'Celestial Talisman']
  },
  { 
    id: 'exp_fist', name: 'Expedition Fist', tier: 'SSS', category: 'Weapon', isGodTier: true, 
    desc: 'Hybrid Melee/Ranged weapon. Unbeatable for single-target DPS and boss melting.', 
    mythicPerk: 'Melee hits restore 15% of damage as HP.',
    rarityPerks: [
      { rarity: 'Epic', effect: 'Melee damage +70%' },
      { rarity: 'Legendary', effect: 'Attack Speed +15%' },
      { rarity: 'Mythic', effect: 'Melee lifesteal and Crit Dmg +50%' }
    ],
    deepLogic: 'Use Melee mode for bosses and Ranged for mobs. The Mythic lifesteal is one of the only reliable ways to heal in high-level Hero mode.',
    bestPairs: ['Expedition Plate', 'Dragon Ring']
  },
  { 
    id: 'c_warplate', name: 'Celestial Warplate', tier: 'SSS', category: 'Armor', isGodTier: true, 
    desc: 'Maximum survivability and Lightning Synergy. Provides flat Damage Resistance (DR).', 
    drPercent: '12% Flat',
    mythicPerk: '+20% Projectile Resistance and +15% Collision Resistance.',
    rarityPerks: [
      { rarity: 'Epic', effect: 'Lightning Damage +15%' },
      { rarity: 'Legendary', effect: 'Max HP +20%' },
      { rarity: 'Mythic', effect: 'DR Cap increased to 80%' }
    ],
    deepLogic: 'In Inferno mode (H90+), you must stack DR. This armor is the cornerstone of any Immortal build.'
  },
  { 
    id: 'demon_blade', name: 'Demon Blade: Rain', tier: 'SS', category: 'Weapon', 
    desc: 'Classic meta choice. High melee damage and unique bleed effects.', 
    mythicPerk: 'Melee hits deal massive bleed damage over 5 seconds.',
    trivia: 'Melee multiplier is actually 1.8x, but "Front Arrow" reduces the individual arrow damage without fully boosting melee.',
    deepLogic: 'Paired with Helix or Melinda, the melee hitbox is larger than it looks. Essential for clearing boss rushes where you can hug the boss.',
    bestPairs: ['Phantom Cloak', 'Bull Ring']
  },
  { 
    id: 'dragon_ring', name: 'Dragon Ring', tier: 'SS', category: 'Ring', 
    desc: 'The best defensive ring in the game. Provides 12% Projectile Resistance.', 
    trivia: 'Projectile Resistance (PR) is capped at 75% in H90+, making other resists more valuable.',
    deepLogic: 'Two Mythic Dragon Rings are mandatory for the 75% Projectile Resistance cap in late-game chapters.'
  },
  {
    id: 'c_bracer', name: 'Celestial Bracer', tier: 'SS', category: 'Bracelet',
    desc: 'Superior offensive bracelet with shock-wave procs.',
    deepLogic: 'Crucial for Inferno Mode (H90+) as Collision Resistance becomes more important than standard PR once caps are hit.',
    rarityPerks: [{ rarity: 'Epic', effect: 'Collision Damage Resistance +10%' }]
  },
  {
    id: 'p_cloak', name: 'Phantom Cloak', tier: 'SS', category: 'Armor',
    desc: 'High projectile resistance and freezing counter-attack.',
    deepLogic: 'Freezing enemies when hit provides crucial breathing room in boss fights.',
    bestPairs: ['Demon Blade', 'Dragon Ring']
  }
];

export const FARMING_ROUTES = [
  { resource: 'Weapon Scrolls', chapter: 'Hero 21 / 28', note: 'Highest drop count per energy spent.' },
  { resource: 'Jewels (Lvl 3+)', chapter: 'Hero 35 / 42', note: 'Best odds for high-level Red/Green jewels.' },
  { resource: 'Bloodstones', chapter: 'Hero 25', note: 'Fastest clear time for bloodstone farming.' }
];

export const ARCHERO_KNOWLEDGE_BASE = `
ARCHERO CORE MECHANICS (2025 DATA):
- Damage Resistance (DR) Cap: Typically 75%, but certain Mythic gear can push it to 80-85%.
- Projectile Resistance: Stacked primarily through Dragon Rings, Celestial Armor, and Bulletproof Locket.
- Collision Resistance: Essential for wave chapters. Found on Golden Chestplate and Celestial Gear.
- Stutter-Stepping: Interrupting the attack animation by tapping or moving slightly. Increases effective DPS by up to 40%.
- Hero Assist: Unlocks at Level 50. Best synergies are Melinda/Wukong/Zeus in various combinations.
- Inferno Mode (H90+): Enemies have 100M+ HP. Requires percent-based damage or insane flat attack (200k+).
`;
