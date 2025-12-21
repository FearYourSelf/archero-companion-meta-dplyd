
import { Hero, BaseItem, Jewel, Relic } from './types';

// --- HERO ROSTER (29 Heroes) ---
export const HERO_DATA: Hero[] = [
  { id: 'zeus', name: 'Zeus', tier: 'SSS', category: 'Hero', isGodTier: true, globalBonus120: '+8% Max HP', desc: 'The Lightning Sovereign. Chain lightning ignores 15% Damage Resistance.', deepLogic: 'MANDATORY for Ch 80+. Lightning scales multiplicatively with Celestial Hammer. 6-Star grants immunity frames.', bestPairs: ['Celestial Hammer', 'Celestial Warplate'], bio: 'The supreme ruler of Olympus. His lightning damage scales with the Celestial Hammer.', trivia: 'First hero to introduce manual lightning strike activation.', uniqueEffect: 'Strikes enemies with chain lightning every 3rd hit.' },
  { id: 'wukong', name: 'Wukong', tier: 'SSS', category: 'Hero', isGodTier: true, globalBonus120: '+8% Attack', desc: 'The Monkey King. Clones inherit 100% stats.', deepLogic: 'Hidden Stat: Innate 20% Fire Resistance. Clones inherit Front Arrow.', bestPairs: ['Expedition Fist', 'Dragon Ring'], bio: 'Born from a stone, he defies the rules of combat with infinite clones.' },
  { id: 'melinda', name: 'Melinda', tier: 'SSS', category: 'Hero', isGodTier: true, globalBonus120: '+5% Dmg to Airborne', desc: 'The Barrage Queen. Best boss killer.', deepLogic: 'Barrage counts as projectile damage. Intensity doubles < 20% HP.', bio: 'A baker with a hidden talent for extreme violence.' },
  { id: 'dragon_girl', name: 'Dragon Girl', tier: 'SS', category: 'Hero', globalBonus120: '+5% Boss Dmg', desc: 'Wyvern Form specialist.', deepLogic: 'Needs 3-Stars to unlock Dragon Crit. Breath reduces healing.' },
  { id: 'taiga', name: 'Taiga', tier: 'SS', category: 'Hero', globalBonus120: '+17% Crit Dmg', desc: 'Meteor Tank.', deepLogic: 'MUST level to 120 for the massive global Crit Damage boost.' },
  { id: 'stella', name: 'Stella', tier: 'SS', category: 'Hero', globalBonus120: '+6% Attack', desc: 'Celestial Caster.' },
  { id: 'elaine', name: 'Elaine', tier: 'SS', category: 'Hero', globalBonus120: '+7% Max HP', desc: 'Defensive Caster.', deepLogic: 'Infinite Red Hearts with Expedition Plate + Cherry Blossom skin.' },
  { id: 'helix', name: 'Helix', tier: 'S', category: 'Hero', globalBonus120: '+5% Max HP', desc: 'The F2P King. Rage Passive.', deepLogic: 'Passive is multiplicative. Essential for F2P.' },
  { id: 'meowgik', name: 'Meowgik', tier: 'S', category: 'Hero', globalBonus120: '+3% Dodge', desc: 'Spirit Summoner.', deepLogic: 'Cat spawn rate tied to Atk Speed.' },
  { id: 'shingen', name: 'Shingen', tier: 'S', category: 'Hero', globalBonus120: '+6% Max HP', desc: 'Melee Speedster.' },
  { id: 'gugu', name: 'Gugu', tier: 'S', category: 'Hero', globalBonus120: '+5% Undead Dmg', desc: 'Owl Guardian.' },
  { id: 'iris', name: 'Iris', tier: 'S', category: 'Hero', globalBonus120: '+5% Attack', desc: 'RNG Master.' },
  { id: 'blazo', name: 'Blazo', tier: 'S', category: 'Hero', globalBonus120: '+6% HP', desc: 'Assassin.' },
  { id: 'bobo', name: 'Bobo', tier: 'A', category: 'Hero', globalBonus120: '+5% Unit Dmg', desc: 'Chaos Debuffer.' },
  { id: 'sylvan', name: 'Sylvan', tier: 'A', category: 'Hero', globalBonus120: '+5% Attack', desc: 'Elementalist.', deepLogic: 'Removes elemental arrows from RNG pool.' },
  { id: 'shade', name: 'Shade', tier: 'A', category: 'Hero', globalBonus120: '+5% HP', desc: 'Shadow Form.' },
  { id: 'ayana', name: 'Ayana', tier: 'A', category: 'Hero', globalBonus120: '+4% Attack', desc: 'Portals.' },
  { id: 'onir', name: 'Onir', tier: 'A', category: 'Hero', globalBonus120: '+20% Healing', desc: 'Holy Light.', deepLogic: '7-Star = Global +10% Projectile Resistance.' },
  { id: 'rolla', name: 'Rolla', tier: 'A', category: 'Hero', globalBonus120: '+5% Attack', desc: 'Ice Queen.' },
  { id: 'ophelia', name: 'Ophelia', tier: 'A', category: 'Hero', globalBonus120: '+120 Attack', desc: 'Soul Hunter.' },
  { id: 'ryan', name: 'Ryan', tier: 'A', category: 'Hero', globalBonus120: '+250 Airborne Dmg', desc: 'Revive Tank.' },
  { id: 'lina', name: 'Lina', tier: 'A', category: 'Hero', globalBonus120: '+5% HP', desc: 'Dancer.' },
  { id: 'aquea', name: 'Aquea', tier: 'A', category: 'Hero', globalBonus120: '+5% Attack', desc: 'Sea Combatant.' },
  { id: 'taranis', name: 'Taranis', tier: 'B', category: 'Hero', globalBonus120: '+4% Attack', desc: 'Thunder.' },
  { id: 'phoren', name: 'Phoren', tier: 'B', category: 'Hero', globalBonus120: '+2% Crit Chance', desc: 'Fire.' },
  { id: 'urasil', name: 'Urasil', tier: 'B', category: 'Hero', globalBonus120: '+15% Crit Dmg', desc: 'Poison.' },
  { id: 'shari', name: 'Shari', tier: 'C', category: 'Hero', globalBonus120: '+8% HP', desc: 'Vine Summoner.' },
  { id: 'bonnie', name: 'Bonnie', tier: 'C', category: 'Hero', globalBonus120: '+5% HP', desc: 'Clone Spammer.' },
  { id: 'atreus', name: 'Atreus', tier: 'C', category: 'Hero', globalBonus120: '+7% Proj Resist', desc: 'The Rookie.', deepLogic: 'Mandatory for 100% Immunity Build.' }
];

