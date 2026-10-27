import { createClient } from "@libsql/client";

export const db = createClient({ url: "file:local.db" });
export default db;

const productTableSql = `
CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  price INTEGER NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  collection TEXT,
  image TEXT NOT NULL,
  images TEXT,
  sizes TEXT,
  colors TEXT,
  artisan TEXT,
  rating REAL,
  reviewCount INTEGER,
  inStock INTEGER DEFAULT 1,
  featured INTEGER DEFAULT 0,
  createdAt TEXT DEFAULT CURRENT_TIMESTAMP
)`;

const orderTableSql = `
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

const userTableSql = `
CREATE TABLE IF NOT EXISTS user (
  id TEXT PRIMARY KEY,
  name TEXT,
  email TEXT UNIQUE,
  emailVerified INTEGER,
  image TEXT,
  createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
  updatedAt TEXT DEFAULT CURRENT_TIMESTAMP
)`;

const sessionTableSql = `
CREATE TABLE IF NOT EXISTS session (
  id TEXT PRIMARY KEY,
  expiresAt INTEGER NOT NULL,
  token TEXT NOT NULL UNIQUE,
  createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
  updatedAt TEXT DEFAULT CURRENT_TIMESTAMP,
  ipAddress TEXT,
  userAgent TEXT,
  userId TEXT NOT NULL,
  FOREIGN KEY (userId) REFERENCES user(id) ON DELETE CASCADE
)`;

const accountTableSql = `
CREATE TABLE IF NOT EXISTS account (
  id TEXT PRIMARY KEY,
  accountId TEXT NOT NULL,
  providerId TEXT NOT NULL,
  userId TEXT NOT NULL,
  accessToken TEXT,
  refreshToken TEXT,
  idToken TEXT,
  accessTokenExpiresAt INTEGER,
  refreshTokenExpiresAt INTEGER,
  scope TEXT,
  password TEXT,
  createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
  updatedAt TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES user(id) ON DELETE CASCADE
)`;

const verificationTableSql = `
CREATE TABLE IF NOT EXISTS verification (
  id TEXT PRIMARY KEY,
  identifier TEXT NOT NULL,
  value TEXT NOT NULL,
  expiresAt INTEGER NOT NULL,
  createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
  updatedAt TEXT DEFAULT CURRENT_TIMESTAMP
)`;

const seedProducts = [
  {
    id: "mojri-001",
    name: "Mehrab Ivory Mojri",
    slug: "mehrab-ivory-mojri",
    price: 3499,
    description: "Hand-finished ivory leather mojri with a softly pointed toe and tonal embroidery inspired by Jodhpur courtyard motifs.",
    category: "Mojri",
    collection: "Heritage Edit",
    image: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1533867617858-e7b97e060509?auto=format&fit=crop&w=800&q=80"
    ],
    sizes: ["6", "7", "8", "9", "10"],
    colors: ["Ivory", "Sand"],
    artisan: { id: "artisan-1", name: "Rafiq Khan", location: "Jodhpur", craft: "Hand embroidery" },
    rating: 4.8,
    reviewCount: 128,
    inStock: true,
    featured: true
  },
  {
    id: "mojri-002",
    name: "Sunehri Tan Mojri",
    slug: "sunehri-tan-mojri",
    price: 3299,
    description: "Warm tan mojri cut in supple leather with restrained gold threadwork and a low-profile ceremonial silhouette.",
    category: "Mojri",
    collection: "Wedding Classics",
    image: "https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=1400&q=85"
    ],
    sizes: ["6", "7", "8", "9", "10", "11"],
    colors: ["Tan", "Cognac"],
    artisan: { id: "artisan-2", name: "Imran Ali", location: "Jodhpur", craft: "Leather finishing" },
    rating: 4.7,
    reviewCount: 94,
    inStock: true,
    featured: true
  },
  {
    id: "mojri-003",
    name: "Noor Black Mojri",
    slug: "noor-black-mojri",
    price: 3699,
    description: "A deep-black occasion mojri with subtle tonal detailing, designed for evening tailoring and formal ensembles.",
    category: "Mojri",
    collection: "Evening Formals",
    image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1400&q=85",
    images: [
      "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1400&q=85",
      "https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=1400&q=85"
    ],
    sizes: ["7", "8", "9", "10"],
    colors: ["Black"],
    artisan: { id: "artisan-3", name: "Salim Bano", location: "Jodhpur", craft: "Hand stitching" },
    rating: 4.9,
    reviewCount: 76,
    inStock: true,
    featured: false
  },
  {
    id: "mojri-004",
    name: "Terracotta Jharokha Mojri",
    slug: "terracotta-jharokha-mojri",
    price: 3199,
    description: "Terracotta-toned mojri with architectural embroidery lines echoing carved jharokha frames and palace facades.",
    category: "Mojri",
    collection: "Craft Narrative",
    image: "https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1533867617858-e7b97e060509?auto=format&fit=crop&w=800&q=80"
    ],
    sizes: ["6", "7", "8", "9"],
    colors: ["Terracotta", "Rust"],
    artisan: { id: "artisan-4", name: "Amina Noor", location: "Jodhpur", craft: "Surface embellishment" },
    rating: 4.6,
    reviewCount: 58,
    inStock: true,
    featured: true
  },
  {
    id: "mojri-005",
    name: "Mughal Olive Mojri",
    slug: "mughal-olive-mojri",
    price: 3399,
    description: "An olive-toned heritage pair with muted metallic accents and a refined profile for contemporary festive dressing.",
    category: "Mojri",
    collection: "Heritage Edit",
    image: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=1400&q=85",
    images: [
      "https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=1400&q=85",
      "https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=1400&q=85"
    ],
    sizes: ["6", "7", "8", "9", "10"],
    colors: ["Olive", "Bronze"],
    artisan: { id: "artisan-5", name: "Nadeem Sheikh", location: "Jodhpur", craft: "Pattern cutting" },
    rating: 4.8,
    reviewCount: 112,
    inStock: true,
    featured: false
  },
  {
    id: "mojri-006",
    name: "Ivory Court Mojri",
    slug: "ivory-court-mojri",
    price: 3599,
    description: "A polished ivory mojri with a ceremonial finish, balanced proportions, and delicate handwork across the vamp.",
    category: "Mojri",
    collection: "Wedding Classics",
    image: "https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=1400&q=85",
    images: [
      "https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=1400&q=85",
      "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1400&q=85"
    ],
    sizes: ["7", "8", "9", "10", "11"],
    colors: ["Ivory", "Pearl"],
    artisan: { id: "artisan-6", name: "Farah Siddiqui", location: "Jodhpur", craft: "Embellishment" },
    rating: 4.9,
    reviewCount: 143,
    inStock: true,
    featured: true
  }
];

const ensure = async (sql: string) => {
  await db.execute(sql);
};

export async function initializeDatabase() {
  await ensure(productTableSql);
  await ensure(orderTableSql);
  await ensure(userTableSql);
  await ensure(sessionTableSql);
  await ensure(accountTableSql);
  await ensure(verificationTableSql);

  const existing = await db.execute("SELECT COUNT(*) as count FROM products");
  const count = Number(existing.rows?.[0]?.count ?? 0);
  if (count === 0) {
    for (const product of seedProducts) {
      await db.execute({
        sql: `INSERT INTO products (id, name, slug, price, description, category, collection, image, images, sizes, colors, artisan, rating, reviewCount, inStock, featured)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        args: [
          product.id,
          product.name,
          product.slug,
          product.price,
          product.description,
          product.category,
          product.collection ?? null,
          product.image,
          JSON.stringify(product.images ?? []),
          JSON.stringify(product.sizes ?? []),
          JSON.stringify(product.colors ?? []),
          JSON.stringify(product.artisan ?? null),
          product.rating ?? null,
          product.reviewCount ?? null,
          product.inStock ? 1 : 0,
          product.featured ? 1 : 0
        ]
      });
    }
  }
}

export async function inspectTables() {
  const tables = ["products", "orders", "user", "session", "account", "verification"];
  const result = [];
  for (const name of tables) {
    const rows = await db.execute(`SELECT COUNT(*) as count FROM ${name}`);
    result.push({ name, count: Number(rows.rows?.[0]?.count ?? 0), isAuth: name !== "products" && name !== "orders" });
  }
  return result;
}

export async function getTableData(tableName: string) {
  const allowed = ["products", "orders", "user", "session", "account", "verification"];
  if (!allowed.includes(tableName)) return { columns: [], rows: [] };
  const info = await db.execute(`PRAGMA table_info(${tableName})`);
  const columns = info.rows?.map((row) => String(row?.name ?? "")) ?? [];
  const rows = await db.execute(`SELECT * FROM ${tableName} ORDER BY rowid DESC`);
  return { columns, rows: rows.rows ?? [] };
}