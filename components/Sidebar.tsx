import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, User as UserIcon, ShoppingBag, Clock, MapPin, LifeBuoy, ShieldAlert } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';

export const Sidebar: React.FC = () => {
    const isAdmin = useAppStore(state => state.isAdmin);
    const cart = useAppStore(state => state.cart);
    const cartItemsCount = cart.reduce((acc, item) => acc + item.quantity, 0);

    const navItems = [
        { path: '/', icon: Home, label: 'Меню' },
        { path: '/profile', icon: UserIcon, label: 'Профиль' },
        { path: '/cart', icon: ShoppingBag, label: 'Корзина', badge: cartItemsCount > 0 ? cartItemsCount : undefined },
        { path: '/history', icon: Clock, label: 'История заказов' },
        { path: '/addresses', icon: MapPin, label: 'Адреса' },
        { path: '/support', icon: LifeBuoy, label: 'Поддержка' },
    ];

    if (isAdmin) {
        navItems.push({ path: '/admin', icon: ShieldAlert, label: 'Админ-панель' });
    }

    return (
        <aside className="fixed left-0 top-0 bottom-0 w-64 bg-white border-r border-gray-200 z-50 hidden md:flex flex-col">
            <div className="h-20 flex items-center px-8 border-b border-gray-100">
                <img
                    src="images/logo.png"
                    alt="Logo"
                    className="h-8 object-contain"
                />
            </div>

            <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) => `
              flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group
              ${isActive
                                ? 'bg-[#b7ad98]/10 text-[#b7ad98] font-bold'
                                : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900 font-medium'}
            `}
                    >
                        {({ isActive }) => (
                            <>
                                <item.icon
                                    size={20}
                                    strokeWidth={isActive ? 2.5 : 2}
                                    className={isActive ? 'text-[#b7ad98]' : 'text-gray-400 group-hover:text-gray-600'}
                                />
                                <span className="flex-1">{item.label}</span>
                                {item.badge && (
                                    <span className="bg-blue-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                                        {item.badge}
                                    </span>
                                )}
                            </>
                        )}
                    </NavLink>
                ))}
            </nav>

            <div className="p-4 border-t border-gray-100">
                <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-xs text-center text-gray-400">
                        &copy; 2025 History Coffee
                    </p>
                </div>
            </div>
        </aside>
    );
};
