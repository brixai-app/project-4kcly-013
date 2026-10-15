import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import type {
  CartContextValue,
  CartItem,
  CartPersistedState,
  CartState,
  CartTotals,
  Product,
  ShippingMethod,
} from '@/types';

const PERSIST_KEY = 'jootiya-cart-v1';
const PERSIST_VERSION = 1;

const defaultState: CartState = {
  items: [],
  status: 'idle',
  currency: 'INR',
  lastUpdatedAt: undefined,
};

const defaultContextValue: CartContextValue = {
  state: defaultState,
  addItem: () => undefined,
  removeItem: () => undefined,
  updateQuantity: () => undefined,
  clearCart: () => undefined,
  getResolvedItems: () => [],
  getTotals: () => ({
    subtotal: 0,
    shipping: 0,
    tax: 0,
    discount: 0,
    grandTotal: 0,
    currency: 'INR',
  }),
};

export const RawCartContext = createContext<CartContextValue>(defaultContextValue);

function readPersistedCart(): CartState {
  if (typeof window === 'undefined') return defaultState;
  try {
    const raw = window.localStorage.getItem(PERSIST_KEY);
    if (!raw) return defaultState;
    const parsed = JSON.parse(raw) as CartPersistedState;
    if (!parsed || typeof parsed !== 'object') return defaultState;
    if (parsed.version !== PERSIST_VERSION) return defaultState;
    return {
      items: parsed.items ?? [],
      status: parsed.status ?? 'idle',
      currency: parsed.currency ?? 'INR',
      lastUpdatedAt: parsed.lastUpdatedAt,
    };
  } catch {
    return defaultState;
  }
}

function writePersistedCart(state: CartState) {
  if (typeof window === 'undefined') return;
  const payload: CartPersistedState = {
    ...state,
    version: PERSIST_VERSION,
  };
  try {
    window.localStorage.setItem(PERSIST_KEY, JSON.stringify(payload));
  } catch {
    // ignore
  }
}

function calculateTax(subtotal: number): number {
  if (subtotal <= 0) return 0;
  const rate = 0.12;
  return Math.round(subtotal * rate);
}

export interface CartProviderProps {
  children?: React.ReactNode;
}

