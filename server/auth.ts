import { betterAuth } from "better-auth";
import { libsqlAdapter } from "better-auth/adapters/libsql";
import { client } from "./db";

export const auth = betterAuth({
  database: libsqlAdapter(client, {
    provider: "sqlite",
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
  },
  session: {
    expiresIn: 60 * 60 * 24 * 30,
    updateAge: 60 * 60 * 24,
  },
  user: {
    additionalFields: {},
  },
});

export default auth;