// Пример использования Isaac Save Editor
// Этот файл показывает, как можно использовать парсер и редактор

const fs = require('fs');
const path = require('path');

// Импортируем классы (в реальном проекте используйте import)
// const { IsaacBinaryParser } = require('./dist/parser/isaacBinaryParser');
// const { IsaacSaveEditor } = require('./dist/editor/saveEditor');

console.log('Isaac Save Editor - Пример использования');
console.log('==========================================');

// Пример 1: Чтение файла сохранения
function readSaveFile(filePath) {
    try {
        console.log(`\nЧтение файла: ${filePath}`);
        
        if (!fs.existsSync(filePath)) {
            console.log('❌ Файл не найден');
            return null;
        }

        const fileBuffer = fs.readFileSync(filePath);
        console.log(`✅ Файл прочитан (${fileBuffer.length} байт)`);
        
        // В реальном проекте:
        // const parser = new IsaacBinaryParser(fileBuffer);
        // const saveData = parser.parse();
        // return saveData;
        
        console.log('📊 Данные сохранения (симуляция):');
        console.log('- Имя игрока: TestPlayer');
        console.log('- Монеты: 99');
        console.log('- Бомбы: 5');
        console.log('- Ключи: 3');
        console.log('- Побед: 15');
        console.log('- Смертей: 42');
        
        return {
            playerName: 'TestPlayer',
            coins: 99,
            bombs: 5,
            keys: 3,
            stats: {
                wins: 15,
                deaths: 42
            }
        };
        
    } catch (error) {
        console.error('❌ Ошибка при чтении файла:', error.message);
        return null;
    }
}

// Пример 2: Редактирование сохранения
function editSaveData(saveData) {
    if (!saveData) {
        console.log('❌ Нет данных для редактирования');
        return;
    }

    console.log('\n🔧 Редактирование сохранения:');
    
    // В реальном проекте:
    // const editor = new IsaacSaveEditor(saveData);
    // editor.setCoins(999);
    // editor.setBombs(99);
    // editor.setKeys(99);
    // editor.unlockCharacter(1); // Magdalene
    // editor.unlockAchievement(1);
    
    console.log('✅ Монеты установлены: 999');
    console.log('✅ Бомбы установлены: 99');
    console.log('✅ Ключи установлены: 99');
    console.log('✅ Персонаж Magdalene разблокирован');
    console.log('✅ Достижение #1 разблокировано');
}

// Пример 3: Экспорт в JSON
function exportToJSON(saveData) {
    if (!saveData) {
        console.log('❌ Нет данных для экспорта');
        return;
    }

    console.log('\n📤 Экспорт в JSON:');
    
    const jsonData = JSON.stringify(saveData, null, 2);
    const outputPath = 'save_data_export.json';
    
    try {
        fs.writeFileSync(outputPath, jsonData);
        console.log(`✅ Данные экспортированы в: ${outputPath}`);
    } catch (error) {
        console.error('❌ Ошибка при экспорте:', error.message);
    }
}

// Запуск примера
function runExample() {
    console.log('🚀 Запуск примера...\n');
    
    // Путь к файлу сохранения (замените на реальный путь)
    const saveFilePath = 'C:\\Users\\[Ваше имя]\\Documents\\My Games\\Binding of Isaac Rebirth\\persistentgamedata1.dat';
    
    // Читаем файл сохранения
    const saveData = readSaveFile(saveFilePath);
    
    // Редактируем данные
    editSaveData(saveData);
    
    // Экспортируем в JSON
    exportToJSON(saveData);
    
    console.log('\n✨ Пример завершен!');
    console.log('\nДля полной функциональности:');
    console.log('1. Запустите сервер: npm start');
    console.log('2. Откройте http://localhost:3000');
    console.log('3. Загрузите файл сохранения через веб-интерфейс');
}

// Запускаем пример
runExample();
