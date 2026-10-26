import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import type { CartItem, Order, Product, ShippingInfo } from "@/types";
import { products as mockProducts } from "@/data/mockData";

type CartLine = CartItem & { productId: string; quantity: number; size?: string; color?: string };
type CartContextValue = {
  items: CartLine[];
  subtotal: number;
  drawerOpen: boolean;
  setDrawerOpen: (open: boolean) => void;
  addItem: (product: Product, options?: { size?: string; color?: string; quantity?: number }) => void;
  updateItem: (productId: string, options: { size?: string; color?: string }, quantity: number) => void;
  removeItem: (productId: string, options?: { size?: string; color?: string }) => void;
  clearCart: () => void;
  getItemQuantity: (productId: string, options?: { size?: string; color?: string }) => number;
  buildOrder: (shipping: ShippingInfo, userId?: string) => Order;
};

const CartContext = createContext<CartContextValue | undefined>(undefined);
const STORAGE_KEY = "jootiya-cart-v1";

const normalize = (value?: string) => value?.trim() ?? "";
const lineKey = (productId: string, size?: string, color?: string) => `${productId}::${normalize(size)}::${normalize(color)}`;
const safeParse = (raw: string | null): CartLine[] => {
  try {
    const parsed = JSON.parse(raw ?? "[]") as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed
      .map((item) => ({
        productId: String((item as CartLine)?.productId ?? ""),
        quantity: Math.max(1, Number((item as CartLine)?.quantity ?? 1)),
        size: normalize((item as CartLine)?.size),
        color: normalize((item as CartLine)?.color),
      }))
      .filter((item) => item.productId.length > 0);
  } catch {
    return [];
  }
};

const findProduct = (productId: string) => mockProducts.find((product) => product.id === productId) ?? null;

export function CartProvider({ children }: { children?: React.ReactNode } = {}) {
  const [items, setItems] = useState<CartLine[]>([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setItems(safeParse(window.localStorage.getItem(STORAGE_KEY)));
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [hydrated, items]);

  const subtotal = useMemo(
    () =>
      items.reduce((sum, item) => {
        const product = findProduct(item.productId);
        return sum + (product?.price ?? 0) * item.quantity;
      }, 0),
    [items]
  );

  const getItemQuantity = useCallback(
    (productId: string, options: { size?: string; color?: string } = {}) =>
      items.find((item) => lineKey(item.productId, item.size, item.color) === lineKey(productId, options.size, options.color))?.quantity ?? 0,
    [items]
  );

  const addItem = useCallback((product: Product, options: { size?: string; color?: string; quantity?: number } = {}) => {
    const size = normalize(options.size);
    const color = normalize(options.color);
    const quantity = Math.max(1, Number(options.quantity ?? 1));
    if (product?.id == null) return;
    if (product?.sizes?.length && size && !product.sizes.includes(size)) {
      toast.error("Please choose an available size.");
      return;
    }
    if (product?.colors?.length && color && !product.colors.includes(color)) {
      toast.error("Please choose an available color.");
      return;
    }
    setItems((current) => {
      const key = lineKey(product.id, size, color);
      const existing = current.find((item) => lineKey(item.productId, item.size, item.color) === key);
      if (existing) {
        return current.map((item) => (lineKey(item.productId, item.size, item.color) === key ? { ...item, quantity: item.quantity + quantity } : item));
      }
      return [...current, { productId: product.id, quantity, size: size || undefined, color: color || undefined }];
    });
    setDrawerOpen(true);
    toast.success(`${product?.name ?? "Item"} added to cart.`);
  }, []);

  const updateItem = useCallback((productId: string, options: { size?: string; color?: string }, quantity: number) => {
    const nextQuantity = Math.max(1, Number(quantity ?? 1));
    const size = normalize(options?.size);
    const color = normalize(options?.color);
    setItems((current) =>
      current.map((item) =>
        lineKey(item.productId, item.size, item.color) === lineKey(productId, size, color) ? { ...item, quantity: nextQuantity } : item
      )
    );
  }, []);

  const removeItem = useCallback((productId: string, options: { size?: string; color?: string } = {}) => {
    const size = normalize(options.size);
    const color = normalize(options.color);
    setItems((current) => current.filter((item) => lineKey(item.productId, item.size, item.color) !== lineKey(productId, size, color)));
    toast.message("Removed from cart.");
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
    toast.message("Cart cleared.");
  }, []);

  const buildOrder = useCallback(
    (shipping: ShippingInfo, userId?: string) => {
      const id = crypto.randomUUID();
      const shippingCost = subtotal > 0 ? 0 : 0;
      return {
        id,
        userId,
        items: items.map(({ productId, quantity, size, color }) => ({ productId, quantity, size, color })),
        shipping,
        subtotal,
        shippingCost,
        total: subtotal + shippingCost,
        status: "pending",
        createdAt: new Date().toISOString(),
      };
    },
    [items, subtotal]
  );

  const value = useMemo(
    () => ({ items, subtotal, drawerOpen, setDrawerOpen, addItem, updateItem, removeItem, clearCart, getItemQuantity, buildOrder }),
    [items, subtotal, drawerOpen, addItem, updateItem, removeItem, clearCart, getItemQuantity, buildOrder]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
}

export default CartProvider;