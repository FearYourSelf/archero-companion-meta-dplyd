
import { Hero, BaseItem } from './types';

export const HERO_DATA: Hero[] = [
  { 
    id: 'zeus', name: 'Zeus', tier: 'SSS', category: 'Hero', isGodTier: true, 
    desc: 'Lightning God. Absolute peak stats. Chain lightning hits jump 5+ times.', 
    globalBonus120: '+8% Max HP', bestSkin: 'Thunder Overlord', evo4Star: 'Lightning chain +2',
    bio: 'The ruler of the gods, controlling the power of the sky and lightning.',
    trivia: 'Zeus\'s chain lightning ignores 15% of enemy damage resistance.'
  },
  { 
    id: 'wukong', name: 'Wukong', tier: 'SSS', category: 'Hero', isGodTier: true, 
    desc: 'Monkey King. Utility God. Clones inherit 100% Attack.', 
    globalBonus120: '+10% Max HP', bestSkin: 'Celestial Sage',
    bio: 'Master of the 72 transformations and wielder of the Ruyi Jingu Bang.',
    trivia: 'Clones benefit from current Crit Rate but don\'t trigger "on-kill" perks.'
  },
  { 
    id: 'melinda', name: 'Melinda', tier: 'SSS', category: 'Hero', isGodTier: true, 
    desc: 'Best Burst DPS. Barrage scales with Lost HP.', 
    globalBonus120: '+5% Global Atk', bestSkin: 'Baking Sweetie',
    bio: 'A playful soul with arrows as swift as her wit.',
    trivia: 'Barrage arrows are projectile damage and benefit from Brawler perks.'
  },
  { 
    id: 'helix', name: 'Helix', tier: 'S', category: 'Hero', 
    desc: 'F2P King. Rage ability increases Atk as HP drops.', 
    globalBonus120: '+5% Crit Chance', bestSkin: 'Bear Man',
    bio: 'A tribal warrior who grows stronger as the battle grows bleaker.',
    trivia: 'Rage provides +1.2% Attack for every 1% of HP lost.'
  },
  { 
    id: 'taranis', name: 'Taranis', tier: 'B', category: 'Hero', 
    desc: 'Thunder specialist.', 
    globalBonus120: '+50% Crit Damage',
    bio: 'The prodigy of lightning magic.',
    trivia: 'Absolute mandatory hero for late game due to +50% Crit Damage global.'
  },
  { 
    id: 'atreus', name: 'Atreus', tier: 'F', category: 'Hero', 
    desc: 'The Beginner.', 
    globalBonus120: '+7% Projectile Resistance',
    bio: 'An aspiring archer on a journey to save the world.',
    trivia: 'Essential for Immortal PR build thanks to the level 120 +7% PR.'
  },
  { 
    id: 'taiga', name: 'Taiga', tier: 'S', category: 'Hero', 
    desc: 'Fire Ninja.', 
    globalBonus120: '+17% Crit Damage',
    bio: 'Master of the scorched earth techniques.'
  },
  { 
    id: 'meowgik', name: 'Meowgik', tier: 'S', category: 'Hero', 
    desc: 'Cat Mage.', 
    globalBonus120: '+30% Red Heart Healing',
    bio: 'A magical feline who summons tracking spirits.'
  },
  { 
    id: 'dragon_girl', name: 'Dragon Girl', tier: 'SS', category: 'Hero', 
    desc: 'Dragon Tamer.', 
    globalBonus120: '+5% Attack',
    bio: 'Raised by dragons, she fights with primal ferocity.'
  }
];