// --- GEAR ARMORY (Exhaustive) ---
export const GEAR_DATA: BaseItem[] = [
  // WEAPONS
  { id: 'celestial_hammer', name: 'Celestial Hammer', tier: 'SSS', category: 'Weapon', desc: 'Lightning Melee/Ranged.', mythicPerk: '300% Lightning Dmg.', deepLogic: 'Requires Stutter-stepping. 1.9x Multiplier.', uniqueEffect: 'Switches between melee and ranged based on distance.' },
  { id: 'exp_fist', name: 'Expedition Fist', tier: 'SSS', category: 'Weapon', desc: 'Hybrid Melee.', mythicPerk: 'Heals 15% Dmg.', deepLogic: 'Melee has immunity frames.' },
  { id: 'ant_sword', name: 'Antiquated Sword', tier: 'SS', category: 'Weapon', desc: 'Whirlwind Active.', deepLogic: 'Whirlwind grants Invincibility.' },
  { id: 'demon_blade', name: 'Demon Blade', tier: 'SS', category: 'Weapon', desc: 'Melee 1.8x Dmg.', deepLogic: 'Avoid Front Arrow.' },
  { id: 'stalker_staff', name: 'Stalker Staff', tier: 'S', category: 'Weapon', desc: 'Homing.', deepLogic: 'Stack Diagonal Arrows.' },
  { id: 'brightspear', name: 'Brightspear', tier: 'A', category: 'Weapon', desc: 'Instant Hitscan.' },
  { id: 'death_scythe', name: 'Death Scythe', tier: 'A', category: 'Weapon', desc: 'Headshot low HP.' },
  { id: 'tornado', name: 'Tornado', tier: 'A', category: 'Weapon', desc: 'Pierce/Return.' },
  { id: 'gale_force', name: 'Gale Force', tier: 'B', category: 'Weapon', desc: 'Charged Shot.' },
  { id: 'saw_blade', name: 'Saw Blade', tier: 'C', category: 'Weapon', desc: 'Fast Atk.' },
  { id: 'brave_bow', name: 'Brave Bow', tier: 'C', category: 'Weapon', desc: 'Basic Crit.' },

  // ARMOR
  { id: 'c_warplate', name: 'Celestial Warplate', tier: 'SSS', category: 'Armor', desc: 'Lightning Resist.', deepLogic: 'Mandatory for H90+ Collision Resist.' },
  { id: 'exp_plate', name: 'Expedition Plate', tier: 'SSS', category: 'Armor', desc: 'Heart Gen.', deepLogic: 'Heals % HP on hit.' },
  { id: 'phantom_cloak', name: 'Phantom Cloak', tier: 'SS', category: 'Armor', desc: 'Freeze on hit.', deepLogic: 'Freeze ignores boss immunity.' },
  { id: 'bright_robe', name: 'Bright Robe', tier: 'A', category: 'Armor', desc: 'XP Boost + Front Resist.' },
  { id: 'shadow_robe', name: 'Shadow Robe', tier: 'A', category: 'Armor', desc: 'Dark Dmg.' },
  { id: 'void_robe', name: 'Void Robe', tier: 'B', category: 'Armor', desc: 'Poison Room.' },
  { id: 'vest_dex', name: 'Vest of Dexterity', tier: 'B', category: 'Armor', desc: 'Dodge +7%.' },
  { id: 'golden_chest', name: 'Golden Chestplate', tier: 'C', category: 'Armor', desc: 'Flat Dmg Reduction.' },

  // RINGS
  { id: 'dragon_ring', name: 'Dragon Ring', tier: 'SS', category: 'Ring', desc: '+12% Proj Resist.', deepLogic: 'Immunity Formula: 2x Dragon Rings + Phantom Cloak + Atreus/Onir.' },
  { id: 'celestial_band', name: 'Celestial Band', tier: 'SS', category: 'Ring', desc: 'Chain Lightning.' },
  { id: 'bull_ring', name: 'Bull Ring', tier: 'S', category: 'Ring', desc: '+10% Dmg Resist.' },
  { id: 'lion_ring', name: 'Lion Ring', tier: 'S', category: 'Ring', desc: '+Crit Dmg.' },
  { id: 'vilebat_ring', name: 'Vilebat Ring', tier: 'A', category: 'Ring', desc: 'Heal on Kill.' },
  { id: 'wolf_ring', name: 'Wolf Ring', tier: 'B', category: 'Ring', desc: 'Melee Crit.' },
  { id: 'serpent_ring', name: 'Serpent Ring', tier: 'B', category: 'Ring', desc: 'Dodge.' },
  { id: 'falcon_ring', name: 'Falcon Ring', tier: 'C', category: 'Ring', desc: 'Atk Speed.' },
  { id: 'bear_ring', name: 'Bear Ring', tier: 'C', category: 'Ring', desc: 'HP + Ground Dmg.' },

  // BRACELETS
  { id: 'shield_bracer', name: 'Shield Bracelet', tier: 'SS', category: 'Bracelet', desc: 'Block + Crit.' },
  { id: 'celestial_bracer', name: 'Celestial Bracer', tier: 'SS', category: 'Bracelet', desc: 'Shockwave.' },
  { id: 'invincible_bracer', name: 'Invincible Bracelet', tier: 'S', category: 'Bracelet', desc: '2.5s God Mode.' },
  { id: 'quickshot', name: 'Quickshot Bracelet', tier: 'A', category: 'Bracelet', desc: '+6% Atk.' },
  { id: 'thunder_bracer', name: 'Thunder Bracelet', tier: 'B', category: 'Bracelet', desc: 'Random Zap.' },
  { id: 'frozen_bracer', name: 'Frozen Bracelet', tier: 'B', category: 'Bracelet', desc: 'Room Freeze.' },

  // LOCKETS
  { id: 'bulletproof', name: 'Bulletproof Locket', tier: 'SS', category: 'Locket', desc: 'Proj Resist < 25% HP.', deepLogic: '+30% Resist when low HP. Key to immunity.' },
  { id: 'celestial_talisman', name: 'Celestial Talisman', tier: 'SS', category: 'Locket', desc: 'MP Gen.' },
  { id: 'exp_locket', name: 'Expedition Locket', tier: 'S', category: 'Locket', desc: 'Time dilation.' },
  { id: 'angel_locket', name: 'Angel Locket', tier: 'A', category: 'Locket', desc: 'Revive Chance.' },
  { id: 'bloodthirsty', name: 'Bloodthirsty Locket', tier: 'A', category: 'Locket', desc: 'Heal on Kill.' },
  { id: 'agile_locket', name: 'Agile Locket', tier: 'B', category: 'Locket', desc: 'Dodge Low HP.' },

  // BOOKS
  { id: 'enlightenment', name: 'Enlightenment', tier: 'SS', category: 'Book', desc: 'Extra Skills.' },
  { id: 'arcanum_time', name: 'Arcanum of Time', tier: 'SS', category: 'Book', desc: 'Time Stop.' },
  { id: 'giant_contract', name: 'Giants Contract', tier: 'S', category: 'Book', desc: 'Melee Shield.' },
  { id: 'art_combat', name: 'Art of Combat', tier: 'A', category: 'Book', desc: 'Knockback.' },
  { id: 'arcane_archer', name: 'Arcane Archer', tier: 'A', category: 'Book', desc: 'Staff Synergy.' },

  // DRAGONS
  { id: 'magmar', name: 'Magmar', tier: 'SS', category: 'Dragon', desc: 'Mana Regen + Fire.' },
  { id: 'necrogon', name: 'Necrogon', tier: 'S', category: 'Dragon', desc: 'Proj Resist + Shield.' },
  { id: 'shadex', name: 'Shadex', tier: 'S', category: 'Dragon', desc: 'Collision Immunity.' },
  { id: 'geogon', name: 'Geogon', tier: 'A', category: 'Dragon', desc: 'Rock Shield.' },
  { id: 'stormra', name: 'Stormra', tier: 'A', category: 'Dragon', desc: 'Lightning.' },

  // PETS & SPIRITS
  { id: 'frothy', name: 'Frothy Capy', tier: 'SS', category: 'Pet', desc: 'Immunity Bubble.', deepLogic: 'Standing in bubble = 100% Dmg Immunity.' },
  { id: 'unicorn', name: 'Empyrean Unicorn', tier: 'SS', category: 'Pet', desc: 'Stat Transfer.' },
  { id: 'blitzbeak', name: 'Furious Blitzbeak', tier: 'S', category: 'Pet', desc: 'High DPS.' },
  { id: 'laser_bat', name: 'Laser Bat', tier: 'A', category: 'Spirit', desc: 'Wall Pierce.', deepLogic: 'Use for Wingman only.' },
  { id: 'noisy_owl', name: 'Noisy Owl', tier: 'A', category: 'Spirit', desc: 'Knockback.' },

  // EGGS & TOTEMS
  { id: 'fire_demon', name: 'Fire Demon', tier: 'SS', category: 'Egg', desc: '+Crit Dmg.' },
  { id: 'ice_mage', name: 'Ice Mage', tier: 'S', category: 'Egg', desc: '+Dmg to Airborne.' },
  { id: 'totem_might', name: 'Totem of Might', tier: 'SS', category: 'Totem', desc: '+% Hero Skin Stats.' },
  { id: 'totem_celerity', name: 'Totem of Celerity', tier: 'S', category: 'Totem', desc: '+% Equipment Stats.' }
];

