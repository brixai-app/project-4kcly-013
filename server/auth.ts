import { betterAuth } from 'better-auth';
import { memoryAdapter } from 'better-auth/adapters/memory';

const auth = betterAuth({
  appName: 'Jootiya',
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
  },
  user: {
    additionalFields: {},
  },
  database: memoryAdapter(),
});

export default auth;