import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import type { CartItem, Product } from '@/types';

type CartContextValue = {
  items: CartItem[];
  favorites: string[];
  isDrawerOpen: boolean;
  subtotal: number;
  itemCount: number;
  openDrawer: () => void;
  closeDrawer: () => void;
  toggleDrawer: () => void;
  addToCart: (product: Product, size?: string, quantity?: number) => void;
  addItem: (product: Product, size?: string, quantity?: number) => void;
  removeFromCart: (productId: string, size?: string) => void;
  removeItem: (productId: string, size?: string) => void;
  updateQuantity: (productId: string, quantity: number, size?: string) => void;
  toggleFavorite: (productId: string) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextValue | undefined>(undefined);

export function CartProvider({ children }: { children?: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const openDrawer = useCallback(() => setIsDrawerOpen(true), []);
  const closeDrawer = useCallback(() => setIsDrawerOpen(false), []);
  const toggleDrawer = useCallback(() => setIsDrawerOpen((v) => !v), []);

  const addToCart = useCallback((product: Product, size?: string, quantity = 1) => {
    if (!product?.id) return;
    const safeQty = Math.max(1, Math.floor(quantity || 1));
    setItems((prev) => {
      const existing = prev.find((item) => item.productId === product.id && (item.size ?? '') === (size ?? ''));
      if (existing) {
        return prev.map((item) =>
          item.id === existing.id
            ? { ...item, quantity: Math.max(1, Math.min((item.quantity ?? 1) + safeQty, 10)) }
            : item,
        );
      }
      const nextItem: CartItem = {
        id: crypto.randomUUID(),
        productId: product.id,
        product,
        name: product.name ?? '',
        price: product.price ?? 0,
        quantity: Math.min(safeQty, 10),
        image: product.image ?? '',
        size,
      };
      return [...prev, nextItem];
    });
    setIsDrawerOpen(true);
  }, []);

  const removeFromCart = useCallback((productId: string, size?: string) => {
    setItems((prev) => prev.filter((item) => !(item.productId === productId && (item.size ?? '') === (size ?? ''))));
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number, size?: string) => {
    const nextQty = Math.max(1, Math.min(Math.floor(quantity || 1), 10));
    setItems((prev) =>
      prev.map((item) =>
        item.productId === productId && (item.size ?? '') === (size ?? '')
          ? { ...item, quantity: nextQty }
          : item,
      ),
    );
  }, []);

  const toggleFavorite = useCallback((productId: string) => {
    if (!productId) return;
    setFavorites((prev) => (prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]));
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + (item.price ?? 0) * (item.quantity ?? 1), 0),
    [items],
  );

  const itemCount = useMemo(() => items.reduce((sum, item) => sum + (item.quantity ?? 1), 0), [items]);

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      favorites,
      isDrawerOpen,
      subtotal,
      itemCount,
      openDrawer,
      closeDrawer,
      toggleDrawer,
      addToCart,
      addItem: addToCart,
      removeFromCart,
      removeItem: removeFromCart,
      updateQuantity,
      toggleFavorite,
      clearCart,
    }),
    [
      items,
      favorites,
      isDrawerOpen,
      subtotal,
      itemCount,
      openDrawer,
      closeDrawer,
      toggleDrawer,
      addToCart,
      removeFromCart,
      updateQuantity,
      toggleFavorite,
      clearCart,
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
