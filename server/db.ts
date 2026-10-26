// [auto-quarantined uninstalled package "@libsql/client"] import { createClient, type Client } from '@libsql/client';
const createClient: any = typeof Proxy !== 'undefined' ? new Proxy((() => null) as any, { get: () => createClient, apply: () => null }) : (() => null);
const type Client: any = typeof Proxy !== 'undefined' ? new Proxy((() => null) as any, { get: () => type Client, apply: () => null }) : (() => null);
import type { Artisan, CartItem, Order, Product } from '../src/types';
import mockData from '../src/data/mockData';

type DbRow = Record<string, unknown>;

const url = (import.meta as { env?: Record<string, string | undefined> })?.env?.VITE_LIBSQL_URL ?? '';
const authToken = (import.meta as { env?: Record<string, string | undefined> })?.env?.VITE_LIBSQL_AUTH_TOKEN ?? '';

const db: Client = createClient({
  url: url || 'file:./jootiya.db',
  authToken: authToken || undefined,
});

const productsTableSql = `
CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  price INTEGER NOT NULL,
  description TEXT NOT NULL,
  image TEXT NOT NULL,
  gallery TEXT,
  artisanId TEXT,
  artisanName TEXT,
  colors TEXT,
  sizes TEXT,
  featured INTEGER DEFAULT 0,
  inStock INTEGER DEFAULT 1,
  material TEXT,
  craftsmanship TEXT
)`;

const ordersTableSql = `
CREATE TABLE IF NOT EXISTS orders (
  id TEXT PRIMARY KEY,
  userId TEXT,
  items TEXT NOT NULL,
  shipping TEXT NOT NULL,
  payment TEXT NOT NULL,
  subtotal INTEGER NOT NULL,
  shippingFee INTEGER NOT NULL,
  total INTEGER NOT NULL,
  status TEXT NOT NULL,
  createdAt TEXT NOT NULL
)`;

const artisansTableSql = `
CREATE TABLE IF NOT EXISTS artisans (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  location TEXT NOT NULL,
  lineage TEXT NOT NULL,
  specialty TEXT NOT NULL,
  portraitUrl TEXT
)`;

const toJson = (value: unknown) => JSON.stringify(value ?? null);
const fromJson = <T,>(value: unknown, fallback: T): T => {
  if (typeof value !== 'string' || !value) return fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
};

const normalizeProduct = (row: DbRow): Product => ({
  id: String(row?.id ?? ''),
  slug: String(row?.slug ?? ''),
  name: String(row?.name ?? ''),
  category: String(row?.category ?? 'mojri') as Product['category'],
  price: Number(row?.price ?? 0),
  description: String(row?.description ?? ''),
  image: String(row?.image ?? ''),
  gallery: fromJson<string[]>(row?.gallery, []),
  artisanId: row?.artisanId ? String(row?.artisanId) : undefined,
  artisanName: row?.artisanName ? String(row?.artisanName) : undefined,
  colors: fromJson(row?.colors, undefined as Product['colors']),
  sizes: fromJson(row?.sizes, undefined as Product['sizes']),
  featured: Boolean(Number(row?.featured ?? 0)),
  inStock: Boolean(Number(row?.inStock ?? 1)),
  material: row?.material ? String(row?.material) : undefined,
  craftsmanship: row?.craftsmanship ? String(row?.craftsmanship) : undefined,
});

const normalizeOrder = (row: DbRow): Order => ({
  id: String(row?.id ?? ''),
  userId: row?.userId ? String(row?.userId) : undefined,
  items: fromJson<CartItem[]>(row?.items, []),
  shipping: fromJson<Order['shipping']>(row?.shipping, {
    fullName: '',
    email: '',
    phone: '',
    addressLine1: '',
    city: '',
    state: '',
    postalCode: '',
    country: '',
  }),
  payment: fromJson<Order['payment']>(row?.payment, { method: 'cod' }),
  subtotal: Number(row?.subtotal ?? 0),
  shippingFee: Number(row?.shippingFee ?? 0),
  total: Number(row?.total ?? 0),
  status: String(row?.status ?? 'pending') as Order['status'],
  createdAt: String(row?.createdAt ?? new Date().toISOString()),
});

export async function initDb(): Promise<void> {
  await db.execute(artisansTableSql);
  await db.execute(productsTableSql);
  await db.execute(ordersTableSql);
}

