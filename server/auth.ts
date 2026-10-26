// [auto-quarantined uninstalled package "better-auth"] import { betterAuth } from 'better-auth';
const betterAuth: any = typeof Proxy !== 'undefined' ? new Proxy((() => null) as any, { get: () => betterAuth, apply: () => null }) : (() => null);
// [auto-quarantined uninstalled package "better-auth/adapters/libsql"] import { libsqlAdapter } from 'better-auth/adapters/libsql';
const libsqlAdapter: any = typeof Proxy !== 'undefined' ? new Proxy((() => null) as any, { get: () => libsqlAdapter, apply: () => null }) : (() => null);
import db from './db';

const auth = betterAuth({
  database: libsqlAdapter(db, {
    provider: 'sqlite',
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
  },
  user: {
    additionalFields: {
      name: {
        type: 'string',
        required: false,
      },
    },
  },
});

export { auth };
export default auth;