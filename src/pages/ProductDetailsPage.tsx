import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, Heart, ShoppingCart, Shield, Truck } from 'lucide-react';
import { toast } from "sonner";
import { getArtisanById, getProductBySlug, products } from "@/data/mockData";
import { useCart } from "@/context/CartContext";
import ProductCard from "@/components/ProductCard";
import type { MojriProduct } from "@/types";

export default function ProductDetailsPage() {
  const { slug = "" } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { addItem } = useCart() as { addItem?: (product: MojriProduct, quantity: number, size?: string, color?: string) => void };
  const product = useMemo(() => getProductBySlug(slug) ?? products[0] ?? null, [slug]);
  const artisan = useMemo(() => (product?.artisanId ? getArtisanById(product.artisanId) : null), [product?.artisanId]);
  const [selectedImage, setSelectedImage] = useState<string>(product?.image ?? "");
  const [selectedSize, setSelectedSize] = useState<string>(product?.sizes?.[0] ?? "");
  const [selectedColor, setSelectedColor] = useState<string>(product?.colors?.[0] ?? "");
  const [quantity, setQuantity] = useState<number>(1);

  useEffect(() => {
    setSelectedImage(product?.image ?? "");
    setSelectedSize(product?.sizes?.[0] ?? "");
    setSelectedColor(product?.colors?.[0] ?? "");
    setQuantity(1);
  }, [product?.id]);

  if (!product) return <div className="min-h-screen bg-[#F7F0E3] px-6 py-24 text-[#211A17]">Product not found.</div>;

  const related = products.filter((item) => item.id !== product.id && (item.collection === product.collection || item.category === product.category)).slice(0, 4);
  const gallery = [product.image, ...(product.gallery ?? [])].filter(Boolean);
  const canAdd = !!product.inStock && !!selectedSize && quantity > 0;

  const handleAdd = () => {
    if (!product.inStock) return toast.error("This size is currently unavailable.");
    if (!selectedSize) return toast.error("Please select a size.");
    addItem?.(product, quantity, selectedSize, selectedColor);
    toast.success("Added to cart.");
  };

  return (
    <div className="bg-[#F7F0E3] text-[#211A17]">
      <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <button onClick={() => navigate(-1)} className="mb-6 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.24em] text-[#6F6258] transition hover:text-[#741F2B]">
          <ArrowLeft className="h-4 w-4" /> Back
        </button>

        <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="space-y-4">
            <motion.div layout className="overflow-hidden border border-[#CDBB9D] bg-[#FFFDFC]">
              <motion.img
                key={selectedImage}
                src={selectedImage || product.image}
                alt={product.name}
                crossOrigin="anonymous"
                initial={{ opacity: 0, scale: 1.02 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.45 }}
                className="h-[72vh] w-full object-cover"
              />
            </motion.div>
            <div className="flex gap-3 overflow-x-auto pb-1">
              {gallery.map((img) => (
                <button key={img} onClick={() => setSelectedImage(img)} className={`h-24 w-24 shrink-0 overflow-hidden border ${selectedImage === img ? "border-[#741F2B]" : "border-[#CDBB9D]"}`}>
                  <img src={img} alt={`${product.name} thumbnail`} crossOrigin="anonymous" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-8">
            <div className="space-y-4 border-b border-[#CDBB9D] pb-6">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#6F6258]">{product.collection}</p>
              <h1 className="font-['Bodoni_Moda'] text-5xl font-light tracking-tight sm:text-6xl">{product.name}</h1>
              <p className="max-w-xl text-sm leading-7 text-[#6F6258]">{product.description}</p>
              <div className="flex items-center gap-4 text-sm font-semibold">
                <span>₹{product.price.toLocaleString("en-IN")}</span>
                <span className="inline-flex items-center gap-1 text-[#6F6258]">{product.inStock ? <Check className="h-4 w-4 text-[#741F2B]" /> : <Heart className="h-4 w-4" />} {product.inStock ? "In stock" : "Unavailable"}</span>
              </div>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-3">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#6F6258]">Size</p>
                <div className="flex flex-wrap gap-2">
                  {product.sizes?.map((size) => {
                    const disabled = !product.inStock;
                    const active = selectedSize === size;
                    return (
                      <button key={size} disabled={disabled} onClick={() => setSelectedSize(size)} className={`min-w-0 border px-3 py-2 text-xs font-semibold uppercase tracking-[0.22em] ${active ? "border-[#741F2B] bg-[#741F2B] text-white" : "border-[#CDBB9D] bg-[#FFFDFC] text-[#211A17]"} ${disabled ? "cursor-not-allowed opacity-40" : ""}`}>
                        {size}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#6F6258]">Color</p>
                <div className="flex flex-wrap gap-2">
                  {product.colors?.map((color) => (
                    <button key={color} onClick={() => setSelectedColor(color)} className={`min-w-0 border px-3 py-2 text-xs font-semibold uppercase tracking-[0.22em] ${selectedColor === color ? "border-[#741F2B] bg-[#741F2B] text-white" : "border-[#CDBB9D] bg-[#FFFDFC] text-[#211A17]"}`}>
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button onClick={() => setQuantity((q) => Math.max(1, q - 1))} className="border border-[#CDBB9D] px-4 py-3">
                <ArrowLeft className="h-4 w-4" />
              </button>
              <span className="min-w-12 text-center text-sm font-semibold">{quantity}</span>
              <button onClick={() => setQuantity((q) => Math.min(10, q + 1))} className="border border-[#CDBB9D] px-4 py-3">
                <ArrowRight className="h-4 w-4" />
              </button>
              <button onClick={handleAdd} disabled={!canAdd} className="inline-flex items-center gap-2 bg-[#741F2B] px-5 py-3 text-xs font-semibold uppercase tracking-[0.24em] text-white transition hover:bg-[#561620] disabled:cursor-not-allowed disabled:opacity-50">
                <ShoppingCart className="h-4 w-4" /> Add to cart
              </button>
            </div>

            <div className="grid gap-4 border-t border-[#CDBB9D] pt-6 sm:grid-cols-3">
              <div className="flex items-start gap-3">
                <Shield className="mt-0.5 h-4 w-4 text-[#741F2B]" />
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.22em]">Authentic craft</p>
                  <p className="text-sm text-[#6F6258]">Hand-finished by skilled Jodhpuri artisans.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Truck className="mt-0.5 h-4 w-4 text-[#741F2B]" />
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.22em]">Careful delivery</p>
                  <p className="text-sm text-[#6F6258]">Packed with protective tissue and foil detail.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Check className="mt-0.5 h-4 w-4 text-[#741F2B]" />
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.22em]">Provenance</p>
                  <p className="text-sm text-[#6F6258]">{product.provenance ?? "Documented artisan lineage and material notes."}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4 border-t border-[#CDBB9D] pt-6">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#6F6258]">Artisan</p>
              <Link to={artisan ? `/artisans/${artisan.slug}` : "/artisans"} className="inline-flex items-center gap-2 text-lg font-semibold text-[#211A17] transition hover:text-[#741F2B]">
                {artisan?.name ?? "View artisan story"} <ArrowRight className="h-4 w-4" />
              </Link>
              <p className="max-w-xl text-sm leading-7 text-[#6F6258]">{artisan?.story ?? "Explore the maker behind this pair through a provenance-led portrait of technique, region, and heritage."}</p>
            </div>
          </div>
        </div>

        <div className="mt-16 border-t border-[#CDBB9D] pt-10">
          <div className="mb-6 flex items-center justify-between gap-4">
            <h2 className="font-['Bodoni_Moda'] text-3xl font-light tracking-tight">Related pieces</h2>
            <Link to="/catalog" className="text-xs font-semibold uppercase tracking-[0.24em] text-[#6F6258] transition hover:text-[#741F2B]">Browse catalog</Link>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {related.map((item) => <ProductCard key={item.id} product={item} />)}
          </div>
        </div>
      </section>
    </div>
  );
}
export { ProductDetailsPage };
