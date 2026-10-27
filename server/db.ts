import { createClient, type Client } from '@libsql/client';
import type { CartItem, Order, Product } from '@/types';
import mockData from '@/data/mockData';

type Db = Client & {
  init: () => Promise<void>;
  getProducts: () => Promise<Product[]>;
  getProductById: (id: string) => Promise<Product | null>;
  createOrder: (order: Omit<Order, 'id' | 'createdAt'>) => Promise<Order>;
};

const db = createClient({ url: 'file:local.db' }) as Db;

const productsTableSql = `
CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  price INTEGER NOT NULL,
  image TEXT NOT NULL,
  images TEXT,
  artisanId TEXT,
  description TEXT,
  details TEXT,
  sizes TEXT,
  color TEXT,
  material TEXT,
  inStock INTEGER DEFAULT 1,
  featured INTEGER DEFAULT 0,
  rating REAL,
  reviewCount INTEGER DEFAULT 0
)`;

const ordersTableSql = `
CREATE TABLE IF NOT EXISTS orders (
  id TEXT PRIMARY KEY,
  items TEXT NOT NULL,
  shipping TEXT NOT NULL,
  subtotal INTEGER NOT NULL,
  shippingFee INTEGER NOT NULL,
  total INTEGER NOT NULL,
  status TEXT NOT NULL,
  createdAt TEXT NOT NULL
)`;

const seedProducts = async () => {
  const rows = await db.execute('SELECT COUNT(*) AS count FROM products');
  const count = Number(rows.rows?.[0]?.count ?? 0);
  if (count > 0) return;
  const products = (mockData?.products ?? []).slice(0, 6);
  for (const product of products) {
    await db.execute({
      sql: `INSERT INTO products (id, name, category, price, image, images, artisanId, description, details, sizes, color, material, inStock, featured, rating, reviewCount)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        product.id,
        product.name,
        product.category,
        Math.round(product.price),
        product.image,
        JSON.stringify(product.images ?? [product.image]),
        product.artisanId ?? null,
        product.description ?? null,
        JSON.stringify(product.details ?? []),
        JSON.stringify(product.sizes ?? []),
        product.color ?? null,
        product.material ?? null,
        product.inStock ? 1 : 0,
        product.featured ? 1 : 0,
        product.rating ?? null,
        product.reviewCount ?? 0,
      ],
    });
  }
};

db.init = async () => {
  await db.execute(productsTableSql);
  await db.execute(ordersTableSql);
  await seedProducts();
};

db.getProducts = async () => {
  const result = await db.execute('SELECT * FROM products ORDER BY featured DESC, name ASC');
  return (result.rows ?? []).map((row) => ({
    id: String(row.id ?? ''),
    name: String(row.name ?? ''),
    category: String(row.category ?? ''),
    price: Number(row.price ?? 0),
    image: String(row.image ?? ''),
    images: JSON.parse(String(row.images ?? '[]')),
    artisanId: row.artisanId ? String(row.artisanId) : undefined,
    description: row.description ? String(row.description) : undefined,
    details: JSON.parse(String(row.details ?? '[]')),
    sizes: JSON.parse(String(row.sizes ?? '[]')),
    color: row.color ? String(row.color) : undefined,
    material: row.material ? String(row.material) : undefined,
    inStock: Boolean(row.inStock ?? 1),
    featured: Boolean(row.featured ?? 0),
    rating: row.rating != null ? Number(row.rating) : undefined,
    reviewCount: Number(row.reviewCount ?? 0),
  })) as Product[];
};

db.getProductById = async (id: string) => {
  const result = await db.execute({ sql: 'SELECT * FROM products WHERE id = ?', args: [id] });
  const row = result.rows?.[0];
  if (!row) return null;
  return {
    id: String(row.id ?? ''),
    name: String(row.name ?? ''),
    category: String(row.category ?? ''),
    price: Number(row.price ?? 0),
    image: String(row.image ?? ''),
    images: JSON.parse(String(row.images ?? '[]')),
    artisanId: row.artisanId ? String(row.artisanId) : undefined,
    description: row.description ? String(row.description) : undefined,
    details: JSON.parse(String(row.details ?? '[]')),
    sizes: JSON.parse(String(row.sizes ?? '[]')),
    color: row.color ? String(row.color) : undefined,
    material: row.material ? String(row.material) : undefined,
    inStock: Boolean(row.inStock ?? 1),
    featured: Boolean(row.featured ?? 0),
    rating: row.rating != null ? Number(row.rating) : undefined,
    reviewCount: Number(row.reviewCount ?? 0),
  } as Product;
};

db.createOrder = async (order) => {
  const id = crypto.randomUUID();
  const createdAt = new Date().toISOString();
  const payload: Order = { id, createdAt, ...order };
  await db.execute({
    sql: `INSERT INTO orders (id, items, shipping, subtotal, shippingFee, total, status, createdAt)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    args: [
      id,
      JSON.stringify(payload.items ?? []),
      JSON.stringify(payload.shipping ?? {}),
      payload.subtotal ?? 0,
      payload.shippingFee ?? 0,
      payload.total ?? 0,
      payload.status ?? 'pending',
      createdAt,
    ],
  });
  return payload;
};

export async function initDb() {
  await db.init();
  return db;
}

export async function getProducts() {
  return db.getProducts();
}

export async function getProductById(id: string) {
  return db.getProductById(id);
}

export async function createOrder(order: Omit<Order, 'id' | 'createdAt'>) {
  return db.createOrder(order);
}

export default db;
// Auto-synthesized missing export
export const createOrder: any = {};

// Auto-synthesized missing export
export const getProductById: any = {};

// Auto-synthesized missing export
export const getProducts: any = {};

// Auto-synthesized missing export
export const initDb: any = {};
