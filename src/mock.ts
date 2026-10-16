// src/mock.ts
// Single source of truth for all client-side mock data, types, and state helpers.
// NOTE: This is a fully client-side mock implementation – there is NO backend.
// Cart and orders are persisted in localStorage via the safeStorage helper below.

// No React imports here: this module is framework-agnostic and purely data/logic.

// -----------------------------
// Types & Enums
// -----------------------------

export type Category = "Sneakers" | "Boots" | "Loafers" | "Sandals";

export interface Review {
  id: string;
  author: string;
  rating: number; // 1-5
  comment: string;
  date: string; // ISO string
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  description: string;
  price: number; // USD
  images: string[];
  sizes: string[]; // e.g. "7", "8.5"
  category: Category;
  rating: number; // 0-5 float
  reviews: Review[];
  isFeatured?: boolean;
  tags?: string[];
}

export interface CartItem {
  productId: string;
  size: string;
  quantity: number; // int
}

export interface ShippingInfo {
  name: string;
  address: string;
  email: string;
  phone: string;
}

export interface PaymentInfo {
  cardNumber: string;
  expiry: string; // MM/YY
  cvv: string;
}

export interface Order {
  id: string;
  items: CartItem[];
  shippingInfo: ShippingInfo;
  paymentInfo: PaymentInfo;
  totalPrice: number;
  orderDate: string; // ISO
  estimatedDelivery: string; // ISO
}

// For hydrated cart display
export interface HydratedCartItem extends CartItem {
  product: Product | undefined;
}

// Filter & sort helpers
export type CatalogSortOption =
  | "featured"
  | "price-asc"
  | "price-desc"
  | "rating-desc";

export interface CatalogFilters {
  category?: Category | "All";
  brand?: string | "All";
  size?: string | "All";
  minPrice?: number;
  maxPrice?: number;
}

// -----------------------------
// Safe Storage Helper (localStorage wrapper)
// -----------------------------

const isBrowser = typeof window !== "undefined";

const safeStorage = {
  getItem(key: string): string | null {
    if (!isBrowser) return null;
    try {
      return window.localStorage.getItem(key);
    } catch {
      return null;
    }
  },
  setItem(key: string, value: string): void {
    if (!isBrowser) return;
    try {
      window.localStorage.setItem(key, value);
    } catch {
      // ignore quota/access errors
    }
  },
  removeItem(key: string): void {
    if (!isBrowser) return;
    try {
      window.localStorage.removeItem(key);
    } catch {
      // ignore
    }
  },
};

// -----------------------------
// Mock Data (Luxury Footwear Catalog)
// -----------------------------
// This is entirely mocked client-side data; images use curated Unsplash-style URLs.

const loremLuxury =
  "Hand-finished in limited batches, each pair is crafted to move seamlessly from gallery openings to midnight rooftops. Premium leathers, sculpted profiles, and obsessively tuned comfort deliver a quiet yet undeniable statement.";

const now = new Date();

const makeReview = (
  author: string,
  rating: number,
  comment: string,
  daysAgo: number
): Review => ({
  id: crypto.randomUUID(),
  author,
  rating,
  comment,
  date: new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000).toISOString(),
});

