from aiogram import Router
from .start import router as start_router
from .orders import router as orders_router
from .admin import router as admin_router


def get_handlers_router() -> Router:
    """Combine all handlers into one router."""
    main_router = Router()
    main_router.include_router(start_router)
    main_router.include_router(orders_router)
    main_router.include_router(admin_router)
    return main_router
