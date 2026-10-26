import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import mockData from '@/data/mockData';
import type { CartItem, Order, Product, ShippingInfo } from '@/types';

type CartContextValue = {
  items: CartItem[];
  isCartOpen: boolean;
  subtotal: number;
  shippingCost: number;
  shippingThreshold: number;
  total: number;
  itemCount: number;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  addToCart: (product: Product, size?: string, color?: string, quantity?: number) => void;
  updateQuantity: (productId: string, quantity: number, size?: string, color?: string) => void;
  removeFromCart: (productId: string, size?: string, color?: string) => void;
  clearCart: () => void;
  completeOrder: (shipping: ShippingInfo, notes?: string) => Order;
  getProductById: (productId: string) => Product | undefined;
};

const CartContext = createContext<CartContextValue | undefined>(undefined);
const STORAGE_KEY = 'jootiya-cart-v1';
const ORDERS_KEY = 'jootiya-orders-v1';
const SHIPPING_THRESHOLD = 5000;
const SHIPPING_COST = 250;

const getLineKey = (productId: string, size?: string, color?: string) =>
  `${productId}::${size ?? ''}::${color ?? ''}`;

const normalizeQuantity = (quantity: number) => Math.max(1, Math.min(5, Math.round(quantity || 1)));

const readStorage = <T,>(key: string, fallback: T): T => {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
};

const writeStorage = (key: string, value: unknown) => {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    return;
  }
};

export function CartProvider({ children }: { children?: React.ReactNode } = {}) {
  const [items, setItems] = useState<CartItem[]>(() => readStorage<CartItem[]>(STORAGE_KEY, []));
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    writeStorage(STORAGE_KEY, items);
  }, [items]);

  const productMap = useMemo(() => {
    const map = new Map<string, Product>();
    (mockData?.products ?? []).forEach((product: Product) => map.set(product.id, product));
    return map;
  }, []);

  const getProductById = (productId: string) => productMap.get(productId);

  const subtotal = useMemo(
    () =>
      items.reduce((sum, item) => {
        const product = getProductById(item.productId);
        return sum + (product?.price ?? 0) * normalizeQuantity(item.quantity);
      }, 0),
    [items, productMap]
  );

  const shippingCost = subtotal >= SHIPPING_THRESHOLD || subtotal === 0 ? 0 : SHIPPING_COST;
  const total = subtotal + shippingCost;
  const itemCount = items.reduce((sum, item) => sum + normalizeQuantity(item.quantity), 0);

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);
  const toggleCart = () => setIsCartOpen((prev) => !prev);

  const addToCart = (product: Product, size?: string, color?: string, quantity = 1) => {
    const nextQty = normalizeQuantity(quantity);
    const selectedSize = size ?? product?.sizes?.[0] ?? '';
    const key = getLineKey(product?.id ?? '', selectedSize, color);
    setItems((prev) => {
      const existing = prev.find((item) => getLineKey(item.productId, item.size, item.color) === key);
      if (existing) {
        return prev.map((item) =>
          getLineKey(item.productId, item.size, item.color) === key
            ? { ...item, quantity: normalizeQuantity(item.quantity + nextQty) }
            : item
        );
      }
      return [...prev, { productId: product?.id ?? '', quantity: nextQty, size: selectedSize || undefined, color }];
    });
    toast.success(`${product?.name ?? 'Item'} added to cart`);
    setIsCartOpen(true);
  };

  const updateQuantity = (productId: string, quantity: number, size?: string, color?: string) => {
    const nextQty = normalizeQuantity(quantity);
    const key = getLineKey(productId, size, color);
    setItems((prev) =>
      prev
        .map((item) => (getLineKey(item.productId, item.size, item.color) === key ? { ...item, quantity: nextQty } : item))
        .filter((item) => item.quantity > 0)
    );
  };

  const removeFromCart = (productId: string, size?: string, color?: string) => {
    const key = getLineKey(productId, size, color);
    setItems((prev) => prev.filter((item) => getLineKey(item.productId, item.size, item.color) !== key));
    toast.message('Removed from cart');
  };

  const clearCart = () => {
    setItems([]);
    toast.message('Cart cleared');
  };

  const completeOrder = (shipping: ShippingInfo, notes?: string) => {
    const order: Order = {
      id: crypto.randomUUID(),
      items,
      shipping,
      subtotal,
      shippingCost,
      total,
      createdAt: new Date().toISOString(),
      status: 'confirmed',
      notes,
    };
    const existing = readStorage<Order[]>(ORDERS_KEY, []);
    writeStorage(ORDERS_KEY, [order, ...existing]);
    setItems([]);
    setIsCartOpen(false);
    toast.success('Order confirmed');
    return order;
  };

  const value: CartContextValue = {
    items,
    isCartOpen,
    subtotal,
    shippingCost,
    shippingThreshold: SHIPPING_THRESHOLD,
    total,
    itemCount,
    openCart,
    closeCart,
    toggleCart,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    completeOrder,
    getProductById,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
}

export default CartProvider;