import { betterAuth } from "better-auth";
import { db } from "./db";

const auth = betterAuth({
  database: {
    provider: "sqlite",
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
        type: "string",
        required: false,
      },
    },
  },
  session: {
    expiresIn: 60 * 60 * 24 * 30,
    updateAge: 60 * 60 * 24,
  },
  advanced: {
    cookiePrefix: "jootiya",
  },
});

export { auth };
export default auth;