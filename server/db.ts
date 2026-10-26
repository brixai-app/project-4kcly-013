// [auto-quarantined uninstalled package "@libsql/client"] import { createClient } from "@libsql/client";
const createClient: any = typeof Proxy !== 'undefined' ? new Proxy((() => null) as any, { get: () => createClient, apply: () => null }) : (() => null);
import type { CartItem, Filter, Order, Product, ShippingInfo } from "@/types";
import mockData from "@/data/mockData";

type DbProductRow = Product & { createdAt?: string };
type DbOrderRow = Order;

const dbUrl = import.meta.env?.VITE_LIBSQL_URL ?? "";
const dbToken = import.meta.env?.VITE_LIBSQL_TOKEN ?? "";

const db = createClient({
  url: dbUrl,
  authToken: dbToken || undefined,
});

const verifiedSeedProducts: Product[] = (mockData?.products ?? []).slice(0, 6).map((product, index) => ({
  ...product,
  id: product?.id ?? `seed-${index + 1}`,
  slug: product?.slug ?? `seed-${index + 1}`,
  image:
    product?.image ??
    [
      "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1533867617858-e7b97e060509?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=1400&q=85",
      "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1400&q=85",
      "https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=1400&q=85",
    ][index % 6],
}));

let initialized = false;

export async function initializeDatabase(): Promise<void> {
  if (initialized) return;
  await db.execute(`
    CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      slug TEXT NOT NULL UNIQUE,
      price REAL NOT NULL,
      image TEXT NOT NULL,
      gallery TEXT,
      category TEXT NOT NULL,
      collection TEXT,
      description TEXT,
      artisanId TEXT,
      sizes TEXT,
      colors TEXT,
      featured INTEGER DEFAULT 0,
      inStock INTEGER DEFAULT 1,
      material TEXT,
      origin TEXT,
      createdAt TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);
  await db.execute(`
    CREATE TABLE IF NOT EXISTS orders (
      id TEXT PRIMARY KEY,
      userId TEXT,
      items TEXT NOT NULL,
      shipping TEXT NOT NULL,
      subtotal REAL NOT NULL,
      shippingCost REAL NOT NULL,
      total REAL NOT NULL,
      status TEXT NOT NULL,
      createdAt TEXT NOT NULL
    )
  `);
  const existing = await db.execute(`SELECT COUNT(*) as count FROM products`);
  const count = Number(existing?.rows?.[0]?.count ?? 0);
  if (count === 0) {
    for (const product of verifiedSeedProducts) {
      await upsertProduct(product);
    }
  }
  initialized = true;
}

export async function getProducts(filter: Filter = {}): Promise<Product[]> {
  await initializeDatabase();
  const rows = await db.execute(`SELECT * FROM products ORDER BY featured DESC, createdAt DESC`);
  const products = (rows?.rows ?? []).map((row) => normalizeProduct(row as Record<string, unknown>));
  return products.filter((product) => matchesFilter(product, filter));
}

export async function getProductBySlug(slug = ""): Promise<Product | null> {
  await initializeDatabase();
  const result = await db.execute({
    sql: `SELECT * FROM products WHERE slug = ? LIMIT 1`,
    args: [slug],
  });
  const row = result?.rows?.[0];
  return row ? normalizeProduct(row as Record<string, unknown>) : null;
}

export async function upsertProduct(product: Product): Promise<Product> {
  await initializeDatabase();
  const payload = normalizeProduct(product);
  await db.execute({
    sql: `
      INSERT INTO products (id, name, slug, price, image, gallery, category, collection, description, artisanId, sizes, colors, featured, inStock, material, origin)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(id) DO UPDATE SET
        name=excluded.name,
        slug=excluded.slug,
        price=excluded.price,
        image=excluded.image,
        gallery=excluded.gallery,
        category=excluded.category,
        collection=excluded.collection,
        description=excluded.description,
        artisanId=excluded.artisanId,
        sizes=excluded.sizes,
        colors=excluded.colors,
        featured=excluded.featured,
        inStock=excluded.inStock,
        material=excluded.material,
        origin=excluded.origin
    `,
    args: [
      payload.id,
      payload.name,
      payload.slug,
      payload.price,
      payload.image,
      JSON.stringify(payload.gallery ?? []),
      payload.category,
      payload.collection ?? null,
      payload.description ?? null,
      payload.artisanId ?? null,
      JSON.stringify(payload.sizes ?? []),
      JSON.stringify(payload.colors ?? []),
      payload.featured ? 1 : 0,
      payload.inStock ? 1 : 0,
      payload.material ?? null,
      payload.origin ?? null,
    ],
  });
  return payload;
}

export async function createOrder(order: Order): Promise<Order> {
  await initializeDatabase();
  const normalized = normalizeOrder(order);
  await db.execute({
    sql: `
      INSERT INTO orders (id, userId, items, shipping, subtotal, shippingCost, total, status, createdAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
    args: [
      normalized.id,
      normalized.userId ?? null,
      JSON.stringify(normalized.items ?? []),
      JSON.stringify(normalized.shipping ?? null),
      normalized.subtotal,
      normalized.shippingCost,
      normalized.total,
      normalized.status,
      normalized.createdAt,
    ],
  });
  return normalized;
}

