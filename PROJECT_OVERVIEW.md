# Isaac Save Analyzer Suite - Обзор проекта

## 📁 Структура проекта

### 🎯 Основные парсеры

| Файл | Описание | Версия Isaac | Точность | Особенности |
|------|----------|--------------|----------|-------------|
| `index.html` + `isaac-parser.js` | **Debug Edition** | Repentance | ⭐⭐ | Отладка, hex просмотр, умный поиск |
| `index-improved.html` + `isaac-parser-improved.js` | **Improved Edition** | Universal | ⭐⭐⭐ | Эвристики, двойной анализ |
| `index-repentance.html` + `isaac-parser-repentance.js` | **Repentance Edition** | Repentance | ⭐⭐⭐⭐⭐ | Точные offset'ы, формулы |
| `index-universal.html` + `isaac-parser-universal.js` | **Universal Edition** | All Versions | ⭐⭐⭐⭐ | Официальный код, Kaitai Struct |
| `index-accurate.html` + `isaac-parser-accurate.js` | **Accurate Edition** | Afterbirth+ | ⭐⭐⭐⭐⭐ | Точные offset'ы, C# Save Editor |

### 🚀 Точка входа

| Файл | Назначение |
|------|------------|
| `index-comparison.html` | **Главная страница** - выбор парсера и сравнение |

### 📚 Документация

| Файл | Содержание |
|------|------------|
| `README_FINAL_UPDATED.md` | **Полная документация** - детальное описание всех парсеров |
| `QUICK_START_UPDATED.md` | **Быстрый старт** - руководство за 5 минут |
| `DEBUG_GUIDE.md` | **Руководство по отладке** - использование Debug Edition |
| `FINAL_GUIDE.md` | **Финальное руководство** - обзор всех версий |
| `PROJECT_OVERVIEW.md` | **Этот файл** - обзор структуры проекта |

### 🧪 Тестовые файлы

| Файл | Назначение |
|------|------------|
| `debug-test-save.dat` | Тестовый файл для Debug Edition |
| `IsaacTest/` | Папка с тестовыми файлами |

### 🔬 Исходные коды Save Editor'ов

| Папка | Содержание |
|-------|------------|
| `Test/` | C# Save Editor для Afterbirth+ |
| `Test 2/` | Python Save Editor для Repentance |
| `Test 3 Final/` | Официальный Isaac Save Viewer от Zamiell |

---

## 🎯 Рекомендации по использованию

### Для начинающих:
1. Откройте `index-comparison.html`
2. Выберите **Universal Edition** для максимальной совместимости
3. Загрузите ваш `.dat` файл
4. Изучите результаты

### Для Repentance:
1. Используйте **Repentance Edition** для максимальной точности
2. Или **Universal Edition** для универсальности

### Для Afterbirth+:
1. Используйте **Accurate Edition** для максимальной точности
2. Или **Universal Edition** для универсальности

### Для отладки:
1. Используйте **Debug Edition** для максимальной информации
2. Или **Improved Edition** для сбалансированного подхода

---

## 🔧 Технические детали

### Алгоритмы парсинга:
- **Эвристический**: Поиск паттернов и значений
- **Точный**: Использование известных offset'ов
- **Универсальный**: Адаптация к структуре файла
- **Официальный**: Использование Kaitai Struct декодера

### Поддерживаемые форматы:
- `ISAACNGSAVE09R` - Afterbirth+/Repentance
- `ISAACNGSAVE08R` - Afterbirth
- `ISAACNGSAVE06R` - Rebirth

### Типы данных:
- **Достижения**: 637 (Repentance), 404 (Afterbirth+)
- **Персонажи**: 34 (Repentance), 13 (Afterbirth+)
- **Челленджи**: 45 (Repentance), 30 (Afterbirth+)
- **Предметы**: 732 (Repentance), 442 (Afterbirth+)

---

## 📊 Сравнение парсеров

| Критерий | Debug | Improved | Repentance | Universal | Accurate |
|----------|-------|----------|------------|-----------|----------|
| **Скорость** | ⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **Точность** | ⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **Универсальность** | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐ | ⭐⭐⭐⭐⭐ | ⭐ |
| **Отладка** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐ |
| **Совместимость** | ⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |

---

## 🚀 Быстрый старт

### 1. Локальное использование:
```bash
# Откройте index-comparison.html в браузере
# Выберите подходящий парсер
# Загрузите .dat файл
```

### 2. GitHub Pages:
```bash
# Загрузите файлы в репозиторий
# Включите GitHub Pages
# Откройте index-comparison.html
```

### 3. Тестирование:
```bash
# Используйте debug-test-save.dat для тестирования
# Сравните результаты разных парсеров
# Выберите наиболее точный для ваших файлов
```

---

## 🔗 Полезные ссылки

- [Официальный Isaac Save Viewer](https://zamiell.github.io/isaac-save-viewer/)
- [Isaac Wiki](https://bindingofisaacrebirth.wiki.gg/)
- [Kaitai Struct](https://kaitai.io/)

---

## 📝 Лицензия

MIT License - свободное использование и модификация.

---

**Создано с ❤️ для сообщества The Binding of Isaac**

*Последнее обновление: 2024*