const products: Product[] = [
  {
    id: crypto.randomUUID(),
    name: "Noir Atelier High-Top",
    brand: "Maison Varenne",
    description:
      "A sculptural high-top in brushed Italian calfskin with a tapering silhouette and waxed cotton laces. Designed for the city at twilight.",
    price: 820,
    images: [
      "https://images.unsplash.com/photo-1514986888952-8cd320577b68?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1600&q=80",
    ],
    sizes: ["7", "8", "8.5", "9", "9.5", "10", "11"],
    category: "Sneakers",
    rating: 4.8,
    reviews: [
      makeReview(
        "Amelia R.",
        5,
        "The leather feels impossibly soft yet structured. Subtle gold eyelets catch the light beautifully.",
        6
      ),
      makeReview(
        "Jonas K.",
        4,
        "Understated but unmistakably premium. Runs half a size large for narrow feet.",
        18
      ),
    ],
    isFeatured: true,
    tags: ["Monochrome", "City", "Evening"],
  },
  {
    id: crypto.randomUUID(),
    name: "Aurora Glide Runner",
    brand: "Studio Aurelius",
    description:
      "Featherlight knit sneaker with sculpted sole and brushed gold heel clip. Built for airport concourses and late checkouts.",
    price: 590,
    images: [
      "https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=1600&q=80",
    ],
    sizes: ["6", "7", "8", "9", "10", "11", "12"],
    category: "Sneakers",
    rating: 4.6,
    reviews: [
      makeReview(
        "Dylan C.",
        5,
        "Feels like walking on memory foam cloud, yet the profile is razor sharp.",
        3
      ),
      makeReview(
        "Priya M.",
        4,
        "Perfect airport shoe – slips on and off effortlessly while still feeling polished.",
        27
      ),
    ],
    isFeatured: true,
    tags: ["Travel", "Lightweight"],
  },
  {
    id: crypto.randomUUID(),
    name: "Cortado Penny Loafer",
    brand: "Linea Castell",
    description:
      "An ultra-soft penny loafer in hand-burnished espresso leather with an articulated sole. Designed for quiet confidence.",
    price: 740,
    images: [
      "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1514311548101-ff09bff63c02?auto=format&fit=crop&w=1600&q=80",
    ],
    sizes: ["7", "7.5", "8", "8.5", "9", "10"],
    category: "Loafers",
    rating: 4.9,
    reviews: [
      makeReview(
        "Marco D.",
        5,
        "The leather patina is already rich out of the box and only gets better.",
        11
      ),
      makeReview(
        "Isabelle T.",
        5,
        "Wore them straight to a gallery opening – zero break-in, endless compliments.",
        19
      ),
    ],
    isFeatured: true,
    tags: ["Office", "Evening"],
  },
  {
    id: crypto.randomUUID(),
    name: "Sable Desert Boot",
    brand: "Atelier Nord",
    description:
      "Minimal desert boot in matte sable suede, set on a tonal crepe sole. Effortlessly bridges denim and tailoring.",
    price: 660,
    images: [
      "https://images.unsplash.com/photo-1533867617858-e7b97e060509?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1525078429-2083899b4c18?auto=format&fit=crop&w=1600&q=80",
    ],
    sizes: ["7", "8", "9", "10", "11"],
    category: "Boots",
    rating: 4.4,
    reviews: [
      makeReview(
        "Khalid S.",
        4,
        "Perfect height on the ankle. Suede has a lovely dry, powdery texture.",
        35
      ),
    ],
    tags: ["Weekend", "Casual"],
  },
  {
    id: crypto.randomUUID(),
    name: "Marais Strapped Sandal",
    brand: "Rue & Rive",
    description:
      "Low-profile leather sandal with slim asymmetric straps and a softly cushioned footbed. Made for summer rooftops and cobblestone alleys.",
    price: 430,
    images: [
      "https://images.unsplash.com/photo-1514315384763-ba401779410f?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1475180098004-ca77a66827be?auto=format&fit=crop&w=1600&q=80",
    ],
    sizes: ["5.5", "6", "7", "8", "9"],
    category: "Sandals",
    rating: 4.5,
    reviews: [
      makeReview(
        "Sara L.",
        5,
        "Straps are delicate but secure. The insole feels like a discreet cushion.",
        8
      ),
    ],
    tags: ["Summer", "Resort"],
  },
  {
    id: crypto.randomUUID(),
    name: "Obsidian City Runner",
    brand: "Maison Varenne",
    description:
      "A monochrome runner with layered nubuck and mesh, anchored by a sculpted outsole and subtle reflective flourishes.",
    price: 710,
    images: [
      "https://images.unsplash.com/photo-1597045566677-8cf032ed6634?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1543508282-6319a3e2621f?auto=format&fit=crop&w=1600&q=80",
    ],
    sizes: ["7", "8", "8.5", "9", "10", "11", "12"],
    category: "Sneakers",
    rating: 4.7,
    reviews: [
      makeReview(
        "Thabo N.",
        5,
        "The kind of sneaker that dresses up and down without ever trying too hard.",
        4
      ),
      makeReview(
        "Emily P.",
        4,
        "Slightly heavier than expected, but the presence is worth it.",
        44
      ),
    ],
    tags: ["Monochrome", "Night"],
  },
  {
    id: crypto.randomUUID(),
    name: "Celestial Slip-On Mule",
    brand: "Studio Aurelius",
    description:
      "Backless mule in pearlescent leather with a micro heel and suede-lined interior. Effortless, sculpted, and quietly radiant.",
    price: 520,
    images: [
      "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1535043934128-cf0b28d52f95?auto=format&fit=crop&w=1600&q=80",
    ],
    sizes: ["5", "6", "7", "8", "9"],
    category: "Loafers",
    rating: 4.3,
    reviews: [
      makeReview(
        "Harper G.",
        4,
        "Slides on like silk and somehow stays put even on marble floors.",
        15
      ),
    ],
    tags: ["Evening", "Minimal"],
  },
  {
    id: crypto.randomUUID(),
    name: "Ridgeway Alpine Boot",
    brand: "Atelier Nord",
    description:
      "Performance-inspired alpine boot wrapped in city-ready leather with tonal hardware and a contoured lug sole.",
    price: 980,
    images: [
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1520256862855-398228c41684?auto=format&fit=crop&w=1600&q=80",
    ],
    sizes: ["8", "9", "9.5", "10", "11", "12"],
    category: "Boots",
    rating: 4.9,
    reviews: [
      makeReview(
        "Noah V.",
        5,
        "Handles mountain paths and marble hotel lobbies with the same composure.",
        21
      ),
      makeReview(
        "Ana S.",
        5,
        "The lining is unexpectedly plush – like a cashmere sweater for your feet.",
        39
      ),
    ],
    isFeatured: true,
    tags: ["Winter", "Performance"],
  },
  {
    id: crypto.randomUUID(),
    name: "Linea Gallery Low",
    brand: "Linea Castell",
    description:
      "Low-profile gallery sneaker in brushed taupe leather with a razor-thin sole and stitched rand.",
    price: 640,
    images: [
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=1600&q=80",
    ],
    sizes: ["6", "7", "8", "9", "10"],
    category: "Sneakers",
    rating: 4.2,
    reviews: [
      makeReview(
        "Victor L.",
        4,
        "Pairs with tailoring better than most dress shoes I own.",
        29
      ),
    ],
    tags: ["Gallery", "Minimal"],
  },
  {
    id: crypto.randomUUID(),
    name: "Evenfall Strappy Heel Sandal",
    brand: "Rue & Rive",
    description:
      "Slender-heeled sandal with finely set straps and a soft square toe, finished in smoked bronze leather.",
    price: 760,
    images: [
      "https://images.unsplash.com/photo-1543168256-418811576931?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1537289150563-b7f10f3d91d3?auto=format&fit=crop&w=1600&q=80",
    ],
    sizes: ["5", "6", "7", "8", "9", "10"],
    category: "Sandals",
    rating: 4.7,
    reviews: [
      makeReview(
        "Lucia F.",
        5,
        "The bronze sheen reads as jewelry for the feet – incredibly flattering.",
        13
      ),
    ],
    tags: ["Evening", "Event"],
  },
].map((p) => ({
  ...p,
  description: `${p.description} ${loremLuxury}`,
}));

