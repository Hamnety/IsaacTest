// Isaac Items Data - Based on tboi.com/repentance
// Данные о предметах Repentance с сайта tboi.com

const ISAAC_ITEMS_DATA = {
    // Repentance Items (173 items from tboi.com)
    repentance: {
        263: { name: "Clear Rune", quality: 2, type: "Active", description: "Rune mimic", pool: "Secret Room, Crane Game" },
        553: { name: "Mucormycosis", quality: 3, type: "Passive", description: "Spore shot", pool: "Item Room" },
        554: { name: "2Spooky", quality: 1, type: "Passive", description: "4me", pool: "Devil Room" },
        555: { name: "Golden Razor", quality: 1, type: "Active", description: "Pain from gain", pool: "Item Room, Greed Mode Item Room" },
        556: { name: "Sulfur", quality: 2, type: "Active", description: "Temporary demon form", pool: "Devil Room" },
        557: { name: "Fortune Cookie", quality: 2, type: "Active", description: "Reusable fortunes", pool: "Item Room" },
        558: { name: "Eye Sore", quality: 1, type: "Passive", description: "More eyes", pool: "Item Room" },
        559: { name: "120 Volt", quality: 2, type: "Passive", description: "Zap!", pool: "Item Room" },
        560: { name: "It Hurts", quality: 1, type: "Passive", description: "No it doesn't...", pool: "Item Room" },
        561: { name: "Almond Milk", quality: 1, type: "Passive", description: "DMG down + tears up + you feel nutty", pool: "Item Room" },
        562: { name: "Rock Bottom", quality: 3, type: "Passive", description: "It's only up from there", pool: "Secret Room" },
        563: { name: "Nancy Bombs", quality: 2, type: "Passive", description: "Random blast +5 bombs", pool: "Item Room" },
        564: { name: "A Bar of Soap", quality: 3, type: "Passive", description: "Tears + shot speed up", pool: "Boss Room" },
        565: { name: "Blood Puppy", quality: 1, type: "Passive", description: "What a cute little thing!", pool: "Item Room, Red Chest, Curse Room" },
        566: { name: "Dream Catcher", quality: 2, type: "Passive", description: "Sweet dreams", pool: "Shop" },
        567: { name: "Paschal Candle", quality: 3, type: "Passive", description: "Keep the flame burning", pool: "Angel Room" },
        568: { name: "Divine Intervention", quality: 2, type: "Passive", description: "Double tap shield", pool: "Angel Room" },
        569: { name: "Blood Oath", quality: 2, type: "Passive", description: "Blood for blood", pool: "Devil Room" },
        570: { name: "Playdough Cookie", quality: 1, type: "Passive", description: "Rainbow tears", pool: "Item Room" },
        571: { name: "Soul of Isaac", quality: 3, type: "Active", description: "Soul of Isaac", pool: "Special" },
        572: { name: "Soul of Magdalene", quality: 3, type: "Active", description: "Soul of Magdalene", pool: "Special" },
        573: { name: "Soul of Cain", quality: 3, type: "Active", description: "Soul of Cain", pool: "Special" },
        574: { name: "Soul of Judas", quality: 3, type: "Active", description: "Soul of Judas", pool: "Special" },
        575: { name: "Soul of ???", quality: 3, type: "Active", description: "Soul of ???", pool: "Special" },
        576: { name: "Soul of Eve", quality: 3, type: "Active", description: "Soul of Eve", pool: "Special" },
        577: { name: "Soul of Samson", quality: 3, type: "Active", description: "Soul of Samson", pool: "Special" },
        578: { name: "Soul of Azazel", quality: 3, type: "Active", description: "Soul of Azazel", pool: "Special" },
        579: { name: "Soul of Lazarus", quality: 3, type: "Active", description: "Soul of Lazarus", pool: "Special" },
        580: { name: "Soul of Eden", quality: 3, type: "Active", description: "Soul of Eden", pool: "Special" },
        581: { name: "Soul of the Lost", quality: 3, type: "Active", description: "Soul of the Lost", pool: "Special" },
        582: { name: "Soul of Lilith", quality: 3, type: "Active", description: "Soul of Lilith", pool: "Special" },
        583: { name: "Soul of the Keeper", quality: 3, type: "Active", description: "Soul of the Keeper", pool: "Special" },
        584: { name: "Soul of Apollyon", quality: 3, type: "Active", description: "Soul of Apollyon", pool: "Special" },
        585: { name: "Soul of the Forgotten", quality: 3, type: "Active", description: "Soul of the Forgotten", pool: "Special" },
        586: { name: "Soul of Bethany", quality: 3, type: "Active", description: "Soul of Bethany", pool: "Special" },
        587: { name: "Soul of Jacob and Esau", quality: 3, type: "Active", description: "Soul of Jacob and Esau", pool: "Special" }
    },
    
    // Item categories
    categories: {
        active: { name: "Активные предметы", color: "#f38ba8", icon: "⚡" },
        passive: { name: "Пассивные предметы", color: "#a6e3a1", icon: "💎" },
        trinket: { name: "Брелки", color: "#fab387", icon: "🔑" },
        special: { name: "Специальные предметы", color: "#cba6f7", icon: "⭐" }
    },
    
    // Quality levels
    qualities: {
        0: { name: "Quality 0", color: "#6c7086", description: "Плохое качество" },
        1: { name: "Quality 1", color: "#a6adc8", description: "Низкое качество" },
        2: { name: "Quality 2", color: "#a6e3a1", description: "Хорошее качество" },
        3: { name: "Quality 3", color: "#74c7ec", description: "Отличное качество" },
        4: { name: "Quality 4", color: "#cba6f7", description: "Легендарное качество" }
    },
    
    // Item pools
    pools: {
        "Item Room": { name: "Комната предметов", color: "#a6e3a1" },
        "Devil Room": { name: "Комната дьявола", color: "#f38ba8" },
        "Angel Room": { name: "Ангельская комната", color: "#74c7ec" },
        "Secret Room": { name: "Секретная комната", color: "#fab387" },
        "Shop": { name: "Магазин", color: "#cba6f7" },
        "Boss Room": { name: "Комната босса", color: "#e78284" },
        "Special": { name: "Специальный", color: "#f5c2e7" },
        "Greed Mode Item Room": { name: "Комната предметов (Жадность)", color: "#a6e3a1" },
        "Red Chest": { name: "Красный сундук", color: "#f38ba8" },
        "Curse Room": { name: "Проклятая комната", color: "#e78284" }
    }
};

