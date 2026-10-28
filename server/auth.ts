import { betterAuth } from 'better-auth';
import { db, initializeDatabase } from './db';

const encoder = new TextEncoder();

async function sha256Hex(password: string): Promise<string> {
  const bytes = encoder.encode(password ?? '');
  const hash = await crypto.subtle.digest('SHA-256', bytes);
  return Array.from(new Uint8Array(hash))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');
}

const memoryAdapter = {
  async createUser(data: Record<string, unknown>) {
    await initializeDatabase();
    const id = (data?.id as string | undefined) ?? crypto.randomUUID();
    const email = String(data?.email ?? '').toLowerCase();
    const name = String(data?.name ?? '');
    const password = String(data?.password ?? '');
    const passwordHash = await sha256Hex(password);
    await db.execute({
      sql: 'INSERT INTO users (id, name, email, password_hash, email_verified, created_at, updated_at) VALUES (?, ?, ?, ?, ?, datetime("now"), datetime("now"))',
      args: [id, name, email, passwordHash, 0],
    });
    return { ...data, id, email, name, passwordHash, emailVerified: false };
  },
  async getUser(id: string) {
    await initializeDatabase();
    const result = await db.execute({ sql: 'SELECT * FROM users WHERE id = ? LIMIT 1', args: [id] });
    return result.rows?.[0] ?? null;
  },
  async getUserByEmail(email: string) {
    await initializeDatabase();
    const result = await db.execute({
      sql: 'SELECT * FROM users WHERE lower(email) = lower(?) LIMIT 1',
      args: [email],
    });
    return result.rows?.[0] ?? null;
  },
  async updateUser(id: string, data: Record<string, unknown>) {
    await initializeDatabase();
    const current = await this.getUser(id);
    if (!current) return null;
    const nextName = String(data?.name ?? current?.name ?? '');
    const nextEmail = String(data?.email ?? current?.email ?? '').toLowerCase();
    const nextVerified = Boolean(data?.emailVerified ?? current?.email_verified ?? current?.emailVerified ?? false);
    await db.execute({
      sql: 'UPDATE users SET name = ?, email = ?, email_verified = ?, updated_at = datetime("now") WHERE id = ?',
      args: [nextName, nextEmail, nextVerified ? 1 : 0, id],
    });
    return { ...current, ...data, id, name: nextName, email: nextEmail, emailVerified: nextVerified };
  },
};

const auth = betterAuth({
  appName: 'Jootiya',
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
    async hashPassword(password: string) {
      return sha256Hex(password);
    },
    async verifyPassword({ password, hash }: { password: string; hash: string }) {
      return (await sha256Hex(password)) === (hash ?? '');
    },
  },
  database: memoryAdapter as never,
  user: {
    additionalFields: {},
  },
});

export { auth, memoryAdapter, sha256Hex };
export default auth;