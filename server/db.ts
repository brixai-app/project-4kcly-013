import { createClient, type Client } from '@libsql/client';
import type { CartItem, Order, Product } from '../src/types';

const dbUrl = 'file:local.db';

export const db: Client = createClient({ url: dbUrl });

export async function initDb(): Promise<void> {
  await db.execute(`
    CREATE TABLE IF NOT EXISTS items (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      category TEXT NOT NULL,
      price INTEGER NOT NULL,
      originalPrice INTEGER,
      description TEXT,
      imageUrl TEXT NOT NULL,
      gallery TEXT,
      artisanId TEXT,
      sizes TEXT,
      colors TEXT,
      material TEXT,
      inStock INTEGER DEFAULT 1,
      featured INTEGER DEFAULT 0,
      newArrival INTEGER DEFAULT 0,
      limitedEdition INTEGER DEFAULT 0,
      slug TEXT,
      createdAt TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);
  await db.execute(`
    CREATE TABLE IF NOT EXISTS orders (
      id TEXT PRIMARY KEY,
      items TEXT NOT NULL,
      shipping TEXT NOT NULL,
      subtotal INTEGER NOT NULL,
      shippingFee INTEGER NOT NULL,
      total INTEGER NOT NULL,
      status TEXT NOT NULL,
      createdAt TEXT NOT NULL,
      customerEmail TEXT
    )
  `);
}

const seedItems: Product[] = [
  {
    id: 'mj-001',
    name: 'Mehrangarh Ember Mojri',
    category: 'mojri',
    price: 2499,
    originalPrice: 3299,
    description: 'Hand-finished leather mojri with tonal embroidery and a softened almond toe.',
    imageUrl: 'https://images.unsplash.com/photo-1533867617858-e7b97e060509?auto=format&fit=crop&w=800&q=80',
    gallery: ['https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&w=800&q=80'],
    artisanId: 'art-001',
    sizes: ['6', '7', '8', '9', '10'],
    colors: ['ember', 'sand'],
    material: 'Leather',
    inStock: true,
    featured: true,
    newArrival: true,
    slug: 'mehrangarh-ember-mojri',
  },
  {
    id: 'mj-002',
    name: 'Thar Ivory Jutti',
    category: 'juttis',
    price: 2199,
    description: 'Ivory-toned jutti with mirror-thread accents and a supple cushioned lining.',
    imageUrl: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=800&q=80',
    artisanId: 'art-002',
    sizes: ['6', '7', '8', '9'],
    colors: ['ivory', 'taupe'],
    material: 'Leather',
    inStock: true,
    featured: true,
    slug: 'thar-ivory-jutti',
  },
  {
    id: 'mj-003',
    name: 'Jodhpur Loom Bridal Pair',
    category: 'bridal',
    price: 4899,
    originalPrice: 5599,
    description: 'Bridal mojris with dense zari work, ceremonial sheen, and a sculpted profile.',
    imageUrl: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=800&q=80',
    artisanId: 'art-003',
    sizes: ['6', '7', '8', '9', '10', '11'],
    colors: ['gold', 'maroon'],
    material: 'Leather',
    inStock: true,
    limitedEdition: true,
    slug: 'jodhpur-loom-bridal-pair',
  },
  {
    id: 'mj-004',
    name: 'Desert Walk Everyday Mojri',
    category: 'everyday',
    price: 1799,
    description: 'Lightweight everyday silhouette with breathable lining and understated stitch detail.',
    imageUrl: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=1400&q=85',
    artisanId: 'art-001',
    sizes: ['6', '7', '8', '9', '10'],
    colors: ['tan', 'brown'],
    material: 'Leather',
    inStock: true,
    newArrival: true,
    slug: 'desert-walk-everyday-mojri',
  },
  {
    id: 'mj-005',
    name: 'Saffron Court Limited Edition',
    category: 'limited',
    price: 3999,
    originalPrice: 4599,
    description: 'Limited run pair with saffron embroidery, hand-burnished edges, and artisan signature.',
    imageUrl: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1400&q=85',
    artisanId: 'art-004',
    sizes: ['7', '8', '9', '10'],
    colors: ['saffron', 'espresso'],
    material: 'Leather',
    inStock: true,
    featured: true,
    limitedEdition: true,
    slug: 'saffron-court-limited-edition',
  },
  {
    id: 'mj-006',
    name: 'Blue Dune Artisan Mojri',
    category: 'mojri',
    price: 2699,
    description: 'Artisan-made mojri with cool indigo threadwork and a refined low vamp.',
    imageUrl: 'https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=1400&q=85',
    artisanId: 'art-002',
    sizes: ['6', '7', '8', '9'],
    colors: ['indigo', 'stone'],
    material: 'Leather',
    inStock: true,
    newArrival: true,
    slug: 'blue-dune-artisan-mojri',
  },
];

function toInt(value: unknown): number | null {
  const n = typeof value === 'number' ? value : Number(value ?? 0);
  return Number.isFinite(n) ? Math.trunc(n) : null;
}

export async function seedDb(): Promise<void> {
  await initDb();
  for (const item of seedItems) {
    await db.execute({
      sql: `
        INSERT OR IGNORE INTO items
        (id, name, category, price, originalPrice, description, imageUrl, gallery, artisanId, sizes, colors, material, inStock, featured, newArrival, limitedEdition, slug)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      args: [
        item.id,
        item.name,
        item.category,
        item.price,
        item.originalPrice ?? null,
        item.description ?? null,
        item.imageUrl,
        JSON.stringify(item.gallery ?? []),
        item.artisanId ?? null,
        JSON.stringify(item.sizes ?? []),
        JSON.stringify(item.colors ?? []),
        item.material ?? null,
        item.inStock ? 1 : 0,
        item.featured ? 1 : 0,
        item.newArrival ? 1 : 0,
        item.limitedEdition ? 1 : 0,
        item.slug ?? null,
      ],
    });
  }
}

