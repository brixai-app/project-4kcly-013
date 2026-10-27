import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { CartItem, Order, PaymentInfo, Product, ProductSize, ShippingInfo } from '@/types';
import { products as mockProducts } from '@/data/mockData';

type CartContextValue = {
  items: CartItem[];
  selectedSizes: Record<string, ProductSize>;
  isCartOpen: boolean;
  subtotal: number;
  shipping: number;
  total: number;
  itemCount: number;
  setCartOpen: (open: boolean) => void;
  toggleCart: () => void;
  setSelectedSize: (productId: string, size: ProductSize) => void;
  addToCart: (product: Product, size?: ProductSize, quantity?: number) => void;
  updateQuantity: (productId: string, size: ProductSize, quantity: number) => void;
  removeFromCart: (productId: string, size: ProductSize) => void;
  clearCart: () => void;
  checkout: (shippingInfo: ShippingInfo, paymentInfo: PaymentInfo) => Promise<Order>;
};

const CartContext = createContext<CartContextValue | undefined>(undefined);

const STORAGE_KEY = 'jootiya-cart-v1';
const SIZE_KEY = 'jootiya-sizes-v1';

const getDefaultSize = (product?: Product | null): ProductSize => product?.sizes?.[0] ?? 'UK 8';

const safeProducts = (): Product[] => mockProducts ?? [];

const findProduct = (productId: string) => safeProducts().find((product) => product?.id === productId) ?? null;

const persist = (items: CartItem[], selectedSizes: Record<string, ProductSize>) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    localStorage.setItem(SIZE_KEY, JSON.stringify(selectedSizes));
  } catch {}
};

const loadItems = (): CartItem[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as CartItem[]) : [];
  } catch {
    return [];
  }
};

const loadSizes = (): Record<string, ProductSize> => {
  try {
    const raw = localStorage.getItem(SIZE_KEY);
    return raw ? (JSON.parse(raw) as Record<string, ProductSize>) : {};
  } catch {
    return {};
  }
};

export function CartProvider({ children }: { children?: React.ReactNode } = {}) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<Record<string, ProductSize>>({});
  const [isCartOpen, setCartOpen] = useState(false);

  useEffect(() => {
    setItems(loadItems());
    setSelectedSizes(loadSizes());
  }, []);

  useEffect(() => {
    persist(items, selectedSizes);
  }, [items, selectedSizes]);

  const setSelectedSize = (productId: string, size: ProductSize) => {
    setSelectedSizes((prev) => ({ ...prev, [productId]: size }));
  };

  const addToCart = (product: Product, size?: ProductSize, quantity = 1) => {
    const chosenSize = size ?? selectedSizes?.[product?.id ?? ''] ?? getDefaultSize(product);
    setSelectedSize(product?.id ?? '', chosenSize);
    setItems((prev) => {
      const existing = prev.find((item) => item?.productId === product?.id && item?.size === chosenSize);
      if (existing) {
        return prev.map((item) =>
          item?.productId === product?.id && item?.size === chosenSize
            ? { ...item, quantity: Math.min((item?.quantity ?? 0) + quantity, 10) }
            : item
        );
      }
      return [
        ...prev,
        {
          productId: product?.id ?? '',
          quantity: Math.max(1, Math.min(quantity, 10)),
          size: chosenSize,
          price: product?.price ?? 0,
          name: product?.name ?? '',
          image: product?.image ?? '',
          slug: product?.slug ?? '',
        },
      ];
    });
    setCartOpen(true);
  };

  const updateQuantity = (productId: string, size: ProductSize, quantity: number) => {
    const product = findProduct(productId);
    const maxStock = product?.inStock === false ? 0 : 10;
    const nextQuantity = Math.max(0, Math.min(quantity, maxStock || 10));
    setItems((prev) =>
      nextQuantity <= 0
        ? prev.filter((item) => !(item?.productId === productId && item?.size === size))
        : prev.map((item) => (item?.productId === productId && item?.size === size ? { ...item, quantity: nextQuantity } : item))
    );
  };

  const removeFromCart = (productId: string, size: ProductSize) => {
    setItems((prev) => prev.filter((item) => !(item?.productId === productId && item?.size === size)));
  };

  const clearCart = () => {
    setItems([]);
    setSelectedSizes({});
    setCartOpen(false);
    try {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(SIZE_KEY);
    } catch {}
  };

  const subtotal = useMemo(() => items.reduce((sum, item) => sum + (item?.price ?? 0) * (item?.quantity ?? 0), 0), [items]);
  const shipping = useMemo(() => (subtotal > 0 && subtotal < 5000 ? 250 : 0), [subtotal]);
  const total = subtotal + shipping;
  const itemCount = useMemo(() => items.reduce((sum, item) => sum + (item?.quantity ?? 0), 0), [items]);

  const checkout = async (shippingInfo: ShippingInfo, paymentInfo: PaymentInfo) => {
    const order: Order = {
      id: crypto.randomUUID(),
      orderNumber: `JT-${Math.floor(100000 + Math.random() * 900000)}`,
      items,
      subtotal,
      shipping,
      total,
      shippingInfo,
      paymentInfo,
      status: 'confirmed',
      createdAt: new Date().toISOString(),
    };
    clearCart();
    return order;
  };

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      selectedSizes,
      isCartOpen,
      subtotal,
      shipping,
      total,
      itemCount,
      setCartOpen,
      toggleCart: () => setCartOpen((prev) => !prev),
      setSelectedSize,
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart,
      checkout,
    }),
    [items, selectedSizes, isCartOpen, subtotal, shipping, total, itemCount]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
}

export default CartContext;
export { CartContext };
