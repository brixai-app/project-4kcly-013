import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  ReactNode,
} from "react";
import { safeStorage } from "@/lib/utils";

// NOTE: This entire module is FRONTEND-ONLY and FULLY MOCKED.
// All data, cart, profile, and orders are stored in browser localStorage
// via safeStorage. There is NO backend or real payment integration.

// --------------------
// Types & Interfaces
// --------------------

export type ColorOption = "deep-indigo" | "warm-ochre" | "sand-beige" | "marigold";

export interface ProductVariant {
  size: string; // e.g. "UK 7"
  color: ColorOption;
  stock: number;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  artisanId: string;
  description: string;
  storyIntro: string;
  price: number; // in INR
  primaryImage: string;
  galleryImages: string[];
  variants: ProductVariant[];
  tags: string[];
  featured: boolean;
  highlight?: string;
}

export interface Artisan {
  id: string;
  name: string;
  region: string;
  portraitImage: string;
  workshopImage: string;
  bio: string;
  craftNotes: string;
  yearsOfPractice: number;
}

export interface Review {
  id: string;
  productId: string;
  userName: string;
  avatarInitials: string;
  rating: number; // 1-5
  title: string;
  body: string;
  createdAt: string; // ISO
  helpfulVotes: number;
}

export interface CartItemVariant {
  size: string;
  color: ColorOption;
}

export interface CartItem {
  id: string; // cart item id
  productId: string;
  name: string;
  price: number;
  image: string;
  artisanId: string;
  variant: CartItemVariant;
  quantity: number;
  maxQuantity: number; // based on stock
}

export interface ProfileAddress {
  fullName: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  defaultAddress?: ProfileAddress;
}

export type OrderStatus = "confirmed" | "processing" | "shipped" | "delivered";

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  variant: CartItemVariant;
}

export interface Order {
  id: string;
  createdAt: string;
  status: OrderStatus;
  items: OrderItem[];
  subtotal: number;
  shippingFee: number;
  total: number;
  shippingAddress: ProfileAddress;
}

export interface CheckoutPayload {
  shipping: ProfileAddress;
  paymentMethod: "card" | "cod";
  email: string;
}

export interface CatalogFilters {
  size?: string;
  color?: ColorOption;
  artisanId?: string;
}

// --------------------
// Mock Assets (local paths)
// --------------------

// These paths must correspond to actual files in src/assets.
const HERO_IMG = "/src/assets/hero-mojri.jpg";
const GALLERY_1 = "/src/assets/gallery-1.jpg";
const GALLERY_2 = "/src/assets/gallery-2.jpg";
const GALLERY_3 = "/src/assets/gallery-3.jpg";
const ARTISAN_1 = "/src/assets/artisan-1.jpg";
const ARTISAN_2 = "/src/assets/artisan-2.jpg";

// --------------------
// Mock Data (Artisans, Products, Reviews)
// --------------------

export const artisans: Artisan[] = [
  {
    id: "artisan-meera",
    name: "Meera Kumawat",
    region: "Jaipur, Rajasthan",
    portraitImage: ARTISAN_1,
    workshopImage: ARTISAN_2,
    bio: "Third-generation mojri artisan weaving Mughal silhouettes with contemporary comfort. Meera leads a small women-only atelier in the old city lanes of Jaipur.",
    craftNotes:
      "Hand-embroidered uppers using resham threads, naturally tanned leather linings, and cushioned soles adapted for all-day urban wear.",
    yearsOfPractice: 18,
  },
  {
    id: "artisan-imran",
    name: "Imran Khan",
    region: "Jodhpur, Rajasthan",
    portraitImage: ARTISAN_2,
    workshopImage: ARTISAN_1,
    bio: "Imran restores heirloom juttis for local families and translates archival motifs into minimal silhouettes for modern wardrobes.",
    craftNotes:
      "Vegetable-dyed leathers, hand-burnished edges, and archival jaali patterns interpreted through subtle top-stitching.",
    yearsOfPractice: 22,
  },
];

