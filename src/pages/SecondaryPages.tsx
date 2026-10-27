import React, { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, ShoppingBag } from 'lucide-react';
import { motion } from "framer-motion";
import { useCart } from "@/context/CartContext";
import { artisans, products } from "@/data/mockData";
import { cn } from "@/lib/utils";
import {
  AboutStorySection,
  ArtisanStories,
  CheckoutJourney,
  ProductPageComposition,
  sectionRegistry,
} from "@/components/StoreSections";
import CartDrawer from "@/components/CartDrawer";
import type { Product } from "@/types";

type PageProps = { className?: string };

function PageShell({
  title = "",
  eyebrow = "",
  children,
  className = "",
  action,
}: React.PropsWithChildren<{ title?: string; eyebrow?: string; action?: React.ReactNode } & PageProps>) {
  return (
    <div className={cn("mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8", className)}>
      <div className="mb-6 flex items-end justify-between gap-4 border-b border-[#D8CBBB] pb-4">
        <div className="min-w-0">
          <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[#6D6259]">{eyebrow}</p>
          <h1 className="font-['Bodoni_Moda'] text-3xl font-light tracking-tight text-[#2B2B2B] sm:text-4xl">{title}</h1>
        </div>
        {action}
      </div>
      {children}
    </div>
  );
}

function ProductDetailPage({ className = "" }: PageProps) {
  const { slug = "" } = useParams();
  const navigate = useNavigate();
  const product = useMemo(() => products.find((item) => item.slug === slug) ?? null, [slug]);
  const related = useMemo(
    () => products.filter((item) => item.slug !== slug && item.category === product?.category).slice(0, 3),
    [product?.category, slug]
  );
  return (
    <div className={cn(className)}>
      <PageShell
        eyebrow="Product detail"
        title={product?.name ?? "Mojri detail"}
        action={
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 border border-[#D8CBBB] bg-[#FFFDFC] px-3 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-[#2B2B2B] transition hover:border-[#BFA06E]"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>
        }
      >
        <ProductPageComposition className="mb-10" />
        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-6">
            <AboutStorySection />
            <div className="grid gap-4 sm:grid-cols-3">
              {related.map((item) => (
                <div key={item.id} className="border border-[#D8CBBB] bg-[#FFFDFC] p-3">
                  <img src={item.image} alt={item.name} crossOrigin="anonymous" className="aspect-[3/4] w-full object-cover" />
                  <p className="mt-3 text-xs uppercase tracking-[0.22em] text-[#6D6259]">{item.category}</p>
                  <p className="mt-1 font-['Bodoni_Moda'] text-lg text-[#2B2B2B]">{item.name}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-4">
            <div className="border border-[#D8CBBB] bg-[#FFFDFC] p-5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[#6D6259]">Artisan</p>
              <p className="mt-2 font-['Bodoni_Moda'] text-2xl text-[#2B2B2B]">{artisans.find((a) => a.id === product?.artisanId)?.name ?? "Craft atelier"}</p>
              <p className="mt-2 text-sm leading-6 text-[#6D6259]">{product?.description ?? "Select a handcrafted pair from the collection."}</p>
            </div>
            <button
              type="button"
              onClick={() => navigate("/shop")}
              className="inline-flex w-full items-center justify-center gap-2 bg-[#BFA06E] px-4 py-3 text-xs font-semibold uppercase tracking-[0.22em] text-black transition hover:bg-[#A88650]"
            >
              Explore collection
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </PageShell>
    </div>
  );
}

function CartRoute({ className = "" }: PageProps) {
  const [open, setOpen] = useState(true);
  const { cartCount } = useCart();
  return (
    <div className={cn(className)}>
      <PageShell
        eyebrow="Cart"
        title="Your selected pieces"
        action={
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="inline-flex items-center gap-2 border border-[#D8CBBB] bg-[#FFFDFC] px-3 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-[#2B2B2B]"
          >
            <ShoppingBag className="h-4 w-4" />
            Open drawer ({cartCount ?? 0})
          </button>
        }
      >
        <CheckoutJourney />
        <CartDrawer open={open} onOpenChange={setOpen} />
      </PageShell>
    </div>
  );
}

function CheckoutPage({ className = "" }: PageProps) {
  return <div className={cn(className)}><PageShell eyebrow="Checkout" title="A calm, guided checkout"><CheckoutJourney /></PageShell></div>;
}

function ArtisansPage({ className = "" }: PageProps) {
  return <div className={cn(className)}><PageShell eyebrow="Artisans" title="The makers behind the mojris"><ArtisanStories /></PageShell></div>;
}

function AboutPage({ className = "" }: PageProps) {
  return <div className={cn(className)}><PageShell eyebrow="About" title="Heritage, re-edited for the present"><AboutStorySection /></PageShell></div>;
}

function SecondaryPages({ className = "" }: PageProps) {
  const { slug = "" } = useParams();
  const route = useMemo(() => (slug ? slug : ""), [slug]);
  const registry = sectionRegistry ?? {};
  const Component = (registry?.[route as keyof typeof registry] as React.ComponentType<PageProps> | undefined) ?? AboutPage;
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }} className={cn(className)}>
      <Component />
    </motion.div>
  );
}

export { ProductDetailPage, CartRoute, CheckoutPage, ArtisansPage, AboutPage };
export default SecondaryPages;
export { SecondaryPages };
