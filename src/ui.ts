import { IsaacSaveData, Achievement, Character, Item, Challenge } from './types';

export class UIManager {
    private statsGrid: HTMLElement;
    private loadingElement: HTMLElement;
    private errorElement: HTMLElement;

    constructor() {
        this.statsGrid = document.getElementById('statsGrid')!;
        this.loadingElement = document.getElementById('loading')!;
        this.errorElement = document.getElementById('error')!;
    }

    public showLoading(): void {
        this.loadingElement.style.display = 'block';
        this.errorElement.classList.add('hidden');
        this.statsGrid.innerHTML = '';
    }

    public hideLoading(): void {
        this.loadingElement.style.display = 'none';
    }

    public showError(message: string): void {
        this.hideLoading();
        this.errorElement.textContent = message;
        this.errorElement.classList.remove('hidden');
    }

    public displaySaveData(data: IsaacSaveData): void {
        this.hideLoading();
        this.errorElement.classList.add('hidden');
        
        this.statsGrid.innerHTML = `
            ${this.createAchievementsCard(data.achievements)}
            ${this.createCharactersCard(data.characters)}
            ${this.createItemsCard(data.items)}
            ${this.createChallengesCard(data.challenges)}
            ${this.createStatsCard(data.stats)}
        `;
    }

    private createAchievementsCard(achievements: Achievement[]): string {
        const unlockedCount = achievements.filter(a => a.unlocked).length;
        const totalCount = achievements.length;
        const percentage = Math.round((unlockedCount / totalCount) * 100);

        const lockedAchievements = achievements.filter(a => !a.unlocked).slice(0, 10);
        const unlockedAchievements = achievements.filter(a => a.unlocked).slice(0, 10);

        return `
            <div class="stat-card">
                <h3>🏆 Достижения (${unlockedCount}/${totalCount})</h3>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${percentage}%"></div>
                </div>
                <p>Прогресс: ${percentage}%</p>
                
                <div class="item-list">
                    <h4>Разблокированные:</h4>
                    ${unlockedAchievements.map(achievement => `
                        <div class="item">
                            <span class="item-name">${achievement.name}</span>
                            <span class="item-status status-unlocked">✓</span>
                        </div>
                    `).join('')}
                    
                    <h4>Заблокированные:</h4>
                    ${lockedAchievements.map(achievement => `
                        <div class="item">
                            <span class="item-name">${achievement.name}</span>
                            <span class="item-status status-locked">✗</span>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    private createCharactersCard(characters: Character[]): string {
        const unlockedCount = characters.filter(c => c.unlocked).length;
        const totalCount = characters.length;
        const percentage = Math.round((unlockedCount / totalCount) * 100);

        return `
            <div class="stat-card">
                <h3>👥 Персонажи (${unlockedCount}/${totalCount})</h3>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${percentage}%"></div>
                </div>
                <p>Прогресс: ${percentage}%</p>
                
                <div class="item-list">
                    ${characters.map(character => `
                        <div class="item">
                            <span class="item-name">${character.name}</span>
                            <span class="item-status ${character.unlocked ? 'status-unlocked' : 'status-locked'}">
                                ${character.unlocked ? '✓' : '✗'}
                            </span>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    private createItemsCard(items: Item[]): string {
        const unlockedCount = items.filter(i => i.unlocked).length;
        const touchedCount = items.filter(i => i.touched).length;
        const totalCount = items.length;
        const unlockedPercentage = Math.round((unlockedCount / totalCount) * 100);
        const touchedPercentage = Math.round((touchedCount / totalCount) * 100);

        const qualityItems = items.filter(i => i.unlocked).reduce((acc, item) => {
            acc[item.quality] = (acc[item.quality] || 0) + 1;
            return acc;
        }, {} as Record<number, number>);

        return `
            <div class="stat-card">
                <h3>🎒 Предметы (${unlockedCount}/${totalCount})</h3>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${unlockedPercentage}%"></div>
                </div>
                <p>Разблокировано: ${unlockedPercentage}% | Найдено: ${touchedPercentage}%</p>
                
                <div style="margin: 15px 0;">
                    <h4>По качеству:</h4>
                    <p>0 качество: ${qualityItems[0] || 0}</p>
                    <p>1 качество: ${qualityItems[1] || 0}</p>
                    <p>2 качество: ${qualityItems[2] || 0}</p>
                    <p>3 качество: ${qualityItems[3] || 0}</p>
                    <p>4 качество: ${qualityItems[4] || 0}</p>
                </div>
                
                <div class="item-list">
                    <h4>Последние разблокированные:</h4>
                    ${items.filter(i => i.unlocked).slice(-10).map(item => `
                        <div class="item">
                            <span class="item-name">${item.name} (Q${item.quality})</span>
                            <span class="item-status status-unlocked">✓</span>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    private createChallengesCard(challenges: Challenge[]): string {
        const completedCount = challenges.filter(c => c.completed).length;
        const totalCount = challenges.length;
        const percentage = Math.round((completedCount / totalCount) * 100);

        return `
            <div class="stat-card">
                <h3>🎯 Челленджи (${completedCount}/${totalCount})</h3>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${percentage}%"></div>
                </div>
                <p>Прогресс: ${percentage}%</p>
                
                <div class="item-list">
                    ${challenges.map(challenge => `
                        <div class="item">
                            <span class="item-name">${challenge.name} (${challenge.difficulty}/5)</span>
                            <span class="item-status ${challenge.completed ? 'status-unlocked' : 'status-locked'}">
                                ${challenge.completed ? '✓' : '✗'}
                            </span>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    private createStatsCard(stats: any): string {
        const playTimeHours = Math.round(stats.totalPlayTime / 3600);
        const winRate = stats.totalRuns > 0 ? Math.round((stats.totalWins / stats.totalRuns) * 100) : 0;

        return `
            <div class="stat-card">
                <h3>📊 Статистика</h3>
                <div style="margin: 15px 0;">
                    <p><strong>Время игры:</strong> ${playTimeHours} часов</p>
                    <p><strong>Всего смертей:</strong> ${stats.totalDeaths}</p>
                    <p><strong>Всего побед:</strong> ${stats.totalWins}</p>
                    <p><strong>Всего забегов:</strong> ${stats.totalRuns}</p>
                    <p><strong>Процент побед:</strong> ${winRate}%</p>
                    <p><strong>Лучшая серия:</strong> ${stats.bestStreak}</p>
                    <p><strong>Текущая серия:</strong> ${stats.currentStreak}</p>
                </div>
            </div>
        `;
    }
}
