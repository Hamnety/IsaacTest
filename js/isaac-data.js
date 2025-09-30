// Isaac Game Data - Только ID для персонажей, челленджей и боссов
// Названия и описания берутся из achievements_unlock_final.json

// Справочная таблица персонажей для удобства заполнения:
// 0 - Исаак, 1 - Магдалена, 2 - Каин, 3 - Иуда, 32 - ???, 42 - Ева, 67 - Самсон, 80 - Лазарь, 79 - Азазель, 81 - Эдем, 82 - Лост, 199 - Лилит, 251 - Хранитель, 340 - Аполион, 390 - Забытый, 404 - Бетани, 405 - Иаков и Исав
// 474 - Порченный Айзек, 475 - Порченная Магдалена, 476 - Порченный Каин, 477 - Порченный Иуда, 478 - Порченный ???, 479 - Порченный Еву, 480 - Порченный Самсон, 481 - Порченный Азазель, 482 - Порченный Лазарь, 483 - Порченный Иден, 484 - Порченный Лост, 485 - Порченный Лилит, 486 - Порченный Хранитель, 487 - Порченный Аполлион, 488 - Порченный Забытый, 489 - Порченный Беттани, 490 - Порченный Иаков и Исав

const ISAAC_GAME_DATA = {
    // Единая структура персонажей
    characters: {
        // Обычные персонажи
        0: { name: "Айзек", unlockAchievement: null, bossAchievements: [43, 49, 70, 106, 149, 169, 179, 205, 282, 192, 296, 440, 441], iconId: 0 },
        1: { name: "Магдалена", unlockAchievement: 1, bossAchievements: [45, 50, 109, 20, 71, 168, 180, 206, 283, 193, 297, 442, 443], iconId: 1 },
        2: { name: "Кайн", unlockAchievement: 2, bossAchievements: [46, 75, 110, 21, 51, 171, 181, 207, 284, 194, 298, 444, 445], iconId: 2 },
        3: { name: "Иуда", unlockAchievement: 3, bossAchievements: [72, 75, 108, 107, 52, 170, 182, 208, 285, 195, 299, 446, 447], iconId: 3 },
        32: { name: "???", unlockAchievement: 32, bossAchievements: [48, 113, 114, 29, 73, 174, 183, 209, 286, 196, 300, 448, 449], iconId: 4 },
        42: { name: "Ева", unlockAchievement: 42, bossAchievements: [44, 53, 112, 76, 111, 169, 184, 210, 288, 197, 302, 450, 451], iconId: 5 },
        67: { name: "Самсон", unlockAchievement: 67, bossAchievements: [56, 55, 115, 54, 74, 177, 185, 211, 287, 198, 301, 452, 453], iconId: 6 },
        80: { name: "Лазарь", unlockAchievement: 80, bossAchievements: [117, 118, 105, 116, 119, 172, 187, 213, 291, 200, 305, 456, 457], iconId: 7 },
        79: { name: "Азазель", unlockAchievement: 79, bossAchievements: [127, 128, 9, 126, 47, 173, 186, 212, 290, 199, 304, 454, 455], iconId: 8 },
        81: { name: "Иден", unlockAchievement: 81, bossAchievements: [122, 123, 125, 121, 124, 176, 188, 214, 289, 201, 303, 458, 459], iconId: 9 },
        82: { name: "Лост", unlockAchievement: 82, bossAchievements: [130, 131, 133, 129, 132, 175, 189, 215, 292, 202, 307, 460, 461], iconId: 10 },
        199: { name: "Лилит", unlockAchievement: 199, bossAchievements: [220, 219, 222, 218, 221, 223, 190, 216, 292, 203, 306, 462, 463], iconId: 11 },
        251: { name: "Хранитель", unlockAchievement: 251, bossAchievements: [237, 238, 240, 236, 239, 241, 191, 217, 294, 204, 308, 464, 465], iconId: 12 },
        340: { name: "Аполион", unlockAchievement: 340, bossAchievements: [311, 312, 314, 310, 313, 318, 315, 317, 295, 316, 309, 466, 467], iconId: 13 },
        390: { name: "Забытый", unlockAchievement: 390, bossAchievements: [394, 395, 397, 393, 396, 392, 398, 403, 401, 399, 400, 468, 469], iconId: 14 },
        404: { name: "Бетани", unlockAchievement: 404, bossAchievements: [418, 419, 421, 417, 420, 416, 423, 427, 425, 422, 424, 470, 471], iconId: 15 },
        405: { name: "Иаков и Исав", unlockAchievement: 405, bossAchievements: [430, 431, 433, 429, 432, 428, 435, 439, 437, 434, 436, 472, 473], iconId: 16 },
        
        // Порченные (Tainted) персонажи
        474: { name: "Порченный Айзек", unlockAchievement: 474, bossAchievements: [548, 618, 601, 584, 541, 549, 491], iconId: 17 },
        475: { name: "Порченная Магдалена", unlockAchievement: 475, bossAchievements: [550, 619, 602, 585, 530, 551, 492], iconId: 18 },
        476: { name: "Порченный Кайн", unlockAchievement: 476, bossAchievements: [552, 620, 603, 586, 543, 553, 493], iconId: 19 },
        477: { name: "Порченный Иуда", unlockAchievement: 477, bossAchievements: [554, 621, 604, 587, 545, 555, 494], iconId: 20 },
        478: { name: "Порченный ???", unlockAchievement: 478, bossAchievements: [556, 622, 605, 588, 528, 557, 495], iconId: 21 },
        479: { name: "Порченная Ева", unlockAchievement: 479, bossAchievements: [558, 623, 606, 589, 527, 559, 496], iconId: 22 },
        480: { name: "Порченный Самсон", unlockAchievement: 480, bossAchievements: [560, 624, 607, 590, 535, 561, 497], iconId: 23 },
        481: { name: "Порченный Азазель", unlockAchievement: 481, bossAchievements: [548, 618, 601, 584, 541, 549, 498], iconId: 24 },
        482: { name: "Порченный Лазарь", unlockAchievement: 482, bossAchievements: [562, 625, 608, 591, 539, 563, 491], iconId: 25 },
        483: { name: "Порченный Иден", unlockAchievement: 483, bossAchievements: [566, 627, 610, 593, 544, 567, 500], iconId: 26 },
        484: { name: "Порченный Лост", unlockAchievement: 484, bossAchievements: [568, 628, 611, 594, 524, 569, 501], iconId: 27 },
        485: { name: "Порченный Лилит", unlockAchievement: 485, bossAchievements: [570, 629, 612, 595, 526, 571, 502], iconId: 28 },
        486: { name: "Порченный Хранитель", unlockAchievement: 486, bossAchievements: [572, 630, 613, 596, 536, 573, 503], iconId: 29 },
        487: { name: "Порченный Аполлион", unlockAchievement: 487, bossAchievements: [574, 631, 614, 597, 540, 575, 504], iconId: 30 },
        488: { name: "Порченный Забытый", unlockAchievement: 488, bossAchievements: [576, 632, 615, 598, 537, 577, 505], iconId: 31 },
        489: { name: "Порченная Бетани", unlockAchievement: 489, bossAchievements: [578, 633, 616, 599, 529, 579, 506], iconId: 32 },
        490: { name: "Порченный Иаков и Исав", unlockAchievement: 490, bossAchievements: [580, 634, 617, 600, 542, 581, 507], iconId: 33 }
    },

    // ID челленджей (все челленджи)
    challengeIds: [
        60, 62, 63, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100, 101, 102, 103, 104, 120,
        224, 225, 226, 227, 228, 229, 230, 231, 233, 234, 331, 332, 333, 334, 335, 517, 518, 519, 520, 521, 522, 531, 532, 533, 538
    ],


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
    ],


    // Единая структура боссов
    bosses: {
        // Обычные боссы
        "Сатана": { 
            name: "Сатана", 
            iconId: 3, 
            achievementIds: [43, 45, 46, 72, 48, 44, 56, 117, 127, 122, 130, 220, 237, 311, 394, 418, 430],
            isTainted: false
        },
        "???": { 
            name: "???", 
            iconId: 4, 
            achievementIds: [49, 50, 75, 113, 53, 55, 118, 128, 123, 131, 219, 238, 312, 395, 419, 431],
            isTainted: false
        },
        "Босс раш": { 
            name: "Босс раш", 
            iconId: 1, 
            achievementIds: [70, 109, 110, 108, 114, 112, 115, 105, 9, 125, 133, 222, 240, 314, 397, 421, 433],
            isTainted: false
        },
        "Айзек": { 
            name: "Айзек", 
            iconId: 2, 
            achievementIds: [106, 20, 21, 107, 29, 76, 54, 116, 126, 121, 129, 218, 236, 310, 393, 417, 429],
            isTainted: false
        },
        "Агнец": { 
            name: "Агнец", 
            iconId: 5, 
            achievementIds: [149, 71, 51, 52, 73, 111, 74, 119, 47, 124, 132, 221, 239, 313, 396, 420, 432],
            isTainted: false
        },
        "Сердце мамы (сложн. режим)": { 
            name: "Сердце мамы (сложн. режим)", 
            iconId: 6, 
            achievementIds: [169, 168, 171, 170, 174, 177, 172, 173, 176, 175, 223, 241, 318, 392, 416, 428],
            isTainted: false
        },
        "Хаш": { 
            name: "Хаш", 
            iconId: 8, 
            achievementIds: [179, 180, 181, 182, 183, 184, 185, 187, 186, 188, 189, 190, 191, 315, 398, 423, 435],
            isTainted: false
        },
        "Мега сатана": { 
            name: "Мега сатана", 
            iconId: 7, 
            achievementIds: [205, 206, 207, 208, 209, 210, 211, 213, 212, 214, 215, 216, 217, 317, 403, 427, 439, 601, 602, 603, 604, 605, 606, 607, 608, 610, 611, 612, 613, 614, 615, 616, 617],
            isTainted: false
        },
        "Делириум": { 
            name: "Делириум", 
            iconId: 13, 
            achievementIds: [282, 283, 284, 285, 286, 288, 287, 291, 290, 289, 292, 294, 295, 401, 425, 437, 584, 585, 586, 587, 588, 589, 590, 591, 592, 593, 594, 595, 596, 597, 598, 599, 600],
            isTainted: false
        },
        "Режим жадности": { 
            name: "Режим жадности", 
            iconId: 10, 
            achievementIds: [192, 193, 194, 195, 196, 197, 198, 200, 199, 201, 202, 203, 204, 316, 399, 422, 434],
            isTainted: false
        },
        "Ультра режим жадности": { 
            name: "Ультра режим жадности", 
            iconId: 9, 
            achievementIds: [296, 297, 298, 299, 300, 302, 301, 305, 304, 303, 307, 306, 308, 309, 400, 424, 436, 541, 530, 543, 545, 528, 527, 535, 539, 544, 524, 526, 536, 540, 537, 529, 542],
            isTainted: false
        },
        "Матерь": { 
            name: "Матерь", 
            iconId: 11, 
            achievementIds: [440, 442, 444, 446, 448, 450, 452, 456, 454, 458, 460, 462, 464, 466, 468, 470, 472, 549, 551, 553, 555, 557, 559, 561, 563, 567, 569, 571, 573, 575, 577, 579, 581],
            isTainted: false
        },
        "Бист": { 
            name: "Бист", 
            iconId: 12, 
            achievementIds: [441, 443, 445, 447, 449, 451, 453, 457, 455, 459, 461, 463, 465, 467, 469, 471, 473, 491, 492, 493, 494, 495, 496, 497, 498, 500, 501, 502, 503, 504, 505, 506, 507],
            isTainted: false
        },
        
        // Порченные персонажи - объединенные достижения
        "Сатана + ??? + Айзек + Агнец": { 
            name: "Сатана + ??? + Айзек + Агнец", 
            iconId: null, 
            achievementIds: [548, 550, 552, 554, 556, 558, 560, 562, 566, 568, 570, 572, 574, 576, 578, 580],
            isTainted: true
        },
        "Босс раш + Хаш": { 
            name: "Босс раш + Хаш", 
            iconId: null, 
            achievementIds: [618, 619, 620, 621, 622, 623, 624, 625, 627, 628, 629, 630, 631, 632, 633, 634],
            isTainted: true
        }
    },

    // Условия для засчитывания "Сердце мамы" у порченных персонажей
    taintedHeartConditions: {
        // Условие 1: Комната вызова + Хаш
        "Комната вызова + Хаш": [618, 619, 620, 621, 622, 623, 624, 625, 627, 628, 629, 630, 631, 632, 633, 634],
        // Условие 2: Сатана + ??? + Айзек + Агнец
        "Сатана + ??? + Айзек + Агнец": [548, 550, 552, 554, 556, 558, 560, 562, 566, 568, 570, 572, 574, 576, 578, 580]
    },


    // Основные боссы для проверки завершенных отметок
    requiredBosses: ['Сатана', '???', 'Босс раш', 'Айзек', 'Агнец', 'Сердце мамы (сложн. режим)', 'Хаш', 'Мега сатана', 'Делириум', 'Режим жадности', 'Ультра режим жадности', 'Матерь', 'Бист'],

    // Данные о челленджах
    challenges: {
        60: { name: "Beans!", unlockCondition: "Изначально открыто", achievementId: 60 },
        62: { name: "The Host", unlockCondition: "Изначально открыто", achievementId: 62 },
        63: { name: "The Family Man", unlockCondition: "Разблокировать Оно живое, собрать первую и вторую часть ключа", achievementId: 63 },
        89: { name: "Pitch Black", unlockCondition: "Изначально открыто", achievementId: 89 },
        90: { name: "High Brow", unlockCondition: "Изначально открыто", achievementId: 90 },
        91: { name: "Head Trauma", unlockCondition: "Изначально открыто", achievementId: 91 },
        92: { name: "Darkness Falls", unlockCondition: "Разблокировать Еву, Оно Живое и Нож для жертвоприношений", achievementId: 92 },
        93: { name: "The Tank", unlockCondition: "Разблокировать Магдалену", achievementId: 93 },
        94: { name: "Solar System", unlockCondition: "Убить Сердце мамы 3 раза", achievementId: 94 },
        95: { name: "Purist", unlockCondition: "Убить маму", achievementId: 95 },
        96: { name: "Cat Got Your Tongue", unlockCondition: "Получить трансформацию Гаппи", achievementId: 96 },
        97: { name: "Demo Man", unlockCondition: "Убить Сердце мамы 9 раз", achievementId: 97 },
        98: { name: "Cursed!", unlockCondition: "Разблокировать Магдалену", achievementId: 98 },
        99: { name: "Glass Cannon", unlockCondition: "Пройти 19 испытание, убить локи, разблокировать Иуду и Оно живое", achievementId: 99 },
        100: { name: "When Life Gives You Lemons", unlockCondition: "Изначально открыто", achievementId: 100 },
        101: { name: "It's in the Cards", unlockCondition: "Изначально открыто", achievementId: 101 },
        102: { name: "Slow Roll", unlockCondition: "Изначально открыто", achievementId: 102 },
        103: { name: "Computer Savvy", unlockCondition: "Изначально открыто", achievementId: 103 },
        104: { name: "Waka Waka", unlockCondition: "Изначально открыто", achievementId: 104 },
        120: { name: "Suicide King", unlockCondition: "Разблокировать Оно живое и Лазаря", achievementId: 120 },
        224: { name: "XXXXXXXXL", unlockCondition: "Убить маму", achievementId: 224 },
        225: { name: "SPEED!", unlockCondition: "Убить маму", achievementId: 225 },
        226: { name: "Blue Bomber", unlockCondition: "Разблокировать Оно живое и взорвать 10 меченых камней", achievementId: 226 },
        227: { name: "PAY TO PLAY", unlockCondition: "Убить Айзека 11 раз за Кайна", achievementId: 227 },
        228: { name: "Have a Heart", unlockCondition: "Убить маму", achievementId: 228 },
        229: { name: "I RULE!", unlockCondition: "Получить Негатив, убить Сатану за Айзека, и убить Мега Сатану", achievementId: 229 },
        230: { name: "BRAINS!", unlockCondition: "Разблокировать Поларойд", achievementId: 230 },
        231: { name: "PRIDE DAY!", unlockCondition: "Убить маму", achievementId: 231 },
        233: { name: "Onan's Streak", unlockCondition: "Разблокировать Оно живое и Иуду", achievementId: 233 },
        234: { name: "The Guardian", unlockCondition: "Убить маму", achievementId: 234 },
        331: { name: "Backasswards", unlockCondition: "Убить Мега Сатану и разблокировать Негатив", achievementId: 331 },
        332: { name: "Aprils Fool", unlockCondition: "Убить маму", achievementId: 332 },
        333: { name: "Pokey Mans", unlockCondition: "Разблокировать Оно живое", achievementId: 333 },
        334: { name: "Ultra Hard", unlockCondition: "Убить Мега Сатану и разблокировать Негатив", achievementId: 334 },
        335: { name: "Pong", unlockCondition: "Разблокировать Поларойд", achievementId: 335 },
        517: { name: "Scat Man", unlockCondition: "Изначально открыто", achievementId: 517 },
        518: { name: "Bloody Mary", unlockCondition: "Разблокироварть Бетанни, Оно живое, Пакет с кровью", achievementId: 518 },
        519: { name: "Baptism by Fire", unlockCondition: "Убить Сатану за Беттани, Агнца за Магдалену, разблокировать Оно живое", achievementId: 519 },
        520: { name: "Isaac's Awakening", unlockCondition: "Убить Матерь", achievementId: 520 },
        521: { name: "Seeing Double", unlockCondition: "Убить Матерь", achievementId: 521 },
        522: { name: "Pica Run", unlockCondition: "Разблокировать Оно живое и Marbles", achievementId: 522 },
        531: { name: "Hot Potato", unlockCondition: "Разблокировать Порченного Забытого", achievementId: 531 },
        532: { name: "Cantripped!", unlockCondition: "Разблокировать Порченного Кайна", achievementId: 532 },
        533: { name: "Red Redemption", unlockCondition: "Разблокировать Иакова и Исава", achievementId: 533 },
        538: { name: "DELETE THIS", unlockCondition: "Разблокировать Порченного Идена", achievementId: 538 }
    }
};

// Экспорт для использования в других файлах
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ISAAC_GAME_DATA;
}
