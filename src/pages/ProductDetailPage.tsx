import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import type { Product } from "@/types";
import { CommerceSections } from "@/components/CommerceSections";

export function ProductDetailPage() {
  const { slug = "" } = useParams<{ slug: string }>();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        const res = await fetch("/api/products");
        const json = (await res.json()) as { success?: boolean; data?: Product[] };
        if (active) setProducts(Array.isArray(json?.data) ? json.data : []);
      } catch {
        if (active) setProducts([]);
      } finally {
        if (active) setLoading(false);
      }
    };
    load();
    return () => {
      active = false;
    };
  }, []);

  const product = useMemo(
    () => products.find((item) => item?.slug === slug) ?? null,
    [products, slug]
  );

  if (loading) {
    return (
      <div className="mx-auto w-full max-w-7xl px-4 py-10 text-sm text-[#6F675D]">
        Loading product...
      </div>
    );
  }

  return <CommerceSections products={product ? [product] : []} />;
}

export default ProductDetailPage;