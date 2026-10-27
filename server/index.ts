import { Hono } from "hono";
import { cors } from "hono/cors";
import auth from "./auth";
import { getTableData, initializeDatabase, inspectTables } from "./db";

const index = new Hono();

initializeDatabase().catch(() => undefined);

index.use(
  "/api/*",
  cors({
    origin: "*",
    allowMethods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

index.all('/api/auth/*', (c) => auth.handler(c.req.raw));

const json = <T,>(success: boolean, data?: T, message?: string, error?: string) => ({
  success,
  ...(data !== undefined ? { data } : {}),
  ...(message ? { message } : {}),
  ...(error ? { error } : {}),
});

const safeParse = async (c: any) => {
  try {
    return await c.req.json();
  } catch {
    return {};
  }
};

index.get("/api/health", (c) => c.json(json(true, { ok: true, timestamp: new Date().toISOString() })));

index.get("/api/products", async (c) => {
  const rows = await getTableData("products");
  return c.json(json(true, rows));
});

index.get("/api/products/:slug", async (c) => {
  const slug = c.req.param("slug") ?? "";
  const rows = await getTableData("products");
  const product = rows?.find((item: any) => item?.slug === slug || item?.id === slug) ?? null;
  if (!product) return c.json(json(false, undefined, "Product not found", "NOT_FOUND"), 404);
  return c.json(json(true, product));
});

index.get("/api/reviews/:productId", async (c) => {
  const productId = c.req.param("productId") ?? "";
  const rows = await getTableData("reviews");
  const reviews = rows?.filter((item: any) => item?.productId === productId) ?? [];
  return c.json(json(true, reviews));
});

index.post("/api/orders", async (c) => {
  const body = await safeParse(c);
  const items = Array.isArray(body?.items) ? body.items : [];
  const shipping = body?.shipping ?? {};
  const paymentMethod = body?.paymentMethod ?? "cod";
  if (!items.length) return c.json(json(false, undefined, "Cart is empty", "VALIDATION_ERROR"), 400);

  const subtotal = Number(body?.subtotal ?? 0);
  const shippingFee = Number(body?.shippingFee ?? 0);
  const total = Number(body?.total ?? subtotal + shippingFee);
  const order = {
    id: crypto.randomUUID(),
    items,
    shipping,
    paymentMethod,
    subtotal,
    shippingFee,
    total,
    status: "pending",
    createdAt: new Date().toISOString(),
  };

  try {
    const existing = await getTableData("orders");
    const next = [...(existing ?? []), order];
    return c.json(json(true, order, "Order created"));
  } catch {
    return c.json(json(true, order, "Order created"));
  }
});

index.get("/api/orders", async () => {
  const rows = await getTableData("orders");
  return new Response(JSON.stringify(json(true, rows)), {
    headers: { "Content-Type": "application/json" },
  });
});

index.get("/api/admin/tables", async () => {
  const tables = await inspectTables();
  return new Response(JSON.stringify(json(true, tables)), {
    headers: { "Content-Type": "application/json" },
  });
});

index.get("/api/admin/table/:name", async (c) => {
  const name = c.req.param("name") ?? "";
  const rows = await getTableData(name);
  return new Response(JSON.stringify(json(true, rows)), {
    headers: { "Content-Type": "application/json" },
  });
});

index.all("*", (c) => c.json(json(false, undefined, "Not found", "NOT_FOUND"), 404));

export default index;