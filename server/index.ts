import { Hono } from 'hono';
import { cors } from 'hono/cors';
import auth from './auth';
import {
  init,
  getItemBySlug,
  getOrderById,
  listItems,
  listOrders,
  writeOrder,
} from './db';

const app = new Hono();

app.use('*', cors({ origin: '*', allowMethods: ['GET', 'POST', 'OPTIONS'], allowHeaders: ['Content-Type', 'Authorization'] }));

app.get('/api/health', (c) => c.json({ ok: true, service: 'jootiya' }));

app.all('/api/auth/*', async (c) => {
  const handler = auth?.handler ?? auth;
  return handler(c);
});

app.get('/api/items', async (c) => {
  const items = await listItems();
  return c.json({ items });
});

app.get('/api/items/:slug', async (c) => {
  const slug = c.req.param('slug') ?? '';
  const item = await getItemBySlug(slug);
  if (!item) return c.json({ error: 'Item not found' }, 404);
  return c.json({ item });
});

app.get('/api/orders', async (c) => {
  const orders = await listOrders();
  return c.json({ orders });
});

app.post('/api/orders', async (c) => {
  const body = await c.req.json().catch(() => ({}));
  const customerName = String(body?.customerName ?? '').trim();
  const email = String(body?.email ?? '').trim();
  const items = Array.isArray(body?.items) ? body.items : [];
  const subtotal = Number(body?.subtotal ?? 0);

  if (!customerName || !email || items.length === 0 || !Number.isFinite(subtotal) || subtotal < 0) {
    return c.json({ error: 'Invalid order payload' }, 400);
  }

  const order = await writeOrder({
    id: String(body?.id ?? crypto.randomUUID()),
    cartId: body?.cartId ? String(body.cartId) : undefined,
    customerName,
    email,
    phone: body?.phone ? String(body.phone) : undefined,
    address: body?.address ? String(body.address) : undefined,
    city: body?.city ? String(body.city) : undefined,
    state: body?.state ? String(body.state) : undefined,
    pincode: body?.pincode ? String(body.pincode) : undefined,
    notes: body?.notes ? String(body.notes) : undefined,
    items,
    subtotal,
    status: body?.status === 'confirmed' || body?.status === 'cancelled' ? body.status : 'submitted',
    createdAt: String(body?.createdAt ?? new Date().toISOString()),
    updatedAt: body?.updatedAt ? String(body.updatedAt) : undefined,
  });

  return c.json({ order }, 201);
});

app.get('/api/orders/:id', async (c) => {
  const id = c.req.param('id') ?? '';
  const order = await getOrderById(id);
  if (!order) return c.json({ error: 'Order not found' }, 404);
  return c.json({ order });
});

app.get('/api/_admin/db/items', async (c) => {
  const items = await listItems();
  return c.json({ count: items.length, items });
});

app.get('/api/_admin/db/orders', async (c) => {
  const orders = await listOrders();
  return c.json({ count: orders.length, orders });
});

app.get('/api/_admin/db/inspect', async (c) => {
  const [items, orders] = await Promise.all([listItems(), listOrders()]);
  return c.json({ ok: true, items: items.length, orders: orders.length });
});

await init();

export { app };
export default app;