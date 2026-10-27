import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import type { CartItem, Order, Product, ShippingInfo } from '@/types';
import { products } from '@/data/mockData';

type CartContextValue = {
  items: CartItem[];
  isDrawerOpen: boolean;
  subtotal: number;
  itemCount: number;
  openDrawer: () => void;
  closeDrawer: () => void;
  toggleDrawer: () => void;
  addToCart: (product: Product, options?: { size?: string; color?: string; quantity?: number }) => void;
  updateQuantity: (productId: string, quantity: number, size?: string, color?: string) => void;
  removeFromCart: (productId: string, size?: string, color?: string) => void;
  clearCart: () => void;
  checkout: (shipping: ShippingInfo) => Promise<Order | null>;
};

const CartContext = createContext<CartContextValue | undefined>(undefined);
const STORAGE_KEY = 'jootiya-cart-v1';
const ORDERS_KEY = 'jootiya-orders-v1';
const MAX_QTY = 10;

const getKey = (productId: string, size?: string, color?: string) => `${productId}::${size ?? ''}::${color ?? ''}`;
const safeParse = <T,>(value: string | null, fallback: T): T => {
  try {
    return value ? (JSON.parse(value) as T) : fallback;
  } catch {
    return fallback;
  }
};

export function CartProvider({ children }: { children?: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useEffect(() => {
    const stored = safeParse<CartItem[]>(localStorage.getItem(STORAGE_KEY), []);
    const normalized = Array.isArray(stored)
      ? stored
          .map((item) => {
            const product = products.find((p) => p.id === item?.productId) ?? item?.product;
            if (!product) return null;
            return { ...item, product, price: item?.price ?? product.price };
          })
          .filter(Boolean) as CartItem[]
      : [];
    setItems(normalized);
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const persistOrder = useCallback((order: Order) => {
    const existing = safeParse<Order[]>(localStorage.getItem(ORDERS_KEY), []);
    localStorage.setItem(ORDERS_KEY, JSON.stringify([order, ...existing].slice(0, 20)));
  }, []);

  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + (item?.price ?? 0) * (item?.quantity ?? 0), 0),
    [items]
  );

  const itemCount = useMemo(() => items.reduce((sum, item) => sum + (item?.quantity ?? 0), 0), [items]);

  const openDrawer = useCallback(() => setIsDrawerOpen(true), []);
  const closeDrawer = useCallback(() => setIsDrawerOpen(false), []);
  const toggleDrawer = useCallback(() => setIsDrawerOpen((v) => !v), []);

  const addToCart = useCallback((product: Product, options?: { size?: string; color?: string; quantity?: number }) => {
    if (!product?.id) return;
    const quantity = Math.min(Math.max(options?.quantity ?? 1, 1), MAX_QTY);
    setItems((current) => {
      const key = getKey(product.id, options?.size, options?.color);
      const index = current.findIndex((item) => getKey(item.productId, item.size, item.color) === key);
      if (index >= 0) {
        const next = [...current];
        const existing = next[index];
        next[index] = { ...existing, quantity: Math.min((existing?.quantity ?? 0) + quantity, MAX_QTY), product, price: product.price };
        return next;
      }
      return [...current, { productId: product.id, quantity, size: options?.size, color: options?.color, price: product.price, product }];
    });
    toast.success(`${product?.name ?? 'Item'} added to cart`);
    setIsDrawerOpen(true);
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number, size?: string, color?: string) => {
    const nextQty = Math.min(Math.max(quantity, 1), MAX_QTY);
    setItems((current) =>
      current
        .map((item) => (getKey(item.productId, item.size, item.color) === getKey(productId, size, color) ? { ...item, quantity: nextQty } : item))
        .filter((item) => (item?.quantity ?? 0) > 0)
    );
  }, []);

  const removeFromCart = useCallback((productId: string, size?: string, color?: string) => {
    setItems((current) => current.filter((item) => getKey(item.productId, item.size, item.color) !== getKey(productId, size, color)));
    toast.message('Removed from cart');
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const checkout = useCallback(async (shipping: ShippingInfo) => {
    if (!items.length) {
      toast.error('Your cart is empty');
      return null;
    }
    const required = ['fullName', 'email', 'phone', 'addressLine1', 'city', 'state', 'postalCode', 'country'] as const;
    const missing = required.find((key) => !(shipping?.[key]?.trim?.() ?? '').length);
    if (missing) {
      toast.error('Please complete the shipping details');
      return null;
    }
    const order: Order = {
      id: crypto.randomUUID(),
      items,
      shipping,
      subtotal,
      shippingFee: subtotal >= 5000 ? 0 : 250,
      total: subtotal + (subtotal >= 5000 ? 0 : 250),
      status: 'pending',
      createdAt: new Date().toISOString(),
      customerEmail: shipping.email,
    };
    persistOrder(order);
    clearCart();
    toast.success('Order placed successfully');
    return order;
  }, [clearCart, items, persistOrder, subtotal]);

  const value = useMemo<CartContextValue>(
    () => ({ items, isDrawerOpen, subtotal, itemCount, openDrawer, closeDrawer, toggleDrawer, addToCart, updateQuantity, removeFromCart, clearCart, checkout }),
    [items, isDrawerOpen, subtotal, itemCount, openDrawer, closeDrawer, toggleDrawer, addToCart, updateQuantity, removeFromCart, clearCart, checkout]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
}

export default CartContext;
export { CartContext };
