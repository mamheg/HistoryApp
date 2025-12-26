
import { create } from 'zustand';
import { CartItem, Product, User, Category, Achievement, OrderHistoryItem } from '../types';
import { PRODUCTS, CATEGORIES } from '../services/mockData';

export const COFFEE_LEVELS: Achievement[] = [
  { id: '1', name: 'Новичок', description: 'Ваше первое знакомство с H🪶STORY. Добро пожаловать в семью!', pointsRequired: 0, icon: '🐣', color: 'bg-emerald-400' },
  { id: '2', name: 'Кофеман', description: 'Вы уже знаете разницу между латте и капучино. Так держать!', pointsRequired: 100, icon: '☕', color: 'bg-amber-400' },
  { id: '3', name: 'Бариста-Шеф', description: 'Ваш вкус становится изысканнее. Вы настоящий эксперт!', pointsRequired: 250, icon: '🧑‍🍳', color: 'bg-orange-500' },
  { id: '4', name: 'Магистр Эспрессо', description: 'Вы повелеваете кофейными зернами. Легендарный уровень!', pointsRequired: 500, icon: '🪄', color: 'bg-stone-600' },
  { id: '5', name: 'Кофейный Монарх', description: 'Вы достигли вершины. Весь мир H🪶STORY у ваших ног!', pointsRequired: 1000, icon: '👑', color: 'bg-yellow-500' },
];

export const getLevelByPoints = (points: number) => {
  return COFFEE_LEVELS.slice().reverse().find(l => points >= l.pointsRequired) || COFFEE_LEVELS[0];
};

export const getNextLevel = (points: number) => {
  return COFFEE_LEVELS.find(l => l.pointsRequired > points) || null;
};

export interface OperationLog {
  type: 'add' | 'update' | 'delete';
  productName: string;
  timestamp: number;
  previousData?: Product;
  currentData: Product;
  changes?: { field: string; from: any; to: any }[];
}

interface AppState {
  user: User | null;
  isAuth: boolean;
  isAdmin: boolean;
  cart: CartItem[];
  orderHistory: OrderHistoryItem[];
  activeCategory: string;
  products: Product[];
  categories: Category[];
  favorites: number[];
  orderStats: Record<number, number>;
  lastOperation: OperationLog | null;
  selectedAddress: string;
  
  setAuth: (user: User) => void;
  updateProfile: (name: string, avatarUrl: string) => void;
  addPoints: (amount: number) => void;
  logout: () => void;
  addToCart: (item: CartItem) => void;
  removeFromCart: (uniqueId: string) => void;
  updateQuantity: (uniqueId: string, delta: number) => void;
  clearCart: () => void;
  completeOrder: (total: number, pointsUsed: number, pickupTime?: string, comment?: string) => void;
  setActiveCategory: (id: string) => void;
  toggleFavorite: (productId: number) => void;
  setSelectedAddress: (address: string) => void;
  
  addProduct: (product: Product) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (id: number) => void;
  undoLastOperation: () => void;
}

export const ADMIN_TELEGRAM_IDS = [1962824399, 937710441];

const savedUser = localStorage.getItem('hoffee_user');
const initialUser = savedUser ? JSON.parse(savedUser) : null;
const savedFavorites = localStorage.getItem('hoffee_favorites');
const savedStats = localStorage.getItem('hoffee_stats');
const savedAddress = localStorage.getItem('hoffee_address');

