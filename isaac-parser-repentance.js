// Repentance Save File Parser
// Основан на точных данных из isaac-save-edit-script

class RepentanceIsaacSaveParser {
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
        
        // Точные константы Repentance из script.py
        this.TOTAL_ACHIEVEMENTS = 637;
        this.TOTAL_CHARACTERS = 34;
        this.TOTAL_CHALLENGES = 45;
        this.TOTAL_ITEMS = 732; // 1-732, но некоторые пропущены
        this.COMPLETION_MARKS_PER_CHARACTER = 12;
        
        // Точные offset'ы статистики из script.py
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
        
        // Персонажи Repentance из script.py
        this.characters = [
            "Isaac", "Maggy", "Cain", "Judas", "???", "Eve", "Samson", "Azazel", 
            "Lazarus", "Eden", "The Lost", "Lilith", "Keeper", "Apollyon", "Forgotten", "Bethany",
            "Jacob & Esau", "T Isaac", "T Maggy", "T Cain", "T Judas", "T ???", "T Eve", "T Samson", "T Azazel", 
            "T Lazarus", "T Eden", "T Lost", "T Lilith", "T Keeper", "T Apollyon", "T Forgotten", "T Bethany",
            "T Jacob"
        ];
        
        // Completion marks из script.py
        this.completionMarks = [
            "Isaac's Heart", "Isaac", "Satan", "Boss Rush", "Chest", "Dark Room", 
            "Mega Satan", "Hush", "Greed", "Delirium", "Mother", "Beast"
        ];
        
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
            
