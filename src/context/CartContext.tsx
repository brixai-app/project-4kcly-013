import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import { toast } from 'sonner';
import type { CartItem, CheckoutValues, Order, Product, Size } from '@/types';
import { products, shippingRules } from '@/data/mockData';

type SavedState = { cartItems: CartItem[]; wishlist: string[]; newsletterEmail: string; orders: Order[] };
export interface CartContextValue extends SavedState {
  cart: CartItem[];
  cartCount: number;
  wishlistCount: number;
  subtotal: number;
  shipping: number;
  total: number;
  freeShippingThreshold: number;
  shippingProgress: number;
  amountToFreeShipping: number;
  newsletterSubscribed: boolean;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  openCart: () => void;
  closeCart: () => void;
  previewProduct: Product | null;
  setPreviewProduct: (product: Product | null) => void;
  openPreview: (product: Product) => void;
  closePreview: () => void;
  addToCart: (product: Product | string, size: Size, quantity?: number) => boolean;
  updateQuantity: (lineId: string, quantity: number) => void;
  removeFromCart: (lineId: string) => void;
  clearCart: () => void;
  toggleWishlist: (productId: string) => void;
  isWishlisted: (productId: string) => boolean;
  subscribeNewsletter: (email: string) => boolean;
  placeOrder: (customer: CheckoutValues) => Order | null;
}
const STORAGE_KEY = 'sole-elite:shopping:v1';
const emptyState = (): SavedState => ({ cartItems: [], wishlist: [], newsletterEmail: '', orders: [] });
const emailValid = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const findProduct = (id: string) => products?.find(product => product?.id === id);
const record = (value: unknown): Record<string, unknown> => value !== null && typeof value === 'object' ? value as Record<string, unknown> : {};
const rules = record(shippingRules);
const positiveNumber = (value: unknown, fallback: number) => typeof value === 'number' && Number.isFinite(value) && value >= 0 ? value : fallback;
const freeShippingThreshold = positiveNumber(rules?.freeShippingThreshold, 10000);
const shippingFee = positiveNumber(rules?.flatRate ?? rules?.shippingFee ?? rules?.standardFee, 499);
const shippingFor = (subtotal: number) => subtotal > 0 && subtotal < freeShippingThreshold ? shippingFee : 0;
function validateLines(value: unknown): CartItem[] {
  if (!Array.isArray(value)) return [];
  const lines = new Map<string, CartItem>();
  value.slice(0, 500).forEach(entry => {
    const raw = record(entry), product = findProduct(String(record(raw?.product)?.id ?? raw?.productId ?? ''));
    const size = Number(raw?.size) as Size, quantity = Number(raw?.quantity);
    const stock = Math.floor(product?.stock?.[size] ?? 0);
    if (!product || !product?.sizes?.includes(size) || !Number.isSafeInteger(quantity) || quantity < 1 || stock < 1) return;
    const id = `${product?.id ?? ''}:${size}`, previous = lines.get(id)?.quantity ?? 0;
    lines.set(id, { id, product, size, quantity: Math.min(previous + quantity, stock) });
  });
  return [...lines.values()];
}
function validateCustomer(value: unknown): CheckoutValues | null {
  const raw = record(value), fields = ['fullName', 'email', 'address', 'city', 'postalCode', 'country'] as const;
  if (!fields.every(key => typeof raw?.[key] === 'string' && String(raw?.[key] ?? '').trim().length > 0)) return null;
  const customer = Object.fromEntries(fields.map(key => [key, String(raw?.[key] ?? '').trim()])) as unknown as CheckoutValues;
  if (!emailValid(customer?.email ?? '')) return null;
  if (typeof raw?.phone === 'string') customer.phone = raw?.phone.trim();
  return customer;
}
function hydrate(): SavedState {
  try {
    if (typeof window === 'undefined') return emptyState();
    const raw = record(JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? '{}'));
    const wishlist = Array.isArray(raw?.wishlist) ? [...new Set(raw?.wishlist.filter((id): id is string => typeof id === 'string' && !!findProduct(id)))] : [];
    const orders: Order[] = [];
    if (Array.isArray(raw?.orders)) raw?.orders.slice(-50).forEach(entry => {
      const order = record(entry), customer = validateCustomer(order?.customer), items = validateLines(order?.items);
      const subtotal = positiveNumber(order?.subtotal, -1), shipping = positiveNumber(order?.shipping, -1), total = positiveNumber(order?.total, -1);
      if (!customer || !items.length || typeof order?.id !== 'string' || typeof order?.createdAt !== 'string' || !Number.isFinite(Date.parse(order?.createdAt)) || subtotal < 0 || shipping < 0 || Math.abs(total - subtotal - shipping) > 0.01 || order?.isMock !== true || order?.currency !== 'INR') return;
      orders.push({ id: order?.id, customer, items, subtotal, shipping, total, currency: 'INR', createdAt: order?.createdAt, status: order?.status === 'cancelled' ? 'cancelled' : 'confirmed', isMock: true });
    });
    const email = typeof raw?.newsletterEmail === 'string' ? raw?.newsletterEmail.trim() : '';
    return { cartItems: validateLines(raw?.cartItems), wishlist, newsletterEmail: emailValid(email) ? email : '', orders };
  } catch { return emptyState(); }
}
export const CartContext = createContext<CartContextValue | undefined>(undefined);
export function CartProvider({ children = null }: { children?: ReactNode } = {}) {
  const [state, setState] = useState<SavedState>(hydrate);
  const current = useRef(state);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [previewProduct, setPreviewProduct] = useState<Product | null>(null);
  const commit = (next: SavedState) => { current.current = next; setState(next); };
  useEffect(() => {
    try { window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch { /* Storage may be unavailable or full. */ }
  }, [state]);
  const addToCart = (input: Product | string, size: Size, quantity = 1) => {
    const product = findProduct(typeof input === 'string' ? input : input?.id ?? '');
    const id = `${product?.id ?? ''}:${size}`, existing = current.current?.cartItems?.find(line => line?.id === id);
    if (!product?.sizes?.includes(size) || !Number.isSafeInteger(quantity) || quantity < 1 || (existing?.quantity ?? 0) + quantity > (product?.stock?.[size] ?? 0)) {
      toast.error('Please select an available size and quantity.'); return false;
    }
    const items = existing ? current.current.cartItems.map(line => line?.id === id ? { ...line, quantity: (line?.quantity ?? 0) + quantity } : line) : [...current.current.cartItems, { id, product, size, quantity }];
    commit({ ...current.current, cartItems: items }); toast.success('Added to your bag.'); return true;
  };
  const removeFromCart = (id: string) => commit({ ...current.current, cartItems: current.current.cartItems.filter(line => line?.id !== id) });
  const updateQuantity = (id: string, quantity: number) => {
    const line = current.current.cartItems.find(item => item?.id === id);
    if (!line || !Number.isSafeInteger(quantity) || quantity < 0) return;
    if (quantity === 0) { removeFromCart(id); return; }
    if (quantity > (line?.product?.stock?.[line?.size] ?? 0)) { toast.error('This quantity is not available.'); return; }
    commit({ ...current.current, cartItems: current.current.cartItems.map(item => item?.id === id ? { ...item, quantity } : item) });
  };
  const toggleWishlist = (id: string) => {
    if (!findProduct(id)) return;
    const exists = current.current.wishlist.includes(id);
    commit({ ...current.current, wishlist: exists ? current.current.wishlist.filter(value => value !== id) : [...current.current.wishlist, id] });
    toast.success(exists ? 'Removed from your wishlist.' : 'Saved to your wishlist.');
  };
  const subscribeNewsletter = (input: string) => {
    const email = (input ?? '').trim().toLowerCase();
    if (!emailValid(email)) { toast.error('Please enter a valid email address.'); return false; }
    commit({ ...current.current, newsletterEmail: email }); toast.success('Subscribed for this demo. No email will be sent.'); return true;
  };
  const placeOrder = (input: CheckoutValues): Order | null => {
    const customer = validateCustomer(input), items = validateLines(current.current.cartItems);
    if (!customer || !items.length || JSON.stringify(items) !== JSON.stringify(current.current.cartItems)) { toast.error('Check your delivery details and bag before continuing.'); return null; }
    const subtotal = items.reduce((sum, line) => sum + (line?.product?.price ?? 0) * (line?.quantity ?? 0), 0), shipping = shippingFor(subtotal);
    const order: Order = { id: crypto.randomUUID(), items, customer, subtotal, shipping, total: subtotal + shipping, currency: 'INR', createdAt: new Date().toISOString(), status: 'confirmed', isMock: true };
    commit({ ...current.current, cartItems: [], orders: [...current.current.orders, order].slice(-50) }); setIsCartOpen(false);
    toast.success('Mock order confirmed. No payment was taken.'); return order;
  };
  const subtotal = state.cartItems.reduce((sum, line) => sum + (line?.product?.price ?? 0) * (line?.quantity ?? 0), 0), shipping = shippingFor(subtotal);
  const value: CartContextValue = {
    ...state, cart: state.cartItems, cartCount: state.cartItems.reduce((sum, line) => sum + (line?.quantity ?? 0), 0), wishlistCount: state.wishlist.length,
    subtotal, shipping, total: subtotal + shipping, freeShippingThreshold, shippingProgress: freeShippingThreshold === 0 ? 100 : Math.min(100, subtotal / freeShippingThreshold * 100),
    amountToFreeShipping: Math.max(0, freeShippingThreshold - subtotal), newsletterSubscribed: !!state.newsletterEmail,
    isCartOpen, setIsCartOpen, openCart: () => setIsCartOpen(true), closeCart: () => setIsCartOpen(false), previewProduct, setPreviewProduct,
    openPreview: product => setPreviewProduct(findProduct(product?.id ?? '') ?? null), closePreview: () => setPreviewProduct(null),
    addToCart, updateQuantity, removeFromCart, clearCart: () => commit({ ...current.current, cartItems: [] }), toggleWishlist,
    isWishlisted: id => state.wishlist.includes(id), subscribeNewsletter, placeOrder,
  };
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
export function useCart(): CartContextValue {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider.');
  return context;
}
export default CartProvider;