import { betterAuth } from "better-auth";
import { client } from "./db";

const database = {
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
  database,
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
