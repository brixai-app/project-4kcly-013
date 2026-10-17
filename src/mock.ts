import { safeStorage } from "@/lib/utils";

// NOTE: This entire file is a **frontend-only mock store**.
// There is NO backend – all data lives in memory + localStorage.
// This is intentional to create a rich demo experience in the browser only.

// -----------------------------
// Types
// -----------------------------

export type MojriStyle =
  | "Classic"
  | "Contemporary"
  | "Bridal"
  | "Everyday"
  | "Heritage";

export interface Artisan {
  id: string;
  name: string;
  region: string;
  avatarColor: string; // For placeholder avatar treatment
  shortBio: string;
  story: string;
  yearsOfCraft: number;
}

export interface MojriProductImage {
  id: string;
  url: string;
  alt: string;
  emphasis?: "primary" | "detail" | "context";
}

export interface MojriProduct {
  id: string;
  name: string;
  slug: string;
  artisanId: string;
  style: MojriStyle;
  baseColor: string;
  accentColor: string;
  priceINR: number;
  heroImage: string;
  images: MojriProductImage[];
  sizes: number[]; // EU sizes / generic numeric
  description: string;
  materials: string[];
  fitNotes: string;
  isLimitedEdition: boolean;
  isFeatured: boolean;
}

export interface CartItem {
  id: string; // cart line id
  productId: string;
  size: number;
  quantity: number;
  addedAt: string; // ISO
}

export type OrderStatus = "processing" | "packed" | "in-transit" | "delivered";

export interface OrderItemSnapshot {
  productId: string;
  productName: string;
  heroImage: string;
  priceINR: number;
  size: number;
  quantity: number;
}

export interface Order {
  id: string;
  createdAt: string;
  status: OrderStatus;
  items: OrderItemSnapshot[];
  subtotalINR: number;
  taxesINR: number;
  totalINR: number;
}

export interface Profile {
  id: string;
  name: string;
  city: string;
  country: string;
  preferredSize: number;
}

export interface SearchFilters {
  term: string;
  artisanId: string | null;
  style: MojriStyle | "All";
}

export interface MockState {
  artisans: Artisan[];
  products: MojriProduct[];
  featuredProductIds: string[];
  cart: CartItem[];
  orders: Order[];
  profile: Profile;
  search: SearchFilters;
  lastOrderId: string | null;
}

// -----------------------------
// Constants / seeded data
// -----------------------------

const STORAGE_KEY = "jootiya_mock_state_v1";

// Small helper for deterministic IDs (not cryptographically secure)
const makeId = (seed: string) => `jt_${seed}`;

const seedArtisans: Artisan[] = [
  {
    id: makeId("artisan_meera"),
    name: "Meera Kumari",
    region: "Old City, Jodhpur",
    avatarColor: "#A6684A",
    shortBio:
      "Third-generation mojri artisan blending heirloom motifs with featherlight silhouettes.",
    story:
      "Meera grew up in the blue lanes of Jodhpur sketching motifs from havelis and temple frescoes. Her workshop still uses hand-cut leather and natural dyes, but she experiments with asymmetry and negative space, creating mojris that feel like quiet architecture for the feet.",
    yearsOfCraft: 18,
  },
  {
    id: makeId("artisan_omprakash"),
    name: "Om Prakash Rathore",
    region: "Clock Tower Bazaar, Jodhpur",
    avatarColor: "#8B5E3C",
    shortBio:
      "Master of intricate zardozi and metallic threadwork inspired by Marwar regalia.",
    story:
      "Om Prakash apprenticed under royal karigars who once crafted for the courts of Marwar. His mojris carry a restrained opulence – every stitch references vintage sherwanis, vintage guard uniforms and the burnished domes that punctuate the Jodhpur skyline.",
    yearsOfCraft: 27,
  },
  {
    id: makeId("artisan_saira"),
    name: "Saira Hussain",
    region: "Rai Ka Bagh, Jodhpur",
    avatarColor: "#9C4F4A",
    shortBio:
      "Minimalist mojris with tonal hand-embroidery, designed for contemporary wardrobes.",
    story:
      "Saira is part of a new wave of women artisans reclaiming the mojri as everyday luxury. She keeps silhouettes clean, almost architectural, and lets subtle stitch-lines do the storytelling. Her palette is lifted from monsoon skies, sandstone, and the patina of old doors.",
    yearsOfCraft: 9,
  },
];

