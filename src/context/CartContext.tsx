import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import type { CartItem } from "@/types";

type CartContextValue = {
  items: CartItem[];
  isOpen: boolean;
  subtotal: number;
  itemCount: number;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  addItem: (item: CartItem) => void;
  removeItem: (productId: string, size?: string, color?: string) => void;
  updateQuantity: (productId: string, quantity: number, size?: string, color?: string) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextValue | undefined>(undefined);
const STORAGE_KEY = "jootiya-cart";

const getItemKey = (item: Pick<CartItem, "productId" | "size" | "color">) =>
  `${item.productId}::${item.size ?? ""}::${item.color ?? ""}`;

const readStoredItems = (): CartItem[] => {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? (JSON.parse(raw) as CartItem[]) : [];
    return Array.isArray(parsed) ? parsed.filter((item) => item?.productId && item?.name) : [];
  } catch {
    return [];
  }
};

export function CartProvider({ children }: { children?: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setItems(readStoredItems());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated || typeof window === "undefined") return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [hydrated, items]);

  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + (item?.price ?? 0) * (item?.quantity ?? 0), 0),
    [items]
  );

  const itemCount = useMemo(
    () => items.reduce((sum, item) => sum + (item?.quantity ?? 0), 0),
    [items]
  );

  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);
  const toggleCart = useCallback(() => setIsOpen((prev) => !prev), []);

  const addItem = useCallback((item: CartItem) => {
    setItems((current) => {
      const quantity = Math.max(1, item?.quantity ?? 1);
      const nextItem = { ...item, quantity };
      const key = getItemKey(nextItem);
      const index = current.findIndex((entry) => getItemKey(entry) === key);
      if (index >= 0) {
        const next = [...current];
        next[index] = { ...next[index], quantity: (next[index]?.quantity ?? 0) + quantity };
        return next;
      }
      return [...current, nextItem];
    });
    toast.success(`${item?.name ?? "Item"} added to cart`);
  }, []);

  const removeItem = useCallback((productId: string, size?: string, color?: string) => {
    setItems((current) => current.filter((item) => getItemKey(item) !== getItemKey({ productId, size, color })));
    toast.message("Item removed from cart");
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number, size?: string, color?: string) => {
    const nextQuantity = Math.max(1, quantity);
    setItems((current) =>
      current.map((item) =>
        getItemKey(item) === getItemKey({ productId, size, color }) ? { ...item, quantity: nextQuantity } : item
      )
    );
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
    toast.message("Cart cleared");
  }, []);

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
      removeItem,
      updateQuantity,
      clearCart,
    }),
    [items, isOpen, subtotal, itemCount, openCart, closeCart, toggleCart, addItem, removeItem, updateQuantity, clearCart]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
}

export default CartContext;
export { CartContext };
