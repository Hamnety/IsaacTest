// Типы для данных игры The Binding of Isaac

export interface IsaacSaveData {
    version: string;
    achievements: Achievement[];
    characters: Character[];
    items: Item[];
    challenges: Challenge[];
    stats: GameStats;
}

export interface Achievement {
    id: number;
    name: string;
    description: string;
    unlocked: boolean;
    icon?: string;
}

export interface Character {
    id: number;
    name: string;
    unlocked: boolean;
    completionMarks: CompletionMark[];
}

export interface CompletionMark {
    difficulty: string; // "Normal", "Hard", "Greed", "Greedier"
    completed: boolean;
}

export interface Item {
    id: number;
    name: string;
    description: string;
    quality: number; // 0-4
    unlocked: boolean;
    touched: boolean;
    icon?: string;
}

export interface Challenge {
    id: number;
    name: string;
    description: string;
    completed: boolean;
    difficulty: number;
}

export interface GameStats {
    totalPlayTime: number;
    totalDeaths: number;
    totalWins: number;
    totalRuns: number;
    bestStreak: number;
    currentStreak: number;
}

export interface SaveFileInfo {
    slot: number;
    fileName: string;
    fileSize: number;
    lastModified: Date;
}
