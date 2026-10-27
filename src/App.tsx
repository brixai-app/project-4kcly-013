import React from "react";
import { HashRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { Toaster } from "sonner";
import { AnimatePresence, motion } from "framer-motion";
import { CartProvider } from "@/context/CartContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import AuthModal from "@/components/AuthModal";
import Home from "@/pages/Home";
import ShopPage from "@/pages/ShopPage";
import ProductPage from "@/pages/ProductPage";
import CheckoutPage from "@/pages/CheckoutPage";
import { ArtisanStoriesPage, OrderConfirmationPage } from "@/pages/EditorialPages";

function AppShell() {
  const location = useLocation();
  const [cartOpen, setCartOpen] = React.useState(false);
  const [authOpen, setAuthOpen] = React.useState(false);

  React.useEffect(() => {
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
    <div className="min-h-screen bg-[#FAF7F0] text-[#2B2B2B]">
      <Header />
      <main className="min-h-[calc(100vh-8rem)]">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
          >
            <Routes location={location}>
              <Route path="/" element={<Home />} />
              <Route path="/catalog" element={<ShopPage />} />
              <Route path="/shop" element={<Navigate to="/catalog" replace />} />
              <Route path="/product/:id" element={<ProductPage />} />
              <Route path="/cart" element={<Navigate to="/catalog" replace />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/artisan-stories" element={<ArtisanStoriesPage />} />
              <Route path="/order-confirmation" element={<OrderConfirmationPage />} />
              <Route path="/login" element={<Navigate to="/" replace />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </motion.div>
        </AnimatePresence>
      </main>
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