// src/mock.ts
// Central mock data store and localStorage-backed client state for Jootiya
// NOTE: This is a 100% frontend-only mock implementation; there is **no backend**.

import { safeStorage } from "@/lib/utils";

// ----------------------
// Types
// ----------------------

export type CurrencyCode = "USD" | "EUR" | "GBP" | "INR";

export type ProductCategory =
  | "sneaker"
  | "loafer"
  | "boot"
  | "high-top"
  | "sandal";

export type ProductBadge =
  | "New Drop"
  | "Exclusive"
  | "Limited"
  | "Handcrafted"
  | "Sustainable"
  | "Bestseller";

export interface ProductImage {
  url: string;
  alt: string;
  isPrimary?: boolean;
  aspectRatio?: "portrait" | "landscape" | "square";
}

export interface ProductVariantKey {
  size: string; // displayed size, e.g. "40", "US 9", "EU 42"
  color: string; // e.g. "Bone", "Onyx"
}

export interface StockByVariant extends ProductVariantKey {
  stock: number; // units available in mock
  sku: string;
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  category: ProductCategory;
  price: number;
  currency: CurrencyCode;
  description: string;
  editorialCopy: string;
  images: ProductImage[];
  sizes: string[];
  colors: string[];
  materials: string[];
  origin: string;
  releaseDate: string; // ISO string
  badges: ProductBadge[];
  tags: string[];
  stockByVariant: StockByVariant[];
  featured?: boolean;
}

export interface CartItemVariant extends ProductVariantKey {}

export interface CartItem {
  id: string; // cart line id
  productId: string;
  variant: CartItemVariant;
  unitPrice: number;
  currency: CurrencyCode;
  quantity: number;
  addedAt: string; // ISO
}

export interface CartTotals {
  subtotal: number;
  estimatedTax: number;
  shipping: number;
  total: number;
  currency: CurrencyCode;
}

export interface Cart {
  id: string;
  items: CartItem[];
  currency: CurrencyCode;
  updatedAt: string;
}

export interface Address {
  fullName: string;
  line1: string;
  line2?: string;
  city: string;
  region: string;
  postalCode: string;
  country: string;
}

export interface UserSession {
  id: string;
  name: string;
  email: string;
  avatarColor: string;
  defaultCurrency: CurrencyCode;
  shippingAddress?: Address;
  createdAt: string;
}

export interface OrderLine {
  id: string;
  productId: string;
  productName: string;
  brand: string;
  variant: CartItemVariant;
  unitPrice: number;
  quantity: number;
  lineTotal: number;
}

export type OrderStatus = "confirmed" | "processing" | "shipped" | "delivered";

export interface Order {
  id: string;
  orderNumber: string;
  userId?: string; // guest checkout possible
  createdAt: string;
  status: OrderStatus;
  currency: CurrencyCode;
  subtotal: number;
  estimatedTax: number;
  shipping: number;
  total: number;
  lines: OrderLine[];
  shippingAddress?: Address;
}

// ----------------------
// Internal constants & helpers
// ----------------------

const STORAGE_KEYS = {
  cart: "jootiya_cart_v1",
  user: "jootiya_user_v1",
  orders: "jootiya_orders_v1",
} as const;

const DEFAULT_CURRENCY: CurrencyCode = "USD";

const TAX_RATE = 0.08; // 8% mock tax
const SHIPPING_FLAT = 25; // flat luxury shipping

// Small, deterministic-ish ID helper (client-only)
function createId(prefix: string): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `${prefix}_${crypto.randomUUID()}`;
  }
  return `${prefix}_${Math.random().toString(36).substring(2, 11)}`;
}

