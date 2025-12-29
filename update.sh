#!/bin/bash
# update.sh - Обновление кода без потери базы данных и публичных файлов
# Использование: ./update.sh

echo "🔄 Обновление History-front..."

# Сохраняем важные файлы
echo "📦 Сохраняем базу данных и public..."
cp -r public /tmp/history_public_backup 2>/dev/null || true
cp history.db /tmp/history_db_backup 2>/dev/null || true

# Получаем обновления
echo "⬇️ Получаем код из GitHub..."
git fetch origin
git reset --hard origin/main

# Восстанавливаем важные файлы
echo "📥 Восстанавливаем базу данных и public..."
cp /tmp/history_db_backup history.db 2>/dev/null || true
cp -r /tmp/history_public_backup/* public/ 2>/dev/null || true

# Очищаем временные файлы
rm -rf /tmp/history_public_backup /tmp/history_db_backup 2>/dev/null || true

# Пересборка фронтенда
echo "🔨 Пересборка фронтенда..."
npm run build

echo "✅ Готово! Перезапустите сервер: python backend/main.py"