// -----------------------------
// Public Accessors for Products
// -----------------------------

export function getProducts(): Product[] {
  return products;
}

export function getProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}

// Derived catalogs

export function getAllBrands(): string[] {
  const set = new Set<string>();
  products.forEach((p) => set.add(p.brand));
  return Array.from(set).sort();
}

export function getAllCategories(): Category[] {
  const set = new Set<Category>();
  products.forEach((p) => set.add(p.category));
  return Array.from(set).sort();
}

export function getAllSizes(): string[] {
  const set = new Set<string>();
  products.forEach((p) => p.sizes.forEach((s) => set.add(s)));
  return Array.from(set).sort((a, b) => parseFloat(a) - parseFloat(b));
}

// -----------------------------
// Catalog Filter & Sort Utilities
// -----------------------------

export function applyCatalogFilters(
  items: Product[],
  filters: CatalogFilters
): Product[] {
  const { category, brand, size, minPrice, maxPrice } = filters;

  return items.filter((p) => {
    if (category && category !== "All" && p.category !== category) return false;
    if (brand && brand !== "All" && p.brand !== brand) return false;
    if (size && size !== "All" && !p.sizes.includes(size)) return false;
    if (typeof minPrice === "number" && p.price < minPrice) return false;
    if (typeof maxPrice === "number" && p.price > maxPrice) return false;
    return true;
  });
}

