import { createClient } from '@libsql/client';
import type { CartItem, Order, Product, Review } from '../src/types';

const db = createClient({ url: 'file:file:local.db' });

const productsSeed: Product[] = [
  {
    id: 'prod-1',
    name: 'Mehrab Handwoven Mojri',
    slug: 'mehrab-handwoven-mojri',
    price: 3499,
    currency: 'INR',
    category: 'Mojris',
    collection: 'Heritage Loom',
    description: 'A ceremonial mojri in deep crimson leather with handwoven textile lining and a softly squared toe, finished for wedding-season dressing.',
    image: 'https://images.unsplash.com/photo-1533867617858-e7b97e060509?auto=format&fit=crop&w=800&q=80',
    gallery: ['https://images.unsplash.com/photo-1533867617858-e7b97e060509?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=800&q=80'],
    artisan: 'Ustad Karim Leather Atelier',
    origin: 'Jodhpur, Rajasthan',
    material: 'Vegetable-tanned leather, handloom cotton',
    sizes: ['6', '7', '8', '9', '10'],
    featured: true,
    inStock: true,
    rating: 4.9,
    reviewCount: 128,
  },
  {
    id: 'prod-2',
    name: 'Sunehri Court Mojri',
    slug: 'sunehri-court-mojri',
    price: 2899,
    currency: 'INR',
    category: 'Mojris',
    collection: 'Court Edit',
    description: 'A polished everyday mojri with a warm ochre finish, cushioned footbed, and refined embroidery inspired by palace arches.',
    image: 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&w=800&q=80',
    gallery: ['https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1400&q=85'],
    artisan: 'Nawab Stitch House',
    origin: 'Jodhpur, Rajasthan',
    material: 'Leather, silk thread embroidery',
    sizes: ['6', '7', '8', '9', '10', '11'],
    featured: true,
    inStock: true,
    rating: 4.8,
    reviewCount: 94,
  },
  {
    id: 'prod-3',
    name: 'Noor Embroidered Slip-On',
    slug: 'noor-embroidered-slip-on',
    price: 3199,
    currency: 'INR',
    category: 'Mojris',
    collection: 'Evening Rituals',
    description: 'A slim-profile slip-on with tonal embroidery, supple structure, and a quiet sheen designed for festive evenings.',
    image: 'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&w=800&q=80',
    gallery: ['https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80'],
    artisan: 'Saffron Thread Collective',
    origin: 'Jodhpur, Rajasthan',
    material: 'Leather, zari thread',
    sizes: ['7', '8', '9', '10'],
    featured: false,
    inStock: true,
    rating: 4.7,
    reviewCount: 61,
  },
  {
    id: 'prod-4',
    name: 'Riwaayat Brocade Mojri',
    slug: 'riwaayat-brocade-mojri',
    price: 3799,
    currency: 'INR',
    category: 'Mojris',
    collection: 'Wedding Archive',
    description: 'A brocade-panel mojri with a ceremonial silhouette, crafted for sherwani pairings and heirloom occasions.',
    image: 'https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?auto=format&fit=crop&w=800&q=80',
    gallery: ['https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=1400&q=85'],
    artisan: 'Mughal Loom Studio',
    origin: 'Jodhpur, Rajasthan',
    material: 'Leather, brocade, cotton lining',
    sizes: ['6', '7', '8', '9', '10', '11'],
    featured: true,
    inStock: true,
    rating: 5,
    reviewCount: 143,
  },
  {
    id: 'prod-5',
    name: 'Bahar Woven Mojri',
    slug: 'bahar-woven-mojri',
    price: 2699,
    currency: 'INR',
    category: 'Mojris',
    collection: 'Daily Heritage',
    description: 'A lighter woven mojri with breathable lining and a softened vamp, balancing comfort with formal restraint.',
    image: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=1400&q=85',
    gallery: ['https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=1400&q=85', 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=800&q=80'],
    artisan: 'Indigo Handcraft Works',
    origin: 'Jodhpur, Rajasthan',
    material: 'Leather, woven cotton',
    sizes: ['6', '7', '8', '9'],
    featured: false,
    inStock: true,
    rating: 4.6,
    reviewCount: 48,
  },
  {
    id: 'prod-6',
    name: 'Zarqa Heritage Mojri',
    slug: 'zarqa-heritage-mojri',
    price: 3999,
    currency: 'INR',
    category: 'Mojris',
    collection: 'Signature Craft',
    description: 'The most ornate expression in the collection, finished with dense hand embroidery and a sculpted, elegant profile.',
    image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1400&q=85',
    gallery: ['https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1400&q=85', 'https://images.unsplash.com/photo-1533867617858-e7b97e060509?auto=format&fit=crop&w=800&q=80'],
    artisan: 'Royal Stitch Guild',
    origin: 'Jodhpur, Rajasthan',
    material: 'Leather, silk embroidery, cotton lining',
    sizes: ['7', '8', '9', '10', '11'],
    featured: true,
    inStock: true,
    rating: 4.9,
    reviewCount: 112,
  },
];

const reviewsSeed: Review[] = [
  { id: 'rev-1', productId: 'prod-1', author: 'Aarav S.', rating: 5, title: 'Exceptional finish', body: 'The craftsmanship feels ceremonial and the fit was true to size.', createdAt: new Date().toISOString() },
  { id: 'rev-2', productId: 'prod-4', author: 'Meera K.', rating: 5, title: 'Beautiful for weddings', body: 'The embroidery is refined and the silhouette looks luxurious in person.', createdAt: new Date().toISOString() },
];

async function init() {
  await db.execute(`CREATE TABLE IF NOT EXISTS products (
    id TEXT PRIMARY KEY, name TEXT NOT NULL, slug TEXT NOT NULL UNIQUE, price INTEGER NOT NULL,
    currency TEXT, category TEXT NOT NULL, collection TEXT, description TEXT, image TEXT NOT NULL,
    gallery TEXT, artisan TEXT, origin TEXT, material TEXT, sizes TEXT, featured INTEGER DEFAULT 0,
    inStock INTEGER DEFAULT 1, rating REAL, reviewCount INTEGER
  )`);
  await db.execute(`CREATE TABLE IF NOT EXISTS reviews (
    id TEXT PRIMARY KEY, productId TEXT NOT NULL, author TEXT NOT NULL, rating INTEGER NOT NULL,
    title TEXT, body TEXT NOT NULL, createdAt TEXT NOT NULL
  )`);
  await db.execute(`CREATE TABLE IF NOT EXISTS orders (
    id TEXT PRIMARY KEY, orderNumber TEXT NOT NULL UNIQUE, items TEXT NOT NULL, subtotal INTEGER NOT NULL,
    shipping INTEGER NOT NULL, total INTEGER NOT NULL, currency TEXT, customerName TEXT NOT NULL,
    email TEXT NOT NULL, phone TEXT, addressLine1 TEXT NOT NULL, addressLine2 TEXT, city TEXT NOT NULL,
    state TEXT NOT NULL, postalCode TEXT NOT NULL, country TEXT NOT NULL, status TEXT NOT NULL, createdAt TEXT NOT NULL
  )`);
  for (const p of productsSeed) {
    await db.execute({
      sql: `INSERT OR IGNORE INTO products VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [p.id, p.name, p.slug, p.price, p.currency ?? 'INR', p.category, p.collection ?? null, p.description ?? null, p.image, JSON.stringify(p.gallery ?? []), p.artisan ?? null, p.origin ?? null, p.material ?? null, JSON.stringify(p.sizes ?? []), p.featured ? 1 : 0, p.inStock ? 1 : 0, p.rating ?? null, p.reviewCount ?? null],
    });
  }
  for (const r of reviewsSeed) {
    await db.execute({ sql: `INSERT OR IGNORE INTO reviews VALUES (?, ?, ?, ?, ?, ?, ?)`, args: [r.id, r.productId, r.author, r.rating, r.title ?? null, r.body, r.createdAt] });
  }
}

const ready = init();

const parseProduct = (row: Record<string, unknown>): Product => ({
  id: String(row.id ?? ''),
  name: String(row.name ?? ''),
  slug: String(row.slug ?? ''),
  price: Number(row.price ?? 0),
  currency: String(row.currency ?? 'INR'),
  category: String(row.category ?? ''),
  collection: (row.collection as string | null) ?? undefined,
  description: (row.description as string | null) ?? undefined,
  image: String(row.image ?? ''),
  gallery: JSON.parse(String(row.gallery ?? '[]')),
  artisan: (row.artisan as string | null) ?? undefined,
  origin: (row.origin as string | null) ?? undefined,
  material: (row.material as string | null) ?? undefined,
  sizes: JSON.parse(String(row.sizes ?? '[]')),
  featured: Boolean(row.featured ?? 0),
  inStock: Boolean(row.inStock ?? 1),
  rating: row.rating == null ? undefined : Number(row.rating),
  reviewCount: row.reviewCount == null ? undefined : Number(row.reviewCount),
});

const parseOrder = (row: Record<string, unknown>): Order => ({
  id: String(row.id ?? ''),
  orderNumber: String(row.orderNumber ?? ''),
  items: JSON.parse(String(row.items ?? '[]')) as CartItem[],
  subtotal: Number(row.subtotal ?? 0),
  shipping: Number(row.shipping ?? 0),
  total: Number(row.total ?? 0),
  currency: String(row.currency ?? 'INR'),
  customerName: String(row.customerName ?? ''),
  email: String(row.email ?? ''),
  phone: (row.phone as string | null) ?? undefined,
  addressLine1: String(row.addressLine1 ?? ''),
  addressLine2: (row.addressLine2 as string | null) ?? undefined,
  city: String(row.city ?? ''),
  state: String(row.state ?? ''),
  postalCode: String(row.postalCode ?? ''),
  country: String(row.country ?? ''),
  status: String(row.status ?? 'pending') as Order['status'],
  createdAt: String(row.createdAt ?? new Date().toISOString()),
});

export async function getProducts() {
  await ready;
  const res = await db.execute('SELECT * FROM products ORDER BY featured DESC, name ASC');
  return res.rows.map((row) => parseProduct(row as Record<string, unknown>));
}

export async function getProductBySlug(slug: string) {
  await ready;
  const res = await db.execute({ sql: 'SELECT * FROM products WHERE slug = ?', args: [slug] });
  return res.rows[0] ? parseProduct(res.rows[0] as Record<string, unknown>) : null;
}

export async function getReviewsByProductId(productId: string) {
  await ready;
  const res = await db.execute({ sql: 'SELECT * FROM reviews WHERE productId = ? ORDER BY createdAt DESC', args: [productId] });
  return res.rows.map((row) => ({
    id: String(row.id ?? ''),
    productId: String(row.productId ?? ''),
    author: String(row.author ?? ''),
    rating: Number(row.rating ?? 0),
    title: (row.title as string | null) ?? undefined,
    body: String(row.body ?? ''),
    createdAt: String(row.createdAt ?? ''),
  })) as Review[];
}

export async function getOrders() {
  await ready;
  const res = await db.execute('SELECT * FROM orders ORDER BY createdAt DESC');
  return res.rows.map((row) => parseOrder(row as Record<string, unknown>));
}

export async function createOrder(order: Order) {
  await ready;
  await db.execute({
    sql: `INSERT INTO orders VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    args: [order.id, order.orderNumber, JSON.stringify(order.items), order.subtotal, order.shipping, order.total, order.currency ?? 'INR', order.customerName, order.email, order.phone ?? null, order.addressLine1, order.addressLine2 ?? null, order.city, order.state, order.postalCode, order.country, order.status, order.createdAt],
  });
  return order;
}

export async function inspectTables() {
  await ready;
  const res = await db.execute(`SELECT name FROM sqlite_master WHERE type='table' ORDER BY name`);
  return res.rows.map((row) => String(row.name ?? ''));
}

export async function getTableData(tableName: string) {
  await ready;
  const safe = ['products', 'reviews', 'orders'].includes(tableName) ? tableName : 'products';
  const res = await db.execute(`SELECT * FROM ${safe}`);
  return res.rows;
}

export default db;