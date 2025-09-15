# Isaac Save Analyzer Suite

## 🌟 5 парсеров для анализа файлов сохранения The Binding of Isaac

Этот проект предоставляет **5 различных парсеров** для анализа файлов сохранения Isaac, каждый оптимизирован для определенных версий игры.

[![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-Live-brightgreen)](https://your-username.github.io/isaac-save-analyzer/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

## 🚀 Быстрый старт

1. Откройте `index-comparison.html` в браузере
2. Выберите подходящий парсер:
   - **Universal Edition** - для всех версий (рекомендуется)
   - **Repentance Edition** - для Repentance файлов
   - **Accurate Edition** - для Afterbirth+ файлов
   - **Improved Edition** - для универсального использования
   - **Debug Edition** - для отладки
3. Загрузите ваш `.dat` файл сохранения
4. Изучите результаты!

---

## 📊 Поддерживаемые версии

| Версия Isaac | Рекомендуемый парсер |
|--------------|---------------------|
| **Repentance** | Repentance Edition |
| **Afterbirth+** | Accurate Edition |
| **Afterbirth/Rebirth** | Universal Edition |

---

## 🎯 Основные функции

- ✅ **Анализ прогресса**: Достижения, персонажи, челленджи, предметы
- ✅ **Детальная статистика**: Смерти, убийства Mom, серии побед
- ✅ **Визуализация данных**: Прогресс-бары, цветовая индикация
- ✅ **Экспорт результатов**: JSON формат с детальной статистикой

---

## 🔧 Технические особенности

- **5 алгоритмов парсинга**: Эвристический, точный, универсальный, официальный
- **Поддержка всех версий**: Rebirth, Afterbirth, Afterbirth+, Repentance
- **Автоматическое определение**: Версии игры и структуры файла
- **Hex просмотр**: Детальный анализ бинарных данных

---

## 📁 Структура проекта

```
isaac-save-analyzer/
├── index-comparison.html          # Главная страница
├── index-universal.html           # Universal Edition
├── index-repentance.html          # Repentance Edition
├── index-accurate.html            # Accurate Edition
├── index-improved.html            # Improved Edition
├── index.html                     # Debug Edition
├── isaac-parser-*.js              # Парсеры
├── README_FINAL_UPDATED.md        # Полная документация
└── QUICK_START_UPDATED.md         # Быстрый старт
```

---

## 🎮 Использование

### Для Repentance:
1. Выберите **Repentance Edition**
2. Загрузите `rep+persistentgamedata1.dat`

### Для Afterbirth+:
1. Выберите **Accurate Edition**
2. Загрузите `persistentgamedata1.dat`

### Для любых версий:
1. Выберите **Universal Edition**
2. Загрузите любой `.dat` файл

---

## 🔍 Сравнение парсеров

| Парсер | Версия | Точность | Универсальность |
|--------|--------|----------|-----------------|
| **Universal** | All | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **Repentance** | Repentance | ⭐⭐⭐⭐⭐ | ⭐ |
| **Accurate** | Afterbirth+ | ⭐⭐⭐⭐⭐ | ⭐ |
| **Improved** | All | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **Debug** | Repentance | ⭐⭐ | ⭐⭐⭐ |

---

## 📚 Документация

- [Полная документация](README_FINAL_UPDATED.md)
- [Быстрый старт](QUICK_START_UPDATED.md)
- [Обзор проекта](PROJECT_OVERVIEW.md)

---

## 🤝 Вклад в проект

Мы приветствуем вклад в развитие! Создайте Issue или Pull Request.

---

## 📄 Лицензия

MIT License - свободное использование и модификация.

---

**Создано с ❤️ для сообщества The Binding of Isaac**
