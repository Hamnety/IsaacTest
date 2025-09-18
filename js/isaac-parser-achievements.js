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
        this.loadedTabs = new Set(); // Кэш загруженных вкладок
        this.isGeneratingImage = false; // Флаг генерации изображения
        
        // Инициализируем данные игры
        this.gameData = null;
        this.fullItemsData = null;
        this.achievementsData = null;
        this.itemConstants = null;
        
        this.initializeUI();
    }

    async loadGameData() {
        try {
            // Используем данные из isaac-data.js
            this.gameData = ISAAC_GAME_DATA;
            this.analysisResults.debugInfo.push('Данные игры загружены из isaac-data.js');
            
            // Загружаем полные данные предметов
            const itemsResponse = await fetch('data/isaac-items-full.json');
            if (itemsResponse.ok) {
                this.fullItemsData = await itemsResponse.json();
                this.analysisResults.debugInfo.push('Полные данные предметов загружены');
            } else {
                this.analysisResults.debugInfo.push('Не удалось загрузить полные данные предметов, используем базовые');
            }
            
            // Загружаем данные достижений
            const achievementsResponse = await fetch('data/achievements_unlock_final.json');
            if (achievementsResponse.ok) {
                this.achievementsData = await achievementsResponse.json();
                this.analysisResults.debugInfo.push('Финальные данные достижений загружены');
                this.analysisResults.debugInfo.push(`Загружено ${Object.keys(this.achievementsData.achievements).length} достижений`);
            } else {
                this.analysisResults.debugInfo.push('Не удалось загрузить финальные данные достижений');
            }
            
            // Загружаем константы предметов
            const constantsResponse = await fetch('data/isaac-item-constants.json');
            if (constantsResponse.ok) {
                this.itemConstants = await constantsResponse.json();
                this.analysisResults.debugInfo.push('Константы предметов загружены');
            } else {
                this.analysisResults.debugInfo.push('Не удалось загрузить константы предметов');
            }
        } catch (error) {
            this.analysisResults.debugInfo.push('Ошибка загрузки данных игры: ' + error.message);
            this.analysisResults.debugInfo.push('Используем fallback данные');
            
            // Fallback данные с базовыми персонажами и челленджами
            this.gameData = {
                characters: {
                    "1": { "name": "Магдалена", "unlock": "Имейте 7 или больше контейнеров красных сердец одновременно" },
                    "2": { "name": "Каин", "unlock": "Держите 55 или больше монет одновременно" },
                    "3": { "name": "Иуда", "unlock": "Победите Сатану/Satan" },
                    "32": { "name": "???", "unlock": "Победите Сердце Мамы/Mom's Heart 10 раз" },
                    "42": { "name": "Ева", "unlock": "Не поднимайте никаких сердец 2 этажа подряд" },
                    "67": { "name": "Самсон", "unlock": "Пройдите 2 этажа подряд без получения урона" },
                    "80": { "name": "Лазарь", "unlock": "Имейте 4 или больше сердец души одновременно" },
                    "79": { "name": "Азазель", "unlock": "Совершите 3 сделки с Дьяволом в одном забеге" },
                    "81": { "name": "Эдем", "unlock": "Завершите 4 главу" },
                    "82": { "name": "Лост (Потерянный)", "unlock": "Специальные условия смерти" }
                },
                challenges: {
                    "89": { "name": "Кромешная тьма", "unlock": "Завершите 'Кромешная тьма/Pitch Black' испытание #1" },
                    "90": { "name": "Сноб", "unlock": "Завершите 'Сноб/High Brow' испытание #2" },
                    "91": { "name": "Травма головы", "unlock": "Завершите 'Травма головы/Head Trauma' испытание #3" },
                    "92": { "name": "Тьма наступает", "unlock": "Завершите 'Тьма наступает/Darkness Falls' испытание #4" },
                    "93": { "name": "Танк", "unlock": "Завершите 'Танк/The Tank' испытание #5" }
                },
                completionMarks: {},
                totals: { characters: 34, challenges: 45, items: 720, achievements: 640 }
            };
        }
    }

    loadAchievementData() {
        // Используем данные из внешнего файла
        return ISAAC_GAME_DATA;
    }

    loadCharacterData() {
        // Используем данные из внешнего файла
        return {
            total: ISAAC_GAME_DATA.totals.characters,
            list: ISAAC_GAME_DATA.characters
        };
    }

    loadBossData() {
        // Используем данные из внешнего файла
        return ISAAC_GAME_DATA;
    }

    loadChallengeData() {
        // Используем данные из внешнего файла
        return {
            total: ISAAC_GAME_DATA.totals.challenges,
            list: ISAAC_GAME_DATA.challenges
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

        // Очищаем все вкладки при загрузке нового файла
        this.clearAllTabs();

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
        console.log('Начинаем парсинг файла...');
        
        // Инициализируем данные игры, если они не загружены
        if (!this.gameData) {
            await this.loadGameData();
        }
        
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
        
        // Отладочная информация о секциях
        sections.forEach((section, index) => {
            this.analysisResults.debugInfo.push(`Секция ${index + 1}: тип ${section.type}, размер ${section.size}, количество ${section.count}`);
        });
        
        // Парсим достижения
        await this.parseAchievements(sections);
        
        // Анализируем прогресс на основе достижений
        await this.analyzeProgressFromAchievements();
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
                type: this.getAchievementType(i),
                description: this.getAchievementDescription(i),
                unlockCondition: this.getAchievementUnlockCondition(i)
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
                type: this.getAchievementType(i),
                description: this.getAchievementDescription(i),
                unlockCondition: this.getAchievementUnlockCondition(i)
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
        const maxItems = 1000; // Максимальный ID предмета
        
        for (let i = 1; i < maxItems; i++) {
            // Простая эвристика: ищем байты со значением 1 в области предметов
            const isFound = this.searchForItemPattern(i);
            
            // Если предмет "найден", проверяем его валидность
            if (isFound) {
                const itemData = this.getItemData(i);
                if (!this.isValidCollectibleID(i, itemData)) {
                    continue; // Пропускаем невалидные предметы
                }
                
                foundItems++;
            }
            
            // Добавляем предмет в результаты (только если он валидный)
            const itemData = this.getItemData(i);
            if (this.isValidCollectibleID(i, itemData)) {
                this.analysisResults.items.push({
                    id: i,
                    name: itemData.name,
                    found: isFound,
                    type: itemData.type,
                    quality: itemData.quality,
                    description: itemData.description,
                    pool: itemData.pool
                });
            }
        }
        
        this.analysisResults.debugInfo.push(`Предметы (эвристика): ${foundItems} найдено`);
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
        if (this.achievementsData && this.achievementsData.achievements[id]) {
            return this.achievementsData.achievements[id].name;
        }
        return `#${id} Achievement`;
    }

    getBossName(achievementId) {
        // Проверяем обычных боссов
        for (const [bossName, ids] of Object.entries(ISAAC_GAME_DATA.bossData.normal)) {
            if (ids.includes(achievementId)) {
                return bossName;
            }
        }
        
        // Проверяем порченных боссов
        for (const [bossName, ids] of Object.entries(ISAAC_GAME_DATA.bossData.tainted)) {
            if (ids.includes(achievementId)) {
                return bossName;
            }
        }
        
        return `#${achievementId} Boss`;
    }

    getCharacterName(characterId) {
        if (ISAAC_GAME_DATA.characterNames[characterId]) {
            return ISAAC_GAME_DATA.characterNames[characterId];
        }
        return `#${characterId} Character`;
    }

    getAchievementType(id) {
        if (this.gameData && this.gameData.characters[id]) return 'character';
        if (this.gameData && this.gameData.challenges[id]) return 'challenge';
        return 'other';
    }

    getAchievementDescription(id) {
        if (this.achievementsData && this.achievementsData.achievements[id]) {
            return this.achievementsData.achievements[id].unlock || 'Достижение';
        }
        return 'Достижение';
    }

    getAchievementUnlockCondition(id) {
        if (this.achievementsData && this.achievementsData.achievements[id]) {
            return this.achievementsData.achievements[id].unlock || 'Условие разблокировки';
        }
        return 'Условие разблокировки';
    }

    async analyzeProgressFromAchievements() {
        // Проверяем, загружены ли данные игры
        if (!this.gameData) {
            this.analysisResults.debugInfo.push('Ошибка: Данные игры не загружены');
            return;
        }
        
        // Анализируем персонажей на основе достижений
        this.analysisResults.characters = [];
        let unlockedCharacters = 0;
        
        for (const characterId of ISAAC_GAME_DATA.characters) {
            let isUnlocked = false;
            
            // Исаак (ID 0) доступен с самого начала
            if (characterId === 0) {
                isUnlocked = true;
            } else {
                // Остальные персонажи разблокируются через достижения
                isUnlocked = this.analysisResults.achievements[characterId-1]?.unlocked || false;
            }
            
            if (isUnlocked) unlockedCharacters++;
            
            this.analysisResults.characters.push({
                id: characterId,
                name: this.getCharacterName(characterId),
                unlocked: isUnlocked,
                unlockCondition: this.getAchievementUnlockCondition(characterId),
                completionMarks: this.getCharacterCompletionMarks(characterId, isUnlocked),
                defeatedBosses: this.getCharacterDefeatedBosses(characterId)
            });
        }
        
        // Анализируем челленджи на основе достижений
        this.analysisResults.challenges = [];
        let completedChallenges = 0;
        
        for (const challengeId of ISAAC_GAME_DATA.challenges) {
            const isCompleted = this.analysisResults.achievements[challengeId-1]?.unlocked || false;
            
            if (isCompleted) completedChallenges++;
            
            this.analysisResults.challenges.push({
                id: challengeId,
                name: this.getAchievementName(challengeId),
                completed: isCompleted,
                unlockCondition: this.getAchievementUnlockCondition(challengeId)
            });
        }
        
        // Анализируем предметы (Collectibles Touched) - по логике официального viewer'а
        this.analysisResults.items = [];
        let foundItems = 0;
        
        // Ищем секцию предметов (тип 4 - CollectiblesChunk)
        const itemSection = this.findSections().find(s => s.type === 4);
        if (itemSection) {
            this.analysisResults.debugInfo.push(`Найдена секция предметов: тип ${itemSection.type}, длина ${itemSection.data.length}`);
            console.log(`Найдена секция предметов: тип ${itemSection.type}, длина ${itemSection.data.length}`);
            
            // Согласно официальному Isaac Save Viewer:
            // 1. Считаем только существующие предметы (ID от 1 до 999)
            // 2. Проверяем seenById массив: если things[i] !== 0, то предмет "потроган"
            // 3. Пропускаем несуществующие ID
            
            const seenById = itemSection.data;
            const maxItems = Math.min(seenById.length, 1000);
            console.log(`Максимальный ID для проверки: ${maxItems}`);
            
            let validItemsCount = 0;
            let foundItemsCount = 0;
            let totalFoundInArray = 0;
            
            // Сначала посчитаем, сколько всего "потроган" предметов в массиве
            for (let i = 1; i < maxItems; i++) {
                if (seenById[i] !== 0) {
                    totalFoundInArray++;
                }
            }
            this.analysisResults.debugInfo.push(`Всего "потроган" предметов в массиве: ${totalFoundInArray}`);
            console.log(`Всего "потроган" предметов в массиве: ${totalFoundInArray}`);
            
            // Посчитаем, сколько валидных предметов есть в JSON данных
            let validItemsInJSON = 0;
            if (this.fullItemsData) {
                for (let i = 1; i < 1000; i++) {
                    if (this.fullItemsData[i]) {
                        validItemsInJSON++;
                    }
                }
            } else if (ISAAC_ITEMS_DATA && ISAAC_ITEMS_DATA.repentance) {
                for (let i = 1; i < 1000; i++) {
                    if (ISAAC_ITEMS_DATA.repentance[i]) {
                        validItemsInJSON++;
                    }
                }
            }
            this.analysisResults.debugInfo.push(`Валидных предметов в JSON: ${validItemsInJSON}`);
            console.log(`Валидных предметов в JSON: ${validItemsInJSON}`);
            
            for (let i = 1; i < maxItems; i++) {
                // Проверяем, был ли предмет "потроган" (seenById)
                const isFound = seenById[i] !== 0;
                
                // Если предмет "потроган", проверяем его валидность
                if (isFound) {
                const itemData = this.getItemData(i);
                    if (!this.isValidCollectibleID(i, itemData)) {
                        this.analysisResults.debugInfo.push(`Предмет ${i} потроган, но невалидный: ${itemData.name}`);
                        continue; // Пропускаем невалидные предметы
                    }
                    
                    foundItemsCount++;
                }
                
                // Считаем общее количество валидных предметов для статистики
                // Только те предметы, которые есть в JSON данных
                if (this.fullItemsData && this.fullItemsData[i]) {
                    validItemsCount++;
                } else if (!this.fullItemsData && ISAAC_ITEMS_DATA && ISAAC_ITEMS_DATA.repentance && ISAAC_ITEMS_DATA.repentance[i]) {
                    validItemsCount++;
                }
                
                // Добавляем предмет в результаты (только если он валидный)
                const itemData = this.getItemData(i);
                if (this.isValidCollectibleID(i, itemData)) {
                    this.analysisResults.items.push({
                    id: i,
                    name: itemData.name,
                    found: isFound,
                    type: itemData.type,
                    quality: itemData.quality,
                    description: itemData.description,
                    pool: itemData.pool
                    });
                }
            }
            
            foundItems = foundItemsCount;
            this.analysisResults.debugInfo.push(`Валидных предметов: ${validItemsCount}, найдено: ${foundItemsCount}`);
            console.log(`Валидных предметов: ${validItemsCount}, найдено: ${foundItemsCount}`);
        } else {
            this.analysisResults.debugInfo.push('Предупреждение: Не найдена секция предметов, используем эвристический поиск');
            this.parseItemsHeuristic();
        }
        
        // Обновляем статистику
        this.analysisResults.statistics = {
            achievementsUnlocked: this.analysisResults.achievements.filter(a => a.unlocked).length,
            charactersUnlocked: unlockedCharacters,
            challengesCompleted: completedChallenges,
            itemsFound: foundItems
        };
        
        this.analysisResults.debugInfo.push(`Персонажи: ${unlockedCharacters}/${ISAAC_GAME_DATA.totals.characters} разблокировано`);
        this.analysisResults.debugInfo.push(`Челленджи: ${completedChallenges}/${ISAAC_GAME_DATA.totals.challenges} завершено`);
        this.analysisResults.debugInfo.push(`Предметы: ${foundItems}/${ISAAC_GAME_DATA.totals.items} найдено`);
    }
    
    getCharacterCompletionMarks(characterId, isUnlocked) {
        if (!isUnlocked) return [];
        
        // Получаем данные о боссах для персонажа
        const bossData = this.getCharacterDefeatedBosses(characterId);
        const marks = [];
        
        // Проверяем основные боссы
        const requiredBosses = ['Сатана', '???', 'Комната вызова', 'Айзек', 'Агнец', 'Сердце мамы', 'Hush', 'Мега сатана', 'Делириум'];
        
        for (const boss of bossData) {
            if (boss.defeated && requiredBosses.includes(boss.name)) {
                marks.push(boss.name);
            }
        }
        
        return marks;
    }

    getCharacterDefeatedBosses(characterId) {
        // Получаем ID боссов для персонажа
        const bossIds = ISAAC_GAME_DATA.characterBosses[characterId];
        
        if (!bossIds) {
            return [];
        }
        
        // Проверяем, какие боссы убиты (на основе достижений)
        const defeatedBosses = [];
        
        for (const bossId of bossIds) {
            const isDefeated = this.analysisResults.achievements[bossId - 1]?.unlocked || false;
            const bossName = this.getBossName(bossId);
            
            // Для порченных персонажей показываем объединенные достижения
            if (characterId >= 474) {
                // Порченные персонажи имеют объединенные достижения
                defeatedBosses.push({
                    id: bossId,
                    name: bossName,
                    defeated: isDefeated,
                    isTainted: true
                });
            } else {
                // Обычные персонажи имеют отдельные достижения для каждого босса
                defeatedBosses.push({
                    id: bossId,
                    name: bossName,
                    defeated: isDefeated,
                    isTainted: false
                });
            }
        }
        
        // Для порченных персонажей добавляем "Сердце мамы" если выполнены условия
        if (characterId >= 474) {
            const heartDefeated = this.checkTaintedHeartConditions(characterId);
            if (heartDefeated) {
                defeatedBosses.push({
                    id: 169, // ID достижения "Сердце мамы"
                    name: "Сердце мамы",
                    defeated: true,
                    isTainted: true,
                    isConditional: true
                });
            }
        }
        
        return defeatedBosses;
    }

    checkTaintedHeartConditions(characterId) {
        // Проверяем условия для засчитывания "Сердце мамы" у порченных персонажей
        const conditions = ISAAC_GAME_DATA.taintedHeartConditions;
        
        // Проверяем условие 1: Комната вызова + Hush
        const bossIds = ISAAC_GAME_DATA.characterBosses[characterId];
        if (!bossIds) return false;
        
        // Находим индекс персонажа в массиве порченных персонажей (474-490)
        const taintedIndex = characterId - 474;
        
        // Проверяем достижения для этого персонажа
        const bossCallAchievement = conditions["Комната вызова + Hush"][taintedIndex];
        const satanAchievement = conditions["Сатана + ??? + Айзек + Агнец"][taintedIndex];
        
        const bossCallDefeated = this.analysisResults.achievements[bossCallAchievement - 1]?.unlocked || false;
        const satanDefeated = this.analysisResults.achievements[satanAchievement - 1]?.unlocked || false;
        
        // "Сердце мамы" засчитывается если выполнено ЛЮБОЕ из условий
        return bossCallDefeated || satanDefeated;
    }
    
    getCharacterIndex(achievementId) {
        // Маппинг ID достижений на индексы персонажей
        const characterMap = {
            1: 1,   // Магдалена
            2: 2,   // Каин
            3: 3,   // Иуда
            32: 4,  // ???
            42: 5,  // Ева
            67: 6,  // Самсон
            80: 7,  // Лазарь
            79: 8,  // Азазель
            81: 9,  // Эдем
            82: 10, // Лост
            199: 11, // Лилит
            251: 12, // Хранитель
            340: 13, // Аполион
            390: 14, // Забытый
            404: 15, // Бетани
            405: 16, // Иаков и Исав
            474: 17, // Порченный Айзек
            475: 18, // Порченная Магдалена
            476: 19, // Порченный Каин
            477: 20, // Порченный Иуда
            478: 21, // Порченный ???
            479: 22, // Порченный Еву
            480: 23, // Порченный Самсон
            481: 24, // Порченный Азазель
            482: 25, // Порченный Лазарь
            483: 26, // Порченный Иден
            484: 27, // Порченный Лост
            485: 28, // Порченный Лилит
            486: 29, // Порченный Хранитель
            487: 30, // Порченный Аполлион
            488: 31, // Порченный Забытый
            489: 32, // Порченный Беттани
            490: 33  // Порченный Иаков и Исав
        };
        
        return characterMap[achievementId];
    }
    
    checkCompletionMark(characterId, markName) {
        // Здесь можно добавить логику для проверки завершенных отметок
        // на основе достижений или других данных из файла сохранения
        // Пока возвращаем false для всех отметок
        return false;
    }
    
    isValidCollectibleID(id, itemData) {
        // Валидация существования предмета по логике официального viewer'а
        if (!itemData) {
            return false;
        }
        if (id <= 0 || id >= 1000) {
            return false;
        }
        
        // Проверяем, что предмет есть в JSON данных (как в официальном viewer'е)
        // Если предмет есть в полных данных предметов, то он валидный
        if (this.fullItemsData && this.fullItemsData[id]) {
            return true;
        }
        
        // Fallback: проверяем базовые данные
        if (!this.fullItemsData && ISAAC_ITEMS_DATA && ISAAC_ITEMS_DATA.repentance && ISAAC_ITEMS_DATA.repentance[id]) {
            return true;
        }
        
        // Если нет полных данных, не считаем предмет валидным
        return false;
    }

    getItemData(itemId) {
        // Check full items data first
        if (this.fullItemsData && this.fullItemsData[itemId]) {
            const item = this.fullItemsData[itemId];
            return {
                name: item.name || `Item ${itemId}`,
                quality: this.getItemQuality(itemId),
                type: this.getItemType(itemId),
                description: item.text || item.description || '',
                pool: this.getItemPool(itemId)
            };
        }
        
        // Check Repentance items
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
        if (this.itemConstants && this.itemConstants.qualityColors) {
            return this.itemConstants.qualityColors[quality] || this.itemConstants.qualityColors[1];
        }
        // Fallback цвета
        const colors = {
            0: "#8b0000", // Quality 0
            1: "#a6adc8", // Quality 1
            2: "#a6e3a1", // Quality 2
            3: "#f9e2af", // Quality 3
            4: "#cba6f7"  // Quality 4
        };
        return colors[quality] || colors[1];
    }

    getTypeIcon(type) {
        if (this.itemConstants && this.itemConstants.typeIcons) {
            return this.itemConstants.typeIcons[type.toLowerCase()] || this.itemConstants.typeIcons.other;
        }
        // Fallback иконки
        const icons = {
            "active": "⚡",
            "passive": "🔮",
            "familiar": "👻",
            "trinket": "💍",
            "card": "🃏",
            "pill": "💊",
            "rune": "🔮"
        };
        return icons[type.toLowerCase()] || "❓";
    }

    getPoolColor(pool) {
        if (this.itemConstants && this.itemConstants.poolColors) {
            return this.itemConstants.poolColors[pool.toLowerCase()] || this.itemConstants.poolColors.other;
        }
        // Fallback цвета
        const colors = {
            "treasure": "#f9e2af",
            "shop": "#a6e3a1", 
            "boss": "#f38ba8",
            "devil": "#8b0000",
            "angel": "#a6e3a1",
            "secret": "#cba6f7",
            "library": "#89b4fa",
            "curse": "#f38ba8",
            "challenge": "#fab387",
            "golden": "#f9e2af",
            "red": "#f38ba8",
            "beggar": "#a6adc8",
            "demon": "#8b0000"
        };
        return colors[pool.toLowerCase()] || "#a6adc8";
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
        const stats = this.analysisResults.statistics;
        
        if (!stats) {
            console.error('Статистика не загружена');
            return;
        }
        
        document.getElementById('achievementsCount').textContent = stats.achievementsUnlocked;
        document.getElementById('achievementsTotal').textContent = `из ${this.analysisResults.achievements.length} получено`;
        document.getElementById('achievementsProgress').style.width = 
            `${(stats.achievementsUnlocked / Math.max(this.analysisResults.achievements.length, 1) * 100)}%`;
        
        document.getElementById('charactersCount').textContent = stats.charactersUnlocked;
        document.getElementById('charactersTotal').textContent = `из ${ISAAC_GAME_DATA.totals.characters} разблокировано`;
        document.getElementById('charactersProgress').style.width = 
            `${(stats.charactersUnlocked / ISAAC_GAME_DATA.totals.characters * 100)}%`;
        
        document.getElementById('challengesCount').textContent = stats.challengesCompleted;
        document.getElementById('challengesTotal').textContent = `из ${ISAAC_GAME_DATA.totals.challenges} завершено`;
        document.getElementById('challengesProgress').style.width = 
            `${(stats.challengesCompleted / ISAAC_GAME_DATA.totals.challenges * 100)}%`;
        
        document.getElementById('itemsCount').textContent = stats.itemsFound;
        document.getElementById('itemsTotal').textContent = `из ${ISAAC_GAME_DATA.totals.items} найдено`;
        document.getElementById('itemsProgress').style.width = 
            `${(stats.itemsFound / ISAAC_GAME_DATA.totals.items * 100)}%`;
    }

    updateTabs() {
        // Очищаем кэш загруженных вкладок при обновлении данных
        this.loadedTabs.clear();
        
        // Загружаем только активную вкладку
        const activeTab = document.querySelector('.tab-button.active');
        if (activeTab) {
            const tabName = activeTab.dataset.tab;
            this.loadTabContent(tabName);
        }
    }

    updateAchievementsTab() {
        const container = document.getElementById('achievementsList');
        container.innerHTML = '';
        
        // Создаем один общий контейнер для ВСЕХ достижений
        const mainGrid = document.createElement('div');
        mainGrid.className = 'achievements-grid'; // Специальный класс только для достижений
        mainGrid.style.display = 'grid';
        mainGrid.style.gridTemplateColumns = 'repeat(auto-fill, minmax(150px, 1fr))';
        mainGrid.style.gap = '10px';
        mainGrid.style.width = '100%';
        mainGrid.style.gridAutoRows = 'min-content';
        
        // Собираем ВСЕ достижения и сортируем по ID
        const allAchievements = [...this.analysisResults.achievements].sort((a, b) => a.id - b.id);
        
        // Показываем ВСЕ достижения одним списком
        allAchievements.forEach(achievement => {
                    const div = document.createElement('div');
                    div.className = `item-card ${achievement.unlocked ? 'unlocked' : 'locked'}`;
            
                    div.innerHTML = `
                <div style="font-size: 0.9rem; font-weight: bold; color: #e2e8f0; margin-bottom: 12px; line-height: 1.3;">
                    #${achievement.id} ${achievement.name}
                </div>
                <div style="color: #a0aec0; font-size: 0.75rem; margin: 8px 0; line-height: 1.4;">
                    ${achievement.unlockCondition}
                </div>
                <div class="status-bottom ${achievement.unlocked ? 'unlocked' : 'locked'}">
                    ${achievement.unlocked ? '✓ ПОЛУЧЕНО' : '✗ ЗАБЛОКИРОВАНО'}
                </div>
                    `;
            mainGrid.appendChild(div);
                });
        
        container.appendChild(mainGrid);
    }

    getCategoryName(category) {
        const names = {
            characters: 'Персонажи',
            challenges: 'Челленджи', 
            items: 'Предметы',
            other: 'Другие достижения'
        };
        return names[category] || category;
    }

    updateCharactersTab() {
        const container = document.getElementById('charactersList');
        container.innerHTML = '';
        
        this.analysisResults.characters.forEach(character => {
            const div = document.createElement('div');
            div.className = `item-card character-card ${character.unlocked ? 'unlocked' : 'locked'}`;
            
            // Создаем список убитых и не убитых боссов
            let bossesList = '';
            if (character.defeatedBosses && character.defeatedBosses.length > 0) {
                const defeatedBosses = character.defeatedBosses.filter(boss => boss.defeated);
                const undefeatedBosses = character.defeatedBosses.filter(boss => !boss.defeated);
                const totalBosses = character.defeatedBosses.length;
                const isTainted = character.id >= 474;
                
                bossesList = `
                    <div class="bosses-section">
                        <div class="bosses-title">
                            ${isTainted ? 'Убитые боссы (объединенные достижения)' : 'Убитые боссы'} (${defeatedBosses.length}/${totalBosses})
                        </div>
                        <div class="bosses-list">
                            ${defeatedBosses.map(boss => 
                                `<span class="boss-tag ${isTainted ? 'tainted-boss' : ''} ${boss.isConditional ? 'conditional-boss' : ''}">✓${boss.name}</span>`
                            ).join('')}
                        </div>
                        ${defeatedBosses.length === 0 ? 
                            '<div class="no-bosses">Нет убитых боссов</div>' : 
                            ''
                        }
                        
                        ${undefeatedBosses.length > 0 ? `
                            <div class="bosses-title" style="margin-top: 12px; color: #a0aec0;">
                                Не убитые боссы (${undefeatedBosses.length}/${totalBosses})
                            </div>
                            <div class="bosses-list">
                                ${undefeatedBosses.map(boss => 
                                    `<span class="boss-tag undefeated-boss ${isTainted ? 'tainted-boss' : ''}">✗${boss.name}</span>`
                                ).join('')}
                            </div>
                        ` : ''}
                    </div>
                `;
            }
            
            div.innerHTML = `
                <div class="item-title" style="font-size: 1rem; font-weight: bold; color: #e2e8f0; margin-bottom: 8px; line-height: 1.3">
                    ${character.name}
                </div>
                <div class="character-status" style="color: ${character.unlocked ? '#ffd700' : '#4c566a'};">
                    ${character.unlocked ? '✓ РАЗБЛОКИРОВАН' : '✗ ЗАБЛОКИРОВАН'}
                </div>
                <div class="character-unlock-condition">
                    ${character.unlockCondition}
                </div>
                ${bossesList}
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
                <div class="item-title" style="font-size: 1rem; font-weight: bold; color: #e2e8f0; margin-bottom: 12px; line-height: 1.3;">
                    ${challenge.name}
                </div>
                <div style="color: #a0aec0; font-size: 0.85rem; margin: 8px 0; line-height: 1.4;">
                    ${challenge.unlockCondition}
                </div>
                <div class="status-bottom ${challenge.completed ? 'unlocked' : 'locked'}">
                    ${challenge.completed ? '✓ ЗАВЕРШЕН' : '✗ НЕ ЗАВЕРШЕН'}
                </div>
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
        
        // Показываем ВСЕ предметы без описаний
        sortedItems.forEach(item => {
            const div = document.createElement('div');
            div.className = `item-card ${item.found ? 'unlocked' : 'locked'}`;
            
            const qualityColor = this.getQualityColor(item.quality);
            const typeIcon = this.getTypeIcon(item.type);
            const poolColor = this.getPoolColor(item.pool);
            
            div.innerHTML = `
                <div class="item-title" style="font-size: 1rem; font-weight: bold; color: #e2e8f0; margin-bottom: 12px; line-height: 1.3;">
                    ${item.name}
                </div>
                <div style="color: ${qualityColor}; font-size: 0.85rem; margin: 8px 0; line-height: 1.4;">
                    Quality ${item.quality} • <span style="color: ${poolColor}">${item.pool}</span>
                </div>
                <div class="status-bottom ${item.found ? 'unlocked' : 'locked'}">
                    ${item.found ? '✓ НАЙДЕН' : '✗ НЕ НАЙДЕН'}
                </div>
            `;
            container.appendChild(div);
        });
    }


    switchTab(tabName) {
        // Сначала очищаем все неактивные вкладки
        this.clearInactiveTabs(tabName);
        
        // Переключаем вкладки
        document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
        
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
        document.getElementById(`${tabName}Tab`).classList.add('active');
        
        // Загружаем контент сразу без задержек
        this.loadTabContent(tabName);
    }

    clearInactiveTabs(activeTabName) {
        // Очищаем контент только неактивных вкладок для экономии памяти
        const tabs = ['achievements', 'characters', 'challenges', 'items'];
        
        tabs.forEach(tabName => {
            // Не очищаем активную вкладку
            if (tabName === activeTabName) return;
            
            const tab = document.getElementById(`${tabName}Tab`);
            if (!tab) return;
            
            // Находим контейнеры с контентом (исключаем фильтры)
            const contentContainers = tab.querySelectorAll('.item-grid, #achievementsList');
            contentContainers.forEach(container => {
                container.innerHTML = '';
            });
            
            // Убираем из кэша загруженных вкладок
            this.loadedTabs.delete(tabName);
        });
    }

    loadTabContent(tabName) {
        // Если вкладка уже загружена, не перезагружаем
        if (this.loadedTabs.has(tabName)) {
            return;
        }
        
        // Принудительно очищаем контент перед загрузкой
        this.clearTabContent(tabName);
        
        // Показываем краткий индикатор загрузки только для больших вкладок
        if (tabName === 'items' || tabName === 'achievements') {
            this.showLoadingIndicator(tabName);
            // Используем requestAnimationFrame для плавности
            requestAnimationFrame(() => {
                this.loadTabData(tabName);
            });
        } else {
            // Для маленьких вкладок загружаем сразу
            this.loadTabData(tabName);
        }
    }

    loadTabData(tabName) {
        switch(tabName) {
            case 'achievements':
                this.updateAchievementsTab();
                break;
            case 'characters':
                this.updateCharactersTab();
                break;
            case 'challenges':
                this.updateChallengesTab();
                break;
            case 'items':
                this.updateItemsTab();
                break;
        }
        
        // Отмечаем вкладку как загруженную
        this.loadedTabs.add(tabName);
        
        // Инициализируем фильтры для активной вкладки
        this.initializeFilters();
    }

    clearTabContent(tabName) {
        const tab = document.getElementById(`${tabName}Tab`);
        if (!tab) return;
        
        // Находим контейнеры с контентом (исключаем фильтры)
        const contentContainers = tab.querySelectorAll('.item-grid, #achievementsList');
        contentContainers.forEach(container => {
            container.innerHTML = '';
        });
    }

    showTabLoadingIndicator(tabName) {
        const tab = document.getElementById(`${tabName}Tab`);
        if (!tab) return;
        
        const container = tab.querySelector('.item-grid, #achievementsList');
        if (!container) return;
        
        container.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 60px; color: #a0aec0;">
                <div class="spinner" style="margin-bottom: 20px; font-size: 2rem;"></div>
                <div style="font-size: 1.1rem; font-weight: bold; margin-bottom: 10px;">
                    Переключение на вкладку
                </div>
                <div style="font-size: 0.9rem; color: #6b7280;">
                    Загрузка ${this.getTabDisplayName(tabName)}...
                </div>
            </div>
        `;
    }

    showLoadingIndicator(tabName) {
        const tab = document.getElementById(`${tabName}Tab`);
        if (!tab) return;
        
        const container = tab.querySelector('.item-grid, #achievementsList');
        if (!container) return;
        
        container.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 40px; color: #a0aec0;">
                <div class="spinner" style="margin-bottom: 15px;"></div>
                <div>Загрузка ${this.getTabDisplayName(tabName)}...</div>
            </div>
        `;
    }

    getTabDisplayName(tabName) {
        const names = {
            'achievements': 'достижений',
            'characters': 'персонажей',
            'challenges': 'челленджей',
            'items': 'предметов'
        };
        return names[tabName] || 'данных';
    }

    initializeFilters() {
        // Инициализируем фильтры для каждой вкладки
        this.setupFilterButtons('achievementsTab', 'achievements');
        this.setupFilterButtons('challengesTab', 'challenges');
        this.setupFilterButtons('itemsTab', 'items');
    }

    setupFilterButtons(tabId, dataType) {
        const tab = document.getElementById(tabId);
        if (!tab) return;

        const filterButtons = tab.querySelectorAll('.filter-button');
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Убираем активный класс со всех кнопок в этой вкладке
                filterButtons.forEach(btn => btn.classList.remove('active'));
                // Добавляем активный класс к нажатой кнопке
                button.classList.add('active');
                
                // Применяем фильтр
                const filter = button.dataset.filter;
                this.applyFilter(tabId, dataType, filter);
            });
        });
    }

    applyFilter(tabId, dataType, filter) {
        const tab = document.getElementById(tabId);
        if (!tab) return;

        const container = tab.querySelector('.item-grid, #achievementsList');
        if (!container) return;

        const items = container.querySelectorAll('.item-card, .achievement-category');
        
        items.forEach(item => {
            let shouldShow = true;
            
            if (filter === 'all') {
                shouldShow = true;
            } else if (dataType === 'achievements') {
                if (filter === 'unlocked') {
                    shouldShow = item.classList.contains('unlocked');
                } else if (filter === 'locked') {
                    shouldShow = item.classList.contains('locked');
                }
            } else if (dataType === 'challenges') {
                if (filter === 'completed') {
                    shouldShow = item.classList.contains('unlocked');
                } else if (filter === 'incomplete') {
                    shouldShow = item.classList.contains('locked');
                }
            } else if (dataType === 'items') {
                if (filter === 'found') {
                    shouldShow = item.classList.contains('unlocked');
                } else if (filter === 'missing') {
                    shouldShow = item.classList.contains('locked');
                }
            }
            
            item.style.display = shouldShow ? 'flex' : 'none';
        });
    }

    // Функция для принудительной перезагрузки вкладки
    reloadTab(tabName) {
        this.loadedTabs.delete(tabName);
        this.loadTabContent(tabName);
    }

    // Функция для принудительной очистки всех вкладок
    clearAllTabs() {
        const tabs = ['achievements', 'characters', 'challenges', 'items'];
        
        tabs.forEach(tabName => {
            this.clearTabContent(tabName);
            this.loadedTabs.delete(tabName);
        });
    }

    showFileInfo(file) {
        // Информация о файле больше не показывается
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

    // Функция для генерации изображения с не найденными предметами
    async generateMissingItemsImage() {
        // Предотвращаем множественные вызовы
        if (this.isGeneratingImage) {
            console.log('Генерация изображения уже в процессе...');
            return;
        }

        if (!this.analysisResults || !this.analysisResults.items) {
            alert('Сначала загрузите файл сохранения!');
            return;
        }

        const missingItems = [];
        
        // Находим все не найденные предметы
        for (const item of this.analysisResults.items) {
            if (!item.found) {
                missingItems.push(item);
            }
        }

        if (missingItems.length === 0) {
            alert('Все предметы найдены! Нечего генерировать.');
            return;
        }

        // Устанавливаем флаг генерации
        this.isGeneratingImage = true;
        
        // Блокируем кнопку
        const generateButton = document.getElementById('generateMissingItemsImage');
        if (generateButton) {
            generateButton.disabled = true;
            generateButton.textContent = 'Генерация...';
        }

        try {
            // Создаем canvas
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        // Максимальный размер для иконки предмета
        const maxItemSize = 64;
        const padding = 8;
        const itemsPerRow = 15; // 15 предметов в ряду для оригинальных размеров
        
        // Сначала загружаем все изображения, чтобы узнать их размеры
        const itemImages = [];
        let maxHeight = 0;
        let totalWidth = 0;
        
        // Загружаем все изображения
        for (let i = 0; i < missingItems.length; i++) {
            const item = missingItems[i];
            try {
                const img = new Image();
                img.crossOrigin = 'anonymous';
                
                await new Promise((resolve, reject) => {
                    img.onload = () => {
                        // Масштабируем изображение, если оно больше максимального размера
                        let width = img.width;
                        let height = img.height;
                        
                        if (width > maxItemSize || height > maxItemSize) {
                            const scale = Math.min(maxItemSize / width, maxItemSize / height);
                            width = Math.floor(width * scale);
                            height = Math.floor(height * scale);
                        }
                        
                        itemImages.push({
                            img: img,
                            width: width,
                            height: height,
                            originalWidth: img.width,
                            originalHeight: img.height
                        });
                        
                        maxHeight = Math.max(maxHeight, height);
                        resolve();
                    };
                    img.onerror = () => {
                        // Заглушка для отсутствующих изображений
                        itemImages.push({
                            img: null,
                            width: 32,
                            height: 32,
                            originalWidth: 32,
                            originalHeight: 32
                        });
                        maxHeight = Math.max(maxHeight, 32);
                        resolve();
                    };
                    img.src = `img/items/${item.id}.png`;
                });
            } catch (error) {
                console.error(`Ошибка загрузки изображения для предмета ${item.id}:`, error);
                itemImages.push({
                    img: null,
                    width: 32,
                    height: 32,
                    originalWidth: 32,
                    originalHeight: 32
                });
                maxHeight = Math.max(maxHeight, 32);
            }
        }
        
        // Вычисляем размеры canvas
        const rows = Math.ceil(missingItems.length / itemsPerRow);
        const canvasWidth = itemsPerRow * (maxItemSize + padding) + padding;
        const canvasHeight = rows * (maxHeight + padding) + padding + 60; // +60 для заголовка
        
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;
        
        // Заливаем фон
        ctx.fillStyle = '#1a202c';
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);
        
        // Добавляем заголовок
        ctx.fillStyle = '#ffd700';
        ctx.font = 'bold 24px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(`Не найденные предметы (${missingItems.length})`, canvasWidth / 2, 30);
        
        // Отрисовываем иконки предметов с оригинальными размерами
        for (let i = 0; i < missingItems.length; i++) {
            const itemData = itemImages[i];
            const row = Math.floor(i / itemsPerRow);
            const col = i % itemsPerRow;
            
            // Центрируем изображение в ячейке
            const cellX = col * (maxItemSize + padding) + padding;
            const cellY = row * (maxHeight + padding) + padding + 60; // +60 для заголовка
            
            const x = cellX + Math.floor((maxItemSize - itemData.width) / 2);
            const y = cellY + Math.floor((maxHeight - itemData.height) / 2);
            
            if (itemData.img) {
                // Рисуем иконку предмета с оригинальным размером
                ctx.drawImage(itemData.img, x, y, itemData.width, itemData.height);
                
                // Добавляем рамку для не найденных предметов
                ctx.strokeStyle = '#ff6b6b';
                ctx.lineWidth = 2;
                ctx.strokeRect(x, y, itemData.width, itemData.height);
            } else {
                // Рисуем заглушку для отсутствующих изображений
                ctx.fillStyle = '#4a5568';
                ctx.fillRect(x, y, itemData.width, itemData.height);
                ctx.fillStyle = '#ff6b6b';
                ctx.font = '12px Arial';
                ctx.textAlign = 'center';
                ctx.fillText('?', x + itemData.width/2, y + itemData.height/2 + 4);
                
                // Добавляем рамку для заглушки
                ctx.strokeStyle = '#ff6b6b';
                ctx.lineWidth = 2;
                ctx.strokeRect(x, y, itemData.width, itemData.height);
            }
        }
        
        // Конвертируем canvas в blob и скачиваем
        canvas.toBlob((blob) => {
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `missing_items_${new Date().toISOString().slice(0, 10)}.png`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            // Восстанавливаем кнопку
            this.isGeneratingImage = false;
            if (generateButton) {
                generateButton.disabled = false;
                generateButton.innerHTML = '<i class="fas fa-image"></i> Сгенерировать изображение не найденных предметов';
            }
        }, 'image/png');
        
        } catch (error) {
            console.error('Ошибка при генерации изображения:', error);
            alert('Ошибка при генерации изображения: ' + error.message);
            
            // Восстанавливаем кнопку в случае ошибки
            this.isGeneratingImage = false;
            if (generateButton) {
                generateButton.disabled = false;
                generateButton.innerHTML = '<i class="fas fa-image"></i> Сгенерировать изображение не найденных предметов';
            }
        }
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
    
    // Добавляем обработчик для кнопки генерации изображения
    const generateButton = document.getElementById('generateMissingItemsImage');
    if (generateButton) {
        generateButton.addEventListener('click', () => {
            window.achievementParser.generateMissingItemsImage();
        });
    }
});
