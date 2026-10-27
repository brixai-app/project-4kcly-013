import { Hono } from "hono";
import { cors } from "hono/cors";
import auth from "./auth";
import {
  createOrder,
  getOrderById,
  getOrders,
  getProductBySlug,
  getProducts,
  inspectOrders,
  inspectProducts,
  inspectTable,
  initDb,
} from "./db";
import type { Order } from "../src/types";

const index = new Hono();

index.use("*", cors({ origin: "*", allowHeaders: ["Content-Type", "Authorization"], allowMethods: ["GET", "POST", "OPTIONS"] }));

index.get("/api/health", (c) => c.json({ ok: true, service: "jootiya" }));

index.route("/api/auth", auth);

index.get("/api/products", async (c) => {
  try {
    const products = await getProducts();
    return c.json({ ok: true, products });
  } catch {
    return c.json({ ok: false, error: "Unable to load products" }, 500);
  }
});

index.get("/api/products/:slug", async (c) => {
  try {
    const slug = c.req.param("slug") ?? "";
    const product = await getProductBySlug(slug);
    if (!product) return c.json({ ok: false, error: "Product not found" }, 404);
    return c.json({ ok: true, product });
  } catch {
    return c.json({ ok: false, error: "Unable to load product" }, 500);
  }
});

index.get("/api/orders", async (c) => {
  try {
    const orders = await getOrders();
    return c.json({ ok: true, orders });
  } catch {
    return c.json({ ok: false, error: "Unable to load orders" }, 500);
  }
});

index.get("/api/orders/:id", async (c) => {
  try {
    const id = c.req.param("id") ?? "";
    const order = await getOrderById(id);
    if (!order) return c.json({ ok: false, error: "Order not found" }, 404);
    return c.json({ ok: true, order });
  } catch {
    return c.json({ ok: false, error: "Unable to load order" }, 500);
  }
});

index.post("/api/orders", async (c) => {
  try {
    const body = (await c.req.json().catch(() => null)) as Partial<Order> | null;
    const items = Array.isArray(body?.items) ? body?.items : [];
    const shipping = body?.shipping;
    const payment = body?.payment;
    const subtotal = Number(body?.subtotal ?? 0);
    const shippingFee = Number(body?.shippingFee ?? 0);
    const total = Number(body?.total ?? subtotal + shippingFee);

    if (!items.length || !shipping?.fullName || !shipping?.email || !shipping?.addressLine1 || !shipping?.city || !shipping?.state || !shipping?.postalCode || !shipping?.country || !payment?.method) {
      return c.json({ ok: false, error: "Invalid order payload" }, 400);
    }

    const order: Order = {
      id: body?.id ?? crypto.randomUUID(),
      userId: body?.userId,
      items,
      shipping: {
        fullName: shipping.fullName,
        email: shipping.email,
        phone: shipping.phone ?? "",
        addressLine1: shipping.addressLine1,
        addressLine2: shipping.addressLine2,
        city: shipping.city,
        state: shipping.state,
        postalCode: shipping.postalCode,
        country: shipping.country,
      },
      payment: {
        method: payment.method,
        transactionId: payment.transactionId,
        last4: payment.last4,
        status: payment.status ?? "pending",
      },
      subtotal,
      shippingFee,
      total,
      status: body?.status ?? "placed",
      createdAt: body?.createdAt ?? new Date().toISOString(),
    };

    const saved = await createOrder(order);
    return c.json({ ok: true, order: saved }, 201);
  } catch {
    return c.json({ ok: false, error: "Unable to create order" }, 500);
  }
});

index.get("/api/_admin/db/:table", async (c) => {
  try {
    const table = c.req.param("table") ?? "products";
    if (!["products", "orders"].includes(table)) return c.json({ ok: false, error: "Table not allowed" }, 403);
    const rows = await inspectTable(table);
    return c.json({ ok: true, table, rows });
  } catch {
    return c.json({ ok: false, error: "Unable to inspect table" }, 500);
  }
});

index.get("/api/_admin/db/products", async (c) => {
  try {
    const rows = await inspectProducts();
    return c.json({ ok: true, rows });
  } catch {
    return c.json({ ok: false, error: "Unable to inspect products" }, 500);
  }
});

index.get("/api/_admin/db/orders", async (c) => {
  try {
    const rows = await inspectOrders();
    return c.json({ ok: true, rows });
  } catch {
    return c.json({ ok: false, error: "Unable to inspect orders" }, 500);
  }
});

index.onError((err, c) => c.json({ ok: false, error: err?.message ?? "Internal server error" }, 500));

void initDb();

export default index;