// [auto-quarantined uninstalled package "better-auth"] import { betterAuth } from "better-auth";
const betterAuth: any = typeof Proxy !== 'undefined' ? new Proxy((() => null) as any, { get: () => betterAuth, apply: () => null }) : (() => null);
import db from "./db";

const auth = betterAuth({
  database: db,
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
  },
  user: {
    additionalFields: {},
  },
});

export { auth };
export default auth;