export const products: Product[] = [
  {
    id: "royal-indigo-meera",
    slug: "royal-indigo-meera-mojri",
    name: "Royal Indigo Meera Mojri",
    artisanId: "artisan-meera",
    description:
      "An ode to twilight over Jaipur's Hawa Mahal, this mojri pairs deep indigo leather with fine resham embroidery. Cushioned insole and soft lining ensure comfort from mehfil to midnight walks.",
    storyIntro:
      "Meera cuts each upper by hand, tracing over a decades-old brass stencil passed down from her grandmother.",
    price: 5200,
    primaryImage: HERO_IMG,
    galleryImages: [HERO_IMG, GALLERY_1, GALLERY_2],
    variants: [
      {
        size: "UK 5",
        color: "deep-indigo",
        stock: 6,
      },
      {
        size: "UK 6",
        color: "deep-indigo",
        stock: 4,
      },
      {
        size: "UK 7",
        color: "deep-indigo",
        stock: 5,
      },
      {
        size: "UK 7",
        color: "warm-ochre",
        stock: 3,
      },
    ],
    tags: ["Evening", "Wedding", "Embroidered", "Indigo"],
    featured: true,
    highlight: "Hand-embroidered twilight florals on deep indigo leather.",
  },
  {
    id: "marigold-bazaar-imran",
    slug: "marigold-bazaar-mojri",
    name: "Marigold Bazaar Mojri",
    artisanId: "artisan-imran",
    description:
      "Inspired by the marigold garlands draped across Jodhpur's Sardar Market, this pair glows in warm ochre with subtle jaali perforations for breathability.",
    storyIntro:
      "Imran sun-dries each marigold-dyed hide on his rooftop before cutting, allowing the leather to develop nuanced tonal shifts.",
    price: 4600,
    primaryImage: GALLERY_1,
    galleryImages: [GALLERY_1, GALLERY_2, GALLERY_3],
    variants: [
      {
        size: "UK 6",
        color: "warm-ochre",
        stock: 5,
      },
      {
        size: "UK 7",
        color: "warm-ochre",
        stock: 5,
      },
      {
        size: "UK 8",
        color: "marigold",
        stock: 2,
      },
    ],
    tags: ["Daywear", "Breathable", "Ochre"],
    featured: true,
    highlight: "Perforated jaali pattern for all-day comfort in warm climates.",
  },
  {
    id: "thar-sand-classic",
    slug: "thar-sand-classic-mojri",
    name: "Thar Sand Classic Mojri",
    artisanId: "artisan-imran",
    description:
      "Minimalist slip-on mojri in a sand-beige palette, echoing the dunes of the Thar desert. Understated enough for everyday wear, refined enough for intimate soirees.",
    storyIntro:
      "The sand-beige leather is lightly burnished along the toe, referencing the gradient of sunlit dunes.",
    price: 3800,
    primaryImage: GALLERY_2,
    galleryImages: [GALLERY_2, HERO_IMG, GALLERY_3],
    variants: [
      {
        size: "UK 7",
        color: "sand-beige",
        stock: 8,
      },
      {
        size: "UK 8",
        color: "sand-beige",
        stock: 10,
      },
      {
        size: "UK 9",
        color: "sand-beige",
        stock: 4,
      },
    ],
    tags: ["Minimal", "Everyday", "Neutral"],
    featured: false,
    highlight: "Versatile neutral tone with gentle burnished toe detail.",
  },
  {
    id: "midnight-mehfil-meera",
    slug: "midnight-mehfil-mojri",
    name: "Midnight Mehfil Mojri",
    artisanId: "artisan-meera",
    description:
      "A sculpted midnight pair tracing classical court footwear, finished with fine tonal stitch-work and a softly squared toe.",
    storyIntro:
      "Meera studied old court portraits to perfect this gently elongated silhouette.",
    price: 5400,
    primaryImage: GALLERY_3,
    galleryImages: [GALLERY_3, HERO_IMG, GALLERY_1],
    variants: [
      {
        size: "UK 5",
        color: "deep-indigo",
        stock: 3,
      },
      {
        size: "UK 6",
        color: "deep-indigo",
        stock: 2,
      },
      {
        size: "UK 6",
        color: "marigold",
        stock: 2,
      },
    ],
    tags: ["Evening", "Court", "Indigo"],
    featured: true,
    highlight: "Elongated court-inspired silhouette with tonal stitch-work.",
  },
];

