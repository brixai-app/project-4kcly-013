import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, Heart, Minus, Plus, Shield, Star, Truck } from 'lucide-react';
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { products, artisans } from "@/data/mockData";
import { useCart } from "@/context/CartContext";

export function ProductPageView() {
  const { id = "" } = useParams();
  const { addItem } = useCart?.() ?? {};
  const product = useMemo(() => products?.find((item) => item?.id === id) ?? products?.[0] ?? null, [id]);
  const artisan = useMemo(() => artisans?.find((item) => item?.id === product?.artisanId) ?? artisans?.[0] ?? null, [product?.artisanId]);
  const gallery = useMemo(() => [product?.image, ...(product?.gallery ?? [])].filter(Boolean) as string[], [product]);
  const [activeImage, setActiveImage] = useState<string>(gallery?.[0] ?? product?.image ?? "");
  const [size, setSize] = useState<string>(product?.sizes?.[0] ?? "UK 7");
  const [color, setColor] = useState<string>(product?.colors?.[0] ?? "Natural");
  const [quantity, setQuantity] = useState<number>(1);

  const safeStock = Math.max(product?.stock ?? 0, 0);
  const maxQty = Math.max(safeStock, 1);
  const canAdd = safeStock > 0;

  const handleAdd = () => {
    if (!product) return;
    if (!canAdd) {
      toast.error("This pair is currently out of stock.");
      return;
    }
    const nextQty = Math.min(Math.max(quantity, 1), maxQty);
    addItem?.({
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: nextQty,
      size,
      color,
      stock: safeStock,
    });
    toast.success("Added to cart.");
  };

  if (!product) return <div className="mx-auto max-w-6xl px-4 py-16 text-sm text-[#514B42]">Product not found.</div>;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 lg:py-12">
      <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
        <section className="space-y-4">
          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="overflow-hidden border border-[#8A806F]/30 bg-[#FFFDF8]">
            <div className="relative aspect-[4/5] overflow-hidden">
              <img
                src={activeImage || product.image}
                alt={product.name}
                crossOrigin="anonymous"
                className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
              />
            </div>
          </motion.div>
          <div className="flex gap-3 overflow-x-auto pb-1">
            {gallery.map((src, index) => (
              <button
                key={`${src}-${index}`}
                type="button"
                onClick={() => setActiveImage(src)}
                className={cn("h-24 w-20 shrink-0 overflow-hidden border transition", activeImage === src ? "border-[#6B451D]" : "border-[#8A806F]/30")}
              >
                <img src={src} alt={`${product.name} ${index + 1}`} crossOrigin="anonymous" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        </section>

        <section className="space-y-6">
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#514B42]">{product.category}</p>
            <h1 className="font-['Playfair_Display'] text-4xl font-light tracking-tight text-[#211F1C] md:text-5xl">{product.name}</h1>
            <p className="max-w-xl text-sm leading-7 text-[#514B42]">{product.description}</p>
            <div className="flex items-center gap-3 text-sm text-[#211F1C]">
              <span className="font-semibold">₹{product.price.toLocaleString("en-IN")}</span>
              <span className="h-1 w-1 rounded-full bg-[#8A806F]" />
              <span className="inline-flex items-center gap-1 text-[#514B42]">
                <Star className="h-4 w-4 fill-current" />
                Hand-finished in Jodhpur
              </span>
            </div>
          </div>

          <div className="grid gap-4 border-y border-[#8A806F]/30 py-5 sm:grid-cols-2">
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#514B42]">Size</p>
              <div className="flex flex-wrap gap-2">
                {(product.sizes ?? ["UK 7", "UK 8", "UK 9"]).map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setSize(item)}
                    className={cn("min-w-0 border px-3 py-2 text-xs font-semibold uppercase tracking-widest transition", size === item ? "border-[#6B451D] bg-[#6B451D] text-white" : "border-[#8A806F]/30 text-[#211F1C]")}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#514B42]">Color</p>
              <div className="flex flex-wrap gap-2">
                {(product.colors ?? ["Natural", "Tan", "Brown"]).map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setColor(item)}
                    className={cn("min-w-0 border px-3 py-2 text-xs font-semibold uppercase tracking-widest transition", color === item ? "border-[#6B451D] bg-[#6B451D] text-white" : "border-[#8A806F]/30 text-[#211F1C]")}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center border border-[#8A806F]/30">
              <button type="button" onClick={() => setQuantity((q) => Math.max(1, q - 1))} className="px-3 py-3 text-[#211F1C]">
                <Minus className="h-4 w-4" />
              </button>
              <span className="min-w-12 px-4 py-3 text-center text-sm font-semibold text-[#211F1C]">{quantity}</span>
              <button type="button" onClick={() => setQuantity((q) => Math.min(maxQty, q + 1))} className="px-3 py-3 text-[#211F1C]">
                <Plus className="h-4 w-4" />
              </button>
            </div>
            <button
              type="button"
              onClick={handleAdd}
              className="inline-flex items-center gap-2 bg-[#6B451D] px-5 py-3 text-xs font-semibold uppercase tracking-[0.24em] text-white transition hover:bg-[#4E3014]"
            >
              <Check className="h-4 w-4" />
              Add to Cart
            </button>
            <button type="button" className="inline-flex items-center gap-2 border border-[#8A806F]/30 px-4 py-3 text-xs font-semibold uppercase tracking-[0.24em] text-[#211F1C]">
              <Heart className="h-4 w-4" />
              Save
            </button>
          </div>

          <div className="grid gap-3 text-sm text-[#514B42] sm:grid-cols-3">
            <div className="flex items-start gap-3 border border-[#8A806F]/20 bg-[#FFFDF8] p-4">
              <Truck className="mt-0.5 h-4 w-4 text-[#6B451D]" />
              <div>
                <p className="font-semibold text-[#211F1C]">Shipping</p>
                <p>Dispatch in 24–48 hours.</p>
              </div>
            </div>
            <div className="flex items-start gap-3 border border-[#8A806F]/20 bg-[#FFFDF8] p-4">
              <Shield className="mt-0.5 h-4 w-4 text-[#6B451D]" />
              <div>
                <p className="font-semibold text-[#211F1C]">Authentic craft</p>
                <p>Verified artisan-made leatherwork.</p>
              </div>
            </div>
            <div className="flex items-start gap-3 border border-[#8A806F]/20 bg-[#FFFDF8] p-4">
              <ArrowRight className="mt-0.5 h-4 w-4 text-[#6B451D]" />
              <div>
                <p className="font-semibold text-[#211F1C]">Stock-safe</p>
                <p>{safeStock > 0 ? `${safeStock} pairs available.` : "Currently sold out."}</p>
              </div>
            </div>
          </div>

          <div className="border border-[#8A806F]/30 bg-[#FFFDF8] p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#514B42]">Artisan note</p>
            <p className="mt-2 text-sm leading-7 text-[#211F1C]">
              {artisan?.name ?? "Master artisan"} from {artisan?.location ?? "Jodhpur"} shapes each pair with hand-cut leather, careful stitching, and a finish that softens beautifully with wear.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}

export function ProductExperience() {
  return <ProductPageView />;
}

export default ProductExperience;