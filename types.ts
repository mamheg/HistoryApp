
export interface User {
  id: number;
  name: string;
  avatarUrl: string;
  points: number;
  lifetimePoints: number; // Баллы за все время для определения статуса
  level: string;
  nextLevelPoints: number;
  referralCode: string;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  pointsRequired: number;
  icon: string;
  color: string;
}

export interface Category {
  id: string;
  name: string;
}

export interface ProductModifier {
  id: string;
  name: string;
  price: number;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  categoryId: string;
  modifiers?: {
    sizes: ProductModifier[];
    milks: ProductModifier[];
    syrups: ProductModifier[];
  };
}

export interface CartItem {
  uniqueId: string;
  productId: number;
  productName: string;
  price: number;
  quantity: number;
  imageUrl: string;
  selectedModifiers: string[];
}

export interface OrderHistoryItem {
  id: string;
  date: string;
  items: string;
  total: number;
  status: 'completed' | 'cancelled';
  pickupTime?: string;
  comment?: string;
}

export enum AppView {
  CHAT = 'CHAT',
  IMAGE = 'IMAGE',
  VOICE = 'VOICE',
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}
