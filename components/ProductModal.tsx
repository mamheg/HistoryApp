import React, { useState, useRef, useEffect } from 'react';
import { X, ArrowLeft, Plus, Milk, Droplets, Heart } from 'lucide-react';
import { Product, ProductModifier, CartItem } from '../types';
import { useAppStore } from '../store/useAppStore';

interface ProductModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (item: CartItem) => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({ product, isOpen, onClose, onAddToCart }) => {
  const [selectedSize, setSelectedSize] = useState<ProductModifier | null>(null);
  const [selectedMilk, setSelectedMilk] = useState<ProductModifier | null>(null);
  const [selectedSyrup, setSelectedSyrup] = useState<ProductModifier | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [videoError, setVideoError] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const favorites = useAppStore(state => state.favorites);
  const toggleFavorite = useAppStore(state => state.toggleFavorite);

  useEffect(() => {
    if (product) {
      setSelectedSize(product.modifiers?.sizes[0] || null);
      setSelectedMilk(product.modifiers?.milks[0] || null);
      setSelectedSyrup(null);
      setQuantity(1);
      setVideoError(false);
    }
  }, [product]);

  // Reset and play video when modal opens
  useEffect(() => {
    if (isOpen && product?.videoUrl && videoRef.current && !videoError) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => setVideoError(true));
    }
  }, [isOpen, product?.videoUrl, videoError]);

  if (!isOpen || !product) return null;

  const isFavorite = favorites.includes(product.id);
  const hasVideo = product.videoUrl && !videoError;

  const calculateTotal = () => {
    let total = product.price;
    if (selectedSize) total += selectedSize.price;
    if (selectedMilk) total += selectedMilk.price;
    if (selectedSyrup) total += selectedSyrup.price;
    return total * quantity;
  };

  const handleAddToCart = () => {
    const modifiers = [
      selectedSize?.name,
      selectedMilk?.name,
      selectedSyrup?.name
    ].filter(Boolean) as string[];

    const uniqueId = `${product.id}-${selectedSize?.id || 'def'}-${selectedMilk?.id || 'def'}-${selectedSyrup?.id || 'none'}`;

    onAddToCart({
      uniqueId,
      productId: product.id,
      productName: product.name,
      price: calculateTotal() / quantity,
      quantity,
      imageUrl: product.imageUrl,
      selectedModifiers: modifiers,
    });
  };

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavorite(product.id);
  };

  const totalPrice = calculateTotal();

  return (
    <div className="fixed inset-0 z-[60] bg-white flex flex-col animate-slide-up font-sans">
      <div className="flex justify-between items-center p-4 border-b border-gray-50 bg-white z-10">
        <button onClick={onClose} className="p-2 -ml-2 text-gray-800 active:opacity-60 transition-opacity active:scale-90">
          <ArrowLeft size={24} />
        </button>
        <h1 className="font-bold text-lg tracking-wide uppercase text-gray-900 animate-fade-in">ДЕТАЛИ</h1>
        <button onClick={onClose} className="p-2 -mr-2 text-gray-800 active:opacity-60 transition-opacity active:scale-90">
          <X size={24} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar bg-white">
        <div className="w-full h-[40vh] flex items-center justify-center p-4 bg-white animate-pop-in">
          {hasVideo ? (
            <video
              ref={videoRef}
              src={product.videoUrl}
              poster={product.imageUrl}
              className="h-full w-auto object-contain drop-shadow-xl rounded-2xl"
              autoPlay
              muted
              playsInline
              preload="auto"
              onError={() => setVideoError(true)}
            />
          ) : (
            <img
              src={product.imageUrl}
              alt={product.name}
              className="h-full w-auto object-contain drop-shadow-xl"
            />
          )}
        </div>

        <div className="px-6 pb-40 animate-slide-up stagger-1">
          <div className="flex items-center justify-center gap-3 mb-8">
            <h2 className="text-2xl font-bold text-gray-900">{product.name}</h2>
            <button
              onClick={handleToggleFavorite}
              className={`p-1.5 rounded-full transition-all active:scale-90 ${isFavorite ? 'text-red-500 bg-red-50' : 'text-gray-300 bg-gray-50'
                }`}
            >
              <Heart size={20} fill={isFavorite ? "currentColor" : "none"} />
            </button>
          </div>

          {(product.modifiers?.milks?.length || product.modifiers?.syrups?.length) ? (
            <div className="mb-8">
              <h3 className="font-semibold text-gray-900 mb-2 text-base">Настройка</h3>
              <div className="flex gap-4 overflow-x-auto py-4 no-scrollbar -mx-6 px-6">
                {product.modifiers?.milks?.map(milk => (
                  <button
                    key={milk.id}
                    onClick={() => setSelectedMilk(selectedMilk?.id === milk.id ? null : milk)}
                    className="flex flex-col items-center gap-2 min-w-[72px] group active:scale-95 transition-transform duration-200"
                  >
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 border-2 ${selectedMilk?.id === milk.id
                      ? 'bg-blue-50 border-blue-500 shadow-md scale-105'
                      : 'bg-gray-50 border-transparent group-hover:bg-gray-100'
                      }`}>
                      <Milk size={24} className={`transition-colors duration-300 ${selectedMilk?.id === milk.id ? 'text-blue-600' : 'text-gray-400'}`} />
                    </div>
                    <span className="text-xs text-center font-medium text-gray-700 leading-tight w-full truncate px-1">
                      {milk.name}
                    </span>
                    {milk.price > 0 && (
                      <span className="text-[10px] font-medium text-gray-400">+{milk.price}₽</span>
                    )}
                  </button>
                ))}

                {product.modifiers?.syrups?.map(syrup => (
                  <button
                    key={syrup.id}
                    onClick={() => setSelectedSyrup(selectedSyrup?.id === syrup.id ? null : syrup)}
                    className="flex flex-col items-center gap-2 min-w-[72px] group active:scale-95 transition-transform duration-200"
                  >
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 border-2 ${selectedSyrup?.id === syrup.id
                      ? 'bg-orange-50 border-orange-500 shadow-md scale-105'
                      : 'bg-gray-50 border-transparent group-hover:bg-gray-100'
                      }`}>
                      <Droplets size={24} className={`transition-colors duration-300 ${selectedSyrup?.id === syrup.id ? 'text-orange-600' : 'text-gray-400'}`} />
                    </div>
                    <span className="text-xs text-center font-medium text-gray-700 leading-tight w-full truncate px-1">
                      {syrup.name}
                    </span>
                    {syrup.price > 0 && (
                      <span className="text-[10px] font-medium text-gray-400">+{syrup.price}₽</span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          ) : null}

          <div className="mb-6">
            <h3 className="font-semibold text-gray-900 mb-2">Описание</h3>
            <p className="text-gray-500 text-sm leading-relaxed font-light">
              {product.description}
            </p>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-gray-100 p-4 pb-8 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] z-20 animate-slide-up stagger-2">
        <div className="flex gap-3 h-14">
          {product.modifiers?.sizes && product.modifiers.sizes.length > 0 && (
            <div className="flex bg-gray-100 rounded-2xl p-1 flex-[1.4] relative">
              {product.modifiers.sizes.map(size => {
                const isSelected = selectedSize?.id === size.id;
                return (
                  <button
                    key={size.id}
                    onClick={() => setSelectedSize(size)}
                    className={`flex-1 rounded-xl text-sm font-semibold transition-all duration-200 z-10 relative active:scale-95 ${isSelected ? 'text-gray-900 shadow-sm' : 'text-gray-400 hover:text-gray-600'
                      }`}
                  >
                    {size.name.split(' ')[0]}
                    {isSelected && (
                      <div className="absolute inset-0 bg-white rounded-xl -z-10 shadow-sm animate-pop-in" />
                    )}
                  </button>
                );
              })}
            </div>
          )}

          <button
            onClick={handleAddToCart}
            className="flex-1 bg-blue-600 active:bg-blue-700 text-white rounded-2xl px-6 flex items-center justify-between font-bold shadow-lg shadow-blue-200 transition-all duration-200 active:scale-95"
          >
            <span className="text-lg">{totalPrice} ₽</span>
            <Plus size={24} strokeWidth={3} />
          </button>
        </div>
      </div>
    </div>
  );
};
