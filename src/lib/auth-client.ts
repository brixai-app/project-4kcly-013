// [auto-quarantined uninstalled package "better-auth/react"] import { createAuthClient } from "better-auth/react";
const createAuthClient: any = typeof Proxy !== 'undefined' ? new Proxy((() => null) as any, { get: () => createAuthClient, apply: () => null }) : (() => null);

export const authClient = createAuthClient({
  baseURL: typeof window !== "undefined" ? window.location.origin : "",
});

export const { signIn, signUp, signOut, useSession } = authClient;

export default authClient;