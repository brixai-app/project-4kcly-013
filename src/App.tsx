import { useEffect, useRef, useState, type FormEvent } from "react";
import { BrowserRouter, Link, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, Search, ShoppingBag, User, ArrowRight } from 'lucide-react';
import * as Dialog from "@radix-ui/react-dialog";
import { MotionConfig } from "framer-motion";
import { Toaster } from "sonner";
import Home from "@/pages/Home";
import ShopPage, { ProductPage, CartPage, ProfilePage, ConfirmationPage } from "@/pages/ShopPage";
import { CartProvider, useCart } from "@/context/CartContext";
import CartDrawer from "@/components/CartDrawer";
import ProductDetailModal, { NewsletterForm } from "@/components/ProductDetailModal";
import { navigationLinks, footerLinks, customerCare } from "@/data/mockData";

type NavigationItem = { label: string; href: string };
function normalizeLinks(value: unknown): NavigationItem[] {
  if (Array.isArray(value)) return value.flatMap(normalizeLinks);
  if (!value || typeof value !== "object") return [];
  const item = value as Record<string, unknown>;
  const label = item?.label ?? item?.title ?? item?.name;
  const href = item?.href ?? item?.to ?? item?.path;
  if (typeof label === "string" && typeof href === "string") return [{ label, href }];
  return Object.values(item ?? {}).flatMap(normalizeLinks);
}
function careText(value: unknown): string {
  if (typeof value === "string" || typeof value === "number") return String(value);
  if (Array.isArray(value)) return value.map(careText).filter(Boolean).join("\n\n");
  if (value && typeof value === "object") return Object.values(value ?? {}).map(careText).filter(Boolean).join("\n\n");
  return "";
}
const focusStyle = "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#8B0000]";
const iconButton = `flex h-11 w-11 items-center justify-center rounded-[4px] transition-colors hover:text-[#8B0000] ${focusStyle}`;
const overlayStyle = "fixed inset-0 z-50 bg-[#2B2B2B]/50";
const panelStyle = "fixed z-[60] border border-[#D8CFC3] bg-[#FFFCF7] p-6 text-[#2B2B2B] shadow-xl";

