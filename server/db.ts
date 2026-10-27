import { createClient, type Client } from "@libsql/client";
import type { CartItem, PersistedOrder, Product } from "@/types";
import mockData from "@/data/mockData";

type DbShape = {
  client: Client;
  init: () => Promise<void>;
  seedItems: () => Promise<number>;
  listItems: () => Promise<Product[]>;
  getItemBySlug: (slug: string) => Promise<Product | null>;
  writeOrder: (order: Omit<PersistedOrder, "id" | "createdAt" | "updatedAt"> & Partial<Pick<PersistedOrder, "id" | "createdAt" | "updatedAt">>) => Promise<PersistedOrder>;
  listOrders: () => Promise<PersistedOrder[]>;
  getOrderById: (id: string) => Promise<PersistedOrder | null>;
};

const dbUrl = process.env.DB_URL ?? "file:local.db";
const client = createClient({ url: dbUrl });

const itemsTableSql = `
CREATE TABLE IF NOT EXISTS items (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  price INTEGER NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  collection TEXT NOT NULL,
  material TEXT NOT NULL,
  color TEXT NOT NULL,
  sizes TEXT NOT NULL,
  image TEXT NOT NULL,
  gallery TEXT,
  featured INTEGER DEFAULT 0,
  artisan TEXT,
  origin TEXT,
  inStock INTEGER DEFAULT 1
)`;

const ordersTableSql = `
CREATE TABLE IF NOT EXISTS orders (
  id TEXT PRIMARY KEY,
  cartId TEXT,
  customerName TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  pincode TEXT,
  notes TEXT,
  items TEXT NOT NULL,
  subtotal INTEGER NOT NULL,
  status TEXT NOT NULL CHECK(status IN ('draft','submitted','confirmed','cancelled')),
  createdAt TEXT NOT NULL,
  updatedAt TEXT
)`;

const toJson = (value: unknown) => JSON.stringify(value ?? null);
const fromJson = <T,>(value: string | null | undefined, fallback: T): T => {
  if (!value) return fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
};

const normalizeProduct = (row: Record<string, unknown>): Product => ({
  id: String(row.id ?? ""),
  name: String(row.name ?? ""),
  slug: String(row.slug ?? ""),
  price: Number(row.price ?? 0),
  description: String(row.description ?? ""),
  category: String(row.category ?? ""),
  collection: String(row.collection ?? ""),
  material: String(row.material ?? ""),
  color: String(row.color ?? ""),
  sizes: fromJson<string[]>(String(row.sizes ?? "[]"), []),
  image: String(row.image ?? ""),
  gallery: fromJson<string[] | undefined>(row.gallery as string | undefined, undefined),
  featured: Boolean(row.featured ?? false),
  artisan: String(row.artisan ?? ""),
  origin: String(row.origin ?? ""),
  inStock: Boolean(row.inStock ?? true),
});

const normalizeOrder = (row: Record<string, unknown>): PersistedOrder => ({
  id: String(row.id ?? ""),
  cartId: row.cartId ? String(row.cartId) : undefined,
  customerName: String(row.customerName ?? ""),
  email: String(row.email ?? ""),
  phone: row.phone ? String(row.phone) : undefined,
  address: row.address ? String(row.address) : undefined,
  city: row.city ? String(row.city) : undefined,
  state: row.state ? String(row.state) : undefined,
  pincode: row.pincode ? String(row.pincode) : undefined,
  notes: row.notes ? String(row.notes) : undefined,
  items: fromJson<CartItem[]>(String(row.items ?? "[]"), []),
  subtotal: Number(row.subtotal ?? 0),
  status: (String(row.status ?? "draft") as PersistedOrder["status"]) ?? "draft",
  createdAt: String(row.createdAt ?? new Date().toISOString()),
  updatedAt: row.updatedAt ? String(row.updatedAt) : undefined,
});

const seedProducts = (): Product[] => {
  const source = Array.isArray((mockData as { products?: Product[] } | undefined)?.products)
    ? ((mockData as { products?: Product[] }).products ?? [])
    : Array.isArray(mockData)
      ? (mockData as Product[])
      : [];
  return source.slice(0, 6).map((item, index) => ({
    ...item,
    id: item.id ?? `seed-${index + 1}`,
    slug: item.slug ?? `mojri-${index + 1}`,
    image: item.image ?? "",
    sizes: item.sizes ?? [],
    gallery: item.gallery ?? [],
    featured: item.featured ?? index < 2,
    inStock: item.inStock ?? true,
  }));
};

