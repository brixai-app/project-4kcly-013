import { Hono } from 'hono';
import { cors } from 'hono/cors';
import auth from './auth';
import { getItemById, getItems, initSchema, saveOrder } from './db';

const index = new Hono();

index.use('*', cors());

index.all('/api/auth/*', (c) => auth.handler(c.req.raw));

index.get('/api/products', async (c) => {
  const items = await getItems();
  return c.json({ items });
});

index.get('/api/products/:id', async (c) => {
  const id = c.req.param('id') ?? '';
  const item = await getItemById(id);
  if (!item) return c.json({ error: 'Product not found' }, 404);
  return c.json({ item });
});

index.post('/api/orders', async (c) => {
  const body = await c.req.json().catch(() => null);
  if (!body?.items?.length || !body?.shipping || !body?.paymentMethod) {
    return c.json({ error: 'Invalid order payload' }, 400);
  }
  const order = await saveOrder(body);
  return c.json({ order }, 201);
});

index.get('/api/_admin/db/schema', async (c) => {
  await initSchema();
  return c.json({ ok: true });
});

index.get('/api/_admin/db/rows', async (c) => {
  const items = await getItems();
  return c.json({ products: items, count: items?.length ?? 0 });
});

index.get('/api/_admin/db/rows/:id', async (c) => {
  const id = c.req.param('id') ?? '';
  const item = await getItemById(id);
  return c.json({ item });
});

await initSchema();

export default index;