export function Header() {
  const cart = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  useEffect(() => { setMobileOpen(false); setSearchOpen(false); }, [location?.pathname, location?.search]);
  function search(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const value = query.trim();
    navigate(value ? `/shop?search=${encodeURIComponent(value)}` : "/shop");
    setSearchOpen(false);
  }
  return (
    <header className="relative z-30 border-b border-[#D8CFC3] bg-[#F5F1EB]">
      <div className="flex min-h-24 items-center justify-between gap-4 px-4 md:px-10 lg:px-16">
        <div className="flex items-center gap-2">
          <Dialog.Root open={mobileOpen} onOpenChange={setMobileOpen}>
            <Dialog.Trigger asChild><button type="button" className={`${iconButton} lg:hidden`} aria-label="Open navigation"><Menu size={21} /></button></Dialog.Trigger>
            <Dialog.Portal>
              <Dialog.Overlay className={overlayStyle} />
              <Dialog.Content className={`${panelStyle} inset-y-0 left-0 w-[min(88vw,380px)]`}>
                <Dialog.Title className="font-['Playfair_Display',serif] text-2xl">SOLE ÉLITE</Dialog.Title>
                <Dialog.Description className="mt-2 text-sm text-[#665E54]">Explore the world of considered footwear.</Dialog.Description>
                <Dialog.Close asChild><button type="button" aria-label="Close navigation" className={`${iconButton} absolute right-3 top-3`}><X size={20} /></button></Dialog.Close>
                <nav aria-label="Mobile navigation" className="mt-12 flex flex-col gap-6">{normalizeLinks(navigationLinks).map((item) => <Link key={`${item?.href}-${item?.label}`} to={item?.href ?? "/shop"} className={`text-lg ${focusStyle}`} onClick={() => setMobileOpen(false)}>{item?.label ?? ""}</Link>)}</nav>
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog.Root>
          <Link to="/" aria-label="SOLE ÉLITE home" className={`whitespace-nowrap font-['Playfair_Display',serif] text-2xl tracking-[0.08em] md:text-3xl ${focusStyle}`}>SOLE ÉLITE<span className="ml-1 align-top text-[9px]">®</span></Link>
        </div>
        <nav aria-label="Main navigation" className="hidden items-center gap-8 lg:flex">{normalizeLinks(navigationLinks).map((item) => <Link key={`${item?.href}-${item?.label}`} to={item?.href ?? "/shop"} aria-current={location?.pathname === item?.href ? "page" : undefined} className={`text-[11px] uppercase tracking-[0.16em] transition-colors hover:text-[#8B0000] aria-[current=page]:text-[#8B0000] ${focusStyle}`}>{item?.label ?? ""}</Link>)}</nav>
        <div className="flex items-center gap-0 sm:gap-2">
          <Dialog.Root open={searchOpen} onOpenChange={setSearchOpen}>
            <Dialog.Trigger asChild><button type="button" className={iconButton} aria-label="Search footwear"><Search size={19} /></button></Dialog.Trigger>
            <Dialog.Portal>
              <Dialog.Overlay className={overlayStyle} />
              <Dialog.Content className={`${panelStyle} left-1/2 top-[18vh] w-[calc(100%-2rem)] max-w-xl -translate-x-1/2 rounded-[4px] md:p-10`}>
                <Dialog.Title className="font-['Playfair_Display',serif] text-3xl">Find your next signature.</Dialog.Title>
                <Dialog.Description className="mt-3 text-sm text-[#665E54]">Search by style, collection, or product name.</Dialog.Description>
                <Dialog.Close asChild><button type="button" aria-label="Close search" className={`${iconButton} absolute right-2 top-2`}><X size={18} /></button></Dialog.Close>
                <form onSubmit={search} className="mt-8 flex gap-2">
                  <label htmlFor="boutique-search" className="sr-only">Search the collection</label>
                  <input id="boutique-search" type="search" value={query} onChange={(event) => setQuery(event?.target?.value ?? "")} placeholder="Search the collection" className={`min-w-0 flex-1 rounded-[4px] border border-[#D8CFC3] bg-transparent px-3 py-3 ${focusStyle}`} />
                  <button type="submit" aria-label="Submit search" className={`rounded-[4px] bg-[#8B0000] px-4 text-white hover:bg-[#650000] ${focusStyle}`}><ArrowRight size={20} /></button>
                </form>
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog.Root>
          <Link to="/profile" aria-label="Profile and wishlist" className={`${iconButton} hidden sm:flex`}><User size={19} /></Link>
          <button type="button" onClick={() => cart?.openCart?.()} aria-label={`Open shopping bag, ${cart?.cartCount ?? 0} items`} className={`${iconButton} relative`}><ShoppingBag size={20} /><span className="absolute right-0 top-0 text-[10px] font-semibold text-[#8B0000]" aria-hidden="true">{cart?.cartCount ?? 0}</span></button>
        </div>
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-[#D8CFC3] bg-[#FFFCF7]">
      <section aria-label="Newsletter" className="border-b border-[#D8CFC3] px-6 py-14 md:px-16"><NewsletterForm /></section>
      <div className="flex flex-col justify-between gap-10 px-6 py-12 md:flex-row md:px-16">
        <div><Link to="/" className={`font-['Playfair_Display',serif] text-3xl tracking-wider ${focusStyle}`}>SOLE ÉLITE</Link><p className="mt-3 text-sm text-[#665E54]">A considered step. An enduring impression.</p></div>
        <nav aria-label="Footer navigation" className="flex flex-wrap items-start gap-x-8 gap-y-5 text-xs uppercase tracking-widest">
          {normalizeLinks(footerLinks).map((item) => item?.href?.startsWith("http") || item?.href?.startsWith("mailto:") || item?.href?.startsWith("tel:") ? <a key={`${item?.href}-${item?.label}`} href={item?.href ?? "#"} className={focusStyle}>{item?.label ?? ""}</a> : <Link key={`${item?.href}-${item?.label}`} to={item?.href ?? "/shop"} className={focusStyle}>{item?.label ?? ""}</Link>)}
          <Dialog.Root>
            <Dialog.Trigger asChild><button type="button" className={`uppercase tracking-widest ${focusStyle}`}>Customer care</button></Dialog.Trigger>
            <Dialog.Portal><Dialog.Overlay className={overlayStyle} /><Dialog.Content className={`${panelStyle} left-1/2 top-1/2 max-h-[85dvh] w-[calc(100%-2rem)] max-w-xl -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-[4px] md:p-10`}>
              <Dialog.Title className="pr-8 font-['Playfair_Display',serif] text-3xl">Customer care</Dialog.Title>
              <Dialog.Description className="mt-4 text-sm text-[#665E54]">Shipping, returns, and assistance with your collection.</Dialog.Description>
              <div className="mt-6 whitespace-pre-line break-words text-sm leading-7">{careText(customerCare) || "Please contact our boutique for assistance."}</div>
              <Dialog.Close asChild><button type="button" aria-label="Close customer care" className={`${iconButton} absolute right-2 top-2`}><X size={20} /></button></Dialog.Close>
            </Dialog.Content></Dialog.Portal>
          </Dialog.Root>
        </nav>
      </div>
      <div className="flex flex-col justify-between gap-3 border-t border-[#D8CFC3] px-6 py-6 text-xs text-[#665E54] md:flex-row md:px-16"><span>© {new Date().getFullYear()} SOLE ÉLITE</span><span>Demonstration boutique · No real payments are processed.</span></div>
    </footer>
  );
}

export function AppLayout() {
  const location = useLocation();
  const mainRef = useRef<HTMLElement>(null);
  const previousPath = useRef(location?.pathname ?? "/");
  useEffect(() => {
    if (previousPath.current === location?.pathname) return;
    previousPath.current = location?.pathname ?? "/";
    window.scrollTo({ top: 0, behavior: "instant" });
    mainRef.current?.focus({ preventScroll: true });
  }, [location?.pathname]);
  return <div className="min-h-screen bg-[#F5F1EB] font-['Lora',serif] text-[#2B2B2B]"><a href="#main-content" className="sr-only fixed left-4 top-4 z-[100] bg-[#FFFCF7] p-3 focus:not-sr-only">Skip to content</a><Header /><main id="main-content" ref={mainRef} tabIndex={-1} className="min-h-[55vh] outline-none"><Routes><Route path="/" element={<Home />} /><Route path="/shop" element={<ShopPage />} /><Route path="/shop/:category" element={<ShopPage />} /><Route path="/collections/:collection" element={<ShopPage />} /><Route path="/product/:slug" element={<ProductPage />} /><Route path="/products/:slug" element={<ProductPage />} /><Route path="/cart" element={<CartPage />} /><Route path="/checkout" element={<CartPage />} /><Route path="/profile" element={<ProfilePage />} /><Route path="/wishlist" element={<ProfilePage />} /><Route path="/confirmation/:orderId" element={<ConfirmationPage />} /><Route path="/confirmation" element={<ConfirmationPage />} /><Route path="*" element={<section className="px-6 py-28 text-center"><h1 className="font-['Playfair_Display',serif] text-5xl">A step off the path.</h1><p className="my-6 text-[#665E54]">This page could not be found.</p><Link to="/shop" className={`inline-block rounded-[4px] bg-[#8B0000] px-6 py-4 text-xs uppercase tracking-widest text-white hover:bg-[#650000] ${focusStyle}`}>Explore collection</Link></section>} /></Routes></main><Footer /><CartDrawer /><ProductDetailModal /><Toaster position="bottom-center" closeButton richColors toastOptions={{ className: "font-['Lora',serif]" }} /></div>;
}

export function App() {
  return <MotionConfig reducedMotion="user"><BrowserRouter><CartProvider><AppLayout /></CartProvider></BrowserRouter></MotionConfig>;
}
export default App;