export const GEAR_DATA: BaseItem[] = [
  // Weapons
  { id: 'fist', name: 'Expedition Fist', tier: 'SSS', category: 'Weapon', isGodTier: true, desc: 'Melee/Ranged hybrid.', mythicPerk: 'Melee hits heal for 20% damage dealt.', trivia: 'Highest frame-rate burst in the game.' },
  { id: 'hammer', name: 'Celestial Hammer', tier: 'SSS', category: 'Weapon', isGodTier: true, desc: 'Lightning/Chain focus.', mythicPerk: 'Lightning chains jump 2 more times.', trivia: 'Best AOE clear for wave chapters.' },
  { id: 'spear_dk', name: 'Demon King Spear', tier: 'SSS', category: 'Weapon', isGodTier: true, desc: 'Gun Shield hybrid.', mythicPerk: 'Shield bash deals 450% Splash.', trivia: 'Toggle modes: Long range laser vs short range heavy cannon.' },
  { id: 'asword', name: 'Antiquated Sword', tier: 'SS', category: 'Weapon', desc: 'Stance switcher.', mythicPerk: 'Broadsword stance gains 10% DR.' },
  { id: 'db', name: 'Demon Blade', tier: 'SS', category: 'Weapon', desc: 'Melee kills heal.', mythicPerk: 'Melee hits have 5% chance to execute.', trivia: '1.8x Melee multiplier. DO NOT pick Front Arrow.' },
  { id: 'staff', name: 'Stalker Staff', tier: 'S', category: 'Weapon', desc: 'Homing projectiles.', mythicPerk: 'Projectile speed +20%.', trivia: 'God tier with Diagonal Arrows + Bouncy Wall.' },
  { id: 'scythe', name: 'Death Scythe', tier: 'A', category: 'Weapon', desc: 'High knockback.', mythicPerk: '30% Headshot chance on low HP mobs.' },
  { id: 'bow', name: 'Brave Bow', tier: 'C', category: 'Weapon', desc: 'Balanced starter weapon.', mythicPerk: '+50% Crit Dmg.' },

  // Armor
  { id: 'c_warplate', name: 'Celestial Warplate', tier: 'SSS', category: 'Armor', isGodTier: true, desc: 'Lightning focus.', drPercent: '12%', uniqueEffect: 'Lightning damage +20%', mythicPerk: '+20% Damage Resistance.' },
  { id: 'e_plate', name: 'Expedition Plate', tier: 'SSS', category: 'Armor', isGodTier: true, desc: 'Healing tank.', drPercent: '10%', uniqueEffect: 'Healing effectiveness +40%', mythicPerk: '+15% Max HP.' },
  { id: 'golden', name: 'Golden Chestplate', tier: 'S', category: 'Armor', desc: 'Standard meta defense.', drPercent: '10%', uniqueEffect: 'Flat DR per hit', mythicPerk: 'Reduces nearby mob damage.' },
  { id: 'phantom', name: 'Phantom Cloak', tier: 'S', category: 'Armor', desc: 'Best for Bosses.', drPercent: '10%', uniqueEffect: 'Freeze enemies on hit', mythicPerk: '+10% Projectile Res.' },
  { id: 'bright', name: 'Bright Robe', tier: 'A', category: 'Armor', desc: 'XP boost.', drPercent: '12%', uniqueEffect: 'Front DR +12%', mythicPerk: 'Level up heal.' },

  // Rings
  { id: 'c_band', name: 'Celestial Band', tier: 'SSS', category: 'Ring', isGodTier: true, desc: 'Atk + Crit + Lightning.', mythicPerk: '+5% Crit Rate.' },
  { id: 'bull_ring', name: 'Bull Ring', tier: 'SS', category: 'Ring', desc: 'Mob resistance.', mythicPerk: 'Coin drop +10%.', trivia: 'Stack 2 for 20% Mob DR.' },
  { id: 'dragon_ring', name: 'Dragon Ring', tier: 'SS', category: 'Ring', desc: 'Projectile Resistance.', mythicPerk: '+15% Crit Damage.' },
  { id: 'lion_ring', name: 'Lion Ring', tier: 'A', category: 'Ring', desc: 'Boss damage.', mythicPerk: '+20% Attack.' },
  { id: 'vilebat', name: 'Vilebat Ring', tier: 'A', category: 'Ring', desc: 'Bloodthirst effect.', mythicPerk: 'Heal on mob kill.' },

  // Dragons
  { id: 'magmar', name: 'Magmar', tier: 'SS', category: 'Dragon', desc: 'Mana Fountain.', mythicPerk: 'Regen 2.5% Mana per second.', trivia: 'Allows infinite skill spamming.' },
  { id: 'necrogon', name: 'Necrogon', tier: 'S', category: 'Dragon', desc: 'PR Passive.', mythicPerk: '+7% Projectile Resistance.' },
  { id: 'geogon', name: 'Geogon', tier: 'S', category: 'Dragon', desc: 'Shield God.', mythicPerk: 'Shield duration +1s.', trivia: 'Crag Shield grants complete invincibility.' },
  { id: 'stormra', name: 'Stormra', tier: 'A', category: 'Dragon', desc: 'Chain lightning.', mythicPerk: 'Lightning jump range +20%.' },
  { id: 'infernox', name: 'Infernox', tier: 'B', category: 'Dragon', desc: 'Fire breath.', mythicPerk: 'Burn duration +50%.' },

  // Pets / Spirits
  { id: 'unicorn', name: 'Empyrean Unicorn', tier: 'SS', category: 'Pet', desc: 'Atk/Crit buff.', mythicPerk: '+5% Crit Chance.' },
  { id: 'cappy', name: 'Frothy Cappy', tier: 'SS', category: 'Pet', desc: 'Dodge focus.', mythicPerk: '+7% Dodge Rate.' },
  { id: 'bat', name: 'Laser Bat', tier: 'S', category: 'Spirit', desc: 'Shoots through walls.', mythicPerk: '+10% Atk Speed.' },
  { id: 'owl', name: 'Noisy Owl', tier: 'A', category: 'Spirit', desc: 'Knockback specialist.' },
  { id: 'ghost_pet', name: 'Flaming Ghost', tier: 'A', category: 'Spirit', desc: 'Burn spreader.' },

  // Books
  { id: 'c_grimoire', name: 'Celestial Grimoire', tier: 'SSS', category: 'Book', isGodTier: true, desc: 'Mana burst.', mythicPerk: 'Instant 50% Mana recovery on entrance.' },
  { id: 'giants', name: 'Giant\'s Contract', tier: 'SS', category: 'Book', desc: 'Invincibility shield.', mythicPerk: 'Shield absorbs 50% more dmg.' },
  { id: 'time_book', name: 'Arcanum of Time', tier: 'SS', category: 'Book', desc: 'Time stop.', mythicPerk: 'Duration +2s.' },
  { id: 'enlight', name: 'Enlightenment', tier: 'S', category: 'Book', desc: 'Gain free skills.', mythicPerk: '+20% Skill chance.' },
  { id: 'combat', name: 'Art of Combat', tier: 'A', category: 'Book', desc: 'Attack buff.' },

  // Lockets
  { id: 'c_talisman', name: 'Celestial Talisman', tier: 'SSS', category: 'Locket', isGodTier: true, desc: 'Collision Res.', mythicPerk: '+15% HP recovery.' },
  { id: 'blood_locket', name: 'Bloodthirst Locket', tier: 'S', category: 'Locket', desc: 'Heal on low HP.', mythicPerk: '+30% Heal effectiveness.' },
  { id: 'bullet_locket', name: 'Bulletproof Locket', tier: 'S', category: 'Locket', desc: 'PR Build essential.', mythicPerk: '+10% Projectile Res.', trivia: 'Grants massive PR when HP is low.' },
  { id: 'angel_locket', name: 'Angel Locket', tier: 'S', category: 'Locket', desc: 'Second life.', mythicPerk: 'Invincibility after revive +1s.' },

  // Bracelets
  { id: 'c_bracer', name: 'Celestial Bracer', tier: 'SSS', category: 'Bracelet', isGodTier: true, desc: 'Collision focus.', mythicPerk: 'Lightning strike every 5s.' },
  { id: 'shield_bracer', name: 'Shield Bracelet', tier: 'SS', category: 'Bracelet', desc: 'Entry shield.', mythicPerk: 'Shield blocks 3 projectiles.' },
  { id: 'quick_bracer', name: 'Quickshot Bracelet', tier: 'S', category: 'Bracelet', desc: 'Entry speed boost.' },

  // Totems
  { id: 'skin_totem', name: 'Skin Stats Totem', tier: 'SSS', category: 'Totem', desc: 'Estate Priority #1.', trivia: 'Highest ROI for raw stats across all heroes.' },
  { id: 'atk_totem', name: 'Attack Totem', tier: 'SS', category: 'Totem', desc: 'Estate Priority #2.', trivia: 'Flat Attack scaling.' },
  { id: 'hp_totem', name: 'Health Totem', tier: 'S', category: 'Totem', desc: 'Estate Priority #3.' }
];

