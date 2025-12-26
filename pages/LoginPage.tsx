
import React, { useEffect, useState } from 'react';
import { Send, ShieldCheck, Zap } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { MOCK_USER } from '../services/mockData';

export const LoginPage: React.FC = () => {
  const { setAuth } = useAppStore();
  const [isLoading, setIsLoading] = useState(false);

  const handleTelegramLogin = () => {
    setIsLoading(true);
    
    setTimeout(() => {
      const tg = (window as any).Telegram?.WebApp;
      const tgUser = tg?.initDataUnsafe?.user;
      
      if (tgUser) {
        setAuth({
          id: tgUser.id,
          name: `${tgUser.first_name} ${tgUser.last_name || ''}`.trim(),
          avatarUrl: tgUser.photo_url || `https://ui-avatars.com/api/?name=${tgUser.first_name}&background=736153&color=fff`,
          points: 340,
          lifetimePoints: 420,
          level: "Бариста-Шеф",
          nextLevelPoints: 500,
          referralCode: `TG${tgUser.id}`
        });
      } else {
        setAuth(MOCK_USER);
      }
      setIsLoading(false);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-[#F3F4F6] flex flex-col items-center justify-center px-6 pt-[100px] relative overflow-hidden font-sans">
      <div className="absolute top-[-5%] right-[-10%] w-72 h-72 bg-blue-600 rounded-full blur-[100px] opacity-10"></div>
      <div className="absolute bottom-[5%] left-[-10%] w-72 h-72 bg-stone-500 rounded-full blur-[100px] opacity-10"></div>

      <div className="w-full max-w-sm z-10 animate-fade-in flex flex-col items-center">
        <div className="flex flex-col items-center mb-6">
          <div className="w-48 h-48 mb-2 animate-pop-in drop-shadow-2xl">
            <img 
              src="https://lh3.googleusercontent.com/gg-dl/ABS2GSnbHmwcV_dtr6T3795R2jYas4ndZpLvAMVWZrrAl3iGVMU6a1f5jejMxsNeRnYNf1K7wOC1rW67INraW7hVsbUDcux9tuV4ME1598da4gPQskSuXMEiwReLkd0Qx3bgVWGty2-k9MToJJXkgdwAfPlVUe8Hj5eZpPMFUB9xOFwnwMfioA=s1024-rj" 
              alt="H🪶STORY Logo" 
              className="w-full h-full object-contain"
            />
          </div>
          <p className="text-slate-500 text-center text-sm leading-relaxed px-4 mt-2">
            Премиальный кофе в один клик. <br/>Авторизуйтесь через Telegram для старта.
          </p>
        </div>

        <div className="space-y-4 mb-10 w-full">
          <div className="flex items-center gap-4 bg-white border border-white p-4 rounded-2xl shadow-sm animate-slide-up stagger-1">
            <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center text-blue-600">
              <Zap size={20} />
            </div>
            <div>
              <p className="text-slate-900 text-sm font-bold">Быстрый заказ</p>
              <p className="text-slate-500 text-xs">Готовим к вашему приходу</p>
            </div>
          </div>
          <div className="flex items-center gap-4 bg-white border border-white p-4 rounded-2xl shadow-sm animate-slide-up stagger-2">
            <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center text-blue-600">
              <ShieldCheck size={20} />
            </div>
            <div>
              <p className="text-slate-900 text-sm font-bold">Программа лояльности</p>
              <p className="text-slate-500 text-xs">Копите баллы и пейте кофе бесплатно</p>
            </div>
          </div>
        </div>

        <button
          onClick={handleTelegramLogin}
          disabled={isLoading}
          className={`w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all active:scale-95 shadow-lg ${
            isLoading 
            ? 'bg-slate-200 text-slate-400 cursor-wait' 
            : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-200'
          } animate-slide-up stagger-3`}
        >
          {isLoading ? (
            <div className="w-6 h-6 border-2 border-slate-300 border-t-blue-600 rounded-full animate-spin"></div>
          ) : (
            <>
              <Send size={18} fill="currentColor" className="transform -rotate-12" />
              <span>Войти через Telegram</span>
            </>
          )}
        </button>

        <p className="mt-8 text-center text-[10px] text-slate-400 uppercase tracking-widest font-bold">
          Безопасный вход через официальный SDK
        </p>
      </div>
    </div>
  );
};