export function sortCatalog(
  items: Product[],
  sort: CatalogSortOption
): Product[] {
  const cloned = [...items];
  switch (sort) {
    case "price-asc":
      return cloned.sort((a, b) => a.price - b.price);
    case "price-desc":
      return cloned.sort((a, b) => b.price - a.price);
    case "rating-desc":
      return cloned.sort((a, b) => b.rating - a.rating);
    case "featured":
    default:
      return cloned.sort((a, b) => {
        const aScore = (a.isFeatured ? 1 : 0) + a.rating / 10;
        const bScore = (b.isFeatured ? 1 : 0) + b.rating / 10;
        return bScore - aScore;
      });
  }
}

// For infinite scroll / pagination
export function paginateProducts(
  items: Product[],
  page: number,
  pageSize: number
): Product[] {
  const start = (page - 1) * pageSize;
  return items.slice(start, start + pageSize);
}

// -----------------------------
// Cart Persistence & Helpers
// -----------------------------

const CART_KEY = "jootiya_cart_v1";
const ORDERS_KEY = "jootiya_orders_v1";

function readCartFromStorage(): CartItem[] {
  const raw = safeStorage.getItem(CART_KEY);
  if (!raw) return [];
  try {
    const data = JSON.parse(raw) as CartItem[];
    if (!Array.isArray(data)) return [];
    return data
      .map((item) => ({
        productId: String(item.productId),
        size: String(item.size),
        quantity: Math.min(5, Math.max(1, Number(item.quantity) || 1)),
      }))
      .filter((item) => !!item.productId && !!item.size);
  } catch {
    return [];
  }
}

function writeCartToStorage(cart: CartItem[]): void {
  safeStorage.setItem(CART_KEY, JSON.stringify(cart));
}

export function getCart(): CartItem[] {
  return readCartFromStorage();
}

export function setCart(cart: CartItem[]): void {
  writeCartToStorage(cart);
}

export function clearCart(): void {
  writeCartToStorage([]);
}

export function addToCart(
  productId: string,
  size: string | undefined,
  quantity: number = 1
): { success: boolean; error?: string; cart: CartItem[] } {
  if (!size) {
    return { success: false, error: "Please select a size before adding to cart.", cart: getCart() };
  }

  const product = getProductById(productId);
  if (!product) {
    return { success: false, error: "Product not found.", cart: getCart() };
  }

  if (!product.sizes.includes(size)) {
    return { success: false, error: "Selected size is unavailable for this product.", cart: getCart() };
  }

  const safeQty = Math.min(5, Math.max(1, Math.round(quantity) || 1));

  const cart = getCart();
  const existingIndex = cart.findIndex(
    (item) => item.productId === productId && item.size === size
  );

  if (existingIndex >= 0) {
    const existing = cart[existingIndex];
    const newQty = Math.min(5, existing.quantity + safeQty);
    cart[existingIndex] = { ...existing, quantity: newQty };
  } else {
    cart.push({ productId, size, quantity: safeQty });
  }

  writeCartToStorage(cart);
  return { success: true, cart };
}

export function updateCartItemQty(
  productId: string,
  size: string,
  quantity: number
): CartItem[] {
  const safeQty = Math.min(5, Math.max(1, Math.round(quantity) || 1));
  const cart = getCart();
  const idx = cart.findIndex((item) => item.productId === productId && item.size === size);
  if (idx === -1) return cart;
  cart[idx] = { ...cart[idx], quantity: safeQty };
  writeCartToStorage(cart);
  return cart;
}

export function removeCartItem(productId: string, size: string): CartItem[] {
  const cart = getCart().filter(
    (item) => !(item.productId === productId && item.size === size)
  );
  writeCartToStorage(cart);
  return cart;
}

export function getCartCount(): number {
  return getCart().reduce((sum, item) => sum + item.quantity, 0);
}

