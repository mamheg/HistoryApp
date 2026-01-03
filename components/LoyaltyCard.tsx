
import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { QrCode, Sparkles, X, Zap, CheckCircle } from 'lucide-react';
import { User } from '../types';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';

interface LoyaltyCardProps {
  user: User;
}

export const LoyaltyCard: React.FC<LoyaltyCardProps> = ({ user }) => {
  const navigate = useNavigate();
  const [showQr, setShowQr] = useState(false);
  const [isScanned, setIsScanned] = useState(false);

  const currentLifetime = user.lifetimePoints || 0;
  const progressPercent = Math.min(100, (currentLifetime / user.nextLevelPoints) * 100);

  // Ссылка ведет на страницу подтверждения внутри приложения
  const confirmUrl = `${window.location.origin}/#/confirm-scan/id${user.id}`;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(confirmUrl)}&bgcolor=ffffff&color=000000&margin=1`;

  const handleStatusClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate('/achievements');
  };

  return (
    <>
      <div
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setShowQr(true);
        }}
        className="w-full bg-[#736153] text-white rounded-[30px] p-2 h-16 shadow-lg flex items-center justify-between mb-4 cursor-pointer active:scale-[0.98] transition-all group relative overflow-hidden z-50 pointer-events-auto"
      >
        {/* Left: Avatar */}
        <div className="relative z-10 flex-shrink-0 ml-1">
          <img
            src={user.avatarUrl}
            alt={user.name}
            className="w-12 h-12 rounded-full border-2 border-[#8c7a6b] object-cover bg-gray-200"
          />
        </div>

        {/* Center: Logo */}
        <div className="flex-1 flex justify-center items-center relative z-10 h-full">
          <img
            src="images/logo.png?v=2"
            alt="HISTORY"
            className="h-12 object-contain opacity-90"
          />
        </div>

        {/* Right: QR Icon */}
        <div className="relative z-10 flex-shrink-0 mr-1">
          <div className="bg-white/10 w-12 h-12 rounded-[20px] flex items-center justify-center text-white backdrop-blur-sm shadow-sm">
            <QrCode className="w-6 h-6" />
          </div>
        </div>
      </div>

      {showQr && createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-slate-900/80 backdrop-blur-md animate-fade-in"
            onClick={() => setShowQr(false)}
          />

          <div className="bg-white rounded-[2rem] p-6 w-full max-w-[320px] relative z-[101] shadow-2xl flex flex-col items-center animate-pop-in">
            <button
              onClick={() => setShowQr(false)}
              className="absolute top-4 right-4 p-1.5 bg-slate-100 rounded-full text-slate-600 hover:text-slate-800 active:scale-90 transition-all z-20"
            >
              <X size={18} />
            </button>

            <div className="flex flex-col items-center mb-4 w-full">
              <div className="w-16 h-16 p-1 bg-white rounded-full shadow-md -mt-12 mb-2 border border-slate-50 relative z-10">
                <img
                  src={user.avatarUrl}
                  alt={user.name}
                  className="w-full h-full rounded-full object-cover"
                />
              </div>
              <h2 className="text-lg font-black text-slate-900 text-center">{user.name}</h2>
              <div className="text-[9px] font-black text-[#736153] bg-[#F6F4F3] px-2 py-0.5 rounded-full mt-1 border border-[#EBE7E4] tracking-wider">
                ID: {user.id}
              </div>
            </div>

            <div className="bg-white mb-4 w-full flex flex-col justify-center items-center relative min-h-[200px]">
              <div className="relative p-1.5 border-2 border-slate-200 rounded-2xl overflow-hidden shadow-inner">
                <img
                  src={qrUrl}
                  alt="QR-код"
                  className={`w-48 h-48 object-contain transition-all duration-500 ${isScanned ? 'opacity-10 blur-sm scale-95' : 'opacity-100'}`}
                />

                {isScanned && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center animate-pop-in">
                    <div className="bg-white/95 backdrop-blur-md p-4 rounded-3xl flex flex-col items-center shadow-xl border border-green-100">
                      <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center shadow-lg shadow-green-100 mb-2">
                        <CheckCircle size={28} className="text-white" />
                      </div>
                      <p className="text-green-600 font-black uppercase text-[10px] tracking-[0.2em] text-center">Принято</p>
                      <p className="text-slate-900 font-bold text-xs mt-1">+12 бонусов</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="w-full space-y-3">
              <div className="w-full bg-[#F6F4F3] rounded-2xl p-4 text-center border border-[#EBE7E4]">
                <p className="text-[9px] text-[#736153] uppercase tracking-[0.2em] font-black mb-1">Ваш баланс</p>
                <div className="flex items-center justify-center text-slate-900 leading-none">
                  <span className="text-3xl font-black tracking-tight">{user.points}</span>
                  <span className="text-xs font-bold text-slate-500 ml-1.5 self-end mb-0.5">бонусов</span>
                </div>
              </div>
            </div>

            <p className="mt-4 text-[8px] text-slate-600 font-black tracking-[0.1em] text-center uppercase leading-tight px-2">
              Для получения бонусов покажите код<br />бариста при оплате заказа
            </p>
          </div>
        </div>,
        document.body
      )}
    </>
  );
};