            await this.parseFileRepentance();
            this.displayResults();
            
        } catch (error) {
            console.error('Ошибка при обработке файла:', error);
            this.showError('Ошибка при анализе файла: ' + error.message);
        } finally {
            this.showLoading(false);
        }
    }

    async parseFileRepentance() {
        this.analysisResults.debugInfo = [];
        
        // Проверяем заголовок
        const header = this.getString(0, 16);
        this.analysisResults.debugInfo.push(`Заголовок: ${header}`);
        this.analysisResults.debugInfo.push(`Размер файла: ${this.fileData.length} байт`);
        
        if (!header.includes('ISAACNGSAVE')) {
            throw new Error('Неверный формат файла сохранения Isaac');
        }
        
        // Получаем offset'ы секций (точный алгоритм из script.py)
        this.getSectionOffsets();
        
        // Парсим данные используя точные offset'ы
        await this.parseStatistics();
        await this.parseAchievements();
        await this.parseCharacters();
        await this.parseChallenges();
        await this.parseItems();
        
        // Проверяем контрольную сумму
        this.verifyChecksum();
    }

    getSectionOffsets() {
        // Точный алгоритм из script.py
        let offset = 0x14;
        const entryLengths = [1, 4, 4, 1, 1, 1, 1, 4, 4, 1];
        
        this.analysisResults.debugInfo.push('=== СЕКЦИИ ФАЙЛА ===');
        
        for (let i = 0; i < this.sectionOffsets.length; i++) {
            const sectionData = new Array(3);
            
            // Читаем заголовок секции (3 × uint32)
            for (let j = 0; j < 3; j++) {
                sectionData[j] = this.dataView.getUint32(offset, true);
                offset += 4;
            }
            
            // Сохраняем offset начала данных секции
            if (this.sectionOffsets[i] === 0) {
                this.sectionOffsets[i] = offset;
            }
            
            const entryCount = sectionData[2];
            const entryLength = entryLengths[i];
            
            this.analysisResults.debugInfo.push(
                `Секция ${i}: offset=0x${this.sectionOffsets[i].toString(16).toUpperCase()}, entries=${entryCount}, entry_size=${entryLength}`
            );
            
            // Переходим к следующей секции
            offset += entryCount * entryLength;
        }
    }

    async parseStatistics() {
        // Section 1: Statistics (точные offset'ы из script.py)
        const statsOffset = this.sectionOffsets[1];
        if (!statsOffset) return;
        
        this.analysisResults.statistics = {};
        
        for (const [statName, offset] of Object.entries(this.statOffsets)) {
            const dataOffset = statsOffset + offset;
            if (dataOffset + 4 <= this.fileData.length) {
                const value = this.dataView.getUint32(dataOffset, true);
                this.analysisResults.statistics[statName] = value;
                
                if (['deaths', 'momKills', 'bestStreak', 'winStreak', 'edenTokens'].includes(statName)) {
                    this.analysisResults.debugInfo.push(`${statName}: ${value} (offset: 0x${dataOffset.toString(16).toUpperCase()})`);
                }
            }
        }
    }

    async parseAchievements() {
        // Section 0: Achievements/Secrets (1 байт на достижение)
        const achievementsOffset = this.sectionOffsets[0];
        if (!achievementsOffset) return;
        
        let unlockedCount = 0;
        this.analysisResults.achievements = [];
        
        for (let i = 1; i <= this.TOTAL_ACHIEVEMENTS; i++) {
            const achievementOffset = achievementsOffset + i;
            const isUnlocked = achievementOffset < this.fileData.length && this.fileData[achievementOffset] === 1;
            if (isUnlocked) unlockedCount++;
            
            this.analysisResults.achievements[i-1] = {
                id: i,
                name: `Achievement ${i}`,
                unlocked: isUnlocked
            };
        }
        
        this.analysisResults.stats.achievementsUnlocked = unlockedCount;
        this.analysisResults.debugInfo.push(`Достижения: ${unlockedCount}/${this.TOTAL_ACHIEVEMENTS} разблокировано`);
    }

    async parseCharacters() {
        // Completion marks для персонажей (точный алгоритм из script.py)
        const statsOffset = this.sectionOffsets[1];
        if (!statsOffset) return;
        
        let unlockedCount = 0;
        this.analysisResults.characters = [];
        
        for (let charIndex = 0; charIndex < this.TOTAL_CHARACTERS; charIndex++) {
            const character = this.characters[charIndex];
            const completionMarks = [];
            let completedMarks = 0;
            
            // Точные формулы из script.py
            let cluOffset;
            if (charIndex === 14) { // Forgotten
                cluOffset = statsOffset + 0x32C;
            } else if (charIndex > 14) { // Tainted characters
                cluOffset = statsOffset + 0x31C;
            } else { // Regular characters
                cluOffset = statsOffset + 0x6C;
            }
            
            for (let markIndex = 0; markIndex < 12; markIndex++) {
                const markName = this.completionMarks[markIndex];
                let markOffset;
                
                if (charIndex === 14) {
                    markOffset = cluOffset + markIndex * 4;
                    if (markIndex === 8) cluOffset += 0x4;
                    if (markIndex === 9) cluOffset += 0x37C;
                    if (markIndex === 10) cluOffset += 0x84;
                } else if (charIndex > 14) {
                    markOffset = cluOffset + charIndex * 4 + markIndex * 19 * 4;
                    if (markIndex === 8) cluOffset += 0x4C;
                    if (markIndex === 9) cluOffset += 0x3C;
                    if (markIndex === 10) cluOffset += 0x3C;
                } else {
                    markOffset = cluOffset + charIndex * 4 + markIndex * 14 * 4;
                    if (markIndex === 5) cluOffset += 0x14;
                    if (markIndex === 8) cluOffset += 0x3C;
                    if (markIndex === 9) cluOffset += 0x3B0;
                    if (markIndex === 10) cluOffset += 0x50;
                }
                
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
            }
            
            // Персонаж считается разблокированным если есть completion marks или это Isaac
            const isUnlocked = charIndex === 0 || completedMarks > 0;
            if (isUnlocked) unlockedCount++;
            
            this.analysisResults.characters[charIndex] = {
                id: charIndex,
                name: character,
                unlocked: isUnlocked,
                completionMarks: completionMarks,
                completedMarks: completedMarks,
                totalMarks: this.completionMarks.length
            };
        }
        
        this.analysisResults.stats.charactersUnlocked = unlockedCount;
        this.analysisResults.debugInfo.push(`Персонажи: ${unlockedCount}/${this.TOTAL_CHARACTERS} разблокировано`);
    }

    async parseChallenges() {
        // Section 6: Challenges (1 байт на челлендж)
        const challengesOffset = this.sectionOffsets[6];
        if (!challengesOffset) return;
        
        let completedCount = 0;
        this.analysisResults.challenges = [];
        
        for (let i = 1; i <= this.TOTAL_CHALLENGES; i++) {
            const challengeOffset = challengesOffset + i;
            const isCompleted = challengeOffset < this.fileData.length && this.fileData[challengeOffset] === 1;
            if (isCompleted) completedCount++;
            
            this.analysisResults.challenges[i-1] = {
                id: i,
                name: `Challenge ${i}`,
                completed: isCompleted
            };
        }
        
        this.analysisResults.stats.challengesCompleted = completedCount;
        this.analysisResults.debugInfo.push(`Челленджи: ${completedCount}/${this.TOTAL_CHALLENGES} завершено`);
    }

    async parseItems() {
        // Section 3: Items (1 байт на предмет)
        const itemsOffset = this.sectionOffsets[3];
        if (!itemsOffset) return;
        
        let foundCount = 0;
        this.analysisResults.items = [];
        
        // Пропущенные предметы из script.py
        const skippedItems = [43, 59, 61, 235, 587, 613, 620, 630, 648, 656, 662, 666, 718];
        
        for (let i = 1; i <= this.TOTAL_ITEMS; i++) {
            if (skippedItems.includes(i)) {
                this.analysisResults.items[i-1] = {
                    id: i,
                    name: `Item ${i} (Skipped)`,
                    found: false,
                    type: "Skipped"
                };
                continue;
            }
            
            const itemOffset = itemsOffset + i;
            const isFound = itemOffset < this.fileData.length && this.fileData[itemOffset] === 1;
            if (isFound) foundCount++;
            
            this.analysisResults.items[i-1] = {
                id: i,
                name: `Item ${i}`,
                found: isFound,
                type: this.getItemType(i)
            };
        }
        
        this.analysisResults.stats.itemsFound = foundCount;
        this.analysisResults.debugInfo.push(`Предметы: ${foundCount}/${this.TOTAL_ITEMS - skippedItems.length} найдено`);
    }

    verifyChecksum() {
        // Проверка контрольной суммы (точный алгоритм из script.py)
        const offset = 0x10;
        const length = this.fileData.length - offset - 4;
        const calculatedChecksum = this.calcAfterbirthChecksum(offset, length);
        const storedChecksum = this.dataView.getUint32(offset + length, true);
        
        this.analysisResults.debugInfo.push(
            `Контрольная сумма: calculated=0x${calculatedChecksum.toString(16).toUpperCase()}, stored=0x${storedChecksum.toString(16).toUpperCase()}, valid=${calculatedChecksum === storedChecksum}`
        );
    }

    calcAfterbirthChecksum(offset, length) {
        // Точный CRC32 алгоритм из script.py
        const crcTable = [
            0x00000000, 0x09073096, 0x120E612C, 0x1B0951BA, 0xFF6DC419, 0xF66AF48F, 0xED63A535, 0xE46495A3, 
            0xFEDB8832, 0xF7DCB8A4, 0xECD5E91E, 0xE5D2D988, 0x01B64C2B, 0x08B17CBD, 0x13B82D07, 0x1ABF1D91, 
            0xFDB71064, 0xF4B020F2, 0xEFB97148, 0xE6BE41DE, 0x02DAD47D, 0x0BDDE4EB, 0x10D4B551, 0x19D385C7, 
            0x036C9856, 0x0A6BA8C0, 0x1162F97A, 0x1865C9EC, 0xFC015C4F, 0xF5066CD9, 0xEE0F3D63, 0xE7080DF5, 
            0xFB6E20C8, 0xF269105E, 0xE96041E4, 0xE0677172, 0x0403E4D1, 0x0D04D447, 0x160D85FD, 0x1F0AB56B, 
            0x05B5A8FA, 0x0CB2986C, 0x17BBC9D6, 0x1EBCF940, 0xFAD86CE3, 0xF3DF5C75, 0xE8D60DCF, 0xE1D13D59, 
            0x06D930AC, 0x0FDE003A, 0x14D75180, 0x1DD06116, 0xF9B4F4B5, 0xF0B3C423, 0xEBBA9599, 0xE2BDA50F, 
            0xF802B89E, 0xF1058808, 0xEA0CD9B2, 0xE30BE924, 0x076F7C87, 0x0E684C11, 0x15611DAB, 0x1C662D3D, 
            0xF6DC4190, 0xFFDB7106, 0xE4D220BC, 0xEDD5102A, 0x09B18589, 0x00B6B51F, 0x1BBFE4A5, 0x12B8D433, 
            0x0807C9A2, 0x0100F934, 0x1A09A88E, 0x130E9818, 0xF76A0DBB, 0xFE6D3D2D, 0xE5646C97, 0xEC635C01,
            0x0B6B51F4, 0x026C6162, 0x196530D8, 0x1062004E, 0xF40695ED, 0xFD01A57B, 0xE608F4C1, 0xEF0FC457, 
            0xF5B0D9C6, 0xFCB7E950, 0xE7BEB8EA, 0xEEB9887C, 0x0ADD1DDF, 0x03DA2D49, 0x18D37CF3, 0x11D44C65, 
            0x0DB26158, 0x04B551CE, 0x1FBC0074, 0x16BB30E2, 0xF2DFA541, 0xFBD895D7, 0xE0D1C46D, 0xE9D6F4FB, 
            0xF369E96A, 0xFA6ED9FC, 0xE1678846, 0xE860B8D0, 0x0C042D73, 0x05031DE5, 0x1E0A4C5F, 0x170D7CC9, 
            0xF005713C, 0xF90241AA, 0xE20B1010, 0xEB0C2086, 0x0F68B525, 0x066F85B3, 0x1D66D409, 0x1461E49F, 
            0x0EDEF90E, 0x07D9C998, 0x1CD09822, 0x15D7A8B4, 0xF1B33D17, 0xF8B40D81, 0xE3BD5C3B, 0xEABA6CAD, 
            0xEDB88320, 0xE4BFB3B6, 0xFFB6E20C, 0xF6B1D29A, 0x12D54739, 0x1BD277AF, 0x00DB2615, 0x09DC1683, 
            0x13630B12, 0x1A643B84, 0x016D6A3E, 0x086A5AA8, 0xEC0ECF0B, 0xE509FF9D, 0xFE00AE27, 0xF7079EB1, 
            0x100F9344, 0x1908A3D2, 0x0201F268, 0x0B06C2FE, 0xEF62575D, 0xE66567CB, 0xFD6C3671, 0xF46B06E7, 
            0xEED41B76, 0xE7D32BE0, 0xFCDA7A5A, 0xF5DD4ACC, 0x11B9DF6F, 0x18BEEFF9, 0x03B7BE43, 0x0AB08ED5, 
            0x16D6A3E8, 0x1FD1937E, 0x04D8C2C4, 0x0DDFF252, 0xE9BB67F1, 0xE0BC5767, 0xFBB506DD, 0xF2B2364B, 
            0xE80D2BDA, 0xE10A1B4C, 0xFA034AF6, 0xF3047A60, 0x1760EFC3, 0x1E67DF55, 0x056E8EEF, 0x0C69BE79, 
            0xEB61B38C, 0xE266831A, 0xF96FD2A0, 0xF068E236, 0x140C7795, 0x1D0B4703, 0x060216B9, 0x0F05262F, 
            0x15BA3BBE, 0x1CBD0B28, 0x07B45A92, 0x0EB36A04, 0xEAD7FFA7, 0xE3D0CF31, 0xF8D99E8B, 0xF1DEAE1D, 
            0x1B64C2B0, 0x1263F226, 0x096AA39C, 0x006D930A, 0xE40906A9, 0xED0E363F, 0xF6076785, 0xFF005713, 
            0xE5BF4A82, 0xECB87A14, 0xF7B12BAE, 0xFEB61B38, 0x1AD28E9B, 0x13D5BE0D, 0x08DCEFB7, 0x01DBDF21, 
            0xE6D3D2D4, 0xEFD4E242, 0xF4DDB3F8, 0xFDDA836E, 0x19BE16CD, 0x10B9265B, 0x0BB077E1, 0x02B74777, 
            0x18085AE6, 0x110F6A70, 0x0A063BCA, 0x03010B5C, 0xE7659EFF, 0xEE62AE69, 0xF56BFFD3, 0xFC6CCF45, 
            0xE00AE278, 0xE90DD2EE, 0xF2048354, 0xFB03B3C2, 0x1F672661, 0x166016F7, 0x0D69474D, 0x046E77DB, 
            0x1ED16A4A, 0x17D65ADC, 0x0CDF0B66, 0x05D83BF0, 0xE1BCAE53, 0xE8BB9EC5, 0xF3B2CF7F, 0xFAB5FFE9, 
            0x1DBDF21C, 0x14BAC28A, 0x0FB39330, 0x06B4A3A6, 0xE2D03605, 0xEBD70693, 0xF0DE5729, 0xF9D967BF, 
            0xE3667A2E, 0xEA614AB8, 0xF1681B02, 0xF86F2B94, 0x1C0BBE37, 0x150C8EA1, 0x0E05DF1B, 0x0702EF8D
        ];
        
        let checksum = 0xFEDCBA76;
        checksum = ~checksum;
        
        for (let i = offset; i < offset + length; i++) {
            checksum = crcTable[((checksum & 0xFF)) ^ this.fileData[i]] ^ (this.rshift(checksum, 8));
        }
        
        return ~checksum + 0x100000000;
    }

    rshift(val, n) {
        return val >> n;
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
            Показано: 100 из ${this.TOTAL_ITEMS} предметов<br>
            Найдено всего: ${this.analysisResults.stats.itemsFound} из ${this.TOTAL_ITEMS}
        `;
        container.appendChild(infoDiv);
    }

    updateRawTab() {
        const container = document.getElementById('rawData');
        let content = '';
        
        if (this.debugMode && this.analysisResults.debugInfo.length > 0) {
            content += '=== REPENTANCE PARSER DEBUG INFO ===\n';
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
                name: this.characters[i],
                unlocked: false,
                completionMarks: Array.from({length: 12}, (_, j) => ({
                    name: this.completionMarks[j],
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
    if (!window.repentanceParser || !window.repentanceParser.analysisResults) {
        alert('Сначала загрузите и проанализируйте файл сохранения');
        return;
    }

    const results = window.repentanceParser.analysisResults;
    const data = {
        timestamp: new Date().toISOString(),
        parser: 'RepentanceIsaacSaveParser',
        statistics: results.statistics,
        debugInfo: results.debugInfo,
        sectionOffsets: window.repentanceParser.sectionOffsets,
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
    a.download = 'isaac-save-analysis-repentance.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    window.repentanceParser = new RepentanceIsaacSaveParser();
});
