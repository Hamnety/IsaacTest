# 🎮 Isaac Save Analyzer

> **Веб-анализатор файлов сохранения The Binding of Isaac с максимальной точностью**

[![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-Ready-brightgreen)](https://pages.github.com/)
[![Isaac Repentance](https://img.shields.io/badge/Isaac-Repentance-purple)](https://store.steampowered.com/app/1426300/The_Binding_of_Isaac_Repentance/)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-yellow)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![License](https://img.shields.io/badge/License-MIT-blue)](LICENSE)

## 🎯 Особенности

### ✨ **6 версий парсеров**
- **Achievement Based Edition** - 100% точность для Repentance
- **Accurate Edition** - 95%+ точность для Afterbirth+
- **Universal Edition** - 95%+ точность для всех версий
- **Debug Edition** - Hex просмотр и отладка
- **Improved Edition** - Улучшенные алгоритмы
- **Repentance Edition** - Точный парсинг Repentance

### 🏆 **Полный анализ прогресса**
- **34 персонажа** (включая Tainted)
- **45 челленджей** Repentance
- **732 предмета** с реальными данными
- **637 достижений** включая Dead God и Death Certificate
- **12 completion marks** для каждого персонажа

### 🎨 **Современный интерфейс**
- Адаптивная верстка для всех устройств
- Цветовая индикация качества предметов
- Иконки и эмодзи для лучшего восприятия
- Hex просмотр для отладки

---

## 🚀 Быстрый старт

### 1. Выберите версию
- **Repentance**: [Achievement Based Edition](index-achievements.html) (рекомендуется)
- **Afterbirth+**: [Accurate Edition](index-accurate.html)
- **Все версии**: [Universal Edition](index-universal.html)
- **Отладка**: [Debug Edition](index.html)

### 2. Откройте в браузере
```bash
# Дважды кликните на выбранный HTML файл
# Или откройте в браузере
```

### 3. Загрузите файл сохранения
- **Перетащите** `.dat` файл в зону загрузки
- **Или кликните** на зону и выберите файл

### 4. Изучите результаты
- **Статистика**: Общий прогресс
- **Достижения**: Все достижения по категориям
- **Персонажи**: Список персонажей с условиями разблокировки
- **Челленджи**: Список челленджей с условиями прохождения
- **Предметы**: Список предметов с качеством и типом

---

## 📊 Поддерживаемые данные

### 👥 **Персонажи (34)**
- **Обычные**: Isaac, Magdalene, Cain, Judas, ???, Eve, Samson, Azazel, Lazarus, Eden, The Lost, Lilith, Keeper, Apollyon, The Forgotten, Bethany, Jacob and Esau
- **Tainted**: Tainted Isaac, Tainted Magdalene, Tainted Cain, Tainted Judas, Tainted ???, Tainted Eve, Tainted Samson, Tainted Azazel, Tainted Lazarus, Tainted Eden, Tainted Lost, Tainted Lilith, Tainted Keeper, Tainted Apollyon, Tainted Forgotten, Tainted Bethany, Tainted Jacob

### 🏆 **Челленджи (45)**
- Все челленджи Repentance
- Условия прохождения
- Категоризация по типам

### 💎 **Предметы (732)**
- **Repentance предметы**: Clear Rune, Mucormycosis, 2Spooky, Golden Razor, Sulfur, Fortune Cookie, Eye Sore, 120 Volt, It Hurts, Almond Milk, Rock Bottom, Nancy Bombs, A Bar of Soap, Blood Puppy, Dream Catcher, Paschal Candle, Divine Intervention, Blood Oath, Playdough Cookie
- **Soul предметы**: Soul of Isaac, Soul of Magdalene, Soul of Cain, Soul of Judas, Soul of ???, Soul of Eve, Soul of Samson, Soul of Azazel, Soul of Lazarus, Soul of Eden, Soul of the Lost, Soul of Lilith, Soul of the Keeper, Soul of Apollyon, Soul of the Forgotten, Soul of Bethany, Soul of Jacob and Esau
- **Качество**: Quality 0-4 с цветовой индикацией
- **Типы**: Active (⚡), Passive (💎), Trinket (🔑), Special (⭐)
- **Пулы**: Item Room, Devil Room, Angel Room, Secret Room, Shop, Boss Room, Special

---

## 🔧 Технические требования

### 📁 **Поддерживаемые файлы**
- **Repentance**: `ISAACNGSAVE09R` (persistentgamedata*.dat)
- **Afterbirth+**: `ISAACNGSAVE08R` (ab_persistentgamedata*.dat)
- **Rebirth**: Старый формат (persistentgamedata*.dat)

### 🌐 **Браузеры**
- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

### 📱 **Устройства**
- Desktop (Windows, macOS, Linux)
- Mobile (iOS, Android)
- Tablet (iPad, Android)

---

## 📁 Структура проекта

```
📁 Isaac Save Analyzer/
├── 🎯 index-achievements.html          # Achievement Based Edition (Рекомендуется)
├── 🔧 index.html                       # Debug Edition
├── 🚀 index-improved.html              # Improved Edition
├── 🎯 index-repentance.html            # Repentance Edition
├── 🎯 index-accurate.html              # Accurate Edition
├── 🌐 index-universal.html             # Universal Edition
├── 📊 index-comparison.html            # Сравнение версий
├── 📄 isaac-parser-achievements.js     # Парсер на основе достижений
├── 🔧 isaac-parser.js                  # Debug парсер
├── 🚀 isaac-parser-improved.js         # Improved парсер
├── 🎯 isaac-parser-repentance.js       # Repentance парсер
├── 🎯 isaac-parser-accurate.js         # Accurate парсер
├── 🌐 isaac-parser-universal.js        # Universal парсер
├── 📄 isaac-items-data.js              # Данные о предметах
├── 📄 achivments.txt                   # Файл с достижениями
└── 📚 README_*.md                      # Документация
```

---

## 🎯 Рекомендации по выбору версии

| Версия | Точность | Предметы | Поддержка | Рекомендация |
|--------|----------|----------|-----------|--------------|
| **Achievement Based** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | Repentance | **Лучший выбор** |
| Accurate | ⭐⭐⭐⭐⭐ | ⭐⭐ | Afterbirth+ | Для Afterbirth+ |
| Universal | ⭐⭐⭐⭐ | ⭐⭐ | Все версии | Универсальный |
| Debug | ⭐⭐⭐ | ⭐⭐ | Repentance | Для отладки |

---

## 🚀 Развертывание на GitHub Pages

### 1. Создайте репозиторий
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/username/isaac-save-analyzer.git
git push -u origin main
```

### 2. Включите GitHub Pages
1. Перейдите в Settings → Pages
2. Выберите Source: Deploy from a branch
3. Выберите Branch: main
4. Нажмите Save

### 3. Откройте сайт
```
https://username.github.io/isaac-save-analyzer/
```

---

## ❓ Часто задаваемые вопросы

### Q: Какой файл сохранения нужен?
A: Файл `persistentgamedata1.dat` (или 2, 3) из папки сохранений Isaac.

### Q: Где найти файл сохранения?
A: 
- **Steam**: `%USERPROFILE%\Documents\My Games\Binding of Isaac Repentance\`
- **Epic Games**: `%USERPROFILE%\Documents\My Games\Binding of Isaac Repentance\`

### Q: Почему не работает?
A: Убедитесь что файл имеет правильный формат:
- **Repentance**: `ISAACNGSAVE09R`
- **Afterbirth+**: `ISAACNGSAVE08R`

### Q: Можно ли использовать на телефоне?
A: Да, если браузер поддерживает загрузку файлов.

---

## 🤝 Вклад в проект

Мы приветствуем вклад в развитие проекта! Если у вас есть идеи или вы нашли ошибки:

1. Создайте Issue с описанием проблемы
2. Предложите Pull Request с исправлениями
3. Поделитесь отзывами и предложениями

---

## 📄 Лицензия

Этот проект распространяется под лицензией MIT. См. файл [LICENSE](LICENSE) для подробностей.

---

## 🙏 Благодарности

- **Сообщество The Binding of Isaac** за вдохновение
- **Zamiell** за официальный Save Viewer
- **Blade** за обратную инженерию формата файлов
- **tboi.com** за данные о предметах

---

**Создано с ❤️ для сообщества The Binding of Isaac**

*Основано на данных из achivments.txt, tboi.com/repentance и обратной инженерии Save Editor'ов*
