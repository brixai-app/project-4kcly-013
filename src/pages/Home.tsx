import { useEffect, useState } from "react";
import type { Product } from "@/types";
import { HomeExperience } from "@/components/HomeSections";

export function Home() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    let active = true;

    const loadProducts = async () => {
      try {
        setLoading(true);
        setError("");
        const response = await fetch("/api/products");
        const data = (await response.json()) as { success?: boolean; data?: Product[]; error?: string; message?: string };
        if (!active) return;
        if (!response.ok || data?.success === false) {
          throw new Error(data?.error ?? data?.message ?? "Unable to load featured products.");
        }
        setFeaturedProducts(Array.isArray(data?.data) ? data.data : []);
      } catch (err) {
        if (!active) return;
        setError(err instanceof Error ? err.message : "Unable to load featured products.");
      } finally {
        if (active) setLoading(false);
      }
    };

    void loadProducts();
    return () => {
      active = false;
    };
  }, []);

  if (loading) {
    return <HomeExperience featuredProducts={[]} className="animate-pulse" />;
  }

  if (error) {
    return (
      <div className="mx-auto flex min-h-[60vh] w-full max-w-7xl items-center justify-center px-4 py-16 text-center">
        <div className="max-w-md rounded-sm border border-[#CFC1AD] bg-[#FFFCF6] p-8 text-[#2E2E2E]">
          <p className="font-['Playfair_Display'] text-3xl font-light tracking-tight">Jootiya</p>
          <p className="mt-3 font-['Lora'] text-sm leading-7 text-[#6F675D]">{error}</p>
        </div>
      </div>
    );
  }

  return <HomeExperience featuredProducts={featuredProducts} />;
}

export default Home;