export function getCartSubtotal(): number {
  const cart = getCart();
  return cart.reduce((sum, item) => {
    const product = getProductById(item.productId);
    if (!product) return sum;
    return sum + product.price * item.quantity;
  }, 0);
}

export function hydrateCartWithProducts(cart: CartItem[]): HydratedCartItem[] {
  return cart.map((item) => ({
    ...item,
    product: getProductById(item.productId),
  }));
}

// -----------------------------
// Validation Helpers (Checkout)
// -----------------------------

export interface ValidationResult {
  valid: boolean;
  error?: string;
}

export function validateEmail(email: string): ValidationResult {
  const value = email.trim();
  if (!value) return { valid: false, error: "Email is required." };
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!re.test(value)) return { valid: false, error: "Enter a valid email address." };
  return { valid: true };
}

export function validatePhone(phone: string): ValidationResult {
  const digits = phone.replace(/[^0-9]/g, "");
  if (!digits) return { valid: false, error: "Phone number is required." };
  if (digits.length < 7 || digits.length > 15) {
    return { valid: false, error: "Enter a valid phone number (7-15 digits)." };
  }
  return { valid: true };
}

export function validateCardNumber(cardNumber: string): ValidationResult {
  const digits = cardNumber.replace(/[^0-9]/g, "");
  if (!digits) return { valid: false, error: "Card number is required." };
  if (digits.length !== 16) {
    return { valid: false, error: "Card number must be 16 digits." };
  }
  // Luhn check (basic)
  let sum = 0;
  let shouldDouble = false;
  for (let i = digits.length - 1; i >= 0; i--) {
    let d = parseInt(digits.charAt(i), 10);
    if (shouldDouble) {
      d *= 2;
      if (d > 9) d -= 9;
    }
    sum += d;
    shouldDouble = !shouldDouble;
  }
  if (sum % 10 !== 0) {
    // For mock we can still allow but warn; choose to mark invalid for UX clarity
    return { valid: false, error: "Enter a valid card number." };
  }
  return { valid: true };
}

export function validateExpiry(expiry: string): ValidationResult {
  const value = expiry.trim();
  if (!value) return { valid: false, error: "Expiry date is required." };
  const match = /^(0[1-9]|1[0-2])\/(\d{2})$/.exec(value);
  if (!match) return { valid: false, error: "Use MM/YY format." };
  const month = parseInt(match[1], 10);
  const yearTwo = parseInt(match[2], 10);
  const currentYearFull = new Date().getFullYear();
  const currentYearTwo = currentYearFull % 100;
  const century = Math.floor(currentYearFull / 100) * 100;
  const fullYear = century + yearTwo + (yearTwo < currentYearTwo - 20 ? 100 : 0); // handle century roll

  // Card is valid through the end of the month
  const expiryDate = new Date(fullYear, month, 0, 23, 59, 59, 999);
  const nowDate = new Date();
  if (expiryDate < nowDate) {
    return { valid: false, error: "Card has expired." };
  }
  return { valid: true };
}

export function validateCVV(cvv: string): ValidationResult {
  const digits = cvv.replace(/[^0-9]/g, "");
  if (!digits) return { valid: false, error: "CVV is required." };
  if (digits.length !== 3) {
    return { valid: false, error: "CVV must be 3 digits." };
  }
  return { valid: true };
}

export interface ShippingValidationResult {
  valid: boolean;
  errors: Partial<Record<keyof ShippingInfo, string>>;
}

