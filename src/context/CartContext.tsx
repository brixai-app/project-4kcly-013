import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import type { CartItem, Product, ProductColor, ProductSize } from '@/types';
import { products as mockProducts } from '@/data/mockData';

export type CartMutation = {
  product: Product;
  quantity?: number;
  size?: ProductSize;
  color?: ProductColor;
};

export type CartContextValue = {
  items: CartItem[];
  isOpen: boolean;
  subtotal: number;
  itemCount: number;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  addItem: (input: CartMutation) => void;
  updateItem: (productId: string, size?: ProductSize, color?: ProductColor, quantity?: number) => void;
  removeItem: (productId: string, size?: ProductSize, color?: ProductColor) => void;
  clearCart: () => void;
  getItemQuantity: (productId: string, size?: ProductSize, color?: ProductColor) => number;
};

const CartContext = createContext<CartContextValue | undefined>(undefined);
const STORAGE_KEY = 'jootiya-cart-v1';

function getProductById(productId: string): Product | undefined {
  return mockProducts?.find((product) => product?.id === productId);
}

function itemKey(productId: string, size?: ProductSize, color?: ProductColor): string {
  return [productId, size ?? '', color ?? ''].join('|');
}

function normalizeItems(items: CartItem[]): CartItem[] {
  return items
    .filter((item) => item?.productId)
    .map((item) => {
      const product = item?.product ?? getProductById(item?.productId ?? '');
      const maxStock = product?.inStock === false ? 0 : 99;
      const quantity = Math.max(1, Math.min(item?.quantity ?? 1, maxStock || 1));
      return { ...item, quantity, product };
    });
}

function readStoredCart(): CartItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as CartItem[];
    return normalizeItems(Array.isArray(parsed) ? parsed : []);
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children?: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => readStoredCart());
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + (item?.product?.price ?? 0) * (item?.quantity ?? 0), 0),
    [items]
  );

  const itemCount = useMemo(
    () => items.reduce((sum, item) => sum + (item?.quantity ?? 0), 0),
    [items]
  );

  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);
  const toggleCart = () => setIsOpen((prev) => !prev);

  const addItem = ({ product, quantity = 1, size, color }: CartMutation) => {
    const safeProduct = product ?? undefined;
    if (!safeProduct?.id) return;

    if (safeProduct?.inStock === false) {
      toast.error('This piece is currently unavailable.');
      return;
    }

    const maxStock = 99;
    const nextQuantity = Math.max(1, Math.min(quantity, maxStock));
    setItems((current) => {
      const key = itemKey(safeProduct.id, size, color);
      const index = current.findIndex((item) => itemKey(item?.productId ?? '', item?.size, item?.color) === key);
      if (index >= 0) {
        const updated = [...current];
        const existing = updated[index];
        const mergedQuantity = Math.min((existing?.quantity ?? 0) + nextQuantity, maxStock);
        updated[index] = { ...existing, quantity: mergedQuantity, product: safeProduct };
        return normalizeItems(updated);
      }
      return normalizeItems([...current, { productId: safeProduct.id, quantity: nextQuantity, size, color, product: safeProduct }]);
    });
    toast.success('Added to cart.');
    setIsOpen(true);
  };

  const updateItem = (productId: string, size?: ProductSize, color?: ProductColor, quantity?: number) => {
    setItems((current) =>
      normalizeItems(
        current
          .map((item) => {
            const matches = itemKey(item?.productId ?? '', item?.size, item?.color) === itemKey(productId, size, color);
            if (!matches) return item;
            if ((quantity ?? 0) <= 0) return item;
            const product = item?.product ?? getProductById(productId);
            const maxStock = product?.inStock === false ? 0 : 99;
            return { ...item, quantity: Math.max(1, Math.min(quantity ?? 1, maxStock || 1)), product };
          })
          .filter((item) => itemKey(item?.productId ?? '', item?.size, item?.color) !== itemKey(productId, size, color) || (quantity ?? 1) > 0)
      )
    );
  };

  const removeItem = (productId: string, size?: ProductSize, color?: ProductColor) => {
    setItems((current) => current.filter((item) => itemKey(item?.productId ?? '', item?.size, item?.color) !== itemKey(productId, size, color)));
    toast.message('Removed from cart.');
  };

  const clearCart = () => {
    setItems([]);
    toast.message('Cart cleared.');
  };

  const getItemQuantity = (productId: string, size?: ProductSize, color?: ProductColor) =>
    items.find((item) => itemKey(item?.productId ?? '', item?.size, item?.color) === itemKey(productId, size, color))?.quantity ?? 0;

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      isOpen,
      subtotal,
      itemCount,
      openCart,
      closeCart,
      toggleCart,
      addItem,
      updateItem,
      removeItem,
      clearCart,
      getItemQuantity,
    }),
    [items, isOpen, subtotal, itemCount]
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
