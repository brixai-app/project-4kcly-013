import { create } from 'zustand';
import { safeStorage } from '@/lib/utils';

/** All commerce, product provenance, personas and reviews in this MVP are fictional demos. */
export const DEMO_NOTICE = 'Browser-only demonstration. Products, artisan personas and reviews are illustrative; orders and payments are simulated. No payment details are collected.';
export const STORAGE_KEY = 'jootiya:store';
export const STORAGE_VERSION = 1;
export const MAX_CART_QUANTITY = 8;
export const SHIPPING_FEE = 150;
export const FREE_SHIPPING_THRESHOLD = 5000;
export const SIZES = [35, 36, 37, 38, 39, 40, 41, 42, 43, 44] as const;
export type ShoeSize = (typeof SIZES)[number];
export type CategoryId = 'everyday' | 'occasion' | 'heritage';
export type Material = 'Leather' | 'Silk' | 'Velvet' | 'Cotton';
export type SortOption = 'featured' | 'price-asc' | 'price-desc' | 'newest' | 'rating';
export type PaymentMethod = 'demo-upi' | 'demo-card' | 'demo-cod';
export type StorageStatus = 'available' | 'memory-only';
export interface ProductImage { id: string; src: string; alt: string; fallback: string; }
export interface ProductVariant { size: ShoeSize; stock: number; }
export interface Category { id: CategoryId; name: string; description: string; image: ProductImage; }
export interface Artisan { id: string; name: string; location: string; specialty: string; story: string; isDemo: true; }
export interface Product {
  id: string; slug: string; name: string; subtitle: string; description: string;
  price: number; currency: 'INR'; category: CategoryId; material: Material;
  materials: string[]; color: string; craft: string; origin: 'Jodhpur, Rajasthan';
  artisanId: string; images: ProductImage[]; variants: ProductVariant[];
  featured: boolean; featuredOrder: number; isNew: boolean; createdAt: string;
  care: string[]; fit: string; isDemo: true;
}
export interface Review { id: string; productId: string; name: string; rating: number; title: string; text: string; createdAt: string; source: 'seed' | 'visitor'; isDemo: true; }
export interface MockUser { id: string; name: string; email: string; isDemo: true; }
export interface Address { fullName: string; line1: string; line2: string; city: string; state: string; postalCode: string; country: 'India'; phone: string; }
export interface CheckoutDraft { email: string; address: Address; paymentMethod: PaymentMethod; acceptedDemo: boolean; }
export interface CartLine { id: string; productId: string; size: ShoeSize; quantity: number; }
export interface EnrichedCartLine extends CartLine { product: Product; unitPrice: number; lineTotal: number; availableStock: number; }
export interface CartTotals { itemCount: number; subtotal: number; shipping: number; total: number; freeShippingRemaining: number; currency: 'INR'; }
export interface OrderItem { productId: string; name: string; size: ShoeSize; quantity: number; unitPrice: number; lineTotal: number; image: ProductImage; }
/** Personal checkout details are deliberately absent from persisted orders. */
export interface Order { id: string; reference: string; checkoutKey: string; createdAt: string; items: OrderItem[]; totals: CartTotals; status: 'simulated'; paymentMethod: PaymentMethod; isDemo: true; }
export interface CatalogFilters { search: string; category: CategoryId | 'all'; sizes: ShoeSize[]; materials: Material[]; minPrice: number; maxPrice: number; inStockOnly: boolean; sort: SortOption; }
export type CheckoutErrors = Partial<Record<'email' | 'fullName' | 'line1' | 'city' | 'state' | 'postalCode' | 'phone' | 'country' | 'paymentMethod' | 'acceptedDemo' | 'cart', string>>;
export interface ActionResult { ok: boolean; message: string; }
export interface OrderResult extends ActionResult { order?: Order; errors?: CheckoutErrors; }
export interface ReviewInput { productId: string; name: string; rating: number; title?: string; text: string; }
export interface StoreState {
  products: Product[]; cart: CartLine[]; reviews: Review[]; profile: MockUser; orders: Order[];
  cartOpen: boolean; checkoutDraft: CheckoutDraft; checkoutKey: string; lastOrderId: string | null;
  isPlacingOrder: boolean; storageStatus: StorageStatus; hydrated: boolean;
  addToCart: (productId: string, size: number, quantity?: number) => ActionResult;
  updateQuantity: (lineId: string, quantity: number) => ActionResult;
  removeFromCart: (lineId: string) => void; clearCart: () => void;
  setCartOpen: (open: boolean) => void; openCart: () => void; closeCart: () => void;
  submitReview: (input: ReviewInput) => ActionResult;
  updateProfile: (name: string) => ActionResult;
  updateCheckoutDraft: (patch: Partial<Omit<CheckoutDraft, 'address'>> & { address?: Partial<Address> }) => void;
  resetCheckoutDraft: () => void;
  placeOrder: (draft?: CheckoutDraft, checkoutKey?: string) => OrderResult;
  beginCheckout: () => string;
  getProduct: (idOrSlug: string) => Product | undefined;
  getCartLines: () => EnrichedCartLine[]; getCartTotals: () => CartTotals;
}

