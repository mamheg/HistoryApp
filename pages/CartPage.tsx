
import React, { useState, useEffect, useRef } from 'react';
import { Minus, Plus, Trash2, Clock, MapPin, CreditCard, ShoppingBag, Coins, ChevronDown, MessageSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';

export const CartPage: React.FC = () => {
  const navigate = useNavigate();
  const { cart, updateQuantity, user, completeOrder, selectedAddress } = useAppStore();
  
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const maxBonusDiscount = Math.min(Math.floor(subtotal * 0.5), user?.points || 0); 
  
  const [bonusesToUse, setBonusesToUse] = useState(0);
  const [isPayButtonVisible, setIsPayButtonVisible] = useState(true);
  
  // States for Time and Comment
  const [isAsap, setIsAsap] = useState(true);
  const [scheduledTime, setScheduledTime] = useState('');
  const [orderComment, setOrderComment] = useState('');
  
  const payButtonRef = useRef<HTMLButtonElement>(null);
  const checkoutSectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    // Устанавливаем текущее время по умолчанию
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    setScheduledTime(`${hours}:${minutes}`);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsPayButtonVisible(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    if (payButtonRef.current) {
      observer.observe(payButtonRef.current);
    }

    return () => observer.disconnect();
  }, [cart.length]);

  useEffect(() => {
    if (bonusesToUse > maxBonusDiscount) {
      setBonusesToUse(maxBonusDiscount);
    }
  }, [subtotal, maxBonusDiscount]);

  const total = subtotal - bonusesToUse;

  const handleAddMore = () => {
    navigate('/', { state: { scrollToMenu: true } });
  };

  const handlePay = () => {
    const finalPickupTime = isAsap ? 'asap' : scheduledTime;
    
    if (!isAsap && !scheduledTime) {
      alert('Пожалуйста, выберите время готовности');
      return;
    }

    completeOrder(Math.round(total), bonusesToUse, finalPickupTime, orderComment);
    
    const timeLabel = isAsap ? 'Как можно скорее' : `к ${scheduledTime}`;
    const msg = `Заказ оплачен!\nСписано баллов: ${bonusesToUse}\nГотовность: ${timeLabel}\nАдрес: ${selectedAddress}`;
    
    alert(msg);
    navigate('/');
  };

  const scrollToCheckout = () => {
    window.scrollTo({ 
      top: document.body.scrollHeight, 
      behavior: 'smooth' 
    });
  };

  if (cart.length === 0) {
    return (
      <div className="h-screen flex flex-col items-center justify-center text-gray-500 p-8 animate-fade-in">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4 animate-pop-in">
          <ShoppingBag size={32} />
        </div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Корзина пуста</h2>
        <p className="text-center">Похоже, вы еще не выбрали ничего вкусного.</p>
        <button 
          onClick={() => navigate('/')}
          className="mt-6 text-blue-600 font-medium hover:text-blue-700 transition-colors"
        >
          Перейти в меню
        </button>
      </div>
    );
  }

  return (
    <div className="pb-28 pt-[100px] px-4 max-w-lg mx-auto relative min-h-screen flex flex-col font-sans">
      <h1 className="text-2xl font-bold text-slate-900 mb-6 animate-slide-up">Ваш заказ</h1>

      <div className="space-y-4 mb-4 flex-1">
        {cart.map((item, index) => (
          <div 
            key={item.uniqueId} 
            style={{ animationDelay: `${index * 100}ms` }}
            className="bg-white p-4 rounded-2xl shadow-sm flex gap-4 animate-slide-up opacity-0 fill-mode-forwards"
          >
            <img src={item.imageUrl} alt={item.productName} className="w-20 h-20 rounded-xl object-cover bg-gray-100" />
            
            <div className="flex-1 flex flex-col justify-between">
              <div>
                <h3 className="font-semibold text-gray-900">{item.productName}</h3>
                <p className="text-xs text-slate-500 mt-1">
                  {item.selectedModifiers.join(', ')}
                </p>
              </div>
              
              <div className="flex items-center justify-between mt-2">
                <span className="font-semibold">{item.price * item.quantity}₽</span>
                
                <div className="flex items-center gap-3 bg-gray-50 px-2 py-1 rounded-lg">
                  <button 
                    onClick={() => updateQuantity(item.uniqueId, -1)}
                    className="p-1 hover:text-red-500 transition-transform active:scale-75"
                  >
                    {item.quantity === 1 ? <Trash2 size={16} /> : <Minus size={16} />}
                  </button>
                  <span className="text-sm font-medium w-4 text-center">{item.quantity}</span>
                  <button 
                    onClick={() => updateQuantity(item.uniqueId, 1)}
                    className="p-1 hover:text-blue-500 transition-transform active:scale-75"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button 
        onClick={handleAddMore}
        className="w-full py-3 mb-8 border-2 border-dashed border-gray-200 rounded-xl text-slate-500 font-medium flex items-center justify-center gap-2 hover:border-blue-300 hover:text-blue-500 transition-all active:scale-[0.98] animate-slide-up stagger-1"
      >
        <Plus size={18} />
        <span>Добавить ещё</span>
      </button>

      {user && user.points > 0 && (
        <div className="bg-white border-2 border-gray-100 rounded-[1.5rem] p-4 mb-6 animate-slide-up stagger-2 opacity-0 fill-mode-forwards shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <Coins size={14} className="text-blue-500" />
                <p className="font-bold text-slate-900 text-sm">Списать баллы</p>
              </div>
              <p className="text-[10px] text-slate-400 font-medium mt-0.5">Доступно: {user.points} баллов</p>
            </div>
            <div className="bg-blue-600 px-3 py-1 rounded-full shadow-lg shadow-blue-100">
              <span className="text-sm font-black text-white">{bonusesToUse} баллов</span>
            </div>
          </div>
          
          <div className="px-1">
            <input 
              type="range"
              min="0"
              max={maxBonusDiscount}
              step="1"
              value={bonusesToUse}
              onChange={(e) => setBonusesToUse(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>
        </div>
      )}

      {/* Time Selection Block */}
      <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100 mb-6 animate-slide-up stagger-3 opacity-0 fill-mode-forwards">
        <div className="flex p-1.5 bg-gray-100 rounded-2xl mb-8 relative">
          <div 
             className="absolute top-1.5 bottom-1.5 bg-white rounded-xl shadow-sm transition-all duration-300 ease-out"
             style={{ 
               left: isAsap ? '6px' : '50%', 
               width: 'calc(50% - 6px)' 
             }}
          />
          <button 
            onClick={() => setIsAsap(true)}
            className={`flex-1 py-3 text-xs font-bold rounded-xl relative z-10 transition-colors ${isAsap ? 'text-blue-600' : 'text-slate-500'}`}
          >
            Как можно скорее
          </button>
          <button 
            onClick={() => setIsAsap(false)}
            className={`flex-1 py-3 text-xs font-bold rounded-xl relative z-10 transition-colors ${!isAsap ? 'text-blue-600' : 'text-slate-500'}`}
          >
            Ко времени
          </button>
        </div>

        <div className="flex flex-col items-center justify-center min-h-[80px] relative">
           {isAsap ? (
             <div className="flex flex-col items-center animate-fade-in">
               <Clock size={48} className="text-blue-200 mb-2" />
               <p className="text-lg font-black text-slate-900">15 - 20 минут</p>
               <p className="text-xs text-slate-400 font-medium">Примерное время ожидания</p>
             </div>
           ) : (
             <div className="relative w-full flex justify-center items-center animate-pop-in">
               <input 
                 type="time" 
                 value={scheduledTime}
                 onChange={(e) => setScheduledTime(e.target.value)}
                 className="absolute inset-0 w-full h-full opacity-0 z-20 cursor-pointer"
               />
               <div className="flex items-center justify-center gap-1 bg-blue-50/50 rounded-3xl px-8 py-2 border-2 border-transparent hover:border-blue-200 transition-colors">
                  <span className="text-6xl font-black text-slate-900 tracking-tight leading-none">{scheduledTime.split(':')[0] || '--'}</span>
                  <span className="text-4xl font-bold text-blue-300 mb-2 animate-pulse">:</span>
                  <span className="text-6xl font-black text-slate-900 tracking-tight leading-none">{scheduledTime.split(':')[1] || '--'}</span>
               </div>
               <p className="absolute -bottom-8 text-[10px] text-slate-400 font-bold uppercase tracking-wider pointer-events-none">
                 Нажмите, чтобы выбрать
               </p>
             </div>
           )}
        </div>

        {/* Address Display (Static) */}
        <div className="w-full flex items-center gap-3 mt-10 p-3 bg-gray-50 rounded-xl border border-transparent">
             <MapPin size={20} className="text-blue-600" />
             <div className="text-left">
               <p className="text-xs text-slate-400 font-bold">Адрес выдачи</p>
               <p className="text-sm font-bold text-slate-900">{selectedAddress}</p>
             </div>
        </div>
      </div>

      {/* Comment Section (Redesigned) */}
      <div className="bg-white rounded-[2rem] p-6 shadow-sm mb-6 animate-slide-up stagger-4 opacity-0 fill-mode-forwards border border-gray-100 relative group focus-within:ring-2 focus-within:ring-blue-100 transition-all duration-300">
        <div className="flex justify-between items-start mb-2">
           <div className="flex items-center gap-2">
             <MessageSquare size={16} className="text-blue-600" />
             <span className="text-xs font-black text-slate-900 uppercase tracking-wider">Комментарий к заказу</span>
           </div>
        </div>
        
        <textarea 
          placeholder="Напишите здесь ваши пожелания (например: без сахара, погорячее)..."
          value={orderComment}
          onChange={(e) => setOrderComment(e.target.value)}
          className="w-full bg-slate-50 rounded-xl p-3 text-sm text-slate-700 placeholder:text-slate-400 resize-none h-24 outline-none transition-colors"
        />
      </div>

      <div ref={checkoutSectionRef} className="bg-white p-6 rounded-[2.5rem] shadow-xl border border-gray-100 animate-slide-up stagger-5">
        <div className="space-y-3 mb-6">
          <div className="flex justify-between text-sm">
            <span className="text-slate-500 font-medium">Сумма заказа</span>
            <span className="font-bold text-slate-900">{subtotal}₽</span>
          </div>
          {bonusesToUse > 0 && (
            <div className="flex justify-between text-sm text-green-600 animate-pop-in">
              <span className="font-medium">Скидка баллами</span>
              <span className="font-bold">-{bonusesToUse}₽</span>
            </div>
          )}
        </div>

        <div className="flex justify-between mb-8">
          <span className="text-lg font-black text-slate-900">Итого</span>
          <div className="text-right">
            <span className="text-2xl font-black text-slate-900">{Math.round(total)}₽</span>
          </div>
        </div>
        
        <button 
          ref={payButtonRef}
          onClick={handlePay}
          className="w-full bg-blue-600 text-white py-5 rounded-[1.5rem] font-black uppercase text-xs tracking-[0.2em] shadow-lg shadow-blue-200 active:scale-95 transition-all flex items-center justify-center gap-3 duration-200"
        >
          <CreditCard size={18} />
          Оплатить {Math.round(total)} ₽
        </button>
      </div>

      {!isPayButtonVisible && (
        <div className="fixed bottom-24 right-6 z-50 animate-pop-in flex flex-col items-center">
          <div className="bg-white border-[3px] border-blue-600 text-blue-600 text-[10px] font-black px-3 py-1.5 rounded-full shadow-lg z-10 mb-[-14px] relative whitespace-nowrap">
            <span>{Math.round(total)} ₽</span>
          </div>
          <button 
            onClick={scrollToCheckout}
            className="w-16 h-16 bg-blue-600 text-white rounded-full shadow-[0_8px_30px_rgb(37,99,235,0.4)] flex items-center justify-center active:scale-90 transition-all group overflow-hidden"
          >
            <div className="absolute inset-0 bg-white/20 animate-pulse-soft pointer-events-none" />
            <ChevronDown size={32} strokeWidth={3} className="text-white" />
          </button>
        </div>
      )}
    </div>
  );
};
