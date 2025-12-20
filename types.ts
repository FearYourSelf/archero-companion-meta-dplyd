
export type Tier = 'SSS' | 'SS' | 'S' | 'A' | 'B' | 'C' | 'D' | 'F';
export type GearCategory = 'Hero' | 'Weapon' | 'Armor' | 'Ring' | 'Book' | 'Bracelet' | 'Locket' | 'Spirit' | 'Pet' | 'Dragon' | 'Relic' | 'Egg' | 'Totem';

export interface BaseItem {
  id: string;
  name: string;
  tier: Tier;
  desc: string;
  category: GearCategory;
  isGodTier?: boolean;
  mythicPerk?: string;
  trivia?: string;
  drPercent?: string; // For armor table
  uniqueEffect?: string; // For armor table
}

export interface Hero extends BaseItem {
  globalBonus120: string;
  bestSkin?: string;
  evo4Star?: string;
  bio?: string;
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
