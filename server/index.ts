import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { auth } from './auth';
import { createOrder, getProductById, getProducts, initDb } from './db';
import type { CartItem, Order, ShippingInfo } from '../src/types';

const app = new Hono();

app.use('*', cors({ origin: '*', allowHeaders: ['Content-Type', 'Authorization'], allowMethods: ['GET', 'POST', 'OPTIONS'] }));

const json = (data: unknown, status = 200) => app.json(data, status);

const isString = (value: unknown): value is string => typeof value === 'string' && value.trim().length > 0;
const isNumber = (value: unknown): value is number => typeof value === 'number' && Number.isFinite(value);
const isCartItem = (value: unknown): value is CartItem => {
  const item = value as CartItem | null | undefined;
  return !!item && isString(item.productId) && isNumber(item.quantity) && item.quantity > 0;
};

const isShippingInfo = (value: unknown): value is ShippingInfo => {
  const s = value as ShippingInfo | null | undefined;
  return !!s && ['fullName', 'email', 'phone', 'addressLine1', 'city', 'state', 'postalCode', 'country'].every((key) => isString((s as Record<string, unknown>)?.[key]));
};

app.route('/api/auth', auth);

app.get('/api/products', async (c) => {
  await initDb();
  const products = await getProducts();
  return c.json({ products });
});

app.get('/api/products/:id', async (c) => {
  await initDb();
  const product = await getProductById(c.req.param('id') ?? '');
  if (!product) return c.json({ error: 'Product not found' }, 404);
  return c.json({ product });
});

app.post('/api/orders', async (c) => {
  await initDb();
  const body = await c.req.json().catch(() => null);
  const items = body?.items as unknown;
  const shipping = body?.shipping as unknown;
  const subtotal = body?.subtotal;
  const shippingFee = body?.shippingFee;
  const total = body?.total;

  if (!Array.isArray(items) || !items.every(isCartItem) || !isShippingInfo(shipping) || !isNumber(subtotal) || !isNumber(shippingFee) || !isNumber(total)) {
    return c.json({ error: 'Invalid order payload' }, 400);
  }

  const orderInput: Omit<Order, 'id' | 'createdAt'> = {
    items,
    shipping,
    subtotal,
    shippingFee,
    total,
    status: 'pending',
  };

  const order = await createOrder(orderInput);
  return c.json({ order }, 201);
});

app.get('/api/_admin/db/tables', async (c) => {
  await initDb();
  const tables = await c.req.env?.DB ? [] : [];
  return c.json({ tables });
});

app.get('/api/_admin/db/products', async (c) => {
  await initDb();
  const products = await getProducts();
  return c.json({ products });
});

app.get('/api/_admin/db/orders', async (c) => {
  await initDb();
  return c.json({ orders: [] });
});

export { app };
export default app;