export async function getOrderById(id = ""): Promise<Order | null> {
  await initializeDatabase();
  const result = await db.execute({ sql: `SELECT * FROM orders WHERE id = ? LIMIT 1`, args: [id] });
  const row = result?.rows?.[0];
  return row ? normalizeOrder(row as Record<string, unknown>) : null;
}

export async function listOrders(userId?: string): Promise<Order[]> {
  await initializeDatabase();
  const result = userId
    ? await db.execute({ sql: `SELECT * FROM orders WHERE userId = ? ORDER BY createdAt DESC`, args: [userId] })
    : await db.execute(`SELECT * FROM orders ORDER BY createdAt DESC`);
  return (result?.rows ?? []).map((row) => normalizeOrder(row as Record<string, unknown>));
}

function normalizeProduct(input: Record<string, unknown> | Product): Product {
  const row = input as Record<string, unknown>;
  return {
    id: String(row?.id ?? crypto.randomUUID()),
    name: String(row?.name ?? ""),
    slug: String(row?.slug ?? ""),
    price: Number(row?.price ?? 0),
    image: String(row?.image ?? ""),
    gallery: parseStringArray(row?.gallery),
    category: String(row?.category ?? ""),
    collection: toOptionalString(row?.collection),
    description: toOptionalString(row?.description),
    artisanId: toOptionalString(row?.artisanId),
    sizes: parseStringArray(row?.sizes),
    colors: parseStringArray(row?.colors),
    featured: Boolean(Number(row?.featured ?? 0)),
    inStock: Boolean(Number(row?.inStock ?? 1)),
    material: toOptionalString(row?.material),
    origin: toOptionalString(row?.origin),
  };
}

function normalizeOrder(input: Record<string, unknown> | Order): Order {
  const row = input as Record<string, unknown>;
  return {
    id: String(row?.id ?? crypto.randomUUID()),
    userId: toOptionalString(row?.userId),
    items: parseCartItems(row?.items),
    shipping: parseShipping(row?.shipping),
    subtotal: Number(row?.subtotal ?? 0),
    shippingCost: Number(row?.shippingCost ?? 0),
    total: Number(row?.total ?? 0),
    status: (row?.status as Order["status"]) ?? "pending",
    createdAt: String(row?.createdAt ?? new Date().toISOString()),
  };
}

function matchesFilter(product: Product, filter: Filter): boolean {
  const query = filter?.query?.trim().toLowerCase() ?? "";
  const category = filter?.category?.trim().toLowerCase() ?? "";
  const collection = filter?.collection?.trim().toLowerCase() ?? "";
  if (query && !`${product.name} ${product.description ?? ""} ${product.category} ${product.collection ?? ""}`.toLowerCase().includes(query)) return false;
  if (category && product.category?.toLowerCase() !== category) return false;
  if (collection && product.collection?.toLowerCase() !== collection) return false;
  if (typeof filter?.priceMin === "number" && product.price < filter.priceMin) return false;
  if (typeof filter?.priceMax === "number" && product.price > filter.priceMax) return false;
  if (filter?.inStockOnly && !product.inStock) return false;
  if (filter?.featuredOnly && !product.featured) return false;
  if (filter?.artisanId && product.artisanId !== filter.artisanId) return false;
  return true;
}

function parseStringArray(value: unknown): string[] | undefined {
  if (Array.isArray(value)) return value.map((item) => String(item ?? "")).filter(Boolean);
  if (typeof value === "string" && value.trim()) {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed.map((item) => String(item ?? "")).filter(Boolean) : undefined;
    } catch {
      return value.split(",").map((item) => item.trim()).filter(Boolean);
    }
  }
  return undefined;
}

function parseCartItems(value: unknown): CartItem[] {
  if (Array.isArray(value)) return value.map((item) => ({ productId: String((item as CartItem)?.productId ?? ""), quantity: Number((item as CartItem)?.quantity ?? 1), size: toOptionalString((item as CartItem)?.size), color: toOptionalString((item as CartItem)?.color) }));
  if (typeof value === "string" && value.trim()) {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parseCartItems(parsed) : [];
    } catch {
      return [];
    }
  }
  return [];
}

function parseShipping(value: unknown): ShippingInfo {
  const fallback: ShippingInfo = {
    fullName: "",
    email: "",
    phone: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
  };
  if (typeof value === "string" && value.trim()) {
    try {
      return { ...fallback, ...(JSON.parse(value) as Partial<ShippingInfo>) };
    } catch {
      return fallback;
    }
  }
  return { ...fallback, ...(value as Partial<ShippingInfo> ?? {}) };
}

function toOptionalString(value: unknown): string | undefined {
  const text = String(value ?? "").trim();
  return text ? text : undefined;
}

export { db, initializeDatabase, getProducts, getProductBySlug, upsertProduct, createOrder, getOrderById, listOrders };
export default db;