// [auto-quarantined uninstalled package "@libsql/client"] import { createClient, type Client } from '@libsql/client';
const createClient: any = typeof Proxy !== 'undefined' ? new Proxy((() => null) as any, { get: () => createClient, apply: () => null }) : (() => null);
const type Client: any = typeof Proxy !== 'undefined' ? new Proxy((() => null) as any, { get: () => type Client, apply: () => null }) : (() => null);
import type { CartItem, Order, Product, ProductCategory, ShippingMethod } from '../src/types';

type DbProductRow = {
  id: string;
  slug: string;
  name: string;
  category: ProductCategory;
  price: number;
  compareAtPrice: number | null;
  description: string;
  image: string;
  gallery: string;
  artisanId: string | null;
  sizes: string;
  colors: string | null;
  inStock: number;
  featured: number;
  newArrival: number;
  rating: number | null;
  reviewCount: number | null;
  material: string | null;
  care: string | null;
};

type DbOrderRow = {
  id: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string | null;
  items: string;
  subtotal: number;
  shipping: number;
  total: number;
  shippingMethodId: string;
  shippingMethodLabel: string;
  shippingMethodEta: string;
  paymentMethod: string;
  status: string;
  createdAt: string;
};

const db: Client = createClient({ url: 'file:local.db' });

const shippingMethods: ShippingMethod[] = [
  { id: 'standard', label: 'Standard Delivery', eta: '4-6 business days', price: 0 },
  { id: 'express', label: 'Express Delivery', eta: '2-3 business days', price: 249 },
  { id: 'priority', label: 'Priority Delivery', eta: 'Next business day', price: 499 },
];

const seedProducts: Product[] = [
  {
    id: 'mj-001',
    slug: 'amber-thread-mojri',
    name: 'Amber Thread Mojri',
    category: 'Mojri',
    price: 2499,
    compareAtPrice: 3299,
    description: 'Hand-finished leather mojri with tonal embroidery and a softly structured toe.',
    image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=800&q=80',
    gallery: ['https://images.unsplash.com/photo-1533867617858-e7b97e060509?auto=format&fit=crop&w=800&q=80'],
    artisanId: 'artisan-1',
    sizes: ['6', '7', '8', '9', '10'],
    colors: ['Amber', 'Sand'],
    inStock: true,
    featured: true,
    newArrival: false,
    rating: 4.8,
    reviewCount: 128,
    material: 'Full-grain leather',
    care: 'Store in dust bag; wipe with dry cloth.',
  },
  {
    id: 'mj-002',
    slug: 'noor-stitched-jutti',
    name: 'Noor Stitched Jutti',
    category: 'Jutti',
    price: 2899,
    compareAtPrice: null,
    description: 'A refined jutti with mirror-inspired threadwork and a cushioned inner sole.',
    image: 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&w=800&q=80',
    gallery: ['https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=1400&q=85'],
    artisanId: 'artisan-2',
    sizes: ['6', '7', '8', '9'],
    colors: ['Ivory', 'Gold'],
    inStock: true,
    featured: true,
    newArrival: true,
    rating: 4.9,
    reviewCount: 84,
    material: 'Leather and silk thread',
    care: 'Avoid moisture; air dry naturally.',
  },
  {
    id: 'mj-003',
    slug: 'desert-weave-kolhapuri',
    name: 'Desert Weave Kolhapuri',
    category: 'Kolhapuri',
    price: 2199,
    compareAtPrice: 2699,
    description: 'Open-weave Kolhapuri with a sculpted strap and a matte antique finish.',
    image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1400&q=85',
    gallery: ['https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=1400&q=85'],
    artisanId: 'artisan-3',
    sizes: ['7', '8', '9', '10'],
    colors: ['Tan', 'Cocoa'],
    inStock: true,
    featured: false,
    newArrival: true,
    rating: 4.7,
    reviewCount: 61,
    material: 'Vegetable-tanned leather',
    care: 'Keep away from direct heat.',
  },
  {
    id: 'mj-004',
    slug: 'atelier-buckle-accessory',
    name: 'Atelier Buckle Accessory',
    category: 'Accessories',
    price: 899,
    compareAtPrice: null,
    description: 'A minimal shoe accessory designed to elevate ceremonial and everyday pairs.',
    image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=1400&q=85',
    gallery: [],
    artisanId: null,
    sizes: ['One Size'],
    colors: ['Brass'],
    inStock: true,
    featured: false,
    newArrival: false,
    rating: 4.6,
    reviewCount: 22,
    material: 'Brass alloy',
    care: 'Polish gently with a soft cloth.',
  },
  {
    id: 'mj-005',
    slug: 'heritage-loom-mojri',
    name: 'Heritage Loom Mojri',
    category: 'Best Sellers',
    price: 3199,
    compareAtPrice: 3899,
    description: 'A signature silhouette with dense handloom detailing and a formal profile.',
    image: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=1400&q=85',
    gallery: [],
    artisanId: 'artisan-1',
    sizes: ['6', '7', '8', '9', '10', '11'],
    colors: ['Chestnut', 'Black'],
    inStock: true,
    featured: true,
    newArrival: false,
    rating: 5,
    reviewCount: 201,
    material: 'Leather, cotton thread',
    care: 'Use a neutral conditioner sparingly.',
  },
  {
    id: 'mj-006',
    slug: 'sunlit-archive-jutti',
    name: 'Sunlit Archive Jutti',
    category: 'New In',
    price: 2699,
    compareAtPrice: null,
    description: 'A fresh archival interpretation with luminous stitching and a softened edge.',
    image: 'https://images.unsplash.com/photo-1533867617858-e7b97e060509?auto=format&fit=crop&w=800&q=80',
    gallery: [],
    artisanId: 'artisan-2',
    sizes: ['6', '7', '8', '9'],
    colors: ['Pearl', 'Saffron'],
    inStock: true,
    featured: false,
    newArrival: true,
    rating: 4.8,
    reviewCount: 39,
    material: 'Leather, silk thread',
    care: 'Store flat and dry.',
  },
];

