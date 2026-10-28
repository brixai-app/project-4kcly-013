import { Hono } from 'hono';
import { cors } from 'hono/cors';
import auth from './auth';
import { getTableData, initializeDatabase, inspectTables } from './db';

type Env = { Bindings?: Record<string, never>; Variables?: Record<string, never> };

const app = new Hono<Env>();

const jsonHeaders = { 'Content-Type': 'application/json' };

const corsMiddleware = cors({
  origin: '*',
  allowHeaders: ['Content-Type', 'Authorization'],
  allowMethods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  exposeHeaders: ['Content-Length'],
  maxAge: 86400,
});

app.use('*', corsMiddleware);

const ok = <T,>(data: T, message?: string) => new Response(JSON.stringify({ success: true, data, message }), { headers: jsonHeaders });
const fail = (message: string, code = 'BAD_REQUEST', status = 400, details?: unknown) =>
  new Response(JSON.stringify({ success: false, message, code, details }), { status, headers: jsonHeaders });

const isString = (v: unknown) => typeof v === 'string' && v.trim().length > 0;
const isArray = Array.isArray;

const parseJson = async <T,>(c: any): Promise<T | null> => {
  try {
    return (await c.req.json()) as T;
  } catch {
    return null;
  }
};

const normalizeItems = (items: any[]) =>
  items
    .filter((item) => isString(item?.productId) && Number.isFinite(Number(item?.quantity)) && Number(item?.quantity) > 0 && isString(item?.size))
    .map((item) => ({
      productId: String(item.productId),
      quantity: Math.max(1, Math.floor(Number(item.quantity))),
      size: String(item.size),
    }));

const normalizeAddress = (address: any) => ({
  fullName: String(address?.fullName ?? '').trim(),
  phone: String(address?.phone ?? '').trim(),
  line1: String(address?.line1 ?? '').trim(),
  line2: String(address?.line2 ?? '').trim(),
  city: String(address?.city ?? '').trim(),
  state: String(address?.state ?? '').trim(),
  postalCode: String(address?.postalCode ?? '').trim(),
  country: String(address?.country ?? 'India').trim(),
});

const validateCheckout = (payload: any) => {
  const items = normalizeItems(payload?.items ?? []);
  const shippingAddress = normalizeAddress(payload?.shippingAddress ?? {});
  const paymentMethod = String(payload?.paymentMethod ?? '').trim();
  const notes = String(payload?.notes ?? '').trim();

  if (!items.length) return { error: 'At least one cart item is required.' };
  if (!shippingAddress.fullName || !shippingAddress.phone || !shippingAddress.line1 || !shippingAddress.city || !shippingAddress.state || !shippingAddress.postalCode || !shippingAddress.country) {
    return { error: 'Complete shipping address is required.' };
  }
  if (!['card', 'upi', 'cod'].includes(paymentMethod)) return { error: 'Invalid payment method.' };

  return { items, shippingAddress, paymentMethod, notes: notes || undefined };
};

app.get('/api/health', async () => ok({ status: 'ok', initialized: true }, 'Jootiya API is running'));

app.get('/api/bootstrap', async () => {
  await initializeDatabase();
  const tables = await inspectTables();
  return ok({ tables }, 'Database initialized');
});

app.get('/api/products', async (c) => {
  await initializeDatabase();
  const data = await getTableData('products');
  return ok(data ?? [], 'Products loaded');
});

app.get('/api/products/:id', async (c) => {
  await initializeDatabase();
  const id = c.req.param('id');
  const products = (await getTableData('products')) ?? [];
  const product = products.find((item: any) => String(item?.id ?? '') === id || String(item?.slug ?? '') === id);
  if (!product) return fail('Product not found', 'NOT_FOUND', 404);
  return ok(product, 'Product loaded');
});

app.get('/api/artisans', async () => {
  await initializeDatabase();
  const data = await getTableData('artisans');
  return ok(data ?? [], 'Artisans loaded');
});

app.get('/api/orders', async () => {
  await initializeDatabase();
  const data = await getTableData('orders');
  return ok(data ?? [], 'Orders loaded');
});

app.post('/api/orders', async (c) => {
  await initializeDatabase();
  const payload = await parseJson<any>(c);
  const validated = validateCheckout(payload);
  if ('error' in validated) return fail(validated.error, 'INVALID_CHECKOUT', 400);

  const order = {
    id: crypto.randomUUID(),
    userId: payload?.userId ?? null,
    items: validated.items,
    subtotal: Number(payload?.subtotal ?? 0),
    shipping: Number(payload?.shipping ?? 0),
    total: Number(payload?.total ?? 0),
    currency: String(payload?.currency ?? 'INR'),
    status: 'confirmed',
    shippingAddress: validated.shippingAddress,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    paymentMethod: validated.paymentMethod,
    notes: validated.notes ?? null,
  };

  const orders = (await getTableData('orders')) ?? [];
  orders.unshift(order);
  return ok(order, 'Order placed');
});

app.post('/api/custom-orders', async (c) => {
  await initializeDatabase();
  const payload = await parseJson<any>(c);
  const name = String(payload?.name ?? '').trim();
  const phone = String(payload?.phone ?? '').trim();
  const occasion = String(payload?.occasion ?? '').trim();
  const size = String(payload?.size ?? '').trim();

  if (!name || !phone || !occasion || !size) return fail('Name, phone, occasion, and size are required.', 'INVALID_CUSTOM_ORDER', 400);

  const request = {
    id: crypto.randomUUID(),
    name,
    phone,
    email: String(payload?.email ?? '').trim() || undefined,
    occasion,
    size,
    colorPreference: String(payload?.colorPreference ?? '').trim() || undefined,
    notes: String(payload?.notes ?? '').trim() || undefined,
    referenceImages: isArray(payload?.referenceImages) ? payload.referenceImages.filter((item: unknown) => isString(item)).slice(0, 6) : [],
    status: 'new',
    createdAt: new Date().toISOString(),
  };

  const customOrders = (await getTableData('custom_orders')) ?? [];
  customOrders.unshift(request);
  return ok(request, 'Custom order submitted');
});

app.get('/api/admin/tables', async () => {
  await initializeDatabase();
  const tables = await inspectTables();
  return ok(tables, 'Tables inspected');
});

app.get('/api/admin/tables/:name', async (c) => {
  await initializeDatabase();
  const name = c.req.param('name');
  const data = await getTableData(name);
  return ok(data ?? [], `Table ${name} loaded`);
});

app.route('/api/auth', auth as any);

app.on(['OPTIONS'], '*', () => new Response(null, { status: 204 }));

export default app;