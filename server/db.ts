import { createClient, type Client } from '@libsql/client';

export const db: Client = createClient({ url: 'file:local.db' });
export default db;

const statements = [
  `CREATE TABLE IF NOT EXISTS products (
    id TEXT PRIMARY KEY,
    slug TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    gender TEXT NOT NULL,
    price INTEGER NOT NULL,
    compareAtPrice INTEGER,
    description TEXT NOT NULL,
    artisan TEXT NOT NULL,
    material TEXT NOT NULL,
    color TEXT NOT NULL,
    sizes TEXT NOT NULL,
    image TEXT NOT NULL,
    gallery TEXT,
    rating REAL,
    reviewCount INTEGER,
    availability TEXT,
    featured INTEGER DEFAULT 0,
    newArrival INTEGER DEFAULT 0,
    handcrafted INTEGER DEFAULT 0,
    stock INTEGER DEFAULT 0,
    tags TEXT
  )`,
  `CREATE TABLE IF NOT EXISTS orders (
    id TEXT PRIMARY KEY,
    userId TEXT,
    items TEXT NOT NULL,
    subtotal INTEGER NOT NULL,
    shipping INTEGER NOT NULL,
    total INTEGER NOT NULL,
    currency TEXT NOT NULL,
    status TEXT NOT NULL,
    shippingAddress TEXT NOT NULL,
    createdAt TEXT NOT NULL,
    updatedAt TEXT
  )`,
  `CREATE TABLE IF NOT EXISTS custom_requests (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT,
    occasion TEXT NOT NULL,
    size TEXT NOT NULL,
    colorPreference TEXT,
    notes TEXT,
    referenceImages TEXT,
    status TEXT DEFAULT 'new',
    createdAt TEXT NOT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS auth_users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE,
    name TEXT,
    image TEXT,
    emailVerified INTEGER,
    createdAt TEXT NOT NULL,
    updatedAt TEXT NOT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS auth_sessions (
    id TEXT PRIMARY KEY,
    userId TEXT NOT NULL,
    token TEXT UNIQUE NOT NULL,
    expiresAt TEXT NOT NULL,
    createdAt TEXT NOT NULL,
    updatedAt TEXT NOT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS auth_accounts (
    id TEXT PRIMARY KEY,
    userId TEXT NOT NULL,
    providerId TEXT NOT NULL,
    accountId TEXT NOT NULL,
    accessToken TEXT,
    refreshToken TEXT,
    idToken TEXT,
    accessTokenExpiresAt TEXT,
    refreshTokenExpiresAt TEXT,
    scope TEXT,
    password TEXT,
    createdAt TEXT NOT NULL,
    updatedAt TEXT NOT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS auth_verification (
    id TEXT PRIMARY KEY,
    identifier TEXT NOT NULL,
    value TEXT NOT NULL,
    expiresAt TEXT NOT NULL,
    createdAt TEXT NOT NULL,
    updatedAt TEXT NOT NULL
  )`,
];

