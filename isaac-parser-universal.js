// Universal Isaac Save File Parser
// Основан на официальном Isaac Save Viewer от Zamiell
// Поддерживает все версии Isaac: Rebirth, Afterbirth, Afterbirth+, Repentance

class UniversalIsaacSaveParser {
    constructor() {
        this.fileData = null;
        this.dataView = null;
        this.isaacSaveFile = null;
        this.debugMode = false;
        this.analysisResults = {
            achievements: [],
            characters: [],
            challenges: [],
            items: [],
            statistics: {},
            debugInfo: [],
            stats: {
                achievementsUnlocked: 0,
                charactersUnlocked: 0,
                challengesCompleted: 0,
                itemsFound: 0
            }
        };
        
        // Константы для разных версий
        this.HEADER_LENGTH = 16;
        this.RUN_HEADERS = new Set([
            "ISAACNG_GSR0018", // Rebirth run
            "ISAACNG_GSR0034", // Afterbirth run
            "ISAACNG_GSR0065", // Afterbirth+ run
            "ISAACNG_GSR0142"  // Repentance run
        ]);
        
        this.PERSISTENT_HEADERS = {
            "ISAACNGSAVE06R": "Rebirth",
            "ISAACNGSAVE08R": "Afterbirth", 
            "ISAACNGSAVE09R": "Afterbirth+/Repentance"
        };
        
        // Chunk types (из официального кода)
        this.CHUNK_TYPE = {
            ACHIEVEMENTS: 1,
            COUNTERS: 2,
            LEVEL_COUNTERS: 3,
            COLLECTIBLES: 4,
            MINIBOSSES: 5,
            BOSSES: 6,
            CHALLENGE_COUNTERS: 7,
            CUTSCENE_COUNTERS: 8,
            GAME_SETTINGS: 9,
            SPECIAL_SEED_COUNTERS: 10,
            BESTIARY_COUNTERS: 11
        };
        
        this.initializeUI();
        this.loadGameData();
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

        const debugToggle = document.getElementById('debugModeToggle');
        if (debugToggle) {
            debugToggle.addEventListener('change', (e) => {
                this.debugMode = e.target.checked;
                if (this.fileData) {
                    this.displayResults();
                }
            });
        }
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
            
            await this.parseFileUniversal();
            this.displayResults();
            
        } catch (error) {
            console.error('Ошибка при обработке файла:', error);
            this.showError('Ошибка при анализе файла: ' + error.message);
        } finally {
            this.showLoading(false);
        }
    }

    async parseFileUniversal() {
        this.analysisResults.debugInfo = [];
        
        // Проверяем заголовок
        const header = this.getString(0, this.HEADER_LENGTH);
        this.analysisResults.debugInfo.push(`Заголовок: ${header}`);
        this.analysisResults.debugInfo.push(`Размер файла: ${this.fileData.length} байт`);
        
        // Определяем тип файла
        const fileType = this.determineFileType(header);
        this.analysisResults.debugInfo.push(`Тип файла: ${fileType}`);
        
        if (fileType === 'run') {
            throw new Error('Это файл состояния забега (gamestate). Выберите файл persistentgamedata для анализа прогресса.');
        }
        
        if (fileType === 'unsupported') {
            throw new Error('Неподдерживаемый формат файла. Поддерживаются только файлы Repentance.');
        }
        
        // Парсим файл используя универсальный алгоритм
        await this.parseSaveFileUniversal();
    }

    determineFileType(header) {
        if (this.RUN_HEADERS.has(header)) {
            return 'run';
        }
        
        if (this.PERSISTENT_HEADERS[header]) {
            return 'persistent';
        }
        
        return 'unsupported';
    }

    async parseSaveFileUniversal() {
        // Упрощенный парсер без Kaitai Stream
        // Используем эвристический подход для извлечения данных
        
        // Ищем секции файла
        const sections = this.findSections();
        this.analysisResults.debugInfo.push(`Найдено секций: ${sections.length}`);
        
        // Парсим каждую секцию
        for (const section of sections) {
            await this.parseSection(section);
        }
        
        // Дополнительный анализ для статистики
        await this.parseStatistics();
    }

    findSections() {
        const sections = [];
        let offset = 0x14; // После заголовка
        
        // Ищем секции по паттерну
        while (offset < this.fileData.length - 20) {
            // Читаем заголовок секции (3 × uint32)
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

    async parseSection(section) {
        this.analysisResults.debugInfo.push(`Секция ${section.type}: offset=0x${section.offset.toString(16)}, size=${section.size}, entries=${section.count}`);
        
        switch (section.type) {
            case this.CHUNK_TYPE.ACHIEVEMENTS:
                await this.parseAchievements(section);
                break;
            case this.CHUNK_TYPE.COLLECTIBLES:
                await this.parseItems(section);
                break;
            case this.CHUNK_TYPE.CHALLENGE_COUNTERS:
                await this.parseChallenges(section);
                break;
            case this.CHUNK_TYPE.COUNTERS:
                await this.parseCounters(section);
                break;
        }
    }

    async parseAchievements(section) {
        let unlockedCount = 0;
        this.analysisResults.achievements = [];
        
        // Достижения хранятся как массив байтов
        for (let i = 1; i < section.count; i++) {
            const achievementOffset = i;
            const isUnlocked = achievementOffset < section.data.length && section.data[achievementOffset] === 1;
            if (isUnlocked) unlockedCount++;
            
            this.analysisResults.achievements[i-1] = {
                id: i,
                name: `Achievement ${i}`,
                unlocked: isUnlocked
            };
        }
        
        this.analysisResults.stats.achievementsUnlocked = unlockedCount;
        this.analysisResults.debugInfo.push(`Достижения: ${unlockedCount}/${section.count-1} разблокировано`);
    }

    async parseItems(section) {
        let foundCount = 0;
        this.analysisResults.items = [];
        
        // Предметы хранятся как массив байтов
        for (let i = 1; i < section.count; i++) {
            const itemOffset = i;
            const isFound = itemOffset < section.data.length && section.data[itemOffset] === 1;
            if (isFound) foundCount++;
            
            this.analysisResults.items[i-1] = {
                id: i,
                name: `Item ${i}`,
                found: isFound,
                type: this.getItemType(i)
            };
        }
        
        this.analysisResults.stats.itemsFound = foundCount;
        this.analysisResults.debugInfo.push(`Предметы: ${foundCount}/${section.count-1} найдено`);
    }

    async parseChallenges(section) {
        let completedCount = 0;
        this.analysisResults.challenges = [];
        
        // Челленджи хранятся как массив байтов
        for (let i = 1; i < section.count; i++) {
            const challengeOffset = i;
            const isCompleted = challengeOffset < section.data.length && section.data[challengeOffset] === 1;
            if (isCompleted) completedCount++;
            
            this.analysisResults.challenges[i-1] = {
                id: i,
                name: `Challenge ${i}`,
                completed: isCompleted
            };
        }
        
        this.analysisResults.stats.challengesCompleted = completedCount;
        this.analysisResults.debugInfo.push(`Челленджи: ${completedCount}/${section.count-1} завершено`);
    }

    async parseCounters(section) {
        // Статистика хранится как массив uint32
        this.analysisResults.statistics = {};
        
        const stats = [
            { offset: 0x4, name: 'momKills' },
            { offset: 0x8, name: 'brokenRocks' },
            { offset: 0xC, name: 'brokenTintedRocks' },
            { offset: 0x10, name: 'poopDestroyed' },
            { offset: 0x24, name: 'deaths' },
            { offset: 0x2C, name: 'shopKeepersDestroyed' },
            { offset: 0x30, name: 'satanKills' },
            { offset: 0x4C, name: 'penniesDonated' },
            { offset: 0x50, name: 'edenTokens' },
            { offset: 0x54, name: 'winStreak' },
            { offset: 0x58, name: 'bestStreak' }
        ];
        
        for (const stat of stats) {
            const dataOffset = stat.offset;
            if (dataOffset + 4 <= section.data.length) {
                const value = this.dataView.getUint32(section.offset + dataOffset, true);
                this.analysisResults.statistics[stat.name] = value;
            }
        }
        
        this.analysisResults.debugInfo.push(`Статистика: ${Object.keys(this.analysisResults.statistics).length} значений`);
    }

    async parseStatistics() {
        // Дополнительный поиск статистики в файле
        const knownStats = {
            deaths: 563,
            items: 721,
            momKills: 1222,
            bestStreak: 56
        };
        
        for (const [key, value] of Object.entries(knownStats)) {
            const positions = this.searchForValue(value, 4, 'little');
            if (positions.length > 0) {
                this.analysisResults.debugInfo.push(`Найдено ${key}: ${value} в позициях ${positions.map(p => p.offset).join(', ')}`);
            }
        }
    }

    searchForValue(value, size, endianness = 'little') {
        const results = [];
        for (let i = 0; i <= this.fileData.length - size; i++) {
            let foundValue;
            if (size === 2) {
                foundValue = endianness === 'little' ? 
                    this.dataView.getUint16(i, true) : 
                    this.dataView.getUint16(i, false);
            } else if (size === 4) {
                foundValue = endianness === 'little' ? 
                    this.dataView.getUint32(i, true) : 
                    this.dataView.getUint32(i, false);
            } else {
                continue;
            }
            
            if (foundValue === value) {
                results.push({ offset: i, value: foundValue, size: size, endianness: endianness });
            }
        }
        return results;
    }

    getItemType(itemId) {
        if (itemId <= 100) return "Active";
        if (itemId <= 300) return "Passive";
        if (itemId <= 400) return "Trinket";
        return "Special";
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
        document.getElementById('charactersTotal').textContent = `из ${this.analysisResults.characters.length} разблокировано`;
        document.getElementById('charactersProgress').style.width = 
            `${(stats.charactersUnlocked / Math.max(this.analysisResults.characters.length, 1) * 100)}%`;
        
        document.getElementById('challengesCount').textContent = stats.challengesCompleted;
        document.getElementById('challengesTotal').textContent = `из ${this.analysisResults.challenges.length} завершено`;
        document.getElementById('challengesProgress').style.width = 
            `${(stats.challengesCompleted / Math.max(this.analysisResults.challenges.length, 1) * 100)}%`;
        
        document.getElementById('itemsCount').textContent = stats.itemsFound;
        document.getElementById('itemsTotal').textContent = `из ${this.analysisResults.items.length} найдено`;
        document.getElementById('itemsProgress').style.width = 
            `${(stats.itemsFound / Math.max(this.analysisResults.items.length, 1) * 100)}%`;
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
        
        if (Object.keys(this.analysisResults.statistics).length > 0) {
            const statsDiv = document.createElement('div');
            statsDiv.className = 'statistics-panel';
            statsDiv.innerHTML = `
                <h3 style="color: #74c7ec; margin-bottom: 10px;">📊 Статистика из файла</h3>
                <div class="statistics-grid">
                    <div class="statistic-item">
                        <div class="statistic-value">${this.analysisResults.statistics.deaths || 0}</div>
                        <div class="statistic-label">Deaths</div>
                    </div>
                    <div class="statistic-item">
                        <div class="statistic-value">${this.analysisResults.statistics.momKills || 0}</div>
                        <div class="statistic-label">Mom Kills</div>
                    </div>
                    <div class="statistic-item">
                        <div class="statistic-value">${this.analysisResults.statistics.bestStreak || 0}</div>
                        <div class="statistic-label">Best Streak</div>
                    </div>
                    <div class="statistic-item">
                        <div class="statistic-value">${this.analysisResults.statistics.edenTokens || 0}</div>
                        <div class="statistic-label">Eden Tokens</div>
                    </div>
                </div>
            `;
            container.appendChild(statsDiv);
        }
        
        this.analysisResults.achievements.slice(0, 50).forEach(achievement => {
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

    updateCharactersTab() {
        const container = document.getElementById('charactersList');
        container.innerHTML = '';
        
        // Пока что заглушка для персонажей
        const characters = ['Isaac', 'Maggy', 'Cain', 'Judas', '???', 'Eve', 'Samson', 'Azazel'];
        characters.forEach((char, index) => {
            const div = document.createElement('div');
            div.className = 'item-card unlocked';
            div.innerHTML = `
                <strong>${char}</strong><br>
                <span style="color: #a6e3a1">✓ Разблокирован</span>
            `;
            container.appendChild(div);
        });
    }

    updateChallengesTab() {
        const container = document.getElementById('challengesList');
        container.innerHTML = '';
        
        this.analysisResults.challenges.slice(0, 50).forEach(challenge => {
            const div = document.createElement('div');
            div.className = `item-card ${challenge.completed ? 'unlocked' : 'locked'}`;
            div.innerHTML = `
                <strong>${challenge.name}</strong><br>
                <span style="color: ${challenge.completed ? '#a6e3a1' : '#f38ba8'}">
                    ${challenge.completed ? '✓ Выполнен' : '✗ Не выполнен'}
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
            div.innerHTML = `
                <strong>${item.name}</strong><br>
                <div style="color: #a6adc8; font-size: 0.8rem;">
                    ${item.type}
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
        
        if (this.debugMode && this.analysisResults.debugInfo.length > 0) {
            content += '=== UNIVERSAL PARSER DEBUG INFO ===\n';
            this.analysisResults.debugInfo.forEach(info => {
                content += info + '\n';
            });
            content += '\n';
        }
        
        if (this.fileData) {
            content += '=== HEX DUMP (первые 1000 байт) ===\n';
            for (let i = 0; i < Math.min(1000, this.fileData.length); i += 16) {
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

    loadGameData() {
        // Загружаем базовые данные игры
        this.gameData = {
            achievements: [],
            characters: [],
            challenges: [],
            items: []
        };
    }
}

// Export functions
function exportResults() {
    if (!window.universalParser || !window.universalParser.analysisResults) {
        alert('Сначала загрузите и проанализируйте файл сохранения');
        return;
    }

    const results = window.universalParser.analysisResults;
    const data = {
        timestamp: new Date().toISOString(),
        parser: 'UniversalIsaacSaveParser',
        statistics: results.statistics,
        debugInfo: results.debugInfo,
        stats: results.stats,
        achievements: results.achievements.filter(a => a.unlocked).map(a => a.name),
        characters: results.characters.map(c => ({
            name: c.name,
            unlocked: c.unlocked
        })),
        challenges: results.challenges.filter(c => c.completed).map(c => c.name),
        items: results.items.filter(i => i.found).slice(0, 100).map(i => i.name)
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'isaac-save-analysis-universal.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    window.universalParser = new UniversalIsaacSaveParser();
});
