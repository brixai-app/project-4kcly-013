// [auto-quarantined uninstalled package "better-auth"] import { betterAuth } from 'better-auth';
const betterAuth: any = typeof Proxy !== 'undefined' ? new Proxy((() => null) as any, { get: () => betterAuth, apply: () => null }) : (() => null);
import { db } from './db';

const auth = betterAuth({
  database: {
    provider: 'sqlite',
    db,
  },
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
    minPasswordLength: 8,
  },
  user: {
    additionalFields: {
      name: {
        type: 'string',
        required: true,
      },
    },
  },
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 60 * 60 * 24,
    },
  },
});

export { auth };
export default auth;