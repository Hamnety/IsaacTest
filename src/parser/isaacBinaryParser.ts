import { IsaacSaveData, IsaacStats, ChallengeData, CharacterData, CharacterStats } from '../types/isaac';

export class IsaacBinaryParser {
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

      console.log('Header:', header);
      
      // Сбрасываем offset для правильного чтения
      this.offset = 0;
      
      // Читаем заголовок полностью
      const version = this.readString(12);
      
      // Пропускаем неизвестные байты до начала данных
      this.offset = 0x100; // Начало данных после заголовка
      
      const saveData: IsaacSaveData = {
        version: version,
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
    if (this.offset + length > this.data.length) {
      throw new Error('Buffer overflow while reading string');
    }
    
    const bytes = this.data.slice(this.offset, this.offset + length);
    this.offset += length;
    
    // Удаляем null-терминаторы и конвертируем в UTF-8
    const nullIndex = bytes.indexOf(0);
    const cleanBytes = nullIndex >= 0 ? bytes.slice(0, nullIndex) : bytes;
    
    return cleanBytes.toString('utf8');
  }

  private readUInt32(): number {
    if (this.offset + 4 > this.data.length) {
      throw new Error('Buffer overflow while reading UInt32');
    }
    
    const value = this.data.readUInt32LE(this.offset);
    this.offset += 4;
    return value;
  }

  private readUInt16(): number {
    if (this.offset + 2 > this.data.length) {
      throw new Error('Buffer overflow while reading UInt16');
    }
    
    const value = this.data.readUInt16LE(this.offset);
    this.offset += 2;
    return value;
  }

  private readUInt8(): number {
    if (this.offset + 1 > this.data.length) {
      throw new Error('Buffer overflow while reading UInt8');
    }
    
    const value = this.data.readUInt8(this.offset);
    this.offset += 1;
    return value;
  }

  private readFloat(): number {
    if (this.offset + 4 > this.data.length) {
      throw new Error('Buffer overflow while reading float');
    }
    
    const value = this.data.readFloatLE(this.offset);
    this.offset += 4;
    return value;
  }

  private readItemArray(): number[] {
    const items: number[] = [];
    
    // Читаем количество предметов
    const count = this.readUInt32();
    
    for (let i = 0; i < count && i < 1000; i++) {
      const item = this.readUInt32();
      if (item > 0) {
        items.push(item);
      }
    }
    
    return items;
  }

  private readTrinketArray(): number[] {
    const trinkets: number[] = [];
    
    // Читаем количество тринкетов
    const count = this.readUInt32();
    
    for (let i = 0; i < count && i < 100; i++) {
      const trinket = this.readUInt32();
      if (trinket > 0) {
        trinkets.push(trinket);
      }
    }
    
    return trinkets;
  }

  private readCardArray(): number[] {
    const cards: number[] = [];
    
    // Читаем количество карт
    const count = this.readUInt32();
    
    for (let i = 0; i < count && i < 100; i++) {
      const card = this.readUInt32();
      if (card > 0) {
        cards.push(card);
      }
    }
    
    return cards;
  }

  private readPillArray(): number[] {
    const pills: number[] = [];
    
    // Читаем количество таблеток
    const count = this.readUInt32();
    
    for (let i = 0; i < count && i < 100; i++) {
      const pill = this.readUInt32();
      if (pill > 0) {
        pills.push(pill);
      }
    }
    
    return pills;
  }

  private readRuneArray(): number[] {
    const runes: number[] = [];
    
    // Читаем количество рун
    const count = this.readUInt32();
    
    for (let i = 0; i < count && i < 100; i++) {
      const rune = this.readUInt32();
      if (rune > 0) {
        runes.push(rune);
      }
    }
    
    return runes;
  }

  private readAchievementArray(): number[] {
    const achievements: number[] = [];
    
    // Читаем массив достижений (обычно это битовая маска)
    const achievementBytes = this.readBytes(1000); // 1000 байт для достижений
    
    for (let i = 0; i < achievementBytes.length; i++) {
      const byte = achievementBytes[i];
      for (let bit = 0; bit < 8; bit++) {
        if ((byte & (1 << bit)) !== 0) {
          achievements.push(i * 8 + bit);
        }
      }
    }
    
    return achievements;
  }

  private readBytes(count: number): Buffer {
    if (this.offset + count > this.data.length) {
      throw new Error('Buffer overflow while reading bytes');
    }
    
    const bytes = this.data.slice(this.offset, this.offset + count);
    this.offset += count;
    return bytes;
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
    
    // Читаем данные о вызовах
    for (let i = 0; i < 50; i++) {
      challenges.push({
        id: i,
        completed: this.readUInt8() === 1,
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
        unlocked: this.readUInt8() === 1,
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

  // Метод для отладки - показывает hex-дамп файла
  public getHexDump(startOffset: number = 0, length: number = 256): string {
    const endOffset = Math.min(startOffset + length, this.data.length);
    const chunk = this.data.slice(startOffset, endOffset);
    
    let hex = '';
    for (let i = 0; i < chunk.length; i += 16) {
      const line = chunk.slice(i, i + 16);
      const hexBytes = Array.from(line)
        .map((b: number) => b.toString(16).padStart(2, '0'))
        .join(' ');
      const ascii = Array.from(line)
        .map((b: number) => b >= 32 && b <= 126 ? String.fromCharCode(b) : '.')
        .join('');
      
      hex += `${(startOffset + i).toString(16).padStart(8, '0')}: ${hexBytes.padEnd(48, ' ')} |${ascii}|\n`;
    }
    
    return hex;
  }
}
