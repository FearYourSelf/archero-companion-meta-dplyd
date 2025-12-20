
export type Tier = 'SSS' | 'SS' | 'S' | 'A+' | 'A' | 'B' | 'D' | 'F';
export type GearCategory = 'Weapon' | 'Hero' | 'Ring' | 'Book' | 'Bracelet' | 'Locket' | 'Pet' | 'Armor' | 'Dragon' | 'Relic';

export interface BaseItem {
  id: string;
  name: string;
  tier: Tier;
  desc: string;
  category: GearCategory;
  details?: string;
  synergy?: string;
  isGodTier?: boolean;
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
}

export interface CalcStats {
  baseAtk: number;
  critChance: number;
  critDmg: number;
  atkSpeed: number;
}
