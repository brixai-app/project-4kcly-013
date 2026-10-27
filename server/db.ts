import { createClient } from '@libsql/client';
import type { CartItem, Order, Product } from '../src/types';
import mockData from '../src/data/mockData';

const db = createClient({ url: 'file:local.db' });

const productsTableSql = `
CREATE TABLE IF NOT EXISTS items (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  price INTEGER NOT NULL,
  image TEXT NOT NULL,
  description TEXT,
  artisan TEXT,
  material TEXT,
  sizes TEXT,
  featured INTEGER NOT NULL DEFAULT 0,
  inStock INTEGER NOT NULL DEFAULT 1,
  rating REAL,
  tags TEXT,
  createdAt TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
)`;

const ordersTableSql = `
CREATE TABLE IF NOT EXISTS orders (
  id TEXT PRIMARY KEY,
  items TEXT NOT NULL,
  shipping TEXT NOT NULL,
  paymentMethod TEXT NOT NULL,
  subtotal INTEGER NOT NULL,
  shippingFee INTEGER NOT NULL,
  total INTEGER NOT NULL,
  status TEXT NOT NULL,
  createdAt TEXT NOT NULL
)`;

let schemaReady: Promise<void> | null = null;

export async function initSchema(): Promise<void> {
  if (!schemaReady) {
    schemaReady = (async () => {
      await db.execute(productsTableSql);
      await db.execute(ordersTableSql);
    })();
  }
  return schemaReady;
}

export async function seedProducts(): Promise<void> {
  await initSchema();
  const products = (mockData?.products ?? []) as Product[];
  for (const product of products.slice(0, 6)) {
    await db.execute({
      sql: `INSERT OR IGNORE INTO items
        (id, name, category, price, image, description, artisan, material, sizes, featured, inStock, rating, tags)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        product?.id ?? '',
        product?.name ?? '',
        product?.category ?? '',
        Math.round(product?.price ?? 0),
        product?.image ?? '',
        product?.description ?? null,
        product?.artisan ?? null,
        product?.material ?? null,
        JSON.stringify(product?.sizes ?? []),
        product?.featured ? 1 : 0,
        product?.inStock === false ? 0 : 1,
        product?.rating ?? null,
        JSON.stringify(product?.tags ?? []),
      ],
    });
  }
}

export async function getItems(): Promise<Product[]> {
  await initSchema();
  const result = await db.execute('SELECT * FROM items ORDER BY featured DESC, createdAt DESC');
  return (result.rows ?? []).map((row: any) => ({
    id: String(row?.id ?? ''),
    name: String(row?.name ?? ''),
    category: String(row?.category ?? ''),
    price: Number(row?.price ?? 0),
    image: String(row?.image ?? ''),
    description: row?.description ?? undefined,
    artisan: row?.artisan ?? undefined,
    material: row?.material ?? undefined,
    sizes: safeParseArray(row?.sizes),
    featured: Boolean(row?.featured),
    inStock: row?.inStock !== 0,
    rating: row?.rating != null ? Number(row.rating) : undefined,
    tags: safeParseArray(row?.tags),
  }));
}

export async function getItemById(id: string): Promise<Product | null> {
  await initSchema();
  const result = await db.execute({ sql: 'SELECT * FROM items WHERE id = ? LIMIT 1', args: [id ?? ''] });
  const row = result.rows?.[0] as any | undefined;
  if (!row) return null;
  return {
    id: String(row?.id ?? ''),
    name: String(row?.name ?? ''),
    category: String(row?.category ?? ''),
    price: Number(row?.price ?? 0),
    image: String(row?.image ?? ''),
    description: row?.description ?? undefined,
    artisan: row?.artisan ?? undefined,
    material: row?.material ?? undefined,
    sizes: safeParseArray(row?.sizes),
    featured: Boolean(row?.featured),
    inStock: row?.inStock !== 0,
    rating: row?.rating != null ? Number(row.rating) : undefined,
    tags: safeParseArray(row?.tags),
  };
}

export async function saveOrder(order: Order): Promise<Order> {
  await initSchema();
  const payload = {
    id: order?.id ?? crypto.randomUUID(),
    items: order?.items ?? [],
    shipping: order?.shipping ?? ({} as Order['shipping']),
    paymentMethod: order?.paymentMethod ?? 'cod',
    subtotal: Math.round(order?.subtotal ?? 0),
    shippingFee: Math.round(order?.shippingFee ?? 0),
    total: Math.round(order?.total ?? 0),
    status: order?.status ?? 'pending',
    createdAt: order?.createdAt ?? new Date().toISOString(),
  };
  await db.execute({
    sql: `INSERT OR REPLACE INTO orders
      (id, items, shipping, paymentMethod, subtotal, shippingFee, total, status, createdAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    args: [
      payload.id,
      JSON.stringify(payload.items),
      JSON.stringify(payload.shipping),
      payload.paymentMethod,
      payload.subtotal,
      payload.shippingFee,
      payload.total,
      payload.status,
      payload.createdAt,
    ],
  });
  return payload;
}

export async function getOrderById(id: string): Promise<Order | null> {
  await initSchema();
  const result = await db.execute({ sql: 'SELECT * FROM orders WHERE id = ? LIMIT 1', args: [id ?? ''] });
  const row = result.rows?.[0] as any | undefined;
  if (!row) return null;
  return {
    id: String(row?.id ?? ''),
    items: safeParseJson(row?.items, []),
    shipping: safeParseJson(row?.shipping, {}),
    paymentMethod: (row?.paymentMethod ?? 'cod') as Order['paymentMethod'],
    subtotal: Number(row?.subtotal ?? 0),
    shippingFee: Number(row?.shippingFee ?? 0),
    total: Number(row?.total ?? 0),
    status: (row?.status ?? 'pending') as Order['status'],
    createdAt: String(row?.createdAt ?? new Date().toISOString()),
  };
}

function safeParseArray(value: unknown): string[] {
  const parsed = safeParseJson(value, []);
  return Array.isArray(parsed) ? parsed.map((item) => String(item ?? '')).filter(Boolean) : [];
}

function safeParseJson<T>(value: unknown, fallback: T): T {
  if (typeof value !== 'string' || !value) return fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

await initSchema();

export { db };
export default db;
// Auto-synthesized missing export
export const getItemById: any = {};

// Auto-synthesized missing export
export const getItems: any = {};

// Auto-synthesized missing export
export const initSchema: any = {};

// Auto-synthesized missing export
export const saveOrder: any = {};
