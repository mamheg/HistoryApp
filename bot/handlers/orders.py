from aiogram import Router
from aiogram.types import Message, CallbackQuery
from aiogram.filters import Command
from bot.database import get_order, get_user_orders
from bot.keyboards import get_order_actions_keyboard


router = Router()


async def send_order_notification(user_id, bot, order_id: str, order_data: dict):
    """
    Send notification about new order to user.
    This is called from outside when order is created.
    """
    order_text = f"""✅ <b>Заказ подтверждён!</b>

🔹 <b>Номер заказа:</b> {order_id}
📋 <b>Состав:</b> {order_data.get('items_summary', 'Загрузка...')}
💰 <b>Сумма:</b> {order_data.get('total_price', 0)} ₽"""

    if order_data.get('pickup_time'):
        order_text += f"\n⏰ <b>Время получения:</b> {order_data['pickup_time']}"

    order_text += "\n\nОплатите заказ, нажав кнопку ниже:"

    try:
        await bot.send_message(
            user_id,
            order_text,
            reply_markup=get_order_actions_keyboard(order_id)
        )
    except Exception as e:
        print(f"Error sending order notification to {user_id}: {e}")


async def send_order_ready_notification(user_id, bot, order_id: str):
    """
    Send notification that order is ready for pickup.
    This can be triggered by admin or automatically.
    """
    ready_text = f"""🎉 <b>Ваш заказ готов!</b>

🔹 <b>Номер заказа:</b> {order_id}

☕ Ваш кофе уже ждёт вас! Заберите его в кофейне.

Спасибо, что выбираете History Coffee! 💚"""

    try:
        await bot.send_message(user_id, ready_text)
    except Exception as e:
        print(f"Error sending ready notification to {user_id}: {e}")
