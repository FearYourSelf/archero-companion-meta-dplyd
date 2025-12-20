
export type Tier = 'SSS' | 'SS' | 'S' | 'A+' | 'A' | 'B' | 'C' | 'D' | 'F';
export type GearCategory = 'Weapon' | 'Hero' | 'Ring' | 'Book' | 'Bracelet' | 'Locket' | 'Spirit' | 'Pet' | 'Armor' | 'Dragon' | 'Relic' | 'Egg' | 'Totem';

export interface BaseItem {
  id: string;
  name: string;
  tier: Tier;
  desc: string;
  category: GearCategory;
  details?: string;
  synergy?: string;
  isGodTier?: boolean;
  priority?: 'High' | 'Medium' | 'Low';
  globalStatNote?: string;
}

export interface HeroStats {
  atk: number;
  hp: number;
}

export interface Hero extends BaseItem {
  type: string;
  stats: HeroStats;
  bestSkin?: string;
  evolutionNote?: string;
  lv120Efficiency?: string;
}

export interface Ability {
  name: string;
  tier: Tier;
  desc: string;
  whenToPick: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: number;
  sources?: any[];
}

export interface CalcStats {
  baseAtk: number;
  critChance: number;
  critDmg: number;
  atkSpeed: number;
}

export interface TrainingStats {
  currentStreak: number;
  bestStreak: number;
}
