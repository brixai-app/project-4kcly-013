import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { CartItem, Product } from '@/types';

type CartContextValue = {
  items: CartItem[];
  isOpen: boolean;
  selectedSize: string;
  selectedColor: string;
  subtotal: number;
  itemCount: number;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  setSelectedSize: (size: string) => void;
  setSelectedColor: (color: string) => void;
  addToCart: (product: Product, quantity?: number, size?: string, color?: string) => void;
  addItem: (product: Product, quantity?: number, size?: string, color?: string) => void;
  removeFromCart: (productId: string, size?: string) => void;
  removeItem: (productId: string, size?: string) => void;
  updateQuantity: (productId: string, quantity: number, size?: string) => void;
  clearCart: () => void;
  checkout: () => void;
};

const STORAGE_KEY = 'jootiya-cart-v1';
const SIZE_KEY = 'jootiya-selected-size-v1';
const COLOR_KEY = 'jootiya-selected-color-v1';

const CartContext = createContext<CartContextValue | undefined>(undefined);

const safeNumber = (value: unknown, fallback = 0) => {
  const n = typeof value === 'number' && Number.isFinite(value) ? value : fallback;
  return Math.max(0, n);
};

const getStockLimit = (product?: Product) => {
  const stock = safeNumber(product?.stock, 999);
  return Math.max(1, stock);
};

const normalizeQuantity = (product?: Product, quantity = 1) => Math.min(Math.max(1, Math.floor(quantity)), getStockLimit(product));

const readStorage = <T,>(key: string, fallback: T): T => {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
};

const writeStorage = (key: string, value: unknown) => {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {}
};

export function CartProvider({ children }: { children?: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedSize, setSelectedSizeState] = useState('UK 7');
  const [selectedColor, setSelectedColorState] = useState('Tan');

  useEffect(() => {
    if (typeof window === 'undefined') return;
    setItems(readStorage<CartItem[]>(STORAGE_KEY, []));
    setSelectedSizeState(readStorage<string>(SIZE_KEY, 'UK 7'));
    setSelectedColorState(readStorage<string>(COLOR_KEY, 'Tan'));
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    writeStorage(STORAGE_KEY, items);
  }, [items]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    writeStorage(SIZE_KEY, selectedSize);
  }, [selectedSize]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    writeStorage(COLOR_KEY, selectedColor);
  }, [selectedColor]);

  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);
  const toggleCart = useCallback(() => setIsOpen((v) => !v), []);

  const setSelectedSize = useCallback((size: string) => {
    setSelectedSizeState(size?.trim() || 'UK 7');
  }, []);

  const setSelectedColor = useCallback((color: string) => {
    setSelectedColorState(color?.trim() || 'Tan');
  }, []);

  const addToCart = useCallback((product: Product, quantity = 1, size?: string, color?: string) => {
    if (!product?.id) return;
    const nextSize = (size ?? selectedSize)?.trim() || product?.sizes?.[0] || 'One Size';
    const nextColor = (color ?? selectedColor)?.trim() || product?.color || 'Tan';
    const qty = normalizeQuantity(product, quantity);
    setItems((prev) => {
      const existing = prev.find((item) => item.productId === product.id && item.size === nextSize);
      if (existing) {
        return prev.map((item) =>
          item.productId === product.id && item.size === nextSize
            ? { ...item, quantity: normalizeQuantity(product, item.quantity + qty), product }
            : item
        );
      }
      return [...prev, { productId: product.id, quantity: qty, size: nextSize, product: { ...product, color: nextColor } }];
    });
    setIsOpen(true);
  }, [selectedColor, selectedSize]);

  const removeFromCart = useCallback((productId: string, size?: string) => {
    setItems((prev) => prev.filter((item) => !(item.productId === productId && (size ? item.size === size : true))));
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number, size?: string) => {
    setItems((prev) =>
      prev
        .map((item) => {
          if (item.productId !== productId) return item;
          if (size && item.size !== size) return item;
          const product = item.product;
          const nextQty = normalizeQuantity(product, quantity);
          return { ...item, quantity: nextQty };
        })
        .filter((item) => item.quantity > 0)
    );
  }, []);

  const clearCart = useCallback(() => setItems([]), []);
  const checkout = useCallback(() => {
    setItems([]);
    setIsOpen(false);
  }, []);

  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + safeNumber(item.product?.price) * safeNumber(item.quantity, 1), 0),
    [items]
  );

  const itemCount = useMemo(() => items.reduce((sum, item) => sum + safeNumber(item.quantity, 1), 0), [items]);

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      isOpen,
      selectedSize,
      selectedColor,
      subtotal,
      itemCount,
      openCart,
      closeCart,
      toggleCart,
      setSelectedSize,
      setSelectedColor,
      addToCart,
      addItem: addToCart,
      removeFromCart,
      removeItem: removeFromCart,
      updateQuantity,
      clearCart,
      checkout,
    }),
    [
      items,
      isOpen,
      selectedSize,
      selectedColor,
      subtotal,
      itemCount,
      openCart,
      closeCart,
      toggleCart,
      setSelectedSize,
      setSelectedColor,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      checkout,
    ]
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
