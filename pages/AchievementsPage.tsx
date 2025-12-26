
import React, { useEffect } from 'react';
import { ArrowLeft, Star, Lock, CheckCircle2, Trophy, Coins, UserPlus, Info, Share2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppStore, COFFEE_LEVELS } from '../store/useAppStore';

export const AchievementsPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAppStore();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (!user) {
    navigate('/login');
    return null;
  }

  const currentPoints = user.lifetimePoints || 0;

  return (
    <div className="min-h-screen bg-[#F3F4F6] pb-32">
      <div className="bg-white/80 backdrop-blur-md p-4 border-b border-gray-100 sticky top-0 z-50 flex items-center gap-4 animate-fade-in">
        <button 
          onClick={() => navigate(-1)} 
          className="p-2 -ml-2 text-gray-800 active:scale-90 transition-transform bg-gray-50 rounded-full"
        >
          <ArrowLeft size={24} />
        </button>
        <h1 className="font-black text-lg text-slate-900">Путь к величию</h1>
      </div>

      <div className="p-6">
        <div className="bg-[#736153] rounded-[2.5rem] p-8 text-white mb-8 shadow-2xl relative overflow-hidden animate-slide-down">
          <div className="absolute top-0 right-0 w-48 h-48 bg-white rounded-full blur-[80px] opacity-10" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-black rounded-full blur-[60px] opacity-10" />
          
          <div className="relative z-10 flex flex-col items-center">
            <div className="w-20 h-20 bg-white/10 backdrop-blur-md rounded-3xl flex items-center justify-center mb-4 border border-white/20 animate-pop-in">
              <Trophy size={40} className="text-[#ece9e2]" />
            </div>
            <p className="text-[#ece9e2]/80 text-[10px] font-black uppercase tracking-[0.2em] mb-2">Ваш текущий ранг</p>
            <h2 className="text-3xl font-black mb-6 tracking-tight">{user.level}</h2>
            
            <div className="w-full bg-black/20 h-3 rounded-full overflow-hidden mb-3 border border-white/5">
              <div 
                className="h-full bg-[#ece9e2] rounded-full shadow-[0_0_10px_rgba(236,233,226,0.5)] transition-all duration-1000 ease-out"
                style={{ width: `${Math.min(100, (currentPoints / user.nextLevelPoints) * 100)}%` }}
              />
            </div>
            <div className="flex items-center gap-2">
               <span className="text-sm font-bold text-white">{currentPoints}</span>
               <span className="text-xs text-[#ece9e2]/60">/</span>
               <span className="text-xs text-[#ece9e2]/60 font-medium">{user.nextLevelPoints} баллов за все время</span>
            </div>
          </div>
        </div>

        <div className="bg-[#736153] rounded-3xl p-6 text-white mb-10 shadow-xl shadow-[#736153]/20 animate-slide-up stagger-1 opacity-0 fill-mode-forwards">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-[#ece9e2]">
              <Info size={18} />
            </span>
            <h3 className="font-black uppercase text-xs tracking-wider">Как заработать баллы?</h3>
          </div>
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-white/20 rounded-xl flex items-center justify-center shrink-0">
                <Coins size={16} />
              </div>
              <p className="text-sm font-medium leading-snug">Получайте <span className="font-bold">5% кэшбэка</span> баллами при полной оплате рублями.</p>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-white/20 rounded-xl flex items-center justify-center shrink-0">
                <Share2 size={16} />
              </div>
              <p className="text-sm font-medium leading-snug">Подписывайтесь на наши соцсети и получайте <span className="font-bold">50 баллов</span> единоразово!</p>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-white/20 rounded-xl flex items-center justify-center shrink-0">
                <UserPlus size={16} />
              </div>
              <p className="text-sm font-medium leading-snug">Дарим <span className="font-bold">100 баллов</span> за каждого друга, который совершит первую покупку.</p>
            </div>
          </div>
        </div>

        <h3 className="text-xl font-black text-slate-900 mb-6 px-1 animate-fade-in stagger-2 opacity-0 fill-mode-forwards">Ранги и достижения</h3>
        
        <div className="space-y-4">
          {COFFEE_LEVELS.map((level, idx) => {
            const isUnlocked = currentPoints >= level.pointsRequired;
            const isCurrent = user.level === level.name;
            const staggerClass = `stagger-${idx + 3}`;
            
            return (
              <div 
                key={level.id}
                className={`bg-white rounded-3xl p-5 border transition-all duration-500 animate-slide-up ${staggerClass} opacity-0 fill-mode-forwards ${
                  isCurrent 
                    ? 'ring-2 ring-[#736153] border-transparent shadow-xl scale-[1.03] z-10' 
                    : 'border-gray-100 shadow-sm hover:shadow-md'
                } ${!isUnlocked ? 'grayscale opacity-60' : ''}`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-14 h-14 rounded-2xl ${level.color} flex items-center justify-center text-2xl shadow-inner animate-pop-in ${staggerClass}`}>
                    {level.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-bold text-slate-900">{level.name}</h4>
                      {isUnlocked ? (
                        <CheckCircle2 size={18} className="text-green-500 animate-pop-in" />
                      ) : (
                        <div className="flex items-center gap-1 text-[10px] font-black text-slate-400 bg-slate-50 px-2 py-0.5 rounded-full border border-slate-100">
                          <Lock size={10} />
                          {level.pointsRequired} Б.
                        </div>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 leading-relaxed font-medium">
                      {level.description}
                    </p>
                  </div>
                </div>
                
                {isCurrent && (
                  <div className="mt-4 pt-4 border-t border-slate-50 flex items-center justify-center gap-2 animate-fade-in">
                    <Star size={12} className="text-yellow-500 fill-yellow-500 animate-pulse" />
                    <span className="text-[9px] font-black uppercase text-[#736153] tracking-widest">Твой текущий ранг</span>
                    <Star size={12} className="text-yellow-500 fill-yellow-500 animate-pulse" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
