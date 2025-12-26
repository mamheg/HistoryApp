
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Search, 
  ArrowUp, 
  X, 
  ShieldAlert, 
  ChevronRight, 
  ShoppingBag, 
  Heart, 
  Sparkles,
  Plus,
  Instagram
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import { LoyaltyCard } from '../components/LoyaltyCard';
import { ProductModal } from '../components/ProductModal';
import { Product, CartItem } from '../types';

export const MenuPage: React.FC = () => {
  const navigate = useNavigate();
  
  const user = useAppStore(state => state.user);
  const isAdmin = useAppStore(state => state.isAdmin);
  const products = useAppStore(state => state.products);
  const categories = useAppStore(state => state.categories);
  const activeCategory = useAppStore(state => state.activeCategory);
  const setActiveCategory = useAppStore(state => state.setActiveCategory);
  const addToCart = useAppStore(state => state.addToCart);
  const cart = useAppStore(state => state.cart);
  const favorites = useAppStore(state => state.favorites);
  const toggleFavorite = useAppStore(state => state.toggleFavorite);
  const orderStats = useAppStore(state => state.orderStats);

  const cartTotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const cartItemsCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const [searchTerm, setSearchTerm] = useState('');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isCartAnimating, setIsCartAnimating] = useState(false);
  
  const categoryRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const tabsContainerRef = useRef<HTMLDivElement>(null);
  const loyaltyRef = useRef<HTMLDivElement>(null);
  const prevItemsCount = useRef(cartItemsCount);
  
  const isManualScroll = useRef(false);
  const scrollTimeout = useRef<any>(null);

  const HEADER_OFFSET = 220; 

  useEffect(() => {
    if (cartItemsCount > prevItemsCount.current) {
      setIsCartAnimating(true);
      const timer = setTimeout(() => setIsCartAnimating(false), 300);
      return () => clearTimeout(timer);
    }
    prevItemsCount.current = cartItemsCount;
  }, [cartItemsCount]);

  const topProduct = useMemo(() => {
    const sorted = products
      .filter(p => (orderStats[p.id] || 0) > 0)
      .sort((a, b) => (orderStats[b.id] || 0) - (orderStats[a.id] || 0));
    return sorted.length > 0 ? sorted[0] : null;
  }, [products, orderStats]);

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFavorites = !showFavoritesOnly || favorites.includes(p.id);
      return matchesSearch && matchesFavorites;
    });
  }, [searchTerm, showFavoritesOnly, favorites, products]);

  const visibleCategories = useMemo(() => {
    return categories.filter(cat => 
      filteredProducts.some(p => p.categoryId === cat.id)
    );
  }, [filteredProducts, categories]);

  const handleAddToCart = (item: CartItem) => {
    addToCart(item);
    setIsModalOpen(false);
  };

  useEffect(() => {
    const handleScroll = () => {
      if (!visibleCategories.length) return;

      if (loyaltyRef.current) {
        const threshold = loyaltyRef.current.offsetHeight + loyaltyRef.current.offsetTop + 120; 
        setShowScrollTop(window.scrollY > threshold);
      } else {
        setShowScrollTop(window.scrollY > 400);
      }

      if (isManualScroll.current) return;
      const scrollPosition = window.scrollY + HEADER_OFFSET;
      
      let currentActiveId = visibleCategories[0]?.id || (categories.length > 0 ? categories[0].id : '');
      
      for (const cat of visibleCategories) {
        const element = categoryRefs.current[cat.id];
        if (element && element.offsetTop <= scrollPosition) {
          currentActiveId = cat.id;
        }
      }
      
      const currentStoredCategory = useAppStore.getState().activeCategory;
      if (currentActiveId && currentActiveId !== currentStoredCategory) {
        useAppStore.getState().setActiveCategory(currentActiveId);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [visibleCategories, categories]);

  useEffect(() => {
    const tabElement = document.getElementById(`tab-${activeCategory}`);
    const container = tabsContainerRef.current;
    if (tabElement && container) {
      const containerWidth = container.offsetWidth;
      const tabLeft = tabElement.offsetLeft;
      const tabWidth = tabElement.offsetWidth;
      const scrollLeft = tabLeft - (containerWidth / 2) + (tabWidth / 2);
      container.scrollTo({ left: scrollLeft, behavior: 'smooth' });
    }
  }, [activeCategory]);

  const handleCategoryClick = (categoryId: string) => {
    const element = categoryRefs.current[categoryId];
    if (element) {
      let offsetPosition = 0;
      if (visibleCategories.length > 0 && visibleCategories[0].id === categoryId) {
        offsetPosition = 0;
      } else {
        const elementPosition = element.getBoundingClientRect().top;
        offsetPosition = elementPosition + window.scrollY - HEADER_OFFSET;
      }
      isManualScroll.current = true;
      if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
      setActiveCategory(categoryId);
      scrollTimeout.current = setTimeout(() => { isManualScroll.current = false; }, 1000);
    }
  };

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleToggleFavorite = (e: React.MouseEvent, productId: number) => {
    e.stopPropagation();
    toggleFavorite(productId);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderProductCard = (product: Product, index: number, isFavMode = false) => (
    <div
      key={`${product.id}-${isFavMode ? 'fav' : 'list'}`}
      onClick={() => handleProductClick(product)}
      style={{ animationDelay: `${Math.min(index, 12) * 70}ms` }}
      className="bg-white p-3 rounded-2xl shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col active:scale-[0.96] animate-slide-up opacity-0 fill-mode-forwards relative overflow-hidden"
    >
      <div className="aspect-square rounded-xl overflow-hidden mb-3 bg-gray-50 relative p-2">
        <img src={product.imageUrl} alt={product.name} className="w-full h-full object-contain" />
        <button 
          onClick={(e) => handleToggleFavorite(e, product.id)}
          className={`absolute top-1.5 right-1.5 p-1.5 rounded-full shadow-sm z-10 transition-all ${
            favorites.includes(product.id) ? 'bg-white text-red-500' : 'bg-white/80 backdrop-blur-md text-gray-500'
          }`}
        >
          <Heart size={14} fill={favorites.includes(product.id) ? "currentColor" : "none"} />
        </button>
      </div>
      <h3 className="font-semibold text-gray-900 text-sm mb-1 line-clamp-2 leading-tight">{product.name}</h3>
      <div className="mt-auto flex items-center justify-between">
        <span className="font-bold text-gray-900">{product.price}₽</span>
        <div className="w-9 h-9 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center transition-transform active:scale-90">
          <Plus size={18} strokeWidth={3} />
        </div>
      </div>
    </div>
  );

  if (!user) return null;

  return (
    <div className="pb-32 pt-4 bg-[#F3F4F6] min-h-screen relative">
      <div className="px-4 mb-4" ref={loyaltyRef}>
        {isAdmin && (
          <button 
            onClick={() => navigate('/admin')}
            className="w-full mb-4 bg-slate-900 text-white p-4 rounded-2xl flex items-center justify-between shadow-lg active:scale-[0.98] transition-all animate-pop-in"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <ShieldAlert size={18} />
              </div>
              <p className="text-sm font-bold">Панель администратора</p>
            </div>
            <ChevronRight size={18} className="text-slate-300" />
          </button>
        )}
        <div className="animate-pop-in">
          <LoyaltyCard user={user} />
        </div>
      </div>

      <div className="sticky top-0 z-40 bg-[#F3F4F6]/95 backdrop-blur-md pt-2 pb-1 border-b border-gray-200/50 shadow-sm transition-all duration-300">
        
        <div className="flex items-center justify-center py-3 mb-1 animate-fade-in">
           <h1 className="font-serif text-2xl font-bold tracking-[0.2em] text-[#736153] flex items-center gap-1 select-none">
             H<span className="text-xl transform -rotate-12 filter sepia-[.5] opacity-80">🪶</span>STORY
           </h1>
        </div>

        <div className="px-4 mb-4 flex gap-2">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-500" />
            </div>
            <input
              type="text"
              placeholder="Поиск в меню..."
              className="block w-full pl-10 pr-10 py-3 border-none rounded-xl bg-white text-gray-900 shadow-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all focus:scale-[1.01] placeholder:text-gray-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button onClick={() => setSearchTerm('')} className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500">
                <X className="h-5 w-5" />
              </button>
            )}
          </div>
          <button 
            onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
            className={`p-3 rounded-xl transition-all shadow-sm flex items-center justify-center ${
              showFavoritesOnly ? 'bg-red-50 text-red-500 ring-2 ring-red-100 scale-105' : 'bg-white text-gray-500 hover:text-gray-700'
            }`}
          >
            <Heart size={20} fill={showFavoritesOnly ? "currentColor" : "none"} />
          </button>
        </div>
        
        {/* Скрываем категории, если включен фильтр избранного */}
        <div 
          className={`transition-all duration-300 ease-in-out overflow-hidden ${showFavoritesOnly ? 'max-h-0 opacity-0' : 'max-h-14 opacity-100'}`}
        >
          <div ref={tabsContainerRef} className="flex overflow-x-auto space-x-2 px-4 pb-4 no-scrollbar scroll-smooth">
            {visibleCategories.map((cat) => (
              <button
                key={cat.id}
                id={`tab-${cat.id}`}
                onClick={() => handleCategoryClick(cat.id)}
                className={`whitespace-nowrap px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
                  activeCategory === cat.id ? 'bg-[#b7ad98] text-white shadow-md' : 'bg-white text-gray-600 border border-gray-100'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="px-4 space-y-8 mt-6">
        {!searchTerm && !showFavoritesOnly && topProduct && (
          <div className="animate-fade-in">
            <h2 className="text-xl font-black text-gray-900 mb-4 px-1 flex items-center gap-2">
              <span>Ваш фаворит</span>
              <Sparkles size={18} className="text-blue-500 animate-pulse" />
            </h2>
            <div 
              onClick={() => handleProductClick(topProduct)}
              className="bg-white p-5 rounded-[2.5rem] shadow-xl border border-blue-50 flex items-center gap-6 active:scale-[0.98] transition-all cursor-pointer relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-500" />
              <div className="w-32 h-32 bg-gray-50 rounded-3xl p-3 shrink-0 relative z-10">
                <img src={topProduct.imageUrl} alt={topProduct.name} className="w-full h-full object-contain drop-shadow-lg" />
              </div>
              <div className="flex-1 relative z-10">
                <div className="flex items-center gap-2 mb-1">
                   <span className="text-[10px] font-black uppercase text-blue-500 tracking-widest">Часто заказываете</span>
                </div>
                <h3 className="text-lg font-black text-gray-900 leading-tight mb-2">{topProduct.name}</h3>
                <div className="flex items-center justify-between">
                  <span className="text-xl font-black text-slate-900">{topProduct.price} ₽</span>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={(e) => handleToggleFavorite(e, topProduct.id)}
                      className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                        favorites.includes(topProduct.id) ? 'bg-red-50 text-red-500 shadow-sm' : 'bg-gray-50 text-gray-500'
                      }`}
                    >
                      <Heart size={20} fill={favorites.includes(topProduct.id) ? "currentColor" : "none"} />
                    </button>
                    <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-200">
                      <Plus size={20} strokeWidth={3} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {showFavoritesOnly ? (
            <div className="animate-fade-in min-h-[300px]">
                <div className="flex items-center justify-between mb-6 px-1">
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-bold text-gray-900">Избранные товары</h2>
                    {filteredProducts.length > 0 && (
                      <span className="text-xs font-bold bg-red-100 text-red-500 px-2 py-0.5 rounded-full animate-pop-in">
                        {filteredProducts.length}
                      </span>
                    )}
                  </div>
                </div>
                
                {filteredProducts.length > 0 ? (
                    <div className="grid grid-cols-2 gap-4">
                        {filteredProducts.map((product, index) => renderProductCard(product, index, true))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-16 text-center animate-slide-up">
                         <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-5 relative">
                            <Heart size={36} className="text-slate-300" />
                            <div className="absolute top-0 right-0 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-sm">
                              <Plus size={12} className="text-slate-400" />
                            </div>
                         </div>
                         <p className="text-slate-600 font-bold mb-1 text-lg">Список избранного пуст</p>
                         <p className="text-xs text-slate-400 max-w-[200px] leading-relaxed">
                           Отмечайте любимые товары сердечком, чтобы они появились здесь
                         </p>
                    </div>
                )}
            </div>
        ) : (
            visibleCategories.map((cat) => {
              const categoryProducts = filteredProducts.filter(p => p.categoryId === cat.id);
              if (categoryProducts.length === 0) return null;
              
              return (
                <div key={cat.id} ref={(el) => { categoryRefs.current[cat.id] = el; }} className="scroll-mt-40">
                  <h2 className="text-xl font-bold text-gray-900 mb-4 px-1">{cat.name}</h2>
                  <div className="grid grid-cols-2 gap-4">
                    {categoryProducts.map((product, index) => renderProductCard(product, index))}
                  </div>
                </div>
              );
            })
        )}

        <div className="pt-8 pb-12 text-center animate-fade-in stagger-6 opacity-0 fill-mode-forwards">
          <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em] mb-4">Мы в соцсетях</p>
          <div className="flex justify-center gap-4">
            <a href="https://t.me/hoffee" target="_blank" rel="noreferrer" className="w-14 h-14 bg-white rounded-2xl shadow-sm flex items-center justify-center text-slate-500 hover:text-blue-500 transition-all active:scale-90 border border-gray-50 overflow-hidden">
              <svg viewBox="0 0 100 100" className="w-9 h-9">
                <path d="M72.5,28.5L25.5,46.5c-3.2,1.3-3.2,3.1-0.6,3.9l12,3.7l27.8-17.5c1.3-0.8,2.5-0.4,1.5,0.5L43.7,56.3l-0.8,12.5 c1.2,0,1.7-0.6,2.4-1.2l5.8-5.6l12,8.8c2.2,1.2,3.8,0.6,4.4-2.1l7.8-37.1C76.2,28.2,74.9,27.5,72.5,28.5z" fill="currentColor"/>
              </svg>
            </a>
            <a href="https://instagram.com/hoffee" target="_blank" rel="noreferrer" className="w-14 h-14 bg-white rounded-2xl shadow-sm flex items-center justify-center text-slate-500 hover:text-pink-500 transition-all active:scale-90 border border-gray-50">
              <Instagram size={24} />
            </a>
            <a href="https://vk.com/hoffee" target="_blank" rel="noreferrer" className="w-14 h-14 bg-white rounded-2xl shadow-sm flex items-center justify-center text-slate-500 hover:text-blue-600 transition-all active:scale-90 border border-gray-50 overflow-hidden">
              <svg viewBox="0 0 100 100" className="w-10 h-10">
                <path d="M54.5,70c-18.1,0-28.4-12.4-28.9-33h9.1c0.4,15.1,7,21.5,12.3,22.9v-22.9h8.6v13.1c5.3-0.5,10.7-6.5,12.5-13.1h8.6 c-1.5,8.1-7.5,14.1-11.8,16.6c4.3,2.1,11.2,7.3,13.8,16.4h-9.5c-2-6.3-7-11.2-13.6-11.8v11.8H54.5z" fill="currentColor"/>
              </svg>
            </a>
          </div>
          <p className="mt-8 text-[9px] text-slate-500 font-bold uppercase tracking-wider">H<span className="grayscale opacity-50">🪶</span>STORY © 2026 • Сделано с любовью</p>
        </div>
      </div>

      {cartItemsCount > 0 && (
        <div className={`fixed bottom-24 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 ${isCartAnimating ? 'scale-105' : 'scale-100'}`}>
          <div 
            onClick={() => navigate('/cart')}
            className={`bg-white/70 backdrop-blur-xl border border-white/40 p-1.5 pl-6 rounded-full shadow-[0_10px_40px_-10px_rgba(0,0,0,0.15)] flex items-center gap-4 cursor-pointer active:scale-95 transition-all hover:bg-white/80 ${isCartAnimating ? 'ring-2 ring-blue-500/20' : ''}`}
          >
            <div className="flex flex-col items-start">
              <span className="text-sm font-black text-slate-900 leading-none mb-0.5">{cartTotal} ₽</span>
              <span className={`text-[10px] font-bold text-slate-600 leading-none transition-colors ${isCartAnimating ? 'text-blue-600' : ''}`}>
                {cartItemsCount} тов.
              </span>
            </div>
            <div className={`w-11 h-11 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-lg shadow-blue-500/30 transition-transform ${isCartAnimating ? 'scale-110 rotate-12' : ''}`}>
              <ShoppingBag size={18} strokeWidth={2.5} className="animate-bounce-subtle" />
            </div>
          </div>
        </div>
      )}

      {showScrollTop && (
        <button 
          onClick={scrollToTop} 
          className={`fixed ${cartItemsCount > 0 ? 'bottom-44' : 'bottom-28'} right-6 z-50 p-3 bg-white/80 backdrop-blur-md text-blue-600 rounded-full shadow-lg transition-all active:scale-90`}
        >
          <ArrowUp size={24} strokeWidth={2.5} />
        </button>
      )}

      <ProductModal product={selectedProduct} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onAddToCart={handleAddToCart} />
    </div>
  );
};
