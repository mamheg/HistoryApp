
import React, { useState, useRef, useEffect } from 'react';
import { 
  Copy, 
  Users, 
  Gift, 
  ChevronRight, 
  Fingerprint, 
  Settings, 
  X, 
  Save
} from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { useNavigate } from 'react-router-dom';

export const ProfilePage: React.FC = () => {
  const { user, updateProfile } = useAppStore();
  const navigate = useNavigate();
  
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editName, setEditName] = useState(user?.name || '');
  
  // Swipe logic states
  const [touchStartY, setTouchStartY] = useState<number | null>(null);
  const [currentTranslateY, setCurrentTranslateY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    if (isEditModalOpen) {
      document.body.style.overflow = 'hidden';
      setEditName(user?.name || '');
    } else {
      document.body.style.overflow = '';
      setCurrentTranslateY(0); 
    }
    return () => { document.body.style.overflow = ''; };
  }, [isEditModalOpen, user?.name]);

  if (!user) return null;

  const referralLink = `https://t.me/CoffeeShopBot?start=id${user.id}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralLink);
    const tg = (window as any).Telegram?.WebApp;
    if (tg) {
       if (tg.HapticFeedback) tg.HapticFeedback.impactOccurred('medium');
    }
    alert("Ссылка скопирована!");
  };

  const handleSaveProfile = () => {
    if (editName.trim()) {
      updateProfile(editName.trim(), user.avatarUrl);
      setIsEditModalOpen(false);
    }
  };

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchStartY(e.touches[0].clientY);
    setIsDragging(true);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (touchStartY === null) return;
    const currentY = e.touches[0].clientY;
    const diff = currentY - touchStartY;
    
    // Позволяем тянуть только вниз
    if (diff > 0) {
      setCurrentTranslateY(diff);
    }
  };

  const onTouchEnd = () => {
    setIsDragging(false);
    // Если потянули более чем на 120px — закрываем
    if (currentTranslateY > 120) {
      setIsEditModalOpen(false);
    } else {
      // Иначе возвращаем на место
      setCurrentTranslateY(0);
    }
    setTouchStartY(null);
  };

  return (
    <div className="pb-32 pt-6 px-4 max-w-lg mx-auto font-sans">
      <div className="flex flex-col items-center mb-8 animate-slide-up relative">
        <button 
          onClick={() => setIsEditModalOpen(true)}
          className="absolute right-0 top-0 p-2 bg-white rounded-full shadow-sm text-slate-500 hover:text-blue-500 transition-colors"
        >
          <Settings size={20} />
        </button>

        <div className="relative group mb-4">
          <div className="w-24 h-24 rounded-full p-1 border-2 border-dashed border-blue-400 animate-pop-in shadow-inner bg-white overflow-hidden">
            <img src={user.avatarUrl} alt={user.name} className="w-full h-full rounded-full object-cover" />
          </div>
        </div>

        <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
        <div 
          onClick={() => navigate('/achievements')}
          className="flex items-center gap-1.5 bg-blue-50 px-3 py-1 rounded-full mt-2 cursor-pointer active:scale-95 transition-transform"
        >
          <Gift size={12} className="text-blue-600" />
          <p className="text-blue-600 text-xs font-bold uppercase tracking-wider">{user.level}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-8">
        <div 
          onClick={() => navigate('/achievements')}
          className="bg-white p-4 rounded-2xl shadow-sm animate-slide-up stagger-1 opacity-0 fill-mode-forwards active:scale-95 transition-transform duration-200 cursor-pointer"
        >
          <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center mb-3 text-orange-600">
            <Gift size={20} />
          </div>
          <p className="text-2xl font-bold text-gray-900">{user.points}</p>
          <p className="text-xs text-slate-600 font-bold uppercase tracking-tight mt-1">Бонусные баллы</p>
        </div>
        <div className="bg-white p-4 rounded-2xl shadow-sm animate-slide-up stagger-2 opacity-0 fill-mode-forwards active:scale-95 transition-transform duration-200">
          <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mb-3 text-purple-600">
            <Users size={20} />
          </div>
          <p className="text-2xl font-bold text-gray-900">12</p>
          <p className="text-xs text-slate-600 font-bold uppercase tracking-tight mt-1">Друзей приглашено</p>
        </div>
      </div>

      <div className="bg-gradient-to-br from-blue-600 to-stone-800 rounded-3xl p-6 text-white shadow-lg mb-8 relative overflow-hidden animate-slide-up stagger-3 opacity-0 fill-mode-forwards">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-10 -mt-10 blur-2xl"></div>
        
        <h2 className="text-xl font-bold mb-2">Приглашайте друзей</h2>
        <p className="text-blue-100 text-sm mb-6">Получайте 100 баллов за каждый первый заказ вашего друга.</p>

        <div className="bg-white/10 backdrop-blur-md rounded-xl p-1 pl-4 flex items-center justify-between border border-white/20">
          <span className="text-xs font-mono truncate mr-2 opacity-90">{referralLink}</span>
          <button 
            onClick={copyToClipboard}
            className="bg-white text-blue-600 p-2 rounded-lg hover:bg-blue-50 transition-colors active:scale-90"
          >
            <Copy size={16} />
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl overflow-hidden shadow-sm animate-slide-up stagger-4 opacity-0 fill-mode-forwards mb-6">
        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-3 text-gray-700">
            <Fingerprint size={18} className="text-blue-500" />
            <span className="font-medium">ID аккаунта</span>
          </div>
          <span className="text-xs font-mono text-slate-600 bg-gray-50 px-2 py-1 rounded font-bold">{user.id}</span>
        </div>
        
        <button 
          onClick={() => navigate('/history')}
          className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-all border-b border-gray-100 active:bg-gray-100 active:scale-[0.99] duration-200"
        >
          <span className="font-medium text-gray-700">История заказов</span>
          <ChevronRight size={18} className="text-slate-400" />
        </button>

        <button 
          onClick={() => navigate('/addresses')}
          className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-all border-b border-gray-100 active:bg-gray-100 active:scale-[0.99] duration-200"
        >
          <span className="font-medium text-gray-700">Мои адреса</span>
          <ChevronRight size={18} className="text-slate-400" />
        </button>

        <button 
          onClick={() => navigate('/support')}
          className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-all active:bg-gray-100 active:scale-[0.99] duration-200"
        >
          <span className="font-medium text-gray-700">Служба поддержки</span>
          <ChevronRight size={18} className="text-slate-400" />
        </button>
      </div>

      {/* Edit Profile Modal (Bottom Sheet) */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center">
          <div 
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-fade-in" 
            onClick={() => setIsEditModalOpen(false)} 
          />
          <div 
            className={`bg-white w-full max-w-lg rounded-t-[2.5rem] p-8 pb-12 relative z-[101] shadow-2xl transition-transform ${!isDragging ? 'duration-300 ease-out' : ''}`}
            style={{ transform: `translateY(${currentTranslateY}px)` }}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
            {/* Handle */}
            <div className="absolute top-3 left-1/2 -translate-x-1/2 w-12 h-1.5 bg-slate-200 rounded-full" />
            
            <div className="flex justify-between items-center mb-10">
              <h2 className="text-xl font-bold text-slate-900">Редактировать профиль</h2>
              <button 
                onClick={() => setIsEditModalOpen(false)} 
                className="p-2 bg-slate-100 rounded-full active:scale-90 transition-transform"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-8">
              <div className="flex flex-col items-center">
                <div className="w-24 h-24 rounded-full p-1 border-2 border-slate-100 shadow-sm bg-white overflow-hidden">
                  <img src={user.avatarUrl} className="w-full h-full rounded-full object-cover" alt="Avatar" />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-600 uppercase mb-2.5 block px-1">Ваше имя</label>
                <input 
                  type="text" 
                  className="w-full bg-slate-100 border-2 border-transparent rounded-2xl p-4 text-sm font-semibold focus:ring-0 focus:border-blue-500 outline-none transition-all"
                  placeholder="Введите имя..."
                  value={editName}
                  onChange={e => setEditName(e.target.value)}
                />
              </div>

              <button 
                onClick={handleSaveProfile}
                disabled={!editName.trim()}
                className="w-full bg-blue-600 disabled:bg-slate-300 text-white py-4 rounded-2xl font-bold shadow-lg shadow-blue-200 flex items-center justify-center gap-2 active:scale-95 transition-all"
              >
                <Save size={20} />
                Сохранить изменения
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
