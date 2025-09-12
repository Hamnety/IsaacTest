import { IsaacSaveData, Achievement, Character, Item, Challenge, GameStats } from './types';
import { ACHIEVEMENTS, CHARACTERS, ITEMS, CHALLENGES } from './gameData';

export class IsaacSaveParser {
    private data: ArrayBuffer;
    private view: DataView;
    private offset: number = 0;

    constructor(data: ArrayBuffer) {
        this.data = data;
        this.view = new DataView(data);
    }

    // Чтение различных типов данных из бинарного файла
    private readUint8(): number {
        const value = this.view.getUint8(this.offset);
        this.offset += 1;
        return value;
    }

    private readUint16(): number {
        const value = this.view.getUint16(this.offset, true); // little-endian
        this.offset += 2;
        return value;
    }

    private readUint32(): number {
        const value = this.view.getUint32(this.offset, true); // little-endian
        this.offset += 4;
        return value;
    }

    private readFloat32(): number {
        const value = this.view.getFloat32(this.offset, true); // little-endian
        this.offset += 4;
        return value;
    }

    private readString(length: number): string {
        const bytes = new Uint8Array(this.data, this.offset, length);
        this.offset += length;
        return new TextDecoder('utf-8').decode(bytes).replace(/\0/g, '');
    }

    private readBitArray(length: number): boolean[] {
        const bits: boolean[] = [];
        for (let i = 0; i < length; i++) {
            const byteIndex = Math.floor(i / 8);
            const bitIndex = i % 8;
            const byte = this.readUint8();
            bits.push((byte & (1 << bitIndex)) !== 0);
        }
        return bits;
    }

    // Пропуск определенного количества байтов
    private skip(bytes: number): void {
        this.offset += bytes;
    }

    // Поиск сигнатуры в файле
    private findSignature(signature: string): number {
        const sigBytes = new TextEncoder().encode(signature);
        for (let i = 0; i < this.data.byteLength - sigBytes.length; i++) {
            let found = true;
            for (let j = 0; j < sigBytes.length; j++) {
                if (this.view.getUint8(i + j) !== sigBytes[j]) {
                    found = false;
                    break;
                }
            }
            if (found) {
                return i;
            }
        }
        return -1;
    }

    // Основной метод парсинга
    public parse(): IsaacSaveData {
        try {
            // Проверяем сигнатуру файла
            const signature = this.findSignature('ISAACNGSAVE');
            if (signature === -1) {
                throw new Error('Неверный формат файла сохранения');
            }

            this.offset = signature + 11; // Пропускаем сигнатуру

            // Читаем версию
            const version = this.readString(3);
            
            // Пропускаем до начала данных
            this.skip(4);

            // Парсим достижения (примерно 500+ достижений)
            const achievements = this.parseAchievements();
            
            // Парсим персонажей
            const characters = this.parseCharacters();
            
            // Парсим предметы
            const items = this.parseItems();
            
            // Парсим челленджи
            const challenges = this.parseChallenges();
            
            // Парсим статистику
            const stats = this.parseStats();

            return {
                version,
                achievements,
                characters,
                items,
                challenges,
                stats
            };
        } catch (error) {
            console.error('Ошибка при парсинге файла сохранения:', error);
            throw new Error('Не удалось прочитать файл сохранения. Убедитесь, что файл не поврежден.');
        }
    }

    private parseAchievements(): Achievement[] {
        const achievements: Achievement[] = [];
        
        // В файле сохранения достижения хранятся как битовый массив
        // Каждый бит соответствует одному достижению
        const achievementBits = this.readBitArray(64); // 64 байта = 512 бит
        
        for (let i = 0; i < achievementBits.length; i++) {
            achievements.push({
                id: i,
                name: this.getAchievementName(i),
                description: this.getAchievementDescription(i),
                unlocked: achievementBits[i]
            });
        }

        return achievements;
    }

    private parseCharacters(): Character[] {
        const characters: Character[] = [];
        const characterCount = 34; // Количество персонажей в игре
        
        for (let i = 0; i < characterCount; i++) {
            const unlocked = this.readUint8() !== 0;
            
            // Читаем отметки о прохождении
            const completionMarks = [];
            const difficulties = ['Normal', 'Hard', 'Greed', 'Greedier'];
            
            for (const difficulty of difficulties) {
                completionMarks.push({
                    difficulty,
                    completed: this.readUint8() !== 0
                });
            }

            characters.push({
                id: i,
                name: this.getCharacterName(i),
                unlocked,
                completionMarks
            });
        }

        return characters;
    }

    private parseItems(): Item[] {
        const items: Item[] = [];
        const itemCount = 700; // Примерное количество предметов
        
        // Читаем битовый массив для предметов
        const itemBits = this.readBitArray(88); // 88 байт = 704 бита
        
        for (let i = 0; i < itemCount; i++) {
            items.push({
                id: i,
                name: this.getItemName(i),
                description: this.getItemDescription(i),
                quality: this.getItemQuality(i),
                unlocked: itemBits[i] || false,
                touched: itemBits[i] || false
            });
        }

        return items;
    }

    private parseChallenges(): Challenge[] {
        const challenges: Challenge[] = [];
        const challengeCount = 45; // Количество челленджей
        
        for (let i = 0; i < challengeCount; i++) {
            challenges.push({
                id: i,
                name: this.getChallengeName(i),
                description: this.getChallengeDescription(i),
                completed: this.readUint8() !== 0,
                difficulty: this.getChallengeDifficulty(i)
            });
        }

        return challenges;
    }

    private parseStats(): GameStats {
        // Пропускаем до секции статистики
        this.skip(100);
        
        return {
            totalPlayTime: this.readFloat32(),
            totalDeaths: this.readUint32(),
            totalWins: this.readUint32(),
            totalRuns: this.readUint32(),
            bestStreak: this.readUint32(),
            currentStreak: this.readUint32()
        };
    }

    // Методы для получения названий и описаний
    private getAchievementName(id: number): string {
        const achievement = ACHIEVEMENTS.find(a => a.id === id);
        return achievement?.name || `Достижение ${id}`;
    }

    private getAchievementDescription(id: number): string {
        const achievement = ACHIEVEMENTS.find(a => a.id === id);
        return achievement?.description || `Описание достижения ${id}`;
    }

    private getCharacterName(id: number): string {
        const character = CHARACTERS.find(c => c.id === id);
        return character?.name || `Персонаж ${id}`;
    }

    private getItemName(id: number): string {
        const item = ITEMS.find(i => i.id === id);
        return item?.name || `Предмет ${id}`;
    }

    private getItemDescription(id: number): string {
        const item = ITEMS.find(i => i.id === id);
        return item?.description || `Описание предмета ${id}`;
    }

    private getItemQuality(id: number): number {
        const item = ITEMS.find(i => i.id === id);
        return item?.quality || 0;
    }

    private getChallengeName(id: number): string {
        const challenge = CHALLENGES.find(c => c.id === id);
        return challenge?.name || `Челлендж ${id}`;
    }

    private getChallengeDescription(id: number): string {
        const challenge = CHALLENGES.find(c => c.id === id);
        return challenge?.description || `Описание челленджа ${id}`;
    }

    private getChallengeDifficulty(id: number): number {
        const challenge = CHALLENGES.find(c => c.id === id);
        return challenge?.difficulty || 1;
    }
}
