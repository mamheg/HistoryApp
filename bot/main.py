import asyncio
import logging
from aiogram import Bot, Dispatcher
from aiogram.client.default import DefaultBotProperties
from aiogram.enums import ParseMode
from bot.config import BOT_TOKEN
from bot.handlers import get_handlers_router
from bot.handlers.orders import send_order_notification
from bot.database import get_pending_orders


# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


class OrderMonitor:
    """Monitor database for new orders and send notifications."""

    def __init__(self, bot: Bot, check_interval: int = 5):
        self.bot = bot
        self.check_interval = check_interval
        self.known_orders = set()
        self.running = False

    async def load_existing_orders(self):
        """Load existing order IDs to avoid duplicate notifications."""
        try:
            orders = get_pending_orders()
            self.known_orders = {order['id'] for order in orders}
            logger.info(f"Loaded {len(self.known_orders)} existing orders")
        except Exception as e:
            logger.error(f"Error loading existing orders: {e}")

    async def check_new_orders(self):
        """Check for new orders and send notifications."""
        try:
            orders = get_pending_orders()

            for order in orders:
                order_id = order['id']

                if order_id not in self.known_orders:
                    logger.info(f"New order detected: {order_id}")

                    order_data = {
                        'items_summary': order['items_summary'],
                        'total_price': order['total_price'],
                        'pickup_time': order.get('pickup_time')
                    }

                    await send_order_notification(
                        order['user_id'],
                        self.bot,
                        order_id,
                        order_data
                    )
                    self.known_orders.add(order_id)

        except Exception as e:
            logger.error(f"Error checking for new orders: {e}")

    async def start(self):
        """Start the order monitor."""
        self.running = True
        await self.load_existing_orders()

        while self.running:
            await self.check_new_orders()
            await asyncio.sleep(self.check_interval)

    def stop(self):
        """Stop the order monitor."""
        self.running = False


async def main():
    """Main function to start the bot."""
    if BOT_TOKEN == "YOUR_BOT_TOKEN_HERE":
        logger.error("BOT_TOKEN not set! Please set it in config.py or .env file")
        return

    # Create bot instance
    bot = Bot(
        token=BOT_TOKEN,
        default=DefaultBotProperties(parse_mode=ParseMode.HTML)
    )

    # Create dispatcher
    dp = Dispatcher()

    # Register handlers
    dp.include_router(get_handlers_router())

    # Start order monitor in background
    monitor = OrderMonitor(bot, check_interval=5)

    # Create background task for monitor
    monitor_task = asyncio.create_task(monitor.start())

    logger.info("🤖 Bot started. History Coffee bot is running...")

    # Start polling
    try:
        await dp.start_polling(bot)
    finally:
        monitor.stop()
        monitor_task.cancel()
        await bot.session.close()


if __name__ == "__main__":
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        logger.info("Bot stopped by user")
    except Exception as e:
        logger.error(f"Bot error: {e}")