const seedProducts = [
  {
    id: 'prod-001',
    slug: 'maharaja-ivory-mojri',
    name: 'Maharaja Ivory Mojri',
    category: 'Mojri',
    gender: 'Men',
    price: 4999,
    compareAtPrice: 6499,
    description: 'An ivory hand-finished mojri with a refined almond toe and tonal embroidery for ceremonial dressing.',
    artisan: 'Rafiq Khan',
    material: 'Leather, silk thread',
    color: 'Ivory',
    sizes: ['6', '7', '8', '9', '10'],
    image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1533867617858-e7b97e060509?auto=format&fit=crop&w=800&q=80',
    ],
    rating: 4.9,
    reviewCount: 128,
    availability: 'in_stock',
    featured: 1,
    newArrival: 0,
    handcrafted: 1,
    stock: 14,
    tags: ['ceremony', 'hand-embroidered', 'heritage'],
  },
  {
    id: 'prod-002',
    slug: 'jaisalmer-gold-thread-jutti',
    name: 'Jaisalmer Gold Thread Jutti',
    category: 'Jutti',
    gender: 'Women',
    price: 4299,
    compareAtPrice: 5599,
    description: 'A luminous gold-thread jutti shaped for festive evenings with a supple leather base and soft lining.',
    artisan: 'Shabnam Bano',
    material: 'Leather, zari thread',
    color: 'Gold',
    sizes: ['5', '6', '7', '8', '9'],
    image: 'https://images.unsplash.com/photo-1533867617858-e7b97e060509?auto=format&fit=crop&w=800&q=80',
    gallery: ['https://images.unsplash.com/photo-1533867617858-e7b97e060509?auto=format&fit=crop&w=800&q=80'],
    rating: 4.8,
    reviewCount: 94,
    availability: 'low_stock',
    featured: 1,
    newArrival: 1,
    handcrafted: 1,
    stock: 6,
    tags: ['festive', 'zari', 'women'],
  },
  {
    id: 'prod-003',
    slug: 'thar-heritage-slip-on',
    name: 'Thar Heritage Slip-on',
    category: 'Slip-on',
    gender: 'Unisex',
    price: 3699,
    compareAtPrice: null,
    description: 'A pared-back slip-on with a heritage silhouette, ideal for daily wear and long summer evenings.',
    artisan: 'Imran Ali',
    material: 'Suede, cotton lining',
    color: 'Sand',
    sizes: ['6', '7', '8', '9', '10', '11'],
    image: 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&w=800&q=80',
    gallery: ['https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&w=800&q=80'],
    rating: 4.7,
    reviewCount: 61,
    availability: 'in_stock',
    featured: 0,
    newArrival: 1,
    handcrafted: 1,
    stock: 22,
    tags: ['everyday', 'minimal', 'unisex'],
  },
  {
    id: 'prod-004',
    slug: 'royal-brocade-wedding-mojri',
    name: 'Royal Brocade Wedding Mojri',
    category: 'Wedding',
    gender: 'Men',
    price: 6999,
    compareAtPrice: 8499,
    description: 'A richly brocaded wedding mojri with elevated detailing and a cushioned footbed for long celebrations.',
    artisan: 'Nadeem Hussain',
    material: 'Leather, brocade, zari',
    color: 'Maroon',
    sizes: ['7', '8', '9', '10', '11'],
    image: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=800&q=80',
    gallery: ['https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=800&q=80'],
    rating: 5,
    reviewCount: 42,
    availability: 'preorder',
    featured: 1,
    newArrival: 0,
    handcrafted: 1,
    stock: 4,
    tags: ['wedding', 'brocade', 'statement'],
  },
  {
    id: 'prod-005',
    slug: 'desert-loom-heritage-jutti',
    name: 'Desert Loom Heritage Jutti',
    category: 'Heritage',
    gender: 'Women',
    price: 4599,
    compareAtPrice: 5899,
    description: 'A heritage jutti with loom-inspired texture and a softly structured profile for elegant daywear.',
    artisan: 'Farzana Sheikh',
    material: 'Leather, woven textile',
    color: 'Ochre',
    sizes: ['5', '6', '7', '8'],
    image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=800&q=80',
    gallery: ['https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=800&q=80'],
    rating: 4.6,
    reviewCount: 77,
    availability: 'in_stock',
    featured: 0,
    newArrival: 0,
    handcrafted: 1,
    stock: 18,
    tags: ['heritage', 'woven', 'artisan'],
  },
  {
    id: 'prod-006',
    slug: 'everyday-saffron-mojri',
    name: 'Everyday Saffron Mojri',
    category: 'Everyday',
    gender: 'Unisex',
    price: 3199,
    compareAtPrice: 3999,
    description: 'A saffron-toned everyday mojri with a flexible sole and understated embroidery for daily rotation.',
    artisan: 'Aamir Qureshi',
    material: 'Leather, cotton thread',
    color: 'Saffron',
    sizes: ['6', '7', '8', '9', '10'],
    image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=800&q=80',
    gallery: ['https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=800&q=80'],
    rating: 4.5,
    reviewCount: 53,
    availability: 'in_stock',
    featured: 0,
    newArrival: 1,
    handcrafted: 1,
    stock: 31,
    tags: ['daily', 'lightweight', 'unisex'],
  },
];

const run = async (sql: string, args: unknown[] = []) => db.execute({ sql, args });
const json = (value: unknown) => JSON.stringify(value ?? null);

export async function initializeDatabase() {
  for (const statement of statements) await run(statement);
  const existing = await db.execute({ sql: 'SELECT COUNT(*) as count FROM products' });
  const count = Number(existing?.rows?.[0]?.count ?? 0);
  if (count > 0) return db;
  for (const product of seedProducts) {
    await run(
      `INSERT INTO products
      (id, slug, name, category, gender, price, compareAtPrice, description, artisan, material, color, sizes, image, gallery, rating, reviewCount, availability, featured, newArrival, handcrafted, stock, tags)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        product.id,
        product.slug,
        product.name,
        product.category,
        product.gender,
        product.price,
        product.compareAtPrice ?? null,
        product.description,
        product.artisan,
        product.material,
        product.color,
        json(product.sizes),
        product.image,
        json(product.gallery ?? []),
        product.rating ?? null,
        product.reviewCount ?? null,
        product.availability ?? null,
        product.featured ?? 0,
        product.newArrival ?? 0,
        product.handcrafted ?? 0,
        product.stock ?? 0,
        json(product.tags ?? []),
      ],
    );
  }
  return db;
}

export async function inspectTables() {
  const tables = await db.execute({
    sql: "SELECT name FROM sqlite_master WHERE type='table' ORDER BY name",
  });
  return tables?.rows ?? [];
}

export async function getTableData(name: string) {
  const safeName = String(name ?? '').replace(/[^a-zA-Z0-9_]/g, '');
  if (!safeName) return [];
  const result = await db.execute({ sql: `SELECT * FROM ${safeName}` });
  return result?.rows ?? [];
}

void initializeDatabase();