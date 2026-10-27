import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { CartItem, Product } from '@/types';
import { products } from '@/data/mockData';

type CartContextValue = {
  items: CartItem[];
  isOpen: boolean;
  isCheckoutOpen: boolean;
  hydrated: boolean;
  addItem: (product: Product, size: string, color?: string | null, quantity?: number) => void;
  updateQuantity: (productId: string, size: string, quantity: number, color?: string | null) => void;
  removeItem: (productId: string, size: string, color?: string | null) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  openCheckout: () => void;
  closeCheckout: () => void;
  subtotal: number;
  itemCount: number;
  getItemQuantity: (productId: string, size: string, color?: string | null) => number;
};

const CartContext = createContext<CartContextValue | undefined>(undefined);
const STORAGE_KEY = 'jootiya-cart-v1';
const CHECKOUT_KEY = 'jootiya-checkout-v1';
const MAX_QTY = 10;

const normalizeKey = (productId: string, size: string, color?: string | null) =>
  `${productId}::${size}::${color ?? ''}`;

const safeParse = (value: string | null): CartItem[] => {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value) as unknown;
    return Array.isArray(parsed)
      ? parsed.filter((item): item is CartItem => {
          const candidate = item as Partial<CartItem> | null;
          return !!candidate?.productId && !!candidate?.size && typeof candidate?.quantity === 'number';
        })
      : [];
  } catch {
    return [];
  }
};

export function CartProvider({ children }: { children?: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    setItems(safeParse(window.localStorage.getItem(STORAGE_KEY)));
    setIsCheckoutOpen(window.localStorage.getItem(CHECKOUT_KEY) === 'true');
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated || typeof window === 'undefined') return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [hydrated, items]);

  useEffect(() => {
    if (!hydrated || typeof window === 'undefined') return;
    window.localStorage.setItem(CHECKOUT_KEY, String(isCheckoutOpen));
  }, [hydrated, isCheckoutOpen]);

  const addItem = useCallback((product: Product, size: string, color?: string | null, quantity = 1) => {
    if (!product?.id || !size) return;
    setItems((current) => {
      const key = normalizeKey(product.id, size, color);
      const existing = current.find((item) => normalizeKey(item.productId, item.size, item.color) === key);
      if (existing) {
        return current.map((item) =>
          normalizeKey(item.productId, item.size, item.color) === key
            ? { ...item, quantity: Math.min(MAX_QTY, item.quantity + quantity) }
            : item,
        );
      }
      return [...current, { productId: product.id, size, color: color ?? null, quantity: Math.min(MAX_QTY, Math.max(1, quantity)) }];
    });
    setIsOpen(true);
  }, []);

  const updateQuantity = useCallback((productId: string, size: string, quantity: number, color?: string | null) => {
    const nextQty = Math.min(MAX_QTY, Math.max(0, quantity));
    setItems((current) =>
      current
        .map((item) =>
          normalizeKey(item.productId, item.size, item.color) === normalizeKey(productId, size, color)
            ? { ...item, quantity: nextQty }
            : item,
        )
        .filter((item) => item.quantity > 0),
    );
  }, []);

  const removeItem = useCallback((productId: string, size: string, color?: string | null) => {
    setItems((current) => current.filter((item) => normalizeKey(item.productId, item.size, item.color) !== normalizeKey(productId, size, color)));
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);
  const toggleCart = useCallback(() => setIsOpen((current) => !current), []);
  const openCheckout = useCallback(() => setIsCheckoutOpen(true), []);
  const closeCheckout = useCallback(() => setIsCheckoutOpen(false), []);

  const subtotal = useMemo(
    () =>
      items.reduce((sum, item) => {
        const product = products.find((entry) => entry.id === item.productId);
        return sum + (product?.price ?? 0) * item.quantity;
      }, 0),
    [items],
  );

  const itemCount = useMemo(() => items.reduce((sum, item) => sum + item.quantity, 0), [items]);

  const getItemQuantity = useCallback(
    (productId: string, size: string, color?: string | null) =>
      items.find((item) => normalizeKey(item.productId, item.size, item.color) === normalizeKey(productId, size, color))?.quantity ?? 0,
    [items],
  );

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      isOpen,
      isCheckoutOpen,
      hydrated,
      addItem,
      updateQuantity,
      removeItem,
      clearCart,
      openCart,
      closeCart,
      toggleCart,
      openCheckout,
      closeCheckout,
      subtotal,
      itemCount,
      getItemQuantity,
    }),
    [
      items,
      isOpen,
      isCheckoutOpen,
      hydrated,
      addItem,
      updateQuantity,
      removeItem,
      clearCart,
      openCart,
      closeCart,
      toggleCart,
      openCheckout,
      closeCheckout,
      subtotal,
      itemCount,
      getItemQuantity,
    ],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
}

export default CartContext;
export { CartContext };
