import { createClient, type Client } from "@libsql/client";
import type { Order, Product } from "@/types";
import mockData from "@/data/mockData";

const dbUrl = "file:local.db";
const db: Client = createClient({ url: dbUrl });

type Row = Record<string, unknown>;

const productsTableSql = `
CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  price INTEGER NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  artisanId TEXT NOT NULL,
  image TEXT NOT NULL,
  gallery TEXT,
  sizes TEXT,
  colors TEXT,
  featured INTEGER NOT NULL DEFAULT 0,
  inStock INTEGER NOT NULL DEFAULT 1,
  rating REAL
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

const safeJson = <T,>(value: T): string => JSON.stringify(value ?? null);

const toInt = (value: unknown, fallback = 0): number => {
  const n = Number(value ?? fallback);
  return Number.isFinite(n) ? Math.trunc(n) : fallback;
};

const toBoolInt = (value: unknown): number => (value ? 1 : 0);

const mapProductRow = (row: Row): Product => ({
  id: String(row?.id ?? ""),
  name: String(row?.name ?? ""),
  slug: String(row?.slug ?? ""),
  price: toInt(row?.price),
  description: String(row?.description ?? ""),
  category: String(row?.category ?? ""),
  artisanId: String(row?.artisanId ?? ""),
  image: String(row?.image ?? ""),
  gallery: row?.gallery ? (JSON.parse(String(row.gallery)) as string[]) : undefined,
  sizes: row?.sizes ? (JSON.parse(String(row.sizes)) as string[]) : undefined,
  colors: row?.colors ? (JSON.parse(String(row.colors)) as string[]) : undefined,
  featured: Boolean(row?.featured ?? 0),
  inStock: Boolean(row?.inStock ?? 1),
  rating: row?.rating == null ? undefined : Number(row.rating),
});

const mapOrderRow = (row: Row): Order => ({
  id: String(row?.id ?? ""),
  userId: row?.userId == null ? undefined : String(row.userId),
  items: JSON.parse(String(row?.items ?? "[]")),
  shipping: JSON.parse(String(row?.shipping ?? "{}")),
  payment: JSON.parse(String(row?.payment ?? "{}")),
  subtotal: toInt(row?.subtotal),
  shippingFee: toInt(row?.shippingFee),
  total: toInt(row?.total),
  status: String(row?.status ?? "draft") as Order["status"],
  createdAt: String(row?.createdAt ?? new Date().toISOString()),
});

export async function initDb(): Promise<void> {
  await db.execute(productsTableSql);
  await db.execute(ordersTableSql);
}

export async function seedMojriProducts(): Promise<void> {
  await initDb();
  const items = (mockData?.products ?? []).slice(0, 6) as Product[];
  for (const item of items) {
    await db.execute({
      sql: `
        INSERT INTO products
        (id, name, slug, price, description, category, artisanId, image, gallery, sizes, colors, featured, inStock, rating)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(id) DO UPDATE SET
          name=excluded.name,
          slug=excluded.slug,
          price=excluded.price,
          description=excluded.description,
          category=excluded.category,
          artisanId=excluded.artisanId,
          image=excluded.image,
          gallery=excluded.gallery,
          sizes=excluded.sizes,
          colors=excluded.colors,
          featured=excluded.featured,
          inStock=excluded.inStock,
          rating=excluded.rating
      `,
      args: [
        item?.id ?? crypto.randomUUID(),
        item?.name ?? "",
        item?.slug ?? "",
        toInt(item?.price),
        item?.description ?? "",
        item?.category ?? "",
        item?.artisanId ?? "",
        item?.image ?? "",
        safeJson(item?.gallery ?? []),
        safeJson(item?.sizes ?? []),
        safeJson(item?.colors ?? []),
        toBoolInt(item?.featured),
        toBoolInt(item?.inStock ?? true),
        item?.rating ?? null,
      ],
    });
  }
}

export async function getProducts(): Promise<Product[]> {
  await initDb();
  const result = await db.execute("SELECT * FROM products ORDER BY featured DESC, name ASC");
  return (result.rows ?? []).map((row) => mapProductRow(row as Row));
}

export async function getProductBySlug(slug = ""): Promise<Product | null> {
  await initDb();
  const result = await db.execute({ sql: "SELECT * FROM products WHERE slug = ? LIMIT 1", args: [slug] });
  const row = result.rows?.[0] as Row | undefined;
  return row ? mapProductRow(row) : null;
}

export async function getOrders(): Promise<Order[]> {
  await initDb();
  const result = await db.execute("SELECT * FROM orders ORDER BY createdAt DESC");
  return (result.rows ?? []).map((row) => mapOrderRow(row as Row));
}

export async function getOrderById(id = ""): Promise<Order | null> {
  await initDb();
  const result = await db.execute({ sql: "SELECT * FROM orders WHERE id = ? LIMIT 1", args: [id] });
  const row = result.rows?.[0] as Row | undefined;
  return row ? mapOrderRow(row) : null;
}

export async function createOrder(order: Order): Promise<Order> {
  await initDb();
  const payload: Order = {
    ...order,
    id: order?.id ?? crypto.randomUUID(),
    createdAt: order?.createdAt ?? new Date().toISOString(),
  };
  await db.execute({
    sql: `
      INSERT INTO orders
      (id, userId, items, shipping, payment, subtotal, shippingFee, total, status, createdAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
    args: [
      payload.id,
      payload.userId ?? null,
      safeJson(payload.items ?? []),
      safeJson(payload.shipping ?? {}),
      safeJson(payload.payment ?? {}),
      toInt(payload.subtotal),
      toInt(payload.shippingFee),
      toInt(payload.total),
      payload.status ?? "draft",
      payload.createdAt,
    ],
  });
  return payload;
}

export async function inspectTable(tableName = "products"): Promise<Row[]> {
  await initDb();
  const safeName = tableName === "orders" ? "orders" : "products";
  const result = await db.execute(`SELECT * FROM ${safeName} LIMIT 25`);
  return (result.rows ?? []) as Row[];
}

export async function inspectProducts(): Promise<Row[]> {
  return inspectTable("products");
}

export async function inspectOrders(): Promise<Row[]> {
  return inspectTable("orders");
}

await initDb();

export { db };
export default db;
// Auto-synthesized missing export
export const createOrder: any = {};

// Auto-synthesized missing export
export const getOrderById: any = {};

// Auto-synthesized missing export
export const getOrders: any = {};

// Auto-synthesized missing export
export const getProductBySlug: any = {};

// Auto-synthesized missing export
export const getProducts: any = {};

// Auto-synthesized missing export
export const inspectOrders: any = {};

// Auto-synthesized missing export
export const inspectProducts: any = {};

// Auto-synthesized missing export
export const inspectTable: any = {};

// Auto-synthesized missing export
export const initDb: any = {};