export function CartProvider({ children = null }: CartProviderProps) {
  const [state, setState] = useState<CartState>(() => readPersistedCart());

  useEffect(() => {
    writePersistedCart(state);
  }, [state]);

  const setStatus = useCallback((status: CartState['status']) => {
    setState(prev => ({
      ...prev,
      status,
      lastUpdatedAt: new Date().toISOString(),
    }));
  }, []);

  const addItem = useCallback(
    (product: Product, sizeId: string, quantity: number = 1) => {
      if (!product?.id || !sizeId) return;
      if (quantity <= 0) {
        toast.error('Quantity must be at least 1.');
        return;
      }

      const size = product.sizes.find(s => s.id === sizeId);
      if (!size) {
        toast.error('Selected size is unavailable.');
        return;
      }

      const stock = size.stock ?? 0;
      if (stock <= 0) {
        toast.error('This size is currently sold out.');
        return;
      }

      setStatus('updating');

      setState(prev => {
        const existingIndex = prev.items.findIndex(
          item => item.productId === product.id && item.sizeId === sizeId
        );
        const now = new Date().toISOString();
        let nextItems: CartItem[];

        if (existingIndex !== -1) {
          const existing = prev.items[existingIndex];
          const newQty = Math.min(existing.quantity + quantity, stock);
          if (newQty === existing.quantity) {
            toast.error('Maximum stock selected for this size.');
            return {
              ...prev,
              status: 'idle',
              lastUpdatedAt: now,
            };
          }
          const updated: CartItem = {
            ...existing,
            quantity: newQty,
            addedAt: now,
          };
          nextItems = [...prev.items];
          nextItems[existingIndex] = updated;
        } else {
          const newItem: CartItem = {
            id: `cart-${product.id}-${sizeId}-${Math.random().toString(36).slice(2)}`,
            productId: product.id,
            sizeId,
            quantity: Math.min(quantity, stock),
            unitPrice: product.price,
            currency: product.currency ?? prev.currency ?? 'INR',
            addedAt: now,
          };
          nextItems = [...prev.items, newItem];
        }

        toast.success('Added to bag', {
          description: `${product.name} • ${size.sizeLabel}`,
        });

        return {
          ...prev,
          items: nextItems,
          status: 'idle',
          currency: product.currency ?? prev.currency ?? 'INR',
          lastUpdatedAt: now,
        };
      });
    },
    [setStatus]
  );

  const removeItem = useCallback((cartItemId: string) => {
    if (!cartItemId) return;
    setStatus('updating');
    setState(prev => {
      const existing = prev.items.find(item => item.id === cartItemId);
      const filtered = prev.items.filter(item => item.id !== cartItemId);
      if (existing) {
        toast('Removed from bag', {
          description: `Item was removed from your cart.`,
        });
      }
      return {
        ...prev,
        items: filtered,
        status: 'idle',
        lastUpdatedAt: new Date().toISOString(),
      };
    });
  }, [setStatus]);

  const updateQuantity = useCallback(
    (cartItemId: string, quantity: number) => {
      if (!cartItemId) return;
      if (quantity <= 0) {
        removeItem(cartItemId);
        return;
      }

      setStatus('updating');
      setState(prev => {
        const index = prev.items.findIndex(item => item.id === cartItemId);
        if (index === -1) {
          return {
            ...prev,
            status: 'idle',
            lastUpdatedAt: new Date().toISOString(),
          };
        }
        const item = prev.items[index];
        const now = new Date().toISOString();

        // optimistic update; stock validation happens at resolve time
        const updated: CartItem = {
          ...item,
          quantity,
          addedAt: now,
        };
        const nextItems = [...prev.items];
        nextItems[index] = updated;
        return {
          ...prev,
          items: nextItems,
          status: 'idle',
          lastUpdatedAt: now,
        };
      });
    },
    [removeItem, setStatus]
  );

  const clearCart = useCallback(() => {
    if (!state.items.length) return;
    setStatus('updating');
    setState(prev => ({
      ...prev,
      items: [],
      status: 'idle',
      lastUpdatedAt: new Date().toISOString(),
    }));
    toast('Bag cleared', {
      description: 'Your cart has been emptied.',
    });
  }, [setStatus, state.items.length]);

  const getResolvedItems = useCallback(
    (products: Product[]) => {
      if (!Array.isArray(products) || !products.length) return [];
      return state.items
        .map<CartTotals | null>(() => null)
        .length; // purely to keep types happy, not used

      // eslint-disable-next-line no-unreachable
      return state.items
        .map(item => {
          const product = products.find(p => p.id === item.productId);
          if (!product) return null;
          const size = product.sizes.find(s => s.id === item.sizeId);
          if (!size) return null;

          const maxQty = size.stock ?? item.quantity;
          const safeQty = Math.min(item.quantity, maxQty);

          return {
            ...item,
            product,
            size,
            quantity: safeQty,
            lineTotal: safeQty * item.unitPrice,
          };
        })
        .filter((x): x is any => Boolean(x));
    },
    [state.items]
  );

  const memoizedGetResolvedItems = useCallback(
    (products: Product[]) => {
      if (!Array.isArray(products) || !products.length) return [];
      return state.items
        .map(item => {
          const product = products.find(p => p.id === item.productId);
          if (!product) return null;
          const size = product.sizes.find(s => s.id === item.sizeId);
          if (!size) return null;
          const maxQty = size.stock ?? item.quantity;
          const safeQty = Math.min(item.quantity, maxQty);
          return {
            ...item,
            product,
            size,
            quantity: safeQty,
            lineTotal: safeQty * item.unitPrice,
          };
        })
        .filter((x): x is any => Boolean(x));
    },
    [state.items]
  );

  const getTotals = useCallback(
    (products: Product[], shippingMethod?: ShippingMethod): CartTotals => {
      const resolved = memoizedGetResolvedItems(products);
      const subtotal = resolved.reduce((sum, item) => sum + item.lineTotal, 0);
      const shipping = shippingMethod?.amount ?? (subtotal > 15000 ? 0 : subtotal > 0 ? 499 : 0);
      const tax = calculateTax(subtotal);
      const discount = 0;
      const grandTotal = subtotal + shipping + tax - discount;
      return {
        subtotal,
        shipping,
        tax,
        discount,
        grandTotal,
        currency: state.currency ?? 'INR',
      };
    },
    [memoizedGetResolvedItems, state.currency]
  );

  const value: CartContextValue = useMemo(
    () => ({
      state,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      getResolvedItems: memoizedGetResolvedItems,
      getTotals,
    }),
    [state, addItem, removeItem, updateQuantity, clearCart, memoizedGetResolvedItems, getTotals]
  );

  return <RawCartContext.Provider value={value}>{children}</RawCartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(RawCartContext);
  return ctx ?? defaultContextValue;
}

const CartContext = {
  CartProvider,
  useCart,
  RawCartContext,
};

export { CartContext };
export default CartContext;