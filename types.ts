
export type Tier = 'SSS' | 'SS' | 'S' | 'A' | 'B' | 'C' | 'D' | 'F';
export type GearCategory = 'Hero' | 'Weapon' | 'Armor' | 'Ring' | 'Book' | 'Bracelet' | 'Locket' | 'Spirit' | 'Pet' | 'Dragon' | 'Relic' | 'Pet Farm Eggs' | 'Totem' | 'Jewel' | 'Glyph';

export interface RarityPerk {
  rarity: 'Great' | 'Rare' | 'Epic' | 'Perfect Epic' | 'Legendary' | 'Ancient Legendary' | 'Mythic' | 'Titan Tales' | 'Chaos';
  effect: string;
}

export interface GearSet {
  name: string;
  weapon: string;
  armor: string;
  rings: string[];
  bracelet: string;
  locket: string;
  book: string;
  synergy: string;
}

export interface StarMilestone {
  stars: number;
  effect: string;
  isGlobal?: boolean;
}

export interface SunMilestone {
  level: number;
  effect: string;
  isGlobal?: boolean;
}

export interface BaseItem {
  id: string;
  name: string;
  tier: Tier;
  desc: string;
  category: GearCategory;
  isGodTier?: boolean;
  mythicPerk?: string;
  trivia?: string;
  deepLogic?: string;
  rarityPerks?: RarityPerk[];
  bestPairs?: string[];
  drPercent?: string;
  uniqueEffect?: string;
  dragonType?: 'Attack' | 'Defense' | 'Balance';
  [key: string]: any; // Allow for flexible metadata from new categories
}

export interface Hero extends BaseItem {
  globalBonus120: string;
  bestSkin?: string;
  evo4Star?: string;
  bio?: string;
  assistHeroes?: string[];
  shardCost?: string;
  gearSets?: GearSet[];
  historicalTiers?: { update: string; tier: Tier }[];
  starMilestones?: StarMilestone[];
  sunMilestones?: SunMilestone[];
}

export interface Jewel {
  id: string;
  name: string;
  color: 'Red' | 'Blue' | 'Green' | 'Purple' | 'Yellow' | 'Teal';
  statType: string;
  baseStat: number;
  statPerLevel: number;
  slots: string[];
  lore?: string;
}

// Added missing Relic interface for collectible artifact data
export interface Relic {
  id: string;
  name: string;
  tier: 'Holy' | 'Radiant' | 'Faint';
  effect: string;
  setBonus?: string;
  iconType?: string;
  lore?: string;
  source?: string;
  stars?: string[];
}

export interface SlotBonus {
  level: number;
  effect: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}

export interface CalcStats {
  baseAtk: number;
  critChance: number;
  critDmg: number;
  atkSpeed: number;
  weaponType: string;
}

export interface LogEntry {
  id: string;
  type: 'info' | 'warn' | 'error' | 'system';
  message: string;
  timestamp: number;
}

export interface ArcheroEvent {
  id: string;
  name: string;
  days: string[]; // ['Monday', 'Wednesday'...]
  rewards: string[];
  desc: string;
  proTip: string;
  color: string;
}