// Safe JSON parse with fallback
function safeJsonParse<T>(raw: string | null, fallback: T): T {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

// ----------------------
// Mock Products (static in-memory)
// ----------------------

// For imagery, we use neutral unsplash-like placeholders that evoke luxury leather / sneakers.

const baseProducts: Product[] = [
  {
    id: "p_aurum_low_001",
    name: "Aurum Low Lunar",
    brand: "Maison Jootiya",
    category: "sneaker",
    price: 620,
    currency: "USD",
    description:
      "A low-profile court sneaker crafted from Italian calfskin in a muted lunar bone, finished with hand-painted edges and a featherweight cup sole.",
    editorialCopy:
      "Conceived for the quietest rooms and the loudest arrivals, Aurum Low Lunar pairs whisper-soft leather with architectural minimalism. Each panel is hand-burnished for a soft gradient that only deepens with wear.",
    images: [
      {
        url: "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=1200&q=80",
        alt: "A minimal white luxury sneaker on a sculptural plinth",
        isPrimary: true,
        aspectRatio: "landscape",
      },
      {
        url: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=900&q=80",
        alt: "Detail of leather and stitching on luxury sneaker",
        aspectRatio: "portrait",
      },
    ],
    sizes: ["39", "40", "41", "42", "43", "44"],
    colors: ["Bone", "Onyx"],
    materials: [
      "Italian calfskin",
      "Margom rubber",
      "Cotton laces",
      "Leather lining",
    ],
    origin: "Made in Italy",
    releaseDate: "2024-04-18T00:00:00.000Z",
    badges: ["Bestseller", "Handcrafted"],
    tags: ["minimal", "court", "everyday", "white sneaker"],
    stockByVariant: [],
    featured: true,
  },
  {
    id: "p_onyx_chelsea_002",
    name: "Onyx Chelsea Crest",
    brand: "Atelier Noir",
    category: "boot",
    price: 890,
    currency: "USD",
    description:
      "A sculpted Chelsea boot in deep onyx suede with an elongated toe and hand-carved leather sole, designed for evening silhouettes.",
    editorialCopy:
      "The Onyx Chelsea Crest was sketched at midnight in Paris and finished at dawn in Florence. Its line is almost liquid: a single gesture from elastic gusset to heel tab.",
    images: [
      {
        url: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1200&q=80",
        alt: "Black suede Chelsea boots on a warm neutral background",
        isPrimary: true,
        aspectRatio: "landscape",
      },
      {
        url: "https://images.unsplash.com/photo-1514996937319-344454492b37?auto=format&fit=crop&w=900&q=80",
        alt: "Close-up of suede texture on luxury boots",
        aspectRatio: "portrait",
      },
    ],
    sizes: ["40", "41", "42", "43", "44", "45"],
    colors: ["Onyx"],
    materials: ["Italian suede", "Leather sole", "Cotton pull tab"],
    origin: "Made in Portugal",
    releaseDate: "2024-02-10T00:00:00.000Z",
    badges: ["Exclusive"],
    tags: ["evening", "boot", "black"],
    stockByVariant: [],
    featured: true,
  },
  {
    id: "p_muse_loaf_003",
    name: "Muse Penny Loafer",
    brand: "Casa Venturo",
    category: "loafer",
    price: 740,
    currency: "USD",
    description:
      "A sculpted penny loafer in brushed cacao leather with a softly squared toe and hand-stitched apron.",
    editorialCopy:
      "Muse was imagined as a loafer you notice in silence. The toe is softened to echo gallery plinths, the saddle thinned to a single, precise line.",
    images: [
      {
        url: "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?auto=format&fit=crop&w=1200&q=80",
        alt: "Brown leather loafers on a neutral backdrop",
        isPrimary: true,
        aspectRatio: "landscape",
      },
      {
        url: "https://images.unsplash.com/photo-1614252235316-8c857af1b228?auto=format&fit=crop&w=900&q=80",
        alt: "Close-up of loafer stitching",
        aspectRatio: "portrait",
      },
    ],
    sizes: ["38", "39", "40", "41", "42", "43"],
    colors: ["Cacao", "Sand"],
    materials: [
      "Vegetable-tanned leather",
      "Leather sole",
      "Goodyear welt",
    ],
    origin: "Made in Spain",
    releaseDate: "2023-11-05T00:00:00.000Z",
    badges: ["Handcrafted", "Sustainable"],
    tags: ["loafer", "penny", "brown"],
    stockByVariant: [],
    featured: true,
  },
  {
    id: "p_verve_high_004",
    name: "Verve High Eclipse",
    brand: "Maison Jootiya",
    category: "high-top",
    price: 680,
    currency: "USD",
    description:
      "A high-top sneaker in off-black nubuck with a sculptural collar and concealed eyelets.",
    editorialCopy:
      "Verve Eclipse is cut for night flights and gallery openings. The padded collar traces the line of the ankle like ink on paper.",
    images: [
      {
        url: "https://images.unsplash.com/photo-1539185441755-769473a23570?auto=format&fit=crop&w=1200&q=80",
        alt: "Dark high-top sneaker on a plinth",
        isPrimary: true,
        aspectRatio: "landscape",
      },
      {
        url: "https://images.unsplash.com/photo-1543508282-6319a3e2621f?auto=format&fit=crop&w=900&q=80",
        alt: "High-top sneaker side view",
        aspectRatio: "portrait",
      },
    ],
    sizes: ["39", "40", "41", "42", "43", "44"],
    colors: ["Eclipse", "Ivory"],
    materials: ["Nubuck", "Rubber sole", "Memory foam insole"],
    origin: "Made in Italy",
    releaseDate: "2024-06-01T00:00:00.000Z",
    badges: ["New Drop"],
    tags: ["high-top", "black", "street"],
    stockByVariant: [],
    featured: true,
  },
  {
    id: "p_sable_slide_005",
    name: "Sable Gallery Slide",
    brand: "Linea Oro",
    category: "sandal",
    price: 420,
    currency: "USD",
    description:
      "A minimal slide with padded strap in sable leather and an ultra-thin profile sole.",
    editorialCopy:
      "Designed for marble corridors and slow mornings, Sable Gallery Slide hugs the foot like a line of ink across soft paper.",
    images: [
      {
        url: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=1200&q=80",
        alt: "Minimal black slide sandals",
        isPrimary: true,
        aspectRatio: "landscape",
      },
    ],
    sizes: ["37", "38", "39", "40", "41", "42"],
    colors: ["Sable", "Crema"],
    materials: ["Nappa leather", "Leather footbed"],
    origin: "Made in Italy",
    releaseDate: "2023-05-15T00:00:00.000Z",
    badges: ["Bestseller"],
    tags: ["slide", "sandal", "summer"],
    stockByVariant: [],
    featured: false,
  },
  {
    id: "p_terra_boot_006",
    name: "Terra Ridge Boot",
    brand: "Atelier Noir",
    category: "boot",
    price: 960,
    currency: "USD",
    description:
      "A lug-soled boot in smoked taupe leather, built on a sculpted last with exaggerated welt.",
    editorialCopy:
      "Terra Ridge walks the line between alpine and avenue. Each welt is inked by hand in a deep umber tone, catching light at every step.",
    images: [
      {
        url: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=1200&q=80",
        alt: "Taupe leather boots with rugged sole",
        isPrimary: true,
        aspectRatio: "landscape",
      },
    ],
    sizes: ["40", "41", "42", "43", "44", "45"],
    colors: ["Smoked Taupe"],
    materials: ["Pebbled leather", "Rubber lug sole", "Waxed laces"],
    origin: "Made in Romania",
    releaseDate: "2023-12-22T00:00:00.000Z",
    badges: ["Limited"],
    tags: ["boot", "lug sole", "taupe"],
    stockByVariant: [],
    featured: false,
  },
  {
    id: "p_lumen_low_007",
    name: "Lumen Low Chalk",
    brand: "Maison Jootiya",
    category: "sneaker",
    price: 650,
    currency: "USD",
    description:
      "A monochrome low-top in chalk leather with tonal stitching and blind debossed branding.",
    editorialCopy:
      "Lumen Low is the whisper in a white room. The outsole has been tinted to the slightest warm ivory to mirror gallery walls at dusk.",
    images: [
      {
        url: "https://images.unsplash.com/photo-1519744792095-2f2205e87b6f?auto=format&fit=crop&w=1200&q=80",
        alt: "White minimal low-top sneaker",
        isPrimary: true,
        aspectRatio: "landscape",
      },
    ],
    sizes: ["38", "39", "40", "41", "42", "43", "44"],
    colors: ["Chalk"],
    materials: ["Full-grain leather", "Rubber cup sole"],
    origin: "Made in Italy",
    releaseDate: "2024-01-15T00:00:00.000Z",
    badges: ["New Drop", "Bestseller"],
    tags: ["sneaker", "white", "minimal"],
    stockByVariant: [],
    featured: true,
  },
  {
    id: "p_ombre_loaf_008",
    name: "Ombre Tassel Loafer",
    brand: "Casa Venturo",
    category: "loafer",
    price: 780,
    currency: "USD",
    description:
      "A tassel loafer with ombre hand-dyed patina fading from espresso to crema.",
    editorialCopy:
      "Each Ombre Tassel Loafer passes through eight layers of dye and wax, building a soft gradient that feels almost cinematic.",
    images: [
      {
        url: "https://images.unsplash.com/photo-1583497381213-9c19cc28521c?auto=format&fit=crop&w=1200&q=80",
        alt: "Brown ombre loafers on a light background",
        isPrimary: true,
        aspectRatio: "landscape",
      },
    ],
    sizes: ["39", "40", "41", "42", "43"],
    colors: ["Espresso Ombre"],
    materials: [
      "Hand-dyed leather",
      "Leather sole",
      "Cotton tassels",
    ],
    origin: "Made in Spain",
    releaseDate: "2022-09-10T00:00:00.000Z",
    badges: ["Handcrafted"],
    tags: ["loafer", "tassel", "patina"],
    stockByVariant: [],
    featured: false,
  },
  {
    id: "p_arc_runner_009",
    name: "Arc Runner Smoke",
    brand: "Linea Oro",
    category: "sneaker",
    price: 580,
    currency: "USD",
    description:
      "A sculpted runner with smoked mesh, suede overlays and a softly exaggerated sole.",
    editorialCopy:
      "Arc Runner traces a single stroke from toe to heel. The sole flares just enough to cast a shadow, never to shout.",
    images: [
      {
        url: "https://images.unsplash.com/photo-1528701800489-20be3c30c1d5?auto=format&fit=crop&w=1200&q=80",
        alt: "Luxury running-style sneakers in neutral tones",
        isPrimary: true,
        aspectRatio: "landscape",
      },
    ],
    sizes: ["39", "40", "41", "42", "43", "44"],
    colors: ["Smoke", "Stone"],
    materials: ["Mesh", "Suede", "EVA sole"],
    origin: "Made in Portugal",
    releaseDate: "2023-08-01T00:00:00.000Z",
    badges: ["Sustainable"],
    tags: ["runner", "sneaker", "neutral"],
    stockByVariant: [],
    featured: false,
  },
  {
    id: "p_courtyard_010",
    name: "Courtyard Derby",
    brand: "Atelier Noir",
    category: "boot",
    price: 820,
    currency: "USD",
    description:
      "An open-laced derby on a sleek last with a bevelled waist and blind eyelets.",
    editorialCopy:
      "Courtyard walks like a dress shoe and photographs like sculpture. The vamp is cut from a single piece of leather for uninterrupted shine.",
    images: [
      {
        url: "https://images.unsplash.com/photo-1595385409880-f2e1c5cde1be?auto=format&fit=crop&w=1200&q=80",
        alt: "Black leather derby shoes on stone floor",
        isPrimary: true,
        aspectRatio: "landscape",
      },
    ],
    sizes: ["40", "41", "42", "43", "44"],
    colors: ["Ink"],
    materials: ["Calfskin", "Leather sole"],
    origin: "Made in Italy",
    releaseDate: "2022-03-18T00:00:00.000Z",
    badges: ["Exclusive"],
    tags: ["derby", "formal", "black"],
    stockByVariant: [],
    featured: false,
  },
  {
    id: "p_arcade_high_011",
    name: "Arcade High Ivory",
    brand: "Maison Jootiya",
    category: "high-top",
    price: 710,
    currency: "USD",
    description:
      "A paneled high-top in ivory leather with subtle perforations and contrast foxing.",
    editorialCopy:
      "Arcade is an ode to late-night lights on wet pavement. Its lines borrow from vintage sport, sharpened for the present.",
    images: [
      {
        url: "https://images.unsplash.com/photo-1584735175015-7aaad614c366?auto=format&fit=crop&w=1200&q=80",
        alt: "Ivory high-top sneaker on neutral background",
        isPrimary: true,
        aspectRatio: "landscape",
      },
    ],
    sizes: ["38", "39", "40", "41", "42", "43", "44"],
    colors: ["Ivory", "Ink"],
    materials: ["Leather", "Rubber sole", "Cotton laces"],
    origin: "Made in Italy",
    releaseDate: "2024-03-02T00:00:00.000Z",
    badges: ["New Drop", "Limited"],
    tags: ["high-top", "ivory"],
    stockByVariant: [],
    featured: true,
  },
  {
    id: "p_silent_mule_012",
    name: "Silent Studio Mule",
    brand: "Linea Oro",
    category: "sandal",
    price: 460,
    currency: "USD",
    description:
      "A backless mule with sculpted topline in soft pebble leather.",
    editorialCopy:
      "Silent Studio Mule slips on like a brushstroke. The heel is tuned to studio floors and gallery tiles alike.",
    images: [
      {
        url: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=1200&q=80",
        alt: "Neutral leather mules on fabric backdrop",
        isPrimary: true,
        aspectRatio: "landscape",
      },
    ],
    sizes: ["36", "37", "38", "39", "40", "41"],
    colors: ["Cloud", "Ink"],
    materials: ["Pebble leather", "Leather sole"],
    origin: "Made in Spain",
    releaseDate: "2023-04-01T00:00:00.000Z",
    badges: ["Handcrafted"],
    tags: ["mule", "studio"],
    stockByVariant: [],
    featured: false,
  },
  {
    id: "p_night_runner_013",
    name: "Night Runner Obsidian",
    brand: "Casa Venturo",
    category: "sneaker",
    price: 590,
    currency: "USD",
    description:
      "A low-profile runner in obsidian mesh with tonal leather overlays and reflective piping.",
    editorialCopy:
      "Night Runner was built for hidden cities and late flights. Its reflective line catches light for a second, then disappears.",
    images: [
      {
        url: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80",
        alt: "Black running sneakers on a concrete block",
        isPrimary: true,
        aspectRatio: "landscape",
      },
    ],
    sizes: ["39", "40", "41", "42", "43", "44"],
    colors: ["Obsidian"],
    materials: ["Mesh", "Leather", "Rubber sole"],
    origin: "Made in Vietnam",
    releaseDate: "2023-10-10T00:00:00.000Z",
    badges: ["Sustainable"],
    tags: ["runner", "black"],
    stockByVariant: [],
    featured: false,
  },
  {
    id: "p_gallery_oxford_014",
    name: "Gallery Oxford",
    brand: "Atelier Noir",
    category: "boot",
    price: 910,
    currency: "USD",
    description:
      "A closed-laced oxford with an elongated last, mirror gloss toe, and subtle gold foil signature.",
    editorialCopy:
      "Gallery Oxford is for opening nights and quiet awards. Built on our sharpest last, it catches every reflection without a single shout.",
    images: [
      {
        url: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1200&q=80",
        alt: "Polished black oxford shoes",
        isPrimary: true,
        aspectRatio: "landscape",
      },
    ],
    sizes: ["40", "41", "42", "43", "44", "45"],
    colors: ["Noir"],
    materials: ["Patent leather", "Leather sole"],
    origin: "Made in Italy",
    releaseDate: "2021-11-11T00:00:00.000Z",
    badges: ["Exclusive"],
    tags: ["oxford", "formal"],
    stockByVariant: [],
    featured: false,
  },
];

// Generate deterministic mock stockByVariant from sizes & colors if empty
export const products: Product[] = baseProducts.map((p) => {
  if (p.stockByVariant.length === 0) {
    const variants: StockByVariant[] = [];
    p.sizes.forEach((size) => {
      p.colors.forEach((color) => {
        const sku = `${p.id}-${size.replace(/\s+/g, "").toUpperCase()}-${color
          .replace(/\s+/g, "")
          .toUpperCase()}`;
        const stock = 3 + Math.floor(Math.random() * 7); // 3–9 pairs
        variants.push({ size, color, stock, sku });
      });
    });
    return { ...p, stockByVariant: variants } as Product;
  }
  return p;
});

// ----------------------
// Formatting & derived helpers
// ----------------------

export function formatMoney(
  amount: number,
  currency: CurrencyCode = DEFAULT_CURRENCY
): string {
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(amount);
  } catch {
    return `$${amount.toFixed(0)}`;
  }
}

