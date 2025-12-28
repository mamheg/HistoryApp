from aiogram import Router, F
from aiogram.types import Message, CallbackQuery
from aiogram.filters import Command
from bot.database import get_pending_orders
from bot.config import ADMIN_IDS
from bot.handlers.orders import send_order_ready_notification


router = Router()


@router.message(Command("admin"))
async def cmd_admin(message: Message):
    """Admin command to manage orders."""
    user_id = message.from_user.id

    if user_id not in ADMIN_IDS:
        await message.answer("⛔ У вас нет прав администратора")
        return

    orders = get_pending_orders()

    if not orders:
        await message.answer("📋 Заказов пока нет")
        return

    text = "📊 <b>Последние заказы:</b>\n\n"

    for order in orders[:10]:
        text += f"🔹 <b>{order['id']}</b> | {order['user_name']}\n"
        text += f"   {order['items_summary']}\n"
        text += f"   💰 {order['total_price']} ₽\n"
        text += f"   🕐 {order['created_at']}\n\n"

    await message.answer(text)


@router.message(Command("notify"))
async def cmd_notify(message: Message):
    """
    Notify user that order is ready.
    Usage: /notify ORDER_ID
    """
    user_id = message.from_user.id

    if user_id not in ADMIN_IDS:
        await message.answer("⛔ У вас нет прав администратора")
        return

    args = message.text.split()
    if len(args) < 2:
        await message.answer("Использование: /notify ORDER_ID")
        return

    order_id = args[1]

    # Get order details
    from bot.database import get_order
    order = get_order(order_id)

    if not order:
        await message.answer(f"❌ Заказ {order_id} не найден")
        return

    # Send notification
    await send_order_ready_notification(order['user_id'], message.bot, order_id)
    await message.answer(f"✅ Уведомление о готовности отправлено для заказа {order_id}")


@router.callback_query(F.data.startswith("mark_ready_"))
async def cb_mark_ready(callback: CallbackQuery):
    """Mark order as ready via callback."""
    user_id = callback.from_user.id

    if user_id not in ADMIN_IDS:
        await callback.answer("⛔ Нет прав", show_alert=True)
        return

    order_id = callback.data.split("_")[-1]

    from bot.database import get_order
    order = get_order(order_id)

    if not order:
        await callback.answer("❌ Заказ не найден", show_alert=True)
        return

    await send_order_ready_notification(order['user_id'], callback.bot, order_id)
    await callback.answer(f"✅ Уведомление отправлено для {order_id}")
    await callback.message.edit_text(f"✅ Заказ {order_id} отмечен как готовый")