const uid = (prefix: string): string => `${prefix}-${typeof globalThis.crypto?.randomUUID === 'function' ? globalThis.crypto.randomUUID() : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 11)}`}`;
const record = (value: unknown): value is Record<string, unknown> => typeof value === 'object' && value !== null && !Array.isArray(value);
const boundedText = (value: unknown, max: number): string => typeof value === 'string' ? value.trim().slice(0, max) : '';
export const isValidSize = (value: number): value is ShoeSize => (SIZES as readonly number[]).includes(value);
export const cartLineId = (productId: string, size: number): string => `${productId}:${size}`;
export const formatCurrency = (amount: number): string => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(Number.isFinite(amount) ? amount : 0);
export const formatPrice = formatCurrency;
export const formatDate = (value: string): string => Number.isNaN(Date.parse(value)) ? '' : new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(value));

/** Self-contained Mojri illustration, shown when editorial reference photography is unavailable. */
function mojriIllustration(base: string, stitch: string): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="1250" viewBox="0 0 1000 1250"><rect width="1000" height="1250" fill="#eee7dd"/><ellipse cx="510" cy="1050" rx="330" ry="52" fill="#39281d" opacity=".09"/><g transform="rotate(-23 500 625)"><path d="M353 1000C275 865 295 575 369 360C409 244 490 163 585 130C561 194 604 223 628 299C705 530 695 862 613 1000C551 1083 421 1083 353 1000Z" fill="${base}" stroke="#6c4934" stroke-width="9"/><path d="M369 983C307 823 334 610 394 462C449 524 556 524 611 462C672 653 663 856 600 983C541 1038 430 1040 369 983Z" fill="#c9a175" stroke="${stitch}" stroke-width="10"/><path d="M395 462C423 399 565 399 611 462M367 375Q484 302 621 367M386 307Q485 250 601 310M417 238Q489 213 567 252" fill="none" stroke="${stitch}" stroke-width="7" stroke-dasharray="8 9"/><path d="M383 421Q500 347 626 420" fill="none" stroke="${stitch}" stroke-width="6"/><path d="M400 969Q495 1014 586 964" fill="none" stroke="#795840" stroke-width="4" stroke-dasharray="6 8"/></g><text x="500" y="1185" text-anchor="middle" fill="#756452" font-family="Georgia,serif" font-size="23" letter-spacing="5">JOOTIYA · MOJRI STUDY</text></svg>`;
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}
const image = (id: string, name: string, base: string, stitch: string, file: string): ProductImage => ({
  id, src: `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(file)}`,
  alt: `${name}: traditional curved-toe Mojri footwear craft reference; illustrative demo, not a photograph of an actual listed item`,
  fallback: mojriIllustration(base, stitch),
});
export const artisans: Artisan[] = [
  { id: 'artisan-salim', name: 'Salim Khan', location: 'Jodhpur, Rajasthan', specialty: 'Hand-cut leather and aari embroidery', story: 'An illustrative portrait of the Jodhpur karkhana: leather is cut by hand, softened and stitched before an embroidered upper meets its sole. This fictional artisan persona celebrates the region’s living craft without claiming a real partnership.', isDemo: true },
  { id: 'artisan-meera', name: 'Meera Devi', location: 'Jodhpur, Rajasthan', specialty: 'Threadwork and ceremonial embellishment', story: 'This fictional studio persona represents the patient rhythm of needlework: a motif drawn, a thread selected, and a pattern built one stitch at a time. No real artisan endorsement is implied.', isDemo: true },
];
const care = ['Keep dry; avoid rain and prolonged direct sunlight.', 'Brush gently with a soft, dry cloth. Do not machine wash.', 'Air after wearing and store in a breathable cotton bag.'];
function makeProduct(id: string, name: string, subtitle: string, category: CategoryId, material: Material, price: number, color: string, base: string, stitch: string, rank: number): Product {
  return {
    id, slug: id, name, subtitle, category, material, price, currency: 'INR', color,
    description: `${name} is an imagined Jodhpur-made Rajasthani Mojri, shaped around a gently lifted toe and a supple leather sole. ${subtitle}. Small variations in hand stitching are part of the craft language, not something to erase. This is a demo listing, not an available physical product.`,
    materials: [material === 'Leather' ? 'Leather upper' : `${material} textile upper`, 'Leather sole', 'Cotton lining', 'Hand-worked decorative stitching'],
    craft: category === 'occasion' ? 'Aari-inspired embroidery · hand-stitched sole' : 'Hand-cut upper · traditional turned toe',
    origin: 'Jodhpur, Rajasthan', artisanId: category === 'occasion' ? 'artisan-meera' : 'artisan-salim',
    images: [image(`${id}-front`, name, base, stitch, 'Mojari.jpg'), image(`${id}-detail`, `${name} craft detail`, base, stitch, 'Jutti.jpg')],
    variants: SIZES.map((size, index) => ({ size, stock: (index + rank) % 7 === 0 ? 0 : 3 + ((index + rank) % 6) })),
    featured: rank <= 4, featuredOrder: rank, isNew: rank === 2 || rank === 5,
    createdAt: `2026-0${Math.min(rank, 8)}-01T00:00:00.000Z`,
    care: [...care], fit: 'EU sizing. Choose your usual closed-shoe size; if between sizes, choose the larger size. Leather softens with wear.', isDemo: true,
  };
}
export const products: Product[] = [
  makeProduct('gulabi-aari', 'Gulabi Aari', 'Rose silk, a quiet flourish of gold thread', 'occasion', 'Silk', 4250, 'Dusty rose', '#a56a6a', '#dfbd7d', 1),
  makeProduct('marwar-classic', 'Marwar Classic', 'Unadorned leather, unmistakably Marwar', 'everyday', 'Leather', 2850, 'Saddle tan', '#a46e41', '#e4c791', 2),
  makeProduct('neel-mahal', 'Neel Mahal', 'Midnight velvet with fine zari-inspired detail', 'occasion', 'Velvet', 4950, 'Midnight indigo', '#343b4b', '#d8b77a', 3),
  makeProduct('sandstone-jali', 'Sandstone Jali', 'Architectural threadwork in warm ivory', 'heritage', 'Cotton', 3650, 'Warm ivory', '#d5c7ab', '#9d774d', 4),
  makeProduct('kesariya', 'Kesariya', 'Saffron silk with a hand-worked border', 'occasion', 'Silk', 4450, 'Saffron', '#bd793d', '#efd5a0', 5),
  makeProduct('raita-rekha', 'Rait Rekha', 'Desert-toned leather and running stitches', 'everyday', 'Leather', 2650, 'Desert sand', '#b39470', '#eee0c5', 6),
  makeProduct('mehrangarh', 'Mehrangarh', 'Oxblood leather with a sculpted heritage toe', 'heritage', 'Leather', 3950, 'Oxblood', '#703b38', '#d4b278', 7),
  makeProduct('moti-bagh', 'Moti Bagh', 'Ivory cotton with pearl-toned embroidered motifs', 'heritage', 'Cotton', 3850, 'Pearl ivory', '#d9cbb4', '#a78656', 8),
];
export const categories: Category[] = [
  { id: 'everyday', name: 'The Everyday Edit', description: 'Easy leather Mojris, made for unhurried days.', image: products[1].images[0] },
  { id: 'occasion', name: 'A Sense of Occasion', description: 'Silk, velvet and considered embellishment.', image: products[0].images[0] },
  { id: 'heritage', name: 'The Heritage Collection', description: 'Traditional silhouettes, a contemporary eye.', image: products[3].images[0] },
];
export const materials: Material[] = ['Leather', 'Silk', 'Velvet', 'Cotton'];
export const editorial = {
  eyebrow: 'Jodhpur, Rajasthan · A demo craft journal', title: 'Rooted in craft.\nMade for your story.',
  description: 'An editorial exploration of the Rajasthani Mojri. Discover sculpted toes, patient stitchwork and the enduring warmth of Jodhpur.',
  heroImage: products[0].images[0], artisanImage: products[3].images[1],
  artisanTitle: 'Many stitches. One living tradition.',
  artisanDescription: 'A celebration of Jodhpur’s Mojri-making vocabulary: hand-cut leather, embroidered uppers and the distinctive upturned toe. Our products and artisan portraits are fictional; the respect for the craft is real.',
  photographyNotice: 'Reference photography may depict related traditional footwear, not the fictional products. Illustrated Mojri studies appear if a reference image cannot load.',
};
export const mockUser: MockUser = { id: 'demo-guest', name: 'Demo Guest', email: 'guest@example.com', isDemo: true };
export const seedReviews: Review[] = products.flatMap((product, index) => [
  { id: `demo-review-${product.id}-1`, productId: product.id, name: ['Aditi S.', 'Kabir R.', 'Ananya M.', 'Rhea D.'][index % 4], rating: index % 3 === 0 ? 4 : 5, title: 'A thoughtful craft detail', text: 'Demo review: the traditional silhouette and considered threadwork are what drew me to this design. This is illustrative feedback, not a verified purchase.', createdAt: '2026-08-12T10:00:00.000Z', source: 'seed', isDemo: true },
  { id: `demo-review-${product.id}-2`, productId: product.id, name: 'Dev P.', rating: 4, title: 'Understated and distinctive', text: 'Demo review: a lovely imagined pairing with relaxed linen and festive clothing. No physical product was purchased or tested.', createdAt: '2026-08-18T12:00:00.000Z', source: 'seed', isDemo: true },
]);
export const DEFAULT_FILTERS: CatalogFilters = { search: '', category: 'all', sizes: [], materials: [], minPrice: 0, maxPrice: 10000, inStockOnly: false, sort: 'featured' };
export const emptyCheckoutDraft = (): CheckoutDraft => ({ email: '', address: { fullName: '', line1: '', line2: '', city: '', state: '', postalCode: '', country: 'India', phone: '' }, paymentMethod: 'demo-upi', acceptedDemo: false });
export const getProductById = (idOrSlug: string, collection: Product[] = products): Product | undefined => collection.find(p => p.id === idOrSlug || p.slug === idOrSlug);
export const getArtisan = (id: string): Artisan | undefined => artisans.find(a => a.id === id);
export const getStock = (product: Product, size: number): number => product.variants.find(v => v.size === size)?.stock ?? 0;
export const getProductReviews = (productId: string, reviews: Review[] = seedReviews): Review[] => reviews.filter(r => r.productId === productId).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
export function getReviewSummary(productId: string, reviews: Review[] = seedReviews): { count: number; average: number; distribution: Record<number, number> } {
  const entries = reviews.filter(r => r.productId === productId);
  const distribution: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  entries.forEach(r => { distribution[r.rating] += 1; });
  return { count: entries.length, average: entries.length ? entries.reduce((sum, r) => sum + r.rating, 0) / entries.length : 0, distribution };
}
export function filterProducts(collection: Product[], filters: Partial<CatalogFilters> = {}, reviews: Review[] = seedReviews): Product[] {
  const f = { ...DEFAULT_FILTERS, ...filters };
  const search = f.search.trim().toLocaleLowerCase('en-IN');
  return collection.filter(p => (!search || `${p.name} ${p.subtitle} ${p.material} ${p.color} ${p.craft}`.toLocaleLowerCase('en-IN').includes(search))
    && (f.category === 'all' || p.category === f.category)
    && (!f.materials.length || f.materials.includes(p.material))
    && p.price >= f.minPrice && p.price <= f.maxPrice
    && (!f.sizes.length || p.variants.some(v => f.sizes.includes(v.size) && v.stock > 0))
    && (!f.inStockOnly || p.variants.some(v => v.stock > 0)))
    .sort((a, b) => {
      const difference = f.sort === 'price-asc' ? a.price - b.price : f.sort === 'price-desc' ? b.price - a.price : f.sort === 'newest' ? b.createdAt.localeCompare(a.createdAt) : f.sort === 'rating' ? getReviewSummary(b.id, reviews).average - getReviewSummary(a.id, reviews).average : a.featuredOrder - b.featuredOrder;
      return difference || a.id.localeCompare(b.id);
    });
}
export function filtersFromSearchParams(params: URLSearchParams): CatalogFilters {
  const category = params.get('category');
  const sorts: SortOption[] = ['featured', 'price-asc', 'price-desc', 'newest', 'rating'];
  const price = (key: string, fallback: number) => { const raw = params.get(key); const value = raw === null || raw === '' ? fallback : Number(raw); return Number.isFinite(value) ? Math.max(0, Math.min(100000, value)) : fallback; };
  const minPrice = price('min', 0);
  return { search: (params.get('search') ?? '').slice(0, 160), category: categories.some(c => c.id === category) ? category as CategoryId : 'all', sizes: [...new Set((params.get('sizes') ?? '').split(',').map(Number).filter(isValidSize))], materials: [...new Set((params.get('materials') ?? '').split(',').filter((m): m is Material => materials.includes(m as Material)))], minPrice, maxPrice: Math.max(minPrice, price('max', 10000)), inStockOnly: params.get('stock') === '1', sort: sorts.includes(params.get('sort') as SortOption) ? params.get('sort') as SortOption : 'featured' };
}
export function filtersToSearchParams(filters: CatalogFilters): URLSearchParams {
  const p = new URLSearchParams();
  if (filters.search) p.set('search', filters.search);
  if (filters.category !== 'all') p.set('category', filters.category);
  if (filters.sizes.length) p.set('sizes', filters.sizes.join(','));
  if (filters.materials.length) p.set('materials', filters.materials.join(','));
  if (filters.minPrice !== 0) p.set('min', String(filters.minPrice));
  if (filters.maxPrice !== 10000) p.set('max', String(filters.maxPrice));
  if (filters.inStockOnly) p.set('stock', '1');
  if (filters.sort !== 'featured') p.set('sort', filters.sort);
  return p;
}
export function getCartLines(cart: CartLine[], collection: Product[]): EnrichedCartLine[] {
  return cart.flatMap(line => { const product = getProductById(line.productId, collection); return product ? [{ ...line, product, unitPrice: product.price, lineTotal: product.price * line.quantity, availableStock: getStock(product, line.size) }] : []; });
}
export function calculateTotals(lines: Array<{ quantity: number; lineTotal: number }>): CartTotals {
  const subtotal = lines.reduce((sum, line) => sum + line.lineTotal, 0);
  const shipping = subtotal > 0 && subtotal < FREE_SHIPPING_THRESHOLD ? SHIPPING_FEE : 0;
  return { itemCount: lines.reduce((sum, line) => sum + line.quantity, 0), subtotal, shipping, total: subtotal + shipping, freeShippingRemaining: Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal), currency: 'INR' };
}
export const getCartTotals = (cart: CartLine[], collection: Product[]): CartTotals => calculateTotals(getCartLines(cart, collection));
export function validateCheckout(draft: CheckoutDraft): CheckoutErrors {
  const errors: CheckoutErrors = {};
  const a = draft.address;
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(draft.email.trim()) || draft.email.length > 254) errors.email = 'Enter a valid email address.';
  if (a.fullName.trim().length < 2 || a.fullName.length > 100) errors.fullName = 'Enter your full name (2–100 characters).';
  if (a.line1.trim().length < 5 || a.line1.length > 200 || a.line2.length > 200) errors.line1 = 'Enter a street address (5–200 characters per line).';
  if (a.city.trim().length < 2 || a.city.length > 80) errors.city = 'Enter a valid city.';
  if (a.state.trim().length < 2 || a.state.length > 80) errors.state = 'Enter a valid Indian state or union territory.';
  if (!/^[1-9]\d{5}$/.test(a.postalCode.trim())) errors.postalCode = 'Enter a six-digit Indian PIN code.';
  if (!/^(?:\+91|91)?[6-9]\d{9}$/.test(a.phone.replace(/[\s()-]/g, ''))) errors.phone = 'Enter a valid Indian mobile number.';
  if (a.country !== 'India') errors.country = 'This demo supports Indian addresses only.';
  if (!['demo-upi', 'demo-card', 'demo-cod'].includes(draft.paymentMethod)) errors.paymentMethod = 'Choose a simulated payment method.';
  if (draft.acceptedDemo !== true) errors.acceptedDemo = 'Please acknowledge that this is a simulated order.';
  return errors;
}

