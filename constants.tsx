
import { Hero, BaseItem } from './types';

export const HERO_DATA: Hero[] = [
  { 
    id: 'zeus', 
    name: 'Zeus', 
    tier: 'SSS', 
    category: 'Hero', 
    isGodTier: true, 
    desc: 'Lightning Sovereign. 6-Star = Immunity frames.', 
    globalBonus120: '+8% HP', 
    bio: 'The supreme ruler of Olympus. His lightning damage scales with the Celestial Hammer.', 
    deepLogic: 'MANDATORY for Ch 80+. High skill ceiling with Godbolt procs.', 
    bestPairs: ['Celestial Hammer', 'Celestial Warplate'],
    shardCost: '50 Shards',
    bestSkin: 'Thunder Lord (Mythic)',
    trivia: 'First hero to introduce manual lightning strike activation.',
    uniqueEffect: 'Strikes enemies with chain lightning every 3rd hit.',
    rarityPerks: [
      { rarity: 'Mythic', effect: 'Lightning bounces +2 additional times.' },
      { rarity: 'Chaos', effect: '10% chance to cast Thunder Storm on room entry.' }
    ]
  },
  { 
    id: 'wukong', 
    name: 'Wukong', 
    tier: 'SSS', 
    category: 'Hero', 
    isGodTier: true, 
    desc: 'Monkey King. Clones inherit stats.', 
    globalBonus120: '+8% Attack', 
    bio: 'Born from a stone, he defies the rules of combat with infinite clones.', 
    deepLogic: 'Hidden 20% Fire Resist. Clones carry 100% of your Crit stats.', 
    bestPairs: ['Expedition Fist', 'Dragon Ring'],
    shardCost: '100 Shards',
    bestSkin: 'Immortal Sage',
    trivia: 'Based on the protagonist of Journey to the West.',
    uniqueEffect: 'Summons a mirror image after every 10 projectiles fired.',
    rarityPerks: [
      { rarity: 'Titan Tales', effect: 'Clones gain 50% extra attack speed.' }
    ]
  },
  { id: 'melinda', name: 'Melinda', tier: 'SSS', category: 'Hero', isGodTier: true, desc: 'Barrage Specialist. Best boss killer.', globalBonus120: '+5% Airborne Dmg', bio: 'A baker with a hidden talent for extreme violence.', deepLogic: 'Barrage counts as projectile damage. Multiplies at low HP.', bestPairs: ['Homing Staff'] },
  { id: 'dragon_girl', name: 'Dragon Girl', tier: 'SS', category: 'Hero', desc: 'Wyvern Form. Breath reduces healing.', globalBonus120: '+5% Boss Dmg', bio: 'Raised by dragons, she channels primal fury.' },
  { id: 'helix', name: 'Helix', tier: 'S', category: 'Hero', desc: 'F2P King. Rage Passive.', globalBonus120: '+5% HP', bio: 'The half-beast warrior who thrives on pain.' },
  { id: 'meowgik', name: 'Meowgik', tier: 'S', category: 'Hero', desc: 'Spirit Summoner.', globalBonus120: '+3% Dodge', bio: 'A cat mage whose feline spirits are deadly.' },
  { id: 'onir', name: 'Onir', tier: 'A', category: 'Hero', desc: 'Holy Light.', globalBonus120: '+20% Healing', bio: 'Mandatory 7-Star for +10% Proj Resist.' },
  { id: 'atreus', name: 'Atreus', tier: 'C', category: 'Hero', desc: 'The Rookie.', globalBonus120: '+7% Projectile Resist', bio: 'The starting hero. Essential for Immunity Build.' },
];

export const GEAR_DATA: BaseItem[] = [
  { 
    id: 'c_hammer', 
    name: 'Celestial Hammer', 
    tier: 'SSS', 
    category: 'Weapon', 
    isGodTier: true, 
    desc: 'Lightning Melee switch.', 
    deepLogic: 'Requires stutter-stepping. Final strike 300% Dmg.',
    mythicPerk: 'Lightning strike radius increased by 50%.',
    uniqueEffect: 'Switches between melee and ranged based on distance.',
    trivia: 'Part of the 2024 Anniversary Set.',
    rarityPerks: [
      { rarity: 'Mythic', effect: 'Attack speed +15% when in Melee mode.' },
      { rarity: 'Chaos', effect: 'Chain lightning procs on every critical strike.' }
    ]
  },
  { 
    id: 'e_fist', 
    name: 'Expedition Fist', 
    tier: 'SSS', 
    category: 'Weapon', 
    isGodTier: true, 
    desc: 'Hybrid Melee Heal.', 
    deepLogic: 'Melee phase has collision immunity frames.',
    mythicPerk: 'Lifesteal increased to 5% per hit.',
    uniqueEffect: 'Creates a healing aura on crit.'
  },
  { id: 'd_blade', name: 'Demon Blade', tier: 'SS', category: 'Weapon', desc: 'Melee (1.8x Dmg).', deepLogic: 'Avoid Front Arrow to maximize melee strike rate.' },
  { id: 'd_ring', name: 'Dragon Ring', tier: 'SS', category: 'Ring', desc: '+12% Proj Resist.', deepLogic: 'The meta choice for the 100% immunity formula.' },
  { id: 'c_warplate', name: 'Celestial Warplate', tier: 'SSS', category: 'Armor', desc: 'Lightning Resist.', deepLogic: 'Mandatory for H90+ Collision Resistance builds.' },
  { id: 'b_locket', name: 'Bulletproof Locket', tier: 'SS', category: 'Locket', desc: 'Proj Resist (Low HP).', deepLogic: 'Key to staying immortal at critical health.' },
];

export const FARMING_ROUTES = [
  { resource: 'The H5 Anomaly', chapter: 'Hero 5', note: 'Highest drop rate for common gear per run.' },
  { resource: 'Scrolls', chapter: 'Hero 28', note: 'Fastest mob density for scroll farming.' },
  { resource: 'Totems', chapter: 'N80+ / H75+', note: 'Unlock threshold for Estate resource drops.' },
  { resource: 'Gold/XP', chapter: 'Up-Close Dangers', note: 'Daily Event. Essential for Level 120 pushes.' },
  { resource: 'Jewels', chapter: 'Hero 35', note: 'Best drop rate for Level 3 Jewels.' }
];

export const ARCHERO_KNOWLEDGE_BASE = `
ARCHERO CORE MECHANICS (2025 DATA):
- Damage Resistance (DR) Cap: Typically 75%, but certain Mythic gear can push it to 80-85%.
- Projectile Resistance: Stacked primarily through Dragon Rings, Celestial Armor, and Bulletproof Locket.
- Collision Resistance: Essential for wave chapters. Found on Golden Chestplate and Celestial Gear.
- Stutter-Stepping: Interrupting the attack animation by tapping or moving slightly. Increases effective DPS by up to 40%.
- 100% Resistance Build: Possible with 2x Dragon Rings + Phantom Cloak + Atreus/Onir Global + Bulletproof Locket.
`;