export const SHARD_EVO_COSTS = [
  { stars: '1-Star', shards: 10, gold: '10k' },
  { stars: '2-Star', shards: 20, gold: '20k' },
  { stars: '3-Star', shards: 40, gold: '50k' },
  { stars: '4-Star', shards: 80, gold: '100k' },
  { stars: '5-Star', shards: 120, gold: '250k' },
  { stars: '6-Star', shards: 150, gold: '500k' },
  { stars: '7-Star', shards: 200, gold: '1M' },
  { stars: '8-Star', shards: 250, gold: '2M' }
];

export const FARMING_ROUTES = [
  { resource: 'Weapon Scrolls', chapter: 'Hero 21 / 28', note: 'Highest drop count.' },
  { resource: 'Jewels (Lvl 3+)', chapter: 'Hero 27 / 35', note: 'Better rarity odds.' },
  { resource: 'Crimson Witch Egg', chapter: 'Hero 14', note: 'Boss chapters are fastest.' }
];

export const TRIVIA_ARCHIVE = [
  { title: 'Ricochet Penalty', detail: '30% damage reduction per bounce.' },
  { title: 'Front Arrow Math', detail: 'Adds +1 shot but reduces total damage by 25%.' },
  { title: 'Inferno PR Cap', detail: 'Projectile Resistance is capped at 75% in H90+. Transition to Collision Res.' }
];

export const MONSTER_FARM_EGGS = [
  { id: 'egg_witch', name: 'Crimson Witch', desc: 'Critical Damage +5%', priority: 'SS' },
  { id: 'egg_wizard', name: 'Skull Wizard', desc: 'Critical Damage +4.5%', priority: 'S' }
];

export const ARCHERO_KNOWLEDGE_BASE = `
# ZA ARMORY ARCHERO PRO ARCHIVE
Focus on SSS Gear for Zeus and Melinda.
For Helix, Demon Blade + Bloodthirst is mandatory.
PR is capped at 75% in Inferno Mode (H90+).
Celestial Set (Hammer + Band + Warplate) is mandatory for Zeus.
Demon King Spear: Use Laser for distance, Heavy Cannon for melee shield bashes.
Estate ROI: Skin Totem > Attack Totem > Health Totem.
Workers: Daniel (Mob Damage) and Ivan (Attack) are top priority.
`;
