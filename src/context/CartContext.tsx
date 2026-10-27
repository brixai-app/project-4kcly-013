import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import type { CartItem, Product } from "@/types";

type CartContextValue = {
  items: CartItem[];
  isOpen: boolean;
  subtotal: number;
  itemCount: number;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  addItem: (product: Product, quantity?: number, selectedSize?: string, selectedColor?: string) => void;
  removeItem: (productId: string, selectedSize?: string, selectedColor?: string) => void;
  updateQuantity: (productId: string, quantity: number, selectedSize?: string, selectedColor?: string) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextValue | undefined>(undefined);
const STORAGE_KEY = "jootiya-cart-v1";

const sameVariant = (item: CartItem, productId: string, selectedSize?: string, selectedColor?: string) =>
  item.product?.id === productId &&
  (item.selectedSize ?? "") === (selectedSize ?? "") &&
  (item.selectedColor ?? "") === (selectedColor ?? "");

const safeParse = (value: string | null): CartItem[] => {
  try {
    const parsed = JSON.parse(value ?? "[]") as CartItem[];
    return Array.isArray(parsed) ? parsed.filter((item) => item?.product?.id) : [];
  } catch {
    return [];
  }
};

export function CartProvider({ children }: { children?: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    setItems(safeParse(stored));
  }, []);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);
  const toggleCart = useCallback(() => setIsOpen((prev) => !prev), []);

  const addItem = useCallback(
    (product: Product, quantity = 1, selectedSize?: string, selectedColor?: string) => {
      if (!product?.id) return;
      setItems((prev) => {
        const existingIndex = prev.findIndex((item) => sameVariant(item, product.id, selectedSize, selectedColor));
        if (existingIndex >= 0) {
          const next = [...prev];
          next[existingIndex] = { ...next[existingIndex], quantity: next[existingIndex].quantity + quantity };
          return next;
        }
        return [...prev, { product, quantity, selectedSize, selectedColor }];
      });
      setIsOpen(true);
      toast.success(`${product?.name ?? "Item"} added to cart`, {
        action: { label: "Undo", onClick: () => removeItem(product.id, selectedSize, selectedColor) },
      });
    },
    []
  );

  const removeItem = useCallback((productId: string, selectedSize?: string, selectedColor?: string) => {
    setItems((prev) => prev.filter((item) => !sameVariant(item, productId, selectedSize, selectedColor)));
    toast.message("Removed from cart");
  }, []);

  const updateQuantity = useCallback(
    (productId: string, quantity: number, selectedSize?: string, selectedColor?: string) => {
      setItems((prev) =>
        quantity <= 0
          ? prev.filter((item) => !sameVariant(item, productId, selectedSize, selectedColor))
          : prev.map((item) => (sameVariant(item, productId, selectedSize, selectedColor) ? { ...item, quantity } : item))
      );
    },
    []
  );

  const clearCart = useCallback(() => {
    setItems([]);
    toast.message("Cart cleared");
  }, []);

  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + (item.product?.price ?? 0) * (item.quantity ?? 0), 0),
    [items]
  );
  const itemCount = useMemo(() => items.reduce((sum, item) => sum + (item.quantity ?? 0), 0), [items]);

  const value = useMemo(
    () => ({ items, isOpen, subtotal, itemCount, openCart, closeCart, toggleCart, addItem, removeItem, updateQuantity, clearCart }),
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
