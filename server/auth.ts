// [auto-quarantined uninstalled package "better-auth"] import { betterAuth } from "better-auth";
const betterAuth: any = typeof Proxy !== 'undefined' ? new Proxy((() => null) as any, { get: () => betterAuth, apply: () => null }) : (() => null);
import db from "./db";

export const auth = betterAuth({
  database: db,
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
  },
  user: {
    additionalFields: {
      fullName: {
        type: "string",
        required: false,
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

export default auth;