const seedProducts: MojriProduct[] = [
  {
    id: makeId("prod_meera_sandstone"),
    name: "Sandstone Court Mojri",
    slug: "sandstone-court-mojri",
    artisanId: makeId("artisan_meera"),
    style: "Heritage",
    baseColor: "#D9B89C",
    accentColor: "#7A4A32",
    priceINR: 8200,
    heroImage:
      "https://images.pexels.com/photos/5875132/pexels-photo-5875132.jpeg?auto=compress&cs=tinysrgb&w=1600",
    images: [
      {
        id: makeId("img_meera_sandstone_1"),
        url: "https://images.pexels.com/photos/5875132/pexels-photo-5875132.jpeg?auto=compress&cs=tinysrgb&w=1600",
        alt: "Rajasthani mojris resting on carved sandstone steps in Jodhpur courtyard.",
        emphasis: "primary",
      },
      {
        id: makeId("img_meera_sandstone_2"),
        url: "https://images.pexels.com/photos/5875137/pexels-photo-5875137.jpeg?auto=compress&cs=tinysrgb&w=1600",
        alt: "Close-up of hand-stitched upper of sandstone mojri.",
        emphasis: "detail",
      },
      {
        id: makeId("img_meera_sandstone_3"),
        url: "https://images.pexels.com/photos/5875135/pexels-photo-5875135.jpeg?auto=compress&cs=tinysrgb&w=1600",
        alt: "Pair of mojris framed against blue Jodhpur wall.",
        emphasis: "context",
      },
    ],
    sizes: [37, 38, 39, 40, 41, 42],
    description:
      "A quietly dramatic mojri inspired by the terraced courtyards of old Jodhpur havelis. Hand-cut leather in a warm sandstone tone is traced with a single line of hand-stitching that runs like a horizon across the vamp.",
    materials: [
      "Full-grain leather",
      "Cotton hand-stitching",
      "Natural latex padding",
    ],
    fitNotes:
      "Fits true to size with a snug, glove-like feel that relaxes subtly with wear.",
    isLimitedEdition: true,
    isFeatured: true,
  },
  {
    id: makeId("prod_omprakash_metallic"),
    name: "Marwar Midnight Zardozi",
    slug: "marwar-midnight-zardozi",
    artisanId: makeId("artisan_omprakash"),
    style: "Bridal",
    baseColor: "#26252A",
    accentColor: "#C69C6D",
    priceINR: 12400,
    heroImage:
      "https://images.pexels.com/photos/3651597/pexels-photo-3651597.jpeg?auto=compress&cs=tinysrgb&w=1600",
    images: [
      {
        id: makeId("img_om_metallic_1"),
        url: "https://images.pexels.com/photos/3651597/pexels-photo-3651597.jpeg?auto=compress&cs=tinysrgb&w=1600",
        alt: "Dark embellished mojris on carved wooden chest.",
        emphasis: "primary",
      },
      {
        id: makeId("img_om_metallic_2"),
        url: "https://images.pexels.com/photos/5058615/pexels-photo-5058615.jpeg?auto=compress&cs=tinysrgb&w=1600",
        alt: "Zardozi detail with metallic thread on mojri upper.",
        emphasis: "detail",
      },
      {
        id: makeId("img_om_metallic_3"),
        url: "https://images.pexels.com/photos/3651592/pexels-photo-3651592.jpeg?auto=compress&cs=tinysrgb&w=1600",
        alt: "Wedding ensemble styled with mojris and sherwani buttons.",
        emphasis: "context",
      },
    ],
    sizes: [39, 40, 41, 42, 43, 44],
    description:
      "An evening mojri that feels like a held breath before the shehnai begins. Deep midnight leather is hand-embroidered with aged metallic thread, echoing the domes and guard uniforms of old Marwar.",
    materials: [
      "Premium veg-tan leather",
      "Metallic zardozi thread",
      "Goat leather lining",
    ],
    fitNotes:
      "Structured upper with a ceremonial feel. If between sizes, size up for longer wear.",
    isLimitedEdition: true,
    isFeatured: true,
  },
  {
    id: makeId("prod_saira_blues"),
    name: "Monsoon Terrace Slip-On",
    slug: "monsoon-terrace-slip-on",
    artisanId: makeId("artisan_saira"),
    style: "Contemporary",
    baseColor: "#B0C4C9",
    accentColor: "#325C63",
    priceINR: 6800,
    heroImage:
      "https://images.pexels.com/photos/3738087/pexels-photo-3738087.jpeg?auto=compress&cs=tinysrgb&w=1600",
    images: [
      {
        id: makeId("img_saira_blues_1"),
        url: "https://images.pexels.com/photos/3738087/pexels-photo-3738087.jpeg?auto=compress&cs=tinysrgb&w=1600",
        alt: "Soft blue mojris on washed stone floor with monsoon light.",
        emphasis: "primary",
      },
      {
        id: makeId("img_saira_blues_2"),
        url: "https://images.pexels.com/photos/3738080/pexels-photo-3738080.jpeg?auto=compress&cs=tinysrgb&w=1600",
        alt: "Detail of tonal stitch-lines on minimalist mojri.",
        emphasis: "detail",
      },
      {
        id: makeId("img_saira_blues_3"),
        url: "https://images.pexels.com/photos/3738081/pexels-photo-3738081.jpeg?auto=compress&cs=tinysrgb&w=1600",
        alt: "Mojris styled with linen trousers on terrace.",
        emphasis: "context",
      },
    ],
    sizes: [36, 37, 38, 39, 40, 41],
    description:
      "A barefoot-feeling mojri for the city terrace. Powdery blues mirror the Jodhpur sky after rain, while a single deep stitch-line nods to the horizon of the Mehrangarh fort.",
    materials: ["Soft-grain leather", "Micro-foam cushioning", "Cotton lining"],
    fitNotes:
      "Unstructured and easy. Ideal for barefoot wearers or those who prefer a relaxed fit.",
    isLimitedEdition: false,
    isFeatured: true,
  },
  {
    id: makeId("prod_meera_everyday"),
    name: "Old City Everyday Mojri",
    slug: "old-city-everyday-mojri",
    artisanId: makeId("artisan_meera"),
    style: "Everyday",
    baseColor: "#C79A6D",
    accentColor: "#5C3A26",
    priceINR: 5200,
    heroImage:
      "https://images.pexels.com/photos/3738077/pexels-photo-3738077.jpeg?auto=compress&cs=tinysrgb&w=1600",
    images: [
      {
        id: makeId("img_meera_everyday_1"),
        url: "https://images.pexels.com/photos/3738077/pexels-photo-3738077.jpeg?auto=compress&cs=tinysrgb&w=1600",
        alt: "Tan mojris casually placed on patterned tiled floor.",
        emphasis: "primary",
      },
      {
        id: makeId("img_meera_everyday_2"),
        url: "https://images.pexels.com/photos/3738074/pexels-photo-3738074.jpeg?auto=compress&cs=tinysrgb&w=1600",
        alt: "Profile view of everyday mojri silhouette.",
        emphasis: "detail",
      },
    ],
    sizes: [37, 38, 39, 40, 41, 42, 43],
    description:
      "A daily-wear mojri with the quiet confidence of an old city lane. Slightly rounded toe, generous padding, and a sand-washed finish that pairs with everything from denim to handloom.",
    materials: ["Grain leather", "Cork midsole", "Leather lining"],
    fitNotes: "Designed for all-day wear. Slightly roomier at the forefoot.",
    isLimitedEdition: false,
    isFeatured: false,
  },
  {
    id: makeId("prod_saira_white"),
    name: "Mehrangarh Ivory Edit",
    slug: "mehrangarh-ivory-edit",
    artisanId: makeId("artisan_saira"),
    style: "Classic",
    baseColor: "#F4ECE3",
    accentColor: "#8A5A3C",
    priceINR: 9100,
    heroImage:
      "https://images.pexels.com/photos/3738075/pexels-photo-3738075.jpeg?auto=compress&cs=tinysrgb&w=1600",
    images: [
      {
        id: makeId("img_saira_white_1"),
        url: "https://images.pexels.com/photos/3738075/pexels-photo-3738075.jpeg?auto=compress&cs=tinysrgb&w=1600",
        alt: "Ivory mojris against textured plaster wall.",
        emphasis: "primary",
      },
      {
        id: makeId("img_saira_white_2"),
        url: "https://images.pexels.com/photos/3738072/pexels-photo-3738072.jpeg?auto=compress&cs=tinysrgb&w=1600",
        alt: "Top view of ivory mojri pair showing almond-shaped toe.",
        emphasis: "detail",
      },
    ],
    sizes: [36, 37, 38, 39, 40, 41, 42],
    description:
      "An ivory mojri that references the pale ramparts of Mehrangarh at first light. Tonal embroidery sketches a barely-there motif you notice only when the light hits right.",
    materials: ["Dyed leather", "Tonal embroidery thread", "Foam cushioning"],
    fitNotes:
      "Clean almond toe with a slim profile. Ideal with cropped hems and occasion wear.",
    isLimitedEdition: true,
    isFeatured: false,
  },
];

