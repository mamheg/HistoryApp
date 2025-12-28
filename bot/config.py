import os
from dotenv import load_dotenv

load_dotenv()

BOT_TOKEN = os.getenv("BOT_TOKEN", "YOUR_BOT_TOKEN_HERE")

# Admin IDs from the main app
ADMIN_IDS = [1962824399, 937710441]

# Database configuration
# Supports both SQLite (local) and PostgreSQL (Render/production)
DATABASE_URL = os.getenv("DATABASE_URL")

# Database path (relative to bot directory) - fallback for local SQLite
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DB_PATH = os.path.join(BASE_DIR, "backend", "hoffee.db")

# Payment link (placeholder - can be replaced with real payment service)
PAYMENT_LINK_TEMPLATE = "https://historycoffee.payment/order/{order_id}"

# Mini App URL - update after Vercel deploy
MINI_APP_URL = os.getenv("MINI_APP_URL", "https://t.me/HistoryCoffeeBot/app")

# Backend API URL - update after Render deploy
BACKEND_URL = os.getenv("BACKEND_URL", "http://localhost:4000")
