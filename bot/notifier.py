"""
Standalone script for sending order notifications via HTTP.
This can be called from the FastAPI backend when order is created.

Usage in FastAPI backend:
    import subprocess
    subprocess.run(['python', 'bot/notifier.py', order_id])

Or better - integrate directly into the backend using aiogram's bot instance.
"""

import asyncio
import sys
from aiogram import Bot
from bot.config import BOT_TOKEN
from bot.database import get_order
from bot.handlers.orders import send_order_notification


async def notify_order(order_id: str):
    """Send notification for specific order."""
    bot = Bot(token=BOT_TOKEN)

    order = get_order(order_id)
    if not order:
        print(f"Order {order_id} not found")
        return

    order_data = {
        'items_summary': order['items_summary'],
        'total_price': order['total_price'],
        'pickup_time': order.get('pickup_time')
    }

    await send_order_notification(order['user_id'], bot, order_id, order_data)
    await bot.session.close()
    print(f"Notification sent for order {order_id}")


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python notifier.py ORDER_ID")
        sys.exit(1)

    order_id = sys.argv[1]
    asyncio.run(notify_order(order_id))