export function validateShippingInfo(info: ShippingInfo): ShippingValidationResult {
  const errors: Partial<Record<keyof ShippingInfo, string>> = {};

  if (!info.name.trim()) errors.name = "Name is required.";
  if (!info.address.trim()) errors.address = "Address is required.";

  const emailResult = validateEmail(info.email);
  if (!emailResult.valid) errors.email = emailResult.error;

  const phoneResult = validatePhone(info.phone);
  if (!phoneResult.valid) errors.phone = phoneResult.error;

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

export interface PaymentValidationResult {
  valid: boolean;
  errors: Partial<Record<keyof PaymentInfo, string>>;
}

export function validatePaymentInfo(info: PaymentInfo): PaymentValidationResult {
  const errors: Partial<Record<keyof PaymentInfo, string>> = {};

  const cardResult = validateCardNumber(info.cardNumber);
  if (!cardResult.valid) errors.cardNumber = cardResult.error;

  const expiryResult = validateExpiry(info.expiry);
  if (!expiryResult.valid) errors.expiry = expiryResult.error;

  const cvvResult = validateCVV(info.cvv);
  if (!cvvResult.valid) errors.cvv = cvvResult.error;

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

// Convenience checker for checkout button
export function canPlaceOrder(
  cart: CartItem[],
  shipping: ShippingInfo,
  payment: PaymentInfo
): boolean {
  if (!cart.length) return false;
  const ship = validateShippingInfo(shipping);
  const pay = validatePaymentInfo(payment);
  return ship.valid && pay.valid;
}

// -----------------------------
// Orders Persistence & Helpers
// -----------------------------

function readOrdersFromStorage(): Order[] {
  const raw = safeStorage.getItem(ORDERS_KEY);
  if (!raw) return [];
  try {
    const data = JSON.parse(raw) as Order[];
    if (!Array.isArray(data)) return [];
    return data;
  } catch {
    return [];
  }
}

function writeOrdersToStorage(orders: Order[]): void {
  safeStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
}

export function getOrders(): Order[] {
  return readOrdersFromStorage();
}

export function getLastOrder(): Order | undefined {
  const orders = getOrders();
  if (!orders.length) return undefined;
  return orders[orders.length - 1];
}

export function placeOrder(
  cart: CartItem[],
  shippingInfo: ShippingInfo,
  paymentInfo: PaymentInfo
): { success: boolean; error?: string; order?: Order } {
  if (!cart.length) {
    return { success: false, error: "Your cart is empty." };
  }

  const shipValidation = validateShippingInfo(shippingInfo);
  if (!shipValidation.valid) {
    return { success: false, error: "Shipping information is incomplete or invalid." };
  }

  const payValidation = validatePaymentInfo(paymentInfo);
  if (!payValidation.valid) {
    return { success: false, error: "Payment details are incomplete or invalid." };
  }

  const totalPrice = cart.reduce((sum, item) => {
    const product = getProductById(item.productId);
    if (!product) return sum;
    return sum + product.price * item.quantity;
  }, 0);

  if (totalPrice <= 0) {
    return { success: false, error: "Unable to calculate order total." };
  }

  const orderDate = new Date();
  const estimatedDeliveryDate = new Date(
    orderDate.getTime() + 5 * 24 * 60 * 60 * 1000
  );

  const order: Order = {
    id: crypto.randomUUID(),
    items: cart.map((c) => ({ ...c })),
    shippingInfo: { ...shippingInfo },
    paymentInfo: { ...paymentInfo },
    totalPrice,
    orderDate: orderDate.toISOString(),
    estimatedDelivery: estimatedDeliveryDate.toISOString(),
  };

  const orders = getOrders();
  orders.push(order);
  writeOrdersToStorage(orders);
  clearCart();

  return { success: true, order };
}

// -----------------------------
// Utility: Short Product Copy for Editorial Sections
// -----------------------------

export function getFeaturedProducts(limit: number = 6): Product[] {
  const featured = products.filter((p) => p.isFeatured);
  const rest = products.filter((p) => !p.isFeatured);
  return [...featured, ...rest].slice(0, limit);
}

export function getLookbookSlides(): { id: string; image: string; headline: string; subcopy: string }[] {
  const featured = getFeaturedProducts(5);
  if (!featured.length) return [];
  return featured.map((p) => ({
    id: p.id,
    image: p.images[0] ?? "",
    headline: p.name,
    subcopy: `${p.brand} • $${p.price.toLocaleString("en-US", { maximumFractionDigits: 0 })}`,
  }));
}

// -----------------------------
// Generic Text Helpers
// -----------------------------

export function formatPrice(value: number): string {
  return `$${value.toLocaleString("en-US", { minimumFractionDigits: 0 })}`;
}

export function formatDate(dateIso: string): string {
  const d = new Date(dateIso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

// This entire module is mock-driven and client-only; it can be safely
// imported throughout the app as the single source of truth for data and state.