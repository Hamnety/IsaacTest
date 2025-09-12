// Упрощенный парсер файлов сохранения The Binding of Isaac

class IsaacSaveParser {
    constructor(data) {
        this.data = data;
        this.view = new DataView(data);
        this.offset = 0;
    }

    // Чтение различных типов данных из бинарного файла
    readUint8() {
        const value = this.view.getUint8(this.offset);
        this.offset += 1;
        return value;
    }

    readUint16() {
        const value = this.view.getUint16(this.offset, true); // little-endian
        this.offset += 2;
        return value;
    }

    readUint32() {
        const value = this.view.getUint32(this.offset, true); // little-endian
        this.offset += 4;
        return value;
    }

    readFloat32() {
        const value = this.view.getFloat32(this.offset, true); // little-endian
        this.offset += 4;
        return value;
    }

    readString(length) {
        const bytes = new Uint8Array(this.data, this.offset, length);
        this.offset += length;
        return new TextDecoder('utf-8').decode(bytes).replace(/\0/g, '');
    }

    readBitArray(length) {
        const bits = [];
        for (let i = 0; i < length; i++) {
            const byteIndex = Math.floor(i / 8);
            const bitIndex = i % 8;
            const byte = this.readUint8();
            bits.push((byte & (1 << bitIndex)) !== 0);
        }
        return bits;
    }

    // Пропуск определенного количества байтов
    skip(bytes) {
        this.offset += bytes;
    }

    // Поиск сигнатуры в файле
    findSignature(signature) {
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
    parse() {
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

    parseAchievements() {
        const achievements = [];
        
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

    parseCharacters() {
        const characters = [];
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

    parseItems() {
        const items = [];
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

    parseChallenges() {
        const challenges = [];
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

    parseStats() {
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
    getAchievementName(id) {
        const names = [
            "Мама", "Мама", "Мама", "Мама", "Мама", "Мама", "Мама", "Мама",
            "Мама", "Мама", "Мама", "Мама", "Мама", "Мама", "Мама", "Мама",
            // ... добавить больше названий достижений
        ];
        return names[id] || `Достижение ${id}`;
    }

    getAchievementDescription(id) {
        return `Описание достижения ${id}`;
    }

    getCharacterName(id) {
        const names = [
            "Исаак", "Магдолена", "Каин", "Иуда", "???", "Ева", "Самсон", "Азазель",
            "Лазарь", "Иден", "Потерянный", "Лилит", "Каин", "Аполион", "Забытый",
            "Бета", "Джейкоб", "Исаак", "Магдолена", "Каин", "Иуда", "???", "Ева",
            "Самсон", "Азазель", "Лазарь", "Иден", "Потерянный", "Лилит", "Каин",
            "Аполион", "Забытый", "Бета", "Джейкоб"
        ];
        return names[id] || `Персонаж ${id}`;
    }

    getItemName(id) {
        const names = [
            "Слеза", "Слеза", "Слеза", "Слеза", "Слеза", "Слеза", "Слеза", "Слеза",
            // ... добавить больше названий предметов
        ];
        return names[id] || `Предмет ${id}`;
    }

    getItemDescription(id) {
        return `Описание предмета ${id}`;
    }

    getItemQuality(id) {
        // Простая логика для определения качества предмета
        return Math.floor(Math.random() * 5);
    }

    getChallengeName(id) {
        const names = [
            "Челлендж 1", "Челлендж 2", "Челлендж 3", "Челлендж 4", "Челлендж 5",
            // ... добавить больше названий челленджей
        ];
        return names[id] || `Челлендж ${id}`;
    }

    getChallengeDescription(id) {
        return `Описание челленджа ${id}`;
    }

    getChallengeDifficulty(id) {
        return Math.floor(Math.random() * 5) + 1;
    }
}

// Экспорт для использования в HTML
if (typeof module !== 'undefined' && module.exports) {
    module.exports = IsaacSaveParser;
} else {
    window.IsaacSaveParser = IsaacSaveParser;
}