// Helper functions
function getItemData(itemId) {
    // Check Repentance items first
    if (ISAAC_ITEMS_DATA.repentance[itemId]) {
        return ISAAC_ITEMS_DATA.repentance[itemId];
    }
    
    // Fallback for unknown items
    return {
        name: `Item ${itemId}`,
        quality: 1,
        type: getItemType(itemId),
        description: "Unknown item",
        pool: "Unknown"
    };
}

function getItemType(itemId) {
    if (itemId >= 571 && itemId <= 587) return "Active"; // Soul items
    if (itemId >= 263 && itemId <= 570) return "Passive"; // Repentance items
    if (itemId <= 100) return "Active";
    if (itemId <= 300) return "Passive";
    if (itemId <= 400) return "Trinket";
    return "Special";
}

function getItemQuality(quality) {
    return ISAAC_ITEMS_DATA.qualities[quality] || ISAAC_ITEMS_DATA.qualities[1];
}

function getItemPool(pool) {
    return ISAAC_ITEMS_DATA.pools[pool] || { name: pool, color: "#a6adc8" };
}

function getItemCategory(type) {
    return ISAAC_ITEMS_DATA.categories[type] || { name: type, color: "#a6adc8", icon: "❓" };
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ISAAC_ITEMS_DATA;
}
