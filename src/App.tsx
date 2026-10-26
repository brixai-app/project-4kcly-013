import React, { useEffect } from "react";
import { HashRouter, Navigate, Route, Routes, useLocation } from "react-router-dom";
import { Toaster } from "sonner";
import { AnimatePresence, motion } from "framer-motion";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CartDrawer } from "@/components/CartDrawer";
import { CartProvider, useCart } from "@/context/CartContext";
import { Home } from "@/pages/Home";
import { ShopPage } from "@/pages/ShopPage";
import { RoutePages } from "@/pages/RoutePages";

function ScrollToTop() {
  const location = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [location.pathname, location.hash]);
  return null;
}

function AppShell() {
  const { cartDrawerOpen, setCartDrawerOpen } = useCart?.() ?? {};
  return (
    <div className="min-h-screen bg-[#FAF7F0] text-[#1F1E1C]">
      <Header />
      <ScrollToTop />
      <AnimatePresence mode="wait">
        <Routes>
          <Route
            path="/"
            element={
              <motion.main
                key="home"
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -18 }}
                transition={{ duration: 0.45, ease: "easeOut" }}
              >
                <Home />
              </motion.main>
            }
          />
          <Route
            path="/shop"
            element={
              <motion.main
                key="shop"
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -18 }}
                transition={{ duration: 0.45, ease: "easeOut" }}
              >
                <ShopPage />
              </motion.main>
            }
          />
          <Route
            path="/product/:slug"
            element={
              <motion.main
                key="route-pages"
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -18 }}
                transition={{ duration: 0.45, ease: "easeOut" }}
              >
                <RoutePages />
              </motion.main>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AnimatePresence>
      <Footer />
      <CartDrawer open={cartDrawerOpen ?? false} onOpenChange={setCartDrawerOpen ?? (() => {})} />
    </div>
  );
}

export function App() {
  return (
    <HashRouter>
      <CartProvider>
        <AppShell />
        <Toaster position="top-right" richColors closeButton />
      </CartProvider>
    </HashRouter>
  );
}

export default App;