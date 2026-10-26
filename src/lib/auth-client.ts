// [auto-quarantined uninstalled package "better-auth/react"] import { createAuthClient } from "better-auth/react";
const createAuthClient: any = typeof Proxy !== 'undefined' ? new Proxy((() => null) as any, { get: () => createAuthClient, apply: () => null }) : (() => null);

const authClient = createAuthClient({
  baseURL: "/api/auth",
});

export const auth = authClient;
export default authClient;