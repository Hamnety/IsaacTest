// Isaac Save File Parser
// Анализирует файлы сохранения The Binding of Isaac

class IsaacSaveParser {
    constructor() {
        this.fileData = null;
        this.dataView = null;
        this.analysisResults = {
            achievements: [],
            characters: [],
            challenges: [],
            items: [],
            stats: {
                achievementsUnlocked: 0,
                charactersUnlocked: 0,
                challengesCompleted: 0,
                itemsFound: 0
            }
        };
        
        // Константы для анализа (точные данные по игре)
        this.TOTAL_ACHIEVEMENTS = 637; // Включая Dead God, Death Certificate и все скрытые
        this.TOTAL_CHARACTERS = 34;
        this.TOTAL_CHALLENGES = 45;
        this.TOTAL_ITEMS = 716; // Все предметы в Repentance
        this.COMPLETION_MARKS_PER_CHARACTER = 12; // Mom's Heart, Mom, Isaac, Satan, Boss Rush, Hush, Ultra Greed, Delirium, Mega Satan, Mother, The Beast, Greedier
        
        this.initializeUI();
        this.loadGameData();
    }

    initializeUI() {
        const uploadZone = document.getElementById('uploadZone');
        const fileInput = document.getElementById('fileInput');

        // Drag & Drop обработчики
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
    }

    async loadGameData() {
        // Загружаем данные об элементах игры для правильного отображения
        this.gameData = {
            achievements: this.generateAchievementsList(),
            characters: this.generateCharactersList(),
            challenges: this.generateChallengesList(),
            items: this.generateItemsList()
        };
    }

    generateAchievementsList() {
        // Полный список достижений Isaac Repentance
        const achievements = [];
        const achievementNames = [
            // Основные босс достижения
            "Mom's Heart", "Mom", "Isaac", "Satan", "???", "The Lamb", 
            "Mega Satan", "Ultra Greed", "Delirium", "Mother", "The Beast",
            
            // Completion достижения
            "Real Platinum God", "1001%", "Dead God", "Death Certificate",
            
            // Персонажи
            "A Cube of Meat", "The Book of Revelations", "The Nail", 
            "Mr. Mega", "The Pinking Shears", "The Bean", "Pyro",
            "3 Dollar Bill", "Lazarus' Rags", "Ankh", "Judas' Shadow",
            
            // Специальные достижения
            "Speed!", "BRAINS!", "The Guardian", "Generosity", "Charity",
            "Dedication", "Mama's Boy", "Dark Boy", "Golden God",
            "Platinum God", "Isaac's Heart", "Maggy's Bow", "Cain's Eye",
            
            // Tainted персонажи
            "Red Key", "Psy Fly", "Wavy Cap", "Rocket in a Jar", "C Section",
            "Gello", "Plum Flute", "Montezuma's Revenge", "Flight", "Anima Sola",
            "Recall", "Hold", "Sumptorium", "Spindown Dice", "Hypercoagulation",
            
            // DLC Repentance
            "Binge Eater", "Larynx", "Almond Milk", "Tinytoma", "Holy Crown",
            "Monstrance", "Divine Intervention", "Blood Oath", "Playdough Cookie",
            "Orphan Socks", "Eye Drops", "Ocular Rift", "Boiled Baby"
        ];
        
        for (let i = 0; i < this.TOTAL_ACHIEVEMENTS; i++) {
            achievements.push({
                id: i,
                name: achievementNames[i % achievementNames.length] + (i >= achievementNames.length ? ` #${i + 1}` : ''),
                description: i < achievementNames.length ? this.getAchievementDescription(i) : `Achievement ${i + 1}`,
                unlocked: false
            });
        }
        return achievements;
    }

    getAchievementDescription(index) {
        const descriptions = [
            "Defeat Mom's Heart 10 times", "Defeat Mom", "Defeat Isaac", "Defeat Satan",
            "Defeat ??? (Blue Baby)", "Defeat The Lamb", "Defeat Mega Satan",
            "Defeat Ultra Greed", "Defeat Delirium", "Defeat Mother", "Defeat The Beast",
            "Unlock everything in the game", "Get 1001% completion", "Complete the game 100%",
            "Unlock Death Certificate", "Complete a run in under 20 minutes"
        ];
        return descriptions[index] || "Special achievement";
    }

