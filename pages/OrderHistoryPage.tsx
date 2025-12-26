
import React from 'react';
import { ArrowLeft, Clock, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';

export const OrderHistoryPage: React.FC = () => {
  const navigate = useNavigate();
  const orderHistory = useAppStore(state => state.orderHistory);

  return (
    <div className="min-h-screen bg-[#F3F4F6] pb-24">
      <div className="bg-white p-4 border-b border-gray-100 sticky top-0 z-50 flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-gray-800 active:scale-90 transition-transform">
          <ArrowLeft size={24} />
        </button>
        <h1 className="font-bold text-lg">История заказов</h1>
      </div>

      <div className="p-4 space-y-4">
        {orderHistory.map((order, idx) => (
          <div key={order.id} className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100 animate-slide-up" style={{ animationDelay: `${idx * 100}ms` }}>
            <div className="flex justify-between items-start mb-3">
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">{order.id} • {order.date}</p>
                <p className="text-sm font-bold text-slate-800 mt-1">{order.items}</p>
              </div>
              <div className="flex items-center gap-1 bg-green-50 text-green-600 px-2 py-1 rounded-full text-[10px] font-bold uppercase">
                <CheckCircle size={10} />
                Выполнен
              </div>
            </div>
            <div className="pt-3 border-t border-slate-50 flex justify-between items-center">
              <span className="text-sm text-slate-400">Сумма заказа</span>
              <span className="text-lg font-black text-slate-900">{order.total} ₽</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
