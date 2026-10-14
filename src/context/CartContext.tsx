import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import type {
  CartItem,
  CartState,
  Order,
  PaymentMethod,
  Product,
  ShippingInfo,
  Size,
  ColorVariant,
} from '@/types';
import { products, getProductById, computeStockKey } from '@/data/mockData';

export interface CartContextValue {
  state: CartState;
  isDrawerOpen: boolean;
  lastOrder: Order | null;
  subtotal: number;
  itemCount: number;
  openDrawer: () => void;
  closeDrawer: () => void;
  toggleDrawer: () => void;
  clearCart: () => void;
  addItem: (opts: {
    productId: string;
    size: Size;
    color: ColorVariant;
    quantity?: number;
  }) => void;
  updateItemQuantity: (cartItemId: string, quantity: number) => void;
  removeItem: (cartItemId: string) => void;
  placeOrder: (info: ShippingInfo, method: PaymentMethod) => Order | null;
}

const defaultCartState: CartState = {
  items: [],
  lastUpdated: null,
};

const defaultContextValue: CartContextValue = {
  state: defaultCartState,
  isDrawerOpen: false,
  lastOrder: null,
  subtotal: 0,
  itemCount: 0,
  openDrawer: () => undefined,
  closeDrawer: () => undefined,
  toggleDrawer: () => undefined,
  clearCart: () => undefined,
  addItem: () => undefined,
  updateItemQuantity: () => undefined,
  removeItem: () => undefined,
  placeOrder: () => null,
};

const RawCartContext = createContext<CartContextValue>(defaultContextValue);

const CART_STORAGE_KEY = 'jootiya_cart_v1';
const ORDER_STORAGE_KEY = 'jootiya_last_order_v1';

function loadCartFromStorage(): CartState {
  try {
    const raw = window.localStorage?.getItem(CART_STORAGE_KEY) ?? '';
    if (!raw) return defaultCartState;
    const parsed = JSON.parse(raw) as CartState;
    if (!parsed?.items) return defaultCartState;
    return {
      items: Array.isArray(parsed.items) ? parsed.items : [],
      lastUpdated: parsed.lastUpdated ?? null,
    };
  } catch {
    return defaultCartState;
  }
}

function saveCartToStorage(state: CartState) {
  try {
    window.localStorage?.setItem(CART_STORAGE_KEY, JSON.stringify(state));
  } catch {
    // ignore
  }
}

function loadOrderFromStorage(): Order | null {
  try {
    const raw = window.localStorage?.getItem(ORDER_STORAGE_KEY) ?? '';
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Order;
    return parsed ?? null;
  } catch {
    return null;
  }
}

function saveOrderToStorage(order: Order | null) {
  try {
    if (!order) {
      window.localStorage?.removeItem(ORDER_STORAGE_KEY);
      return;
    }
    window.localStorage?.setItem(ORDER_STORAGE_KEY, JSON.stringify(order));
  } catch {
    // ignore
  }
}

export interface CartProviderProps {
  children?: React.ReactNode;
}

