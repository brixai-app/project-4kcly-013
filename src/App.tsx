import React, { useEffect, useMemo, useState } from 'react';
import { HashRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Toaster } from 'sonner';
import { CartProvider } from '@/context/CartContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CartDrawer from '@/components/CartDrawer';
import Home from '@/pages/Home';
import ShopPage from '@/pages/ShopPage';
import {
  ProductDetailsExperience,
  CheckoutExperience,
  ArtisanStoriesExperience,
  OrderConfirmationExperience,
  CartRouteExperience,
} from '@/components/RouteExperiences';
import { HomeExperience, CatalogExperience } from '@/components/StorefrontSections';

function AppShell() {
  const location = useLocation();
  const [cartOpen, setCartOpen] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location.pathname]);

  const routeKey = useMemo(() => location.pathname + location.search, [location.pathname, location.search]);

  return (
    <div className="min-h-screen bg-[#F6F0E5] text-[#17130F]">
      <Header />
      <main key={routeKey} className="min-h-[calc(100vh-8rem)]">
        <Routes>
          <Route path="/" element={<Home className="" />} />
          <Route path="/shop" element={<ShopPage className="" />} />
          <Route path="/experience/home" element={<HomeExperience />} />
          <Route path="/experience/catalog" element={<CatalogExperience />} />
          <Route path="/product/:slug" element={<ProductDetailsExperience />} />
          <Route path="/cart" element={<CartRouteExperience />} />
          <Route path="/checkout" element={<CheckoutExperience />} />
          <Route path="/artisans" element={<ArtisanStoriesExperience />} />
          <Route path="/order/:id" element={<OrderConfirmationExperience />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
      <CartDrawer open={cartOpen} onOpenChange={setCartOpen} />
    </div>
  );
}

export function App() {
  return (
    <HashRouter>
      <CartProvider>
        <Toaster position="top-right" richColors closeButton />
        <AppShell />
      </CartProvider>
    </HashRouter>
  );
}

export default App;