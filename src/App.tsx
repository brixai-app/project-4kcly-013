import React, { useEffect, useMemo, useState } from "react";
import { HashRouter, Navigate, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { Toaster } from "sonner";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CartDrawer, CartRoute } from "@/components/CartDrawer";
import { AuthModal } from "@/components/AuthModal";
import { CartProvider } from "@/context/CartContext";
import Home from "@/pages/Home";
import CatalogPage from "@/pages/CatalogPage";
import ProductDetailsPage from "@/pages/ProductDetailsPage";
import ArtisanStoriesPage from "@/pages/ArtisanStoriesPage";
import CheckoutPage from "@/pages/CheckoutPage";
import OrderConfirmationPage from "@/pages/OrderConfirmationPage";

function ScrollToTop() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (!hash) window.scrollTo({ top: 0, behavior: "smooth" });
  }, [pathname, hash]);
  return null;
}

function AppShell() {
  const location = useLocation();
  const navigate = useNavigate();
  const [cartOpen, setCartOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);

  useEffect(() => {
    setAuthOpen(location.pathname === "/login");
  }, [location.pathname]);

  const authDefaultTab = useMemo(() => (location.pathname.includes("signup") ? "signup" : "signin"), [location.pathname]);

  const handleAuthOpenChange = (open: boolean) => {
    setAuthOpen(open);
    if (!open && location.pathname === "/login") navigate(-1);
  };

  return (
    <div className="min-h-screen bg-[#F7F0E3] text-[#211A17]">
      <Header className="sticky top-0 z-40" />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/catalog" element={<CatalogPage />} />
          <Route path="/products/:slug" element={<ProductDetailsPage />} />
          <Route path="/artisans" element={<ArtisanStoriesPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/order/:orderId" element={<OrderConfirmationPage />} />
          <Route path="/cart" element={<CartRoute open={true} onOpenChange={setCartOpen} />} />
          <Route path="/login" element={<Navigate to="/" replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
      <CartDrawer open={cartOpen} onOpenChange={setCartOpen} />
      <AuthModal open={authOpen} onOpenChange={handleAuthOpenChange} defaultTab={authDefaultTab as "signin" | "signup"} />
      <Toaster position="top-right" richColors closeButton theme="light" />
    </div>
  );
}

export default function App() {
  return (
    <HashRouter>
      <CartProvider>
        <ScrollToTop />
        <AppShell />
      </CartProvider>
    </HashRouter>
  );
}