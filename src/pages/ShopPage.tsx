import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { AlertCircle, RefreshCw } from 'lucide-react';
import { CommerceSections } from "@/components/CommerceSections";
import type { Product } from "@/types";

export function ShopPage() {
  const location = useLocation();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const search = useMemo(() => new URLSearchParams(location.search).get("q") ?? "", [location.search]);

  useEffect(() => {
    const controller = new AbortController();
    const loadProducts = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await fetch("/api/products", { signal: controller.signal });
        const json = (await res.json()) as { success?: boolean; data?: Product[]; error?: string; message?: string };
        if (!res.ok || json?.success === false) throw new Error(json?.error ?? json?.message ?? "Unable to load products.");
        setProducts(Array.isArray(json?.data) ? json.data : []);
      } catch (err) {
        if ((err as { name?: string })?.name !== "AbortError") setError((err as Error)?.message ?? "Unable to load products.");
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
    return () => controller.abort();
  }, []);

  return (
    <main className="bg-[#F5F1E9] text-[#2E2E2E]">
      {error ? (
        <div className="mx-auto flex max-w-7xl items-center gap-3 border-b border-[#CFC1AD] bg-[#FFFCF6] px-4 py-3 text-sm text-[#6F675D] sm:px-6 lg:px-8">
          <AlertCircle className="h-4 w-4 shrink-0 text-[#8B0000]" />
          <span className="min-w-0 flex-1 truncate">{error}</span>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="inline-flex items-center gap-2 border border-[#CFC1AD] bg-[#FFFCF6] px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#2E2E2E] transition-colors hover:bg-[#F5F1E9]"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Retry
          </button>
        </div>
      ) : null}
      <CommerceSections products={products} />
    </main>
  );
}

export default ShopPage;