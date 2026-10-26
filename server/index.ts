// [auto-quarantined uninstalled package "hono"] import { Hono } from 'hono';
const Hono: any = typeof Proxy !== 'undefined' ? new Proxy((() => null) as any, { get: () => Hono, apply: () => null }) : (() => null);
// [auto-quarantined uninstalled package "hono/cors"] import { cors } from 'hono/cors';
const cors: any = typeof Proxy !== 'undefined' ? new Proxy((() => null) as any, { get: () => cors, apply: () => null }) : (() => null);
import auth from './auth';
import {
  clearOrders,
  getDbStats,
  getOrderById,
  getOrders,
  getProductById,
  getProductBySlug,
  getProducts,
  insertOrder,
  initDb,
  seedDb,
} from './db';
import type { CheckoutPayload, Order, Product } from '../src/types';

const app = new Hono();

const jsonError = (message: string, status = 400, details?: unknown) =>
  new Response(JSON.stringify({ error: message, details: details ?? null }), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });

const parseBody = async <T,>(c: Parameters<typeof app.post>[1] extends (c: infer C) => any ? C : never): Promise<T | null> => {
  try {
    return (await c.req.json()) as T;
  } catch {
    return null;
  }
};

const isValidOrder = (payload: CheckoutPayload | null): payload is CheckoutPayload => {
  const items = payload?.items ?? [];
  const shipping = payload?.shipping;
  const payment = payload?.payment;
  return (
    Array.isArray(items) &&
    items.length > 0 &&
    !!shipping?.fullName &&
    !!shipping?.email &&
    !!shipping?.phone &&
    !!shipping?.addressLine1 &&
    !!shipping?.city &&
    !!shipping?.state &&
    !!shipping?.postalCode &&
    !!shipping?.country &&
    !!payment?.method
  );
};

app.use(
  '*',
  cors({
    origin: '*',
    allowHeaders: ['Content-Type', 'Authorization'],
    allowMethods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    exposeHeaders: ['Content-Length'],
    maxAge: 86400,
  })
);

app.route('/api/auth', auth);

app.get('/api/health', (c) => c.json({ ok: true, service: 'jootiya-api' }));

app.get('/api/products', async (c) => {
  const slug = c.req.query('slug') ?? '';
  const id = c.req.query('id') ?? '';
  const products = await getProducts();
  if (slug) {
    const product = await getProductBySlug(slug);
    return product ? c.json(product) : jsonError('Product not found', 404);
  }
  if (id) {
    const product = await getProductById(id);
    return product ? c.json(product) : jsonError('Product not found', 404);
  }
  return c.json({ products });
});

app.get('/api/products/:slug', async (c) => {
  const slug = c.req.param('slug') ?? '';
  const product = await getProductBySlug(slug);
  return product ? c.json(product) : jsonError('Product not found', 404);
});

app.get('/api/orders', async () => c.json({ orders: await getOrders() }));

app.get('/api/orders/:id', async (c) => {
  const order = await getOrderById(c.req.param('id') ?? '');
  return order ? c.json(order) : jsonError('Order not found', 404);
});

app.post('/api/orders', async (c) => {
  const payload = await parseBody<CheckoutPayload>(c);
  if (!isValidOrder(payload)) return jsonError('Invalid order payload', 422);

  const products = await getProducts();
  const normalizedItems = payload.items
    .map((item) => {
      const product = products.find((p) => p.id === item?.productId) ?? item?.product;
      if (!product) return null;
      return {
        productId: product.id,
        quantity: Math.max(1, Number(item?.quantity ?? 1)),
        size: item?.size,
        color: item?.color,
        product,
      };
    })
    .filter(Boolean) as Order['items'];

  if (normalizedItems.length === 0) return jsonError('No valid items found', 422);

  const subtotal = normalizedItems.reduce((sum, item) => sum + (item.product?.price ?? 0) * item.quantity, 0);
  const shippingFee = subtotal >= 5000 ? 0 : 250;
  const total = subtotal + shippingFee;

  const order: Order = {
    id: crypto.randomUUID(),
    items: normalizedItems,
    shipping: payload.shipping,
    payment: payload.payment,
    subtotal,
    shippingFee,
    total,
    status: 'confirmed',
    createdAt: new Date().toISOString(),
  };

  const saved = await insertOrder(order);
  return c.json({ order: saved }, 201);
});

app.get('/api/_admin/db/stats', async (c) => c.json(await getDbStats()));

app.get('/api/_admin/db/schema', async (c) => {
  const stats = await getDbStats();
  return c.json({
    tables: ['products', 'orders', 'artisans'],
    stats,
    endpoints: ['/api/products', '/api/orders', '/api/_admin/db/stats', '/api/_admin/db/schema'],
  });
});

app.post('/api/_admin/db/seed', async (c) => {
  await initDb();
  await seedDb();
  return c.json({ ok: true });
});

app.post('/api/_admin/db/clear-orders', async (c) => {
  await clearOrders();
  return c.json({ ok: true });
});

app.notFound((c) => jsonError('Route not found', 404));
app.onError((err) => jsonError('Internal server error', 500, err instanceof Error ? err.message : String(err ?? 'unknown')));

export { app };
export default app;