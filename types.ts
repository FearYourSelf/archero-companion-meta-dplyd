
export type Tier = 'SSS' | 'SS' | 'S' | 'A+' | 'A' | 'B' | 'C' | 'D' | 'F';
export type GearCategory = 'Weapon' | 'Hero' | 'Ring' | 'Book' | 'Bracelet' | 'Locket' | 'Spirit' | 'Pet' | 'Dragon' | 'Relic' | 'Egg' | 'Totem' | 'Armor';

export interface BaseItem {
  id: string;
  name: string;
  tier: Tier;
  desc: string;
  category: GearCategory;
  isGodTier?: boolean;
  mythicPerk?: string;
  hiddenMultiplier?: number;
}

export interface Hero extends BaseItem {
  type: string;
  globalBonus120: string;
  assistSlots?: string[];
  bestSkin?: string;
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
  weaponType: string;
}

export interface TrainingStats {
  bestStreak: number;
}