export async function getItemById(id: string): Promise<Product | null> {
  const result = await db.execute({ sql: 'SELECT * FROM items WHERE id = ? LIMIT 1', args: [id] });
  const row = result.rows?.[0] ?? null;
  return row ? rowToProduct(row) : null;
}

export async function getAllItems(): Promise<Product[]> {
  const result = await db.execute('SELECT * FROM items ORDER BY createdAt DESC');
  return (result.rows ?? []).map(rowToProduct);
}

export async function saveOrder(order: Order): Promise<void> {
  await initDb();
  await db.execute({
    sql: `
      INSERT INTO orders
      (id, items, shipping, subtotal, shippingFee, total, status, createdAt, customerEmail)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
    args: [
      order.id,
      JSON.stringify(order.items ?? []),
      JSON.stringify(order.shipping ?? {}),
      order.subtotal,
      order.shippingFee,
      order.total,
      order.status,
      order.createdAt,
      order.customerEmail ?? null,
    ],
  });
}

export async function getOrderById(id: string): Promise<Order | null> {
  const result = await db.execute({ sql: 'SELECT * FROM orders WHERE id = ? LIMIT 1', args: [id] });
  const row = result.rows?.[0] ?? null;
  if (!row) return null;
  return {
    id: String(row.id ?? ''),
    items: safeJson<CartItem[]>(row.items, []),
    shipping: safeJson(row.shipping, {}),
    subtotal: toInt(row.subtotal) ?? 0,
    shippingFee: toInt(row.shippingFee) ?? 0,
    total: toInt(row.total) ?? 0,
    status: (row.status as Order['status']) ?? 'pending',
    createdAt: String(row.createdAt ?? new Date().toISOString()),
    customerEmail: (row.customerEmail as string | null | undefined) ?? undefined,
  };
}

function rowToProduct(row: Record<string, unknown>): Product {
  return {
    id: String(row.id ?? ''),
    name: String(row.name ?? ''),
    category: String(row.category ?? ''),
    price: toInt(row.price) ?? 0,
    originalPrice: toInt(row.originalPrice) ?? undefined,
    description: (row.description as string | null | undefined) ?? undefined,
    imageUrl: String(row.imageUrl ?? ''),
    gallery: safeJson<string[]>(row.gallery, []),
    artisanId: (row.artisanId as string | null | undefined) ?? undefined,
    sizes: safeJson<string[]>(row.sizes, []),
    colors: safeJson<string[]>(row.colors, []),
    material: (row.material as string | null | undefined) ?? undefined,
    inStock: Boolean(toInt(row.inStock) ?? 1),
    featured: Boolean(toInt(row.featured) ?? 0),
    newArrival: Boolean(toInt(row.newArrival) ?? 0),
    limitedEdition: Boolean(toInt(row.limitedEdition) ?? 0),
    slug: (row.slug as string | null | undefined) ?? undefined,
  };
}

function safeJson<T>(value: unknown, fallback: T): T {
  if (typeof value !== 'string' || !value.trim()) return fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

await initDb();

export default db;