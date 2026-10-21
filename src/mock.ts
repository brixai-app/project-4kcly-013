import { create } from 'zustand';
import * as utilities from '@/lib/utils';

/** Entirely fictional, browser-only demonstration. No payment or fulfilment occurs. */
export const DEMO_NOTICE = 'Demonstration store: products, artisans and reviews are fictional. No payment is charged and no shipment is initiated.';
export type Size = 35 | 36 | 37 | 38 | 39 | 40 | 41 | 42 | 43 | 44;
export type Color = 'Sand' | 'Burgundy' | 'Ivory' | 'Saffron' | 'Cocoa' | 'Rose';
export type Category = 'Everyday' | 'Celebration' | 'Signature';
export type PaymentMethod = 'demo-card' | 'demo-upi' | 'demo-cod';
export type SortOrder = 'popular' | 'price-asc' | 'price-desc';
export interface ProductImage { src: string; alt: string; caption: string }
export interface Variant { size: Size; stock: number }
export interface Artisan { id: string; name: string; location: string; experience: number; specialty: string; biography: string; image: string; fictional: true }
export interface Product { id: string; slug: string; name: string; color: Color; category: Category; price: number; popularity: number; artisanId: string; description: string; story: string; materials: string[]; care: string[]; fit: string; variants: Variant[]; images: ProductImage[]; featured: boolean; badge: string }
export interface Review { id: string; productId: string; name: string; rating: number; title: string; text: string; date: string; verified: boolean; sample: true }
export interface ShippingAddress { fullName: string; email: string; phone: string; line1: string; line2: string; city: string; state: string; postalCode: string; country: 'India' }
export interface User { id: string; email: string; name: string; shipping: ShippingAddress; updatedAt: string }
export interface CartLine { key: string; productId: string; size: Size; quantity: number }
export interface OrderItem { readonly productId: string; readonly slug: string; readonly name: string; readonly image: string; readonly color: Color; readonly size: Size; readonly quantity: number; readonly unitPrice: number; readonly lineTotal: number; readonly artisanName: string }
export interface Totals { subtotal: number; shipping: number; total: number; units: number }
export interface Order { readonly id: string; readonly idempotencyKey: string; readonly createdAt: string; readonly userId: string; readonly items: readonly OrderItem[]; readonly address: Readonly<ShippingAddress>; readonly totals: Readonly<Totals>; readonly paymentMethod: PaymentMethod; readonly paymentStatus: 'simulated'; readonly status: 'demo-confirmed'; readonly demo: true }
export interface CatalogState { query: string; colors: Color[]; sizes: Size[]; categories: Category[]; artisanId: string; sort: SortOrder; page: number; pageSize: number; view: 'grid' | 'table' }
export type CheckoutErrors = Partial<Record<keyof ShippingAddress | 'paymentMethod' | 'cart' | 'storage', string>>;
export interface CheckoutState { address: ShippingAddress; paymentMethod: PaymentMethod; idempotencyKey: string; errors: CheckoutErrors; submitting: boolean; lastOrderId: string | null }
export interface OverlayState { cart: boolean; command: boolean; mobileNav: boolean; sizeGuide: boolean; lightbox: number | null }
export interface ProductSelection { size: Size | null; quantity: number; image: number; tab: string }
export interface NavigationLink { label: string; path: string }
export interface PersistedState { version: 2; revision: number; products: Product[]; users: User[]; cart: CartLine[]; orders: Order[]; checkout: Pick<CheckoutState, 'address' | 'paymentMethod' | 'idempotencyKey' | 'lastOrderId'> }
export interface AppState extends PersistedState { catalog: CatalogState; overlays: OverlayState; selections: Record<string, ProductSelection>; storageError: string | null; checkout: CheckoutState }
export type Result<T> = { ok: true; value: T } | { ok: false; error: string; errors?: CheckoutErrors };
export interface CatalogResult { items: Product[]; total: number; pages: number; page: number }
export const SIZES: Size[] = [35, 36, 37, 38, 39, 40, 41, 42, 43, 44];
export const COLORS: Color[] = ['Sand', 'Burgundy', 'Ivory', 'Saffron', 'Cocoa', 'Rose'];
export const CATEGORIES: Category[] = ['Everyday', 'Celebration', 'Signature'];
export const NAV_LINKS: NavigationLink[] = [{ label: 'Home', path: '/' }, { label: 'The collection', path: '/catalog' }, { label: 'Our artisans', path: '/artisans' }];
export const ROUTES = { home: '/', catalog: '/catalog', artisans: '/artisans', checkout: '/checkout', product: (slug: string) => `/product/${encodeURIComponent(slug)}` };
export const PAYMENT_METHODS: { id: PaymentMethod; label: string; description: string }[] = [{ id: 'demo-card', label: 'Demo card', description: 'Simulated approval. Never enter card credentials.' }, { id: 'demo-upi', label: 'Demo UPI', description: 'No UPI ID, app or transfer required.' }, { id: 'demo-cod', label: 'Demo cash on delivery', description: 'No delivery or collection will take place.' }];
export const SHIPPING_POLICY = { fee: 14900, freeAbove: 500000, country: 'India', estimate: '5–8 business days in a real store; no shipping in this demo.' } as const;
export const SIZE_GUIDE = SIZES.map((size) => ({ size, footLengthCm: Number((22.3 + (size - 35) * 0.65).toFixed(1)), label: `EU ${size}` }));
const uid = () => globalThis.crypto?.randomUUID?.() ?? `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 11)}`;
const clone = <T,>(value: T): T => JSON.parse(JSON.stringify(value)) as T;
const freeze = <T,>(value: T): T => { if (value && typeof value === 'object' && !Object.isFrozen(value)) { Object.freeze(value); Object.values(value).forEach(freeze); } return value; };
const illustration = (color: string, label: string, scene = false) => `data:image/svg+xml;charset=utf-8,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="1400" height="1600" viewBox="0 0 1400 1600"><rect width="1400" height="1600" fill="#e9dfd0"/><path d="M0 1180Q700 880 1400 1100V1600H0Z" fill="#d5c2a9"/>${scene ? '<path d="M220 1000V480Q700 10 1180 480V1000" fill="#c8ad8d"/><path d="M390 1000V530Q700 230 1010 530V1000" fill="#e9dfd0"/>' : ''}<g transform="translate(280 310) rotate(18 420 480)"><ellipse cx="440" cy="1030" rx="290" ry="55" fill="#70543b" opacity=".12"/><path d="M260 1000Q140 750 240 390Q280 150 480 110Q650 180 665 390L650 830Q640 1040 450 1060Q330 1060 260 1000Z" fill="${color}" stroke="#95714e" stroke-width="10"/><path d="M290 750Q450 550 625 740L620 880Q450 1030 300 880Z" fill="#b69a75"/><path d="M270 540Q440 370 650 530M270 580Q440 410 650 570M280 620Q440 450 640 610" fill="none" stroke="#d5b77a" stroke-width="9" stroke-dasharray="8 13"/><path d="M330 330Q450 210 570 330Q470 470 330 330Z" fill="none" stroke="#d5b77a" stroke-width="12"/></g><text x="70" y="1500" font-family="Georgia,serif" font-size="28" fill="#695343">${label} · JOOTIYA · ILLUSTRATED DEMO</text></svg>`)}`;
const localAssets = import.meta.glob('/src/assets/**/*.{png,jpg,jpeg,webp,avif,svg}', { eager: true, query: '?url', import: 'default' }) as Record<string, string>;
const asset = (pattern: RegExp, fallback: string) => Object.entries(localAssets).sort(([a], [b]) => a.localeCompare(b)).find(([path]) => pattern.test(path))?.[1] ?? fallback;
export const ASSETS = { logo: asset(/(?:logo|wordmark)\.(?:svg|png|webp)$/i, ''), hero: asset(/(?:hero|banner)[^/]*\.(?:png|jpe?g|webp|avif)$/i, illustration('#733e43', 'Crafted in Jodhpur', true)), heritage: asset(/(?:heritage|artisan|workshop)[^/]*\.(?:png|jpe?g|webp|avif)$/i, illustration('#a36c41', 'The hands behind every pair', true)) };
export const ARTISANS: Artisan[] = [{ id: 'a-meera', name: 'Meera Rathore', location: 'Jodhpur, Rajasthan', experience: 24, specialty: 'Fine thread embroidery', biography: 'A fictional portrait celebrating the patience of Jodhpur embroidery workshops. Meera layers fine thread into floral motifs inspired by courtyard gardens. This demo biography is not a verified account of a real artisan.', image: ASSETS.heritage, fictional: true }, { id: 'a-salim', name: 'Salim Khan', location: 'Jodhpur, Rajasthan', experience: 31, specialty: 'Hand-cut leather and saddle stitching', biography: 'A fictional master of hand-cut uppers and close, even stitching. His imagined workshop honours the collaborative making traditions of Rajasthan; no real maker endorsement is implied.', image: illustration('#805c42', 'Leather and lasting', true), fictional: true }, { id: 'a-kavita', name: 'Kavita Solanki', location: 'Jodhpur, Rajasthan', experience: 18, specialty: 'Celebration embroidery', biography: 'This fictional profile explores the use of metallic thread and restrained embellishment in occasion Mojris. Her imagined designs balance festive detail with a supple silhouette.', image: illustration('#865659', 'Thread by thread', true), fictional: true }];
const seedProducts: Product[] = [
  ['p-gul', 'gul-burgundy', 'Gul Burgundy', 'Burgundy', 'Signature', 429000, 'a-meera', '#733e43', 'Bestseller'],
  ['p-reth', 'reth-sand', 'Reth Sand', 'Sand', 'Everyday', 289000, 'a-salim', '#b7956d', 'Everyday heirloom'],
  ['p-noor', 'noor-ivory', 'Noor Ivory', 'Ivory', 'Celebration', 549000, 'a-kavita', '#e2d3b7', 'Hand embroidered'],
  ['p-kesar', 'kesar-saffron', 'Kesar Saffron', 'Saffron', 'Celebration', 459000, 'a-meera', '#bc8642', 'Small batch'],
  ['p-mitti', 'mitti-cocoa', 'Mitti Cocoa', 'Cocoa', 'Everyday', 319000, 'a-salim', '#735345', 'Hand stitched'],
  ['p-gulabi', 'gulabi-rose', 'Gulabi Rose', 'Rose', 'Signature', 489000, 'a-kavita', '#b9827e', 'Fine threadwork'],
  ['p-chand', 'chand-ivory', 'Chand Ivory', 'Ivory', 'Signature', 399000, 'a-meera', '#d4c4a7', 'Quiet luxury'],
  ['p-marwar', 'marwar-burgundy', 'Marwar Burgundy', 'Burgundy', 'Celebration', 599000, 'a-kavita', '#62383c', 'Atelier edition'],
].map((row, index) => { const [id, slug, name, color, category, price, artisanId, shade, badge] = row as [string, string, string, Color, Category, number, string, string, string]; return { id, slug, name, color, category, price, artisanId, badge, popularity: 100 - index * 7, featured: index < 4, description: `${name} brings the traditional Rajasthani Mojri silhouette into a considered everyday wardrobe. Supple leather, a gently curved toe and hand-finished details give each pair its own character.`, story: 'Inspired by Jodhpur’s courtyard colours and generations of handwork. This fictional collection demonstrates the details a real artisan-led store could share.', materials: ['Leather upper', 'Leather sole', 'Cotton lining', category === 'Everyday' ? 'Waxed cotton stitching' : 'Decorative metallic and cotton thread'], care: ['Wipe gently with a dry, soft cloth.', 'Keep away from rain and prolonged direct sunlight.', 'Air dry naturally; never apply direct heat.', 'Store in a breathable cotton bag.'], fit: 'Choose your usual EU size. A close initial fit softens with wear. If between sizes, choose the larger size; consult the measurement guide.', variants: SIZES.map((size) => ({ size, stock: (index + size) % 8 === 0 ? 0 : 3 + (index + size) % 6 })), images: [{ src: asset(new RegExp(`${slug}(?:-1)?\.(?:png|jpe?g|webp|avif)$`, 'i'), illustration(shade, name)), alt: `${name} traditional Rajasthani Mojri, upper and embroidery view`, caption: `${name} — hand-finished details` }, { src: asset(new RegExp(`${slug}-2\.(?:png|jpe?g|webp|avif)$`, 'i'), illustration(shade, `${name} atelier`, true)), alt: `${name}, illustrated atelier presentation`, caption: 'Illustrated demo imagery unless an uploaded product photograph is available.' }] }; });
export const REVIEWS: Review[] = seedProducts.flatMap((product, index) => [{ id: `r-${index}-1`, productId: product.id, name: 'Ananya S.', rating: 5, title: 'Beautifully considered details', text: 'The embroidery feels special without being overpowering. I used the size guide and found a comfortable fit.', date: '2026-02-18', verified: false, sample: true }, { id: `r-${index}-2`, productId: product.id, name: 'Riya M.', rating: 4, title: 'A lovely occasion pair', text: 'The leather began a little snug and softened with wear. The warm colour works beautifully with linen.', date: '2026-03-04', verified: false, sample: true }]);
export const CRAFT_STEPS = [{ title: 'Cut', text: 'Leather panels are shaped for the traditional curved silhouette.' }, { title: 'Embroider', text: 'Threadwork brings regional pattern and individual variation.' }, { title: 'Stitch', text: 'Upper and sole are carefully joined by hand.' }, { title: 'Finish', text: 'Edges, fit and surface details receive a final inspection.' }];
export const EMPTY_ADDRESS: ShippingAddress = { fullName: '', email: '', phone: '', line1: '', line2: '', city: '', state: '', postalCode: '', country: 'India' };
export const DEFAULT_CATALOG: CatalogState = { query: '', colors: [], sizes: [], categories: [], artisanId: '', sort: 'popular', page: 1, pageSize: 8, view: 'grid' };
const emptyCheckout = (): CheckoutState => ({ address: { ...EMPTY_ADDRESS }, paymentMethod: 'demo-card', idempotencyKey: uid(), errors: {}, submitting: false, lastOrderId: null });
const STORAGE_KEY = 'jootiya:state';
type SafeAdapter = { getItem?: (key: string) => unknown; setItem?: (key: string, value: string) => unknown; get?: (key: string) => unknown; set?: (key: string, value: unknown) => unknown };
const safeStorage = (utilities as unknown as { safeStorage?: SafeAdapter }).safeStorage;
const record = (value: unknown): value is Record<string, unknown> => !!value && typeof value === 'object' && !Array.isArray(value);
const integer = (value: unknown): value is number => Number.isSafeInteger(value) && Number(value) >= 0;
const text = (value: unknown): value is string => typeof value === 'string';
const imageOK = (value: unknown) => typeof value === 'string' && (/^data:image\/(svg\+xml|png|jpeg|webp|avif)[;,]/i.test(value) || /^\/?(?:src\/assets|assets)\//.test(value));
const addressOK = (v: unknown): v is ShippingAddress => record(v) && Object.keys(EMPTY_ADDRESS).every((key) => text(v[key])) && v.country === 'India';
const productOK = (v: unknown): v is Product => record(v) && ['id', 'slug', 'name', 'description', 'story', 'fit', 'badge', 'artisanId'].every((key) => text(v[key])) && COLORS.includes(v.color as Color) && CATEGORIES.includes(v.category as Category) && integer(v.price) && integer(v.popularity) && typeof v.featured === 'boolean' && ARTISANS.some((a) => a.id === v.artisanId) && ['materials', 'care'].every((key) => Array.isArray(v[key]) && (v[key] as unknown[]).every(text)) && Array.isArray(v.images) && v.images.length > 0 && v.images.every((im) => record(im) && imageOK(im.src) && text(im.alt) && text(im.caption)) && Array.isArray(v.variants) && v.variants.length > 0 && v.variants.every((item) => record(item) && SIZES.includes(item.size as Size) && integer(item.stock)) && new Set(v.variants.map((item) => item.size)).size === v.variants.length;
const itemOK = (v: unknown): v is OrderItem => record(v) && ['productId', 'slug', 'name', 'artisanName'].every((key) => text(v[key])) && imageOK(v.image) && COLORS.includes(v.color as Color) && SIZES.includes(v.size as Size) && integer(v.quantity) && v.quantity > 0 && integer(v.unitPrice) && integer(v.lineTotal) && v.lineTotal === v.unitPrice * v.quantity;
const totalsOK = (v: unknown): v is Totals => record(v) && ['subtotal', 'shipping', 'total', 'units'].every((key) => integer(v[key])) && v.total === Number(v.subtotal) + Number(v.shipping);
const orderOK = (v: unknown): v is Order => record(v) && ['id', 'idempotencyKey', 'createdAt', 'userId'].every((key) => text(v[key])) && Number.isFinite(Date.parse(String(v.createdAt))) && Array.isArray(v.items) && v.items.length > 0 && v.items.every(itemOK) && addressOK(v.address) && totalsOK(v.totals) && v.totals.subtotal === v.items.reduce((sum, item) => sum + item.lineTotal, 0) && v.totals.units === v.items.reduce((sum, item) => sum + item.quantity, 0) && PAYMENT_METHODS.some((method) => method.id === v.paymentMethod) && v.paymentStatus === 'simulated' && v.status === 'demo-confirmed' && v.demo === true;
const unique = (items: { id: string }[]) => new Set(items.map((item) => item.id)).size === items.length;
function decode(raw: unknown): PersistedState | null {
  try {
    const v: unknown = typeof raw === 'string' ? JSON.parse(raw) : raw;
    if (!record(v) || ![1, 2].includes(Number(v.version)) || !Array.isArray(v.products) || !v.products.every(productOK) || !unique(v.products) || new Set(v.products.map((p) => p.slug)).size !== v.products.length) return null;
    const products = v.products;
    if (!Array.isArray(v.users) || !v.users.every((u) => record(u) && ['id', 'name', 'email', 'updatedAt'].every((k) => text(u[k])) && addressOK(u.shipping)) || !unique(v.users as User[])) return null;
    if (!Array.isArray(v.orders) || !v.orders.every(orderOK) || !unique(v.orders) || new Set(v.orders.map((o) => o.idempotencyKey)).size !== v.orders.length) return null;
    if (!Array.isArray(v.cart) || !v.cart.every((line) => record(line) && text(line.productId) && SIZES.includes(line.size as Size) && integer(line.quantity) && line.quantity > 0 && line.key === `${line.productId}:${line.size}` && products.some((p) => p.id === line.productId && p.variants.some((variant) => variant.size === line.size)))) return null;
    if (new Set(v.cart.map((line) => line.key)).size !== v.cart.length) return null;
    const c = record(v.checkout) ? v.checkout : {};
    if (v.version === 2 && (!addressOK(c.address) || !text(c.idempotencyKey) || !PAYMENT_METHODS.some((p) => p.id === c.paymentMethod) || !(c.lastOrderId === null || text(c.lastOrderId)))) return null;
    return { version: 2, revision: integer(v.revision) ? v.revision : 0, products, users: v.users as User[], cart: v.cart as CartLine[], orders: v.orders, checkout: { address: addressOK(c.address) ? c.address : { ...EMPTY_ADDRESS }, paymentMethod: PAYMENT_METHODS.some((p) => p.id === c.paymentMethod) ? c.paymentMethod as PaymentMethod : 'demo-card', idempotencyKey: text(c.idempotencyKey) ? c.idempotencyKey : uid(), lastOrderId: text(c.lastOrderId) ? c.lastOrderId : null } };
  } catch { return null; }
}
function readStorage(): { data: PersistedState | null; error: string | null } {
  try { const read = safeStorage?.getItem ?? safeStorage?.get; if (!read) throw new Error(); const raw = read.call(safeStorage, STORAGE_KEY); if (raw === null || raw === undefined || raw === '') return { data: null, error: null }; const data = decode(raw); return { data, error: data ? null : 'Saved data is invalid. It has not been overwritten; retry or clear this site’s storage to start again.' }; }
  catch { return { data: null, error: 'Browser storage is unavailable. Shopping can be previewed, but changes cannot be saved.' }; }
}
const loaded = readStorage();
const initial: PersistedState = loaded.data ?? { version: 2, revision: 0, products: clone(seedProducts), users: [], cart: [], orders: [], checkout: emptyCheckout() };
export const useMockStore = create<AppState>(() => ({ ...initial, orders: freeze(initial.orders), checkout: { ...emptyCheckout(), ...initial.checkout }, catalog: { ...DEFAULT_CATALOG }, overlays: { cart: false, command: false, mobileNav: false, sizeGuide: false, lightbox: null }, selections: {}, storageError: loaded.error }));
export const useMock = useMockStore;
export const useStore = useMockStore;
const persisted = (state: AppState): PersistedState => ({ version: 2, revision: state.revision, products: state.products, users: state.users, cart: state.cart, orders: state.orders, checkout: { address: state.checkout.address, paymentMethod: state.checkout.paymentMethod, idempotencyKey: state.checkout.idempotencyKey, lastOrderId: state.checkout.lastOrderId } });
function apply(data: PersistedState) { useMockStore.setState((s) => ({ ...data, orders: freeze(data.orders), checkout: { ...s.checkout, ...data.checkout, submitting: false, errors: {} }, storageError: null })); }
function latest(): Result<AppState> {
  const read = readStorage();
  if (read.error) { useMockStore.setState({ storageError: read.error }); return { ok: false, error: read.error }; }
  if (read.data) apply(read.data);
  else if (useMockStore.getState().revision > 0) return { ok: false, error: 'Saved data was removed in another tab. Reload before continuing.' };
  return { ok: true, value: useMockStore.getState() };
}
function commit(patch: Partial<PersistedState>, base = useMockStore.getState()): Result<true> {
  const next = { ...persisted(base), ...patch, version: 2 as const, revision: base.revision + 1 };
  try {
    const read = readStorage(); if (read.error) throw new Error(read.error);
    if ((read.data?.revision ?? 0) !== base.revision) { if (read.data) apply(read.data); return { ok: false, error: 'Your shopping bag changed in another tab. Please try again.' }; }
    const write = safeStorage?.setItem ?? safeStorage?.set; if (!write) throw new Error('Browser storage is unavailable.');
    const payload = JSON.stringify(next); write.call(safeStorage, STORAGE_KEY, payload);
    const verified = readStorage(); if (!verified.data || JSON.stringify(verified.data) !== payload) throw new Error('Could not save your changes. Check available browser storage and try again.');
    apply(next); return { ok: true, value: true };
  } catch (error) { const message = error instanceof Error ? error.message : 'Could not save your changes.'; useMockStore.setState({ storageError: message }); return { ok: false, error: message }; }
}
export const formatPrice = (paise: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: paise % 100 ? 2 : 0 }).format(paise / 100);
export const cartKey = (productId: string, size: Size) => `${productId}:${size}`;
export const getProduct = (idOrSlug: string) => useMockStore.getState().products.find((p) => p.id === idOrSlug || p.slug === idOrSlug);
export const getArtisan = (id: string) => ARTISANS.find((a) => a.id === id);
export const getStock = (productId: string, size: Size, products = useMockStore.getState().products) => products.find((p) => p.id === productId)?.variants.find((v) => v.size === size)?.stock ?? 0;
export function calculateTotals(cart = useMockStore.getState().cart, products = useMockStore.getState().products): Totals {
  const subtotal = cart.reduce((sum, line) => sum + (products.find((p) => p.id === line.productId)?.price ?? 0) * line.quantity, 0);
  const shipping = subtotal > 0 && subtotal < SHIPPING_POLICY.freeAbove ? SHIPPING_POLICY.fee : 0;
  return { subtotal, shipping, total: subtotal + shipping, units: cart.reduce((sum, line) => sum + line.quantity, 0) };
}
export const getCartItems = () => useMockStore.getState().cart.map((line) => ({ ...line, product: getProduct(line.productId), stock: getStock(line.productId, line.size) }));
function updateCart(transform: (state: AppState) => Result<CartLine[]>): Result<CartLine[]> {
  const fresh = latest(); if (!fresh.ok) return fresh; const state = fresh.value; const result = transform(state); if (!result.ok) return result;
  const checkout = { ...persisted(state).checkout, idempotencyKey: uid(), lastOrderId: null };
  const saved = commit({ cart: result.value, checkout }, state); return saved.ok ? result : saved;
}
export function addToCart(productId: string, size: Size, quantity = 1): Result<CartLine[]> {
  return updateCart((s) => { if (!SIZES.includes(size) || !Number.isInteger(quantity) || quantity < 1) return { ok: false, error: 'Choose a valid size and quantity.' }; const key = cartKey(productId, size); const existing = s.cart.find((line) => line.key === key); const total = (existing?.quantity ?? 0) + quantity; if (total > getStock(productId, size, s.products)) return { ok: false, error: 'There is not enough stock in this size.' }; return { ok: true, value: existing ? s.cart.map((line) => line.key === key ? { ...line, quantity: total } : line) : [...s.cart, { key, productId, size, quantity }] }; });
}
export function setCartQuantity(key: string, quantity: number): Result<CartLine[]> {
  return updateCart((s) => { const line = s.cart.find((item) => item.key === key); if (!line) return { ok: false, error: 'This item is no longer in your bag.' }; if (!Number.isInteger(quantity) || quantity < 0 || quantity > getStock(line.productId, line.size, s.products)) return { ok: false, error: 'Quantity must be within available stock.' }; return { ok: true, value: quantity === 0 ? s.cart.filter((item) => item.key !== key) : s.cart.map((item) => item.key === key ? { ...item, quantity } : item) }; });
}
export const removeFromCart = (key: string) => updateCart((s) => ({ ok: true, value: s.cart.filter((line) => line.key !== key) }));
export const clearCart = () => updateCart(() => ({ ok: true, value: [] }));
const normalizeAddress = (input: ShippingAddress): ShippingAddress => Object.fromEntries(Object.keys(EMPTY_ADDRESS).map((key) => [key, key === 'country' ? 'India' : key === 'email' ? String(input[key as keyof ShippingAddress] ?? '').trim().toLowerCase() : String(input[key as keyof ShippingAddress] ?? '').trim()])) as unknown as ShippingAddress;
export function validateCheckout(address: ShippingAddress, paymentMethod: PaymentMethod): CheckoutErrors {
  const a = normalizeAddress(address); const errors: CheckoutErrors = {};
  if (a.fullName.length < 2 || a.fullName.length > 100) errors.fullName = 'Enter a name between 2 and 100 characters.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(a.email) || a.email.length > 254) errors.email = 'Enter a valid email address.';
  if (!/^(?:\+91|91)?[6-9]\d{9}$/.test(a.phone.replace(/[\s()-]/g, ''))) errors.phone = 'Enter a valid 10-digit Indian mobile number.';
  if (a.line1.length < 5 || a.line1.length > 200) errors.line1 = 'Enter a street address between 5 and 200 characters.';
  if (a.line2.length > 200) errors.line2 = 'Keep this field under 200 characters.';
  if (a.city.length < 2 || a.city.length > 100) errors.city = 'Enter a valid city.';
  if (a.state.length < 2 || a.state.length > 100) errors.state = 'Enter a valid state or union territory.';
  if (!/^[1-9]\d{5}$/.test(a.postalCode)) errors.postalCode = 'Enter a valid 6-digit Indian PIN code.';
  if (address.country !== 'India') errors.country = 'This demonstration supports Indian addresses only.';
  if (!PAYMENT_METHODS.some((p) => p.id === paymentMethod)) errors.paymentMethod = 'Choose a demo payment method.';
  return errors;
}
export function updateCheckout(patch: { address?: Partial<ShippingAddress>; paymentMethod?: PaymentMethod }): Result<true> {
  const fresh = latest(); if (!fresh.ok) return fresh; const state = fresh.value;
  if (patch.paymentMethod && !PAYMENT_METHODS.some((method) => method.id === patch.paymentMethod)) return { ok: false, error: 'Choose a demo payment method.' };
  const address = normalizeAddress({ ...state.checkout.address, ...patch.address });
  return commit({ checkout: { ...persisted(state).checkout, address, paymentMethod: patch.paymentMethod ?? state.checkout.paymentMethod } }, state);
}
function customer(address: ShippingAddress, users: User[]): User { const a = normalizeAddress(address); return { id: users.find((u) => u.email.toLowerCase() === a.email)?.id ?? uid(), email: a.email, name: a.fullName, shipping: a, updatedAt: new Date().toISOString() }; }
export function saveUser(address: ShippingAddress): Result<User> {
  const errors = validateCheckout(address, 'demo-card'); if (Object.keys(errors).length) return { ok: false, error: 'Check your customer details.', errors };
  const fresh = latest(); if (!fresh.ok) return fresh; const user = customer(address, fresh.value.users); const saved = commit({ users: [...fresh.value.users.filter((u) => u.id !== user.id), user] }, fresh.value); return saved.ok ? { ok: true, value: user } : saved;
}
export const getUsers = () => clone(useMockStore.getState().users);
export const prefillCustomer = (id: string): Result<true> => { const user = useMockStore.getState().users.find((u) => u.id === id); return user ? updateCheckout({ address: user.shipping }) : { ok: false, error: 'Saved customer not found.' }; };
export function placeOrder(idempotencyKey = useMockStore.getState().checkout.idempotencyKey): Result<Order> {
  const fresh = latest(); if (!fresh.ok) return fresh; const state = fresh.value;
  const existing = state.orders.find((o) => o.idempotencyKey === idempotencyKey); if (existing) return { ok: true, value: existing };
  if (!idempotencyKey || idempotencyKey !== state.checkout.idempotencyKey) return { ok: false, error: 'This checkout has changed. Please review your bag again.' };
  const errors = validateCheckout(state.checkout.address, state.checkout.paymentMethod);
  if (!state.cart.length) errors.cart = 'Your bag is empty.';
  for (const line of state.cart) if (line.quantity > getStock(line.productId, line.size, state.products)) errors.cart = 'Availability changed. Adjust the quantities in your bag before continuing.';
  if (Object.keys(errors).length) { useMockStore.setState({ checkout: { ...state.checkout, errors } }); return { ok: false, error: 'Please review the checkout details.', errors }; }
  useMockStore.setState({ checkout: { ...state.checkout, submitting: true, errors: {} } });
  const address = normalizeAddress(state.checkout.address); const user = customer(address, state.users);
  const items: OrderItem[] = state.cart.map((line) => { const product = state.products.find((p) => p.id === line.productId)!; return { productId: product.id, slug: product.slug, name: product.name, image: product.images[0].src, color: product.color, size: line.size, quantity: line.quantity, unitPrice: product.price, lineTotal: product.price * line.quantity, artisanName: getArtisan(product.artisanId)?.name ?? 'Jodhpur atelier' }; });
  const order: Order = freeze({ id: `JT-${uid()}`, idempotencyKey, createdAt: new Date().toISOString(), userId: user.id, items, address: { ...address }, totals: calculateTotals(state.cart, state.products), paymentMethod: state.checkout.paymentMethod, paymentStatus: 'simulated', status: 'demo-confirmed', demo: true });
  const products = state.products.map((p) => ({ ...p, variants: p.variants.map((variant) => ({ ...variant, stock: variant.stock - (state.cart.find((line) => line.productId === p.id && line.size === variant.size)?.quantity ?? 0) })) }));
  const saved = commit({ products, users: [...state.users.filter((u) => u.id !== user.id), user], orders: [...state.orders, order], cart: [], checkout: { address, paymentMethod: state.checkout.paymentMethod, idempotencyKey, lastOrderId: order.id } }, state);
  if (!saved.ok) { useMockStore.setState((s) => ({ checkout: { ...s.checkout, submitting: false, errors: { storage: saved.error } } })); return saved; }
  return { ok: true, value: order };
}
export const getOrders = (email?: string) => useMockStore.getState().orders.filter((order) => !email || order.address.email.toLowerCase() === email.trim().toLowerCase()).slice().sort((a, b) => b.createdAt.localeCompare(a.createdAt));
export const getOrder = (id: string) => useMockStore.getState().orders.find((order) => order.id === id);
export const getReviews = (productId: string) => REVIEWS.filter((review) => review.productId === productId);
export function getReviewSummary(productId: string) { const reviews = getReviews(productId); return { count: reviews.length, average: reviews.length ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length : 0, distribution: [5, 4, 3, 2, 1].map((rating) => ({ rating, count: reviews.filter((r) => r.rating === rating).length })), sample: true }; }
const searchText = (p: Product) => `${p.name} ${p.color} ${p.category} ${p.description} ${p.materials.join(' ')} ${getArtisan(p.artisanId)?.name ?? ''}`.normalize('NFKC').toLocaleLowerCase('en-IN');
export function queryCatalog(filters: Partial<CatalogState> = {}, products = useMockStore.getState().products): CatalogResult {
  const f = { ...DEFAULT_CATALOG, ...filters }; const terms = f.query.trim().normalize('NFKC').toLocaleLowerCase('en-IN').split(/\s+/).filter(Boolean);
  const filtered = products.filter((p) => terms.every((term) => searchText(p).includes(term)) && (!f.colors.length || f.colors.includes(p.color)) && (!f.categories.length || f.categories.includes(p.category)) && (!f.artisanId || p.artisanId === f.artisanId) && (!f.sizes.length || p.variants.some((v) => f.sizes.includes(v.size) && v.stock > 0)));
  filtered.sort((a, b) => (f.sort === 'price-asc' ? a.price - b.price : f.sort === 'price-desc' ? b.price - a.price : b.popularity - a.popularity) || a.id.localeCompare(b.id));
  const size = [8, 12, 24].includes(f.pageSize) ? f.pageSize : 8; const pages = Math.max(1, Math.ceil(filtered.length / size)); const page = Math.max(1, Math.min(pages, Math.floor(Number(f.page) || 1)));
  return { items: filtered.slice((page - 1) * size, page * size), total: filtered.length, pages, page };
}
export const searchProducts = (query: string, limit = 8) => queryCatalog({ query, pageSize: 24 }).items.slice(0, Math.max(0, limit));
function validCatalog(input: Partial<CatalogState>): CatalogState { return { query: String(input.query ?? '').slice(0, 200), colors: [...new Set(input.colors ?? [])].filter((c) => COLORS.includes(c)), sizes: [...new Set(input.sizes ?? [])].filter((s) => SIZES.includes(s)), categories: [...new Set(input.categories ?? [])].filter((c) => CATEGORIES.includes(c)), artisanId: ARTISANS.some((a) => a.id === input.artisanId) ? input.artisanId! : '', sort: ['popular', 'price-asc', 'price-desc'].includes(input.sort ?? '') ? input.sort! : 'popular', page: Math.max(1, Math.floor(Number(input.page) || 1)), pageSize: [8, 12, 24].includes(Number(input.pageSize)) ? Number(input.pageSize) : 8, view: input.view === 'table' ? 'table' : 'grid' }; }
export function setCatalog(patch: Partial<CatalogState>, resetPage = true) { const previous = useMockStore.getState().catalog; const next = validCatalog({ ...previous, ...patch, page: resetPage && !('page' in patch) ? 1 : patch.page ?? previous.page }); next.page = queryCatalog(next).page; useMockStore.setState({ catalog: next }); return next; }
export const resetCatalog = () => setCatalog({ ...DEFAULT_CATALOG });
export function catalogFromSearch(search: string | URLSearchParams): CatalogState { const params = typeof search === 'string' ? new URLSearchParams(search) : search; return validCatalog({ query: params.get('q') ?? '', colors: params.getAll('color') as Color[], sizes: params.getAll('size').map(Number) as Size[], categories: params.getAll('category') as Category[], artisanId: params.get('artisan') ?? '', sort: params.get('sort') as SortOrder, page: Number(params.get('page') ?? 1), pageSize: Number(params.get('limit') ?? 8), view: params.get('view') === 'table' ? 'table' : 'grid' }); }
export function catalogToSearch(input: Partial<CatalogState> = useMockStore.getState().catalog): string { const f = validCatalog(input); const p = new URLSearchParams(); if (f.query) p.set('q', f.query); f.colors.forEach((c) => p.append('color', c)); f.sizes.forEach((s) => p.append('size', String(s))); f.categories.forEach((c) => p.append('category', c)); if (f.artisanId) p.set('artisan', f.artisanId); if (f.sort !== 'popular') p.set('sort', f.sort); if (f.page > 1) p.set('page', String(f.page)); if (f.pageSize !== 8) p.set('limit', String(f.pageSize)); if (f.view !== 'grid') p.set('view', f.view); return p.toString(); }
export const restoreCatalog = (search: string | URLSearchParams) => setCatalog(catalogFromSearch(search), false);
export function setOverlay(name: keyof OverlayState, value: boolean | number | null) { useMockStore.setState((s) => { const overlays = { ...s.overlays }; if (name === 'lightbox') overlays.lightbox = typeof value === 'number' && Number.isInteger(value) && value >= 0 ? value : null; else { overlays[name] = value === true; if (value === true) { if (name !== 'cart') overlays.cart = false; if (name !== 'command') overlays.command = false; if (name !== 'mobileNav') overlays.mobileNav = false; } } return { overlays }; }); }
export const closeOverlays = () => useMockStore.setState({ overlays: { cart: false, command: false, mobileNav: false, sizeGuide: false, lightbox: null } });
export const getSelection = (productId: string): ProductSelection => useMockStore.getState().selections[productId] ?? { size: null, quantity: 1, image: 0, tab: 'details' };
export function setProductSelection(productId: string, patch: Partial<ProductSelection>) { const product = getProduct(productId); if (!product) return; const selection = { ...getSelection(productId), ...patch }; if (selection.size !== null && !product.variants.some((v) => v.size === selection.size)) selection.size = null; const stock = selection.size === null ? 1 : getStock(productId, selection.size); selection.quantity = Math.max(1, Math.min(Math.floor(Number(selection.quantity) || 1), Math.max(1, stock))); selection.image = Math.max(0, Math.min(Math.floor(Number(selection.image) || 0), product.images.length - 1)); useMockStore.setState((s) => ({ selections: { ...s.selections, [productId]: selection } })); }
export const getRelatedProducts = (productId: string, limit = 3) => { const product = getProduct(productId); return useMockStore.getState().products.filter((p) => p.id !== productId).sort((a, b) => Number(b.artisanId === product?.artisanId) - Number(a.artisanId === product?.artisanId) || b.popularity - a.popularity).slice(0, limit); };
export const retryPersistence = (): Result<true> => { const fresh = latest(); return fresh.ok ? { ok: true, value: true } : fresh; };
export const actions = { addToCart, setCartQuantity, removeFromCart, clearCart, updateCheckout, saveUser, prefillCustomer, placeOrder, setCatalog, resetCatalog, restoreCatalog, setOverlay, closeOverlays, setProductSelection, retryPersistence };
if (typeof window !== 'undefined') {
  window.addEventListener('storage', (event: StorageEvent) => { if (event.key !== STORAGE_KEY && event.key !== null) return; const data = event.newValue ? decode(event.newValue) : null; if (data) apply(data); else useMockStore.setState({ storageError: event.newValue ? 'Saved data from another tab could not be validated.' : 'Saved data was removed in another tab. Reload before continuing.' }); });
  window.addEventListener('focus', () => { const read = readStorage(); if (read.data && read.data.revision !== useMockStore.getState().revision) apply(read.data); });
}