export const useAppStore = create<AppState>((set, get) => ({
  user: initialUser,
  isAuth: !!initialUser,
  isAdmin: initialUser?.id ? ADMIN_TELEGRAM_IDS.includes(initialUser.id) : false,
  cart: [],
  orderHistory: [
    { id: 'ORD-1289', date: '12.05.2024', items: 'Капучино M, Круассан', total: 430, status: 'completed' },
    { id: 'ORD-1245', date: '08.05.2024', items: 'Флэт Уайт', total: 280, status: 'completed' }
  ],
  activeCategory: 'coffee',
  products: PRODUCTS,
  categories: CATEGORIES,
  favorites: savedFavorites ? JSON.parse(savedFavorites) : [],
  orderStats: savedStats ? JSON.parse(savedStats) : {},
  lastOperation: null,
  selectedAddress: savedAddress || 'Нальчик, ул. Толстого, 43',

  setAuth: (user) => {
    const levelInfo = getLevelByPoints(user.lifetimePoints || 0);
    const nextLevel = getNextLevel(user.lifetimePoints || 0);
    const finalUser = {
      ...user,
      level: levelInfo.name,
      nextLevelPoints: nextLevel ? nextLevel.pointsRequired : levelInfo.pointsRequired
    };
    localStorage.setItem('hoffee_user', JSON.stringify(finalUser));
    set({ 
      user: finalUser, 
      isAuth: true, 
      isAdmin: ADMIN_TELEGRAM_IDS.includes(user.id)
    });
  },

  updateProfile: (name, avatarUrl) => set((state) => {
    if (!state.user) return state;
    const updatedUser = { ...state.user, name, avatarUrl };
    localStorage.setItem('hoffee_user', JSON.stringify(updatedUser));
    return { user: updatedUser };
  }),

  addPoints: (amount) => set((state) => {
    if (!state.user) return state;
    
    const newPoints = state.user.points + amount;
    const newLifetime = (state.user.lifetimePoints || 0) + amount;
    const levelInfo = getLevelByPoints(newLifetime);
    const nextLevel = getNextLevel(newLifetime);

    const updatedUser = {
      ...state.user,
      points: newPoints,
      lifetimePoints: newLifetime,
      level: levelInfo.name,
      nextLevelPoints: nextLevel ? nextLevel.pointsRequired : levelInfo.pointsRequired
    };
    
    localStorage.setItem('hoffee_user', JSON.stringify(updatedUser));
    return { user: updatedUser };
  }),

  logout: () => {
    localStorage.removeItem('hoffee_user');
    set({ user: null, isAuth: false, isAdmin: false, cart: [], favorites: [], orderStats: {} });
  },

  addToCart: (item) => set((state) => {
    const existingIndex = state.cart.findIndex(i => i.uniqueId === item.uniqueId);
    if (existingIndex >= 0) {
      const newCart = [...state.cart];
      newCart[existingIndex].quantity += 1;
      return { cart: newCart };
    }
    return { cart: [...state.cart, item] };
  }),

  removeFromCart: (uniqueId) => set((state) => ({
    cart: state.cart.filter(item => item.uniqueId !== uniqueId)
  })),

  updateQuantity: (uniqueId, delta) => set((state) => {
    return {
      cart: state.cart.map(item => {
        if (item.uniqueId === uniqueId) {
          const newQty = Math.max(0, item.quantity + delta);
          return { ...item, quantity: newQty };
        }
        return item;
      }).filter(item => item.quantity > 0)
    };
  }),

  clearCart: () => set({ cart: [] }),

  completeOrder: (total, pointsUsed, pickupTime, comment) => set((state) => {
    if (!state.user) return state;
    
    const newStats = { ...state.orderStats };
    state.cart.forEach(item => {
      newStats[item.productId] = (newStats[item.productId] || 0) + item.quantity;
    });
    localStorage.setItem('hoffee_stats', JSON.stringify(newStats));

    const earnedPoints = pointsUsed === 0 ? Math.floor(total * 0.05) : 0;
    const updatedBalance = state.user.points - pointsUsed + earnedPoints;
    const updatedLifetime = (state.user.lifetimePoints || 0) + earnedPoints;

    const levelInfo = getLevelByPoints(updatedLifetime);
    const nextLevel = getNextLevel(updatedLifetime);

    const updatedUser = { 
      ...state.user, 
      points: updatedBalance,
      lifetimePoints: updatedLifetime,
      level: levelInfo.name,
      nextLevelPoints: nextLevel ? nextLevel.pointsRequired : levelInfo.pointsRequired
    };
    
    localStorage.setItem('hoffee_user', JSON.stringify(updatedUser));

    const itemsSummary = state.cart.map(i => `${i.productName} x${i.quantity}`).join(', ');
    const newOrder: OrderHistoryItem = {
      id: `ORD-${Math.floor(Math.random() * 9000) + 1000}`,
      date: new Date().toLocaleDateString('ru-RU'),
      items: itemsSummary,
      total,
      status: 'completed',
      pickupTime,
      comment
    };

    return {
      orderHistory: [newOrder, ...state.orderHistory],
      cart: [],
      user: updatedUser,
      orderStats: newStats
    };
  }),

  setActiveCategory: (id) => set({ activeCategory: id }),

  toggleFavorite: (productId) => set((state) => {
    const newFavorites = state.favorites.includes(productId)
      ? state.favorites.filter(id => id !== productId)
      : [...state.favorites, productId];
    localStorage.setItem('hoffee_favorites', JSON.stringify(newFavorites));
    return { favorites: newFavorites };
  }),

  setSelectedAddress: (address) => {
    localStorage.setItem('hoffee_address', address);
    set({ selectedAddress: address });
  },

  addProduct: (product) => set((state) => ({
    products: [product, ...state.products],
    lastOperation: {
      type: 'add',
      productName: product.name,
      timestamp: Date.now(),
      currentData: product
    }
  })),

  updateProduct: (product) => set((state) => {
    const previous = state.products.find(p => p.id === product.id);
    if (!previous) return state;

    const changes: { field: string; from: any; to: any }[] = [];
    if (previous.name !== product.name) changes.push({ field: 'Название', from: previous.name, to: product.name });
    if (previous.price !== product.price) changes.push({ field: 'Цена', from: previous.price, to: product.price });
    if (previous.description !== product.description) changes.push({ field: 'Описание', from: 'изменено', to: 'изменено' });
    if (previous.categoryId !== product.categoryId) changes.push({ field: 'Категория', from: previous.categoryId, to: product.categoryId });

    return {
      products: state.products.map(p => p.id === product.id ? product : p),
      lastOperation: {
        type: 'update',
        productName: product.name,
        timestamp: Date.now(),
        previousData: previous,
        currentData: product,
        changes: changes.length > 0 ? changes : undefined
      }
    };
  }),

  deleteProduct: (id) => set((state) => {
    const previous = state.products.find(p => p.id === id);
    if (!previous) return state;

    return {
      products: state.products.filter(p => p.id !== id),
      lastOperation: {
        type: 'delete',
        productName: previous.name,
        timestamp: Date.now(),
        currentData: previous
      }
    };
  }),

  undoLastOperation: () => set((state) => {
    const op = state.lastOperation;
    if (!op) return state;

    let newProducts = [...state.products];

    if (op.type === 'add') {
      newProducts = newProducts.filter(p => p.id !== op.currentData.id);
    } else if (op.type === 'delete') {
      newProducts = [op.currentData, ...newProducts];
    } else if (op.type === 'update' && op.previousData) {
      newProducts = newProducts.map(p => p.id === op.previousData!.id ? op.previousData! : p);
    }

    return {
      products: newProducts,
      lastOperation: null
    };
  }),
}));
