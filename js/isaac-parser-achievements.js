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
            debugInfo: []
        };
        this.gameData = null;
        this.achievementsData = null;
    }

    async loadGameData() {
        try {
            // Загружаем данные достижений
            const achievementsResponse = await fetch('data/achievements_unlock_final.json');
            if (achievementsResponse.ok) {
                this.achievementsData = await achievementsResponse.json();
                this.analysisResults.debugInfo.push('Финальные данные достижений загружены');
                this.analysisResults.debugInfo.push(`Загружено ${Object.keys(this.achievementsData.achievements).length} достижений`);
            } else {
                this.analysisResults.debugInfo.push('Не удалось загрузить финальные данные достижений');
            }
            
            // Загружаем данные предметов
            const itemsResponse = await fetch('data/isaac-items-full.json');
            if (itemsResponse.ok) {
                this.gameData = await itemsResponse.json();
                this.analysisResults.debugInfo.push('Данные предметов загружены');
            } else {
                this.analysisResults.debugInfo.push('Не удалось загрузить данные предметов');
            }
        } catch (error) {
            this.analysisResults.debugInfo.push(`Ошибка загрузки данных: ${error.message}`);
        }
    }

    loadAchievementData() {
        // Используем данные из внешнего файла
        return ISAAC_GAME_DATA;
    }

    loadCharacterData() {
        return {
            total: ISAAC_GAME_DATA.totals.characters,
            list: ISAAC_GAME_DATA.characters
        };
    }

    loadBossData() {
        return ISAAC_GAME_DATA;
    }

    loadChallengeData() {
        return {
            total: ISAAC_GAME_DATA.totals.challenges,
            list: ISAAC_GAME_DATA.challenges
        };
    }

    async parseFile(file) {
        try {
            this.analysisResults.debugInfo = [];
            this.analysisResults.debugInfo.push('Начинаем анализ файла...');
            
            // Читаем файл как ArrayBuffer
            this.fileData = await file.arrayBuffer();
            this.dataView = new DataView(this.fileData);
            
            this.analysisResults.debugInfo.push(`Размер файла: ${this.fileData.byteLength} байт`);
            
            // Проверяем заголовок файла
            const header = this.readHeader();
            this.analysisResults.debugInfo.push(`Заголовок файла: ${header}`);
            
            // Инициализируем данные игры, если они не загружены
            if (!this.gameData) {
                await this.loadGameData();
            }
            
            // Анализируем прогресс на основе достижений
            await this.analyzeProgressFromAchievements();
            
            this.analysisResults.debugInfo.push('Анализ завершен успешно');
            
            // Обновляем интерфейс
            this.updateStats();
            this.updateCharactersTab();
            this.updateChallengesTab();
            this.updateItemsTab();
            this.updateAchievementsTab();
            
            // Показываем результаты
            document.getElementById('analysisSection').style.display = 'block';
            document.getElementById('loading').style.display = 'none';
            
        } catch (error) {
            console.error('Ошибка при обработке файла:', error);
            this.showError(`Ошибка при обработке файла: ${error.message}`);
        }
    }

    readHeader() {
        // Читаем первые 16 байт как заголовок
        let header = '';
        for (let i = 0; i < 16; i++) {
            const byte = this.dataView.getUint8(i);
            if (byte === 0) break;
            header += String.fromCharCode(byte);
        }
        return header;
    }

    findSections() {
        const sections = [];
        let offset = 16; // Пропускаем заголовок
        
        while (offset < this.dataView.byteLength) {
            const sectionType = this.dataView.getUint32(offset, true);
            const sectionSize = this.dataView.getUint32(offset + 4, true);
            const sectionCount = this.dataView.getUint32(offset + 8, true);
            
            if (sectionSize === 0 || sectionCount === 0) break;
            
            sections.push({
                type: sectionType,
                size: sectionSize,
                count: sectionCount,
                offset: offset + 12
            });
            
            offset += 12 + sectionSize;
        }
        
        return sections;
    }

    async analyzeProgressFromAchievements() {
        this.analysisResults.debugInfo.push('Анализируем прогресс на основе достижений...');
        
        // Инициализируем массив достижений
        this.analysisResults.achievements = new Array(640).fill(null).map((_, i) => ({
            id: i + 1,
            unlocked: false
        }));
        
        // Парсим достижения из файла
        const sections = this.findSections();
        for (const section of sections) {
            if (section.type === 1) { // Секция достижений
                this.parseAchievements(section);
                break;
            }
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
        
        // Анализируем предметы на основе достижений
        this.analysisResults.items = [];
        let foundItems = 0;
        
        if (this.gameData && this.gameData.items) {
            for (const [itemId, itemData] of Object.entries(this.gameData.items)) {
                const achievementId = itemData.achievement;
                const isFound = achievementId ? (this.analysisResults.achievements[achievementId-1]?.unlocked || false) : false;
                
                if (isFound) foundItems++;
                
                this.analysisResults.items.push({
                    id: parseInt(itemId),
                    name: itemData.name,
                    found: isFound,
                    unlockCondition: this.getAchievementUnlockCondition(achievementId)
                });
            }
        }
        
        this.analysisResults.debugInfo.push(`Разблокировано персонажей: ${unlockedCharacters}/${ISAAC_GAME_DATA.totals.characters}`);
        this.analysisResults.debugInfo.push(`Завершено челленджей: ${completedChallenges}/${ISAAC_GAME_DATA.totals.challenges}`);
        this.analysisResults.debugInfo.push(`Найдено предметов: ${foundItems}/${ISAAC_GAME_DATA.totals.items}`);
    }

    parseAchievements(section) {
        this.analysisResults.debugInfo.push(`Парсим секцию достижений: ${section.count} достижений`);
        
        for (let i = 0; i < section.count; i++) {
            const achievementId = this.dataView.getUint32(section.offset + i * 4, true);
            if (achievementId > 0 && achievementId <= 640) {
                this.analysisResults.achievements[achievementId - 1].unlocked = true;
            }
        }
    }

    getCharacterCompletionMarks(characterId, isUnlocked) {
        if (!isUnlocked) return [];
        
        const marks = [];
        const bossData = this.getCharacterDefeatedBosses(characterId);
        
        // Проверяем основные боссы
        const requiredBosses = ['Сатана', '???', 'Комната вызова', 'Айзек', 'Агнец', 'Сердце мамы', 'Hush', 'Мега сатана', 'Делириум'];
        
        for (const boss of bossData) {
            if (boss.defeated && requiredBosses.includes(boss.name)) {
                marks.push(boss.name);
            }
        }
        
        return marks;
    }

    isCharacterUnlocked(characterId) {
        if (characterId === 0) return true; // Исаак всегда разблокирован
        
        if (this.analysisResults.achievements[characterId - 1]) {
            return this.analysisResults.achievements[characterId - 1].unlocked;
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

    getAchievementUnlockCondition(id) {
        if (this.achievementsData && this.achievementsData.achievements[id]) {
            return this.achievementsData.achievements[id].unlock;
        }
        return 'Неизвестно';
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
        
        return defeatedBosses;
    }
    
    getCharacterIndex(achievementId) {
        // Ищем персонажа по ID достижения
        for (const [characterId, bossIds] of Object.entries(ISAAC_GAME_DATA.characterBosses)) {
            if (bossIds.includes(achievementId)) {
                return parseInt(characterId);
            }
        }
        return -1;
    }

    updateStats() {
        const unlockedAchievements = this.analysisResults.achievements.filter(a => a.unlocked).length;
        const unlockedCharacters = this.analysisResults.characters.filter(c => c.unlocked).length;
        const completedChallenges = this.analysisResults.challenges.filter(c => c.completed).length;
        const foundItems = this.analysisResults.items.filter(i => i.found).length;
        
        document.getElementById('achievementsCount').textContent = unlockedAchievements;
        document.getElementById('achievementsTotal').textContent = `из ${ISAAC_GAME_DATA.totals.achievements} получено`;
        document.getElementById('achievementsProgress').style.width = `${(unlockedAchievements / ISAAC_GAME_DATA.totals.achievements) * 100}%`;
        
        document.getElementById('charactersCount').textContent = unlockedCharacters;
        document.getElementById('charactersTotal').textContent = `из ${ISAAC_GAME_DATA.totals.characters} разблокировано`;
        document.getElementById('charactersProgress').style.width = `${(unlockedCharacters / ISAAC_GAME_DATA.totals.characters) * 100}%`;
        
        document.getElementById('challengesCount').textContent = completedChallenges;
        document.getElementById('challengesTotal').textContent = `из ${ISAAC_GAME_DATA.totals.challenges} завершено`;
        document.getElementById('challengesProgress').style.width = `${(completedChallenges / ISAAC_GAME_DATA.totals.challenges) * 100}%`;
        
        document.getElementById('itemsCount').textContent = foundItems;
        document.getElementById('itemsTotal').textContent = `из ${ISAAC_GAME_DATA.totals.items} найдено`;
        document.getElementById('itemsProgress').style.width = `${(foundItems / ISAAC_GAME_DATA.totals.items) * 100}%`;
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
                                `<span class="boss-tag ${isTainted ? 'tainted-boss' : ''}">✓${boss.name}</span>`
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
                <div style="font-size: 1rem; font-weight: bold; color: #e2e8f0; margin-bottom: 8px; line-height: 1.3;">
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
                <div style="font-size: 1rem; font-weight: bold; color: #e2e8f0; margin-bottom: 8px;">
                    ${challenge.name}
                </div>
                <div style="color: ${challenge.completed ? '#ffd700' : '#4c566a'}; font-size: 0.8rem; margin-bottom: 8px;">
                    ${challenge.completed ? '✓ ЗАВЕРШЕН' : '✗ НЕ ЗАВЕРШЕН'}
                </div>
                <div style="color: #a0aec0; font-size: 0.7rem;">
                    ${challenge.unlockCondition}
                </div>
            `;
            container.appendChild(div);
        });
    }

    updateItemsTab() {
        const container = document.getElementById('itemsList');
        container.innerHTML = '';
        
        this.analysisResults.items.forEach(item => {
            const div = document.createElement('div');
            div.className = `item-card ${item.found ? 'unlocked' : 'locked'}`;
            
            div.innerHTML = `
                <div style="font-size: 1rem; font-weight: bold; color: #e2e8f0; margin-bottom: 8px;">
                    ${item.name}
                </div>
                <div style="color: ${item.found ? '#ffd700' : '#4c566a'}; font-size: 0.8rem; margin-bottom: 8px;">
                    ${item.found ? '✓ НАЙДЕН' : '✗ НЕ НАЙДЕН'}
                </div>
                <div style="color: #a0aec0; font-size: 0.7rem;">
                    ${item.unlockCondition}
                </div>
            `;
            container.appendChild(div);
        });
    }

    updateAchievementsTab() {
        const container = document.getElementById('achievementsList');
        container.innerHTML = '';
        
        // Группируем достижения по категориям
        const categories = {
            characters: [],
            challenges: [],
            items: [],
            other: []
        };
        
        this.analysisResults.achievements.forEach(achievement => {
            if (achievement.unlocked) {
                const type = this.getAchievementType(achievement.id);
                categories[type].push(achievement);
            }
        });
        
        // Отображаем каждую категорию
        Object.entries(categories).forEach(([categoryName, achievements]) => {
            if (achievements.length === 0) return;
            
            const categoryDiv = document.createElement('div');
            categoryDiv.className = 'achievement-category';
            
            const categoryTitle = {
                characters: 'Персонажи',
                challenges: 'Челленджи',
                items: 'Предметы',
                other: 'Другие'
            }[categoryName];
            
            categoryDiv.innerHTML = `
                <h3>${categoryTitle} (${achievements.length})</h3>
                <div class="achievements-grid">
                    ${achievements.map(achievement => `
                        <div class="item-card unlocked">
                            <div style="font-size: 0.9rem; font-weight: bold; color: #e2e8f0; margin-bottom: 8px;">
                                ${this.getAchievementName(achievement.id)}
                            </div>
                            <div style="color: #ffd700; font-size: 0.7rem;">
                                ✓ РАЗБЛОКИРОВАНО
                            </div>
                        </div>
                    `).join('')}
                </div>
            `;
            
            container.appendChild(categoryDiv);
        });
    }

    showError(message) {
        const errorDiv = document.getElementById('errorMessage');
        errorDiv.textContent = message;
        errorDiv.style.display = 'block';
        document.getElementById('loading').style.display = 'none';
    }

    handleFileSelect(event) {
        const file = event.target.files[0];
        if (!file) return;
        
        // Скрываем предыдущие результаты
        document.getElementById('analysisSection').style.display = 'none';
        document.getElementById('errorMessage').style.display = 'none';
        
        // Показываем информацию о файле
        document.getElementById('fileInfo').style.display = 'block';
        document.getElementById('fileName').textContent = file.name;
        document.getElementById('fileSize').textContent = this.formatFileSize(file.size);
        document.getElementById('fileFormat').textContent = file.name.endsWith('.dat') ? 'Isaac Save File' : 'Unknown';
        
        // Показываем загрузку
        document.getElementById('loading').style.display = 'block';
        
        // Анализируем файл
        this.parseFile(file);
    }

    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    const parser = new IsaacAchievementParser();
    
    // Обработчики событий
    document.getElementById('fileInput').addEventListener('change', (e) => parser.handleFileSelect(e));
    
    // Drag & Drop
    const uploadZone = document.getElementById('uploadZone');
    
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
        if (files.length > 0) {
            document.getElementById('fileInput').files = files;
            parser.handleFileSelect({ target: { files: files } });
        }
    });
    
    // Клик по зоне загрузки
    uploadZone.addEventListener('click', () => {
        document.getElementById('fileInput').click();
    });
    
    // Переключение вкладок
    document.querySelectorAll('.tab-button').forEach(button => {
        button.addEventListener('click', () => {
            const tabName = button.dataset.tab;
            
            // Убираем активный класс со всех кнопок и контента
            document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
            
            // Добавляем активный класс к выбранной кнопке и контенту
            button.classList.add('active');
            document.getElementById(tabName + 'Tab').classList.add('active');
        });
    });
});
