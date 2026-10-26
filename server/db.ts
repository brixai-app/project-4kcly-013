// [auto-quarantined uninstalled package "@libsql/client"] import { createClient } from "@libsql/client";
const createClient: any = typeof Proxy !== 'undefined' ? new Proxy((() => null) as any, { get: () => createClient, apply: () => null }) : (() => null);
import type { CartItem, Order, PaymentInfo, ShippingInfo } from "../src/types";

export type DbItem = {
  id: string;
  name: string;
  category: string;
  price: number;
  description: string;
  image: string;
  gallery: string;
  sizes: string;
  colors: string;
  stock: number;
  featured: number;
  newArrival: number;
  material: string;
  origin: string;
  artisanId: string;
};

export type DbOrder = {
  id: string;
  items: string;
  shipping: string;
  payment: string;
  subtotal: number;
  shippingFee: number;
  total: number;
  status: Order["status"];
  createdAt: string;
};

const db = createClient({ url: "file:local.db" });

const seedItems: Array<Omit<DbItem, "gallery" | "sizes" | "colors"> & { gallery: string[]; sizes: string[]; colors: string[] }> = [
  {
    id: "mojri-1",
    name: "Sheesh Mahal Mojri",
    category: "Wedding",
    price: 4899,
    description: "Hand-embroidered bridal mojri with antique-gold threadwork and a cushioned leather insole.",
    image: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1533867617858-e7b97e060509?auto=format&fit=crop&w=800&q=80",
    ],
    sizes: ["6", "7", "8", "9", "10"],
    colors: ["Ivory", "Gold"],
    stock: 12,
    featured: 1,
    newArrival: 0,
    material: "Leather, zari, silk thread",
    origin: "Jodhpur, Rajasthan",
    artisanId: "artisan-1",
  },
  {
    id: "mojri-2",
    name: "Mehrab Court Mojri",
    category: "Heritage",
    price: 3699,
    description: "A refined court silhouette with tonal embroidery and a soft almond toe for everyday ceremony.",
    image: "https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=800&q=80",
    ],
    sizes: ["6", "7", "8", "9", "10", "11"],
    colors: ["Sand", "Brown"],
    stock: 18,
    featured: 1,
    newArrival: 1,
    material: "Vegetable-tanned leather",
    origin: "Jodhpur, Rajasthan",
    artisanId: "artisan-2",
  },
  {
    id: "mojri-3",
    name: "Nawaab Thread Mojri",
    category: "Festive",
    price: 4299,
    description: "Dense hand-stitching, mirror accents, and a flexible sole designed for long festive evenings.",
    image: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=1400&q=85",
    gallery: [
      "https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=1400&q=85",
      "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1400&q=85",
    ],
    sizes: ["7", "8", "9", "10"],
    colors: ["Antique Gold", "Tan"],
    stock: 9,
    featured: 0,
    newArrival: 1,
    material: "Leather, mirror work, cotton lining",
    origin: "Jodhpur, Rajasthan",
    artisanId: "artisan-3",
  },
  {
    id: "mojri-4",
    name: "Desert Bloom Mojri",
    category: "Everyday",
    price: 2799,
    description: "Lightweight and breathable with floral embroidery inspired by desert gardens and palace courtyards.",
    image: "https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=1400&q=85",
    gallery: [
      "https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=1400&q=85",
      "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80",
    ],
    sizes: ["6", "7", "8", "9"],
    colors: ["Ivory", "Rosewood"],
    stock: 22,
    featured: 0,
    newArrival: 0,
    material: "Leather, cotton thread",
    origin: "Jodhpur, Rajasthan",
    artisanId: "artisan-1",
  },
  {
    id: "mojri-5",
    name: "Rangrez Mojri",
    category: "Statement",
    price: 5199,
    description: "A richly detailed statement pair with layered embroidery and a sculpted profile.",
    image: "https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?auto=format&fit=crop&w=800&q=80",
    ],
    sizes: ["7", "8", "9", "10", "11"],
    colors: ["Maroon", "Gold"],
    stock: 7,
    featured: 1,
    newArrival: 0,
    material: "Leather, zari, beadwork",
    origin: "Jodhpur, Rajasthan",
    artisanId: "artisan-2",
  },
  {
    id: "mojri-6",
    name: "Sunehri Mojri",
    category: "Occasion",
    price: 3999,
    description: "A polished occasion pair with restrained gold detailing and a supple, glove-like fit.",
    image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?auto=format&fit=crop&w=800&q=80",
    ],
    sizes: ["6", "7", "8", "9", "10"],
    colors: ["Gold", "Beige"],
    stock: 14,
    featured: 0,
    newArrival: 1,
    material: "Leather, metallic thread",
    origin: "Jodhpur, Rajasthan",
    artisanId: "artisan-3",
  },
];

