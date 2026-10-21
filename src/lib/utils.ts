import { type ClassValue } from "clsx";
import clsx from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Utility used across the app (and by shadcn components) to merge
 * conditional class names while resolving Tailwind CSS conflicts.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/**
 * Safe wrapper around localStorage for this **frontend-only, mock-backed** app.
 *
 * All persistence in Jootiya is purely client-side; there is **no backend**.
 * This helper ensures storage access never throws (SSR, private mode, quota).
 */
export const safeStorage = {
  /** True when localStorage is available and functional in this environment. */
  isAvailable(): boolean {
    if (typeof window === "undefined") return false;
    try {
      const key = "__jootiya_test__";
      window.localStorage.setItem(key, "1");
      window.localStorage.removeItem(key);
      return true;
    } catch {
      return false;
    }
  },

  /** Read a raw string value from localStorage, or null on any failure. */
  getItem(key: string): string | null {
    if (!this.isAvailable()) return null;
    try {
      return window.localStorage.getItem(key);
    } catch {
      return null;
    }
  },

  /** Persist a raw string value to localStorage, ignoring any failures. */
  setItem(key: string, value: string): void {
    if (!this.isAvailable()) return;
    try {
      window.localStorage.setItem(key, value);
    } catch {
      // Silently ignore; persistence is best-effort only in this mock app.
    }
  },

  /** Remove a key from localStorage, ignoring any failures. */
  removeItem(key: string): void {
    if (!this.isAvailable()) return;
    try {
      window.localStorage.removeItem(key);
    } catch {
      // Ignore
    }
  },

  /**
   * Read a JSON value from localStorage and parse it.
   * Returns `fallback` (or null) on any error.
   */
  getJSON<T>(key: string, fallback: T | null = null): T | null {
    const raw = this.getItem(key);
    if (raw == null) return fallback;
    try {
      return JSON.parse(raw) as T;
    } catch {
      return fallback;
    }
  },

  /**
   * Stringify and store a JSON-serializable value to localStorage.
   * No-op on failure.
   */
  setJSON<T>(key: string, value: T): void {
    if (!this.isAvailable()) return;
    try {
      const serialized = JSON.stringify(value);
      this.setItem(key, serialized);
    } catch {
      // Ignore; persistence is best-effort only.
    }
  },
};

export type SafeStorage = typeof safeStorage;