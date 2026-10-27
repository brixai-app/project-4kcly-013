import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { products } from '@/data/mockData';
import type { CartItem, Order, Product } from '@/types';

type CartLine = CartItem & { product: Product };
type CartContextValue = {
  items: CartLine[];
  isOpen: boolean;
  subtotal: number;
  shippingFee: number;
  total: number;
  itemCount: number;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  addItem: (productId: string, quantity?: number, size?: string, color?: string) => void;
  updateItem: (productId: string, quantity: number, size?: string, color?: string) => void;
  removeItem: (productId: string, size?: string, color?: string) => void;
  clearCart: () => void;
  checkout: (shipping: Order['shipping']) => Promise<Order | null>;
  getProduct: (productId: string) => Product | undefined;
};

const CartContext = createContext<CartContextValue | undefined>(undefined);
const STORAGE_KEY = 'jootiya-cart-v1';

const getKey = (productId: string, size?: string, color?: string) => `${productId}::${size ?? ''}::${color ?? ''}`;
const getStockLimit = (product?: Product) => (product?.inStock === false ? 0 : 10);

export function CartProvider({ children }: { children?: React.ReactNode }) {
  const [rawItems, setRawItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored) setRawItems(JSON.parse(stored) as CartItem[]);
    } catch {
      setRawItems([]);
    }
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(rawItems));
    } catch {}
  }, [rawItems]);

  const getProduct = useCallback((productId: string) => products.find((product) => product.id === productId), []);

  const items = useMemo(
    () =>
      rawItems
        .map((item) => {
          const product = getProduct(item.productId);
          return product ? { ...item, product } : null;
        })
        .filter(Boolean) as CartLine[],
    [getProduct, rawItems],
  );

  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + item.product.price * item.quantity, 0),
    [items],
  );
  const shippingFee = subtotal > 0 && subtotal < 5000 ? 250 : 0;
  const total = subtotal + shippingFee;
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const syncItems = useCallback((updater: (current: CartItem[]) => CartItem[]) => {
    setRawItems((current) => updater(current));
  }, []);

  const addItem = useCallback((productId: string, quantity = 1, size?: string, color?: string) => {
    const product = getProduct(productId);
    const limit = getStockLimit(product);
    if (!product || limit <= 0) return toast.error('This style is currently unavailable.');
    syncItems((current) => {
      const key = getKey(productId, size, color);
      const existing = current.find((item) => getKey(item.productId, item.size, item.color) === key);
      if (!existing) return [...current, { productId, quantity: Math.min(quantity, limit), size, color }];
      return current.map((item) =>
        getKey(item.productId, item.size, item.color) === key
          ? { ...item, quantity: Math.min(item.quantity + quantity, limit) }
          : item,
      );
    });
    setIsOpen(true);
    toast.success('Added to cart.');
  }, [getProduct, syncItems]);

  const updateItem = useCallback((productId: string, quantity: number, size?: string, color?: string) => {
    const product = getProduct(productId);
    const limit = getStockLimit(product);
    syncItems((current) =>
      current
        .map((item) =>
          getKey(item.productId, item.size, item.color) === getKey(productId, size, color)
            ? { ...item, quantity: Math.min(Math.max(quantity, 1), limit) }
            : item,
        )
        .filter((item) => item.quantity > 0),
    );
  }, [getProduct, syncItems]);

  const removeItem = useCallback((productId: string, size?: string, color?: string) => {
    syncItems((current) => current.filter((item) => getKey(item.productId, item.size, item.color) !== getKey(productId, size, color)));
    toast.message('Removed from cart.');
  }, [syncItems]);

  const clearCart = useCallback(() => {
    setRawItems([]);
    toast.message('Cart cleared.');
  }, []);

  const checkout = useCallback(async (shipping: Order['shipping']) => {
    if (!items.length) {
      toast.error('Your cart is empty.');
      return null;
    }
    const order: Order = {
      id: crypto.randomUUID(),
      items: rawItems,
      shipping,
      subtotal,
      shippingFee,
      total,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(order),
      });
      if (!response.ok) throw new Error('Checkout failed');
      clearCart();
      setIsOpen(false);
      toast.success('Order placed successfully.');
      return order;
    } catch {
      toast.error('Unable to place order right now.');
      return null;
    }
  }, [clearCart, items.length, rawItems, shippingFee, subtotal, total]);

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      isOpen,
      subtotal,
      shippingFee,
      total,
      itemCount,
      openCart: () => setIsOpen(true),
      closeCart: () => setIsOpen(false),
      toggleCart: () => setIsOpen((current) => !current),
      addItem,
      updateItem,
      removeItem,
      clearCart,
      checkout,
      getProduct,
    }),
    [addItem, checkout, clearCart, getProduct, isOpen, itemCount, items, removeItem, shippingFee, subtotal, total, updateItem],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
}

export default CartProvider;