/* The adapter supports either JSON-oriented get/set or Storage-style getItem/setItem utilities.
   The supplied domain-agnostic safeStorage remains the only persistence transport. */
interface StorageBridge { get?: (key: string, fallback?: unknown) => unknown; set?: (key: string, value: unknown) => unknown; getItem?: (key: string) => unknown; setItem?: (key: string, value: string) => unknown; }
const storage = safeStorage as unknown as StorageBridge;
let storageStatus: StorageStatus = 'available';
let memorySnapshot: unknown = null;
function readSnapshot(): unknown {
  try {
    const value = typeof storage.get === 'function' ? storage.get(STORAGE_KEY, null) : typeof storage.getItem === 'function' ? storage.getItem(STORAGE_KEY) : undefined;
    if (value === undefined) storageStatus = 'memory-only';
    if (typeof value === 'string') return JSON.parse(value) as unknown;
    return value ?? memorySnapshot;
  } catch { storageStatus = 'memory-only'; return memorySnapshot; }
}
interface PersistedState { version: number; cart: CartLine[]; reviews: Review[]; profile: MockUser; orders: Order[]; }
function persist(state: Pick<StoreState, 'cart' | 'reviews' | 'profile' | 'orders'>): StorageStatus {
  const snapshot: PersistedState = { version: STORAGE_VERSION, cart: state.cart, reviews: state.reviews.filter(r => r.source === 'visitor'), profile: state.profile, orders: state.orders };
  memorySnapshot = snapshot;
  try {
    const result = typeof storage.set === 'function' ? storage.set(STORAGE_KEY, snapshot) : typeof storage.setItem === 'function' ? storage.setItem(STORAGE_KEY, JSON.stringify(snapshot)) : false;
    storageStatus = result === false ? 'memory-only' : 'available';
  } catch { storageStatus = 'memory-only'; }
  return storageStatus;
}
function cloneProducts(): Product[] { return products.map(p => ({ ...p, variants: p.variants.map(v => ({ ...v })) })); }
function validateCart(raw: unknown, collection: Product[]): CartLine[] {
  if (!Array.isArray(raw)) return [];
  const grouped = new Map<string, CartLine>();
  for (const entry of raw.slice(0, 1000)) {
    if (!record(entry) || typeof entry.productId !== 'string' || typeof entry.size !== 'number' || !isValidSize(entry.size) || typeof entry.quantity !== 'number' || !Number.isInteger(entry.quantity) || entry.quantity < 1) continue;
    const product = getProductById(entry.productId, collection);
    if (!product) continue;
    const id = cartLineId(product.id, entry.size);
    const quantity = Math.min(MAX_CART_QUANTITY, getStock(product, entry.size), entry.quantity + (grouped.get(id)?.quantity ?? 0));
    if (quantity > 0) grouped.set(id, { id, productId: product.id, size: entry.size, quantity });
  }
  return [...grouped.values()];
}
function hydrate(): Pick<StoreState, 'products' | 'cart' | 'reviews' | 'profile' | 'orders'> {
  const collection = cloneProducts();
  const defaults = { products: collection, cart: [] as CartLine[], reviews: [...seedReviews], profile: { ...mockUser }, orders: [] as Order[] };
  const raw = readSnapshot();
  if (!record(raw) || raw.version !== STORAGE_VERSION) return defaults;
  const orders: Order[] = [];
  const seen = new Set<string>();
  if (Array.isArray(raw.orders)) for (const candidate of raw.orders) {
    if (!record(candidate) || typeof candidate.id !== 'string' || candidate.id.length > 120 || typeof candidate.checkoutKey !== 'string' || candidate.checkoutKey.length > 120 || seen.has(candidate.checkoutKey) || seen.has(candidate.id) || typeof candidate.createdAt !== 'string' || Number.isNaN(Date.parse(candidate.createdAt)) || !Array.isArray(candidate.items) || !candidate.items.length || candidate.items.length > 80 || !['demo-upi', 'demo-card', 'demo-cod'].includes(String(candidate.paymentMethod))) continue;
    const items: OrderItem[] = [];
    const reserved = new Map<string, number>();
    let valid = true;
    for (const entry of candidate.items) {
      if (!record(entry) || typeof entry.productId !== 'string' || typeof entry.size !== 'number' || !isValidSize(entry.size) || typeof entry.quantity !== 'number' || !Number.isInteger(entry.quantity) || entry.quantity < 1 || entry.quantity > MAX_CART_QUANTITY) { valid = false; break; }
      const product = getProductById(entry.productId, collection);
      const key = cartLineId(entry.productId, entry.size);
      if (!product || reserved.has(key) || entry.quantity > getStock(product, entry.size)) { valid = false; break; }
      reserved.set(key, entry.quantity);
      items.push({ productId: product.id, name: product.name, size: entry.size, quantity: entry.quantity, unitPrice: product.price, lineTotal: product.price * entry.quantity, image: product.images[0] });
    }
    if (!valid) continue;
    for (const item of items) {
      const variant = collection.find(p => p.id === item.productId)?.variants.find(v => v.size === item.size);
      if (variant) variant.stock -= item.quantity;
    }
    seen.add(candidate.checkoutKey); seen.add(candidate.id);
    orders.push({ id: candidate.id, reference: `JT-${candidate.id.replace(/[^a-z0-9]/gi, '').slice(-10).toUpperCase()}`, checkoutKey: candidate.checkoutKey, createdAt: candidate.createdAt, items, totals: calculateTotals(items), status: 'simulated', paymentMethod: candidate.paymentMethod as PaymentMethod, isDemo: true });
  }
  const reviews = [...seedReviews];
  const reviewIds = new Set(reviews.map(r => r.id));
  if (Array.isArray(raw.reviews)) for (const entry of raw.reviews.slice(-500)) {
    if (!record(entry) || typeof entry.id !== 'string' || entry.id.length > 120 || reviewIds.has(entry.id) || typeof entry.productId !== 'string' || !getProductById(entry.productId) || typeof entry.rating !== 'number' || !Number.isInteger(entry.rating) || entry.rating < 1 || entry.rating > 5 || typeof entry.createdAt !== 'string' || Number.isNaN(Date.parse(entry.createdAt))) continue;
    const name = boundedText(entry.name, 60); const text = boundedText(entry.text, 1500);
    if (name.length < 2 || text.length < 10) continue;
    reviewIds.add(entry.id);
    reviews.push({ id: entry.id, productId: entry.productId, name, text, title: boundedText(entry.title, 100), rating: entry.rating, createdAt: entry.createdAt, source: 'visitor', isDemo: true });
  }
  const name = record(raw.profile) ? boundedText(raw.profile.name, 60) : '';
  return { products: collection, cart: validateCart(raw.cart, collection), reviews, profile: { ...mockUser, name: name.length >= 2 ? name : mockUser.name }, orders };
}
const initial = hydrate();