const init = async (): Promise<void> => {
  await client.execute(itemsTableSql);
  await client.execute(ordersTableSql);
  await seedItems();
};

const seedItems = async (): Promise<number> => {
  const items = seedProducts();
  let inserted = 0;
  for (const item of items) {
    const existing = await client.execute({
      sql: "SELECT id FROM items WHERE slug = ? LIMIT 1",
      args: [item.slug],
    });
    if ((existing.rows?.length ?? 0) > 0) continue;
    await client.execute({
      sql: `INSERT INTO items (id, name, slug, price, description, category, collection, material, color, sizes, image, gallery, featured, artisan, origin, inStock)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        item.id,
        item.name,
        item.slug,
        Math.round(item.price),
        item.description,
        item.category,
        item.collection,
        item.material,
        item.color,
        toJson(item.sizes ?? []),
        item.image,
        toJson(item.gallery ?? []),
        item.featured ? 1 : 0,
        item.artisan ?? null,
        item.origin ?? null,
        item.inStock ?? 1,
      ],
    });
    inserted += 1;
  }
  return inserted;
};

const listItems = async (): Promise<Product[]> => {
  const result = await client.execute("SELECT * FROM items ORDER BY featured DESC, name ASC");
  return (result.rows ?? []).map((row) => normalizeProduct(row as Record<string, unknown>));
};

const getItemBySlug = async (slug: string): Promise<Product | null> => {
  const result = await client.execute({
    sql: "SELECT * FROM items WHERE slug = ? LIMIT 1",
    args: [slug],
  });
  const row = result.rows?.[0];
  return row ? normalizeProduct(row as Record<string, unknown>) : null;
};

const writeOrder = async (
  order: Omit<PersistedOrder, "id" | "createdAt" | "updatedAt"> & Partial<Pick<PersistedOrder, "id" | "createdAt" | "updatedAt">>,
): Promise<PersistedOrder> => {
  const now = new Date().toISOString();
  const payload: PersistedOrder = {
    id: order.id ?? crypto.randomUUID(),
    cartId: order.cartId,
    customerName: order.customerName,
    email: order.email,
    phone: order.phone,
    address: order.address,
    city: order.city,
    state: order.state,
    pincode: order.pincode,
    notes: order.notes,
    items: order.items ?? [],
    subtotal: order.subtotal ?? 0,
    status: order.status ?? "draft",
    createdAt: order.createdAt ?? now,
    updatedAt: now,
  };
  await client.execute({
    sql: `INSERT INTO orders (id, cartId, customerName, email, phone, address, city, state, pincode, notes, items, subtotal, status, createdAt, updatedAt)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          ON CONFLICT(id) DO UPDATE SET
            cartId=excluded.cartId,
            customerName=excluded.customerName,
            email=excluded.email,
            phone=excluded.phone,
            address=excluded.address,
            city=excluded.city,
            state=excluded.state,
            pincode=excluded.pincode,
            notes=excluded.notes,
            items=excluded.items,
            subtotal=excluded.subtotal,
            status=excluded.status,
            updatedAt=excluded.updatedAt`,
    args: [
      payload.id,
      payload.cartId ?? null,
      payload.customerName,
      payload.email,
      payload.phone ?? null,
      payload.address ?? null,
      payload.city ?? null,
      payload.state ?? null,
      payload.pincode ?? null,
      payload.notes ?? null,
      toJson(payload.items ?? []),
      Math.round(payload.subtotal ?? 0),
      payload.status,
      payload.createdAt,
      payload.updatedAt ?? now,
    ],
  });
  return payload;
};

const listOrders = async (): Promise<PersistedOrder[]> => {
  const result = await client.execute("SELECT * FROM orders ORDER BY createdAt DESC");
  return (result.rows ?? []).map((row) => normalizeOrder(row as Record<string, unknown>));
};

const getOrderById = async (id: string): Promise<PersistedOrder | null> => {
  const result = await client.execute({
    sql: "SELECT * FROM orders WHERE id = ? LIMIT 1",
    args: [id],
  });
  const row = result.rows?.[0];
  return row ? normalizeOrder(row as Record<string, unknown>) : null;
};

const db: DbShape = { client, init, seedItems, listItems, getItemBySlug, writeOrder, listOrders, getOrderById };

export { client, init, seedItems, listItems, getItemBySlug, writeOrder, listOrders, getOrderById };
export default db;
