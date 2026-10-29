import { Hono } from "hono";
import { cors } from "hono/cors";
import auth from "./auth";
import db, { getTableData, initializeDatabase, inspectTables } from "./db";

type JsonValue = Record<string, unknown>;

const app = new Hono();

const json = (data: unknown, status = 200) => app.json(data, status);

const parseBody = async (c: Parameters<Parameters<typeof app.post>[1]>[0]) => {
  try {
    return (await c.req.json()) as JsonValue;
  } catch {
    return null;
  }
};

const normalizeError = (error: unknown) => ({
  success: false,
  error: error instanceof Error ? error.message : "Unexpected server error",
});

const toNumber = (value: unknown) => {
  const n = typeof value === "string" ? Number(value) : typeof value === "number" ? value : NaN;
  return Number.isFinite(n) ? n : undefined;
};

const toBool = (value: unknown) => (typeof value === "boolean" ? value : undefined);

const parseList = (value: unknown) => {
  if (Array.isArray(value)) return value.filter((v) => typeof v === "string") as string[];
  if (typeof value === "string" && value.trim()) return value.split(",").map((v) => v.trim()).filter(Boolean);
  return undefined;
};

app.use("/api/*", cors({ origin: "*", allowHeaders: ["Content-Type", "Authorization"], allowMethods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"] }));

app.all('/api/auth/*', (c) => typeof auth !== 'undefined' && auth && auth.handler ? auth.handler(c.req.raw) : (typeof auth === 'function' ? auth(c.req.raw) : c.json({ error: 'Auth handler unavailable' }, 500)));

app.get("/api/health", (c) => c.json({ success: true, data: { ok: true } }));

app.get("/api/inspect", async (c) => {
  try {
    const tables = await inspectTables();
    return c.json({ success: true, data: tables });
  } catch (error) {
    return c.json(normalizeError(error), 500);
  }
});

app.get("/api/inspect/:table", async (c) => {
  try {
    const table = c.req.param("table");
    const data = await getTableData(table as never);
    return c.json({ success: true, data });
  } catch (error) {
    return c.json(normalizeError(error), 500);
  }
});

app.get("/api/products", async (c) => {
  try {
    const q = c.req.query();
    const filters = {
      query: q.query?.trim() || undefined,
      category: q.category?.trim() || undefined,
      artisanId: q.artisanId?.trim() || undefined,
      minPrice: toNumber(q.minPrice),
      maxPrice: toNumber(q.maxPrice),
      inStock: toBool(q.inStock === "true" ? true : q.inStock === "false" ? false : undefined),
      featured: toBool(q.featured === "true" ? true : q.featured === "false" ? false : undefined),
      sortBy: q.sortBy ?? undefined,
    };
    const rows = await db.execute({
      sql: `SELECT * FROM products`,
      args: [],
    });
    const products = (rows.rows ?? []).map((row: any) => ({
      ...row,
      sizes: parseList(row?.sizes),
      colors: parseList(row?.colors),
      featured: Boolean(row?.featured),
      inStock: row?.inStock == null ? undefined : Boolean(row?.inStock),
    }));
    const filtered = products.filter((p: any) => {
      const matchesQuery = !filters.query || `${p?.name ?? ""} ${p?.description ?? ""} ${p?.category ?? ""}`.toLowerCase().includes(filters.query.toLowerCase());
      const matchesCategory = !filters.category || String(p?.category ?? "").toLowerCase() === filters.category.toLowerCase();
      const matchesArtisan = !filters.artisanId || String(p?.artisanId ?? "") === filters.artisanId;
      const matchesMin = filters.minPrice == null || Number(p?.price ?? 0) >= filters.minPrice;
      const matchesMax = filters.maxPrice == null || Number(p?.price ?? 0) <= filters.maxPrice;
      const matchesStock = filters.inStock == null || Boolean(p?.inStock) === filters.inStock;
      const matchesFeatured = filters.featured == null || Boolean(p?.featured) === filters.featured;
      return matchesQuery && matchesCategory && matchesArtisan && matchesMin && matchesMax && matchesStock && matchesFeatured;
    });
    const sortBy = filters.sortBy ?? "featured";
    filtered.sort((a: any, b: any) => {
      if (sortBy === "price-asc") return Number(a?.price ?? 0) - Number(b?.price ?? 0);
      if (sortBy === "price-desc") return Number(b?.price ?? 0) - Number(a?.price ?? 0);
      if (sortBy === "name-asc") return String(a?.name ?? "").localeCompare(String(b?.name ?? ""));
      if (sortBy === "newest") return String(b?.createdAt ?? "").localeCompare(String(a?.createdAt ?? ""));
      return Number(Boolean(b?.featured)) - Number(Boolean(a?.featured));
    });
    return c.json({ success: true, data: filtered });
  } catch (error) {
    return c.json(normalizeError(error), 500);
  }
});

app.get("/api/products/:slug", async (c) => {
  try {
    const slug = c.req.param("slug");
    const rows = await db.execute({ sql: `SELECT * FROM products WHERE slug = ? LIMIT 1`, args: [slug] });
    const product = rows.rows?.[0] ? { ...rows.rows[0], sizes: parseList((rows.rows[0] as any)?.sizes), colors: parseList((rows.rows[0] as any)?.colors) } : null;
    if (!product) return c.json({ success: false, message: "Product not found" }, 404);
    return c.json({ success: true, data: product });
  } catch (error) {
    return c.json(normalizeError(error), 500);
  }
});

app.get("/api/artisans", async (c) => {
  try {
    const rows = await db.execute({ sql: `SELECT * FROM artisans`, args: [] });
    return c.json({ success: true, data: rows.rows ?? [] });
  } catch (error) {
    return c.json(normalizeError(error), 500);
  }
});

app.get("/api/artisans/:slug", async (c) => {
  try {
    const slug = c.req.param("slug");
    const rows = await db.execute({ sql: `SELECT * FROM artisans WHERE slug = ? LIMIT 1`, args: [slug] });
    const artisan = rows.rows?.[0] ?? null;
    if (!artisan) return c.json({ success: false, message: "Artisan not found" }, 404);
    return c.json({ success: true, data: artisan });
  } catch (error) {
    return c.json(normalizeError(error), 500);
  }
});

app.get("/api/orders", async (c) => {
  try {
    const userId = c.req.query("userId")?.trim();
    const rows = await db.execute({
      sql: userId ? `SELECT * FROM orders WHERE userId = ? ORDER BY createdAt DESC` : `SELECT * FROM orders ORDER BY createdAt DESC`,
      args: userId ? [userId] : [],
    });
    return c.json({ success: true, data: rows.rows ?? [] });
  } catch (error) {
    return c.json(normalizeError(error), 500);
  }
});

app.post("/api/orders", async (c) => {
  try {
    const body = await parseBody(c);
    if (!body) return c.json({ success: false, message: "Invalid JSON payload" }, 400);
    const items = Array.isArray(body.items) ? body.items : [];
    const subtotal = toNumber(body.subtotal);
    const total = toNumber(body.total);
    if (!items.length || subtotal == null || total == null) return c.json({ success: false, message: "Missing required order fields" }, 400);
    const id = crypto.randomUUID();
    await db.execute({
      sql: `INSERT INTO orders (id, userId, items, subtotal, shipping, discount, total, currency, status, shippingAddress, paymentMethod, promoCode, createdAt, updatedAt)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))`,
      args: [
        id,
        typeof body.userId === "string" ? body.userId : null,
        JSON.stringify(items),
        subtotal,
        toNumber(body.shipping) ?? 0,
        toNumber(body.discount) ?? 0,
        total,
        typeof body.currency === "string" ? body.currency : "INR",
        typeof body.status === "string" ? body.status : "pending",
        typeof body.shippingAddress === "string" ? body.shippingAddress : null,
        typeof body.paymentMethod === "string" ? body.paymentMethod : null,
        typeof body.promoCode === "string" ? body.promoCode : null,
      ],
    });
    return c.json({ success: true, data: { id } }, 201);
  } catch (error) {
    return c.json(normalizeError(error), 500);
  }
});

app.post("/api/custom-orders", async (c) => {
  try {
    const body = await parseBody(c);
    if (!body || typeof body.name !== "string" || typeof body.email !== "string") return c.json({ success: false, message: "Name and email are required" }, 400);
    const id = crypto.randomUUID();
    await db.execute({
      sql: `INSERT INTO custom_orders (id, userId, name, email, phone, occasion, notes, budget, preferredColors, preferredMaterials, status, createdAt, updatedAt)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))`,
      args: [
        id,
        typeof body.userId === "string" ? body.userId : null,
        body.name,
        body.email,
        typeof body.phone === "string" ? body.phone : null,
        typeof body.occasion === "string" ? body.occasion : null,
        typeof body.notes === "string" ? body.notes : null,
        toNumber(body.budget) ?? null,
        JSON.stringify(parseList(body.preferredColors) ?? []),
        JSON.stringify(parseList(body.preferredMaterials) ?? []),
        typeof body.status === "string" ? body.status : "new",
      ],
    });
    return c.json({ success: true, data: { id } }, 201);
  } catch (error) {
    return c.json(normalizeError(error), 500);
  }
});

app.get("/api/custom-orders", async (c) => {
  try {
    const rows = await db.execute({ sql: `SELECT * FROM custom_orders ORDER BY createdAt DESC`, args: [] });
    return c.json({ success: true, data: rows.rows ?? [] });
  } catch (error) {
    return c.json(normalizeError(error), 500);
  }
});

await initializeDatabase();

export default app;