const seedFeaturedProductIds: string[] = seedProducts
  .filter((p) => p.isFeatured)
  .map((p) => p.id);

const seedProfile: Profile = {
  id: makeId("profile_demo"),
  name: "Jootiya Guest",
  city: "Jodhpur",
  country: "India",
  preferredSize: 41,
};

const seedSearch: SearchFilters = {
  term: "",
  artisanId: null,
  style: "All",
};

const createInitialState = (): MockState => ({
  artisans: seedArtisans,
  products: seedProducts,
  featuredProductIds: seedFeaturedProductIds,
  cart: [],
  orders: [],
  profile: seedProfile,
  search: seedSearch,
  lastOrderId: null,
});

// -----------------------------
// Persistence helpers
// -----------------------------

export const loadState = (): MockState => {
  if (!safeStorage) return createInitialState();
  try {
    const raw = safeStorage.getItem(STORAGE_KEY);
    if (!raw) return createInitialState();
    const parsed = JSON.parse(raw) as Partial<MockState>;

    // Defensive merge to stay forward compatible
    const base = createInitialState();
    return {
      ...base,
      ...parsed,
      artisans: parsed.artisans ?? base.artisans,
      products: parsed.products ?? base.products,
      featuredProductIds: parsed.featuredProductIds ?? base.featuredProductIds,
      cart: parsed.cart ?? base.cart,
      orders: parsed.orders ?? base.orders,
      profile: parsed.profile ?? base.profile,
      search: parsed.search ?? base.search,
      lastOrderId: parsed.lastOrderId ?? base.lastOrderId,
    };
  } catch {
    return createInitialState();
  }
};

