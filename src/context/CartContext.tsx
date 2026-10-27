import React, { createContext, useContext, useMemo, useState } from 'react';
import { toast } from 'sonner';
import type { CartItem, CheckoutFormState, Order, Product, ShippingInfo } from '@/types';

type CartContextValue = {
  items: CartItem[];
  isOpen: boolean;
  latestOrder: Order | null;
  subtotal: number;
  shippingFee: number;
  total: number;
  itemCount: number;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  addItem: (product: Product, quantity?: number, size?: string) => void;
  updateQuantity: (productId: string, quantity: number, size?: string) => void;
  removeItem: (productId: string, size?: string) => void;
  clearCart: () => void;
  setDrawerOpen: (open: boolean) => void;
  setLatestOrder: (order: Order | null) => void;
  createOrderFromCheckout: (form: CheckoutFormState) => Order;
};

const CartContext = createContext<CartContextValue | undefined>(undefined);

const clampQuantity = (quantity: number) => Math.min(5, Math.max(1, Math.round(quantity || 1)));

const makeKey = (productId: string, size?: string) => `${productId}::${size ?? 'default'}`;

const buildShipping = (form: CheckoutFormState): ShippingInfo => ({
  fullName: form?.shipping?.fullName ?? '',
  phone: form?.shipping?.phone ?? '',
  email: form?.shipping?.email ?? '',
  addressLine1: form?.shipping?.addressLine1 ?? '',
  addressLine2: form?.shipping?.addressLine2 ?? '',
  city: form?.shipping?.city ?? '',
  state: form?.shipping?.state ?? '',
  postalCode: form?.shipping?.postalCode ?? '',
  country: form?.shipping?.country ?? 'India',
});

export function CartProvider({ children }: { children?: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [latestOrder, setLatestOrder] = useState<Order | null>(null);

  const subtotal = useMemo(
    () =>
      items.reduce((sum, item) => {
        const price = item?.product?.price ?? 0;
        return sum + price * (item?.quantity ?? 0);
      }, 0),
    [items],
  );

  const shippingFee = useMemo(() => (subtotal > 0 && subtotal < 5000 ? 250 : 0), [subtotal]);
  const total = useMemo(() => subtotal + shippingFee, [subtotal, shippingFee]);
  const itemCount = useMemo(() => items.reduce((sum, item) => sum + (item?.quantity ?? 0), 0), [items]);

  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);
  const toggleCart = () => setIsOpen((prev) => !prev);
  const setDrawerOpen = (open: boolean) => setIsOpen(open);

  const addItem = (product: Product, quantity = 1, size?: string) => {
    if (!product?.id) return;
    const nextQuantity = clampQuantity(quantity);
    setItems((prev) => {
      const key = makeKey(product.id, size);
      const index = prev.findIndex((item) => makeKey(item?.productId ?? '', item?.size) === key);
      if (index >= 0) {
        const next = [...prev];
        const current = next[index];
        next[index] = { ...current, quantity: clampQuantity((current?.quantity ?? 0) + nextQuantity), product };
        return next;
      }
      return [...prev, { productId: product.id, quantity: nextQuantity, size, product }];
    });
    toast.success(`${product?.name ?? 'Item'} added to cart`);
    setIsOpen(true);
  };

  const updateQuantity = (productId: string, quantity: number, size?: string) => {
    const nextQuantity = clampQuantity(quantity);
    setItems((prev) =>
      prev
        .map((item) =>
          makeKey(item?.productId ?? '', item?.size) === makeKey(productId, size)
            ? { ...item, quantity: nextQuantity }
            : item,
        )
        .filter((item) => (item?.quantity ?? 0) > 0),
    );
  };

  const removeItem = (productId: string, size?: string) => {
    setItems((prev) => prev.filter((item) => makeKey(item?.productId ?? '', item?.size) !== makeKey(productId, size)));
  };

  const clearCart = () => setItems([]);

  const createOrderFromCheckout = (form: CheckoutFormState) => {
    const order: Order = {
      id: crypto.randomUUID(),
      items: items.map((item) => ({ ...item })),
      shipping: buildShipping(form),
      paymentMethod: form?.paymentMethod ?? 'cod',
      subtotal,
      shippingFee,
      total,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    setLatestOrder(order);
    clearCart();
    closeCart();
    toast.success('Order created successfully');
    return order;
  };

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      isOpen,
      latestOrder,
      subtotal,
      shippingFee,
      total,
      itemCount,
      openCart,
      closeCart,
      toggleCart,
      addItem,
      updateQuantity,
      removeItem,
      clearCart,
      setDrawerOpen,
      setLatestOrder,
      createOrderFromCheckout,
    }),
    [items, isOpen, latestOrder, subtotal, shippingFee, total, itemCount],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
}

export default CartProvider;