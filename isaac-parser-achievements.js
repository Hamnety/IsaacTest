// Isaac Save Parser - Achievement Based Analysis
// Анализ на основе достижений для точного определения прогресса

class IsaacAchievementParser {
    constructor() {
        this.fileData = null;
        this.dataView = null;
        this.analysisResults = {
            achievements: [],
            characters: [],
            challenges: [],
            items: [],
            statistics: {},
            debugInfo: []
        };
        
        // Данные о достижениях из achivments.txt
        this.achievementData = this.loadAchievementData();
        this.characterData = this.loadCharacterData();
        this.challengeData = this.loadChallengeData();
        this.itemData = this.loadItemData();
        
        this.initializeUI();
    }

    loadAchievementData() {
        // Данные о достижениях из файла achivments.txt
        return {
            // Персонажи (достижения 1-3, 32, 42, 67, 80, 81, 82, 156, 199, 251, 340, 404, 405, 390)
            characters: {
                1: { name: "Magdalene", unlock: "Имейте 7 или больше контейнеров красных сердец одновременно" },
                2: { name: "Cain", unlock: "Держите 55 или больше монет одновременно" },
                3: { name: "Judas", unlock: "Победите Сатану/Satan" },
                32: { name: "???", unlock: "Победите Сердце Мамы/Mom's Heart 10 раз" },
                42: { name: "Eve", unlock: "Не поднимайте никаких сердец 2 этажа подряд" },
                67: { name: "Samson", unlock: "Пройдите 2 этажа подряд без получения урона" },
                80: { name: "Lazarus", unlock: "Имейте 4 или больше сердец души одновременно" },
                81: { name: "Eden", unlock: "Завершите 4 главу" },
                82: { name: "The Lost", unlock: "Специальные условия" },
                156: { name: "Godhead", unlock: "Получите все отметки за прохождение усложнённого режима за Потерянного/The Lost" },
                199: { name: "Lilith", unlock: "Завершите Алчный Режим/Greed Mode за Азазеля/Azazel" },
                251: { name: "Keeper", unlock: "Пожертвуйте 1000 монет в автомат для пожертвований алчности" },
                340: { name: "Apollyon", unlock: "Победите Мега Сатану/Mega Satan" },
                404: { name: "Bethany", unlock: "Победите Сердце Мамы/Mom's Heart или Оно Живое!/It lives! за Лазаря/Lazarus в усложнённом режиме не умирая" },
                405: { name: "Jacob and Esau", unlock: "Победите Матерь/Mother" },
                390: { name: "The Forgotten", unlock: "Специальные условия" }
            },
            
            // Челленджи (достижения 157-178, 265-276, 277-300, 508-520, 521-540)
            challenges: {
                157: { name: "Darkness Falls", unlock: "Repentance: Победите Сердце Мамы/Mom's Heart 11 раз и разблокируйте Еву/Eve" },
                158: { name: "The Tank", unlock: "Имейте 7 или больше контейнеров красных сердец одновременно" },
                159: { name: "Solar System", unlock: "Победите Сердце Мамы/Mom's Heart 3 раза" },
                160: { name: "Suicide King", unlock: "Победите Сердце Мамы/Mom's Heart 11 раз и разблокируйте Лазаря/Lazarus" },
                161: { name: "Cat Got Your Tongue", unlock: "Поднимите любые 3 предмета, с меткой 'гаппи/guppy', в одном забеге" },
                162: { name: "Demo Man", unlock: "Победите Сердце Мамы/Mom's Heart 9 раз" },
                163: { name: "Cursed!", unlock: "Имейте 7 или больше контейнеров красных сердец одновременно" },
                164: { name: "Glass Cannon", unlock: "Завершите 'Семьянин/The Family Man' испытание #19, победите Локии/Lokii и разблокируйте Иуду/Judas" },
                165: { name: "The Family Man", unlock: "Поднимите 2 части ключа Ангела в одном забеге" },
                166: { name: "Purist", unlock: "Победите Маму/Mom" },
                167: { name: "Lost Baby", unlock: "Победите Сердце Мамы/Mom's Heart или Оно Живое!/It lives! в усложнённом режиме за Исаака/Isaac" },
                168: { name: "Cute Baby", unlock: "Победите Сердце Мамы/Mom's Heart или Оно Живое!/It lives! в усложнённом режиме за Магдалину/Magdalene" },
                169: { name: "Crow Baby", unlock: "Победите Сердце Мамы/Mom's Heart или Оно Живое!/It lives! в усложнённом режиме за Еву/Eve" },
                170: { name: "Shadow Baby", unlock: "Победите Сердце Мамы/Mom's Heart или Оно Живое!/It lives! в усложнённом режиме за Иуду/Judas" },
                171: { name: "Glass Baby", unlock: "Победите Сердце Мамы/Mom's Heart или Оно Живое!/It lives! в усложнённом режиме за Каина/Cain" },
                172: { name: "Wrapped Baby", unlock: "Afterbirth+: Победите Сердце Мамы/Mom's Heart или Оно Живое!/It lives! в усложнённом режиме за Азазеля/Azazel" },
                173: { name: "Begotten Baby", unlock: "Afterbirth+: Победите Сердце Мамы/Mom's Heart или Оно Живое!/It lives! в усложнённом режиме за Лазаря/Lazarus" },
                174: { name: "Dead Baby", unlock: "Победите Сердце Мамы/Mom's Heart или Оно Живое!/It lives! в усложнённом режиме за ???" },
                175: { name: "-0- Baby", unlock: "Победите Сердце Мамы/Mom's Heart или Оно Живое!/It lives! в усложнённом режиме за Потерянного/The Lost" },
                176: { name: "Glitch Baby", unlock: "Победите Сердце Мамы/Mom's Heart или Оно Живое!/It lives! в усложнённом режиме за Эдема/Eden" },
                177: { name: "Fighting Baby", unlock: "Победите Сердце Мамы/Mom's Heart или Оно Живое!/It lives! в усложнённом режиме за Самсона/Samson" },
                178: { name: "Lord of the Flies", unlock: "Поднимите любые 3 предмета, с меткой 'муха/fly', в одном забеге" },
                265: { name: "XXXXXXXXL", unlock: "Победите Маму/Mom" },
                266: { name: "SPEED!", unlock: "Победите Маму/Mom" },
                267: { name: "Blue Bomber", unlock: "Разрушьте 10 меченых камней и победите Сердце Мамы/Mom's Heart 11 раз" },
                268: { name: "PAY TO PLAY", unlock: "Победите Исаака/Isaac за Каина/Cain" },
                269: { name: "Have a Heart", unlock: "Победите Маму/Mom" },
                270: { name: "I RULE!", unlock: "Repentance: Победите ??? или Агнца/The Lamb, и победите Сатану/Satan за Исаака/Isaac" },
                271: { name: "BRAINS!", unlock: "Победите Исаака/Isaac 5 раз" },
                272: { name: "PRIDE DAY!", unlock: "Победите Маму/Mom" },
                273: { name: "Onan's Streak", unlock: "Repentance: Победите Маму/Mom" },
                274: { name: "The Guardian", unlock: "Победите Маму/Mom" },
                275: { name: "Generosity", unlock: "Пожертвуйте 999 монет в автомат для пожертвований алчности" },
                276: { name: "Mega", unlock: "Победите Мега Сатану/Mega Satan за всех не порченых/non-tainted персонажей" },
                277: { name: "Backasswards", unlock: "Repentance: Победите ??? или Агнца/The Lamb" },
                278: { name: "Aprils fool", unlock: "Победите Маму/Mom" },
                279: { name: "Pokey Mans", unlock: "Победите Сердце Мамы/Mom's Heart 11 раз" },
                280: { name: "Ultra Hard", unlock: "Repentance: Победите ??? или Агнца/The Lamb" },
                281: { name: "PONG", unlock: "Победите Исаака/Isaac 5 раз" },
                282: { name: "D Infinity", unlock: "Победите Cумасшествие/Delirium за Исаака/Isaac" },
                283: { name: "Eucharist", unlock: "Победите Cумасшествие/Delirium за Магдалину/Magdalene" },
                284: { name: "Silver Dollar", unlock: "Победите Cумасшествие/Delirium за Каина/Cain" },
                285: { name: "Shade", unlock: "Победите Cумасшествие/Delirium за Иуду/Judas" },
                286: { name: "King Baby", unlock: "Победите Cумасшествие/Delirium за ???" },
                287: { name: "Bloody Crown", unlock: "Победите Cумасшествие/Delirium за Самсона/Samson" },
                288: { name: "Dull Razor", unlock: "Победите Cумасшествие/Delirium за Еву/Eve" },
                289: { name: "Eden's Soul", unlock: "Победите Cумасшествие/Delirium за Эдема/Eden" },
                290: { name: "Dark Prince's Crown", unlock: "Победите Cумасшествие/Delirium за Азазеля/Azazel" },
                291: { name: "Compound Fracture", unlock: "Победите Cумасшествие/Delirium за Лазаря/Lazarus" },
                292: { name: "Euthanasia", unlock: "Победите Cумасшествие/Delirium за Лилит/Lilith" },
                293: { name: "Holy Card", unlock: "Победите Cумасшествие/Delirium за Потерянного/The Lost" },
                294: { name: "Crooked Penny", unlock: "Победите Cумасшествие/Delirium за Хранителя/Keeper" },
                295: { name: "Void", unlock: "Победите Cумасшествие/Delirium за Аполлиона/Apollyon" },
                296: { name: "D1", unlock: "Завершите Усложнённый Алчный Режим/Greedier Mode за Исаака/Isaac" },
                297: { name: "Glyph of Balance", unlock: "Завершите Усложнённый Алчный Режим/Greedier Mode за Магдалину/Magdalene" },
                298: { name: "Sack of Sacks", unlock: "Завершите Усложнённый Алчный Режим/Greedier Mode за Каина/Cain" },
                299: { name: "Eye of Belial", unlock: "Завершите Усложнённый Алчный Режим/Greedier Mode за Иуду/Judas" },
                300: { name: "Meconium", unlock: "Завершите Усложнённый Алчный Режим/Greedier Mode за ???" }
            }
        };
    }

