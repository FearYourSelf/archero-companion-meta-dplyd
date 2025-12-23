

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
  [key: string]: any; 
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

export interface SlotResonance {
  slot: string;
  lv16: string;
  lv28: string;
  lv33: string;
  lv38: string;
}

export interface Relic {
  id: string;
  name: string;
  tier: 'Holy' | 'Radiant' | 'Faint';
  effect: string;
  setBonus?: string;
  // Added 'Flame' to supported icon types for Prometheus's Fire
  iconType?: 'Sword' | 'Shield' | 'Scroll' | 'Gem' | 'Eye' | 'Book' | 'Cup' | 'Arrow' | 'Flame';
  stars?: string[];
  lore?: string;
  source?: string;
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