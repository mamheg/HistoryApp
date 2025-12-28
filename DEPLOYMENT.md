# Деплой проекта History Coffee

## Архитектура деплоя

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   Vercel        │     │   Render        │     │   Render        │
│   (Frontend)    │────▶│   (Backend)     │────▶│   (Bot)         │
│   React + Vite  │ API │   FastAPI       │     │   aiogram       │
└─────────────────┘     └─────────────────┘     └─────────────────┘
                              │
                              ▼
                       ┌─────────────────┐
                       │   PostgreSQL    │
                       │   (Render DB)   │
                       └─────────────────┘
```

---

## 1. Деплой фронтенда на Vercel

### Шаг 1: Установить Vercel CLI
```bash
npm i -g vercel
```

### Шаг 2: Собрать фронтенд
```bash
npm install
npm run build
```

### Шаг 3: Задеплоить
```bash
vercel
```

### Настройки в Vercel:
- **Framework Preset**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

### После деплоя:
1. Скопируйте URL фронтенда (например: `https://history-coffee.vercel.app`)
2. Обновите `MINI_APP_URL` в `bot/config.py`

---

## 2. Деплой бэкенда на Render

### Вариант A: Через веб-интерфейс Render

1. Перейдите на [render.com](https://render.com)
2. Создайте **New Web Service**
3. Подключите ваш GitHub репозиторий
4. Настройки:

   ```
   Name: history-coffee-api
   Environment: Python 3
   Region: Frankfurt (или близкий к вам)
   Branch: main

   Build Command: pip install -r requirements.txt
   Start Command: uvicorn main:app --host 0.0.0.0 --port $PORT

   Environment Variables:
   - DATABASE_URL: (создайте PostgreSQL базу в Render)
   ```

5. После деплоя скопируйте URL (например: `https://history-coffee-api.onrender.com`)

### Вариант B: Через render.yaml
```bash
# Установите Render CLI
npm i -g @render/cli

# Деплой
render deploy
```

---

## 3. Деплой бота на Render

### Создайте Worker Service (не Web Service!)

1. В Render создайте **New Worker Service**
2. Настройки:

   ```
   Name: history-coffee-bot
   Environment: Python 3
   Branch: main

   Build Command: cd bot && pip install -r requirements.txt
   Start Command: cd bot && python main.py

   Environment Variables:
   - BOT_TOKEN: ваш_токен_от_BotFather
   ```

**Важно**: Используйте Worker Service, а не Web Service - бот должен работать постоянно.

---

## 4. Настройка Telegram Mini App

### Шаг 1: BotFather

1. Откройте [@BotFather](https://t.me/BotFather)
2. `/mybots` → выберите бота
3. `Bot Settings` → `Menu Button` → `Configure Menu Button`

```
Button Text: ☕ Меню
Web App URL: https://history-coffee.vercel.app
```

4. `Bot Settings` → `Menu Button` → `Configure Menu Button`

### Шаг 2: Проверьте работоспособность

1. Откройте бота в Telegram
2. Нажмите кнопку меню или `/start`
3. Должно открыться мини-приложение

---

## 5. Обновление переменных окружения

### В `bot/config.py`:

```python
# Обновите после деплоя
MINI_APP_URL = "https://your-app.vercel.app"

# Для бэкенда
BACKEND_URL = "https://your-api.onrender.com"
```

### В фронтенде (`services/api.ts` или где там API calls):

```typescript
const API_BASE_URL = "https://your-api.onrender.com/api";
```

---

## 6. Бесплатные лимиты (на 2025 год)

| Сервис | Бесплатный тариф | Ограничения |
|---------|------------------|-------------|
| **Vercel** | Hobby | 100GB bandwidth/мес |
| **Render** | Free | 750 часов/мес (1 сервис постоянно) |
| **PostgreSQL** | Render | 90 дней после этого спит |
| **Telegram Bot API** | - | Почти не ограничен для малого бизнеса |

---

## 7. Мониторинг

### Vercel:
- https://vercel.com/dashboard → ваш проект
- Логи, метрики, деплои

### Render:
- https://dashboard.render.com → ваш сервис
- Логи: `Logs` вкладка
- Метрики: `Metrics` вкладка

### Логи бота:
В Render логи бота доступны в реальном времени:
```
2025-12-28 12:34:56 - bot - INFO - New order detected: ORD-1234
2025-12-28 12:35:01 - bot - INFO - Notification sent for order ORD-1234
```

---

## 8. Troubleshooting

### Бот не отвечает
- Проверьте `BOT_TOKEN` в environment variables
- Посмотрите логи в Render
- Убедитесь, что Worker Service запущен (не остановлен)

### Mini App не открывается
- Проверьте URL в BotFather
- Убедитесь, что фронтенд задеплоен на Vercel
- Проверьте CORS в бэкенде

### Уведомления о заказах не приходят
- Проверьте, что бот видит базу данных (`DB_PATH` в config.py)
- Если база на PostgreSQL, обновите `database.py` для работы с PostgreSQL
- Проверьте логи: должно быть "New order detected"

---

## 9. Быстрый старт (если всё уже настроено)

```bash
# 1. Изменения в коде
git add .
git commit -m "Update bot"
git push

# 2. Vercel автоматически задеплоит фронтенд
# 3. Render автоматически задеплоит бэкенд и бота (если autoDeploy: true)
```

---

## 10. Альтернативы Render

Если Render не подходит:

| Сервис | Бэкенд | Бот | Цена |
|--------|--------|-----|------|
| **Railway** | ✅ | ✅ | $5/мес |
| **Heroku** | ✅ | ✅ | $5/мес |
| **Fly.io** | ✅ | ✅ | Бесплатно ~$3 |
| **Zeabur** | ✅ | ✅ | $5/мес |

### Railway пример:
```bash
# Установить CLI
npm i -g @railway/cli

# Login
railway login

# Деплой бота
railway up
```

---

## Контакты для помощи

- Vercel Support: https://vercel.com/support
- Render Support: https://render.com/support
- aiogram Telegram: https://t.me/aiogram_ru
