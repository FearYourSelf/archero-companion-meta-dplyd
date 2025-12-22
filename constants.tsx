
import { Hero, BaseItem, Jewel, Relic } from './types';

// --- 1. HERO ROSTER (Comprehensive V6.3) ---
export const HERO_DATA: Hero[] = [
  { 
    id: 'zeus', name: 'Zeus', tier: 'SSS', category: 'Hero', isGodTier: true, globalBonus120: '+8% Max HP', 
    desc: 'The Lightning Sovereign.', deepLogic: 'Lightning chains ignore 15% Dmg Resist. At 6-stars, chain jumps have no range limit.', 
    evo4Star: 'Sustained attacks ramp up Atk Speed permanently for the room.', bestPairs: ['Celestial Hammer', 'Celestial Warplate'],
    bio: 'A celestial entity who descended to purge the darkness with righteous thunder.',
    bestSkin: 'Olympus Overlord', shardCost: '50 (Premium)', assistHeroes: ['Wukong', 'Stella'],
    trivia: 'Currently the highest DPS hero in the game for wave chapters.',
    uniqueEffect: 'Thunder Chain: Hits bounce to 3 nearby enemies.'
  },
  { 
    id: 'wukong', name: 'Wukong', tier: 'SSS', category: 'Hero', isGodTier: true, globalBonus120: '+8% Attack', 
    desc: 'Master of transformation.', deepLogic: 'Golden Cudgel blocks projectiles. Clones inherit 50% Crit Rate.', 
    evo4Star: 'Phantom Hair: Spawns mirror decoy every 10s.', bestPairs: ['Expedition Fist', 'Phantom Cloak'],
    bio: 'The Monkey King, escaped from his mountain prison to seek new challenges.',
    bestSkin: 'Cosmic Traveler', shardCost: '50 (Premium)', assistHeroes: ['Zeus', 'Dragon Girl'],
    trivia: 'His clones count as "Spirits" for certain equipment buffs.'
  },
  { 
    id: 'melinda', name: 'Melinda', tier: 'SSS', category: 'Hero', isGodTier: true, globalBonus120: '+5% Dmg to All Units', 
    desc: 'The Barrage Queen.', deepLogic: 'Barrage intensity increases by 2% for every 1% HP missing.', 
    evo4Star: 'Barrage gains homing effect.', bestPairs: ['Expedition Fist', 'Dragon Ring'],
    bio: 'A high-society sharpshooter who prefers the heat of battle to the ballroom.',
    bestSkin: 'Baker Melinda', shardCost: '50 (Premium)', assistHeroes: ['Iris', 'Elaine'],
    trivia: 'Her Barrage skill is considered a "Physical" attack and benefits from raw ATK buffs.'
  },
  { id: 'dragon_girl', name: 'Dragon Girl', tier: 'SS', category: 'Hero', globalBonus120: '+5% Dmg to Ranged', desc: 'Dragon companion warrior.', deepLogic: 'Hits trigger "Dragon Mark" for 200% burst.', evo4Star: 'Dragon Breath applies Burn.', bestPairs: ['Demon Blade'], bio: 'Raised by dragons in the forgotten peaks.', shardCost: '40 Shards' },
  { id: 'taiga', name: 'Taiga', tier: 'SS', category: 'Hero', globalBonus120: '+17% Crit Damage', desc: 'Meteor-calling monk.', deepLogic: 'Meteors scale with Skill Damage artifacts.', bestPairs: ['Brightspear'], bio: 'A monk from the Far East who controls the falling stars.', shardCost: '40 Shards' },
  { id: 'stella', name: 'Stella', tier: 'SS', category: 'Hero', globalBonus120: '+5% Dmg to Melee', desc: 'Star-weaver mage.', deepLogic: 'Star-power builds up to trigger a screen-wide supernova.', bestPairs: ['Celestial Hammer'], bio: 'She weaves the constellations into deadly weapons.', shardCost: '40 Shards' },
  { id: 'elaine', name: 'Elaine', tier: 'SS', category: 'Hero', globalBonus120: '+7% Max HP', desc: 'Cherry blossom shields.', deepLogic: 'Shields block contact damage and projectiles.', bestPairs: ['Expedition Plate'], bio: 'The guardian of the sacred sakura tree.', shardCost: '40 Shards' },
  { id: 'iris', name: 'Iris', tier: 'S', category: 'Hero', globalBonus120: '+5% Attack Speed', desc: 'The wind-born archer.', deepLogic: 'Increases dodge after moving 3 meters.', bestPairs: ['Vest of Dexterity'], shardCost: '30 Shards' },
  { id: 'blazo', name: 'Blazo', tier: 'S', category: 'Hero', globalBonus120: '+6% Crit Rate', desc: 'Demonic gunslinger.', deepLogic: 'Overheat mechanic triples damage but slows movement.', bestPairs: ['Demon Blade'], shardCost: '30 Shards' },
  { id: 'shingen', name: 'Shingen', tier: 'S', category: 'Hero', globalBonus120: '+10% Crit Damage', desc: 'The blade master.', deepLogic: 'Attacks faster as he hits the same enemy.', bestPairs: ['Demon Blade'], shardCost: '30 Shards' },
  { id: 'lina', name: 'Lina', tier: 'S', category: 'Hero', globalBonus120: '+5% Dmg to Grounded', desc: 'Summons dancers.', deepLogic: 'Dancers apply a stacking slow to all enemies.', bestPairs: ['Brightspear'], shardCost: '30 Shards' },
  { id: 'gugu', name: 'Gugu', tier: 'S', category: 'Hero', globalBonus120: '+20% Healing Effect', desc: 'Owl guardian.', deepLogic: 'Birds provide 30% damage reduction shields.', bestPairs: ['Bull Ring'], shardCost: 'Free (Guild Store)' },
  { id: 'shade', name: 'Shade', tier: 'S', category: 'Hero', globalBonus120: '+5% Attack', desc: 'The shadow assassin.', deepLogic: 'Shadow form grants +75% Attack Speed and +25% Dmg.', bestPairs: ['Demon Blade'], shardCost: '30 Shards' },
  { id: 'sylvan', name: 'Sylvan', tier: 'S', category: 'Hero', globalBonus120: '+5% Max HP', desc: 'Elf prince.', deepLogic: 'Removes elemental skills from RNG pool, inherent elemental master.', bestPairs: ['Brightspear'], shardCost: '30 Shards' },
  { id: 'helix', name: 'Helix', tier: 'S', category: 'Hero', globalBonus120: '+6% Max HP', desc: 'The OG Fury king.', deepLogic: 'Damage increases as HP drops. Highest stability.', bestPairs: ['Demon Blade'], bio: 'The son of a legendary warrior who draws power from his wounds.', shardCost: '1500 Gems' },
  { id: 'meowgik', name: 'Meowgik', tier: 'A', category: 'Hero', globalBonus120: '+5% Attack', desc: 'The kitten mage.', deepLogic: 'Spawns homing kittens that ignore walls.', bestPairs: ['Brightspear'], shardCost: '1800 Gems' },
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
  { id: 'exp_fist', name: 'Expedition Fist', tier: 'SSS', category: 'Weapon', desc: 'Hybrid Fist.', mythicPerk: 'Titan: Weapon Dmg +15% (Final Multiplier).', deepLogic: 'Melee hits heal 15% Dmg. Maintains Combo stacks while moving.' },
  { id: 'celestial_hammer', name: 'Celestial Hammer', tier: 'SSS', category: 'Weapon', desc: 'Lightning Hammer.', mythicPerk: 'Titan: Perpetual Charge.', deepLogic: 'Lightning form pierces walls. Pairs with Warplate for Chain Lightning.' },
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
  { id: 'peach', name: 'Peach Book', tier: 'C', category: 'Book', desc: 'Heal.' },

  // --- SPIRITS ---
  { id: 'laser_bat', name: 'Laser Bat', tier: 'A', category: 'Spirit', desc: 'Wall Pierce.', deepLogic: 'Shoots through walls. Best for applying Element debuffs safely.' },
  { id: 'noisy_owl', name: 'Noisy Owl', tier: 'A', category: 'Spirit', desc: 'Knockback.', deepLogic: 'Good for knockback, but can mess up melee grouping.' },
  { id: 'flaming_ghost', name: 'Flaming Ghost', tier: 'B', category: 'Spirit', desc: 'Pierce.', deepLogic: 'Decent on-hit effects.' },
  { id: 'scythe_mage', name: 'Scythe Mage', tier: 'C', category: 'Spirit', desc: 'Bounce.' },
  { id: 'elf', name: 'Elf', tier: 'C', category: 'Spirit', desc: 'Fast Atk.' },
  { id: 'living_bomb', name: 'Living Bomb', tier: 'D', category: 'Spirit', desc: 'Useless.' },

  // --- DRAGONS ---
  { id: 'magmar', name: 'Magmar', tier: 'SS', category: 'Dragon', dragonType: 'Attack', desc: 'Mana Regen.' },
  { id: 'starrite', name: 'Starrite', tier: 'SS', category: 'Dragon', dragonType: 'Balance', desc: 'Meteors.' },
  { id: 'voideon', name: 'Voideon', tier: 'SS', category: 'Dragon', dragonType: 'Defense', desc: 'Portals.' },
  { id: 'necrogon', name: 'Necrogon', tier: 'S', category: 'Dragon', dragonType: 'Balance', desc: 'Proj Resist.' },
  { id: 'shadex', name: 'Shadex', tier: 'S', category: 'Dragon', dragonType: 'Defense', desc: 'Collision Immune.' },
  { id: 'geogon', name: 'Geogon', tier: 'A', category: 'Dragon', dragonType: 'Defense', desc: 'Rock Shield.' },
  { id: 'stormra', name: 'Stormra', tier: 'A', category: 'Dragon', dragonType: 'Attack', desc: 'Lightning.' },
  { id: 'jadeon', name: 'Jadeon', tier: 'B', category: 'Dragon', dragonType: 'Balance', desc: 'Gold.' },
  { id: 'ferron', name: 'Ferron', tier: 'B', category: 'Dragon', dragonType: 'Attack', desc: 'Slash.' },
  { id: 'noxion', name: 'Noxion', tier: 'C', category: 'Dragon', dragonType: 'Defense', desc: 'Poison.' },
  { id: 'glaciem', name: 'Glaciem', tier: 'C', category: 'Dragon', dragonType: 'Balance', desc: 'Ice.' },

  // --- PETS (New Ground Units) ---
  { id: 'frothy', name: 'Frothy Capy', tier: 'SS', category: 'Pet', desc: 'Immunity Bubble.', deepLogic: 'Bubble = 100% Immunity.' },
  { id: 'unicorn', name: 'Empyrean Unicorn', tier: 'SS', category: 'Pet', desc: 'Block %.' },
  { id: 'blitzbeak', name: 'Furious Blitzbeak', tier: 'S', category: 'Pet', desc: 'Lightning.' },
  { id: 'bone_warrior', name: 'Bone Warrior', tier: 'A', category: 'Pet', desc: 'Melee Tank.' },

  // --- TOTEMS ---
  { id: 'totem_might', name: 'Totem of Might', tier: 'SS', category: 'Totem', desc: 'Hero Stats %.' },
  { id: 'totem_celerity', name: 'Totem of Celerity', tier: 'S', category: 'Totem', desc: 'Gear Stats %.' },
  { id: 'totem_vigor', name: 'Totem of Vigor', tier: 'A', category: 'Totem', desc: 'HP.' },

  // --- EGGS ---
  { id: 'fire_demon', name: 'Fire Demon', tier: 'SS', category: 'Egg', desc: 'Crit Dmg +5%.' },
  { id: 'ice_mage', name: 'Ice Mage', tier: 'S', category: 'Egg', desc: 'Airborne Dmg.' },
  { id: 'scarlet_mage', name: 'Scarlet Mage', tier: 'S', category: 'Egg', desc: 'Crit Chance.' },

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
  { id: 'golden_apple', name: 'Golden Apple', tier: 'Radiant', effect: 'Max HP +1200', setBonus: 'Fruity Fortune', iconType: 'Gem', lore: 'Looks delicious, but it\'s actually hard as rock.', source: 'Normal Chapters', stars: ['1★: Max HP +500', '2★: Dropped HP Hearts +20%', '3★: Healing +5%'] },
  { id: 'mirror_of_truth', name: 'Mirror of Truth', tier: 'Radiant', effect: 'Crit Chance +3%', setBonus: 'Clear Vision', iconType: 'Eye', lore: 'Shows the enemy exactly where they are weak.', source: 'Hero Chapters', stars: ['1★: Crit Dmg +5%', '2★: Accuracy +10%', '3★: Dodge +2%'] },
  { id: 'ancient_map', name: 'Ancient Map', tier: 'Radiant', effect: 'Movement Speed +5%', setBonus: 'Pathfinder', iconType: 'Scroll', lore: 'A map of lands that no longer exist.', source: 'Expedition Mode', stars: ['1★: Trap Damage -20%', '2★: Gold +10%', '3★: Collision Resist +5%'] },
  { id: 'hero_cape_relic', name: 'Hero\'s Cape', tier: 'Radiant', effect: 'Damage to Elites +8%', setBonus: 'Valiant Set', iconType: 'Shield', lore: 'Tattered but radiating courage.', source: 'Daily Challenges', stars: ['1★: Max HP +3%', '2★: Attack +2%', '3★: Dmg to Bosses +5%'] },
  { id: 'broken_sword_relic', name: 'Broken Sword', tier: 'Faint', effect: 'Attack +150', setBonus: 'Warrior Remnant', iconType: 'Sword', lore: 'A simple piece of steel with history.', source: 'Common Drops', stars: ['1★: Attack +50', '2★: Melee Dmg +3%', '3★: Attack Speed +2%'] },
  { id: 'rusty_key_relic', name: 'Rusty Key', tier: 'Faint', effect: 'Gold Drop +5%', setBonus: 'Scavenger', iconType: 'Gem', lore: 'Probably doesn\'t open anything important.', source: 'Common Drops', stars: ['1★: Gold +2%', '2★: Dropped Gear Rate +1%', '3★: XP +5%'] },
  { id: 'dusty_tome_relic', name: 'Dusty Tome', tier: 'Faint', effect: 'Skill Damage +5%', setBonus: 'Scholar', iconType: 'Book', lore: 'The writing is almost faded away.', source: 'Common Drops', stars: ['1★: Mana Regen +5%', '2★: Book Energy +10%', '3★: Spellbook Effect +5%'] }
];

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