export async function seedDb(): Promise<void> {
  await initDb();
  const artisans = (mockData?.artisans ?? []) as Artisan[];
  const products = (mockData?.products ?? []) as Product[];

  for (const artisan of artisans) {
    await db.execute({
      sql: `INSERT OR IGNORE INTO artisans (id, name, location, lineage, specialty, portraitUrl) VALUES (?, ?, ?, ?, ?, ?)`,
      args: [artisan?.id ?? '', artisan?.name ?? '', artisan?.location ?? '', artisan?.lineage ?? '', artisan?.specialty ?? '', artisan?.portraitUrl ?? null],
    });
  }

  for (const product of products) {
    await db.execute({
      sql: `INSERT OR IGNORE INTO products (id, slug, name, category, price, description, image, gallery, artisanId, artisanName, colors, sizes, featured, inStock, material, craftsmanship)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        product?.id ?? '',
        product?.slug ?? '',
        product?.name ?? '',
        product?.category ?? 'mojri',
        product?.price ?? 0,
        product?.description ?? '',
        product?.image ?? '',
        toJson(product?.gallery ?? []),
        product?.artisanId ?? null,
        product?.artisanName ?? null,
        toJson(product?.colors ?? []),
        toJson(product?.sizes ?? []),
        product?.featured ? 1 : 0,
        product?.inStock === false ? 0 : 1,
        product?.material ?? null,
        product?.craftsmanship ?? null,
      ],
    });
  }
}

export async function getProducts(): Promise<Product[]> {
  await initDb();
  const result = await db.execute(`SELECT * FROM products ORDER BY featured DESC, name ASC`);
  return (result?.rows ?? []).map((row) => normalizeProduct(row as DbRow));
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  await initDb();
  const result = await db.execute({ sql: `SELECT * FROM products WHERE slug = ? LIMIT 1`, args: [slug] });
  const row = result?.rows?.[0] as DbRow | undefined;
  return row ? normalizeProduct(row) : null;
}

export async function getProductById(id: string): Promise<Product | null> {
  await initDb();
  const result = await db.execute({ sql: `SELECT * FROM products WHERE id = ? LIMIT 1`, args: [id] });
  const row = result?.rows?.[0] as DbRow | undefined;
  return row ? normalizeProduct(row) : null;
}

export async function getOrders(): Promise<Order[]> {
  await initDb();
  const result = await db.execute(`SELECT * FROM orders ORDER BY createdAt DESC`);
  return (result?.rows ?? []).map((row) => normalizeOrder(row as DbRow));
}

export async function getOrderById(id: string): Promise<Order | null> {
  await initDb();
  const result = await db.execute({ sql: `SELECT * FROM orders WHERE id = ? LIMIT 1`, args: [id] });
  const row = result?.rows?.[0] as DbRow | undefined;
  return row ? normalizeOrder(row) : null;
}

export async function insertOrder(order: Order): Promise<Order> {
  await initDb();
  await db.execute({
    sql: `INSERT INTO orders (id, userId, items, shipping, payment, subtotal, shippingFee, total, status, createdAt)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    args: [
      order?.id ?? crypto.randomUUID(),
      order?.userId ?? null,
      toJson(order?.items ?? []),
      toJson(order?.shipping ?? null),
      toJson(order?.payment ?? null),
      order?.subtotal ?? 0,
      order?.shippingFee ?? 0,
      order?.total ?? 0,
      order?.status ?? 'pending',
      order?.createdAt ?? new Date().toISOString(),
    ],
  });
  return order;
}

export async function getDbStats(): Promise<{ products: number; orders: number; artisans: number }> {
  await initDb();
  const [products, orders, artisans] = await Promise.all([
    db.execute(`SELECT COUNT(*) AS count FROM products`),
    db.execute(`SELECT COUNT(*) AS count FROM orders`),
    db.execute(`SELECT COUNT(*) AS count FROM artisans`),
  ]);
  return {
    products: Number(products?.rows?.[0]?.count ?? 0),
    orders: Number(orders?.rows?.[0]?.count ?? 0),
    artisans: Number(artisans?.rows?.[0]?.count ?? 0),
  };
}

export async function clearOrders(): Promise<void> {
  await initDb();
  await db.execute(`DELETE FROM orders`);
}

export default db;