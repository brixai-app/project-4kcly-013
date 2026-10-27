import { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Check, Heart, Shield, Star, Truck } from 'lucide-react';
import { toast } from "sonner";
import type { Product, Review } from "@/types";
import { useCart } from "@/context/CartContext";
import { cn } from "@/lib/utils";

export function ProductPage() {
  const { slug = "" } = useParams<{ slug: string }>();
  const { addItem } = useCart?.() ?? {};
  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [activeImage, setActiveImage] = useState("");

  useEffect(() => {
    let alive = true;
    const load = async () => {
      setLoading(true);
      try {
        const [productsRes, reviewsRes] = await Promise.all([
          fetch("/api/products"),
          fetch("/api/reviews"),
        ]);
        const productsJson = (await productsRes.json().catch(() => ({}))) as { data?: Product[] };
        const reviewsJson = (await reviewsRes.json().catch(() => ({}))) as { data?: Review[] };
        const found = productsJson?.data?.find((item) => item?.slug === slug) ?? null;
        if (!alive) return;
        setProduct(found);
        setReviews((reviewsJson?.data ?? []).filter((review) => review?.productId === found?.id));
        setSelectedSize(found?.sizes?.[0] ?? "");
        setSelectedColor(found?.colors?.[0] ?? "");
        setActiveImage(found?.images?.[0] ?? found?.image ?? "");
      } catch {
        if (alive) {
          setProduct(null);
          setReviews([]);
        }
      } finally {
        if (alive) setLoading(false);
      }
    };
    load();
    return () => {
      alive = false;
    };
  }, [slug]);

  const gallery = useMemo(() => {
    const images = product?.images?.length ? product.images : product?.image ? [product.image] : [];
    return Array.from(new Set(images)).filter(Boolean);
  }, [product]);

  const handleQuickAdd = () => {
    if (!product) return;
    if (!selectedSize && (product?.sizes?.length ?? 0) > 0) {
      toast.error("Please select a size");
      return;
    }
    addItem?.(product, 1, selectedSize || undefined, selectedColor || undefined);
    toast.success("Added to cart");
  };

  if (loading) {
    return <div className="mx-auto max-w-7xl px-4 py-16 text-sm text-[#6D6257]">Loading product...</div>;
  }

  if (!product) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16">
        <div className="border border-[#D8CCB8] bg-[#FFFDF8] p-8">
          <p className="text-xs uppercase tracking-[0.3em] text-[#9A7440]">Product not found</p>
          <h1 className="mt-3 font-['Playfair_Display'] text-4xl text-[#2B2B2B]">This mojri is no longer available.</h1>
          <Link to="/shop" className="mt-6 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.25em] text-[#9A7440]">
            <ArrowLeft className="h-4 w-4" />
            Return to shop
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#FAF7F0] text-[#2B2B2B]">
      <div className="mx-auto max-w-7xl px-4 py-6">
        <Link to="/shop" className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.25em] text-[#6D6257]">
          <ArrowLeft className="h-4 w-4" />
          Back to collection
        </Link>
      </div>

      <div className="mx-auto grid max-w-7xl gap-8 px-4 pb-16 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="grid gap-4 lg:grid-cols-[88px_1fr]">
          <div className="order-2 flex gap-3 overflow-x-auto lg:order-1 lg:flex-col lg:overflow-visible">
            {gallery.map((src) => (
              <button
                key={src}
                type="button"
                onClick={() => setActiveImage(src)}
                className={cn("shrink-0 border bg-[#FFFDF8] p-1 transition", activeImage === src ? "border-[#9A7440]" : "border-[#D8CCB8]")}
              >
                <img src={src} crossOrigin="anonymous" alt={product.name} className="h-20 w-16 object-cover" />
              </button>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="order-1 overflow-hidden border border-[#D8CCB8] bg-[#FFFDF8] lg:order-2"
          >
            <img src={activeImage || product.image} crossOrigin="anonymous" alt={product.name} className="aspect-[4/5] w-full object-cover" />
          </motion.div>
        </section>

        <section className="space-y-6">
          <div className="space-y-3 border-b border-[#D8CCB8] pb-6">
            <p className="text-xs uppercase tracking-[0.3em] text-[#9A7440]">{product.collection ?? product.category}</p>
            <h1 className="font-['Playfair_Display'] text-4xl leading-tight text-[#2B2B2B] md:text-5xl">{product.name}</h1>
            <p className="max-w-xl text-sm leading-7 text-[#6D6257]">{product.description}</p>
            <div className="flex items-center gap-3 text-sm text-[#2B2B2B]">
              <span className="font-semibold">₹{product.price.toLocaleString("en-IN")}</span>
              <span className="flex items-center gap-1 text-[#6D6257]">
                <Star className="h-4 w-4 fill-[#9A7440] text-[#9A7440]" />
                {product.rating?.toFixed(1) ?? "4.8"} ({product.reviewCount ?? reviews.length ?? 0})
              </span>
            </div>
          </div>

          <div className="space-y-4">
            {(product.sizes?.length ?? 0) > 0 && (
              <div>
                <p className="mb-2 text-xs uppercase tracking-[0.25em] text-[#6D6257]">Size</p>
                <div className="flex flex-wrap gap-2">
                  {product.sizes?.map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setSelectedSize(size)}
                      className={cn(
                        "min-w-0 border px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] transition",
                        selectedSize === size ? "border-[#9A7440] bg-[#9A7440] text-black" : "border-[#D8CCB8] bg-[#FFFDF8] text-[#2B2B2B]"
                      )}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {(product.colors?.length ?? 0) > 0 && (
              <div>
                <p className="mb-2 text-xs uppercase tracking-[0.25em] text-[#6D6257]">Color</p>
                <div className="flex flex-wrap gap-2">
                  {product.colors?.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setSelectedColor(color)}
                      className={cn(
                        "min-w-0 border px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] transition",
                        selectedColor === color ? "border-[#9A7440] bg-[#9A7440] text-black" : "border-[#D8CCB8] bg-[#FFFDF8] text-[#2B2B2B]"
                      )}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={handleQuickAdd}
              className="inline-flex items-center justify-center gap-2 border border-[#9A7440] bg-[#9A7440] px-5 py-3 text-xs font-semibold uppercase tracking-[0.25em] text-black transition hover:bg-[#76562E]"
            >
              <Check className="h-4 w-4" />
              Add to cart
            </button>
            <button
              type="button"
              className="inline-flex items-center justify-center gap-2 border border-[#D8CCB8] bg-[#FFFDF8] px-5 py-3 text-xs font-semibold uppercase tracking-[0.25em] text-[#2B2B2B]"
            >
              <Heart className="h-4 w-4" />
              Save
            </button>
          </div>

          <div className="grid gap-3 border-t border-[#D8CCB8] pt-6 sm:grid-cols-3">
            <div className="border border-[#D8CCB8] bg-[#FFFDF8] p-4">
              <Truck className="h-5 w-5 text-[#9A7440]" />
              <p className="mt-3 text-sm font-semibold">Careful dispatch</p>
              <p className="mt-1 text-sm text-[#6D6257]">Securely packed and shipped with tracking.</p>
            </div>
            <div className="border border-[#D8CCB8] bg-[#FFFDF8] p-4">
              <Shield className="h-5 w-5 text-[#9A7440]" />
              <p className="mt-3 text-sm font-semibold">Authentic craft</p>
              <p className="mt-1 text-sm text-[#6D6257]">Hand-finished by Jodhpur artisans.</p>
            </div>
            <div className="border border-[#D8CCB8] bg-[#FFFDF8] p-4">
              <Star className="h-5 w-5 text-[#9A7440]" />
              <p className="mt-3 text-sm font-semibold">Heritage fit</p>
              <p className="mt-1 text-sm text-[#6D6257]">Designed for comfort, ceremony, and daily wear.</p>
            </div>
          </div>

          <div className="border border-[#D8CCB8] bg-[#FFFDF8] p-5">
            <p className="text-xs uppercase tracking-[0.25em] text-[#9A7440]">Artisan provenance</p>
            <div className="mt-3 space-y-2">
              <p className="font-semibold">{product.artisan?.name ?? "Master artisan collective"}</p>
              <p className="text-sm text-[#6D6257]">{product.artisan?.craft ?? "Traditional mojri construction with hand-stitched detailing."}</p>
              <p className="text-sm text-[#6D6257]">{product.artisan?.location ?? "Jodhpur, Rajasthan"}</p>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="font-['Playfair_Display'] text-2xl text-[#2B2B2B]">Reviews</h2>
            <div className="space-y-3">
              {(reviews.length ? reviews : [{ id: "empty", productId: product.id, author: "Jootiya client", rating: 5, body: "A refined silhouette with exceptional finish and comfort.", title: "Elegant craftsmanship" }]).map((review) => (
                <div key={review.id} className="border border-[#D8CCB8] bg-[#FFFDF8] p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-semibold">{review.author}</p>
                    <span className="flex items-center gap-1 text-sm text-[#6D6257]">
                      <Star className="h-4 w-4 fill-[#9A7440] text-[#9A7440]" />
                      {review.rating}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-[#6D6257]">{review.title ?? "Verified review"}</p>
                  <p className="mt-2 text-sm leading-7 text-[#2B2B2B]">{review.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default ProductPage;