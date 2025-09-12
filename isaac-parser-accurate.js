// Accurate Isaac Save File Parser
// Основан на исходном коде Afterbirth Save Editor

class AccurateIsaacSaveParser {
    constructor() {
        this.fileData = null;
        this.dataView = null;
        this.sectionOffsets = new Array(10);
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
        
        // Точные offset'ы статистики из Save Editor
        this.statOffsets = {
            momKills: 0x4,
            brokenRocks: 0x8,
            brokenTintedRocks: 0xC,
            poopDestroyed: 0x10,
            deathCardsUsed: 0x18,
            arcadesVisited: 0x20,
            deaths: 0x24,
            isaacKills: 0x28,
            shopKeepersDestroyed: 0x2C,
            satanKills: 0x30,
            shellGamePlaycount: 0x34,
            angelItemsTaken: 0x38,
            devilDealsTaken: 0x3C,
            bloodDonations: 0x40,
            slotsDestroyed: 0x44,
            penniesDonated: 0x4C,
            edenTokens: 0x50,
            winStreak: 0x54,
            bestStreak: 0x58,
            lossStreak: 0x1A8,
            penniesDonatedGreed: 0x1B0,
            cavesCleared: 0x298,
            basementsCleared: 0x29C,
            depthsCleared: 0x2A4
        };
        
        // Списки персонажей (из Save Editor - для Afterbirth)
        this.characters = [
            "Isaac", "Magdalene", "Cain", "Judas", "???", "Eve", "Samson", 
            "Azazel", "Lazarus", "Eden", "The Lost", "Lilith", "Keeper"
        ];
        
        // Completion marks для каждого персонажа (из Save Editor)
        this.completionMarks = [
            "Mom's Heart", "Isaac", "Satan", "Boss Rush", "???", "The Lamb", 
            "Mega Satan", "Greed Mode", "Hush"
        ];
        
        this.initializeUI();
        this.loadAchievements();
        this.loadChallenges();
    }

    async loadAchievements() {
        // Загружаем достижения (из файла Achievements.txt Save Editor)
        this.achievementsList = [
            { id: 1, name: "Magdalene" },
            { id: 2, name: "Cain" },
            { id: 3, name: "Judas" },
            { id: 4, name: "The Womb" },
            { id: 5, name: "The Harbingers" },
            { id: 6, name: "A Cube of Meat" },
            { id: 7, name: "Book Of Revelations" },
            { id: 8, name: "Transcendence" },
            { id: 9, name: "The Nail" },
            { id: 10, name: "A Quarter" },
            { id: 11, name: "Dr. Fetus" },
            { id: 12, name: "A Small Rock" },
            // ... добавить остальные достижения
        ];
        
        // Генерируем полный список (276 достижений в Afterbirth)
        for (let i = this.achievementsList.length; i < 276; i++) {
            this.achievementsList.push({
                id: i + 1,
                name: `Achievement ${i + 1}`,
                unlocked: false
            });
        }
    }
    
