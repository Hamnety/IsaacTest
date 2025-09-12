import { IsaacSaveData, IsaacStats, ChallengeData, CharacterData, CharacterStats } from '../types/isaac';

export class IsaacSaveParser {
  private data: Buffer;
  private offset: number = 0;

  constructor(data: Buffer) {
    this.data = data;
  }

  public parse(): IsaacSaveData | null {
    try {
      // Проверяем заголовок файла
      const header = this.readString(12);
      if (!header.startsWith('ISAACNGSAVE')) {
        throw new Error('Invalid save file format');
      }

      // Пропускаем версию и другие служебные данные
      this.offset = 0x100; // Примерное смещение для начала данных

      const saveData: IsaacSaveData = {
        version: header,
        playerName: this.readString(32),
        coins: this.readUInt32(),
        bombs: this.readUInt32(),
        keys: this.readUInt32(),
        hearts: this.readFloat(),
        soulHearts: this.readFloat(),
        blackHearts: this.readFloat(),
        eternalHearts: this.readFloat(),
        goldenHearts: this.readFloat(),
        maxHearts: this.readFloat(),
        maxSoulHearts: this.readFloat(),
        maxEternalHearts: this.readFloat(),
        maxGoldenHearts: this.readFloat(),
        damage: this.readFloat(),
        speed: this.readFloat(),
        range: this.readFloat(),
        shotSpeed: this.readFloat(),
        luck: this.readFloat(),
        tears: this.readFloat(),
        devilDeals: this.readUInt32(),
        angelDeals: this.readUInt32(),
        items: this.readItemArray(),
        trinkets: this.readTrinketArray(),
        cards: this.readCardArray(),
        pills: this.readPillArray(),
        runes: this.readRuneArray(),
        achievements: this.readAchievementArray(),
        stats: this.readStats(),
        challenges: this.readChallenges(),
        characters: this.readCharacters()
      };

      return saveData;
    } catch (error) {
      console.error('Error parsing save file:', error);
      return null;
    }
  }

  private readString(length: number): string {
    const bytes = this.data.slice(this.offset, this.offset + length);
    this.offset += length;
    return bytes.toString('utf8').replace(/\0/g, '');
  }

  private readUInt32(): number {
    const value = this.data.readUInt32LE(this.offset);
    this.offset += 4;
    return value;
  }

  private readFloat(): number {
    const value = this.data.readFloatLE(this.offset);
    this.offset += 4;
    return value;
  }

  private readItemArray(): number[] {
    const items: number[] = [];
    // Читаем массив предметов (примерная реализация)
    for (let i = 0; i < 1000; i++) {
      const item = this.readUInt32();
      if (item === 0) break;
      items.push(item);
    }
    return items;
  }

  private readTrinketArray(): number[] {
    const trinkets: number[] = [];
    for (let i = 0; i < 100; i++) {
      const trinket = this.readUInt32();
      if (trinket === 0) break;
      trinkets.push(trinket);
    }
    return trinkets;
  }

  private readCardArray(): number[] {
    const cards: number[] = [];
    for (let i = 0; i < 100; i++) {
      const card = this.readUInt32();
      if (card === 0) break;
      cards.push(card);
    }
    return cards;
  }

  private readPillArray(): number[] {
    const pills: number[] = [];
    for (let i = 0; i < 100; i++) {
      const pill = this.readUInt32();
      if (pill === 0) break;
      pills.push(pill);
    }
    return pills;
  }

  private readRuneArray(): number[] {
    const runes: number[] = [];
    for (let i = 0; i < 100; i++) {
      const rune = this.readUInt32();
      if (rune === 0) break;
      runes.push(rune);
    }
    return runes;
  }

  private readAchievementArray(): number[] {
    const achievements: number[] = [];
    for (let i = 0; i < 1000; i++) {
      const achievement = this.readUInt32();
      if (achievement === 0) break;
      achievements.push(achievement);
    }
    return achievements;
  }

  private readStats(): IsaacStats {
    return {
      deaths: this.readUInt32(),
      wins: this.readUInt32(),
      momKills: this.readUInt32(),
      isaacKills: this.readUInt32(),
      satanKills: this.readUInt32(),
      blueBabyKills: this.readUInt32(),
      lambKills: this.readUInt32(),
      megaSatanKills: this.readUInt32(),
      ultraGreedKills: this.readUInt32(),
      hushKills: this.readUInt32(),
      deliriumKills: this.readUInt32(),
      motherKills: this.readUInt32(),
      beastKills: this.readUInt32()
    };
  }

  private readChallenges(): ChallengeData[] {
    const challenges: ChallengeData[] = [];
    for (let i = 0; i < 50; i++) {
      challenges.push({
        id: i,
        completed: this.readUInt32() === 1,
        bestTime: this.readUInt32()
      });
    }
    return challenges;
  }

  private readCharacters(): CharacterData[] {
    const characters: CharacterData[] = [];
    const characterNames = [
      'Isaac', 'Magdalene', 'Cain', 'Judas', '???', 'Eve', 'Samson', 'Azazel',
      'Lazarus', 'Eden', 'The Lost', 'Lilith', 'Keeper', 'Apollyon', 'The Forgotten',
      'Bethany', 'Jacob & Esau', 'Tainted Isaac', 'Tainted Magdalene', 'Tainted Cain',
      'Tainted Judas', 'Tainted ???', 'Tainted Eve', 'Tainted Samson', 'Tainted Azazel',
      'Tainted Lazarus', 'Tainted Eden', 'Tainted Lost', 'Tainted Lilith', 'Tainted Keeper',
      'Tainted Apollyon', 'Tainted Forgotten', 'Tainted Bethany', 'Tainted Jacob'
    ];

    for (let i = 0; i < characterNames.length; i++) {
      characters.push({
        id: i,
        name: characterNames[i],
        unlocked: this.readUInt32() === 1,
        stats: {
          deaths: this.readUInt32(),
          wins: this.readUInt32(),
          momKills: this.readUInt32(),
          isaacKills: this.readUInt32(),
          satanKills: this.readUInt32(),
          blueBabyKills: this.readUInt32(),
          lambKills: this.readUInt32(),
          megaSatanKills: this.readUInt32(),
          ultraGreedKills: this.readUInt32(),
          hushKills: this.readUInt32(),
          deliriumKills: this.readUInt32(),
          motherKills: this.readUInt32(),
          beastKills: this.readUInt32()
        }
      });
    }
    return characters;
  }
}
