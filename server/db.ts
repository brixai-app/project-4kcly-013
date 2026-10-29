import { createClient, type Client } from "@libsql/client";
import type { Artisan, CustomOrderRequest, Order, Product, UserProfile } from "../src/types";

type TableName =
  | "products"
  | "artisans"
  | "orders"
  | "customOrderRequests"
  | "user"
  | "users"
  | "session"
  | "account"
  | "verification";

const db: Client = createClient({ url: "file:local.db" });
const productSeed: Product[] = [
  { id: "p1", name: "Mehrab Hand-Embroidered Mojri", slug: "mehrab-hand-embroidered-mojri", price: 1499, currency: "INR", category: "Wedding", artisanId: "a1", description: "Ivory leather mojri with maroon zardozi detailing.", image: "https://images.unsplash.com/photo-1533867617858-e7b97e060509?auto=format&fit=crop&w=800&q=80", images: ["https://images.unsplash.com/photo-1533867617858-e7b97e060509?auto=format&fit=crop&w=800&q=80"], sizes: ["6", "7", "8", "9", "10"], colors: ["Ivory", "Maroon"], inStock: true, featured: true, material: "Leather", origin: "Jodhpur" },
  { id: "p2", name: "Noor Mirror-Work Mojri", slug: "noor-mirror-work-mojri", price: 1699, currency: "INR", category: "Festive", artisanId: "a2", description: "Refined mirror accents on a charcoal base.", image: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=800&q=80", images: ["https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=800&q=80"], sizes: ["6", "7", "8", "9"], colors: ["Charcoal", "Silver"], inStock: true, featured: true, material: "Leather", origin: "Jodhpur" },
  { id: "p3", name: "Sahara Patina Mojri", slug: "sahara-patina-mojri", price: 1299, currency: "INR", category: "Everyday", artisanId: "a3", description: "Warm taupe finish with a softened silhouette.", image: "https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?auto=format&fit=crop&w=800&q=80", images: ["https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?auto=format&fit=crop&w=800&q=80"], sizes: ["7", "8", "9", "10"], colors: ["Taupe"], inStock: true, featured: false, material: "Suede", origin: "Jodhpur" },
  { id: "p4", name: "Riwaayat Threadwork Mojri", slug: "riwaayat-threadwork-mojri", price: 1899, currency: "INR", category: "Ceremony", artisanId: "a4", description: "Deep-maroon threadwork with a formal profile.", image: "https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=800&q=80", images: ["https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=800&q=80"], sizes: ["6", "7", "8", "9", "10"], colors: ["Maroon"], inStock: true, featured: true, material: "Leather", origin: "Jodhpur" },
  { id: "p5", name: "Bageecha Floral Mojri", slug: "bageecha-floral-mojri", price: 1599, currency: "INR", category: "Festive", artisanId: "a5", description: "Subtle floral embroidery for celebratory dressing.", image: "https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&w=800&q=80", images: ["https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&w=800&q=80"], sizes: ["6", "8", "9"], colors: ["Ivory", "Gold"], inStock: true, featured: false, material: "Leather", origin: "Jodhpur" },
  { id: "p6", name: "Qila Heritage Mojri", slug: "qila-heritage-mojri", price: 1999, currency: "INR", category: "Wedding", artisanId: "a1", description: "Structured ceremonial pair with heritage finishing.", image: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=1400&q=85", images: ["https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=1400&q=85"], sizes: ["7", "8", "9", "10"], colors: ["Ivory", "Maroon"], inStock: true, featured: false, material: "Leather", origin: "Jodhpur" },
];
const artisanSeed: Artisan[] = [
  { id: "a1", name: "Rafiq Khan", slug: "rafiq-khan", title: "Master Cutter", location: "Jodhpur, Rajasthan", bio: "Shapes ceremonial silhouettes with disciplined hand-finishing.", portrait: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1400&q=85", specialties: ["Cutting", "Embroidery"], yearsActive: 18, featured: true },
  { id: "a2", name: "Amina Bano", slug: "amina-bano", title: "Mirror-Work Artisan", location: "Jodhpur, Rajasthan", bio: "Builds luminous surface detail with patient mirror setting.", portrait: "https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=1400&q=85", specialties: ["Mirror Work", "Surface Design"], yearsActive: 14, featured: true },
  { id: "a3", name: "Imran Ali", slug: "imran-ali", title: "Leather Finisher", location: "Jodhpur, Rajasthan", bio: "Refines patina and comfort for everyday wear.", portrait: "https://picsum.photos/seed/imran-ali/1200/800", specialties: ["Finishing", "Comfort Fitting"], yearsActive: 11, featured: false },
  { id: "a4", name: "Sana Noor", slug: "sana-noor", title: "Threadwork Specialist", location: "Jodhpur, Rajasthan", bio: "Composes dense maroon threadwork with couture precision.", portrait: "https://picsum.photos/seed/sana-noor/1200/800", specialties: ["Threadwork", "Ceremonial Detailing"], yearsActive: 16, featured: true },
  { id: "a5", name: "Farhan Sheikh", slug: "farhan-sheikh", title: "Pattern Artisan", location: "Jodhpur, Rajasthan", bio: "Develops floral motifs and balanced pattern repeats.", portrait: "https://picsum.photos/seed/farhan-sheikh/1200/800", specialties: ["Patterning", "Motif Design"], yearsActive: 9, featured: false },
];
const orderSeed: Order[] = [];
const customOrderSeed: CustomOrderRequest[] = [];
const userSeed: UserProfile[] = [];

async function exec(sql: string) { return db.execute(sql); }
async function initTable(name: TableName, ddl: string) { await exec(ddl); return name; }

export async function initializeDatabase() {
  await initTable("products", `CREATE TABLE IF NOT EXISTS products (id TEXT PRIMARY KEY, name TEXT NOT NULL, slug TEXT UNIQUE NOT NULL, price INTEGER NOT NULL, currency TEXT, category TEXT NOT NULL, artisanId TEXT, description TEXT, image TEXT NOT NULL, images TEXT, sizes TEXT, colors TEXT, inStock INTEGER DEFAULT 1, featured INTEGER DEFAULT 0, material TEXT, origin TEXT, care TEXT, createdAt TEXT DEFAULT CURRENT_TIMESTAMP, updatedAt TEXT DEFAULT CURRENT_TIMESTAMP)`);
  await initTable("artisans", `CREATE TABLE IF NOT EXISTS artisans (id TEXT PRIMARY KEY, name TEXT NOT NULL, slug TEXT UNIQUE NOT NULL, title TEXT, location TEXT, bio TEXT, portrait TEXT, specialties TEXT, yearsActive INTEGER, featured INTEGER DEFAULT 0, createdAt TEXT DEFAULT CURRENT_TIMESTAMP, updatedAt TEXT DEFAULT CURRENT_TIMESTAMP)`);
  await initTable("orders", `CREATE TABLE IF NOT EXISTS orders (id TEXT PRIMARY KEY, userId TEXT, items TEXT NOT NULL, subtotal INTEGER NOT NULL, shipping INTEGER, discount INTEGER, total INTEGER NOT NULL, currency TEXT, status TEXT NOT NULL, shippingAddress TEXT, paymentMethod TEXT, promoCode TEXT, createdAt TEXT DEFAULT CURRENT_TIMESTAMP, updatedAt TEXT DEFAULT CURRENT_TIMESTAMP)`);
  await initTable("customOrderRequests", `CREATE TABLE IF NOT EXISTS customOrderRequests (id TEXT PRIMARY KEY, userId TEXT, name TEXT NOT NULL, email TEXT NOT NULL, phone TEXT, occasion TEXT, notes TEXT, budget INTEGER, preferredColors TEXT, preferredMaterials TEXT, status TEXT DEFAULT 'new', createdAt TEXT DEFAULT CURRENT_TIMESTAMP, updatedAt TEXT DEFAULT CURRENT_TIMESTAMP)`);
  await initTable("user", `CREATE TABLE IF NOT EXISTS user (id TEXT PRIMARY KEY, name TEXT, email TEXT, phone TEXT, avatar TEXT, role TEXT, city TEXT, country TEXT, createdAt TEXT DEFAULT CURRENT_TIMESTAMP, updatedAt TEXT DEFAULT CURRENT_TIMESTAMP)`);
  await initTable("users", `CREATE TABLE IF NOT EXISTS users (id TEXT PRIMARY KEY, name TEXT, email TEXT UNIQUE, phone TEXT, avatar TEXT, role TEXT, city TEXT, country TEXT, createdAt TEXT DEFAULT CURRENT_TIMESTAMP, updatedAt TEXT DEFAULT CURRENT_TIMESTAMP)`);
  await initTable("session", `CREATE TABLE IF NOT EXISTS session (id TEXT PRIMARY KEY, userId TEXT NOT NULL, expiresAt TEXT NOT NULL, token TEXT UNIQUE NOT NULL, createdAt TEXT DEFAULT CURRENT_TIMESTAMP, updatedAt TEXT DEFAULT CURRENT_TIMESTAMP)`);
  await initTable("account", `CREATE TABLE IF NOT EXISTS account (id TEXT PRIMARY KEY, userId TEXT NOT NULL, providerId TEXT NOT NULL, accountId TEXT NOT NULL, accessToken TEXT, refreshToken TEXT, idToken TEXT, createdAt TEXT DEFAULT CURRENT_TIMESTAMP, updatedAt TEXT DEFAULT CURRENT_TIMESTAMP)`);
  await initTable("verification", `CREATE TABLE IF NOT EXISTS verification (id TEXT PRIMARY KEY, identifier TEXT NOT NULL, value TEXT NOT NULL, expiresAt TEXT NOT NULL, createdAt TEXT DEFAULT CURRENT_TIMESTAMP, updatedAt TEXT DEFAULT CURRENT_TIMESTAMP)`);
  const count = async (t: string) => Number((await db.execute(`SELECT COUNT(*) AS c FROM ${t}`)).rows?.[0]?.c ?? 0);
  if ((await count("products")) === 0) for (const p of productSeed) await db.execute({ sql: `INSERT INTO products (id,name,slug,price,currency,category,artisanId,description,image,images,sizes,colors,inStock,featured,material,origin) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`, args: [p.id, p.name, p.slug, p.price, p.currency ?? "INR", p.category, p.artisanId ?? null, p.description ?? null, p.image, JSON.stringify(p.images ?? []), JSON.stringify(p.sizes ?? []), JSON.stringify(p.colors ?? []), p.inStock ? 1 : 0, p.featured ? 1 : 0, p.material ?? null, p.origin ?? null] });
  if ((await count("artisans")) === 0) for (const a of artisanSeed) await db.execute({ sql: `INSERT INTO artisans (id,name,slug,title,location,bio,portrait,specialties,yearsActive,featured) VALUES (?,?,?,?,?,?,?,?,?,?)`, args: [a.id, a.name, a.slug, a.title ?? null, a.location ?? null, a.bio ?? null, a.portrait ?? null, JSON.stringify(a.specialties ?? []), a.yearsActive ?? null, a.featured ? 1 : 0] });
  if ((await count("orders")) === 0) for (const o of orderSeed) await db.execute({ sql: `INSERT INTO orders (id,userId,items,subtotal,shipping,discount,total,currency,status,shippingAddress,paymentMethod,promoCode) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)`, args: [o.id, o.userId ?? null, JSON.stringify(o.items ?? []), o.subtotal, o.shipping ?? null, o.discount ?? null, o.total, o.currency ?? "INR", o.status, o.shippingAddress ?? null, o.paymentMethod ?? null, o.promoCode ?? null] });
  if ((await count("customOrderRequests")) === 0) for (const r of customOrderSeed) await db.execute({ sql: `INSERT INTO customOrderRequests (id,userId,name,email,phone,occasion,notes,budget,preferredColors,preferredMaterials,status) VALUES (?,?,?,?,?,?,?,?,?,?,?)`, args: [r.id, r.userId ?? null, r.name, r.email, r.phone ?? null, r.occasion ?? null, r.notes ?? null, r.budget ?? null, JSON.stringify(r.preferredColors ?? []), JSON.stringify(r.preferredMaterials ?? []), r.status ?? "new"] });
  if ((await count("user")) === 0) for (const u of userSeed) await db.execute({ sql: `INSERT INTO user (id,name,email,phone,avatar,role,city,country) VALUES (?,?,?,?,?,?,?,?)`, args: [u.id, u.name ?? null, u.email ?? null, u.phone ?? null, u.avatar ?? null, u.role ?? null, u.city ?? null, u.country ?? null] });
  return true;
}

export async function inspectTables() { return Promise.all(["products","artisans","orders","customOrderRequests","user","users","session","account","verification"].map(async (name) => ({ name, count: Number((await db.execute(`SELECT COUNT(*) AS c FROM ${name}`)).rows?.[0]?.c ?? 0) }))); }
export async function getTableData(name: TableName) { if (!["products","artisans","orders","customOrderRequests","user","users","session","account","verification"].includes(name)) throw new Error("Table not allowlisted"); const rows = await db.execute(`SELECT * FROM ${name}`); return { name, isAuthTable: ["user","users","session","account","verification"].includes(name), rows: rows.rows ?? [] }; }

void initializeDatabase();

export { db };
export default db;