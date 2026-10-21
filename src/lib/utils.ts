import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Merge conditional classes while resolving conflicting Tailwind utilities. */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/**
 * Resolve storage lazily: importing this module is safe outside the browser.
 * Access itself may throw in restricted browsers or sandboxed documents.
 */
function getLocalStorage(): Storage | null {
  try {
    return typeof window === "undefined" ? null : window.localStorage;
  } catch {
    return null;
  }
}

/**
 * Domain-agnostic JSON storage adapter, not a raw-string Storage replacement.
 *
 * Application keys, schema validation, versioning, persistence decisions, and
 * mock commerce state belong exclusively in src/mock.ts. Generic type arguments
 * describe the expected value; they do not perform runtime schema validation.
 * Failed operations leave callers free to continue with in-memory state.
 */
export const safeStorage = {
  /** Read JSON, returning the supplied fallback for missing or invalid data. */
  getItem<T = unknown>(key: string, fallback: T | null = null): T | null {
    try {
      const storage = getLocalStorage();
      if (!storage) return fallback;

      const serialized = storage.getItem(key);
      if (serialized === null) return fallback;

      return JSON.parse(serialized) as T;
    } catch {
      // Do not delete malformed data: recovery policy belongs to the caller.
      return fallback;
    }
  },

  /**
   * Write JSON and report success. Circular values, unsupported JSON values,
   * exhausted quotas, and denied storage access return false without throwing.
   */
  setItem<T>(key: string, value: T): boolean {
    try {
      const storage = getLocalStorage();
      if (!storage) return false;

      const serialized = JSON.stringify(value);
      if (serialized === undefined) return false;

      storage.setItem(key, serialized);
      return true;
    } catch {
      return false;
    }
  },

  /** Remove only the requested key; never clear unrelated browser data. */
  removeItem(key: string): boolean {
    try {
      const storage = getLocalStorage();
      if (!storage) return false;

      storage.removeItem(key);
      return true;
    } catch {
      return false;
    }
  },
};