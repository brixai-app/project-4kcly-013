// [auto-quarantined uninstalled package "hono"] import { Hono } from 'hono';
const Hono: any = typeof Proxy !== 'undefined' ? new Proxy((() => null) as any, { get: () => Hono, apply: () => null }) : (() => null);
// [auto-quarantined uninstalled package "hono/cors"] import { cors } from 'hono/cors';
const cors: any = typeof Proxy !== 'undefined' ? new Proxy((() => null) as any, { get: () => cors, apply: () => null }) : (() => null);
import auth from './auth';
import { createOrder, getOrderById, getProducts, initDb } from './db';
import type { Order } from '../src/types';

const index = new Hono();

index.use(
  '*',
  cors({
    origin: '*',
    allowMethods: ['GET', 'POST', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization'],
    exposeHeaders: ['Content-Length'],
    maxAge: 86400,
  }),
);

index.route('/api/auth', auth);

const jsonError = (message: string, status = 400) =>
  index.json({ success: false, message }, status);

const isString = (value: unknown): value is string => typeof value === 'string' && value.trim().length > 0;

const isOrderPayload = (body: unknown): body is Order => {
  const order = body as Partial<Order> | null;
  return !!order && Array.isArray(order.items) && typeof order.subtotal === 'number' && typeof order.shipping === 'number' && typeof order.total === 'number' && typeof order.shippingInfo === 'object' && typeof order.paymentInfo === 'object';
};

index.get('/api/health', (c) => c.json({ success: true, data: { ok: true } }));

index.post('/api/orders', async (c) => {
  try {
    const body = await c.req.json().catch(() => null);
    if (!isOrderPayload(body)) return c.json({ success: false, message: 'Invalid order payload' }, 400);

    const shippingInfo = body.shippingInfo;
    const paymentInfo = body.paymentInfo;
    const requiredShipping = ['fullName', 'phone', 'email', 'addressLine1', 'city', 'state', 'postalCode', 'country'] as const;
    const missingShipping = requiredShipping.filter((key) => !isString((shippingInfo as Record<string, unknown>)?.[key]));
    if (missingShipping.length > 0) return c.json({ success: false, message: `Missing shipping fields: ${missingShipping.join(', ')}` }, 400);

    if (!Array.isArray(body.items) || body.items.length === 0) return c.json({ success: false, message: 'Order must contain at least one item' }, 400);
    if (!isString(body.id) || !isString(body.orderNumber)) return c.json({ success: false, message: 'Missing order identifiers' }, 400);
    if (!['card', 'upi', 'cod'].includes(paymentInfo?.method ?? '')) return c.json({ success: false, message: 'Unsupported payment method' }, 400);

    const saved = await createOrder({
      ...body,
      createdAt: body.createdAt ?? new Date().toISOString(),
      status: body.status ?? 'confirmed',
    });

    return c.json({ success: true, data: saved }, 201);
  } catch (error) {
    return c.json({ success: false, message: error instanceof Error ? error.message : 'Failed to create order' }, 500);
  }
});

index.get('/api/orders/:id', async (c) => {
  try {
    const id = c.req.param('id');
    if (!isString(id)) return c.json({ success: false, message: 'Invalid order id' }, 400);
    const order = await getOrderById(id);
    if (!order) return c.json({ success: false, message: 'Order not found' }, 404);
    return c.json({ success: true, data: order });
  } catch (error) {
    return c.json({ success: false, message: error instanceof Error ? error.message : 'Failed to fetch order' }, 500);
  }
});

index.get('/api/_admin/db/products', async (c) => {
  try {
    const products = await getProducts();
    return c.json({ success: true, data: products });
  } catch (error) {
    return c.json({ success: false, message: error instanceof Error ? error.message : 'Failed to fetch products' }, 500);
  }
});

index.get('/api/_admin/db/orders/:id', async (c) => {
  try {
    const id = c.req.param('id');
    if (!isString(id)) return c.json({ success: false, message: 'Invalid order id' }, 400);
    const order = await getOrderById(id);
    if (!order) return c.json({ success: false, message: 'Order not found' }, 404);
    return c.json({ success: true, data: order });
  } catch (error) {
    return c.json({ success: false, message: error instanceof Error ? error.message : 'Failed to inspect order' }, 500);
  }
});

index.get('/api/_admin/db/inspect', async (c) => {
  try {
    const products = await getProducts();
    return c.json({
      success: true,
      data: {
        tables: ['products', 'orders'],
        counts: { products: products.length },
      },
    });
  } catch (error) {
    return c.json({ success: false, message: error instanceof Error ? error.message : 'Failed to inspect database' }, 500);
  }
});

await initDb().catch(() => undefined);

export default index;