export const JEWEL_DATA: Jewel[] = [
  { id: 'ruby', name: 'Ruby (Red)', color: 'Red', statPerLevel: '+Attack', bonus16: '+5% Attack', bonus28: '+8% Crit Damage' },
  { id: 'kunzite', name: 'Kunzite (Red)', color: 'Red', statPerLevel: '+Attack', bonus16: '+5% Boss Dmg', bonus28: '+10% Mob Dmg' },
  { id: 'lapis', name: 'Lapis (Blue)', color: 'Blue', statPerLevel: '+HP', bonus16: '+5% HP', bonus28: '+5% Dmg Resist' },
  { id: 'sapphire', name: 'Sapphire (Blue)', color: 'Blue', statPerLevel: '+HP', bonus16: '+10% Hearts', bonus28: '+10% Proj Resist' },
  { id: 'topaz', name: 'Topaz (Yellow)', color: 'Yellow', statPerLevel: '+Crit', bonus16: '+5% Crit Dmg', bonus28: '+10% Elem Dmg' },
];

export const RELIC_DATA: Relic[] = [
  { id: 'holy_grail', name: 'Holy Grail', tier: 'Holy', effect: '+HP%', setBonus: 'Radiant Lustre (Relic Drop Rate)' },
  { id: 'demon_eye', name: 'Demon King Eye', tier: 'Holy', effect: '+Crit Dmg%', setBonus: 'Dark Power (+Proj Resist)' },
  { id: 'sword_stone', name: 'Sword in Stone', tier: 'Holy', effect: '+Attack%', setBonus: 'Hero Power (+Attack)' },
  { id: 'golden_mask', name: 'Golden Mask', tier: 'Radiant', effect: '+Crit Chance' },
  { id: 'arrowhead', name: 'Arrowhead', tier: 'Faint', effect: '+Projectile Speed' },
];

