
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
import { Layout } from './components/Layout';



const AppContent: React.FC = () => {
  const { setAuth, isAuth, isAdmin, loadMenu, setKeyboardOpen } = useAppStore();
  const location = useLocation();
  // const [isKeyboardOpen, setIsKeyboardOpen] = useState(false); // Moved to store

  useEffect(() => {
    const handleFocus = (e: FocusEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
        setKeyboardOpen(true);
      }
    };

    const handleBlur = () => {
      setKeyboardOpen(false);
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
        // Phase 1: Try to sync with backend
        import('./services/api').then(({ api }) => {
          api.syncUser(tgUser)
            .then(user => {
              setAuth(user);
            })
            .catch(err => {
              console.error("Backend auth failed, falling back to local/mock", err);
              // Fallback logic could be here if needed, or we just rely on what was previously in store?
              // But for now let's just create a basic user object so app works even if offline
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
            });
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

  // Phase 3: Load menu from API with auto-refresh every 30 seconds
  React.useEffect(() => {
    loadMenu();

    const interval = setInterval(() => {
      loadMenu();
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, [loadMenu]);

  if (!isAuth) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-[#F3F4F6]">
        <div className="w-10 h-10 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  // Скрываем навигацию на странице подтверждения сканирования
  // Logic moved to Layout component

  return (
    <Layout>
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
    </Layout>
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
