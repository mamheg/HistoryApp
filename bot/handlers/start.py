from aiogram import Router
from aiogram.types import Message
from aiogram.filters import CommandStart, Command
from bot.database import create_user_if_not_exists
from bot.keyboards import get_welcome_keyboard


router = Router()


@router.message(CommandStart())
async def cmd_start(message: Message):
    """Handle /start command with welcome message for History Coffee."""
    user_id = message.from_user.id
    username = message.from_user.full_name or message.from_user.username or "Гость"

    # Create user in database if not exists
    user = create_user_if_not_exists(
        user_id=user_id,
        name=username,
        avatar_url=message.from_user.avatar_url
    )

    # Check for referral parameter
    args = message.text.split()[1:] if len(message.text.split()) > 1 else []
    referral_text = ""
    if args:
        referral_id = args[0]
        if referral_id.isdigit():
            referral_text = f"\n🎁 Вы перешли по реферальной ссылке!"

    # Welcome message for History Coffee
    welcome_text = f"""☕ <b>Добро пожаловать в History Coffee!</b>

Приятно познакомиться, {username}! 🙌

Мы — кофейня с душой и историей. У нас вы можете:
☕ Выбрать любимый кофе
🍰 Вкусные десерты
🎁 Зарабатывать бонусы с каждой покупки
📱 Удобное заказание через мини-приложение

{referral_text}

<button>Открыть меню</button>

Нажмите кнопку ниже или используйте /menu для заказа!"""

    await message.answer(
        welcome_text,
        reply_markup=get_welcome_keyboard()
    )


@router.message(Command("menu"))
async def cmd_menu(message: Message):
    """Open mini app menu."""
    from bot.config import MINI_APP_URL

    await message.answer(
        "📱 Нажмите кнопку ниже для открытия меню:",
        reply_markup=get_welcome_keyboard()
    )


@router.message(Command("help"))
async def cmd_help(message: Message):
    """Show help message."""
    help_text = """📖 <b>Справка по боту History Coffee</b>

<b>Доступные команды:</b>
/start - Главное меню
/menu - Открыть меню заказа
/help - Эта справка

<b>Как сделать заказ:</b>
1. Нажмите "☕ Открыть меню"
2. Выберите напитки и десерты в приложении
3. Оформите заказ
4. Оплатите через кнопку в боте

<b>Бонусная система:</b>
• 5% от каждого заказа возвращаются бонусами
• Бонусами можно оплачивать до 50% заказа
• Профиль и история заказов - в мини-приложении

По вопросам: @HistoryCoffeeSupport"""

    await message.answer(help_text)
