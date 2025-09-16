// Isaac Game Data - Только ID для персонажей, челленджей и боссов
// Названия и описания берутся из achievements_unlock_final.json

const ISAAC_GAME_DATA = {
    // ID персонажей (34 персонажа для Repentance)
    characters: [
        0, 1, 2, 3, 32, 42, 67, 80, 79, 81, 82, 199, 251, 340, 390, 404, 405,
        474, 475, 476, 477, 478, 479, 480, 481, 482, 483, 484, 485, 486, 487, 488, 489, 490
    ],

    // ID челленджей (45 челленджей для Repentance)
    challenges: [
        89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113,
        224, 225, 226, 227, 228, 229, 230, 231, 233, 234, 331, 332, 333, 334, 335, 517, 518, 519, 520, 521
    ],

    // ID боссов для каждого персонажа (из Kal.txt)
    characterBosses: {
        0: [43, 49, 70, 106, 149, 169, 179, 205, 282, 192, 296, 440, 441], // Исаак
        1: [45, 50, 109, 20, 71, 168, 180, 206, 283, 193, 297, 442, 443], // Магдалена
        2: [46, 75, 110, 21, 51, 171, 181, 207, 284, 194, 298, 444, 445], // Каин
        3: [72, 75, 108, 107, 52, 170, 182, 208, 285, 195, 299, 446, 447]  // Иуда
        // Можно добавить остальных персонажей при необходимости
    },

    // Общие настройки
    totals: { 
        characters: 34, 
        challenges: 45, 
        items: 732, 
        achievements: 640 
    },

    // Поддерживаемые заголовки файлов
    supportedHeaders: [
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
    ]
};

// Экспорт для использования в других файлах
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ISAAC_GAME_DATA;
}