const toJson = (value: unknown) => JSON.stringify(value ?? null);
const fromJson = <T,>(value: string | null | undefined, fallback: T): T => {
  if (!value) return fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
};

export async function initializeDatabase(): Promise<void> {
  await db.execute(`
    CREATE TABLE IF NOT EXISTS items (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      category TEXT NOT NULL,
      price INTEGER NOT NULL,
      description TEXT NOT NULL,
      image TEXT NOT NULL,
      gallery TEXT NOT NULL,
      sizes TEXT NOT NULL,
      colors TEXT NOT NULL,
      stock INTEGER NOT NULL DEFAULT 0,
      featured INTEGER NOT NULL DEFAULT 0,
      newArrival INTEGER NOT NULL DEFAULT 0,
      material TEXT NOT NULL DEFAULT '',
      origin TEXT NOT NULL DEFAULT '',
      artisanId TEXT NOT NULL DEFAULT ''
    )
  `);
  await db.execute(`
    CREATE TABLE IF NOT EXISTS orders (
      id TEXT PRIMARY KEY,
      items TEXT NOT NULL,
      shipping TEXT NOT NULL,
      payment TEXT NOT NULL,
      subtotal INTEGER NOT NULL,
      shippingFee INTEGER NOT NULL,
      total INTEGER NOT NULL,
      status TEXT NOT NULL,
      createdAt TEXT NOT NULL
    )
  `);

  const existing = await db.execute(`SELECT COUNT(*) AS count FROM items`);
  const count = Number(existing.rows?.[0]?.count ?? 0);
  if (count === 0) {
    for (const item of seedItems) {
      await db.execute({
        sql: `INSERT INTO items (id, name, category, price, description, image, gallery, sizes, colors, stock, featured, newArrival, material, origin, artisanId)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        args: [
          item.id,
          item.name,
          item.category,
          item.price,
          item.description,
          item.image,
          toJson(item.gallery),
          toJson(item.sizes),
          toJson(item.colors),
          item.stock,
          item.featured,
          item.newArrival,
          item.material,
          item.origin,
          item.artisanId,
        ],
      });
    }
  }
}

export async function listItems(): Promise<DbItem[]> {
  await initializeDatabase();
  const result = await db.execute(`SELECT * FROM items ORDER BY featured DESC, newArrival DESC, name ASC`);
  return result.rows.map((row) => ({
    id: String(row.id ?? ""),
    name: String(row.name ?? ""),
    category: String(row.category ?? ""),
    price: Number(row.price ?? 0),
    description: String(row.description ?? ""),
    image: String(row.image ?? ""),
    gallery: String(row.gallery ?? "[]"),
    sizes: String(row.sizes ?? "[]"),
    colors: String(row.colors ?? "[]"),
    stock: Number(row.stock ?? 0),
    featured: Number(row.featured ?? 0),
    newArrival: Number(row.newArrival ?? 0),
    material: String(row.material ?? ""),
    origin: String(row.origin ?? ""),
    artisanId: String(row.artisanId ?? ""),
  }));
}

export async function createOrder(order: Order): Promise<Order> {
  await initializeDatabase();
  await db.execute({
    sql: `INSERT INTO orders (id, items, shipping, payment, subtotal, shippingFee, total, status, createdAt)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    args: [
      order.id,
      toJson(order.items),
      toJson(order.shipping),
      toJson(order.payment),
      order.subtotal,
      order.shippingFee,
      order.total,
      order.status,
      order.createdAt,
    ],
  });
  return order;
}

export async function listOrders(): Promise<Order[]> {
  await initializeDatabase();
  const result = await db.execute(`SELECT * FROM orders ORDER BY createdAt DESC`);
  return result.rows.map((row) => ({
    id: String(row.id ?? ""),
    items: fromJson<CartItem[]>(String(row.items ?? "[]"), []),
    shipping: fromJson<ShippingInfo>(String(row.shipping ?? "{}"), {} as ShippingInfo),
    payment: fromJson<PaymentInfo>(String(row.payment ?? "{}"), { method: "cod" }),
    subtotal: Number(row.subtotal ?? 0),
    shippingFee: Number(row.shippingFee ?? 0),
    total: Number(row.total ?? 0),
    status: (String(row.status ?? "pending") as Order["status"]) ?? "pending",
    createdAt: String(row.createdAt ?? new Date().toISOString()),
  }));
}

export { db };
export default db;