export function computeCartTotals(
  cart: Cart,
  options?: { taxRate?: number; shippingFlat?: number }
): CartTotals {
  const taxRate = options?.taxRate ?? TAX_RATE;
  const shippingFlat = options?.shippingFlat ?? SHIPPING_FLAT;

  const subtotal = cart.items.reduce(
    (sum, line) => sum + line.unitPrice * line.quantity,
    0
  );
  const estimatedTax = Math.round(subtotal * taxRate);
  const shipping = cart.items.length === 0 ? 0 : shippingFlat;
  const total = subtotal + estimatedTax + shipping;

  return {
    subtotal,
    estimatedTax,
    shipping,
    total,
    currency: cart.currency,
  };
}

// ----------------------
// Local persistence: cart, user, orders
// ----------------------

function loadCartInternal(): Cart {
  const raw = safeStorage.getItem(STORAGE_KEYS.cart);
  const fallback: Cart = {
    id: "cart_default",
    items: [],
    currency: DEFAULT_CURRENCY,
    updatedAt: new Date().toISOString(),
  };
  return safeJsonParse<Cart>(raw, fallback);
}

function saveCartInternal(cart: Cart): void {
  const serialised = JSON.stringify(cart);
  safeStorage.setItem(STORAGE_KEYS.cart, serialised);
}

