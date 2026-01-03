import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Home, User as UserIcon } from 'lucide-react';
import { Sidebar } from './Sidebar';

interface LayoutProps {
  children: React.ReactNode;
}

const BottomNavigation = () => {
  const location = useLocation();

  const navItems = [
    { path: '/', icon: Home, label: 'Меню' },
    { path: '/profile', icon: UserIcon, label: 'Профиль' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 pb-safe z-50 shadow-[0_-4px_20px_rgba(0,0,0,0.03)] md:hidden">
      <div className="flex justify-around items-center h-20 max-w-lg mx-auto px-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;

          return (
            <Link
              key={item.path}
              to={item.path}
              className="flex-1 flex flex-col items-center justify-center h-full relative group transition-all"
            >
              <div
                className={`relative transition-all duration-300 ease-out transform ${isActive ? '-translate-y-2' : 'translate-y-0'
                  } ${isActive ? 'text-[#b7ad98]' : 'text-gray-400'}`}
              >
                <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
              </div>

              <span
                className={`text-[11px] font-bold transition-all duration-300 ease-out absolute bottom-4 ${isActive
                  ? 'opacity-100 translate-y-0 text-[#b7ad98] scale-100'
                  : 'opacity-0 translate-y-4 text-gray-400 scale-75 pointer-events-none'
                  }`}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

import { useAppStore } from '../store/useAppStore';

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const { isKeyboardOpen } = useAppStore();
  const isConfirmPage = location.pathname.startsWith('/confirm-scan');
  const isAdminPage = location.pathname === '/admin';
  const shouldShowBottomNav = !isConfirmPage && !isAdminPage && !isKeyboardOpen;

  return (
    <div className="min-h-screen bg-[#F3F4F6]">
      <Sidebar />

      <main className="md:pl-64 transition-all duration-300 min-h-screen">
        <div className="max-w-7xl mx-auto w-full">
          {children}
        </div>
      </main>

      {shouldShowBottomNav && <BottomNavigation />}
    </div>
  );
};
