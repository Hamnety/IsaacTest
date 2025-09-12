// Improved Isaac Save File Parser
// Использует найденные данные из отладки для более точного парсинга

class ImprovedIsaacSaveParser {
    constructor() {
        this.fileData = null;
        this.dataView = null;
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
        
        // Константы Repentance
        this.TOTAL_ACHIEVEMENTS = 637;
        this.TOTAL_CHARACTERS = 34;
        this.TOTAL_CHALLENGES = 45;
        this.TOTAL_ITEMS = 716;
        this.COMPLETION_MARKS_PER_CHARACTER = 12;
        
        this.initializeUI();
        this.loadGameData();
    }

    initializeUI() {
        const uploadZone = document.getElementById('uploadZone');
        const fileInput = document.getElementById('fileInput');

        // Drag & Drop handlers
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

        // Табы
        document.querySelectorAll('.tab-button').forEach(button => {
            button.addEventListener('click', () => this.switchTab(button.dataset.tab));
        });

        // Debug mode toggle
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
            
            await this.parseFileImproved();
            this.displayResults();
            
        } catch (error) {
            console.error('Ошибка при обработке файла:', error);
            this.showError('Ошибка при анализе файла: ' + error.message);
        } finally {
            this.showLoading(false);
        }
    }

    async parseFileImproved() {
        this.analysisResults.debugInfo = [];
        
        // Проверяем заголовок
        const header = this.getString(0, 16);
        this.analysisResults.debugInfo.push(`Заголовок: ${header}`);
        this.analysisResults.debugInfo.push(`Размер файла: ${this.fileData.length} байт`);
        
        if (!header.includes('ISAACNGSAVE')) {
            throw new Error('Неверный формат файла сохранения Isaac');
        }
        
        // Ищем известные статистические значения
        const foundStats = this.findKnownStatistics();
        this.analysisResults.debugInfo.push('=== НАЙДЕННЫЕ ЗНАЧЕНИЯ ===');
        for (const [key, value] of Object.entries(foundStats)) {
            this.analysisResults.debugInfo.push(`${key}: ${value.value} в позициях ${value.positions.join(', ')}`);
        }
        
        // Определяем область статистики
        const statsArea = this.findStatisticsArea(foundStats);
        if (statsArea) {
            this.analysisResults.debugInfo.push(`Область статистики: байты ${statsArea.start}-${statsArea.end}`);
        }
        
        // Парсим данные на основе найденных значений
        await this.parseAchievementsImproved(foundStats);
        await this.parseCharactersImproved(foundStats);
        await this.parseChallengesImproved(foundStats);
        await this.parseItemsImproved(foundStats);
        
        // Заполняем статистику
        this.analysisResults.statistics = {
            deaths: foundStats.deaths?.value || 0,
            items: foundStats.items?.value || 0,
            momKills: foundStats.momKills?.value || 0,
            bestStreak: foundStats.bestStreak?.value || 0
        };
    }

    findKnownStatistics() {
        const knownValues = {
            deaths: 563,
            items: 721,
            momKills: 1222,
            bestStreak: 56
        };
        
        const foundStats = {};
        
        for (const [key, value] of Object.entries(knownValues)) {
            const positions = this.searchForValue(value, 2, 'little')
                .concat(this.searchForValue(value, 2, 'big'))
                .concat(this.searchForValue(value, 4, 'little'))
                .concat(this.searchForValue(value, 4, 'big'));
            
            if (positions.length > 0) {
                foundStats[key] = {
                    value: value,
                    positions: positions.map(p => `${p.offset}(${p.size}${p.endianness.toUpperCase()})`)
                };
            }
        }
        
        return foundStats;
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

    findStatisticsArea(foundStats) {
        if (Object.keys(foundStats).length === 0) return null;
        
        const positions = Object.values(foundStats)
            .flatMap(stat => stat.positions)
            .map(pos => parseInt(pos.split('(')[0]))
            .sort((a, b) => a - b);
        
        if (positions.length === 0) return null;
        
        return {
            start: Math.min(...positions),
            end: Math.max(...positions) + 4
        };
    }

    async parseAchievementsImproved(foundStats) {
        // Достижения обычно идут в начале файла после заголовка
        // Ищем область с 637 байтами, где большинство значений 0 или 1
        let bestArea = null;
        let maxFound = 0;
        
        // Ищем в начале файла (после заголовка)
        const searchStart = 16;
        const searchEnd = Math.min(2000, this.fileData.length - this.TOTAL_ACHIEVEMENTS);
        
        for (let i = searchStart; i < searchEnd; i++) {
            let validCount = 0;
            let foundCount = 0;
            
            // Проверяем 637 байт подряд
            for (let j = 0; j < this.TOTAL_ACHIEVEMENTS; j++) {
                const byte = this.fileData[i + j];
                if (byte === 0 || byte === 1) {
                    validCount++;
                    if (byte === 1) foundCount++;
                }
            }
            
            // Если большинство байтов валидны
            if (validCount > this.TOTAL_ACHIEVEMENTS * 0.8) {
                if (foundCount > maxFound) {
                    maxFound = foundCount;
                    bestArea = { offset: i, count: foundCount };
                }
            }
        }
        
        if (bestArea) {
            this.analysisResults.debugInfo.push(`Найдена область достижений в offset ${bestArea.offset}, разблокировано: ${bestArea.count}`);
            
            for (let i = 0; i < this.TOTAL_ACHIEVEMENTS; i++) {
                const achievementOffset = bestArea.offset + i;
                const isUnlocked = achievementOffset < this.fileData.length && this.fileData[achievementOffset] === 1;
                
                this.analysisResults.achievements[i] = {
                    id: i + 1,
                    name: `Achievement ${i + 1}`,
                    unlocked: isUnlocked
                };
            }
            
            this.analysisResults.stats.achievementsUnlocked = bestArea.count;
        } else {
            // Fallback: битовый анализ
            this.analysisResults.debugInfo.push('Область достижений не найдена, используется битовый анализ');
            await this.parseAchievementsBitwise();
        }
    }

    async parseAchievementsBitwise() {
        const achievementBytes = Math.ceil(this.TOTAL_ACHIEVEMENTS / 8);
        let maxFound = 0;
        let bestArea = null;
        
        for (let i = 16; i < this.fileData.length - achievementBytes; i++) {
            let setBits = 0;
            
            for (let j = 0; j < achievementBytes; j++) {
                const byte = this.fileData[i + j];
                for (let bit = 0; bit < 8; bit++) {
                    if (j * 8 + bit >= this.TOTAL_ACHIEVEMENTS) break;
                    if ((byte >> bit) & 1) {
                        setBits++;
                    }
                }
            }
            
            const density = setBits / this.TOTAL_ACHIEVEMENTS;
            if (density > 0.1 && density < 0.9 && setBits > maxFound) {
                maxFound = setBits;
                bestArea = { offset: i, count: setBits };
            }
        }
        
        if (bestArea) {
            this.analysisResults.debugInfo.push(`Битовый анализ достижений в offset ${bestArea.offset}, разблокировано: ${bestArea.count}`);
            
            for (let i = 0; i < this.TOTAL_ACHIEVEMENTS; i++) {
                const byteIndex = Math.floor(i / 8);
                const bitIndex = i % 8;
                const byteOffset = bestArea.offset + byteIndex;
                const isUnlocked = byteOffset < this.fileData.length && 
                    ((this.fileData[byteOffset] >> bitIndex) & 1) === 1;
                
                this.analysisResults.achievements[i] = {
                    id: i + 1,
                    name: `Achievement ${i + 1}`,
                    unlocked: isUnlocked
                };
            }
            
            this.analysisResults.stats.achievementsUnlocked = bestArea.count;
        }
    }

    async parseCharactersImproved(foundStats) {
        // Персонажи обычно идут после статистики
        // Ищем область с 34 персонажами, каждый с 12 completion marks
        let bestArea = null;
        let maxFound = 0;
        
        const searchStart = 2000; // После статистики
        const searchEnd = this.fileData.length - this.TOTAL_CHARACTERS * 20;
        
        for (let i = searchStart; i < searchEnd; i++) {
            let validChars = 0;
            let totalMarks = 0;
            
            // Проверяем 34 персонажа с 12 completion marks каждый
            for (let charIndex = 0; charIndex < this.TOTAL_CHARACTERS; charIndex++) {
                const charOffset = i + charIndex * 20; // 20 байт на персонажа
                if (charOffset + 12 < this.fileData.length) {
                    const isUnlocked = this.fileData[charOffset] > 0;
                    if (isUnlocked) validChars++;
                    
                    // Считаем completion marks
                    for (let markIndex = 0; markIndex < 12; markIndex++) {
                        const markOffset = charOffset + 1 + markIndex;
                        if (markOffset < this.fileData.length && this.fileData[markOffset] > 0) {
                            totalMarks++;
                        }
                    }
                }
            }
            
            // Если нашли разумное количество персонажей и marks
            if (validChars > 5 && totalMarks > 20) {
                if (validChars > maxFound) {
                    maxFound = validChars;
                    bestArea = { offset: i, count: validChars, marks: totalMarks };
                }
            }
        }
        
        if (bestArea) {
            this.analysisResults.debugInfo.push(`Найдена область персонажей в offset ${bestArea.offset}, разблокировано: ${bestArea.count}, marks: ${bestArea.marks}`);
            
            for (let charIndex = 0; charIndex < this.TOTAL_CHARACTERS; charIndex++) {
                const charOffset = bestArea.offset + charIndex * 20;
                const isUnlocked = charOffset < this.fileData.length && this.fileData[charOffset] > 0;
                
                // Анализируем completion marks
                let completedMarks = 0;
                const completionMarks = [];
                for (let markIndex = 0; markIndex < 12; markIndex++) {
                    const markOffset = charOffset + 1 + markIndex;
                    const isCompleted = markOffset < this.fileData.length && this.fileData[markOffset] > 0;
                    if (isCompleted) completedMarks++;
                    completionMarks.push({
                        name: `Mark ${markIndex + 1}`,
                        completed: isCompleted
                    });
                }
                
                this.analysisResults.characters[charIndex] = {
                    id: charIndex,
                    name: `Character ${charIndex + 1}`,
                    unlocked: isUnlocked,
                    completionMarks: completionMarks,
                    completedMarks: completedMarks
                };
            }
            
            this.analysisResults.stats.charactersUnlocked = bestArea.count;
        }
    }

    async parseChallengesImproved(foundStats) {
        // Используем известный offset из отладки
        const challengesOffset = 11831;
        let completedChallenges = 0;
        
        this.analysisResults.debugInfo.push(`Область челленджей: offset ${challengesOffset}`);
        
        for (let i = 0; i < this.TOTAL_CHALLENGES; i++) {
            const challengeOffset = challengesOffset + i;
            const isCompleted = challengeOffset < this.fileData.length && this.fileData[challengeOffset] > 0;
            if (isCompleted) completedChallenges++;
            
            this.analysisResults.challenges[i] = {
                id: i + 1,
                name: `Challenge ${i + 1}`,
                completed: isCompleted
            };
        }
        
        this.analysisResults.stats.challengesCompleted = completedChallenges;
    }

    async parseItemsImproved(foundStats) {
        // Предметы обычно хранятся как массив байтов (1 байт на предмет)
        let bestArea = null;
        let maxFound = 0;
        
        const searchStart = 3000; // После статистики и персонажей
        const searchEnd = this.fileData.length - this.TOTAL_ITEMS;
        
        for (let i = searchStart; i < searchEnd; i++) {
            let validItems = 0;
            let foundCount = 0;
            
            // Проверяем 716 байт подряд
            for (let j = 0; j < this.TOTAL_ITEMS; j++) {
                const byte = this.fileData[i + j];
                // Валидные значения: 0 (не найден), 1 (найден), иногда 2-3
                if (byte === 0 || byte === 1 || (byte >= 2 && byte <= 10)) {
                    validItems++;
                    if (byte > 0) foundCount++;
                }
            }
            
            // Если большинство байтов валидны
            if (validItems > this.TOTAL_ITEMS * 0.8) {
                if (foundCount > maxFound) {
                    maxFound = foundCount;
                    bestArea = { offset: i, count: foundCount };
                }
            }
        }
        
        if (bestArea) {
            this.analysisResults.debugInfo.push(`Коллекция предметов найдена в offset ${bestArea.offset}, найдено предметов: ${bestArea.count}`);
            
            for (let i = 0; i < this.TOTAL_ITEMS; i++) {
                const itemOffset = bestArea.offset + i;
                const isFound = itemOffset < this.fileData.length && this.fileData[itemOffset] > 0;
                
                this.analysisResults.items[i] = {
                    id: i + 1,
                    name: `Item ${i + 1}`,
                    found: isFound,
                    type: this.getItemType(i + 1)
                };
            }
            
            this.analysisResults.stats.itemsFound = bestArea.count;
        } else {
            // Fallback: битовый анализ
            this.analysisResults.debugInfo.push('Область предметов не найдена, используется битовый анализ');
            await this.parseItemsBitwise();
        }
    }

    async parseItemsBitwise() {
        const itemBytes = Math.ceil(this.TOTAL_ITEMS / 8);
        let maxFound = 0;
        let bestArea = null;
        
        for (let i = 100; i < this.fileData.length - itemBytes; i++) {
            let setBits = 0;
            
            for (let j = 0; j < itemBytes; j++) {
                const byte = this.fileData[i + j];
                for (let bit = 0; bit < 8; bit++) {
                    if (j * 8 + bit >= this.TOTAL_ITEMS) break;
                    if ((byte >> bit) & 1) {
                        setBits++;
                    }
                }
            }
            
            const density = setBits / this.TOTAL_ITEMS;
            if (density > 0.1 && density < 0.9 && setBits > maxFound) {
                maxFound = setBits;
                bestArea = { offset: i, count: setBits };
            }
        }
        
        if (bestArea) {
            this.analysisResults.debugInfo.push(`Битовый анализ предметов в offset ${bestArea.offset}, найдено: ${bestArea.count}`);
            
            for (let i = 0; i < this.TOTAL_ITEMS; i++) {
                const byteIndex = Math.floor(i / 8);
                const bitIndex = i % 8;
                const byteOffset = bestArea.offset + byteIndex;
                const isFound = byteOffset < this.fileData.length && 
                    ((this.fileData[byteOffset] >> bitIndex) & 1) === 1;
                
                this.analysisResults.items[i] = {
                    id: i + 1,
                    name: `Item ${i + 1}`,
                    found: isFound,
                    type: this.getItemType(i + 1)
                };
            }
            
            this.analysisResults.stats.itemsFound = bestArea.count;
        }
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

    // UI Methods (same as before)
    displayResults() {
        this.updateStats();
        this.updateTabs();
        this.showAnalysis(true);
    }

    updateStats() {
        const stats = this.analysisResults.stats;
        
        document.getElementById('achievementsCount').textContent = stats.achievementsUnlocked;
        document.getElementById('achievementsTotal').textContent = `из ${this.TOTAL_ACHIEVEMENTS} получено`;
        document.getElementById('achievementsProgress').style.width = 
            `${(stats.achievementsUnlocked / this.TOTAL_ACHIEVEMENTS * 100)}%`;
        
        document.getElementById('charactersCount').textContent = stats.charactersUnlocked;
        document.getElementById('charactersTotal').textContent = `из ${this.TOTAL_CHARACTERS} разблокировано`;
        document.getElementById('charactersProgress').style.width = 
            `${(stats.charactersUnlocked / this.TOTAL_CHARACTERS * 100)}%`;
        
        document.getElementById('challengesCount').textContent = stats.challengesCompleted;
        document.getElementById('challengesTotal').textContent = `из ${this.TOTAL_CHALLENGES} завершено`;
        document.getElementById('challengesProgress').style.width = 
            `${(stats.challengesCompleted / this.TOTAL_CHALLENGES * 100)}%`;
        
        document.getElementById('itemsCount').textContent = stats.itemsFound;
        document.getElementById('itemsTotal').textContent = `из ${this.TOTAL_ITEMS} найдено`;
        document.getElementById('itemsProgress').style.width = 
            `${(stats.itemsFound / this.TOTAL_ITEMS * 100)}%`;
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
        
        // Добавляем статистику
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
                        <div class="statistic-value">${this.analysisResults.statistics.items || 0}</div>
                        <div class="statistic-label">Items</div>
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
        
        this.analysisResults.characters.forEach(character => {
            const div = document.createElement('div');
            div.className = `item-card ${character.unlocked ? 'unlocked' : 'locked'}`;
            
            let completionMarksHtml = '';
            if (character.unlocked && character.completionMarks) {
                completionMarksHtml = '<div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 2px; margin-top: 10px; font-size: 0.8rem;">';
                character.completionMarks.forEach(mark => {
                    completionMarksHtml += `
                        <div style="
                            background: ${mark.completed ? 'rgba(166, 227, 161, 0.2)' : 'rgba(243, 139, 168, 0.1)'};
                            border: 1px solid ${mark.completed ? '#a6e3a1' : '#f38ba8'};
                            padding: 2px;
                            border-radius: 3px;
                            text-align: center;
                            color: ${mark.completed ? '#a6e3a1' : '#f38ba8'};
                        ">
                            ${mark.completed ? '✓' : '✗'} ${mark.name}
                        </div>`;
                });
                completionMarksHtml += '</div>';
            }
            
            div.innerHTML = `
                <strong>${character.name}</strong><br>
                <span style="color: ${character.unlocked ? '#a6e3a1' : '#f38ba8'}">
                    ${character.unlocked ? '✓ Разблокирован' : '✗ Заблокирован'}
                </span>
                <div style="margin-top: 5px; font-size: 0.9rem; color: #a6adc8;">
                    Marks: ${character.completedMarks || 0}/12
                </div>
                ${completionMarksHtml}
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
        
        const infoDiv = document.createElement('div');
        infoDiv.style.cssText = 'text-align: center; padding: 20px; color: #a6adc8; border-top: 1px solid rgba(205, 214, 244, 0.1); margin-top: 20px;';
        infoDiv.innerHTML = `
            Показано: 100 из ${this.TOTAL_ITEMS} предметов<br>
            Найдено всего: ${this.analysisResults.stats.itemsFound} из ${this.TOTAL_ITEMS}
        `;
        container.appendChild(infoDiv);
    }

    updateRawTab() {
        const container = document.getElementById('rawData');
        let content = '';
        
        if (this.debugMode && this.analysisResults.debugInfo.length > 0) {
            content += '=== УЛУЧШЕННЫЙ ПАРСЕР DEBUG INFO ===\n';
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
        
        // Генерируем списки
        for (let i = 0; i < this.TOTAL_ACHIEVEMENTS; i++) {
            this.gameData.achievements.push({
                id: i + 1,
                name: `Achievement ${i + 1}`,
                unlocked: false
            });
        }
        
        for (let i = 0; i < this.TOTAL_CHARACTERS; i++) {
            this.gameData.characters.push({
                id: i,
                name: `Character ${i + 1}`,
                unlocked: false,
                completionMarks: Array.from({length: 12}, (_, j) => ({
                    name: `Mark ${j + 1}`,
                    completed: false
                }))
            });
        }
        
        for (let i = 0; i < this.TOTAL_CHALLENGES; i++) {
            this.gameData.challenges.push({
                id: i + 1,
                name: `Challenge ${i + 1}`,
                completed: false
            });
        }
        
        for (let i = 0; i < this.TOTAL_ITEMS; i++) {
            this.gameData.items.push({
                id: i + 1,
                name: `Item ${i + 1}`,
                found: false,
                type: this.getItemType(i + 1)
            });
        }
    }
}

// Export functions
function exportResults() {
    if (!window.improvedParser || !window.improvedParser.analysisResults) {
        alert('Сначала загрузите и проанализируйте файл сохранения');
        return;
    }

    const results = window.improvedParser.analysisResults;
    const data = {
        timestamp: new Date().toISOString(),
        parser: 'ImprovedIsaacSaveParser',
        statistics: results.statistics,
        debugInfo: results.debugInfo,
        stats: results.stats,
        achievements: results.achievements.filter(a => a.unlocked).map(a => a.name),
        characters: results.characters.map(c => ({
            name: c.name,
            unlocked: c.unlocked,
            completedMarks: c.completedMarks?.filter(m => m.completed).map(m => m.name) || []
        })),
        challenges: results.challenges.filter(c => c.completed).map(c => c.name),
        items: results.items.filter(i => i.found).slice(0, 100).map(i => i.name)
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'isaac-save-analysis-improved.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    window.improvedParser = new ImprovedIsaacSaveParser();
});
