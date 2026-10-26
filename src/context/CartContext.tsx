import React, { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { toast } from "sonner";
import { products } from "@/data/mockData";
import type { CartItem, CheckoutValidationResult, Order, PaymentInfo, Product, ShippingInfo } from "@/types";

type CartContextValue = {
  items: CartItem[];
  isDrawerOpen: boolean;
  setIsDrawerOpen: (open: boolean) => void;
  openCart: () => void;
  closeCart: () => void;
  addItem: (productId: string, quantity?: number, size?: string | null, color?: string | null) => void;
  updateItem: (productId: string, quantity: number, size?: string | null, color?: string | null) => void;
  removeItem: (productId: string, size?: string | null, color?: string | null) => void;
  clearCart: () => void;
  subtotal: number;
  itemCount: number;
  checkoutOrder: (shipping: ShippingInfo, payment: PaymentInfo) => Promise<Order | null>;
  validateCheckout: (shipping: ShippingInfo, payment: PaymentInfo) => CheckoutValidationResult;
  getProductById: (productId: string) => Product | null;
};

const CartContext = createContext<CartContextValue | undefined>(undefined);
const STORAGE_KEY = "jootiya-cart-v1";
const ORDER_KEY = "jootiya-orders-v1";

const safeParse = <T,>(value: string | null, fallback: T): T => {
  try {
    return value ? (JSON.parse(value) as T) : fallback;
  } catch {
    return fallback;
  }
};

const getProduct = (productId: string) => products.find((product) => product.id === productId) ?? null;

const getKey = (item: Pick<CartItem, "productId" | "size" | "color">) =>
  `${item.productId}::${item.size ?? ""}::${item.color ?? ""}`;

const getStock = (productId: string) => getProduct(productId)?.stock ?? 0;

const clampQuantity = (productId: string, quantity: number) => Math.max(0, Math.min(quantity, getStock(productId)));

const validateCheckout = (shipping: ShippingInfo, payment: PaymentInfo): CheckoutValidationResult => {
  const errors: CheckoutValidationResult["errors"] = {};
  if (!shipping?.fullName?.trim()) errors.fullName = "Full name is required.";
  if (!shipping?.phone?.trim()) errors.phone = "Phone number is required.";
  if (!shipping?.email?.trim()) errors.email = "Email is required.";
  if (!shipping?.addressLine1?.trim()) errors.addressLine1 = "Address is required.";
  if (!shipping?.city?.trim()) errors.city = "City is required.";
  if (!shipping?.state?.trim()) errors.state = "State is required.";
  if (!shipping?.postalCode?.trim()) errors.postalCode = "Postal code is required.";
  if (!shipping?.country?.trim()) errors.country = "Country is required.";
  if (!payment?.method) errors.paymentMethod = "Select a payment method.";
  if (payment?.method === "upi" && !payment?.upiId?.trim()) errors.upiId = "UPI ID is required.";
  if (payment?.method === "card" && !payment?.cardholderName?.trim()) errors.cardholderName = "Cardholder name is required.";
  if (payment?.method === "card" && !payment?.cardLast4?.trim()) errors.cardLast4 = "Last 4 digits are required.";
  return { valid: Object.keys(errors).length === 0, errors };
};

export function CartProvider({ children }: { children?: ReactNode } = {}) {
  const [items, setItems] = useState<CartItem[]>(() => safeParse<CartItem[]>(localStorage.getItem(STORAGE_KEY), []));
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const openCart = () => setIsDrawerOpen(true);
  const closeCart = () => setIsDrawerOpen(false);

  const addItem = (productId: string, quantity = 1, size: string | null = null, color: string | null = null) => {
    const product = getProduct(productId);
    if (!product) return toast.error("Product not found.");
    if (!product.inStock || product.stock <= 0) return toast.error("This style is currently out of stock.");
    setItems((current) => {
      const key = getKey({ productId, size, color });
      const existing = current.find((item) => getKey(item) === key);
      const nextQuantity = clampQuantity(productId, (existing?.quantity ?? 0) + quantity);
      if (nextQuantity <= 0) return current;
      if (existing) return current.map((item) => (getKey(item) === key ? { ...item, quantity: nextQuantity } : item));
      return [...current, { productId, quantity: clampQuantity(productId, quantity), size, color }].filter((item) => item.quantity > 0);
    });
    toast.success("Added to cart.");
  };

  const updateItem = (productId: string, quantity: number, size: string | null = null, color: string | null = null) => {
    const nextQuantity = clampQuantity(productId, quantity);
    setItems((current) =>
      nextQuantity <= 0
        ? current.filter((item) => getKey(item) !== getKey({ productId, size, color }))
        : current.map((item) => (getKey(item) === getKey({ productId, size, color }) ? { ...item, quantity: nextQuantity } : item)),
    );
  };

  const removeItem = (productId: string, size: string | null = null, color: string | null = null) => {
    setItems((current) => current.filter((item) => getKey(item) !== getKey({ productId, size, color })));
    toast.message("Removed from cart.");
  };

  const clearCart = () => {
    setItems([]);
    toast.message("Cart cleared.");
  };

  const subtotal = useMemo(
    () =>
      items.reduce((sum, item) => {
        const product = getProduct(item.productId);
        return sum + (product?.price ?? 0) * item.quantity;
      }, 0),
    [items],
  );

  const itemCount = useMemo(() => items.reduce((sum, item) => sum + item.quantity, 0), [items]);

  const checkoutOrder = async (shipping: ShippingInfo, payment: PaymentInfo) => {
    const result = validateCheckout(shipping, payment);
    if (!result.valid) {
      toast.error("Please complete the checkout form.");
      return null;
    }
    if (!items.length) {
      toast.error("Your cart is empty.");
      return null;
    }
    const order: Order = {
      id: crypto.randomUUID(),
      orderNumber: `JT-${Date.now().toString().slice(-6)}-${Math.floor(Math.random() * 900 + 100)}`,
      items,
      shipping,
      payment,
      subtotal,
      shippingFee: subtotal >= 2500 ? 0 : 149,
      total: subtotal + (subtotal >= 2500 ? 0 : 149),
      status: "pending",
      createdAt: new Date().toISOString(),
    };
    const orders = safeParse<Order[]>(localStorage.getItem(ORDER_KEY), []);
    localStorage.setItem(ORDER_KEY, JSON.stringify([order, ...orders]));
    clearCart();
    closeCart();
    toast.success("Order placed successfully.");
    return order;
  };

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      isDrawerOpen,
      setIsDrawerOpen,
      openCart,
      closeCart,
      addItem,
      updateItem,
      removeItem,
      clearCart,
      subtotal,
      itemCount,
      checkoutOrder,
      validateCheckout,
      getProductById: getProduct,
    }),
    [items, isDrawerOpen, subtotal, itemCount],
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
