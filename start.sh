#!/bin/bash

echo "Isaac Save Editor - Запуск сервера"
echo

echo "Установка зависимостей..."
npm install

echo
echo "Сборка проекта..."
npm run build

echo
echo "Запуск сервера..."
echo "Откройте http://localhost:3000 в браузере"
echo
npm start