/** Use atomic Zustand selectors in components; derive filtered arrays with useMemo. */
export const useStore = create<StoreState>((set, get) => {
  const commit = (patch: Partial<StoreState>): void => {
    const next = { ...get(), ...patch };
    const status = persist(next);
    set({ ...patch, storageStatus: status });
  };
  return {
    ...initial, cartOpen: false, checkoutDraft: emptyCheckoutDraft(), checkoutKey: uid('checkout'),
    lastOrderId: null, isPlacingOrder: false, storageStatus, hydrated: true,
    getProduct: id => getProductById(id, get().products),
    getCartLines: () => getCartLines(get().cart, get().products),
    getCartTotals: () => getCartTotals(get().cart, get().products),
    setCartOpen: open => set({ cartOpen: open }), openCart: () => set({ cartOpen: true }), closeCart: () => set({ cartOpen: false }),
    addToCart: (productId, size, quantity = 1) => {
      const state = get(); const product = getProductById(productId, state.products);
      if (!product) return { ok: false, message: 'This Mojri could not be found.' };
      if (!isValidSize(size)) return { ok: false, message: 'Choose an available EU size.' };
      if (!Number.isInteger(quantity) || quantity < 1) return { ok: false, message: 'Choose a positive whole-number quantity.' };
      const id = cartLineId(product.id, size); const existing = state.cart.find(l => l.id === id);
      const nextQuantity = (existing?.quantity ?? 0) + quantity;
      const limit = Math.min(MAX_CART_QUANTITY, getStock(product, size));
      if (nextQuantity > limit) return { ok: false, message: limit === 0 ? 'This size is currently out of demo stock.' : `You can add up to ${limit} pairs in this size.` };
      const cart = existing ? state.cart.map(l => l.id === id ? { ...l, quantity: nextQuantity } : l) : [...state.cart, { id, productId: product.id, size, quantity }];
      commit({ cart, checkoutKey: uid('checkout'), lastOrderId: null });
      return { ok: true, message: `${product.name}, EU ${size}, added to your bag. Demo purchase only.` };
    },
    updateQuantity: (lineId, quantity) => {
      if (!Number.isInteger(quantity) || quantity < 0) return { ok: false, message: 'Use a whole-number quantity.' };
      const state = get(); const line = state.cart.find(l => l.id === lineId);
      if (!line) return { ok: false, message: 'This item is no longer in your bag.' };
      if (quantity === 0) { get().removeFromCart(lineId); return { ok: true, message: 'Item removed.' }; }
      const product = getProductById(line.productId, state.products);
      const limit = product ? Math.min(MAX_CART_QUANTITY, getStock(product, line.size)) : 0;
      if (quantity > limit) return { ok: false, message: `Only ${limit} pairs are available in this size (maximum ${MAX_CART_QUANTITY} per bag line).` };
      if (quantity !== line.quantity) commit({ cart: state.cart.map(l => l.id === lineId ? { ...l, quantity } : l), checkoutKey: uid('checkout'), lastOrderId: null });
      return { ok: true, message: 'Bag updated.' };
    },
    removeFromCart: lineId => { if (get().cart.some(l => l.id === lineId)) commit({ cart: get().cart.filter(l => l.id !== lineId), checkoutKey: uid('checkout'), lastOrderId: null }); },
    clearCart: () => commit({ cart: [], checkoutKey: uid('checkout'), lastOrderId: null }),
    submitReview: input => {
      const name = input.name.trim(); const text = input.text.trim(); const title = (input.title ?? '').trim();
      if (!getProductById(input.productId, get().products)) return { ok: false, message: 'Product not found.' };
      if (name.length < 2 || name.length > 60) return { ok: false, message: 'Enter a name between 2 and 60 characters.' };
      if (!Number.isInteger(input.rating) || input.rating < 1 || input.rating > 5) return { ok: false, message: 'Choose a rating from 1 to 5.' };
      if (text.length < 10 || text.length > 1500 || title.length > 100) return { ok: false, message: 'Use 10–1,500 characters for your review and at most 100 for the title.' };
      const visitors = get().reviews.filter(r => r.source === 'visitor');
      if (visitors.length >= 500) return { ok: false, message: 'This browser’s demo review limit has been reached.' };
      if (visitors.some(r => r.productId === input.productId && r.name.toLowerCase() === name.toLowerCase() && r.text === text)) return { ok: false, message: 'This review has already been saved.' };
      const review: Review = { id: uid('review'), productId: input.productId, name, rating: input.rating, title, text, createdAt: new Date().toISOString(), source: 'visitor', isDemo: true };
      commit({ reviews: [...get().reviews, review] });
      return { ok: true, message: 'Demo review saved in this browser. It is not a verified purchase.' };
    },
    updateProfile: name => {
      const clean = name.trim();
      if (clean.length < 2 || clean.length > 60) return { ok: false, message: 'Use a display name between 2 and 60 characters.' };
      commit({ profile: { ...mockUser, name: clean } });
      return { ok: true, message: 'Demo display name saved.' };
    },
    updateCheckoutDraft: patch => set(state => ({ checkoutDraft: { ...state.checkoutDraft, ...patch, address: { ...state.checkoutDraft.address, ...patch.address } } })),
    resetCheckoutDraft: () => set({ checkoutDraft: emptyCheckoutDraft() }),
    beginCheckout: () => {
      if (get().orders.some(o => o.checkoutKey === get().checkoutKey) && get().cart.length) set({ checkoutKey: uid('checkout'), lastOrderId: null });
      return get().checkoutKey;
    },
    placeOrder: (providedDraft, providedKey) => {
      const state = get(); const key = providedKey ?? state.checkoutKey;
      const existing = state.orders.find(o => o.checkoutKey === key);
      if (existing) return { ok: true, message: 'This simulated order was already placed. No duplicate was created.', order: existing };
      if (key !== state.checkoutKey) return { ok: false, message: 'Your bag changed. Review it and submit again.' };
      if (state.isPlacingOrder) return { ok: false, message: 'Your simulated order is being placed.' };
      const draft = providedDraft ?? state.checkoutDraft;
      const errors = validateCheckout(draft);
      if (!state.cart.length) errors.cart = 'Your bag is empty.';
      const lines = getCartLines(state.cart, state.products);
      if (lines.length !== state.cart.length || lines.some(l => l.quantity < 1 || l.quantity > MAX_CART_QUANTITY || l.quantity > l.availableStock)) errors.cart = 'Some quantities are no longer available. Please review your bag.';
      if (Object.keys(errors).length) return { ok: false, message: 'Please check the highlighted checkout details.', errors };
      set({ isPlacingOrder: true });
      try {
        const id = uid('order');
        const items: OrderItem[] = lines.map(l => ({ productId: l.product.id, name: l.product.name, size: l.size, quantity: l.quantity, unitPrice: l.unitPrice, lineTotal: l.lineTotal, image: { ...l.product.images[0] } }));
        const order: Order = { id, reference: `JT-${id.replace(/[^a-z0-9]/gi, '').slice(-10).toUpperCase()}`, checkoutKey: key, createdAt: new Date().toISOString(), items, totals: calculateTotals(items), status: 'simulated', paymentMethod: draft.paymentMethod, isDemo: true };
        const updatedProducts = state.products.map(p => ({ ...p, variants: p.variants.map(v => ({ ...v, stock: v.stock - (items.find(i => i.productId === p.id && i.size === v.size)?.quantity ?? 0) })) }));
        // One state commit updates stock, records the order and empties the bag together.
        // Address/contact data never reaches persistence or the order snapshot.
        commit({ products: updatedProducts, orders: [...state.orders, order], cart: [], cartOpen: false, lastOrderId: order.id, checkoutDraft: emptyCheckoutDraft(), isPlacingOrder: false });
        return { ok: true, message: get().storageStatus === 'memory-only' ? 'Simulated order placed. Browser storage is unavailable; keep this page open to retain it. No payment was taken.' : 'Simulated order placed and saved in this browser. No payment was taken.', order };
      } catch {
        set({ isPlacingOrder: false });
        return { ok: false, message: 'The demo order could not be completed. Your bag has been retained; please try again.' };
      }
    },
  };
});

export const useJootiyaStore = useStore;
export const selectCartCount = (state: StoreState): number => state.cart.reduce((sum, line) => sum + line.quantity, 0);
export const selectCartOpen = (state: StoreState): boolean => state.cartOpen;
export const selectCartTotals = (state: StoreState): CartTotals => getCartTotals(state.cart, state.products);
export const selectCartLines = (state: StoreState): EnrichedCartLine[] => getCartLines(state.cart, state.products);
export const selectFeaturedProducts = (state: StoreState): Product[] => state.products.filter(p => p.featured).sort((a, b) => a.featuredOrder - b.featuredOrder);
export const selectLastOrder = (state: StoreState): Order | undefined => state.orders.find(order => order.id === state.lastOrderId);
export const selectCatalog = (state: StoreState, filters: Partial<CatalogFilters>): Product[] => filterProducts(state.products, filters, state.reviews);
export const getRelatedProducts = (product: Product, collection: Product[] = products, limit = 3): Product[] => collection.filter(p => p.id !== product.id).sort((a, b) => Number(b.category === product.category) - Number(a.category === product.category) || a.featuredOrder - b.featuredOrder).slice(0, Math.max(0, limit));