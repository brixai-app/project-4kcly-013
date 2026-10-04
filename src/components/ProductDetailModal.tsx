import { useEffect, useId, useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import * as Dialog from "@radix-ui/react-dialog";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Heart, X } from 'lucide-react';
import { toast } from "sonner";
import type { Product, Size } from "@/types";
import { categories, editorialStories, imageryDisclosure, products } from "@/data/mockData";
import { useCart } from "@/context/CartContext";
import ProductCard from "@/components/ProductCard";

const fallbackImage = "https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=800&q=80";
const money = (value = 0) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(value);
const heading = "font-['Playfair_Display'] font-light tracking-tight";
const button = "rounded-[4px] bg-[#8B0000] px-6 py-4 text-xs font-semibold uppercase tracking-widest text-white transition-colors hover:bg-[#650000] disabled:cursor-not-allowed disabled:opacity-40";

export interface ProductDetailSectionProps { product?: Product; showRelated?: boolean; className?: string }
export function ProductDetailSection({ product, showRelated = true, className = "" }: ProductDetailSectionProps = {}) {
  const cart = useCart();
  const [size, setSize] = useState<Size | null>(null);
  const reducedMotion = useReducedMotion();
  const sizeLabel = useId();
  useEffect(() => { setSize(null); }, [product?.id]);
  if (!product) return <p className="p-8 text-[#665E54]">This piece is currently unavailable.</p>;
  const selectedSize = product?.sizes?.includes(size as Size) ? size : null;
  const stock = selectedSize === null ? 0 : product?.stock?.[selectedSize] ?? 0;
  const inCart = cart?.cart?.filter((item) => item?.product?.id === product?.id && item?.size === selectedSize)?.reduce((sum, item) => sum + (item?.quantity ?? 0), 0) ?? 0;
  const saved = cart?.isWishlisted?.(product?.id) ?? false;
  const add = () => {
    if (selectedSize === null) { toast.error("Please choose a size."); return; }
    if (cart?.addToCart?.(product, selectedSize, 1)) toast.success(`${product?.name ?? "Your selection"} added to bag.`);
  };
  const images = product?.images?.length ? product?.images : [product?.image ?? fallbackImage];
  return <section className={`bg-[#FFFCF7] text-[#2B2B2B] ${className}`}>
    <div className="grid gap-8 lg:grid-cols-[1.3fr_1fr] lg:gap-14">
      <div className="grid content-start gap-4">
        {images?.map((image, index) => <img key={`${image}-${index}`} src={image ?? fallbackImage} crossOrigin="anonymous" alt={`${product?.name ?? "Footwear"}${index ? ` — detail ${index + 1}` : ""}`} loading={index ? "lazy" : "eager"} className="aspect-[3/4] w-full object-cover" />)}
      </div>
      <div className="py-4 lg:py-10">
        <p className="text-xs uppercase tracking-[0.2em] text-[#665E54]">{product?.collection ?? "The collection"}</p>
        <h2 className={`${heading} mt-4 text-4xl md:text-5xl`}>{product?.name ?? "Signature footwear"}</h2>
        <p className="mt-5 text-lg font-bold">{money(product?.price ?? 0)}</p>
        <p className="mt-8 leading-8 text-[#665E54]">{product?.description ?? "A considered addition to your everyday wardrobe."}</p>
        <dl className="my-8 space-y-3 border-y border-[#D8CFC3] py-5 text-sm">
          <div className="flex justify-between gap-4"><dt className="text-[#665E54]">Material</dt><dd>{product?.material ?? "Not specified"}</dd></div>
          <div className="flex justify-between gap-4"><dt className="text-[#665E54]">Colour</dt><dd>{product?.color ?? "Not specified"}</dd></div>
        </dl>
        <fieldset aria-describedby={sizeLabel}><legend className="mb-4 text-xs font-semibold uppercase tracking-widest">Select your size · EU</legend>
          <div className="flex flex-wrap gap-2">{product?.sizes?.map((option) => <button key={option} type="button" disabled={(product?.stock?.[option] ?? 0) <= 0} aria-pressed={selectedSize === option} onClick={() => setSize(option)} className={`h-12 w-12 rounded-[4px] border text-sm transition-colors disabled:cursor-not-allowed disabled:opacity-30 ${selectedSize === option ? "border-[#2B2B2B] bg-[#2B2B2B] text-white" : "border-[#D8CFC3] hover:border-[#2B2B2B]"}`}>{option}</button>)}</div>
        </fieldset>
        <p id={sizeLabel} className="mt-3 text-xs text-[#665E54]">{selectedSize === null ? "Choose an available size to add to your bag." : stock > inCart ? `EU ${selectedSize} available` : "All available pairs of this size are in your bag."}</p>
        <div className="mt-6 flex gap-3">
          <button type="button" onClick={add} disabled={selectedSize === null || stock <= inCart} className={`${button} flex-1`}>Add to bag</button>
          <motion.button type="button" whileTap={reducedMotion ? undefined : { scale: 0.9 }} onClick={() => cart?.toggleWishlist?.(product?.id)} aria-label={saved ? "Remove from wishlist" : "Save to wishlist"} aria-pressed={saved} className="rounded-[4px] border border-[#D8CFC3] p-4 text-[#8B0000]"><Heart size={20} fill={saved ? "currentColor" : "none"} /></motion.button>
        </div>
      </div>
    </div>
    {showRelated && <div className="mt-20 border-t border-[#D8CFC3] pt-10"><h3 className={`${heading} mb-8 text-3xl`}>A considered pairing</h3><div className="grid grid-cols-2 gap-5 lg:grid-cols-4">{products?.filter((item) => item?.id !== product?.id && item?.category === product?.category)?.slice(0, 4)?.map((item) => <ProductCard key={item?.id} product={item} />)}</div></div>}
  </section>;
}