export interface DragonInfo {
  id: string;
  name: string;
  type: 'Attack' | 'Defense' | 'Balance';
  lore: string;
  skill: string;
  passive: string;
}

export const DRAGON_DATA: DragonInfo[] = [
  { id: 'magmar', name: 'Magmar', type: 'Attack', lore: 'Born from dying stars.', skill: 'Vulcan Pulse: Ignores 50% enemy DR.', passive: 'Converts lost HP to Book Energy.' },
  { id: 'voideon', name: 'Voideon', type: 'Defense', lore: 'Exists between dimensions.', skill: 'Void Shield: 2s total invulnerability.', passive: 'Increases Dodge when stationary.' },
  { id: 'starrite', name: 'Starrite', type: 'Balance', lore: 'Fallen from the Phoenix constellation.', skill: 'Star Rain: Burn and Stun meteors.', passive: 'Balanced Attack/HP +5%.' },
  { id: 'jadeon', name: 'Jadeon', type: 'Balance', lore: 'Guardian of nature secrets.', skill: 'Emerald Growth: HP Regen.', passive: 'Reduces Trap Damage.' },
  { id: 'ferron', name: 'Ferron', type: 'Attack', lore: 'Mechanical war relic.', skill: 'Iron Blitz: +40% Atk Spd.', passive: 'Gain Crit Dmg per kill.' }
];

export const REFINE_TIPS = [
  "Efficiency Check: Never refine items needed for Mythic fuses.",
  "Essence Priority: Focus on Weapon slots first for maximum impact.",
  "Smelt Protocol: Ancient Legendaries yield the best late-game efficiency."
];
