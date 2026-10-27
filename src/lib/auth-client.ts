import { createAuthClient } from 'better-auth/react';

// Create underlying Better Auth client safely
let rawClient: any = null;
try {
  rawClient = createAuthClient({
    baseURL: typeof window !== 'undefined' ? window.location.origin : 'http://localhost:5173',
  });
} catch (err) {
  console.warn('[auth-client] Failed to initialize createAuthClient:', err);
}

// Fallback session state ensuring destructuring never crashes
const fallbackSessionState = {
  data: null,
  session: null,
  user: null,
  isPending: false,
  error: null,
};

// Safe hook wrapper that NEVER returns null and provides safe session/user/data props
export const useSession = () => {
  try {
    if (rawClient && typeof rawClient.useSession === 'function') {
      const res = rawClient.useSession();
      if (res && typeof res === 'object') {
        return {
          ...res,
          session: res.session ?? res.data?.session ?? res.data ?? null,
          user: res.user ?? res.data?.user ?? null,
          data: res.data ?? null,
          isPending: res.isPending ?? false,
          error: res.error ?? null,
        };
      }
    }
  } catch (e) {
    console.warn('[auth-client] Error calling useSession:', e);
  }
  return fallbackSessionState;
};

// Safe action helpers that never crash if client is offline or null
export const signIn = rawClient?.signIn ?? {
  email: async () => ({ error: { message: 'Authentication server unavailable' } }),
  social: async () => ({ error: { message: 'Authentication server unavailable' } }),
};

export const signUp = rawClient?.signUp ?? {
  email: async () => ({ error: { message: 'Authentication server unavailable' } }),
};

export const signOut = rawClient?.signOut ?? (async () => ({ success: true }));

export const getSession = rawClient?.getSession ?? (async () => fallbackSessionState);

export const authClient = rawClient || {
  signIn,
  signUp,
  signOut,
  useSession,
  getSession,
};

export default authClient;
