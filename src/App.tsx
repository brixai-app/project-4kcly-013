import React, { useEffect, useMemo, useState } from "react";
import { HashRouter, Navigate, Route, Routes, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Toaster } from "sonner";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import AuthModal from "@/components/AuthModal";
import ProductDetailModal from "@/components/ProductDetailModal";
import { CartProvider } from "@/context/CartContext";
import Home from "@/pages/Home";
import ShopPage from "@/pages/ShopPage";
import SecondaryPages, { AboutPage, ArtisansPage, CartRoute, CheckoutPage, ProductDetailPage } from "@/pages/SecondaryPages";
import { products } from "@/data/mockData";
import type { Product } from "@/types";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [pathname]);
  return null;
}

function AppShell() {
  const location = useLocation();
  const [cartOpen, setCartOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [productSlug, setProductSlug] = useState<string | null>(null);

  const selectedProduct = useMemo<Product | null>(() => {
    if (!productSlug) return null;
    return products?.find((product) => product?.slug === productSlug) ?? null;
  }, [productSlug]);

  useEffect(() => {
    const onOpenCart = () => setCartOpen(true);
    const onOpenAuth = () => setAuthOpen(true);
    const onOpenProduct = (event: Event) => {
      const detail = (event as CustomEvent<{ slug?: string }>).detail;
      setProductSlug(detail?.slug ?? null);
    };
    window.addEventListener("jootiya:open-cart", onOpenCart);
    window.addEventListener("jootiya:open-auth", onOpenAuth);
    window.addEventListener("jootiya:open-product", onOpenProduct as EventListener);
    return () => {
      window.removeEventListener("jootiya:open-cart", onOpenCart);
      window.removeEventListener("jootiya:open-auth", onOpenAuth);
      window.removeEventListener("jootiya:open-product", onOpenProduct as EventListener);
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#F9F5F0] text-[#2B2B2B]">
      <Header />
      <ScrollToTop />
      <AnimatePresence mode="wait">
        <motion.main
          key={location.pathname}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="min-h-[calc(100vh-8rem)]"
        >
          <Routes location={location}>
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<ShopPage />} />
            <Route path="/product/:slug" element={<ProductDetailPage />} />
            <Route path="/cart" element={<CartRoute />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/artisans" element={<ArtisansPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </motion.main>
      </AnimatePresence>
      <Footer />
      <CartDrawer open={cartOpen} onOpenChange={setCartOpen} />
      <AuthModal open={authOpen} onOpenChange={setAuthOpen} />
      <ProductDetailModal open={Boolean(productSlug)} onOpenChange={(open) => !open && setProductSlug(null)} product={selectedProduct} />
      <Toaster position="top-right" richColors closeButton theme="light" />
    </div>
  );
}

export function App() {
  return (
    <HashRouter>
      <CartProvider>
        <AppShell />
      </CartProvider>
    </HashRouter>
  );
}

export default App;