function loadUserInternal(): UserSession | undefined {
  const raw = safeStorage.getItem(STORAGE_KEYS.user);
  return safeJsonParse<UserSession | undefined>(raw, undefined);
}

function saveUserInternal(user: UserSession | undefined): void {
  if (!user) {
    safeStorage.removeItem(STORAGE_KEYS.user);
    return;
  }
  safeStorage.setItem(STORAGE_KEYS.user, JSON.stringify(user));
}

function loadOrdersInternal(): Order[] {
  const raw = safeStorage.getItem(STORAGE_KEYS.orders);
  return safeJsonParse<Order[]>(raw, []);
}

function saveOrdersInternal(orders: Order[]): void {
  safeStorage.setItem(STORAGE_KEYS.orders, JSON.stringify(orders));
}

// ----------------------
// Public getters: products & filters
// ----------------------

export function getProducts(): Product[] {
  return [...products];
}

export function getBrands(): string[] {
  const brands = new Set<string>();
  products.forEach((p) => brands.add(p.brand));
  return Array.from(brands).sort();
}

export function getAvailableSizes(): string[] {
  const sizes = new Set<string>();
  products.forEach((p) => p.sizes.forEach((s) => sizes.add(s)));
  return Array.from(sizes).sort((a, b) => {
    const na = parseFloat(a.replace(/[^0-9.]/g, ""));
    const nb = parseFloat(b.replace(/[^0-9.]/g, ""));
    if (isNaN(na) || isNaN(nb)) return a.localeCompare(b);
    return na - nb;
  });
}