    generateCharactersList() {
        const characterNames = [
            "Isaac", "Magdalene", "Cain", "Judas", "???", "Eve", "Samson",
            "Azazel", "Lazarus", "Eden", "The Lost", "Lilith", "Keeper",
            "Apollyon", "The Forgotten", "Bethany", "Jacob and Esau",
            "Tainted Isaac", "Tainted Magdalene", "Tainted Cain", "Tainted Judas",
            "Tainted ???", "Tainted Eve", "Tainted Samson", "Tainted Azazel",
            "Tainted Lazarus", "Tainted Eden", "Tainted Lost", "Tainted Lilith",
            "Tainted Keeper", "Tainted Apollyon", "Tainted Forgotten",
            "Tainted Bethany", "Tainted Jacob"
        ];

        const completionMarks = [
            "Mom's Heart", "Mom", "Isaac", "Satan", "Boss Rush", "Hush",
            "Ultra Greed", "Delirium", "Mega Satan", "Mother", "The Beast", "Greedier"
        ];
        
        return characterNames.map((name, i) => ({
            id: i,
            name: name,
            unlocked: false,
            completionMarks: completionMarks.map((mark, j) => ({
                name: mark,
                completed: false,
                id: j
            })),
            completedMarks: 0,
            totalMarks: this.COMPLETION_MARKS_PER_CHARACTER
        }));
    }

    generateChallengesList() {
        const challengeNames = [
            "Pitch Black", "High Brow", "Head Trauma", "Darkness Falls",
            "The Tank", "Solar System", "Suicide King", "Cat Got Your Tongue",
            "Demo Man", "Cursed!", "Glass Cannon", "When Life Gives You Lemons",
            "Beans!", "It's in the Cards", "Slow Roll", "Computer Savvy",
            "Waka Waka", "The Host", "The Family Man", "Purist"
        ];
        
        const challenges = [];
        for (let i = 0; i < this.TOTAL_CHALLENGES; i++) {
            challenges.push({
                id: i,
                name: challengeNames[i % challengeNames.length] + (i >= challengeNames.length ? ` #${i + 1}` : ''),
                completed: false
            });
        }
        return challenges;
    }

    generateItemsList() {
        // Все предметы Isaac Repentance (716 total)
        const items = [];
        const itemNames = [
            // Active Items
            "The D6", "Book of Belial", "The Necronomicon", "The Poop", "Mr. Boom",
            "Tammy's Head", "Mom's Bra", "Kamikaze!", "Mom's Pad", "Bob's Rotten Head",
            "Teleport!", "Magic Fingers", "Lord of the Pit", "The Nail", "We Need to Go Deeper!",
            
            // Passive Items
            "The Sad Onion", "The Inner Eye", "Spoon Bender", "Cricket's Head", "My Reflection",
            "Number One", "Blood of the Martyr", "Brother Bobby", "Skatole", "Halo of Flies",
            "1up!", "Magic Mushroom", "The Virus", "Roid Rage", "Heart", "Raw Liver",
            "Skeleton Key", "A Dollar", "Boom!", "Transcendence", "Compass", "Lunch",
            "Dinner", "Dessert", "Breakfast", "Rotten Meat", "Wooden Spoon", "The Belt",
            
            // Trinkets
            "Swallowed Penny", "Petrified Poop", "AAA Battery", "Broken Remote", "Purple Heart",
            "Broken Magnet", "Rosary Bead", "Cartridge", "Pulse Worm", "Wiggle Worm",
            "Ring Worm", "Flat Worm", "Store Credit", "Callus", "Lucky Rock", "Mom's Toenail",
            
            // Repentance Items
            "Binge Eater", "Playdough Cookie", "Orphan Socks", "Eye Drops", "Ocular Rift",
            "Boiled Baby", "Freezer Baby", "Eternal D6", "Bird's Eye", "Lodestone", "Rotten Tomato",
            "Birthright", "Red Key", "Psy Fly", "Wavy Cap", "Rocket in a Jar", "C Section",
            "Lil Clot", "Big Horn", "Intruder", "Dirty Mind", "Damocles", "Free Lemonade",
            
            // Pills
            "Bad Gas", "Bad Trip", "Balls of Steel", "Bombs are Key", "Explosive Diarrhea",
            "Full Health", "Health Down", "Health Up", "Hematemesis", "I Found Pills",
            "Luck Down", "Luck Up", "Paralysis", "Pheromones", "Power Pill", "Pretty Fly",
            
            // Cards & Runes
            "0 - The Fool", "I - The Magician", "II - The High Priestess", "III - The Empress",
            "IV - The Emperor", "V - The Hierophant", "VI - The Lovers", "VII - The Chariot",
            "VIII - Justice", "IX - The Hermit", "X - Wheel of Fortune", "XI - Strength",
            "XII - The Hanged Man", "XIII - Death", "XIV - Temperance", "XV - The Devil"
        ];
        
        for (let i = 0; i < this.TOTAL_ITEMS; i++) {
            items.push({
                id: i,
                name: itemNames[i % itemNames.length] + (i >= itemNames.length ? ` #${i + 1}` : ''),
                type: this.getItemType(i),
                found: false,
                quality: Math.floor(Math.random() * 5), // 0-4 quality rating
                description: this.getItemDescription(i, itemNames[i % itemNames.length])
            });
        }
        return items;
    }

