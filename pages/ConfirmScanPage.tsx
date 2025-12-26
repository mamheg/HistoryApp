
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CheckCircle, ArrowLeft, Zap, ShoppingCart, UserCheck } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';

export const ConfirmScanPage: React.FC = () => {
  const { userId } = useParams(); // ID того, КОМУ начисляем баллы
  const navigate = useNavigate();
  const { addPoints, user } = useAppStore();
  const [isSuccess, setIsSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  // В реальном приложении здесь был бы запрос к API для начисления баллов пользователю по userId
  const handleConfirm = () => {
    setLoading(true);
    
    setTimeout(() => {
      // Имитация: если сканируем свой же код — начисляем себе (для теста пользователем)
      // В реальности здесь всегда идет вызов API для userId из параметров
      if (user && `id${user.id}` === userId) {
        addPoints(12);
      }
      
      setIsSuccess(true);
      setLoading(false);

      const tg = (window as any).Telegram?.WebApp;
      if (tg && tg.HapticFeedback) {
        tg.HapticFeedback.notificationOccurred('success');
      }
    }, 1000);
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-8 animate-fade-in font-sans">
        <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center shadow-xl shadow-green-100 mb-6 animate-pop-in">
          <CheckCircle size={48} className="text-white" />
        </div>
        <h1 className="text-2xl font-black text-slate-900 mb-2 text-center leading-tight">Баллы начислены!</h1>
        <p className="text-slate-600 text-center font-bold text-sm mb-10 max-w-[240px]">
          Владелец QR-кода (<span className="text-blue-600">{userId}</span>) успешно получил 12 баллов за визит.
        </p>
        
        <button 
          onClick={() => window.close()} // Попытка закрыть вкладку/окно Mini App
          className="w-full max-w-[200px] bg-slate-900 text-white py-4 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] active:scale-95 transition-all"
        >
          Готово
        </button>
        <p className="mt-4 text-[10px] text-slate-400 font-bold uppercase tracking-widest animate-pulse">Можно закрыть страницу</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <div className="p-4 flex items-center gap-4 bg-white border-b border-slate-100">
        <button onClick={() => navigate('/')} className="p-2 bg-slate-50 rounded-full active:scale-90 transition-transform">
          <ArrowLeft size={20} className="text-slate-700" />
        </button>
        <span className="font-black text-slate-900 uppercase text-[10px] tracking-widest">Терминал бариста</span>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-8 pb-20">
        <div className="w-20 h-20 bg-blue-600 rounded-3xl flex items-center justify-center mb-8 shadow-2xl shadow-blue-200 animate-pop-in">
          <UserCheck size={36} className="text-white" />
        </div>

        <div className="text-center mb-10 animate-slide-up">
          <h2 className="text-2xl font-black text-slate-900 mb-3">Начислить баллы?</h2>
          <p className="text-slate-600 text-sm leading-relaxed font-bold">
            Вы отсканировали код пользователя <span className="text-blue-600 font-black">{userId}</span>. 
            Подтвердите покупку, чтобы отправить ему бонусы.
          </p>
        </div>

        <div className="w-full bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm mb-10 animate-slide-up stagger-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                <Zap size={20} />
              </div>
              <span className="text-sm font-black text-slate-700 uppercase tracking-tight">Бонус за визит</span>
            </div>
            <span className="text-lg font-black text-blue-600">+12 Б.</span>
          </div>
        </div>

        <button 
          onClick={handleConfirm}
          disabled={loading}
          className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black uppercase text-xs tracking-[0.2em] shadow-xl shadow-slate-200 active:scale-95 transition-all flex items-center justify-center gap-3 disabled:bg-slate-300 animate-slide-up stagger-2"
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            'Подтвердить начисление'
          )}
        </button>
        
        <p className="mt-6 text-[9px] text-slate-500 font-black tracking-[0.1em] text-center uppercase leading-tight opacity-60">
          Данная операция необратима и будет зафиксирована<br/>в системе лояльности
        </p>
      </div>
    </div>
  );
};
