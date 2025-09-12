@echo off
echo Isaac Save Editor - Запуск сервера
echo.

echo Установка зависимостей...
call npm install

echo.
echo Сборка проекта...
call npm run build

echo.
echo Запуск сервера...
echo Откройте http://localhost:3000 в браузере
echo.
call npm start

pause
