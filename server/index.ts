// [auto-quarantined uninstalled package "hono"] import { Hono } from 'hono';
const Hono: any = typeof Proxy !== 'undefined' ? new Proxy((() => null) as any, { get: () => Hono, apply: () => null }) : (() => null);
// [auto-quarantined uninstalled package "hono/cors"] import { cors } from 'hono/cors';
const cors: any = typeof Proxy !== 'undefined' ? new Proxy((() => null) as any, { get: () => cors, apply: () => null }) : (() => null);
import auth from './auth';
import {
  getCatalog,
  getOrders,
  initDb,
  inspectTables,
  seedCatalog,
  writeOrder,
} from './db';
import type { Order, CartItem, ShippingMethod, PaymentMethod } from '../src/types';

const app = new Hono();

app.use('*', cors({ origin: '*', credentials: true }));

const isString = (value: unknown): value is string => typeof value === 'string';
const isNumber = (value: unknown): value is number => typeof value === 'number' && Number.isFinite(value);
const isObject = (value: unknown): value is Record<string, unknown> => !!value && typeof value === 'object' && !Array.isArray(value);

const normalizeCartItem = (value: unknown): CartItem | null => {
  if (!isObject(value)) return null;
  const productId = isString(value.productId) ? value.productId : '';
  const size = isString(value.size) ? value.size : '';
  const quantity = isNumber(value.quantity) ? Math.max(1, Math.floor(value.quantity)) : 0;
  const color = value.color == null ? null : isString(value.color) ? value.color : null;
  if (!productId || !size || quantity < 1) return null;
  return { productId, size, quantity, color };
};

const normalizeShippingMethod = (value: unknown): ShippingMethod | null => {
  if (!isObject(value)) return null;
  const id = isString(value.id) ? value.id : '';
  const label = isString(value.label) ? value.label : '';
  const eta = isString(value.eta) ? value.eta : '';
  const price = isNumber(value.price) ? value.price : NaN;
  if (!id || !label || !eta || !Number.isFinite(price)) return null;
  return { id, label, eta, price };
};

const normalizeOrder = (value: unknown): Order | null => {
  if (!isObject(value)) return null;
  const id = isString(value.id) ? value.id : crypto.randomUUID();
  const customer = isObject(value.customer)
    ? {
        id: isString(value.customer?.id) ? value.customer.id : crypto.randomUUID(),
        name: isString(value.customer?.name) ? value.customer.name : '',
        email: isString(value.customer?.email) ? value.customer.email : '',
        phone: value.customer?.phone == null ? null : isString(value.customer?.phone) ? value.customer.phone : null,
      }
    : null;
  const items = Array.isArray(value.items) ? value.items.map(normalizeCartItem).filter(Boolean) as CartItem[] : [];
  const subtotal = isNumber(value.subtotal) ? value.subtotal : NaN;
  const shipping = isNumber(value.shipping) ? value.shipping : NaN;
  const total = isNumber(value.total) ? value.total : NaN;
  const shippingMethod = normalizeShippingMethod(value.shippingMethod);
  const paymentMethod = value.paymentMethod;
  const status = isString(value.status) ? value.status : 'pending';
  const createdAt = isString(value.createdAt) ? value.createdAt : new Date().toISOString();

  if (!customer?.name || !customer?.email || items.length === 0 || !shippingMethod) return null;
  if (!Number.isFinite(subtotal) || !Number.isFinite(shipping) || !Number.isFinite(total)) return null;
  if (!['card', 'upi', 'cod', 'wallet'].includes(paymentMethod as string)) return null;

  return {
    id,
    customer,
    items,
    subtotal,
    shipping,
    total,
    shippingMethod,
    paymentMethod: paymentMethod as PaymentMethod,
    status: ['pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled'].includes(status) ? (status as Order['status']) : 'pending',
    createdAt,
  };
};

app.get('/api/health', (c) => c.json({ ok: true }));

app.route('/api/auth', auth as never);

app.get('/api/catalog', async (c) => {
  await initDb();
  await seedCatalog();
  const catalog = await getCatalog();
  return c.json({ products: catalog });
});

app.post('/api/orders', async (c) => {
  await initDb();
  const payload = await c.req.json().catch(() => null);
  const order = normalizeOrder(payload);
  if (!order) return c.json({ error: 'Invalid order payload' }, 400);
  await writeOrder(order);
  return c.json({ ok: true, order }, 201);
});

app.get('/api/orders', async (c) => {
  await initDb();
  const orders = await getOrders();
  return c.json({ orders });
});

app.get('/api/_admin/db/tables', async (c) => {
  await initDb();
  const tables = await inspectTables();
  return c.json({ tables });
});

app.get('/api/_admin/db/catalog', async (c) => {
  await initDb();
  const products = await getCatalog();
  return c.json({ products });
});

app.get('/api/_admin/db/orders', async (c) => {
  await initDb();
  const orders = await getOrders();
  return c.json({ orders });
});

export default app;