export const saveState = (state: MockState): void => {
  if (!safeStorage) return;
  try {
    safeStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // ignore persistence errors for demo
  }
};

export const resetDemoState = (): MockState => {
  const initial = createInitialState();
  saveState(initial);
  notifySubscribers(initial);
  return initial;
};

// -----------------------------
// Internal store + pub/sub
// -----------------------------

let currentState: MockState = loadState();

type Listener = (state: MockState) => void;

const listeners = new Set<Listener>();

const notifySubscribers = (state: MockState) => {
  for (const listener of listeners) {
    listener(state);
  }
};

const setState = (updater: (prev: MockState) => MockState) => {
  const next = updater(currentState);
  currentState = next;
  saveState(next);
  notifySubscribers(next);
};

// -----------------------------
// Public store API
// -----------------------------

export const mockStore = {
  // React 18-friendly subscription interface
  subscribe(listener: Listener): () => void {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },

  getSnapshot(): MockState {
    return currentState;
  },

  // -------------------------
  // Selectors
  // -------------------------

  getArtisans(): Artisan[] {
    return currentState.artisans;
  },

  getProducts(): MojriProduct[] {
    return currentState.products;
  },

  getFeaturedProducts(): MojriProduct[] {
    const { products, featuredProductIds } = currentState;
    return products.filter((p) => featuredProductIds.includes(p.id));
  },

  getProductById(id: string): MojriProduct | undefined {
    return currentState.products.find((p) => p.id === id);
  },

  getProductBySlug(slug: string): MojriProduct | undefined {
    return currentState.products.find((p) => p.slug === slug);
  },

  getArtisanById(id: string): Artisan | undefined {
    return currentState.artisans.find((a) => a.id === id);
  },

  getCart(): CartItem[] {
    return currentState.cart;
  },

  getCartDetailed(): Array<{
    lineId: string;
    product: MojriProduct;
    size: number;
    quantity: number;
    lineTotalINR: number;
  }> {
    const { cart, products } = currentState;
    return cart
      .map((item) => {
        const product = products.find((p) => p.id === item.productId);
        if (!product) return null;
        return {
          lineId: item.id,
          product,
          size: item.size,
          quantity: item.quantity,
          lineTotalINR: item.quantity * product.priceINR,
        };
      })
      .filter(Boolean) as Array<{
      lineId: string;
      product: MojriProduct;
      size: number;
      quantity: number;
      lineTotalINR: number;
    }>;
  },

  getCartCount(): number {
    return currentState.cart.reduce((sum, item) => sum + item.quantity, 0);
  },

  getCartSubtotal(): number {
    const detailed = this.getCartDetailed();
    return detailed.reduce((sum, line) => sum + line.lineTotalINR, 0);
  },

  getOrders(): Order[] {
    return currentState.orders;
  },

  getLastOrder(): Order | null {
    const { lastOrderId, orders } = currentState;
    if (!lastOrderId) return null;
    return orders.find((o) => o.id === lastOrderId) ?? null;
  },

  getProfile(): Profile {
    return currentState.profile;
  },

  getSearch(): SearchFilters {
    return currentState.search;
  },

  getFilteredProducts(): MojriProduct[] {
    const { products, search } = currentState;
    const term = search.term.trim().toLowerCase();

    return products.filter((p) => {
      if (search.style !== "All" && p.style !== search.style) return false;
      if (search.artisanId && p.artisanId !== search.artisanId) return false;

      if (!term) return true;

      const artisan = currentState.artisans.find((a) => a.id === p.artisanId);
      const compound = `${p.name} ${artisan?.name ?? ""}`.toLowerCase();
      return compound.includes(term);
    });
  },

  // -------------------------
  // Search / filter actions
  // -------------------------

  setSearchTerm(term: string) {
    setState((prev) => ({
      ...prev,
      search: {
        ...prev.search,
        term,
      },
    }));
  },

  setSearchArtisan(artisanId: string | null) {
    setState((prev) => ({
      ...prev,
      search: {
        ...prev.search,
        artisanId,
      },
    }));
  },

  setSearchStyle(style: MojriStyle | "All") {
    setState((prev) => ({
      ...prev,
      search: {
        ...prev.search,
        style,
      },
    }));
  },

  clearSearchFilters() {
    setState((prev) => ({
      ...prev,
      search: seedSearch,
    }));
  },

  // -------------------------
  // Cart actions
  // -------------------------

  addToCart(productId: string, size: number, quantity: number = 1) {
    if (quantity <= 0) return;
    setState((prev) => {
      const existing = prev.cart.find(
        (item) => item.productId === productId && item.size === size,
      );

      const updatedCart = existing
        ? prev.cart.map((item) =>
            item === existing
              ? {
                  ...item,
                  quantity: item.quantity + quantity,
                }
              : item,
          )
        : [
            ...prev.cart,
            {
              id: crypto.randomUUID(),
              productId,
              size,
              quantity,
              addedAt: new Date().toISOString(),
            },
          ];

      return {
        ...prev,
        cart: updatedCart,
      };
    });
  },

  removeFromCart(lineId: string) {
    setState((prev) => ({
      ...prev,
      cart: prev.cart.filter((item) => item.id !== lineId),
    }));
  },

  updateCartQuantity(lineId: string, quantity: number) {
    if (quantity <= 0) {
      this.removeFromCart(lineId);
      return;
    }
    setState((prev) => ({
      ...prev,
      cart: prev.cart.map((item) =>
        item.id === lineId
          ? {
              ...item,
              quantity,
            }
          : item,
      ),
    }));
  },

  clearCart() {
    setState((prev) => ({
      ...prev,
      cart: [],
    }));
  },

  // -------------------------
  // Checkout / orders
  // -------------------------

  checkout(): Order | null {
    const detailed = this.getCartDetailed();
    if (detailed.length === 0) return null;

    const subtotalINR = detailed.reduce(
      (sum, line) => sum + line.lineTotalINR,
      0,
    );
    const taxesINR = Math.round(subtotalINR * 0.12); // 12% mock GST
    const totalINR = subtotalINR + taxesINR;

    const newOrder: Order = {
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      status: "processing",
      subtotalINR,
      taxesINR,
      totalINR,
      items: detailed.map((line) => ({
        productId: line.product.id,
        productName: line.product.name,
        heroImage: line.product.heroImage,
        priceINR: line.product.priceINR,
        size: line.size,
        quantity: line.quantity,
      })),
    };

    setState((prev) => ({
      ...prev,
      cart: [],
      orders: [newOrder, ...prev.orders],
      lastOrderId: newOrder.id,
    }));

    return newOrder;
  },

  // -------------------------
  // Profile / preferences
  // -------------------------

  updateProfile(partial: Partial<Profile>) {
    setState((prev) => ({
      ...prev,
      profile: {
        ...prev.profile,
        ...partial,
      },
    }));
  },

  // -------------------------
  // Demo helpers
  // -------------------------

  reset() {
    return resetDemoState();
  },
};

// Default export for ergonomics
export default mockStore;