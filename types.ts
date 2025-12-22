
export type Tier = 'SSS' | 'SS' | 'S' | 'A' | 'B' | 'C' | 'D' | 'F';
// Added 'Glyph' to GearCategory to support the full range of equipment categories used in constants.tsx
export type GearCategory = 'Hero' | 'Weapon' | 'Armor' | 'Ring' | 'Book' | 'Bracelet' | 'Locket' | 'Spirit' | 'Pet' | 'Dragon' | 'Relic' | 'Egg' | 'Totem' | 'Jewel' | 'Glyph';

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
  trivia?: string; // Mapped to "Did You Know?"
  deepLogic?: string; // Mapped to "Strategist Insights"
  rarityPerks?: RarityPerk[];
  bestPairs?: string[]; // Mapped to "Synergistic Gear"
  drPercent?: string;
  uniqueEffect?: string; // Special glow effect in UI
}

export interface Hero extends BaseItem {
  globalBonus120: string;
  bestSkin?: string;
  evo4Star?: string;
  bio?: string; // Mapped to "Hero's Chronicle"
  assistHeroes?: string[];
  shardCost?: string;
}

export interface Jewel {
  id: string;
  name: string;
  color: 'Red' | 'Blue' | 'Green' | 'Purple' | 'Yellow';
  statPerLevel: string;
  bonus16: string; // Hidden bonus at Level 16
  bonus28: string; // Hidden bonus at Level 28
}

export interface Relic {
  id: string;
  name: string;
  tier: 'Holy' | 'Radiant' | 'Faint';
  effect: string;
  setBonus?: string;
  iconType?: 'Sword' | 'Shield' | 'Scroll' | 'Gem' | 'Eye' | 'Book' | 'Cup' | 'Arrow';
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

export interface TrainingStats {
  bestStreak: number;
}