export function getAvailableColors(): string[] {
  const colors = new Set<string>();
  products.forEach((p) => p.colors.forEach((c) => colors.add(c)));
  return Array.from(colors).sort();
}

// ----------------------
// Cart helpers
// ----------------------

export function getCart(): Cart {
  return loadCartInternal();
}

export function addToCart(
  productId: string,
  variant: CartItemVariant,
  qty: number
): Cart {
  const normalizedQty = Math.max(1, Math.floor(qty || 1));
  const cart = loadCartInternal();
  const product = products.find((p) => p.id === productId);
  if (!product) {
    return cart;
  }

  // See if same product + variant already exists; if so, increment
  const existing = cart.items.find(
    (line) =>
      line.productId === productId &&
      line.variant.size === variant.size &&
      line.variant.color === variant.color
  );

  if (existing) {
    existing.quantity += normalizedQty;
  } else {
    cart.items.push({
      id: createId("line"),
      productId,
      variant: { ...variant },
      unitPrice: product.price,
      currency: product.currency,
      quantity: normalizedQty,
      addedAt: new Date().toISOString(),
    });
  }

  cart.currency = product.currency;
  cart.updatedAt = new Date().toISOString();
  saveCartInternal(cart);
  return cart;
}

export function updateCartQty(lineId: string, qty: number): Cart {
  const cart = loadCartInternal();
  const line = cart.items.find((l) => l.id === lineId);
  if (!line) return cart;

  const normalizedQty = Math.max(0, Math.floor(qty || 0));
  if (normalizedQty <= 0) {
    cart.items = cart.items.filter((l) => l.id !== lineId);
  } else {
    line.quantity = normalizedQty;
  }

  cart.updatedAt = new Date().toISOString();
  saveCartInternal(cart);
  return cart;
}

export function removeFromCart(lineId: string): Cart {
  const cart = loadCartInternal();
  cart.items = cart.items.filter((l) => l.id !== lineId);
  cart.updatedAt = new Date().toISOString();
  saveCartInternal(cart);
  return cart;
}

export function clearCart(): Cart {
  const empty: Cart = {
    id: "cart_default",
    items: [],
    currency: DEFAULT_CURRENCY,
    updatedAt: new Date().toISOString(),
  };
  saveCartInternal(empty);
  return empty;
}

// ----------------------
// User session helpers
// ----------------------

export function getUser(): UserSession | undefined {
  return loadUserInternal();
}

export function setUser(user: UserSession | undefined): void {
  saveUserInternal(user);
}

// ----------------------
// Orders helpers (mock)
// ----------------------

export function getOrders(): Order[] {
  return loadOrdersInternal();
}

export function saveOrder(order: Order): void {
  const orders = loadOrdersInternal();
  orders.push(order);
  saveOrdersInternal(orders);
}