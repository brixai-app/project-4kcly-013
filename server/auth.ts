// [auto-quarantined uninstalled package "better-auth"] import { betterAuth } from 'better-auth';
const betterAuth: any = typeof Proxy !== 'undefined' ? new Proxy((() => null) as any, { get: () => betterAuth, apply: () => null }) : (() => null);
import { db } from './db';

export const auth = betterAuth({
  database: db,
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
  },
  user: {
    additionalFields: {},
  },
  session: {
    expiresIn: 60 * 60 * 24 * 30,
    updateAge: 60 * 60 * 24,
  },
  trustedOrigins: [],
});

export default auth;