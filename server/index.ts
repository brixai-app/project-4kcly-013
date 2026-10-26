// [auto-quarantined uninstalled package "hono"] import { Hono } from "hono";
const Hono: any = typeof Proxy !== 'undefined' ? new Proxy((() => null) as any, { get: () => Hono, apply: () => null }) : (() => null);
// [auto-quarantined uninstalled package "hono/cors"] import { cors } from "hono/cors";
const cors: any = typeof Proxy !== 'undefined' ? new Proxy((() => null) as any, { get: () => cors, apply: () => null }) : (() => null);
import auth from "./auth";
import { getOrderByNumber, getOrders, getProductById, getProductBySlug, getProducts, saveOrder } from "./db";
import type { CartItem, CheckoutValidationResult, Order, PaymentInfo, ShippingInfo } from "../src/types";

const index = new Hono();

index.use(
  "*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 86400,
  })
);

index.route("/api/auth", auth);

const json = (data: unknown, status = 200) => index.json(data, status);

const isString = (value: unknown): value is string => typeof value === "string" && value.trim().length > 0;
const isNumber = (value: unknown): value is number => typeof value === "number" && Number.isFinite(value);
const toTrimmed = (value: unknown) => (typeof value === "string" ? value.trim() : "");
const safeNumber = (value: unknown, fallback = 0) => (typeof value === "number" && Number.isFinite(value) ? value : fallback);

const validateShipping = (shipping: unknown): { valid: boolean; errors: Record<string, string> } => {
  const s = (shipping ?? {}) as Partial<ShippingInfo>;
  const errors: Record<string, string> = {};
  if (!isString(s.fullName)) errors.fullName = "Full name is required.";
  if (!isString(s.phone)) errors.phone = "Phone number is required.";
  if (!isString(s.email) || !String(s.email).includes("@")) errors.email = "Valid email is required.";
  if (!isString(s.addressLine1)) errors.addressLine1 = "Address is required.";
  if (!isString(s.city)) errors.city = "City is required.";
  if (!isString(s.state)) errors.state = "State is required.";
  if (!isString(s.postalCode)) errors.postalCode = "Postal code is required.";
  if (!isString(s.country)) errors.country = "Country is required.";
  return { valid: Object.keys(errors).length === 0, errors };
};

const validatePayment = (payment: unknown): { valid: boolean; errors: Record<string, string> } => {
  const p = (payment ?? {}) as Partial<PaymentInfo>;
  const errors: Record<string, string> = {};
  if (!["cod", "upi", "card", "netbanking"].includes(String(p.method ?? ""))) errors.paymentMethod = "Payment method is required.";
  if (p.method === "upi" && !isString(p.upiId)) errors.upiId = "UPI ID is required.";
  if (p.method === "card" && !isString(p.cardholderName)) errors.cardholderName = "Cardholder name is required.";
  if (p.method === "card" && !isString(p.cardLast4)) errors.cardLast4 = "Card details are required.";
  return { valid: Object.keys(errors).length === 0, errors };
};

const validateItems = async (items: unknown): Promise<{ valid: boolean; errors: Record<string, string>; normalized: CartItem[] }> => {
  const errors: Record<string, string> = {};
  const normalized: CartItem[] = Array.isArray(items)
    ? items
        .map((item) => ({
          productId: toTrimmed((item as CartItem)?.productId),
          quantity: Math.max(1, Math.floor(safeNumber((item as CartItem)?.quantity, 1))),
          size: (item as CartItem)?.size ?? null,
          color: (item as CartItem)?.color ?? null,
        }))
        .filter((item) => item.productId.length > 0)
    : [];

  if (!normalized.length) errors.items = "At least one item is required.";

  for (const item of normalized) {
    const product = (await getProductById(item.productId)) ?? (await getProductBySlug(item.productId));
    if (!product) errors.items = "One or more products are unavailable.";
    if (product && !product.inStock) errors.items = `${product.name} is currently out of stock.`;
    if (product && item.quantity > product.stock) errors.items = `${product.name} has only ${product.stock} left in stock.`;
  }

  return { valid: Object.keys(errors).length === 0, errors, normalized };
};

index.get("/api/health", (c) => c.json({ ok: true, service: "jootiya-api", timestamp: new Date().toISOString() }));

index.get("/api/products", async (c) => {
  const products = await getProducts();
  return c.json({ products });
});

index.get("/api/products/:slug", async (c) => {
  const slug = c.req.param("slug") ?? "";
  const product = await getProductBySlug(slug);
  if (!product) return c.json({ error: "Product not found." }, 404);
  return c.json({ product });
});

index.get("/api/orders", async (c) => {
  const orders = await getOrders();
  return c.json({ orders });
});

index.get("/api/orders/:orderNumber", async (c) => {
  const orderNumber = c.req.param("orderNumber") ?? "";
  const order = await getOrderByNumber(orderNumber);
  if (!order) return c.json({ error: "Order not found." }, 404);
  return c.json({ order });
});

index.post("/api/orders", async (c) => {
  try {
    const body = await c.req.json().catch(() => null);
    const items = body?.items ?? [];
    const shipping = body?.shipping ?? {};
    const payment = body?.payment ?? {};
    const subtotal = safeNumber(body?.subtotal, 0);
    const shippingFee = safeNumber(body?.shippingFee, 0);
    const total = safeNumber(body?.total, subtotal + shippingFee);

    const itemCheck = await validateItems(items);
    const shippingCheck = validateShipping(shipping);
    const paymentCheck = validatePayment(payment);

    const errors: CheckoutValidationResult["errors"] = {
      ...(itemCheck.errors ?? {}),
      ...(shippingCheck.errors ?? {}),
      ...(paymentCheck.errors ?? {}),
    };

    if (!itemCheck.valid || !shippingCheck.valid || !paymentCheck.valid) {
      return c.json({ valid: false, errors }, 400);
    }

    const order = await saveOrder({
      items: itemCheck.normalized,
      shipping: shipping as ShippingInfo,
      payment: payment as PaymentInfo,
      subtotal,
      shippingFee,
      total,
    });

    return c.json({ valid: true, order }, 201);
  } catch {
    return c.json({ error: "Unable to create order." }, 500);
  }
});

index.get("/api/_admin/db/products", async (c) => {
  const products = await getProducts();
  return c.json({ count: products.length, products });
});

index.get("/api/_admin/db/orders", async (c) => {
  const orders = await getOrders();
  return c.json({ count: orders.length, orders });
});

index.get("/api/_admin/db/orders/:orderNumber", async (c) => {
  const orderNumber = c.req.param("orderNumber") ?? "";
  const order = await getOrderByNumber(orderNumber);
  return order ? c.json({ order }) : c.json({ error: "Order not found." }, 404);
});

index.get("/api/_admin/db/products/:slug", async (c) => {
  const slug = c.req.param("slug") ?? "";
  const product = await getProductBySlug(slug);
  return product ? c.json({ product }) : c.json({ error: "Product not found." }, 404);
});

index.all("*", (c) => c.json({ error: "Not found." }, 404));

export default index;