    loadCharacterData() {
        return {
            // 34 персонажа для Repentance
            total: 34,
            list: [
                "Isaac", "Magdalene", "Cain", "Judas", "???", "Eve", "Samson", 
                "Azazel", "Lazarus", "Eden", "The Lost", "Lilith", "Keeper", 
                "Apollyon", "The Forgotten", "Bethany", "Jacob and Esau",
                // Tainted персонажи
                "Tainted Isaac", "Tainted Magdalene", "Tainted Cain", "Tainted Judas",
                "Tainted ???", "Tainted Eve", "Tainted Samson", "Tainted Azazel",
                "Tainted Lazarus", "Tainted Eden", "Tainted Lost", "Tainted Lilith",
                "Tainted Keeper", "Tainted Apollyon", "Tainted Forgotten", "Tainted Bethany",
                "Tainted Jacob"
            ]
        };
    }

    loadChallengeData() {
        return {
            // 45 челленджей для Repentance
            total: 45,
            list: [
                "Pitch Black", "High Brow", "Head Trauma", "Darkness Falls", "The Tank",
                "Solar System", "Suicide King", "Cat Got Your Tongue", "Demo Man", "Cursed!",
                "Glass Cannon", "The Family Man", "Purist", "XXXXXXXXL", "SPEED!",
                "Blue Bomber", "PAY TO PLAY", "Have a Heart", "I RULE!", "BRAINS!",
                "PRIDE DAY!", "Onan's Streak", "The Guardian", "Backasswards", "Aprils fool",
                "Pokey Mans", "Ultra Hard", "PONG", "Bloody Mary", "Baptism by Fire",
                "Isaac's Awakening", "Seeing Double", "Pica Run", "Hot Potato", "Cantripped!",
                "Red Redemption", "DELETE THIS", "Scat Man", "Bloody Mary", "Baptism by Fire",
                "Isaac's Awakening", "Seeing Double", "Pica Run", "Hot Potato"
            ]
        };
    }

