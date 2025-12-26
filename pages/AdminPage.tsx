
import React, { useState, useRef, useEffect } from 'react';
import { 
  Plus, 
  Trash2, 
  Edit3, 
  ExternalLink,
  Coffee,
  ChevronRight,
  TrendingUp,
  ShoppingBag,
  Users,
  X,
  Save,
  Image as ImageIcon,
  Upload,
  AlertTriangle,
  Undo2,
  History,
  ArrowRight
} from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { useNavigate } from 'react-router-dom';
import { Product } from '../types';

interface Order {
  id: string;
  user: string;
  items: string;
  total: number;
  status: 'pending' | 'preparing' | 'ready';
  time: string;
}

export const AdminPage: React.FC = () => {
  const { products, categories, addProduct, updateProduct, deleteProduct, undoLastOperation, lastOperation } = useAppStore();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [activeTab, setActiveTab] = useState<'orders' | 'menu' | 'stats'>('orders');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  const [orders, setOrders] = useState<Order[]>([
    { id: '#4501', user: 'Марина И.', items: 'Капучино M, Синнабон', total: 460, status: 'preparing', time: '12:45' },
    { id: '#4502', user: 'Игорь С.', items: 'Флэт Уайт, Чизкейк', total: 520, status: 'pending', time: '12:50' },
    { id: '#4498', user: 'Дарья К.', items: 'Матча Латте', total: 290, status: 'ready', time: '12:30' },
  ]);

  const updateOrderStatus = (id: string, newStatus: Order['status']) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status: newStatus } : o));
  };

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending': return 'bg-amber-100 text-amber-600';
      case 'preparing': return 'bg-blue-100 text-blue-600';
      case 'ready': return 'bg-green-100 text-green-600';
    }
  };

  const handleEditProduct = (p: Product) => {
    setEditingProduct({...p});
    setIsEditModalOpen(true);
  };

  const handleAddNewProduct = () => {
    const newP: Product = {
      id: Date.now(),
      name: '',
      description: '',
      price: 0,
      imageUrl: '',
      categoryId: categories[0]?.id || 'coffee',
      modifiers: {
        sizes: [{ id: 'm', name: 'M (300мл)', price: 0 }],
        milks: [],
        syrups: []
      }
    };
    setEditingProduct(newP);
    setIsEditModalOpen(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && editingProduct) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditingProduct({ ...editingProduct, imageUrl: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const saveProduct = () => {
    if (!editingProduct) return;
    const exists = products.find(p => p.id === editingProduct.id);
    if (exists) {
      updateProduct(editingProduct);
    } else {
      addProduct(editingProduct);
    }
    setIsEditModalOpen(false);
  };

  const confirmDelete = () => {
    if (productToDelete) {
      deleteProduct(productToDelete.id);
      setProductToDelete(null);
    }
  };

  const tabIndex = activeTab === 'orders' ? 0 : activeTab === 'menu' ? 1 : 2;

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-24 relative overflow-x-hidden">
      {/* Header */}
      <div className="bg-slate-900 text-white p-6 rounded-b-[2.5rem] shadow-lg mb-6 animate-fade-in">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
              <Coffee size={24} />
            </div>
            <div>
              <h1 className="text-xl font-bold">Панель Управления</h1>
              <p className="text-slate-400 text-xs">Администрирование H🪶STORY</p>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4">
        {/* View Switcher */}
        <button 
          onClick={() => navigate('/')}
          className="w-full mb-6 bg-white border border-slate-200 p-4 rounded-2xl flex items-center justify-between shadow-sm active:scale-[0.98] transition-all"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center">
              <ExternalLink size={20} />
            </div>
            <div className="text-left">
              <p className="text-sm font-bold text-slate-900">Режим клиента</p>
              <p className="text-xs text-slate-500">Посмотреть меню и корзину</p>
            </div>
          </div>
          <ChevronRight size={20} className="text-slate-300" />
        </button>

        {/* Tabs with Slider */}
        <div className="relative flex gap-1 bg-white p-1 rounded-2xl border border-slate-200 mb-6">
          <div 
            className="absolute top-1 bottom-1 bg-slate-900 rounded-xl transition-all duration-300 ease-out shadow-lg"
            style={{ 
              width: 'calc(33.33% - 2.6px)', 
              left: `calc(${tabIndex * 33.33}% + ${tabIndex === 0 ? '4px' : tabIndex === 1 ? '1px' : '-2px'})` 
            }}
          />
          {(['orders', 'menu', 'stats'] as const).map(tab => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-3 rounded-xl font-bold text-xs transition-all uppercase tracking-wider relative z-10 ${activeTab === tab ? 'text-white' : 'text-slate-400'}`}
            >
              {tab === 'orders' ? 'Заказы' : tab === 'menu' ? 'Меню' : 'Статистика'}
            </button>
          ))}
        </div>

        {/* Content: Orders */}
        {activeTab === 'orders' && (
          <div className="space-y-4 animate-slide-up">
            <div className="flex justify-between items-center mb-2 px-1">
              <h2 className="text-lg font-bold text-slate-900">Текущие заказы</h2>
              <span className="text-xs bg-slate-200 text-slate-600 px-2 py-1 rounded-lg font-bold">{orders.length}</span>
            </div>
            {orders.map((order) => (
              <div key={order.id} className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <span className="text-xs font-mono text-slate-400 font-bold uppercase">{order.id} • {order.time}</span>
                    <h3 className="text-lg font-black text-slate-900">{order.user}</h3>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${getStatusColor(order.status)}`}>
                    {order.status === 'pending' ? 'В ожидании' : order.status === 'preparing' ? 'Готовится' : 'Готов'}
                  </span>
                </div>
                <p className="text-sm text-slate-500 mb-4">{order.items}</p>
                <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                  <span className="text-lg font-bold">{order.total} ₽</span>
                  <div className="flex gap-2">
                    {order.status === 'pending' && <button onClick={() => updateOrderStatus(order.id, 'preparing')} className="bg-blue-600 text-white px-4 py-2 rounded-xl text-xs font-bold">Принять</button>}
                    {order.status === 'preparing' && <button onClick={() => updateOrderStatus(order.id, 'ready')} className="bg-green-600 text-white px-4 py-2 rounded-xl text-xs font-bold">Готов</button>}
                    {order.status === 'ready' && <button onClick={() => updateOrderStatus(order.id, 'pending')} className="bg-slate-100 text-slate-400 px-4 py-2 rounded-xl text-xs font-bold">Завершен</button>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Content: Menu Management */}
        {activeTab === 'menu' && (
          <div className="space-y-4 animate-slide-up">
            {/* Last Operation Section */}
            {lastOperation && (
              <div className="bg-white border border-blue-100 p-5 rounded-[2rem] shadow-sm mb-6 animate-pop-in overflow-hidden relative group">
                {/* Decorative background accent */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-full -mr-12 -mt-12 transition-transform group-hover:scale-110 duration-500" />
                
                <div className="flex items-center gap-2 text-blue-600 mb-4 relative z-10">
                  <History size={16} />
                  <span className="text-[10px] font-black uppercase tracking-[0.2em]">Последняя операция</span>
                </div>
                
                <div className="flex items-start gap-4 mb-6 relative z-10">
                   <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-sm ${
                     lastOperation.type === 'update' ? 'bg-orange-50 text-orange-600' : 
                     lastOperation.type === 'add' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
                   }`}>
                      {lastOperation.type === 'update' ? <Edit3 size={20} /> : 
                       lastOperation.type === 'add' ? <Plus size={20} /> : <Trash2 size={20} />}
                   </div>
                   <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-slate-900 truncate">
                        {lastOperation.type === 'update' ? 'Отредактировано:' : 
                         lastOperation.type === 'add' ? 'Добавлено:' : 'Удалено:'} {lastOperation.productName}
                      </p>
                      {lastOperation.changes && (
                        <div className="mt-2 space-y-1 bg-slate-50/50 p-2 rounded-xl border border-slate-100">
                          {lastOperation.changes.map((ch, i) => (
                            <div key={i} className="flex items-center gap-1.5 text-[10px] text-slate-500 font-bold uppercase tracking-tight">
                              <span className="text-slate-400">{ch.field}:</span>
                              <span className="text-slate-600">{ch.from}</span>
                              <ArrowRight size={10} className="text-slate-300" />
                              <span className="text-blue-600">{ch.to}</span>
                            </div>
                          ))}
                        </div>
                      )}
                   </div>
                </div>

                <div className="pt-4 border-t border-slate-50 relative z-10">
                  <button 
                    onClick={undoLastOperation}
                    className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-3 rounded-xl text-xs font-black uppercase tracking-widest active:scale-[0.98] transition-all shadow-lg shadow-blue-100"
                  >
                    <Undo2 size={14} />
                    Отменить последнее действие
                  </button>
                </div>
              </div>
            )}

            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-slate-900">Каталог товаров</h2>
              <button 
                onClick={handleAddNewProduct}
                className="bg-blue-600 text-white p-2 rounded-xl shadow-lg active:scale-90 transition-all"
              >
                <Plus size={20} />
              </button>
            </div>
            {products.map((p) => (
              <div key={p.id} className="bg-white p-4 rounded-3xl shadow-sm flex items-center gap-4 border border-slate-100">
                <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center p-2">
                  <img src={p.imageUrl} alt={p.name} className="max-w-full max-h-full object-contain" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-slate-900 text-sm">{p.name}</h3>
                  <p className="text-xs text-slate-400">{p.price} ₽</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleEditProduct(p)} className="p-2 bg-slate-50 text-slate-500 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-colors">
                    <Edit3 size={18} />
                  </button>
                  <button onClick={() => setProductToDelete(p)} className="p-2 bg-slate-50 text-slate-500 rounded-lg hover:bg-red-50 hover:text-red-600 transition-colors">
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Content: Stats */}
        {activeTab === 'stats' && (
          <div className="space-y-6 animate-slide-up">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100">
                <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-3">
                  <ShoppingBag size={20} />
                </div>
                <p className="text-2xl font-black text-slate-900">128</p>
                <p className="text-xs text-slate-400 font-bold uppercase">Заказов</p>
              </div>
              <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100">
                <div className="w-10 h-10 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center mb-3">
                  <Users size={20} />
                </div>
                <p className="text-2xl font-black text-slate-900">8.4к</p>
                <p className="text-xs text-slate-400 font-bold uppercase">Бонусов</p>
              </div>
              <div className="col-span-2 bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-400 font-bold uppercase mb-1">Общая выручка</p>
                  <p className="text-3xl font-black text-slate-900">42 500 ₽</p>
                </div>
                <div className="w-12 h-12 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center">
                  <TrendingUp size={24} />
                </div>
              </div>
            </div>
            
            <div className="bg-slate-900 text-white p-6 rounded-3xl shadow-lg">
              <h3 className="font-bold mb-2">Аналитика недели</h3>
              <p className="text-slate-400 text-xs mb-4">Статистика продаж по категориям</p>
              <div className="space-y-3">
                {categories.map(cat => (
                  <div key={cat.id}>
                    <div className="flex justify-between text-[10px] font-bold uppercase mb-1">
                      <span>{cat.name}</span>
                      <span>{Math.floor(Math.random() * 100)}%</span>
                    </div>
                    <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500 rounded-full" style={{ width: `${Math.floor(Math.random() * 80) + 20}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {productToDelete && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center px-6 animate-fade-in">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setProductToDelete(null)} />
          <div className="bg-white w-full max-sm rounded-[2.5rem] p-8 relative z-[111] shadow-2xl animate-pop-in text-center">
            <div className="w-16 h-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <AlertTriangle size={32} />
            </div>
            <h2 className="text-xl font-black text-slate-900 mb-2">Удалить позицию?</h2>
            <p className="text-slate-500 text-sm mb-8">
              Вы уверены, что хотите удалить <span className="font-bold text-slate-900">«{productToDelete.name}»</span>? Это действие можно будет отменить.
            </p>
            <div className="flex flex-col gap-3">
              <button 
                onClick={confirmDelete}
                className="w-full bg-red-500 text-white py-4 rounded-2xl font-bold shadow-lg shadow-red-200 active:scale-95 transition-all"
              >
                Да, удалить
              </button>
              <button 
                onClick={() => setProductToDelete(null)}
                className="w-full bg-slate-100 text-slate-500 py-4 rounded-2xl font-bold active:scale-95 transition-all"
              >
                Отмена
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Product Modal */}
      {isEditModalOpen && editingProduct && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center animate-fade-in">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsEditModalOpen(false)} />
          <div className="bg-white w-full max-w-lg rounded-t-[2.5rem] p-6 pb-12 relative z-[101] shadow-2xl animate-slide-up max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-black text-slate-900">
                {products.find(p => p.id === editingProduct.id) ? 'Редактировать' : 'Новый товар'}
              </h2>
              <button onClick={() => setIsEditModalOpen(false)} className="p-2 bg-slate-100 rounded-full"><X size={20} /></button>
            </div>

            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="w-24 h-24 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400 overflow-hidden relative group">
                  {editingProduct.imageUrl ? (
                    <img src={editingProduct.imageUrl} className="w-full h-full object-contain" />
                  ) : (
                    <ImageIcon size={24} />
                  )}
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity"
                  >
                    <Upload size={20} />
                  </button>
                  <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
                </div>
                <div className="flex-1 space-y-3">
                  <input 
                    type="text" 
                    placeholder="Название товара"
                    className="w-full bg-slate-50 border-none rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-500"
                    value={editingProduct.name}
                    onChange={e => setEditingProduct({...editingProduct, name: e.target.value})}
                  />
                  <input 
                    type="number" 
                    placeholder="Цена (₽)"
                    className="w-full bg-slate-50 border-none rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-500"
                    value={editingProduct.price || ''}
                    onChange={e => setEditingProduct({...editingProduct, price: Number(e.target.value)})}
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase mb-2 block">Категория</label>
                <select 
                  className="w-full bg-slate-50 border-none rounded-xl p-3 text-sm"
                  value={editingProduct.categoryId}
                  onChange={e => setEditingProduct({...editingProduct, categoryId: e.target.value})}
                >
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase mb-2 block">Описание</label>
                <textarea 
                  placeholder="Опишите продукт..."
                  className="w-full bg-slate-50 border-none rounded-xl p-3 text-sm h-24 resize-none"
                  value={editingProduct.description}
                  onChange={e => setEditingProduct({...editingProduct, description: e.target.value})}
                />
              </div>

              <button 
                onClick={saveProduct}
                className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold shadow-lg shadow-blue-200 flex items-center justify-center gap-2 active:scale-95 transition-all"
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
