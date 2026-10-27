import React, { useEffect, useState } from "react";
import { HashRouter, Routes, Route, useLocation } from "react-router-dom";
import { Toaster } from "sonner";
import { AnimatePresence, motion } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import AuthModal from "@/components/AuthModal";
import { CartProvider } from "@/context/CartContext";
import Home from "@/pages/Home";
import ShopPage from "@/pages/ShopPage";
import { ProductPage, CartPage, ArtisanStoriesPage } from "@/pages/HeritagePages";

function AppShell() {
  const location = useLocation();
  const [cartOpen, setCartOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);

  useEffect(() => {
    const onOpenCart = () => setCartOpen(true);
    const onOpenAuth = () => setAuthOpen(true);
    window.addEventListener("jootiya:open-cart", onOpenCart);
    window.addEventListener("jootiya:open-auth", onOpenAuth);
    return () => {
      window.removeEventListener("jootiya:open-cart", onOpenCart);
      window.removeEventListener("jootiya:open-auth", onOpenAuth);
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#F5F0E6] text-[#2B2B2B]">
      <Header />
      <AnimatePresence mode="wait">
        <motion.main
          key={location.pathname}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="min-h-[calc(100vh-8rem)]"
        >
          <Routes location={location}>
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<ShopPage />} />
            <Route path="/product/:slug" element={<ProductPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/stories" element={<ArtisanStoriesPage />} />
          </Routes>
        </motion.main>
      </AnimatePresence>
      <Footer />
      <CartDrawer open={cartOpen} onOpenChange={setCartOpen} />
      <AuthModal open={authOpen} onOpenChange={setAuthOpen} />
      <Toaster position="top-right" richColors closeButton />
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