export const reviews: Review[] = [
  {
    id: "rev-1",
    productId: "royal-indigo-meera",
    userName: "Ananya",
    avatarInitials: "AN",
    rating: 5,
    title: "The only pair I packed for Udaipur",
    body: "Walked cobbled streets, attended a sangeet, and still slipped into a late dinner without changing. Zero bites, endless compliments.",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString(),
    helpfulVotes: 24,
  },
  {
    id: "rev-2",
    productId: "marigold-bazaar-imran",
    userName: "Rahul",
    avatarInitials: "RA",
    rating: 4,
    title: "Color is richer in person",
    body: "The ochre has a beautiful depth that doesn't quite show on screen. Break-in took a day, after that they mold perfectly.",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
    helpfulVotes: 12,
  },
  {
    id: "rev-3",
    productId: "thar-sand-classic",
    userName: "Leena",
    avatarInitials: "LE",
    rating: 5,
    title: "Office to cocktails staple",
    body: "Subtle yet special. I wear these to work with wide-leg trousers and to dinners with saris. Extremely versatile.",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
    helpfulVotes: 7,
  },
  {
    id: "rev-4",
    productId: "royal-indigo-meera",
    userName: "Ishaan",
    avatarInitials: "IS",
    rating: 4,
    title: "Gift that actually felt thoughtful",
    body: "Bought these for my partner who loves textiles. The artisan story card and packaging made it feel truly special.",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1).toISOString(),
    helpfulVotes: 3,
  },
];

// --------------------
// LocalStorage Keys & Helpers
// --------------------

const STORAGE_KEYS = {
  CART: "jootiya_cart_v1",
  PROFILE: "jootiya_profile_v1",
  ORDERS: "jootiya_orders_v1",
} as const;

function loadCart(): CartItem[] {
  const raw = safeStorage.getItem(STORAGE_KEYS.CART);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as CartItem[];
    if (!Array.isArray(parsed)) return [];
    return parsed.map((item) => ({
      ...item,
      quantity: Math.max(1, item.quantity || 1),
    }));
  } catch {
    return [];
  }
}

function saveCart(cart: CartItem[]): void {
  safeStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
}

function loadProfile(): UserProfile | undefined {
  const raw = safeStorage.getItem(STORAGE_KEYS.PROFILE);
  if (!raw) return undefined;
  try {
    return JSON.parse(raw) as UserProfile;
  } catch {
    return undefined;
  }
}

function saveProfile(profile: UserProfile | undefined): void {
  if (!profile) {
    safeStorage.removeItem(STORAGE_KEYS.PROFILE);
  } else {
    safeStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
  }
}

