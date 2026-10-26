// [auto-quarantined uninstalled package "hono"] import { Hono } from "hono";
const Hono: any = typeof Proxy !== 'undefined' ? new Proxy((() => null) as any, { get: () => Hono, apply: () => null }) : (() => null);
// [auto-quarantined uninstalled package "hono/cors"] import { cors } from "hono/cors";
const cors: any = typeof Proxy !== 'undefined' ? new Proxy((() => null) as any, { get: () => cors, apply: () => null }) : (() => null);
import auth from "./auth";
import {
  createOrder,
  getOrderById,
  getProducts,
  initializeDatabase,
  listOrders,
} from "./db";
import type { Order, Product } from "../src/types";

const app = new Hono();

app.use(
  "*",
  cors({
    origin: "*",
    allowMethods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"],
    exposeHeaders: ["Content-Length", "X-Requested-With"],
    maxAge: 86400,
  })
);

app.get("/api/health", (c) => c.json({ ok: true, service: "jootiya-api" }));

app.all("/api/auth/*", (c) => auth.handler(c.req.raw));

app.get("/api/products", async (c) => {
  const query = c.req.query("query") ?? "";
  const category = c.req.query("category") ?? "";
  const collection = c.req.query("collection") ?? "";
  const artisanId = c.req.query("artisanId") ?? "";
  const priceMin = Number(c.req.query("priceMin") ?? "");
  const priceMax = Number(c.req.query("priceMax") ?? "");
  const inStockOnly = c.req.query("inStockOnly") === "true";
  const featuredOnly = c.req.query("featuredOnly") === "true";

  const products = await getProducts({
    query: query || undefined,
    category: category || undefined,
    collection: collection || undefined,
    artisanId: artisanId || undefined,
    priceMin: Number.isFinite(priceMin) ? priceMin : undefined,
    priceMax: Number.isFinite(priceMax) ? priceMax : undefined,
    inStockOnly,
    featuredOnly,
  });

  return c.json({ products });
});

app.get("/api/products/:slug", async (c) => {
  const slug = c.req.param("slug") ?? "";
  const products = await getProducts({ query: slug });
  const product = products.find((item) => item.slug === slug) ?? null;
  return product ? c.json({ product }) : c.json({ error: "Product not found" }, 404);
});

app.post("/api/orders", async (c) => {
  const body = (await c.req.json().catch(() => null)) as Partial<Order> | null;
  const items = body?.items ?? [];
  const shipping = body?.shipping ?? null;

  if (!Array.isArray(items) || items.length === 0 || !shipping?.fullName || !shipping?.email || !shipping?.addressLine1 || !shipping?.city || !shipping?.state || !shipping?.postalCode || !shipping?.country) {
    return c.json({ error: "Invalid order payload" }, 400);
  }

  const subtotal = Number(body?.subtotal ?? 0);
  const shippingCost = Number(body?.shippingCost ?? 0);
  const total = Number(body?.total ?? subtotal + shippingCost);

  const order: Order = {
    id: body?.id ?? crypto.randomUUID(),
    userId: body?.userId,
    items: items as Order["items"],
    shipping: shipping as Order["shipping"],
    subtotal: Number.isFinite(subtotal) ? subtotal : 0,
    shippingCost: Number.isFinite(shippingCost) ? shippingCost : 0,
    total: Number.isFinite(total) ? total : 0,
    status: body?.status ?? "pending",
    createdAt: body?.createdAt ?? new Date().toISOString(),
  };

  const saved = await createOrder(order);
  return c.json({ order: saved }, 201);
});

app.get("/api/orders/:id", async (c) => {
  const id = c.req.param("id") ?? "";
  const order = await getOrderById(id);
  return order ? c.json({ order }) : c.json({ error: "Order not found" }, 404);
});

app.get("/api/orders", async (c) => {
  const userId = c.req.query("userId") ?? undefined;
  const orders = await listOrders(userId);
  return c.json({ orders });
});

app.get("/api/_admin/db/tables", async (c) => {
  const tables = ["products", "orders", "users", "sessions", "accounts", "verification"];
  return c.json({ tables });
});

app.get("/api/_admin/db/products", async (c) => {
  const products = await getProducts({});
  return c.json({ count: products.length, products });
});

app.get("/api/_admin/db/orders", async (c) => {
  const orders = await listOrders();
  return c.json({ count: orders.length, orders });
});

app.post("/api/_admin/db/seed-check", async (c) => {
  await initializeDatabase();
  return c.json({ ok: true });
});

app.notFound((c) => c.json({ error: "Not found" }, 404));

app.onError((err, c) => {
  console.error(err);
  return c.json({ error: "Internal server error" }, 500);
});

await initializeDatabase();

export { app };
export default app;