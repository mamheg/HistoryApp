
import React, { useState } from 'react';
import { ArrowLeft, MessageCircle, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const FAQS = [
  { q: 'Как копятся баллы?', a: 'Вы получаете 5% кэшбэка баллами от суммы заказа только в том случае, если оплачиваете его полностью реальными деньгами. При использовании (списании) баллов в заказе новый кэшбэк за эту покупку не начисляется. 1 балл = 1 рубль.' },
  { q: 'Можно ли оплатить заказ полностью баллами?', a: 'Баллами можно оплатить до 50% от стоимости заказа.' },
  { q: 'Как работает предзаказ?', a: 'Выберите напиток, оплатите в приложении, и мы начнем готовить его к вашему приходу (обычно это занимает 10-15 минут).' },
  { q: 'Где посмотреть историю заказов?', a: 'В вашем профиле есть раздел "История заказов", там хранятся все ваши чеки.' },
];

export const SupportPage: React.FC = () => {
  const navigate = useNavigate();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFaq = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <div className="min-h-screen bg-[#F3F4F6] pb-24">
      <div className="bg-white p-4 border-b border-gray-100 sticky top-0 z-50 flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-gray-800 active:scale-90 transition-transform">
          <ArrowLeft size={24} />
        </button>
        <h1 className="font-bold text-lg">Поддержка</h1>
      </div>

      <div className="p-6">
        <div className="bg-blue-600 rounded-3xl p-6 text-white mb-8 shadow-xl shadow-blue-200">
          <MessageCircle size={32} className="mb-4" />
          <h2 className="text-xl font-bold mb-2">Нужна помощь?</h2>
          <p className="text-blue-100 text-sm leading-relaxed mb-6">Напишите нам в Telegram, и наш менеджер ответит вам в течение 5 минут.</p>
          <button className="w-full bg-white text-blue-600 py-4 rounded-2xl font-black uppercase text-xs tracking-widest shadow-lg active:scale-[0.98] transition-transform">Написать менеджеру</button>
        </div>

        <h3 className="text-lg font-bold text-slate-900 mb-4 px-1">Часто задаваемые вопросы</h3>
        <div className="space-y-3">
          {FAQS.map((faq, idx) => (
            <div 
              key={idx} 
              className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm animate-fade-in" 
              style={{ animationDelay: `${idx * 100}ms` }}
            >
              <button 
                onClick={() => toggleFaq(idx)}
                className="w-full flex justify-between items-center p-4 text-left active:bg-gray-50 transition-colors"
              >
                <span className="font-bold text-sm text-slate-800">{faq.q}</span>
                <ChevronDown 
                  size={18} 
                  className={`text-slate-400 transition-transform duration-300 ${openIndex === idx ? 'rotate-180' : ''}`} 
                />
              </button>
              
              <div 
                className={`transition-all duration-300 ease-in-out overflow-hidden ${
                  openIndex === idx ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <p className="px-4 pb-4 text-sm text-slate-500 leading-relaxed border-t border-slate-50 pt-3">
                  {faq.a}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