export function ProductDetailModal() {
  const cart = useCart();
  return <Dialog.Root open={Boolean(cart?.previewProduct)} onOpenChange={(open) => { if (!open) cart?.closePreview?.(); }}>
    <Dialog.Portal>
      <Dialog.Overlay className="fixed inset-0 z-50 bg-black/50" />
      <Dialog.Content className="fixed inset-3 z-50 overflow-y-auto rounded-[4px] bg-[#FFFCF7] p-5 shadow-xl md:inset-x-[8%] md:inset-y-8 md:p-10">
        <Dialog.Title className="sr-only">{cart?.previewProduct?.name ?? "Product preview"}</Dialog.Title>
        <Dialog.Description className="sr-only">Explore this piece and select an available size before adding it to your bag.</Dialog.Description>
        <Dialog.Close aria-label="Close product preview" className="sticky top-0 z-10 ml-auto flex h-10 w-10 items-center justify-center rounded-[4px] bg-[#FFFCF7] text-[#2B2B2B]"><X size={22} /></Dialog.Close>
        <ProductDetailSection product={cart?.previewProduct ?? undefined} showRelated={false} />
        <Link to={`/product/${cart?.previewProduct?.slug ?? ""}`} onClick={() => cart?.closePreview?.()} className="mt-6 inline-flex items-center gap-3 text-xs uppercase tracking-widest text-[#8B0000]">View full details <ArrowRight size={16} /></Link>
      </Dialog.Content>
    </Dialog.Portal>
  </Dialog.Root>;
}

export function EditorialMasonryGallery({ className = "" }: { className?: string } = {}) {
  return <section aria-label="Editorial stories" className={`grid gap-12 md:grid-cols-[1.15fr_0.85fr] md:gap-20 ${className}`}>
    {editorialStories?.slice(0, 2)?.map((story, index) => <article key={story?.id} className={index ? "md:pt-32" : ""}>
      <Link to={story?.href ?? "/shop"} className="group block overflow-hidden"><img src={story?.image ?? fallbackImage} crossOrigin="anonymous" alt={story?.title ?? "Collection editorial"} loading="lazy" className="aspect-[3/4] w-full object-cover transition-transform duration-500 group-hover:scale-105" /></Link>
      <p className="mt-5 text-xs uppercase tracking-widest text-[#665E54]">{story?.subtitle ?? "The editorial"}</p>
      <h2 className={`${heading} mt-3 text-4xl`}>{story?.title ?? "A new perspective"}</h2>
      <p className="mt-4 max-w-lg leading-7 text-[#665E54]">{story?.description ?? ""}</p>
      <Link to={story?.href ?? "/shop"} className="mt-5 inline-flex items-center gap-3 border-b border-[#8B0000] pb-2 text-xs uppercase tracking-widest text-[#8B0000]">Explore collection <ArrowRight size={16} /></Link>
      {story?.caption && <p className="mt-4 text-xs text-[#665E54]">{story?.caption ?? ""}</p>}
    </article>)}
  </section>;
}