export const FARMING_ROUTES = [
  { resource: 'Gear / Runes', chapter: 'Hero 5 (Anomaly)', note: 'Code anomaly allows H5 to drop more items than endgame.' },
  { resource: 'Scrolls', chapter: 'Hero 28', note: 'Highest density of mobs.' },
  { resource: 'Jewels', chapter: 'Hero 35', note: 'Best drop rate for Lvl 3 Jewels.' },
  { resource: 'Gold', chapter: 'Up-Close Dangers', note: 'Daily Event. Highest yields.' },
  { resource: 'Totems', chapter: 'N80+ / H75+', note: 'Unlock threshold.' }
];

export const ARCHERO_KNOWLEDGE_BASE = `
ARCHERO CORE MECHANICS (2025 DATA):
- Damage Resistance (DR) Cap: Typically 75%, but certain Mythic gear can push it to 80-85%.
- Projectile Resistance: Stacked primarily through Dragon Rings, Celestial Armor, and Bulletproof Locket.
- Collision Resistance: Essential for wave chapters. Found on Golden Chestplate and Celestial Gear.
- Stutter-Stepping: Interrupting the attack animation by tapping or moving slightly. Increases effective DPS by up to 40%.
- 100% Resistance Build: Possible with 2x Dragon Rings + Phantom Cloak + Atreus/Onir Global + Bulletproof Locket.
`;
