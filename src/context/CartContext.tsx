import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import type { CartItem, Product } from "@/types";
import { products as catalogProducts } from "@/data/mockData";

type CartContextValue = {
  items: CartItem[];
  isOpen: boolean;
  subtotal: number;
  shippingFee: number;
  total: number;
  itemCount: number;
  shippingProgress: number;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  addItem: (productId: string, quantity?: number, size?: string, color?: string) => void;
  updateItem: (productId: string, quantity: number, size?: string, color?: string) => void;
  removeItem: (productId: string, size?: string, color?: string) => void;
  clearCart: () => void;
  getProduct: (productId: string) => Product | undefined;
  getItemQuantity: (productId: string, size?: string, color?: string) => number;
};

const STORAGE_KEY = "jootiya-cart-v1";
const CartContext = createContext<CartContextValue | undefined>(undefined);

const getKey = (productId = "", size = "", color = "") => `${productId}::${size}::${color}`;

const getProduct = (productId = "") => catalogProducts?.find((product) => product?.id === productId);

const readStoredItems = (): CartItem[] => {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? (JSON.parse(raw) as CartItem[]) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

export function CartProvider({ children }: { children?: React.ReactNode } = {}) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setItems(readStoredItems());
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const subtotal = useMemo(
    () =>
      items.reduce((sum, item) => {
        const product = getProduct(item?.productId);
        return sum + (product?.price ?? 0) * (item?.quantity ?? 0);
      }, 0),
    [items]
  );

  const shippingFee = subtotal >= 5000 || subtotal === 0 ? 0 : 249;
  const total = subtotal + shippingFee;
  const itemCount = items.reduce((sum, item) => sum + (item?.quantity ?? 0), 0);
  const shippingProgress = Math.min(100, Math.round((subtotal / 5000) * 100));

  const syncItem = (nextItems: CartItem[]) => {
    setItems(nextItems);
  };

  const addItem = (productId = "", quantity = 1, size?: string, color?: string) => {
    const product = getProduct(productId);
    if (!product) {
      toast.error("Product not found.");
      return;
    }
    if (product?.inStock === false) {
      toast.error("This style is currently out of stock.");
      return;
    }
    const safeQty = Math.max(1, quantity ?? 1);
    const key = getKey(productId, size ?? "", color ?? "");
    const existing = items.find((item) => getKey(item?.productId, item?.size ?? "", item?.color ?? "") === key);
    const nextItems = existing
      ? items.map((item) =>
          getKey(item?.productId, item?.size ?? "", item?.color ?? "") === key
            ? { ...item, quantity: (item?.quantity ?? 0) + safeQty }
            : item
        )
      : [...items, { productId, quantity: safeQty, size, color }];
    syncItem(nextItems);
    toast.success(`${product?.name ?? "Item"} added to cart.`);
    setIsOpen(true);
  };

  const updateItem = (productId = "", quantity = 1, size?: string, color?: string) => {
    const nextQty = Math.max(1, quantity ?? 1);
    const key = getKey(productId, size ?? "", color ?? "");
    syncItem(items.map((item) => (getKey(item?.productId, item?.size ?? "", item?.color ?? "") === key ? { ...item, quantity: nextQty } : item)));
  };

  const removeItem = (productId = "", size?: string, color?: string) => {
    const key = getKey(productId, size ?? "", color ?? "");
    syncItem(items.filter((item) => getKey(item?.productId, item?.size ?? "", item?.color ?? "") !== key));
    toast.message("Removed from cart.");
  };

  const clearCart = () => {
    syncItem([]);
    toast.message("Cart cleared.");
  };

  const getItemQuantity = (productId = "", size?: string, color?: string) =>
    items.find((item) => getKey(item?.productId, item?.size ?? "", item?.color ?? "") === getKey(productId, size ?? "", color ?? ""))?.quantity ?? 0;

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      isOpen,
      subtotal,
      shippingFee,
      total,
      itemCount,
      shippingProgress,
      openCart: () => setIsOpen(true),
      closeCart: () => setIsOpen(false),
      toggleCart: () => setIsOpen((prev) => !prev),
      addItem,
      updateItem,
      removeItem,
      clearCart,
      getProduct,
      getItemQuantity,
    }),
    [items, isOpen, subtotal, shippingFee, total, itemCount, shippingProgress]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
}

export default CartProvider;