import { Hono } from 'hono';
import { cors } from 'hono/cors';
import auth from './auth';
import { db, initDb, seedDb, getAllItems, getItemById, saveOrder, getOrderById } from './db';
import type { Order, Product } from '../src/types';

const app = new Hono();

app.use(
  '*',
  cors({
    origin: '*',
    allowHeaders: ['Content-Type', 'Authorization'],
    allowMethods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    exposeHeaders: ['Content-Length', 'X-Request-Id'],
    maxAge: 86400,
  })
);

app.all('/api/auth/*', async (c) => auth.handler(c.req.raw));

const json = (data: unknown, status = 200) => cResponse(data, status);
function cResponse(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
}

const safeParse = async <T,>(req: Request): Promise<T | null> => {
  try {
    return (await req.json()) as T;
  } catch {
    return null;
  }
};

const normalizeOrder = (payload: Partial<Order> & { items?: unknown; shipping?: unknown }) => {
  const items = Array.isArray(payload?.items) ? payload.items : [];
  const shipping = (payload?.shipping ?? {}) as Order['shipping'];
  const subtotal = Number(payload?.subtotal ?? 0);
  const shippingFee = Number(payload?.shippingFee ?? 0);
  const total = Number(payload?.total ?? subtotal + shippingFee);
  return {
    id: String(payload?.id ?? crypto.randomUUID()),
    items,
    shipping,
    subtotal,
    shippingFee,
    total,
    status: (payload?.status ?? 'pending') as Order['status'],
    createdAt: String(payload?.createdAt ?? new Date().toISOString()),
    customerEmail: payload?.customerEmail,
  } as Order;
};

app.get('/api/health', (c) =>
  c.json({
    ok: true,
    service: 'jootiya-api',
    timestamp: new Date().toISOString(),
  })
);

app.get('/api/products', async (c) => {
  const items = await getAllItems();
  return c.json({ items });
});

app.get('/api/products/:id', async (c) => {
  const id = c.req.param('id') ?? '';
  const item = await getItemById(id);
  if (!item) return c.json({ error: 'Product not found' }, 404);
  return c.json({ item });
});

app.post('/api/orders', async (c) => {
  const payload = await safeParse<Partial<Order> & { items?: unknown; shipping?: unknown }>(c.req.raw);
  if (!payload) return c.json({ error: 'Invalid JSON payload' }, 400);

  const order = normalizeOrder(payload);
  if (!Array.isArray(order.items) || order.items.length === 0) {
    return c.json({ error: 'Order items are required' }, 400);
  }

  await saveOrder(order);
  return c.json({ order }, 201);
});

app.get('/api/orders/:id', async (c) => {
  const id = c.req.param('id') ?? '';
  const order = await getOrderById(id);
  if (!order) return c.json({ error: 'Order not found' }, 404);
  return c.json({ order });
});

app.get('/api/_admin/db/status', async (c) => {
  await initDb();
  return c.json({
    ok: true,
    connected: true,
    database: 'libsql',
  });
});

app.post('/api/_admin/db/init', async (c) => {
  await initDb();
  return c.json({ ok: true, initialized: true });
});

app.post('/api/_admin/db/seed', async (c) => {
  await seedDb();
  return c.json({ ok: true, seeded: true });
});

app.get('/api/_admin/db/products', async (c) => {
  const items = await getAllItems();
  return c.json({ items, count: items.length });
});

app.get('/api/_admin/db/orders/:id', async (c) => {
  const id = c.req.param('id') ?? '';
  const order = await getOrderById(id);
  if (!order) return c.json({ error: 'Order not found' }, 404);
  return c.json({ order });
});

app.get('/api/_admin/db/raw', async (c) => {
  return c.json({
    ok: true,
    db: Boolean(db),
  });
});

app.notFound((c) => c.json({ error: 'Not found' }, 404));
app.onError((err, c) =>
  c.json(
    {
      error: 'Internal server error',
      message: err?.message ?? 'Unknown error',
    },
    500
  )
);

export default app;