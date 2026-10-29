import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { products } from "@/data/mockData";
import type { CartItem, CheckoutForm, MojriProduct, Order } from "@/types";

type CartContextValue = {
  items: CartItem[];
  isDrawerOpen: boolean;
  isCheckoutOpen: boolean;
  latestOrder: Order | null;
  subtotal: number;
  shipping: number;
  total: number;
  itemCount: number;
  openDrawer: () => void;
  closeDrawer: () => void;
  toggleDrawer: () => void;
  openCheckout: () => void;
  closeCheckout: () => void;
  addToCart: (product: MojriProduct, options?: { size?: string; color?: string; quantity?: number }) => void;
  addItem: CartContextValue["addToCart"];
  removeFromCart: (productId: string, options?: { size?: string; color?: string }) => void;
  removeItem: CartContextValue["removeFromCart"];
  updateQuantity: (productId: string, quantity: number, options?: { size?: string; color?: string }) => void;
  clearCart: () => void;
  placeOrder: (customer: CheckoutForm) => Order | null;
};

const CartContext = createContext<CartContextValue | undefined>(undefined);
const CART_KEY = "jootiya-cart";
const ORDER_KEY = "jootiya-latest-order";

const getKey = (item: CartItem) => `${item.productId}::${item.size ?? ""}::${item.color ?? ""}`;
const getProduct = (productId: string) => products.find((product) => product.id === productId);

export function CartProvider({ children }: { children?: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [latestOrder, setLatestOrder] = useState<Order | null>(null);

  useEffect(() => {
    try {
      const savedItems = localStorage.getItem(CART_KEY);
      const savedOrder = localStorage.getItem(ORDER_KEY);
      if (savedItems) setItems(JSON.parse(savedItems) as CartItem[]);
      if (savedOrder) setLatestOrder(JSON.parse(savedOrder) as Order);
    } catch {
      setItems([]);
      setLatestOrder(null);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    if (latestOrder) localStorage.setItem(ORDER_KEY, JSON.stringify(latestOrder));
  }, [latestOrder]);

  const subtotal = useMemo(
    () =>
      items.reduce((sum, item) => {
        const product = getProduct(item.productId);
        return sum + (product?.price ?? 0) * item.quantity;
      }, 0),
    [items],
  );

  const shipping = useMemo(() => (subtotal > 0 && subtotal < 5000 ? 250 : subtotal > 0 ? 0 : 0), [subtotal]);
  const total = subtotal + shipping;
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const openDrawer = useCallback(() => setIsDrawerOpen(true), []);
  const closeDrawer = useCallback(() => setIsDrawerOpen(false), []);
  const toggleDrawer = useCallback(() => setIsDrawerOpen((value) => !value), []);
  const openCheckout = useCallback(() => setIsCheckoutOpen(true), []);
  const closeCheckout = useCallback(() => setIsCheckoutOpen(false), []);

  const addToCart = useCallback<CartContextValue["addToCart"]>((product, options = {}) => {
    const quantity = Math.max(1, options.quantity ?? 1);
    const size = options.size ?? product.sizes?.[0] ?? "";
    const color = options.color ?? product.colors?.[0] ?? "";
    if (product.inStock === false) {
      toast.error("This pair is currently unavailable.");
      return;
    }
    setItems((current) => {
      const existing = current.find((item) => item.productId === product.id && (item.size ?? "") === size && (item.color ?? "") === color);
      if (existing) {
        return current.map((item) =>
          getKey(item) === getKey(existing)
            ? { ...item, quantity: item.quantity + quantity }
            : item,
        );
      }
      return [...current, { productId: product.id, quantity, size: size || undefined, color: color || undefined }];
    });
    toast.success(`${product.name} added to cart.`);
    setIsDrawerOpen(true);
  }, []);

  const removeFromCart = useCallback<CartContextValue["removeFromCart"]>((productId, options = {}) => {
    setItems((current) => current.filter((item) => !(item.productId === productId && (item.size ?? "") === (options.size ?? "") && (item.color ?? "") === (options.color ?? ""))));
    toast.message("Removed from cart.");
  }, []);

  const updateQuantity = useCallback<CartContextValue["updateQuantity"]>((productId, quantity, options = {}) => {
    const nextQuantity = Math.max(0, quantity);
    setItems((current) =>
      current
        .map((item) =>
          item.productId === productId && (item.size ?? "") === (options.size ?? "") && (item.color ?? "") === (options.color ?? "")
            ? { ...item, quantity: nextQuantity }
            : item,
        )
        .filter((item) => item.quantity > 0),
    );
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const placeOrder = useCallback<CartContextValue["placeOrder"]>((customer) => {
    if (!items.length) {
      toast.error("Your cart is empty.");
      return null;
    }
    const order: Order = {
      id: crypto.randomUUID(),
      items: items.map((item) => {
        const product = getProduct(item.productId);
        return {
          productId: item.productId,
          name: product?.name ?? "Mojri",
          price: product?.price ?? 0,
          quantity: item.quantity,
          size: item.size,
          color: item.color,
          image: product?.image,
        };
      }),
      subtotal,
      shipping,
      total,
      customer,
      createdAt: new Date().toISOString(),
      status: "placed",
    };
    setLatestOrder(order);
    setItems([]);
    setIsCheckoutOpen(false);
    setIsDrawerOpen(false);
    toast.success("Order placed successfully.");
    return order;
  }, [items, shipping, subtotal, total]);

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      isDrawerOpen,
      isCheckoutOpen,
      latestOrder,
      subtotal,
      shipping,
      total,
      itemCount,
      openDrawer,
      closeDrawer,
      toggleDrawer,
      openCheckout,
      closeCheckout,
      addToCart,
      addItem: addToCart,
      removeFromCart,
      removeItem: removeFromCart,
      updateQuantity,
      clearCart,
      placeOrder,
    }),
    [items, isDrawerOpen, isCheckoutOpen, latestOrder, subtotal, shipping, total, itemCount, openDrawer, closeDrawer, toggleDrawer, openCheckout, closeCheckout, addToCart, removeFromCart, updateQuantity, clearCart, placeOrder],
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