const toJson = (value: unknown) => JSON.stringify(value ?? null);
const fromJson = <T,>(value: string | null | undefined, fallback: T): T => {
  try {
    return (value ? JSON.parse(value) : fallback) as T;
  } catch {
    return fallback;
  }
};

export async function initDb(): Promise<void> {
  await db.execute(`
    CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY,
      slug TEXT NOT NULL UNIQUE,
      name TEXT NOT NULL,
      category TEXT NOT NULL,
      price INTEGER NOT NULL,
      compareAtPrice INTEGER,
      description TEXT NOT NULL,
      image TEXT NOT NULL,
      gallery TEXT NOT NULL,
      artisanId TEXT,
      sizes TEXT NOT NULL,
      colors TEXT,
      inStock INTEGER NOT NULL DEFAULT 1,
      featured INTEGER NOT NULL DEFAULT 0,
      newArrival INTEGER NOT NULL DEFAULT 0,
      rating REAL,
      reviewCount INTEGER,
      material TEXT,
      care TEXT
    );
  `);
  await db.execute(`
    CREATE TABLE IF NOT EXISTS orders (
      id TEXT PRIMARY KEY,
      customerId TEXT NOT NULL,
      customerName TEXT NOT NULL,
      customerEmail TEXT NOT NULL,
      customerPhone TEXT,
      items TEXT NOT NULL,
      subtotal INTEGER NOT NULL,
      shipping INTEGER NOT NULL,
      total INTEGER NOT NULL,
      shippingMethodId TEXT NOT NULL,
      shippingMethodLabel TEXT NOT NULL,
      shippingMethodEta TEXT NOT NULL,
      paymentMethod TEXT NOT NULL,
      status TEXT NOT NULL,
      createdAt TEXT NOT NULL
    );
  `);
}

export async function seedCatalog(): Promise<void> {
  await initDb();
  for (const product of seedProducts) {
    await db.execute({
      sql: `
        INSERT INTO products (
          id, slug, name, category, price, compareAtPrice, description, image, gallery,
          artisanId, sizes, colors, inStock, featured, newArrival, rating, reviewCount, material, care
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(id) DO UPDATE SET
          slug=excluded.slug, name=excluded.name, category=excluded.category, price=excluded.price,
          compareAtPrice=excluded.compareAtPrice, description=excluded.description, image=excluded.image,
          gallery=excluded.gallery, artisanId=excluded.artisanId, sizes=excluded.sizes, colors=excluded.colors,
          inStock=excluded.inStock, featured=excluded.featured, newArrival=excluded.newArrival,
          rating=excluded.rating, reviewCount=excluded.reviewCount, material=excluded.material, care=excluded.care;
      `,
      args: [
        product.id, product.slug, product.name, product.category, product.price, product.compareAtPrice ?? null,
        product.description, product.image, toJson(product.gallery ?? []), product.artisanId ?? null,
        toJson(product.sizes ?? []), toJson(product.colors ?? []), product.inStock ? 1 : 0,
        product.featured ? 1 : 0, product.newArrival ? 1 : 0, product.rating ?? null, product.reviewCount ?? null,
        product.material ?? null, product.care ?? null,
      ],
    });
  }
}