function loadOrders(): Order[] {
  const raw = safeStorage.getItem(STORAGE_KEYS.ORDERS);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as Order[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveOrders(orders: Order[]): void {
  safeStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
}

// --------------------
// Store Shape
// --------------------

export interface JootiyaState {
  cart: CartItem[];
  profile?: UserProfile;
  orders: Order[];
}

export interface JootiyaStore extends JootiyaState {
  // cart actions
  addToCart: (productId: string, variant: CartItemVariant, quantity?: number) => void;
  removeFromCart: (cartItemId: string) => void;
  updateCartQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;

  // profile
  setProfile: (profile: UserProfile) => void;

  // orders
  createOrderFromCart: (payload: CheckoutPayload) => Order | null;

  // selectors / computed
  cartCount: () => number;
  cartSubtotal: () => number;

  // helpers
  findProductById: (id: string) => Product | undefined;
  getArtisanById: (id: string) => Artisan | undefined;
  getReviewsForProduct: (productId: string) => Review[];
  getFeaturedProducts: () => Product[];
  filterProducts: (filters: CatalogFilters) => Product[];
}

// --------------------
// React Context Store Implementation (no useSyncExternalStore)
// --------------------

const JootiyaContext = createContext<JootiyaStore | undefined>(undefined);

function computeCartCount(cart: CartItem[]): number {
  return cart.reduce((sum, item) => sum + item.quantity, 0);
}

function computeCartSubtotal(cart: CartItem[]): number {
  return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

function ensureMaxQuantity(
  productId: string,
  variant: CartItemVariant,
  requested: number,
): number {
  const product = products.find((p) => p.id === productId);
  if (!product) return Math.max(1, requested);
  const variantStock = product.variants.find(
    (v) => v.size === variant.size && v.color === variant.color,
  );
  if (!variantStock) return Math.max(1, requested);
  return Math.min(Math.max(1, requested), variantStock.stock);
}

export const JootiyaProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>(() => loadCart());
  const [profile, setProfileState] = useState<UserProfile | undefined>(() => loadProfile());
  const [orders, setOrders] = useState<Order[]>(() => loadOrders());

  // persist side effects
  useEffect(() => {
    saveCart(cart);
  }, [cart]);

  useEffect(() => {
    saveProfile(profile);
  }, [profile]);

  useEffect(() => {
    saveOrders(orders);
  }, [orders]);

  const addToCart = useCallback(
    (productId: string, variant: CartItemVariant, quantity: number = 1) => {
      const product = products.find((p) => p.id === productId);
      if (!product) return;

      const clampedQty = ensureMaxQuantity(productId, variant, quantity);

      setCart((prev) => {
        const existingIndex = prev.findIndex(
          (item) =>
            item.productId === productId &&
            item.variant.size === variant.size &&
            item.variant.color === variant.color,
        );

        if (existingIndex !== -1) {
          const next = [...prev];
          const existing = next[existingIndex];
          const newQty = ensureMaxQuantity(
            productId,
            variant,
            existing.quantity + clampedQty,
          );
          next[existingIndex] = { ...existing, quantity: newQty };
          return next;
        }

        const maxQuantity = ensureMaxQuantity(productId, variant, clampedQty);

        const newItem: CartItem = {
          id: `cart_${Math.random().toString(36).slice(2, 9)}`,
          productId,
          name: product.name,
          price: product.price,
          image: product.primaryImage,
          artisanId: product.artisanId,
          variant,
          quantity: maxQuantity,
          maxQuantity,
        };

        return [...prev, newItem];
      });
    },
    [],
  );

  const removeFromCart = useCallback((cartItemId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== cartItemId));
  }, []);

  const updateCartQuantity = useCallback((cartItemId: string, quantity: number) => {
    setCart((prev) => {
      return prev.map((item) => {
        if (item.id !== cartItemId) return item;
        const clamped = ensureMaxQuantity(item.productId, item.variant, quantity);
        return { ...item, quantity: clamped };
      });
    });
  }, []);

  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  const setProfile = useCallback((nextProfile: UserProfile) => {
    setProfileState(nextProfile);
  }, []);

  const createOrderFromCart = useCallback(
    (payload: CheckoutPayload): Order | null => {
      if (cart.length === 0) return null;

      const subtotal = computeCartSubtotal(cart);
      const shippingFee = subtotal >= 6000 ? 0 : 250;
      const total = subtotal + shippingFee;

      const order: Order = {
        id: `ord_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
        createdAt: new Date().toISOString(),
        status: "confirmed",
        items: cart.map((item) => ({
          productId: item.productId,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          variant: item.variant,
        })),
        subtotal,
        shippingFee,
        total,
        shippingAddress: payload.shipping,
      };

      setOrders((prev) => [order, ...prev]);

      // also update profile with latest details for convenience
      setProfileState((prevProfile) => {
        const base: UserProfile =
          prevProfile ?? {
            id: "mock-user",
            name: payload.shipping.fullName || "Jootiya Patron",
            email: payload.email,
          };
        return {
          ...base,
          name: payload.shipping.fullName || base.name,
          email: payload.email || base.email,
          defaultAddress: payload.shipping,
        };
      });

      // clear cart after creating order
      setCart([]);

      return order;
    },
    [cart],
  );

  const findProductById = useCallback((id: string) => {
    return products.find((p) => p.id === id);
  }, []);

  const getArtisanById = useCallback((id: string) => {
    return artisans.find((a) => a.id === id);
  }, []);

  const getReviewsForProduct = useCallback((productId: string) => {
    return reviews
      .filter((r) => r.productId === productId)
      .slice()
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, []);

  const getFeaturedProducts = useCallback(() => {
    return products.filter((p) => p.featured);
  }, []);

  const filterProducts = useCallback((filters: CatalogFilters) => {
    const { size, color, artisanId } = filters;
    return products.filter((product) => {
      const sizeMatch = size
        ? product.variants.some((v) => v.size === size && v.stock > 0)
        : true;
      const colorMatch = color
        ? product.variants.some((v) => v.color === color && v.stock > 0)
        : true;
      const artisanMatch = artisanId ? product.artisanId === artisanId : true;
      return sizeMatch && colorMatch && artisanMatch;
    });
  }, []);

  const store: JootiyaStore = useMemo(
    () => ({
      cart,
      profile,
      orders,
      addToCart,
      removeFromCart,
      updateCartQuantity,
      clearCart,
      setProfile,
      createOrderFromCart,
      cartCount: () => computeCartCount(cart),
      cartSubtotal: () => computeCartSubtotal(cart),
      findProductById,
      getArtisanById,
      getReviewsForProduct,
      getFeaturedProducts,
      filterProducts,
    }),
    [
      cart,
      profile,
      orders,
      addToCart,
      removeFromCart,
      updateCartQuantity,
      clearCart,
      setProfile,
      createOrderFromCart,
      findProductById,
      getArtisanById,
      getReviewsForProduct,
      getFeaturedProducts,
      filterProducts,
    ],
  );

  return <JootiyaContext.Provider value={store}>{children}</JootiyaContext.Provider>;
};

// --------------------
// Public Hooks / Selectors
// --------------------

function useJootiyaStoreInternal(): JootiyaStore {
  const ctx = useContext(JootiyaContext);
  if (!ctx) {
    throw new Error("useJootiyaStore must be used within JootiyaProvider");
  }
  return ctx;
}

export function useJootiyaStore(): JootiyaStore {
  return useJootiyaStoreInternal();
}

export function useCart() {
  const {
    cart,
    cartCount,
    cartSubtotal,
    addToCart,
    removeFromCart,
    updateCartQuantity,
    clearCart,
  } = useJootiyaStoreInternal();
  return {
    cart,
    cartCount: cartCount(),
    cartSubtotal: cartSubtotal(),
    addToCart,
    removeFromCart,
    updateCartQuantity,
    clearCart,
  };
}

export function useProfile() {
  const { profile, setProfile, orders } = useJootiyaStoreInternal();
  return { profile, setProfile, orders };
}

export function useCatalog(filters?: CatalogFilters) {
  const store = useJootiyaStoreInternal();
  const list = filters ? store.filterProducts(filters) : products;

  const allSizes = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => p.variants.forEach((v) => set.add(v.size)));
    return Array.from(set).sort();
  }, []);

  const allColors = useMemo(() => {
    const set = new Set<ColorOption>();
    products.forEach((p) => p.variants.forEach((v) => set.add(v.color)));
    return Array.from(set);
  }, []);

  return {
    products: list,
    artisans,
    allSizes,
    allColors,
  };
}

export function useProductDetail(productId: string | undefined) {
  const store = useJootiyaStoreInternal();
  const product = productId ? store.findProductById(productId) : undefined;
  const artisan = product ? store.getArtisanById(product.artisanId) : undefined;
  const productReviews = product ? store.getReviewsForProduct(product.id) : [];

  return {
    product,
    artisan,
    reviews: productReviews,
  };
}

// Convenience selector for home page featured content
export function useHomeFeatured() {
  const store = useJootiyaStoreInternal();
  return {
    featuredProducts: store.getFeaturedProducts(),
    artisans,
  };
}

// Utility to format INR pricing (simple client-side helper)
export function formatPriceINR(value: number): string {
  try {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(value);
  } catch {
    return `₹${value.toLocaleString("en-IN")}`;
  }
}

// Export raw data as well for static uses in some components
export const MOCK_PRODUCTS = products;
export const MOCK_ARTISANS = artisans;
export const MOCK_REVIEWS = reviews;