    loadItemData() {
        // Данные о предметах из isaac-items-data.js
        return {
            total: 732, // Repentance
            categories: {
                active: "Активные предметы",
                passive: "Пассивные предметы", 
                trinket: "Брелки",
                special: "Специальные предметы"
            }
        };
    }

    initializeUI() {
        const uploadZone = document.getElementById('uploadZone');
        const fileInput = document.getElementById('fileInput');

        uploadZone.addEventListener('click', () => fileInput.click());
        uploadZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadZone.classList.add('dragover');
        });
        uploadZone.addEventListener('dragleave', () => {
            uploadZone.classList.remove('dragover');
        });
        uploadZone.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadZone.classList.remove('dragover');
            const files = e.dataTransfer.files;
            if (files.length > 0) this.handleFileSelect(files[0]);
        });

        fileInput.addEventListener('change', (e) => {
            if (e.target.files.length > 0) this.handleFileSelect(e.target.files[0]);
        });

        document.querySelectorAll('.tab-button').forEach(button => {
            button.addEventListener('click', () => this.switchTab(button.dataset.tab));
        });
    }

    async handleFileSelect(file) {
        if (!file.name.toLowerCase().endsWith('.dat')) {
            this.showError('Пожалуйста, выберите .dat файл сохранения Isaac');
            return;
        }

        try {
            this.showFileInfo(file);
            this.showLoading(true);
            
            const arrayBuffer = await file.arrayBuffer();
            this.fileData = new Uint8Array(arrayBuffer);
            this.dataView = new DataView(arrayBuffer);
            
            await this.parseFile();
            this.displayResults();
            
        } catch (error) {
            console.error('Ошибка при обработке файла:', error);
            this.showError('Ошибка при анализе файла: ' + error.message);
        } finally {
            this.showLoading(false);
        }
    }

    async parseFile() {
        this.analysisResults.debugInfo = [];
        
        // Проверяем заголовок
        const header = this.getString(0, 16);
        this.analysisResults.debugInfo.push(`Заголовок: ${header}`);
        this.analysisResults.debugInfo.push(`Длина заголовка: ${header.length}`);
        this.analysisResults.debugInfo.push(`Первые 13 символов: ${header.substring(0, 13)}`);
        
        // Поддерживаемые форматы Isaac (проверяем начало заголовка)
        const supportedHeaders = [
            "ISAACNGSAVE09R", // Repentance
            "ISAACNGSAVE08R", // Afterbirth+
            "ISAACNGSAVE07R", // Afterbirth
            "ISAACNGSAVE06R", // Rebirth
            "ISAACNGSAVE05R", // Rebirth (старый)
            "ISAACNGSAVE04R", // Rebirth (очень старый)
            "ISAACNGSAVE03R", // Rebirth (древний)
            "ISAACNGSAVE02R", // Rebirth (архаичный)
            "ISAACNGSAVE01R", // Rebirth (первобытный)
            "ISAACNGSAVE00R"  // Rebirth (изначальный)
        ];
        
        // Проверяем, начинается ли заголовок с поддерживаемого формата
        let detectedVersion = null;
        for (const supportedHeader of supportedHeaders) {
            this.analysisResults.debugInfo.push(`Проверяем: ${supportedHeader} в ${header.substring(0, supportedHeader.length)}`);
            if (header.startsWith(supportedHeader)) {
                detectedVersion = supportedHeader;
                this.analysisResults.debugInfo.push(`✓ Найден формат: ${supportedHeader}`);
                break;
            }
        }
        
        if (!detectedVersion) {
            throw new Error(`Неподдерживаемый формат файла: ${header}. Поддерживаются форматы Isaac: ${supportedHeaders.join(', ')}`);
        }
        
        this.analysisResults.debugInfo.push(`Обнаружен формат: ${detectedVersion}`);
        
        // Определяем версию игры
        let gameVersion = "Unknown";
        if (detectedVersion === "ISAACNGSAVE09R") gameVersion = "Repentance";
        else if (detectedVersion === "ISAACNGSAVE08R") gameVersion = "Afterbirth+";
        else if (detectedVersion === "ISAACNGSAVE07R") gameVersion = "Afterbirth";
        else if (detectedVersion.startsWith("ISAACNGSAVE0")) gameVersion = "Rebirth";
        
        this.analysisResults.debugInfo.push(`Версия игры: ${gameVersion}`);
        
        // Ищем секции файла
        const sections = this.findSections();
        this.analysisResults.debugInfo.push(`Найдено секций: ${sections.length}`);
        
        // Парсим достижения
        await this.parseAchievements(sections);
        
        // Анализируем прогресс на основе достижений
        this.analyzeProgressFromAchievements();
    }

    findSections() {
        const sections = [];
        let offset = 0x14; // После заголовка
        
        while (offset < this.fileData.length - 20) {
            const sectionData = new Array(3);
            for (let j = 0; j < 3; j++) {
                if (offset + 4 <= this.fileData.length) {
                    sectionData[j] = this.dataView.getUint32(offset, true);
                    offset += 4;
                }
            }
            
            const sectionType = sectionData[0];
            const sectionSize = sectionData[1];
            const entryCount = sectionData[2];
            
            if (sectionType > 0 && sectionType <= 11 && sectionSize > 0 && entryCount > 0) {
                sections.push({
                    type: sectionType,
                    size: sectionSize,
                    count: entryCount,
                    offset: offset,
                    data: this.fileData.slice(offset, offset + sectionSize)
                });
                
                offset += sectionSize;
            } else {
                break;
            }
        }
        
        return sections;
    }

    async parseAchievements(sections) {
        // Ищем секцию достижений (тип 1)
        const achievementSection = sections.find(s => s.type === 1);
        if (!achievementSection) {
            this.analysisResults.debugInfo.push('Предупреждение: Не найдена секция достижений, используем эвристический поиск');
            // Попробуем найти достижения эвристически
            this.parseAchievementsHeuristic();
            return;
        }
        
        this.analysisResults.achievements = [];
        let unlockedCount = 0;
        
        // Достижения хранятся как массив байтов
        const maxAchievements = Math.min(achievementSection.count, 700); // Ограничиваем для старых версий
        
        for (let i = 1; i < maxAchievements; i++) {
            const achievementOffset = i;
            const isUnlocked = achievementOffset < achievementSection.data.length && 
                              achievementSection.data[achievementOffset] === 1;
            
            if (isUnlocked) unlockedCount++;
            
            this.analysisResults.achievements[i-1] = {
                id: i,
                name: this.getAchievementName(i),
                unlocked: isUnlocked,
                type: this.getAchievementType(i)
            };
        }
        
        this.analysisResults.debugInfo.push(`Достижения: ${unlockedCount}/${achievementSection.count-1} разблокировано`);
    }

    parseAchievementsHeuristic() {
        this.analysisResults.debugInfo.push('Используем эвристический поиск достижений');
        this.analysisResults.achievements = [];
        
        // Ищем паттерны достижений в файле
        let unlockedCount = 0;
        const maxAchievements = 700; // Максимум для старых версий
        
        for (let i = 1; i < maxAchievements; i++) {
            // Простая эвристика: ищем байты со значением 1 в области достижений
            const isUnlocked = this.searchForAchievementPattern(i);
            
            if (isUnlocked) unlockedCount++;
            
            this.analysisResults.achievements[i-1] = {
                id: i,
                name: this.getAchievementName(i),
                unlocked: isUnlocked,
                type: this.getAchievementType(i)
            };
        }
        
        this.analysisResults.debugInfo.push(`Достижения (эвристика): ${unlockedCount}/${maxAchievements-1} разблокировано`);
    }

    searchForAchievementPattern(achievementId) {
        // Простая эвристика: ищем байт со значением 1 в области достижений
        // Начинаем поиск после заголовка
        const startOffset = 0x14;
        const searchRange = Math.min(0x1000, this.fileData.length - startOffset);
        
        for (let offset = startOffset; offset < startOffset + searchRange; offset++) {
            if (this.fileData[offset] === 1) {
                // Проверяем, может ли это быть достижением
                const relativeId = offset - startOffset;
                if (relativeId === achievementId) {
                    return true;
                }
            }
        }
        
        return false;
    }

    parseItemsHeuristic() {
        this.analysisResults.debugInfo.push('Используем эвристический поиск предметов');
        this.analysisResults.items = [];
        
        // Ищем паттерны предметов в файле
        let foundItems = 0;
        const maxItems = 800; // Максимум для старых версий
        
        for (let i = 1; i < maxItems; i++) {
            // Простая эвристика: ищем байты со значением 1 в области предметов
            const isFound = this.searchForItemPattern(i);
            
            if (isFound) foundItems++;
            
            const itemData = this.getItemData(i);
            this.analysisResults.items[i-1] = {
                id: i,
                name: itemData.name,
                found: isFound,
                type: itemData.type,
                quality: itemData.quality,
                description: itemData.description,
                pool: itemData.pool
            };
        }
        
        this.analysisResults.debugInfo.push(`Предметы (эвристика): ${foundItems}/${maxItems-1} найдено`);
    }

    searchForItemPattern(itemId) {
        // Простая эвристика: ищем байт со значением 1 в области предметов
        // Начинаем поиск после заголовка + смещение для предметов
        const startOffset = 0x14 + 0x1000; // Примерное смещение для предметов
        const searchRange = Math.min(0x2000, this.fileData.length - startOffset);
        
        for (let offset = startOffset; offset < startOffset + searchRange; offset++) {
            if (this.fileData[offset] === 1) {
                // Проверяем, может ли это быть предметом
                const relativeId = offset - startOffset;
                if (relativeId === itemId) {
                    return true;
                }
            }
        }
        
        return false;
    }

    getAchievementName(id) {
        if (this.achievementData.characters[id]) {
            return this.achievementData.characters[id].name;
        }
        if (this.achievementData.challenges[id]) {
            return this.achievementData.challenges[id].name;
        }
        return `Achievement ${id}`;
    }

    getAchievementType(id) {
        if (this.achievementData.characters[id]) return 'character';
        if (this.achievementData.challenges[id]) return 'challenge';
        return 'other';
    }

    analyzeProgressFromAchievements() {
        // Анализируем персонажей на основе достижений
        this.analysisResults.characters = [];
        let unlockedCharacters = 0;
        
        for (const [id, charData] of Object.entries(this.achievementData.characters)) {
            const achievementId = parseInt(id);
            const isUnlocked = this.analysisResults.achievements[achievementId-1]?.unlocked || false;
            
            if (isUnlocked) unlockedCharacters++;
            
            this.analysisResults.characters.push({
                id: achievementId,
                name: charData.name,
                unlocked: isUnlocked,
                unlockCondition: charData.unlock
            });
        }
        
        // Анализируем челленджи на основе достижений
        this.analysisResults.challenges = [];
        let completedChallenges = 0;
        
        for (const [id, challengeData] of Object.entries(this.achievementData.challenges)) {
            const achievementId = parseInt(id);
            const isCompleted = this.analysisResults.achievements[achievementId-1]?.unlocked || false;
            
            if (isCompleted) completedChallenges++;
            
            this.analysisResults.challenges.push({
                id: achievementId,
                name: challengeData.name,
                completed: isCompleted,
                unlockCondition: challengeData.unlock
            });
        }
        
        // Анализируем предметы
        this.analysisResults.items = [];
        let foundItems = 0;
        
        // Ищем секцию предметов (тип 4)
        const itemSection = this.findSections().find(s => s.type === 4);
        if (itemSection) {
            const maxItems = Math.min(itemSection.count, 800); // Ограничиваем для старых версий
            
            for (let i = 1; i < maxItems; i++) {
                const itemOffset = i;
                const isFound = itemOffset < itemSection.data.length && 
                               itemSection.data[itemOffset] === 1;
                
                if (isFound) foundItems++;
                
                const itemData = this.getItemData(i);
                this.analysisResults.items[i-1] = {
                    id: i,
                    name: itemData.name,
                    found: isFound,
                    type: itemData.type,
                    quality: itemData.quality,
                    description: itemData.description,
                    pool: itemData.pool
                };
            }
        } else {
            this.analysisResults.debugInfo.push('Предупреждение: Не найдена секция предметов, используем эвристический поиск');
            this.parseItemsHeuristic();
        }
        
        // Обновляем статистику
        this.analysisResults.stats = {
            achievementsUnlocked: this.analysisResults.achievements.filter(a => a.unlocked).length,
            charactersUnlocked: unlockedCharacters,
            challengesCompleted: completedChallenges,
            itemsFound: foundItems
        };
        
        this.analysisResults.debugInfo.push(`Персонажи: ${unlockedCharacters}/${this.characterData.total} разблокировано`);
        this.analysisResults.debugInfo.push(`Челленджи: ${completedChallenges}/${this.challengeData.total} завершено`);
        this.analysisResults.debugInfo.push(`Предметы: ${foundItems}/${this.itemData.total} найдено`);
    }

    getItemData(itemId) {
        // Check Repentance items first
        if (ISAAC_ITEMS_DATA && ISAAC_ITEMS_DATA.repentance[itemId]) {
            return ISAAC_ITEMS_DATA.repentance[itemId];
        }
        
        // Fallback for unknown items with version-specific data
        return {
            name: this.getItemName(itemId),
            quality: this.getItemQuality(itemId),
            type: this.getItemType(itemId),
            description: this.getItemDescription(itemId),
            pool: this.getItemPool(itemId)
        };
    }

    getItemName(itemId) {
        // Базовые названия предметов для разных версий
        if (itemId <= 100) return `Active Item ${itemId}`;
        if (itemId <= 300) return `Passive Item ${itemId}`;
        if (itemId <= 400) return `Trinket ${itemId}`;
        if (itemId <= 500) return `Special Item ${itemId}`;
        return `Item ${itemId}`;
    }

    getItemQuality(itemId) {
        // Простая эвристика качества предметов
        if (itemId <= 50) return 1; // Базовые предметы
        if (itemId <= 150) return 2; // Хорошие предметы
        if (itemId <= 300) return 3; // Отличные предметы
        if (itemId <= 500) return 4; // Легендарные предметы
        return 1; // По умолчанию
    }

    getItemDescription(itemId) {
        // Простые описания для разных типов предметов
        const type = this.getItemType(itemId);
        switch (type) {
            case "Active": return "Активный предмет";
            case "Passive": return "Пассивный предмет";
            case "Trinket": return "Брелок";
            case "Special": return "Специальный предмет";
            default: return "Неизвестный предмет";
        }
    }

    getItemPool(itemId) {
        // Простая эвристика пулов предметов
        if (itemId <= 100) return "Item Room";
        if (itemId <= 200) return "Devil Room";
        if (itemId <= 300) return "Angel Room";
        if (itemId <= 400) return "Secret Room";
        if (itemId <= 500) return "Shop";
        return "Unknown";
    }

    getItemType(itemId) {
        if (itemId >= 571 && itemId <= 587) return "Active"; // Soul items
        if (itemId >= 263 && itemId <= 570) return "Passive"; // Repentance items
        if (itemId <= 100) return "Active";
        if (itemId <= 300) return "Passive";
        if (itemId <= 400) return "Trinket";
        return "Special";
    }

    getQualityColor(quality) {
        const colors = {
            0: "#6c7086", // Quality 0
            1: "#a6adc8", // Quality 1
            2: "#a6e3a1", // Quality 2
            3: "#74c7ec", // Quality 3
            4: "#cba6f7"  // Quality 4
        };
        return colors[quality] || colors[1];
    }

    getTypeIcon(type) {
        const icons = {
            "Active": "⚡",
            "Passive": "💎",
            "Trinket": "🔑",
            "Special": "⭐"
        };
        return icons[type] || "❓";
    }

    getPoolColor(pool) {
        const colors = {
            "Item Room": "#a6e3a1",
            "Devil Room": "#f38ba8",
            "Angel Room": "#74c7ec",
            "Secret Room": "#fab387",
            "Shop": "#cba6f7",
            "Boss Room": "#e78284",
            "Special": "#f5c2e7",
            "Greed Mode Item Room": "#a6e3a1",
            "Red Chest": "#f38ba8",
            "Curse Room": "#e78284"
        };
        return colors[pool] || "#a6adc8";
    }

    getString(offset, length) {
        let result = '';
        for (let i = 0; i < length && offset + i < this.fileData.length; i++) {
            const byte = this.fileData[offset + i];
            if (byte === 0) break;
            if (byte >= 32 && byte <= 126) {
                result += String.fromCharCode(byte);
            }
        }
        return result;
    }

    // UI Methods
    displayResults() {
        this.updateStats();
        this.updateTabs();
        this.showAnalysis(true);
    }

    updateStats() {
        const stats = this.analysisResults.stats;
        
        document.getElementById('achievementsCount').textContent = stats.achievementsUnlocked;
        document.getElementById('achievementsTotal').textContent = `из ${this.analysisResults.achievements.length} получено`;
        document.getElementById('achievementsProgress').style.width = 
            `${(stats.achievementsUnlocked / Math.max(this.analysisResults.achievements.length, 1) * 100)}%`;
        
        document.getElementById('charactersCount').textContent = stats.charactersUnlocked;
        document.getElementById('charactersTotal').textContent = `из ${this.characterData.total} разблокировано`;
        document.getElementById('charactersProgress').style.width = 
            `${(stats.charactersUnlocked / this.characterData.total * 100)}%`;
        
        document.getElementById('challengesCount').textContent = stats.challengesCompleted;
        document.getElementById('challengesTotal').textContent = `из ${this.challengeData.total} завершено`;
        document.getElementById('challengesProgress').style.width = 
            `${(stats.challengesCompleted / this.challengeData.total * 100)}%`;
        
        document.getElementById('itemsCount').textContent = stats.itemsFound;
        document.getElementById('itemsTotal').textContent = `из ${this.itemData.total} найдено`;
        document.getElementById('itemsProgress').style.width = 
            `${(stats.itemsFound / this.itemData.total * 100)}%`;
    }

    updateTabs() {
        this.updateAchievementsTab();
        this.updateCharactersTab();
        this.updateChallengesTab();
        this.updateItemsTab();
        this.updateRawTab();
    }

    updateAchievementsTab() {
        const container = document.getElementById('achievementsList');
        container.innerHTML = '';
        
        // Показываем достижения по категориям
        const categories = {
            characters: this.analysisResults.achievements.filter(a => a.type === 'character'),
            challenges: this.analysisResults.achievements.filter(a => a.type === 'challenge'),
            other: this.analysisResults.achievements.filter(a => a.type === 'other')
        };
        
        for (const [category, achievements] of Object.entries(categories)) {
            if (achievements.length > 0) {
                const categoryDiv = document.createElement('div');
                categoryDiv.className = 'achievement-category';
                categoryDiv.innerHTML = `<h3>${this.getCategoryName(category)} (${achievements.filter(a => a.unlocked).length}/${achievements.length})</h3>`;
                container.appendChild(categoryDiv);
                
                achievements.slice(0, 20).forEach(achievement => {
                    const div = document.createElement('div');
                    div.className = `item-card ${achievement.unlocked ? 'unlocked' : 'locked'}`;
                    div.innerHTML = `
                        <strong>${achievement.name}</strong><br>
                        <span style="color: ${achievement.unlocked ? '#a6e3a1' : '#f38ba8'}">
                            ${achievement.unlocked ? '✓ Получено' : '✗ Заблокировано'}
                        </span>
                    `;
                    container.appendChild(div);
                });
            }
        }
    }

    getCategoryName(category) {
        const names = {
            characters: 'Персонажи',
            challenges: 'Челленджи', 
            other: 'Другие достижения'
        };
        return names[category] || category;
    }

    updateCharactersTab() {
        const container = document.getElementById('charactersList');
        container.innerHTML = '';
        
        this.analysisResults.characters.forEach(character => {
            const div = document.createElement('div');
            div.className = `item-card ${character.unlocked ? 'unlocked' : 'locked'}`;
            div.innerHTML = `
                <strong>${character.name}</strong><br>
                <div style="color: #a6adc8; font-size: 0.8rem; margin: 5px 0;">
                    ${character.unlockCondition}
                </div>
                <span style="color: ${character.unlocked ? '#a6e3a1' : '#f38ba8'}">
                    ${character.unlocked ? '✓ Разблокирован' : '✗ Заблокирован'}
                </span>
            `;
            container.appendChild(div);
        });
    }

    updateChallengesTab() {
        const container = document.getElementById('challengesList');
        container.innerHTML = '';
        
        this.analysisResults.challenges.forEach(challenge => {
            const div = document.createElement('div');
            div.className = `item-card ${challenge.completed ? 'unlocked' : 'locked'}`;
            div.innerHTML = `
                <strong>${challenge.name}</strong><br>
                <div style="color: #a6adc8; font-size: 0.8rem; margin: 5px 0;">
                    ${challenge.unlockCondition}
                </div>
                <span style="color: ${challenge.completed ? '#a6e3a1' : '#f38ba8'}">
                    ${challenge.completed ? '✓ Завершен' : '✗ Не завершен'}
                </span>
            `;
            container.appendChild(div);
        });
    }

    updateItemsTab() {
        const container = document.getElementById('itemsList');
        container.innerHTML = '';
        
        const sortedItems = [...this.analysisResults.items].sort((a, b) => {
            if (a.found && !b.found) return -1;
            if (!a.found && b.found) return 1;
            return 0;
        });
        
        sortedItems.slice(0, 100).forEach(item => {
            const div = document.createElement('div');
            div.className = `item-card ${item.found ? 'unlocked' : 'locked'}`;
            
            const qualityColor = this.getQualityColor(item.quality);
            const typeIcon = this.getTypeIcon(item.type);
            const poolColor = this.getPoolColor(item.pool);
            
            div.innerHTML = `
                <strong>${item.name}</strong><br>
                <div style="color: #a6adc8; font-size: 0.8rem; margin: 5px 0;">
                    ${typeIcon} ${item.type} • ${item.description}
                </div>
                <div style="color: ${qualityColor}; font-size: 0.7rem; margin: 3px 0;">
                    Quality ${item.quality} • <span style="color: ${poolColor}">${item.pool}</span>
                </div>
                <span style="color: ${item.found ? '#a6e3a1' : '#f38ba8'}">
                    ${item.found ? '✓ Найден' : '✗ Не найден'}
                </span>
            `;
            container.appendChild(div);
        });
    }

    updateRawTab() {
        const container = document.getElementById('rawData');
        let content = '';
        
        if (this.analysisResults.debugInfo.length > 0) {
            content += '=== ACHIEVEMENT-BASED PARSER DEBUG INFO ===\n';
            this.analysisResults.debugInfo.forEach(info => {
                content += info + '\n';
            });
            content += '\n';
        }
        
        if (this.fileData) {
            content += '=== HEX DUMP (первые 500 байт) ===\n';
            for (let i = 0; i < Math.min(500, this.fileData.length); i += 16) {
                let line = i.toString(16).padStart(8, '0') + ': ';
                let ascii = '';
                
                for (let j = 0; j < 16 && i + j < this.fileData.length; j++) {
                    const byte = this.fileData[i + j];
                    line += byte.toString(16).padStart(2, '0') + ' ';
                    ascii += (byte >= 32 && byte <= 126) ? String.fromCharCode(byte) : '.';
                }
                
                line = line.padEnd(60) + ' ' + ascii;
                content += line + '\n';
            }
        }
        
        container.textContent = content;
    }

    switchTab(tabName) {
        document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
        
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
        document.getElementById(`${tabName}Tab`).classList.add('active');
    }

    showFileInfo(file) {
        document.getElementById('fileName').textContent = file.name;
        document.getElementById('fileSize').textContent = this.formatFileSize(file.size);
        
        const reader = new FileReader();
        reader.onload = (e) => {
            const header = new TextDecoder().decode(e.target.result.slice(0, 20));
            document.getElementById('fileFormat').textContent = header.replace(/[^\x20-\x7E]/g, '');
        };
        reader.readAsArrayBuffer(file.slice(0, 20));
        
        document.getElementById('fileInfo').style.display = 'block';
    }

    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    showError(message) {
        const errorElement = document.getElementById('errorMessage');
        errorElement.textContent = message;
        errorElement.style.display = 'block';
        setTimeout(() => {
            errorElement.style.display = 'none';
        }, 5000);
    }

    showLoading(show) {
        document.getElementById('loading').style.display = show ? 'block' : 'none';
    }

    showAnalysis(show) {
        document.getElementById('analysisSection').style.display = show ? 'block' : 'none';
    }
}

// Export functions
function exportResults() {
    if (!window.achievementParser || !window.achievementParser.analysisResults) {
        alert('Сначала загрузите и проанализируйте файл сохранения');
        return;
    }

    const results = window.achievementParser.analysisResults;
    const data = {
        timestamp: new Date().toISOString(),
        parser: 'IsaacAchievementParser',
        stats: results.stats,
        debugInfo: results.debugInfo,
        achievements: results.achievements.filter(a => a.unlocked).map(a => a.name),
        characters: results.characters.map(c => ({
            name: c.name,
            unlocked: c.unlocked,
            unlockCondition: c.unlockCondition
        })),
        challenges: results.challenges.map(c => ({
            name: c.name,
            completed: c.completed,
            unlockCondition: c.unlockCondition
        })),
        items: results.items.filter(i => i.found).slice(0, 100).map(i => i.name)
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'isaac-achievement-analysis.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    window.achievementParser = new IsaacAchievementParser();
});
