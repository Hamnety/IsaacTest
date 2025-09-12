// Типы данных для The Binding of Isaac

export interface IsaacSaveData {
  version: string;
  playerName: string;
  coins: number;
  bombs: number;
  keys: number;
  hearts: number;
  soulHearts: number;
  blackHearts: number;
  eternalHearts: number;
  goldenHearts: number;
  maxHearts: number;
  maxSoulHearts: number;
  maxEternalHearts: number;
  maxGoldenHearts: number;
  damage: number;
  speed: number;
  range: number;
  shotSpeed: number;
  luck: number;
  tears: number;
  devilDeals: number;
  angelDeals: number;
  items: number[];
  trinkets: number[];
  cards: number[];
  pills: number[];
  runes: number[];
  achievements: number[];
  stats: IsaacStats;
  challenges: ChallengeData[];
  characters: CharacterData[];
}

export interface IsaacStats {
  deaths: number;
  wins: number;
  momKills: number;
  isaacKills: number;
  satanKills: number;
  blueBabyKills: number;
  lambKills: number;
  megaSatanKills: number;
  ultraGreedKills: number;
  hushKills: number;
  deliriumKills: number;
  motherKills: number;
  beastKills: number;
}

export interface ChallengeData {
  id: number;
  completed: boolean;
  bestTime: number;
}

export interface CharacterData {
  id: number;
  name: string;
  unlocked: boolean;
  stats: CharacterStats;
}

export interface CharacterStats {
  deaths: number;
  wins: number;
  momKills: number;
  isaacKills: number;
  satanKills: number;
  blueBabyKills: number;
  lambKills: number;
  megaSatanKills: number;
  ultraGreedKills: number;
  hushKills: number;
  deliriumKills: number;
  motherKills: number;
  beastKills: number;
}