export function CartProvider({ children = null }: CartProviderProps) {
  const [state, setState] = useState<CartState>(() => loadCartFromStorage());
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [lastOrder, setLastOrder] = useState<Order | null>(() => loadOrderFromStorage());

  useEffect(() => {
    saveCartToStorage(state);
  }, [state]);

  useEffect(() => {
    saveOrderToStorage(lastOrder);
  }, [lastOrder]);

  const subtotal = useMemo(
    () =>
      state.items.reduce((sum, item) => {
        const lineTotal = item.price * item.quantity;
        return sum + (Number.isFinite(lineTotal) ? lineTotal : 0);
      }, 0),
    [state.items],
  );

  const itemCount = useMemo(
    () => state.items.reduce((sum, item) => sum + (item.quantity ?? 0), 0),
    [state.items],
  );

  const openDrawer = () => setIsDrawerOpen(true);
  const closeDrawer = () => setIsDrawerOpen(false);
  const toggleDrawer = () => setIsDrawerOpen(prev => !prev);

  const refreshMaxAvailable = (product: Product, size: Size, color: ColorVariant): number => {
    const key = computeStockKey(size, color);
    const available = product.stockByKey?.[key] ?? 0;
    const existingQty = state.items
      .filter(i => i.productId === product.id && i.size === size && i.color === color)
      .reduce((sum, i) => sum + i.quantity, 0);
    const remaining = available - existingQty;
    return remaining > 0 ? remaining : 0;
  };

  const clearCart = () => {
    setState({ items: [], lastUpdated: new Date().toISOString() });
  };

  const addItem: CartContextValue['addItem'] = ({ productId, size, color, quantity = 1 }) => {
    const product = getProductById(productId);
    if (!product) {
      toast.error('Product not found');
      return;
    }
    if (quantity <= 0) {
      toast.error('Quantity must be at least 1');
      return;
    }
    const maxAvailable = refreshMaxAvailable(product, size, color);
    if (maxAvailable <= 0) {
      toast.error('Selected variant is out of stock');
      return;
    }
    const addQty = Math.min(quantity, maxAvailable);
    if (addQty < quantity) {
      toast.warning(`Only ${maxAvailable} pairs left in this variant`);
    }
    setState(prev => {
      const existingIndex = prev.items.findIndex(
        item =>
          item.productId === productId &&
          item.size === size &&
          item.color === color &&
          item.imageUrl === (product.images?.[0]?.url ?? ''),
      );
      const newItems = [...prev.items];
      if (existingIndex >= 0) {
        const existing = newItems[existingIndex];
        const newQty = Math.min(existing.quantity + addQty, existing.maxAvailable);
        newItems[existingIndex] = { ...existing, quantity: newQty };
      } else {
        const imageUrl = product.images?.[0]?.url ?? '';
        const newItem: CartItem = {
          id: `${product.id}-${size}-${color}-${Date.now()}`,
          productId: product.id,
          name: product.name,
          price: product.price,
          currency: product.currency,
          size,
          color,
          quantity: addQty,
          imageUrl,
          maxAvailable,
        };
        newItems.push(newItem);
      }
      toast.success('Added to cart');
      return { items: newItems, lastUpdated: new Date().toISOString() };
    });
    openDrawer();
  };

  const updateItemQuantity: CartContextValue['updateItemQuantity'] = (cartItemId, quantity) => {
    if (quantity <= 0) {
      setState(prev => ({
        items: prev.items.filter(item => item.id !== cartItemId),
        lastUpdated: new Date().toISOString(),
      }));
      toast.info('Item removed from cart');
      return;
    }
    setState(prev => {
      const newItems = prev.items.map(item => {
        if (item.id !== cartItemId) return item;
        const nextQty = Math.min(quantity, item.maxAvailable);
        if (nextQty < quantity) {
          toast.warning(`Only ${item.maxAvailable} pairs available`);
        }
        return { ...item, quantity: nextQty };
      });
      return { items: newItems, lastUpdated: new Date().toISOString() };
    });
  };

  const removeItem: CartContextValue['removeItem'] = cartItemId => {
    setState(prev => ({
      items: prev.items.filter(item => item.id !== cartItemId),
      lastUpdated: new Date().toISOString(),
    }));
    toast.info('Item removed from cart');
  };

  const placeOrder: CartContextValue['placeOrder'] = (info, method) => {
    if (!state.items.length) {
      toast.error('Your cart is empty');
      return null;
    }
    const shippingValid =
      info.fullName?.trim() &&
      info.email?.trim() &&
      info.phone?.trim() &&
      info.addressLine1?.trim() &&
      info.city?.trim() &&
      info.state?.trim() &&
      info.postalCode?.trim() &&
      info.country?.trim();
    if (!shippingValid) {
      toast.error('Please complete all required shipping fields');
      return null;
    }
    const shippingFee = subtotal >= 5000 ? 0 : 299;
    const total = subtotal + shippingFee;
    const order: Order = {
      id: `ORD-${Date.now()}`,
      items: state.items,
      subtotal,
      shippingFee,
      total,
      currency: 'INR',
      shippingInfo: info,
      paymentMethod: method,
      createdAt: new Date().toISOString(),
    };
    setLastOrder(order);
    clearCart();
    toast.success('Order placed successfully');
    return order;
  };

  const value: CartContextValue = {
    state,
    isDrawerOpen,
    lastOrder,
    subtotal,
    itemCount,
    openDrawer,
    closeDrawer,
    toggleDrawer,
    clearCart,
    addItem,
    updateItemQuantity,
    removeItem,
    placeOrder,
  };

  return <RawCartContext.Provider value={value}>{children}</RawCartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(RawCartContext);
  return ctx ?? defaultContextValue;
}

export const CartContext = RawCartContext;
export default CartContext;