import { betterAuth } from "better-auth";
import { libsqlAdapter } from "better-auth/adapters/libsql";
import db from "./db";

const auth = betterAuth({
  appName: "Jootiya",
  database: libsqlAdapter(db, {
    provider: "sqlite",
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
  },
  user: {
    additionalFields: {
      name: {
        type: "string",
        required: false,
      },
    },
  },
  session: {
    expiresIn: 60 * 60 * 24 * 30,
    updateAge: 60 * 60 * 24,
  },
  trustedOrigins: (process.env?.BETTER_AUTH_TRUSTED_ORIGINS ?? "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean),
});

export { auth };
export default auth;