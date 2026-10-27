import { betterAuth } from "better-auth";

const isDatabaseReady = Boolean(process.env.DATABASE_URL ?? process.env.BETTER_AUTH_URL ?? process.env.POSTGRES_URL);

const database = isDatabaseReady
  ? undefined
  : {
      async findMany() {
        return [];
      },
      async findOne() {
        return null;
      },
      async create() {
        return null;
      },
      async update() {
        return null;
      },
      async delete() {
        return null;
      },
    };

export const auth = betterAuth({
  ...(database ? { database } : {}),
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
