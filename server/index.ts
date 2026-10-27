import { Hono } from "hono";
import { cors } from "hono/cors";
import auth from "./auth";
import {
  createOrder,
  getOrders,
  getProductBySlug,
  getProducts,
  getReviewsByProductId,
  getTableData,
  inspectTables,
} from "./db";
import type { Order } from "../src/types";

const index = new Hono();

index.use(
  "*",
  cors({
    origin: "*",
    allowMethods: ["GET", "POST", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"],
    exposeHeaders: ["Content-Length"],
    maxAge: 86400,
  })
);

index.get("/api/health", (c) => c.json({ success: true, message: "Jootiya API is running" }));

index.all('/api/auth/*', (c) => auth.handler(c.req.raw));

index.get("/api/products", async (c) => {
  try {
    const products = await getProducts();
    return c.json({ success: true, data: products });
  } catch (error) {
    return c.json({ success: false, error: error instanceof Error ? error.message : "Failed to load products" }, 500);
  }
});

index.get("/api/products/:slug", async (c) => {
  try {
    const slug = c.req.param("slug") ?? "";
    const product = await getProductBySlug(slug);
    if (!product) return c.json({ success: false, error: "Product not found" }, 404);
    return c.json({ success: true, data: product });
  } catch (error) {
    return c.json({ success: false, error: error instanceof Error ? error.message : "Failed to load product" }, 500);
  }
});

index.get("/api/products/:productId/reviews", async (c) => {
  try {
    const productId = c.req.param("productId") ?? "";
    const reviews = await getReviewsByProductId(productId);
    return c.json({ success: true, data: reviews });
  } catch (error) {
    return c.json({ success: false, error: error instanceof Error ? error.message : "Failed to load reviews" }, 500);
  }
});

index.get("/api/orders", async (c) => {
  try {
    const orders = await getOrders();
    return c.json({ success: true, data: orders });
  } catch (error) {
    return c.json({ success: false, error: error instanceof Error ? error.message : "Failed to load orders" }, 500);
  }
});

index.post("/api/orders", async (c) => {
  try {
    const body = (await c.req.json()) as Partial<Order>;
    const required = ["customerName", "email", "addressLine1", "city", "state", "postalCode", "country", "items"];
    const missing = required.filter((key) => {
      const value = body?.[key as keyof Order];
      return key === "items" ? !Array.isArray(value) || value.length === 0 : !value;
    });
    if (missing.length > 0) return c.json({ success: false, error: `Missing required fields: ${missing.join(", ")}` }, 400);
    const order = await createOrder(body as Order);
    return c.json({ success: true, data: order, message: "Order created successfully" }, 201);
  } catch (error) {
    return c.json({ success: false, error: error instanceof Error ? error.message : "Failed to create order" }, 500);
  }
});

index.get("/api/admin/tables", async (c) => {
  try {
    const authHeader = c.req.header("authorization") ?? "";
    const isBearer = authHeader.toLowerCase().startsWith("bearer ");
    const token = isBearer ? authHeader.slice(7).trim() : "";
    const adminKey = c.req.query("key") ?? "";
    const secret = (process.env?.ADMIN_INSPECT_KEY ?? "").trim();
    if (!secret || (token !== secret && adminKey !== secret)) {
      return c.json({ success: false, error: "Unauthorized" }, 401);
    }
    const tables = await inspectTables();
    return c.json({ success: true, data: tables });
  } catch (error) {
    return c.json({ success: false, error: error instanceof Error ? error.message : "Failed to inspect tables" }, 500);
  }
});

index.get("/api/admin/tables/:tableName", async (c) => {
  try {
    const authHeader = c.req.header("authorization") ?? "";
    const isBearer = authHeader.toLowerCase().startsWith("bearer ");
    const token = isBearer ? authHeader.slice(7).trim() : "";
    const adminKey = c.req.query("key") ?? "";
    const secret = (process.env?.ADMIN_INSPECT_KEY ?? "").trim();
    if (!secret || (token !== secret && adminKey !== secret)) {
      return c.json({ success: false, error: "Unauthorized" }, 401);
    }
    const tableName = c.req.param("tableName") ?? "";
    const data = await getTableData(tableName);
    return c.json({ success: true, data });
  } catch (error) {
    return c.json({ success: false, error: error instanceof Error ? error.message : "Failed to load table data" }, 500);
  }
});

export default index;