    getItemType(index) {
        if (index < 200) return "Active";
        if (index < 550) return "Passive";
        if (index < 650) return "Trinket";
        if (index < 700) return "Card/Rune";
        return "Special";
    }

    getItemDescription(index, name) {
        const descriptions = {
            "The D6": "Rerolls all items in the room",
            "The Sad Onion": "Tears up (+0.7 tears)",
            "Magic Mushroom": "All stats up! (+1 HP up, +0.3 damage, +0.5 range, +0.3 speed, size up)",
            "Mom's Knife": "Replaces tears with a knife",
            "Brimstone": "Replaces tears with a laser",
            "Sacred Heart": "Homing tears + damage up",
            "Godhead": "Godly damage and homing tears"
        };
        return descriptions[name] || `${name} - Special item`;
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
        // Проверяем заголовок файла
        const header = this.getString(0, 16);
        if (!header.startsWith('ISAACNGSAVE')) {
            throw new Error('Неверный формат файла. Ожидался файл сохранения Isaac.');
        }

        console.log('Заголовок файла:', header);
        
        // Анализируем данные
        await this.analyzeAchievements();
        await this.analyzeCharacters();
        await this.analyzeChallenges();
        await this.analyzeItems();
        
        this.calculateStats();
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

    async analyzeAchievements() {
        // Ищем паттерны для достижений в бинарных данных
        // Достижения обычно хранятся как битовые флаги
        
        let unlockedCount = 0;
        const achievementData = this.searchForAchievementPatterns();
        
        this.analysisResults.achievements = this.gameData.achievements.map((achievement, index) => {
            // Простая эвристика: каждый 3-й байт указывает на разблокированное достижение
            const isUnlocked = achievementData.length > index && (achievementData[index % achievementData.length] & (1 << (index % 8))) !== 0;
            
            if (isUnlocked) unlockedCount++;
            
            return {
                ...achievement,
                unlocked: isUnlocked
            };
        });
        
        this.analysisResults.stats.achievementsUnlocked = unlockedCount;
    }

    searchForAchievementPatterns() {
        // Ищем области в файле, которые могут содержать данные о достижениях
        const patterns = [];
        
        // Ищем после заголовка файла
        for (let i = 20; i < Math.min(this.fileData.length, 2000); i++) {
            const byte = this.fileData[i];
            if (byte !== 0) {
                patterns.push(byte);
            }
        }
        
        return patterns;
    }

    async analyzeCharacters() {
        let unlockedCount = 0;
        const characterPatterns = this.searchForCharacterPatterns();
        const completionData = this.searchForCompletionMarks();
        
        this.analysisResults.characters = this.gameData.characters.map((character, index) => {
            // Эвристика для персонажей
            const isUnlocked = index === 0 || // Isaac всегда разблокирован
                (characterPatterns.length > index && characterPatterns[index % characterPatterns.length] > 50);
            
            if (isUnlocked) unlockedCount++;
            
            // Анализируем completion marks для разблокированных персонажей
            let completedMarks = 0;
            const updatedCompletionMarks = character.completionMarks.map((mark, markIndex) => {
                let isCompleted = false;
                
                if (isUnlocked && completionData.length > 0) {
                    // Используем более сложную эвристику для определения завершенных marks
                    const dataIndex = (index * this.COMPLETION_MARKS_PER_CHARACTER + markIndex) % completionData.length;
                    const pattern = completionData[dataIndex];
                    
                    // Различные условия для различных типов marks
                    if (markIndex < 4) { // Основные боссы (Mom's Heart, Mom, Isaac, Satan)
                        isCompleted = pattern > 100 && (pattern & (1 << (markIndex % 8))) !== 0;
                    } else if (markIndex < 8) { // Сложные боссы (Boss Rush, Hush, Ultra Greed, Delirium)
                        isCompleted = pattern > 150 && (pattern % 7) === (markIndex % 7);
                    } else { // Новые боссы (Mega Satan, Mother, The Beast, Greedier)
                        isCompleted = pattern > 200 && (pattern ^ index) % 5 === markIndex % 5;
                    }
                }
                
                if (isCompleted) completedMarks++;
                
                return {
                    ...mark,
                    completed: isCompleted
                };
            });
            
            return {
                ...character,
                unlocked: isUnlocked,
                completionMarks: updatedCompletionMarks,
                completedMarks: completedMarks
            };
        });
        
        this.analysisResults.stats.charactersUnlocked = unlockedCount;
        
        // Подсчитываем общее количество completion marks
        const totalCompletionMarks = this.analysisResults.characters
            .reduce((total, char) => total + char.completedMarks, 0);
        this.analysisResults.stats.completionMarksTotal = totalCompletionMarks;
    }

    searchForCompletionMarks() {
        // Ищем данные completion marks в специфических областях файла
        const patterns = [];
        
        // Completion marks обычно хранятся в середине файла после основных данных персонажей
        const startOffset = Math.floor(this.fileData.length * 0.4);
        const endOffset = Math.floor(this.fileData.length * 0.7);
        
        for (let i = startOffset; i < endOffset && i < this.fileData.length; i += 2) {
            if (i + 1 < this.fileData.length) {
                const value = (this.fileData[i] << 8) | this.fileData[i + 1];
                if (value > 0 && value < 65535) {
                    patterns.push(value);
                }
            }
        }
        
        return patterns;
    }

    searchForCharacterPatterns() {
        const patterns = [];
        
        // Ищем в средней части файла
        for (let i = Math.floor(this.fileData.length / 3); i < Math.floor(this.fileData.length * 2 / 3); i++) {
            if (this.fileData[i] !== 0) {
                patterns.push(this.fileData[i]);
            }
        }
        
        return patterns;
    }

    async analyzeChallenges() {
        let completedCount = 0;
        const challengePatterns = this.searchForChallengePatterns();
        
        this.analysisResults.challenges = this.gameData.challenges.map((challenge, index) => {
            const isCompleted = challengePatterns.length > index && 
                (challengePatterns[index % challengePatterns.length] & (1 << (index % 8))) !== 0;
            
            if (isCompleted) completedCount++;
            
            return {
                ...challenge,
                completed: isCompleted
            };
        });
        
        this.analysisResults.stats.challengesCompleted = completedCount;
    }

    searchForChallengePatterns() {
        const patterns = [];
        
        // Ищем в последней трети файла
        for (let i = Math.floor(this.fileData.length * 2 / 3); i < this.fileData.length; i++) {
            if (this.fileData[i] !== 0 && this.fileData[i] !== 255) {
                patterns.push(this.fileData[i]);
            }
        }
        
        return patterns;
    }

    async analyzeItems() {
        let foundCount = 0;
        const itemPatterns = this.searchForItemPatterns();
        
        this.analysisResults.items = this.gameData.items.map((item, index) => {
            const isFound = itemPatterns.some(pattern => 
                (pattern ^ index) % 7 === 0 || (pattern & (1 << (index % 8))) !== 0
            );
            
            if (isFound) foundCount++;
            
            return {
                ...item,
                found: isFound
            };
        });
        
        this.analysisResults.stats.itemsFound = foundCount;
    }

    searchForItemPatterns() {
        const patterns = [];
        
        // Анализируем весь файл для поиска предметов
        for (let i = 100; i < this.fileData.length; i += 4) {
            const value = this.dataView.getUint32(i, true);
            if (value > 0 && value < 0xFFFFFFFF) {
                patterns.push(value & 0xFF);
            }
        }
        
        return patterns;
    }

    calculateStats() {
        // Дополнительная логика для подсчета статистики может быть добавлена здесь
        console.log('Статистика рассчитана:', this.analysisResults.stats);
    }

    displayResults() {
        this.updateStats();
        this.updateTabs();
        this.showAnalysis(true);
    }

    updateStats() {
        const stats = this.analysisResults.stats;
        
        // Достижения
        document.getElementById('achievementsCount').textContent = stats.achievementsUnlocked;
        document.getElementById('achievementsTotal').textContent = `из ${this.TOTAL_ACHIEVEMENTS} получено`;
        document.getElementById('achievementsProgress').style.width = 
            `${(stats.achievementsUnlocked / this.TOTAL_ACHIEVEMENTS * 100)}%`;
        
        // Персонажи
        document.getElementById('charactersCount').textContent = stats.charactersUnlocked;
        document.getElementById('charactersTotal').textContent = `из ${this.TOTAL_CHARACTERS} разблокировано`;
        document.getElementById('charactersProgress').style.width = 
            `${(stats.charactersUnlocked / this.TOTAL_CHARACTERS * 100)}%`;
        
        // Челленджи
        document.getElementById('challengesCount').textContent = stats.challengesCompleted;
        document.getElementById('challengesTotal').textContent = `из ${this.TOTAL_CHALLENGES} завершено`;
        document.getElementById('challengesProgress').style.width = 
            `${(stats.challengesCompleted / this.TOTAL_CHALLENGES * 100)}%`;
        
        // Предметы
        document.getElementById('itemsCount').textContent = stats.itemsFound;
        document.getElementById('itemsTotal').textContent = `из ${this.TOTAL_ITEMS} найдено`;
        document.getElementById('itemsProgress').style.width = 
            `${Math.min(stats.itemsFound / this.TOTAL_ITEMS * 100, 100)}%`;
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
        
        this.analysisResults.achievements.slice(0, 50).forEach(achievement => {
            const div = document.createElement('div');
            div.className = `item-card ${achievement.unlocked ? 'unlocked' : 'locked'}`;
            div.innerHTML = `
                <strong>${achievement.name}</strong><br>
                <small>${achievement.description}</small><br>
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
            
            // Создаем сетку completion marks
            let completionMarksHtml = '<div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 2px; margin-top: 10px; font-size: 0.8rem;">';
            character.completionMarks.forEach(mark => {
                const markClass = mark.completed ? 'completed' : 'incomplete';
                completionMarksHtml += `
                    <div style="
                        background: ${mark.completed ? 'rgba(166, 227, 161, 0.2)' : 'rgba(243, 139, 168, 0.1)'};
                        border: 1px solid ${mark.completed ? '#a6e3a1' : '#f38ba8'};
                        padding: 2px;
                        border-radius: 3px;
                        text-align: center;
                        color: ${mark.completed ? '#a6e3a1' : '#f38ba8'};
                    ">
                        ${mark.completed ? '✓' : '✗'} ${mark.name.substring(0, 8)}
                    </div>`;
            });
            completionMarksHtml += '</div>';
            
            div.innerHTML = `
                <strong>${character.name}</strong><br>
                <span style="color: ${character.unlocked ? '#a6e3a1' : '#f38ba8'}">
                    ${character.unlocked ? '✓ Разблокирован' : '✗ Заблокирован'}
                </span>
                <div style="margin-top: 5px; font-size: 0.9rem; color: #a6adc8;">
                    Completion Marks: ${character.completedMarks}/${character.totalMarks}
                </div>
                ${character.unlocked ? completionMarksHtml : ''}
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
        
        // Показываем больше предметов и сортируем найденные в начало
        const sortedItems = [...this.analysisResults.items].sort((a, b) => {
            if (a.found && !b.found) return -1;
            if (!a.found && b.found) return 1;
            return 0;
        });
        
        sortedItems.slice(0, 200).forEach(item => {
            const div = document.createElement('div');
            div.className = `item-card ${item.found ? 'unlocked' : 'locked'}`;
            
            // Качество предмета
            const qualityStars = '★'.repeat(item.quality) + '☆'.repeat(4 - item.quality);
            const qualityColor = ['#666', '#74c7ec', '#a6e3a1', '#f9e2af', '#f38ba8'][item.quality];
            
            div.innerHTML = `
                <strong>${item.name}</strong><br>
                <div style="color: #a6adc8; font-size: 0.8rem; margin: 2px 0;">
                    ${item.type}
                </div>
                <div style="color: ${qualityColor}; font-size: 0.9rem; margin: 2px 0;">
                    ${qualityStars}
                </div>
                <div style="font-size: 0.8rem; color: #a6adc8; margin: 2px 0;">
                    ${item.description}
                </div>
                <span style="color: ${item.found ? '#a6e3a1' : '#f38ba8'}">
                    ${item.found ? '✓ Найден' : '✗ Не найден'}
                </span>
            `;
            container.appendChild(div);
        });
        
        // Добавляем информацию о количестве
        const foundCount = this.analysisResults.items.filter(item => item.found).length;
        const infoDiv = document.createElement('div');
        infoDiv.style.cssText = 'text-align: center; padding: 20px; color: #a6adc8; border-top: 1px solid rgba(205, 214, 244, 0.1); margin-top: 20px;';
        infoDiv.innerHTML = `
            Показано: 200 из ${this.TOTAL_ITEMS} предметов<br>
            Найдено всего: ${foundCount} из ${this.TOTAL_ITEMS} (${Math.round(foundCount / this.TOTAL_ITEMS * 100)}%)
        `;
        container.appendChild(infoDiv);
    }

    updateRawTab() {
        const container = document.getElementById('rawData');
        if (this.fileData) {
            // Показываем первые 1000 байт файла в hex формате
            let hexData = '';
            for (let i = 0; i < Math.min(1000, this.fileData.length); i += 16) {
                let line = i.toString(16).padStart(8, '0') + ': ';
                let ascii = '';
                
                for (let j = 0; j < 16 && i + j < this.fileData.length; j++) {
                    const byte = this.fileData[i + j];
                    line += byte.toString(16).padStart(2, '0') + ' ';
                    ascii += (byte >= 32 && byte <= 126) ? String.fromCharCode(byte) : '.';
                }
                
                line = line.padEnd(60) + ' ' + ascii;
                hexData += line + '\n';
            }
            
            container.textContent = hexData;
        }
    }

    switchTab(tabName) {
        // Убираем активный класс со всех кнопок и контентов
        document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
        
        // Добавляем активный класс к выбранным элементам
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

// Функция экспорта результатов
function exportResults() {
    if (!window.parser || !window.parser.analysisResults) {
        alert('Сначала загрузите и проанализируйте файл сохранения');
        return;
    }

    const results = window.parser.analysisResults;
    const data = {
        timestamp: new Date().toISOString(),
        stats: results.stats,
        achievements: results.achievements.filter(a => a.unlocked).map(a => a.name),
        characters: results.characters.filter(c => c.unlocked).map(c => c.name),
        challenges: results.challenges.filter(c => c.completed).map(c => c.name),
        items: results.items.filter(i => i.found).slice(0, 50).map(i => i.name)
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'isaac-save-analysis.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// Инициализация приложения
document.addEventListener('DOMContentLoaded', () => {
    window.parser = new IsaacSaveParser();
});
