
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import { Home, User as UserIcon } from 'lucide-react';
import { MenuPage } from './pages/MenuPage';
import { CartPage } from './pages/CartPage';
import { ProfilePage } from './pages/ProfilePage';
import { AdminPage } from './pages/AdminPage';
import { AchievementsPage } from './pages/AchievementsPage';
import { OrderHistoryPage } from './pages/OrderHistoryPage';
import { AddressesPage } from './pages/AddressesPage';
import { SupportPage } from './pages/SupportPage';
import { ConfirmScanPage } from './pages/ConfirmScanPage';
import { useAppStore } from './store/useAppStore';
import { MOCK_USER } from './services/mockData';

const Navigation = () => {
  const location = useLocation();
  
  const navItems = [
    { path: '/', icon: Home, label: 'Меню' },
    { path: '/profile', icon: UserIcon, label: 'Профиль' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 pb-safe z-50 shadow-[0_-4px_20px_rgba(0,0,0,0.03)]">
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
                className={`relative transition-all duration-300 ease-out transform ${
                  isActive ? '-translate-y-2' : 'translate-y-0'
                } ${isActive ? 'text-blue-600' : 'text-gray-400'}`}
              >
                <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
              </div>
              
              <span 
                className={`text-[11px] font-bold transition-all duration-300 ease-out absolute bottom-4 ${
                  isActive 
                    ? 'opacity-100 translate-y-0 text-blue-600 scale-100' 
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

const AppContent: React.FC = () => {
  const { setAuth, isAuth, isAdmin } = useAppStore();
  const location = useLocation();
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);

  useEffect(() => {
    const handleFocus = (e: FocusEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
        setIsKeyboardOpen(true);
      }
    };
    
    const handleBlur = () => {
      setIsKeyboardOpen(false);
    };

    window.addEventListener('focusin', handleFocus);
    window.addEventListener('focusout', handleBlur);
    
    return () => {
      window.removeEventListener('focusin', handleFocus);
      window.removeEventListener('focusout', handleBlur);
    };
  }, []);

  React.useEffect(() => {
    const tg = (window as any).Telegram?.WebApp;
    if (tg) {
      try {
        tg.ready();
        if (tg.expand) tg.expand();
        if (tg.enableClosingConfirmation) tg.enableClosingConfirmation();
      } catch (e) {
        console.error('Error initializing TG WebApp:', e);
      }
      
      const tgUser = tg.initDataUnsafe?.user;
      if (tgUser) {
        setAuth({
          id: tgUser.id,
          name: `${tgUser.first_name} ${tgUser.last_name || ''}`.trim(),
          avatarUrl: tgUser.photo_url || `https://ui-avatars.com/api/?name=${tgUser.first_name}&background=736153&color=fff`,
          points: 340,
          lifetimePoints: 420,
          level: "Бариста-Шеф",
          nextLevelPoints: 500,
          referralCode: `id${tgUser.id}`
        });
      } else {
        if (!isAuth) {
          setAuth(MOCK_USER);
        }
      }
    } else if (!isAuth) {
      setAuth(MOCK_USER);
    }
  }, [isAuth, setAuth]);

  if (!isAuth) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-[#F3F4F6]">
        <div className="w-10 h-10 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  // Скрываем навигацию на странице подтверждения сканирования
  const isConfirmPage = location.pathname.startsWith('/confirm-scan');

  return (
    <div className="min-h-screen font-sans text-gray-900 bg-[#F3F4F6]">
      <Routes>
        <Route path="/" element={<MenuPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/admin" element={isAdmin ? <AdminPage /> : <Navigate to="/" replace />} />
        <Route path="/achievements" element={<AchievementsPage />} />
        <Route path="/history" element={<OrderHistoryPage />} />
        <Route path="/addresses" element={<AddressesPage />} />
        <Route path="/support" element={<SupportPage />} />
        <Route path="/confirm-scan/:userId" element={<ConfirmScanPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      {location.pathname !== '/admin' && !isKeyboardOpen && !isConfirmPage && <Navigation />}
    </div>
  );
};

const App: React.FC = () => {
  return (
    <HashRouter>
      <AppContent />
    </HashRouter>
  );
};

export default App;