    async loadChallenges() {
        // Челленджи из файла Challenges.txt
        this.challengesList = [
            { id: 1, name: "Pitch Black" },
            { id: 2, name: "High Brow" },
            { id: 3, name: "Head Trauma" },
            { id: 4, name: "Darkness Falls" },
            { id: 5, name: "The Tank" },
            { id: 6, name: "Solar System" },
            { id: 7, name: "Suicide King" },
            { id: 8, name: "Cat Got Your Tongue" },
            { id: 9, name: "Demo Man" },
            { id: 10, name: "Cursed!" },
            { id: 11, name: "Glass Cannon" },
            { id: 12, name: "When Life Gives You Lemons" },
            { id: 13, name: "BEANS!" },
            { id: 14, name: "Its In The Cards" },
            { id: 15, name: "Slow Roll" },
            { id: 16, name: "Computer Savy" },
            { id: 17, name: "WAKA WAKA" },
            { id: 18, name: "The Host" },
            { id: 19, name: "The Family Man" },
            { id: 20, name: "Purist" },
            { id: 21, name: "XXXXXXXXL" },
            { id: 22, name: "SPEED!" },
            { id: 23, name: "Blue Bomber" },
            { id: 24, name: "PAY TO PLAY" },
            { id: 25, name: "Have A Heart" },
            { id: 26, name: "I RULE!" },
            { id: 27, name: "BRAINS!" },
            { id: 28, name: "PRIDE DAY!" },
            { id: 29, name: "Onan's Streak" },
            { id: 30, name: "The Guardian" },
            // ... добавить остальные
        ];
        
        // Дополняем до полного списка (30 челленджей в Afterbirth)
        for (let i = this.challengesList.length; i < 30; i++) {
            this.challengesList.push({
                id: i + 1,
                name: `Challenge ${i + 1}`,
                completed: false
            });
        }
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
            
            await this.parseFileAccurate();
            this.displayResults();
            
        } catch (error) {
            console.error('Ошибка при обработке файла:', error);
            this.showError('Ошибка при анализе файла: ' + error.message);
        } finally {
            this.showLoading(false);
        }
    }

    async parseFileAccurate() {
        // Проверяем заголовок (должен быть ab_persistentgamedata или аналог)
        const header = this.getString(0, 16);
        console.log('File header:', header);
        this.analysisResults.debugInfo.push(`File header: ${header}`);
        this.analysisResults.debugInfo.push(`File size: ${this.fileData.length} bytes`);
        
        // Минимальный размер файла по Save Editor: 0x72D (1837 байт)
        if (this.fileData.length < 1837) {
            throw new Error('Файл слишком мал для правильного сохранения Isaac');
        }
        
        // Получаем offset'ы секций (алгоритм из Save Editor)
        this.getSectionOffsets();
        
        // Парсим каждую секцию
        await this.parseAchievements();
        await this.parseStatistics();
        await this.parseItems();
        await this.parseChallenges();
        await this.parseCharacters();
        
        // Проверяем контрольную сумму
        this.verifyChecksum();
    }

    getSectionOffsets() {
        // Алгоритм из Save Editor: GetSectionOffsets()
        let offset = 0x14;
        const entryLengths = [1, 4, 4, 1, 1, 1, 1, 4, 4, 1]; // длина записи для каждой секции
        
        this.analysisResults.debugInfo.push('Parsing section headers:');
        
        for (let i = 0; i < this.sectionOffsets.length; i++) {
            const sectionData = new Array(3);
            
            // Читаем заголовок секции (3 × uint32)
            for (let j = 0; j < 3; j++) {
                sectionData[j] = this.dataView.getUint32(offset, true); // little endian
                offset += 4;
            }
            
            // Сохраняем offset начала данных секции
            if (this.sectionOffsets[i] === undefined) {
                this.sectionOffsets[i] = offset;
            }
            
            const entryCount = sectionData[2];
            const entryLength = entryLengths[i];
            
            this.analysisResults.debugInfo.push(
                `Section ${i}: offset=${this.sectionOffsets[i].toString(16).toUpperCase()}, entries=${entryCount}, entry_size=${entryLength}`
            );
            
            // Переходим к следующей секции
            offset += entryCount * entryLength;
        }
    }

    async parseAchievements() {
        // Section 0: Achievements/Secrets (1 байт на достижение)
        const achievementsOffset = this.sectionOffsets[0];
        if (!achievementsOffset) return;
        
        let unlockedCount = 0;
        this.analysisResults.achievements = [];
        
        for (let i = 0; i < this.achievementsList.length; i++) {
            const achievement = this.achievementsList[i];
            const dataOffset = achievementsOffset + achievement.id;
            
            let isUnlocked = false;
            if (dataOffset < this.fileData.length) {
                isUnlocked = this.fileData[dataOffset] === 1;
                if (isUnlocked) unlockedCount++;
            }
            
            this.analysisResults.achievements.push({
                ...achievement,
                unlocked: isUnlocked
            });
        }
        
        this.analysisResults.stats.achievementsUnlocked = unlockedCount;
        this.analysisResults.debugInfo.push(`Achievements unlocked: ${unlockedCount}/${this.achievementsList.length}`);
    }

    async parseStatistics() {
        // Section 1: Statistics/Counters (4 байта на значение)
        const statsOffset = this.sectionOffsets[1];
        if (!statsOffset) return;
        
        this.analysisResults.statistics = {};
        
        // Читаем все статистические значения
        for (const [statName, offset] of Object.entries(this.statOffsets)) {
            const dataOffset = statsOffset + offset;
            if (dataOffset + 4 <= this.fileData.length) {
                const value = this.dataView.getUint32(dataOffset, true);
                this.analysisResults.statistics[statName] = value;
                
                if (['deaths', 'momKills', 'bestStreak', 'winStreak', 'edenTokens'].includes(statName)) {
                    this.analysisResults.debugInfo.push(`${statName}: ${value} (offset: 0x${(statsOffset + offset).toString(16).toUpperCase()})`);
                }
            }
        }
    }

    async parseItems() {
        // Section 3: Items collection (1 байт на предмет)
        const itemsOffset = this.sectionOffsets[3];
        if (!itemsOffset) return;
        
        let foundCount = 0;
        this.analysisResults.items = [];
        
        const maxItems = 442; // из Save Editor: max_items = 442
        
        for (let i = 1; i <= maxItems; i++) {
            const dataOffset = itemsOffset + i;
            let isFound = false;
            
            if (dataOffset < this.fileData.length) {
                isFound = this.fileData[dataOffset] === 1;
                if (isFound) foundCount++;
            }
            
            this.analysisResults.items.push({
                id: i,
                name: `Item ${i}`,
                found: isFound,
                type: this.getItemType(i)
            });
        }
        
        this.analysisResults.stats.itemsFound = foundCount;
        this.analysisResults.debugInfo.push(`Items found: ${foundCount}/${maxItems}`);
    }

    async parseChallenges() {
        // Section 6: Challenges (1 байт на челлендж)
        const challengesOffset = this.sectionOffsets[6];
        if (!challengesOffset) return;
        
        let completedCount = 0;
        this.analysisResults.challenges = [];
        
        for (let i = 0; i < this.challengesList.length; i++) {
            const challenge = this.challengesList[i];
            const dataOffset = challengesOffset + challenge.id;
            
            let isCompleted = false;
            if (dataOffset < this.fileData.length) {
                isCompleted = this.fileData[dataOffset] === 1;
                if (isCompleted) completedCount++;
            }
            
            this.analysisResults.challenges.push({
                ...challenge,
                completed: isCompleted
            });
        }
        
        this.analysisResults.stats.challengesCompleted = completedCount;
        this.analysisResults.debugInfo.push(`Challenges completed: ${completedCount}/${this.challengesList.length}`);
    }

    async parseCharacters() {
        // Completion marks для персонажей
        const statsOffset = this.sectionOffsets[1];
        if (!statsOffset) return;
        
        let unlockedCount = 0;
        this.analysisResults.characters = [];
        
        // Базовый offset для completion marks (из Save Editor)
        const baseOffset = statsOffset + 0x68;
        
        for (let charIndex = 0; charIndex < this.characters.length; charIndex++) {
            const character = this.characters[charIndex];
            const completionMarks = [];
            let completedMarks = 0;
            
            let currentOffset = baseOffset;
            
            for (let markIndex = 0; markIndex < this.completionMarks.length; markIndex++) {
                const markName = this.completionMarks[markIndex];
                
                // Формула из Save Editor: character * 4 + mark * characters.Length * 4
                const markOffset = currentOffset + charIndex * 4 + markIndex * this.characters.length * 4;
                
                let isCompleted = false;
                if (markOffset + 4 <= this.fileData.length) {
                    const value = this.dataView.getUint32(markOffset, true);
                    isCompleted = value > 0; // 0=None, 1=Normal, 2=Hard
                    if (isCompleted) completedMarks++;
                }
                
                completionMarks.push({
                    name: markName,
                    completed: isCompleted,
                    value: isCompleted ? value : 0
                });
                
                // Adjust для Afterbirth (из Save Editor строка 575)
                if (markIndex === 5) {
                    currentOffset += 0x14;
                }
            }
            
            // Персонаж считается разблокированным если есть completion marks или это Isaac
            const isUnlocked = charIndex === 0 || completedMarks > 0;
            if (isUnlocked) unlockedCount++;
            
            this.analysisResults.characters.push({
                id: charIndex,
                name: character,
                unlocked: isUnlocked,
                completionMarks: completionMarks,
                completedMarks: completedMarks,
                totalMarks: this.completionMarks.length
            });
        }
        
        this.analysisResults.stats.charactersUnlocked = unlockedCount;
        this.analysisResults.debugInfo.push(`Characters unlocked: ${unlockedCount}/${this.characters.length}`);
    }

    verifyChecksum() {
        // Проверка контрольной суммы (из Save Editor)
        const calculatedChecksum = this.calcAfterbirthChecksum(0x10, 0x719);
        const storedChecksum = this.dataView.getUint32(0x729, true);
        
        this.analysisResults.debugInfo.push(
            `Checksum: calculated=0x${calculatedChecksum.toString(16).toUpperCase()}, stored=0x${storedChecksum.toString(16).toUpperCase()}, valid=${calculatedChecksum === storedChecksum}`
        );
    }

    calcAfterbirthChecksum(offset, length) {
        // CRC32 алгоритм из Save Editor (упрощенная версия)
        const crcTable = new Array(256);
        for (let i = 0; i < 256; i++) {
            let crc = i;
            for (let j = 0; j < 8; j++) {
                crc = (crc & 1) ? (0xEDB88320 ^ (crc >>> 1)) : (crc >>> 1);
            }
            crcTable[i] = crc;
        }
        
        let checksum = 0xFEDCBA76;
        checksum = ~checksum;
        
        for (let i = offset; i < offset + length && i < this.fileData.length; i++) {
            checksum = crcTable[(checksum & 0xFF) ^ this.fileData[i]] ^ (checksum >>> 8);
        }
        
        return ~checksum >>> 0; // Ensure unsigned 32-bit
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
        document.getElementById('achievementsTotal').textContent = `из ${this.achievementsList.length} получено`;
        document.getElementById('achievementsProgress').style.width = 
            `${(stats.achievementsUnlocked / this.achievementsList.length * 100)}%`;
        
        document.getElementById('charactersCount').textContent = stats.charactersUnlocked;
        document.getElementById('charactersTotal').textContent = `из ${this.characters.length} разблокировано`;
        document.getElementById('charactersProgress').style.width = 
            `${(stats.charactersUnlocked / this.characters.length * 100)}%`;
        
        document.getElementById('challengesCount').textContent = stats.challengesCompleted;
        document.getElementById('challengesTotal').textContent = `из ${this.challengesList.length} завершено`;
        document.getElementById('challengesProgress').style.width = 
            `${(stats.challengesCompleted / this.challengesList.length * 100)}%`;
        
        document.getElementById('itemsCount').textContent = stats.itemsFound;
        document.getElementById('itemsTotal').textContent = `из 442 найдено`;
        document.getElementById('itemsProgress').style.width = 
            `${(stats.itemsFound / 442 * 100)}%`;
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
                        <div class="statistic-value">${this.analysisResults.statistics.edenTokens || 0}</div>
                        <div class="statistic-label">Eden Tokens</div>
                    </div>
                    <div class="statistic-item">
                        <div class="statistic-value">${this.analysisResults.statistics.penniesDonated || 0}</div>
                        <div class="statistic-label">Pennies Donated</div>
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
                    const statusText = mark.value === 2 ? '(H)' : mark.value === 1 ? '(N)' : '';
                    completionMarksHtml += `
                        <div style="
                            background: ${mark.completed ? 'rgba(166, 227, 161, 0.2)' : 'rgba(243, 139, 168, 0.1)'};
                            border: 1px solid ${mark.completed ? '#a6e3a1' : '#f38ba8'};
                            padding: 2px;
                            border-radius: 3px;
                            text-align: center;
                            color: ${mark.completed ? '#a6e3a1' : '#f38ba8'};
                        ">
                            ${mark.completed ? '✓' : '✗'} ${mark.name.substring(0, 6)}${statusText}
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
                    Marks: ${character.completedMarks}/${character.totalMarks}
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
            Показано: 100 из 442 предметов<br>
            Найдено всего: ${this.analysisResults.stats.itemsFound} из 442
        `;
        container.appendChild(infoDiv);
    }

    updateRawTab() {
        const container = document.getElementById('rawData');
        let content = '';
        
        if (this.debugMode && this.analysisResults.debugInfo.length > 0) {
            content += '=== ACCURATE PARSER DEBUG INFO ===\n';
            this.analysisResults.debugInfo.forEach(info => {
                content += info + '\n';
            });
            content += '\n=== SECTION OFFSETS ===\n';
            
            this.sectionOffsets.forEach((offset, index) => {
                if (offset !== undefined) {
                    content += `Section ${index}: 0x${offset.toString(16).toUpperCase()}\n`;
                }
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
}

// Export functions
function exportResults() {
    if (!window.accurateParser || !window.accurateParser.analysisResults) {
        alert('Сначала загрузите и проанализируйте файл сохранения');
        return;
    }

    const results = window.accurateParser.analysisResults;
    const data = {
        timestamp: new Date().toISOString(),
        parser: 'AccurateIsaacSaveParser',
        statistics: results.statistics,
        debugInfo: results.debugInfo,
        sectionOffsets: window.accurateParser.sectionOffsets,
        stats: results.stats,
        achievements: results.achievements.filter(a => a.unlocked).map(a => a.name),
        characters: results.characters.map(c => ({
            name: c.name,
            unlocked: c.unlocked,
            completedMarks: c.completedMarks,
            completionMarks: c.completionMarks.filter(m => m.completed).map(m => m.name)
        })),
        challenges: results.challenges.filter(c => c.completed).map(c => c.name),
        items: results.items.filter(i => i.found).slice(0, 100).map(i => i.name)
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'isaac-save-analysis-accurate.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    window.accurateParser = new AccurateIsaacSaveParser();
});
