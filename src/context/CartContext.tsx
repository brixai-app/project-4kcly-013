import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import type { Cart, CartItem, PersistedOrder, Product } from '@/types';

type CartContextValue = {
  items: CartItem[];
  subtotal: number;
  itemCount: number;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  addItem: (product: Product, quantity?: number, size?: string, color?: string) => void;
  updateQuantity: (productId: string, quantity: number, size?: string, color?: string) => void;
  removeItem: (productId: string, size?: string, color?: string) => void;
  clearCart: () => void;
  submitOrder: (order: Omit<PersistedOrder, 'id' | 'createdAt' | 'updatedAt' | 'status' | 'items' | 'subtotal'> & { items?: CartItem[]; subtotal?: number }) => Promise<PersistedOrder | null>;
};

const CartContext = createContext<CartContextValue | undefined>(undefined);
const STORAGE_KEY = 'jootiya-cart-v1';
const ORDER_KEY = 'jootiya-orders-v1';

const safeParse = <T,>(value: string | null, fallback: T): T => {
  try {
    return value ? (JSON.parse(value) as T) : fallback;
  } catch {
    return fallback;
  }
};

const keyOf = (productId: string, size?: string, color?: string) => `${productId}::${size ?? ''}::${color ?? ''}`;

const clampQty = (quantity: number) => Math.min(5, Math.max(1, Math.floor(quantity || 1)));

const toCart = (items: CartItem[]): Cart => ({
  items,
  subtotal: items.reduce((sum, item) => sum + item.price * item.quantity, 0),
  itemCount: items.reduce((sum, item) => sum + item.quantity, 0),
});

export function CartProvider({ children }: { children?: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const stored = safeParse<CartItem[]>(localStorage.getItem(STORAGE_KEY), []);
    setItems(Array.isArray(stored) ? stored.filter((item) => item?.productId && item?.quantity > 0) : []);
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);
  const toggleCart = useCallback(() => setIsOpen((prev) => !prev), []);

  const addItem = useCallback((product: Product, quantity = 1, size?: string, color?: string) => {
    if (!product?.id) return;
    if (product?.inStock === false) {
      toast.error('This style is currently out of stock.');
      return;
    }
    const nextQty = clampQty(quantity);
    setItems((prev) => {
      const idx = prev.findIndex((item) => keyOf(item.productId, item.size, item.color) === keyOf(product.id, size, color));
      if (idx >= 0) {
        const merged = clampQty((prev[idx]?.quantity ?? 1) + nextQty);
        const next = [...prev];
        next[idx] = { ...next[idx], quantity: merged };
        toast.success('Updated cart.');
        return next;
      }
      toast.success('Added to cart.');
      return [...prev, { productId: product.id, name: product.name, slug: product.slug, price: product.price, image: product.image, quantity: nextQty, size, color }];
    });
    setIsOpen(true);
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number, size?: string, color?: string) => {
    const nextQty = clampQty(quantity);
    setItems((prev) => prev.map((item) => (keyOf(item.productId, item.size, item.color) === keyOf(productId, size, color) ? { ...item, quantity: nextQty } : item)));
  }, []);

  const removeItem = useCallback((productId: string, size?: string, color?: string) => {
    setItems((prev) => prev.filter((item) => keyOf(item.productId, item.size, item.color) !== keyOf(productId, size, color)));
    toast.message('Removed from cart.');
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
    toast.message('Cart cleared.');
  }, []);

  const submitOrder = useCallback(async (order: Omit<PersistedOrder, 'id' | 'createdAt' | 'updatedAt' | 'status' | 'items' | 'subtotal'> & { items?: CartItem[]; subtotal?: number }) => {
    const payloadItems = (order?.items?.length ? order.items : items).filter((item) => item?.productId && item?.quantity > 0);
    if (!payloadItems.length) {
      toast.error('Your cart is empty.');
      return null;
    }
    const subtotal = order?.subtotal ?? toCart(payloadItems).subtotal;
    const now = new Date().toISOString();
    const persisted: PersistedOrder = {
      id: crypto.randomUUID(),
      cartId: order?.cartId,
      customerName: order?.customerName ?? '',
      email: order?.email ?? '',
      phone: order?.phone,
      address: order?.address,
      city: order?.city,
      state: order?.state,
      pincode: order?.pincode,
      notes: order?.notes,
      items: payloadItems,
      subtotal,
      status: 'draft',
      createdAt: now,
      updatedAt: now,
    };
    const orders = safeParse<PersistedOrder[]>(localStorage.getItem(ORDER_KEY), []);
    localStorage.setItem(ORDER_KEY, JSON.stringify([persisted, ...orders]));
    toast.success('Order saved.');
    return persisted;
  }, [items]);

  const value = useMemo<CartContextValue>(() => {
    const cart = toCart(items);
    return {
      items: cart.items,
      subtotal: cart.subtotal,
      itemCount: cart.itemCount,
      isOpen,
      openCart,
      closeCart,
      toggleCart,
      addItem,
      updateQuantity,
      removeItem,
      clearCart,
      submitOrder,
    };
  }, [items, isOpen, openCart, closeCart, toggleCart, addItem, updateQuantity, removeItem, clearCart, submitOrder]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
}

export default CartProvider;