export function NewsletterForm({ className = "" }: { className?: string } = {}) {
  const cart = useCart();
  const [email, setEmail] = useState("");
  const id = useId();
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event?.preventDefault();
    if (cart?.subscribeNewsletter?.(email.trim())) { toast.success("Welcome to the SOLE ÉLITE circle."); setEmail(""); }
    else toast.error("Please enter a valid email, or check whether you are already subscribed.");
  };
  return <section className={`border-y border-[#D8CFC3] bg-[#F5F1EB] px-6 py-16 md:px-12 ${className}`}>
    <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-2 md:items-center"><div><p className="text-xs uppercase tracking-widest text-[#665E54]">Private correspondence</p><h2 className={`${heading} mt-3 text-4xl`}>Stay one step ahead.</h2><p className="mt-4 leading-7 text-[#665E54]">New collections, considered stories, and invitations to discover more.</p></div>
      <form onSubmit={submit} className="space-y-3"><label htmlFor={id} className="text-xs uppercase tracking-widest">Email address</label><div className="flex flex-col gap-3 sm:flex-row"><input id={id} type="email" autoComplete="email" required maxLength={254} value={email} onChange={(event) => setEmail(event?.target?.value ?? "")} placeholder="Your email address" className="min-w-0 flex-1 rounded-[4px] border border-[#D8CFC3] bg-[#FFFCF7] px-4 py-4 outline-none focus:border-[#8B0000]" /><button type="submit" className={button}>Subscribe</button></div><p role="status" className="text-xs text-[#665E54]">{cart?.newsletterSubscribed ? "You’re on the list. Thank you for joining us." : "Only considered updates. Unsubscribe anytime."}</p></form>
    </div>
  </section>;
}

export function HomeSections() {
  return <>
    <nav aria-label="Shop by category" className="flex flex-wrap justify-center gap-x-10 gap-y-5 border-y border-[#D8CFC3] px-6 py-7">{categories?.map((category) => <Link key={category?.value} to={`/shop?category=${category?.value ?? ""}`} className="text-xs uppercase tracking-widest text-[#665E54] hover:text-[#8B0000]">{category?.label ?? ""}</Link>)}</nav>
    <div className="mx-auto max-w-[1440px] px-6 py-20 md:px-12"><EditorialMasonryGallery /><p className="mt-8 text-xs text-[#665E54]">{imageryDisclosure ?? ""}</p>
      <section className="mt-24"><div className="mb-10 flex items-end justify-between gap-5"><h2 className={`${heading} text-4xl md:text-5xl`}>The latest arrivals</h2><Link to="/shop" className="text-xs uppercase tracking-widest text-[#8B0000]">Shop all</Link></div><div className="grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-4">{products?.filter((product) => product?.isNew)?.slice(0, 4)?.map((product) => <ProductCard key={product?.id} product={product} />)}</div></section>
    </div>
    <section className="bg-[#2B2B2B] px-6 py-24 text-[#FFFCF7] md:px-16"><div className="mx-auto max-w-4xl"><p className="text-xs uppercase tracking-[0.25em]">The SOLE ÉLITE philosophy</p><h2 className={`${heading} mt-8 text-5xl md:text-7xl`}>Less noise.<br />More character.</h2><p className="mt-8 max-w-xl leading-8 text-[#D8CFC3]">A wardrobe begins with a point of view. Discover footwear chosen for its silhouette, its texture, and the way it moves with you.</p><Link to="/shop" className="mt-8 inline-flex items-center gap-4 text-xs uppercase tracking-widest">Discover the collection <ArrowRight size={18} /></Link></div></section>
    <NewsletterForm />
  </>;
}

export function WishlistSection({ className = "" }: { className?: string } = {}) {
  const cart = useCart();
  const saved = products?.filter((product) => cart?.isWishlisted?.(product?.id)) ?? [];
  return <section className={className}><h2 className={`${heading} mb-8 text-4xl`}>Your wishlist</h2>{saved?.length ? <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">{saved?.map((product) => <ProductCard key={product?.id} product={product} />)}</div> : <div className="border-y border-[#D8CFC3] py-12"><p className="mb-6 text-[#665E54]">A space for the pieces that stay with you. Save your favourites as you explore.</p><Link to="/shop" className="inline-flex items-center gap-3 text-xs uppercase tracking-widest text-[#8B0000]">Explore the collection <ArrowRight size={16} /></Link></div>}</section>;
}

export default ProductDetailModal;