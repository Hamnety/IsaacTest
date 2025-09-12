import { IsaacSaveData } from '../types/isaac';

export class IsaacSaveEditor {
  private saveData: IsaacSaveData;

  constructor(saveData: IsaacSaveData) {
    this.saveData = { ...saveData };
  }

  // Редактирование базовых параметров
  public setPlayerName(name: string): void {
    this.saveData.playerName = name;
  }

  public setCoins(coins: number): void {
    this.saveData.coins = Math.max(0, Math.min(999, coins));
  }

  public setBombs(bombs: number): void {
    this.saveData.bombs = Math.max(0, Math.min(99, bombs));
  }

  public setKeys(keys: number): void {
    this.saveData.keys = Math.max(0, Math.min(99, keys));
  }

  public setHearts(hearts: number): void {
    this.saveData.hearts = Math.max(0, Math.min(12, hearts));
  }

  public setSoulHearts(soulHearts: number): void {
    this.saveData.soulHearts = Math.max(0, Math.min(12, soulHearts));
  }

  public setBlackHearts(blackHearts: number): void {
    this.saveData.blackHearts = Math.max(0, Math.min(12, blackHearts));
  }

  // Редактирование статистики
  public setStats(stats: Partial<typeof this.saveData.stats>): void {
    this.saveData.stats = { ...this.saveData.stats, ...stats };
  }

  // Редактирование персонажей
  public unlockCharacter(characterId: number): void {
    if (this.saveData.characters[characterId]) {
      this.saveData.characters[characterId].unlocked = true;
    }
  }

  public lockCharacter(characterId: number): void {
    if (this.saveData.characters[characterId]) {
      this.saveData.characters[characterId].unlocked = false;
    }
  }

  public setCharacterStats(characterId: number, stats: Partial<typeof this.saveData.characters[0].stats>): void {
    if (this.saveData.characters[characterId]) {
      this.saveData.characters[characterId].stats = { 
        ...this.saveData.characters[characterId].stats, 
        ...stats 
      };
    }
  }

  // Редактирование предметов
  public addItem(itemId: number): void {
    if (!this.saveData.items.includes(itemId)) {
      this.saveData.items.push(itemId);
    }
  }

  public removeItem(itemId: number): void {
    this.saveData.items = this.saveData.items.filter(id => id !== itemId);
  }

  public hasItem(itemId: number): boolean {
    return this.saveData.items.includes(itemId);
  }

  // Редактирование тринкетов
  public addTrinket(trinketId: number): void {
    if (!this.saveData.trinkets.includes(trinketId)) {
      this.saveData.trinkets.push(trinketId);
    }
  }

  public removeTrinket(trinketId: number): void {
    this.saveData.trinkets = this.saveData.trinkets.filter(id => id !== trinketId);
  }

  // Редактирование достижений
  public unlockAchievement(achievementId: number): void {
    if (!this.saveData.achievements.includes(achievementId)) {
      this.saveData.achievements.push(achievementId);
    }
  }

  public lockAchievement(achievementId: number): void {
    this.saveData.achievements = this.saveData.achievements.filter(id => id !== achievementId);
  }

  // Редактирование вызовов
  public completeChallenge(challengeId: number, bestTime?: number): void {
    if (this.saveData.challenges[challengeId]) {
      this.saveData.challenges[challengeId].completed = true;
      if (bestTime !== undefined) {
        this.saveData.challenges[challengeId].bestTime = bestTime;
      }
    }
  }

  public uncompleteChallenge(challengeId: number): void {
    if (this.saveData.challenges[challengeId]) {
      this.saveData.challenges[challengeId].completed = false;
      this.saveData.challenges[challengeId].bestTime = 0;
    }
  }

  // Получение данных
  public getSaveData(): IsaacSaveData {
    return { ...this.saveData };
  }

  // Экспорт в JSON
  public exportToJSON(): string {
    return JSON.stringify(this.saveData, null, 2);
  }

  // Импорт из JSON
  public importFromJSON(json: string): boolean {
    try {
      const data = JSON.parse(json);
      this.saveData = { ...data };
      return true;
    } catch (error) {
      console.error('Error importing JSON:', error);
      return false;
    }
  }

  // Сброс к начальному состоянию
  public resetToNewGame(): void {
    this.saveData = {
      version: 'ISAACNGSAVE09R',
      playerName: 'New Player',
      coins: 0,
      bombs: 0,
      keys: 0,
      hearts: 3,
      soulHearts: 0,
      blackHearts: 0,
      eternalHearts: 0,
      goldenHearts: 0,
      maxHearts: 3,
      maxSoulHearts: 0,
      maxEternalHearts: 0,
      maxGoldenHearts: 0,
      damage: 1,
      speed: 1,
      range: 1,
      shotSpeed: 1,
      luck: 0,
      tears: 1,
      devilDeals: 0,
      angelDeals: 0,
      items: [],
      trinkets: [],
      cards: [],
      pills: [],
      runes: [],
      achievements: [],
      stats: {
        deaths: 0,
        wins: 0,
        momKills: 0,
        isaacKills: 0,
        satanKills: 0,
        blueBabyKills: 0,
        lambKills: 0,
        megaSatanKills: 0,
        ultraGreedKills: 0,
        hushKills: 0,
        deliriumKills: 0,
        motherKills: 0,
        beastKills: 0
      },
      challenges: Array.from({ length: 50 }, (_, i) => ({
        id: i,
        completed: false,
        bestTime: 0
      })),
      characters: Array.from({ length: 34 }, (_, i) => ({
        id: i,
        name: `Character ${i}`,
        unlocked: i === 0, // Только Isaac разблокирован по умолчанию
        stats: {
          deaths: 0,
          wins: 0,
          momKills: 0,
          isaacKills: 0,
          satanKills: 0,
          blueBabyKills: 0,
          lambKills: 0,
          megaSatanKills: 0,
          ultraGreedKills: 0,
          hushKills: 0,
          deliriumKills: 0,
          motherKills: 0,
          beastKills: 0
        }
      }))
    };
  }
}