export async function getCatalog(): Promise<Product[]> {
  await initDb();
  const result = await db.execute('SELECT * FROM products ORDER BY featured DESC, newArrival DESC, name ASC');
  return (result.rows as unknown as DbProductRow[]).map((row) => ({
    id: row.id,
    slug: row.slug,
    name: row.name,
    category: row.category,
    price: row.price,
    compareAtPrice: row.compareAtPrice ?? null,
    description: row.description,
    image: row.image,
    gallery: fromJson<string[]>(row.gallery, []),
    artisanId: row.artisanId ?? null,
    sizes: fromJson<string[]>(row.sizes, []),
    colors: row.colors ? fromJson<string[]>(row.colors, []) : undefined,
    inStock: Boolean(row.inStock),
    featured: Boolean(row.featured),
    newArrival: Boolean(row.newArrival),
    rating: row.rating ?? undefined,
    reviewCount: row.reviewCount ?? undefined,
    material: row.material ?? undefined,
    care: row.care ?? undefined,
  }));
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  await initDb();
  const result = await db.execute({ sql: 'SELECT * FROM products WHERE slug = ? LIMIT 1', args: [slug] });
  const row = result.rows?.[0] as unknown as DbProductRow | undefined;
  return row ? (await getCatalog()).find((product) => product.slug === slug) ?? null : null;
}

export async function writeOrder(order: Order): Promise<void> {
  await initDb();
  await db.execute({
    sql: `
      INSERT INTO orders (
        id, customerId, customerName, customerEmail, customerPhone, items, subtotal, shipping, total,
        shippingMethodId, shippingMethodLabel, shippingMethodEta, paymentMethod, status, createdAt
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
    args: [
      order.id,
      order.customer?.id ?? '',
      order.customer?.name ?? '',
      order.customer?.email ?? '',
      order.customer?.phone ?? null,
      toJson(order.items ?? []),
      order.subtotal ?? 0,
      order.shipping ?? 0,
      order.total ?? 0,
      order.shippingMethod?.id ?? '',
      order.shippingMethod?.label ?? '',
      order.shippingMethod?.eta ?? '',
      order.paymentMethod ?? 'card',
      order.status ?? 'pending',
      order.createdAt ?? new Date().toISOString(),
    ],
  });
}

export async function getOrders(): Promise<Order[]> {
  await initDb();
  const result = await db.execute('SELECT * FROM orders ORDER BY createdAt DESC');
  return (result.rows as unknown as DbOrderRow[]).map((row) => ({
    id: row.id,
    customer: {
      id: row.customerId,
      name: row.customerName,
      email: row.customerEmail,
      phone: row.customerPhone,
    },
    items: fromJson<CartItem[]>(row.items, []),
    subtotal: row.subtotal,
    shipping: row.shipping,
    total: row.total,
    shippingMethod: {
      id: row.shippingMethodId,
      label: row.shippingMethodLabel,
      eta: row.shippingMethodEta,
      price: row.shipping,
    },
    paymentMethod: row.paymentMethod as Order['paymentMethod'],
    status: row.status as Order['status'],
    createdAt: row.createdAt,
  }));
}

export async function inspectTables(): Promise<string[]> {
  await initDb();
  const result = await db.execute("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name ASC");
  return result.rows?.map((row) => String((row as { name?: string })?.name ?? '')).filter(Boolean) ?? [];
}

export { db, shippingMethods, seedProducts };
export default db;
// Auto-synthesized missing export
export const getCatalog: any = {};

// Auto-synthesized missing export
export const getOrders: any = {};

// Auto-synthesized missing export
export const initDb: any = {};

// Auto-synthesized missing export
export const inspectTables: any = {};

// Auto-synthesized missing export
export const seedCatalog: any = {};

// Auto-synthesized missing export
export const writeOrder: any = {};
