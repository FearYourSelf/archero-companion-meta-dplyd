
export type Tier = 'SSS' | 'SS' | 'S' | 'A' | 'B' | 'C' | 'D' | 'F';
export type GearCategory = 'Hero' | 'Weapon' | 'Armor' | 'Ring' | 'Book' | 'Bracelet' | 'Locket' | 'Spirit' | 'Pet' | 'Dragon' | 'Relic' | 'Egg' | 'Totem';

export interface RarityPerk {
  rarity: 'Great' | 'Rare' | 'Epic' | 'Perfect Epic' | 'Legendary' | 'Ancient Legendary' | 'Mythic' | 'Titan Tales' | 'Chaos';
  effect: string;
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
  deepLogic?: string; // High-level strategy
  rarityPerks?: RarityPerk[];
  bestPairs?: string[]; // Synergistic items
  drPercent?: string;
  uniqueEffect?: string;
}

export interface Hero extends BaseItem {
  globalBonus120: string;
  bestSkin?: string;
  evo4Star?: string;
  bio?: string; // Grandmaster V2.0 bio field
  assistHeroes?: string[]; // Recommended Assist Slots
  shardCost?: string;
}

export interface SavedBuild {
  id: string;
  name: string;
  heroId: string;
  stats: CalcStats;
  timestamp: number;
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

export interface TrainingStats {
  bestStreak: number;
}
