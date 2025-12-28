from aiogram.types import InlineKeyboardMarkup, InlineKeyboardButton, ReplyKeyboardMarkup, KeyboardButton
from aiogram.utils.keyboard import InlineKeyboardBuilder
from bot.config import MINI_APP_URL


def get_welcome_keyboard() -> InlineKeyboardMarkup:
    """Create welcome keyboard with Open App button."""
    builder = InlineKeyboardBuilder()
    builder.button(text="☕ Открыть меню", url=MINI_APP_URL)
    return builder.as_markup()


def get_payment_keyboard(order_id: str) -> InlineKeyboardMarkup:
    """Create payment keyboard for order."""
    from bot.config import PAYMENT_LINK_TEMPLATE

    payment_link = PAYMENT_LINK_TEMPLATE.format(order_id=order_id)

    builder = InlineKeyboardBuilder()
    builder.button(text="💳 Оплатить заказ", url=payment_link)
    builder.button(text="📱 Открыть приложение", url=MINI_APP_URL)
    builder.adjust(1)
    return builder.as_markup()


def get_main_menu_keyboard() -> ReplyKeyboardMarkup:
    """Create main menu keyboard."""
    keyboard = ReplyKeyboardMarkup(
        keyboard=[
            [KeyboardButton(text="📋 Мои заказы")],
            [KeyboardButton(text="❓ Помощь")],
            [KeyboardButton(text="☕ Открыть меню")],
        ],
        resize_keyboard=True,
        input_field_placeholder="Выберите действие..."
    )
    return keyboard


def get_order_actions_keyboard(order_id: str) -> InlineKeyboardMarkup:
    """Create inline keyboard for order actions."""
    from bot.config import PAYMENT_LINK_TEMPLATE

    payment_link = PAYMENT_LINK_TEMPLATE.format(order_id=order_id)

    builder = InlineKeyboardBuilder()
    builder.button(text="💳 Оплатить", url=payment_link)
    builder.button(text="📱 В приложение", url=MINI_APP_URL)
    builder.adjust(1)
    return builder.as_markup()


def get_admin_keyboard() -> InlineKeyboardMarkup:
    """Create admin keyboard for order management."""
    builder = InlineKeyboardBuilder()
    builder.button(text="📊 Посмотреть заказы", callback_data="admin_orders")
    builder.button(text="📢 Отправить уведомление", callback_data="admin_notify")
    builder.adjust(1)
    return builder.as_markup()
