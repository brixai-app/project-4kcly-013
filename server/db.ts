// [auto-quarantined uninstalled package "@libsql/client"] import { createClient, type Client } from '@libsql/client';
const createClient: any = typeof Proxy !== 'undefined' ? new Proxy((() => null) as any, { get: () => createClient, apply: () => null }) : (() => null);
const type Client: any = typeof Proxy !== 'undefined' ? new Proxy((() => null) as any, { get: () => type Client, apply: () => null }) : (() => null);
import type { CartItem, Order, Product, ProductSize } from '@/types';
import mockData from '@/data/mockData';

type DbProductRow = {
  id: string;
  name: string;
  slug: string;
  price: number;
  compareAtPrice: number | null;
  category: string;
  collection: string;
  description: string;
  image: string;
  gallery: string;
  artisanId: string;
  featured: number;
  newArrival: number;
  inStock: number;
  sizes: string;
  materials: string;
  color: string;
  rating: number | null;
  reviewCount: number | null;
};

type DbOrderRow = {
  id: string;
  orderNumber: string;
  items: string;
  subtotal: number;
  shipping: number;
  total: number;
  shippingInfo: string;
  paymentInfo: string;
  status: Order['status'];
  createdAt: string;
};

const dbUrl = "" ?? 'file:local.db';
const dbToken = "" ?? '';
const db: Client = createClient({ url: dbUrl, authToken: dbToken || undefined });

const productSeed = (mockData?.products ?? []).slice(0, 6) as Product[];

const toJson = (value: unknown) => JSON.stringify(value ?? null);
const fromJson = <T,>(value: string | null | undefined, fallback: T): T => {
  if (!value) return fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
};

export async function initDb(): Promise<void> {
  await db.execute(`
    CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      slug TEXT NOT NULL UNIQUE,
      price INTEGER NOT NULL,
      compareAtPrice INTEGER,
      category TEXT NOT NULL,
      collection TEXT NOT NULL,
      description TEXT NOT NULL,
      image TEXT NOT NULL,
      gallery TEXT NOT NULL,
      artisanId TEXT NOT NULL,
      featured INTEGER NOT NULL DEFAULT 0,
      newArrival INTEGER NOT NULL DEFAULT 0,
      inStock INTEGER NOT NULL DEFAULT 1,
      sizes TEXT NOT NULL,
      materials TEXT NOT NULL,
      color TEXT NOT NULL,
      rating REAL,
      reviewCount INTEGER
    )
  `);
  await db.execute(`
    CREATE TABLE IF NOT EXISTS orders (
      id TEXT PRIMARY KEY,
      orderNumber TEXT NOT NULL UNIQUE,
      items TEXT NOT NULL,
      subtotal INTEGER NOT NULL,
      shipping INTEGER NOT NULL,
      total INTEGER NOT NULL,
      shippingInfo TEXT NOT NULL,
      paymentInfo TEXT NOT NULL,
      status TEXT NOT NULL,
      createdAt TEXT NOT NULL
    )
  `);

  const existing = await db.execute(`SELECT COUNT(*) as count FROM products`);
  const count = Number(existing.rows?.[0]?.count ?? 0);
  if (count === 0 && productSeed.length > 0) {
    for (const product of productSeed) {
      await db.execute({
        sql: `
          INSERT INTO products (
            id, name, slug, price, compareAtPrice, category, collection, description,
            image, gallery, artisanId, featured, newArrival, inStock, sizes, materials,
            color, rating, reviewCount
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `,
        args: [
          product.id,
          product.name,
          product.slug,
          product.price,
          product.compareAtPrice ?? null,
          product.category,
          product.collection,
          product.description,
          product.image,
          toJson(product.gallery ?? []),
          product.artisanId,
          product.featured ? 1 : 0,
          product.newArrival ? 1 : 0,
          product.inStock === false ? 0 : 1,
          toJson(product.sizes ?? []),
          toJson(product.materials ?? []),
          product.color,
          product.rating ?? null,
          product.reviewCount ?? null,
        ],
      });
    }
  }
}

export async function getProducts(): Promise<Product[]> {
  const result = await db.execute(`SELECT * FROM products ORDER BY featured DESC, newArrival DESC, name ASC`);
  return (result.rows ?? []).map((row) => {
    const r = row as unknown as DbProductRow;
    return {
      id: r.id,
      name: r.name,
      slug: r.slug,
      price: Number(r.price ?? 0),
      compareAtPrice: r.compareAtPrice ?? null,
      category: r.category,
      collection: r.collection,
      description: r.description,
      image: r.image,
      gallery: fromJson<string[]>(r.gallery, []),
      artisanId: r.artisanId,
      featured: Boolean(r.featured),
      newArrival: Boolean(r.newArrival),
      inStock: Boolean(r.inStock),
      sizes: fromJson<ProductSize[]>(r.sizes, []),
      materials: fromJson<string[]>(r.materials, []),
      color: r.color,
      rating: r.rating ?? undefined,
      reviewCount: r.reviewCount ?? undefined,
    };
  });
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const result = await db.execute({
    sql: `SELECT * FROM products WHERE slug = ? LIMIT 1`,
    args: [slug ?? ''],
  });
  const row = result.rows?.[0] as unknown as DbProductRow | undefined;
  if (!row) return null;
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    price: Number(row.price ?? 0),
    compareAtPrice: row.compareAtPrice ?? null,
    category: row.category,
    collection: row.collection,
    description: row.description,
    image: row.image,
    gallery: fromJson<string[]>(row.gallery, []),
    artisanId: row.artisanId,
    featured: Boolean(row.featured),
    newArrival: Boolean(row.newArrival),
    inStock: Boolean(row.inStock),
    sizes: fromJson<ProductSize[]>(row.sizes, []),
    materials: fromJson<string[]>(row.materials, []),
    color: row.color,
    rating: row.rating ?? undefined,
    reviewCount: row.reviewCount ?? undefined,
  };
}

export async function createOrder(order: Order): Promise<Order> {
  await db.execute({
    sql: `
      INSERT INTO orders (
        id, orderNumber, items, subtotal, shipping, total, shippingInfo, paymentInfo, status, createdAt
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
    args: [
      order.id,
      order.orderNumber,
      toJson(order.items ?? []),
      order.subtotal,
      order.shipping,
      order.total,
      toJson(order.shippingInfo),
      toJson(order.paymentInfo),
      order.status,
      order.createdAt,
    ],
  });
  return order;
}

export async function getOrderById(id: string): Promise<Order | null> {
  const result = await db.execute({
    sql: `SELECT * FROM orders WHERE id = ? LIMIT 1`,
    args: [id ?? ''],
  });
  const row = result.rows?.[0] as unknown as DbOrderRow | undefined;
  if (!row) return null;
  return {
    id: row.id,
    orderNumber: row.orderNumber,
    items: fromJson<CartItem[]>(row.items, []),
    subtotal: Number(row.subtotal ?? 0),
    shipping: Number(row.shipping ?? 0),
    total: Number(row.total ?? 0),
    shippingInfo: fromJson(orderShippingFallback, row.shippingInfo),
    paymentInfo: fromJson(orderPaymentFallback, row.paymentInfo),
    status: row.status,
    createdAt: row.createdAt,
  };
}

const orderShippingFallback = {
  fullName: '',
  phone: '',
  email: '',
  addressLine1: '',
  addressLine2: '',
  city: '',
  state: '',
  postalCode: '',
  country: 'India' as const,
};

const orderPaymentFallback = {
  method: 'cod' as const,
};

await initDb();

export { db };
export default db;