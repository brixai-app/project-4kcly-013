import React, { useEffect, useMemo, useState } from 'react';
import { HashRouter, Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { CartDrawer } from '@/components/CartDrawer';
import { AuthModal } from '@/components/AuthModal';
import { CartProvider } from '@/context/CartContext';
import { Home } from '@/pages/Home';
import { ShopPage } from '@/pages/ShopPage';
import {
  ArtisansPage,
  ArtisanDetailPage,
  CartRoute,
  CheckoutPage,
  CustomOrderPage,
  ProductPage,
} from '@/pages/JourneyPages';

function AppShell() {
  const location = useLocation();
  const navigate = useNavigate();
  const [cartOpen, setCartOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(location.search ?? '');
    const cart = params.get('cart');
    const auth = params.get('auth');
    if (cart === 'open') setCartOpen(true);
    if (auth === 'open') setAuthOpen(true);
    if (cart || auth) navigate({ pathname: location.pathname, search: '' }, { replace: true });
  }, [location.pathname, location.search, navigate]);

  const routeKey = useMemo(() => location.pathname + location.search, [location.pathname, location.search]);

  return (
    <div key={routeKey} className="min-h-screen bg-[#F9F5F0] text-[#2B2B2B]">
      <Header className="" />
      <main className="min-h-[calc(100vh-8rem)]">
        <Routes>
          <Route path="/" element={<Home className="" />} />
          <Route path="/shop" element={<ShopPage className="" />} />
          <Route path="/products/:id" element={<ProductPage className="" />} />
          <Route path="/artisans" element={<ArtisansPage className="" />} />
          <Route path="/artisans/:id" element={<ArtisanDetailPage className="" />} />
          <Route path="/checkout" element={<CheckoutPage className="" />} />
          <Route path="/custom-order" element={<CustomOrderPage className="" />} />
          <Route path="/cart" element={<CartRoute className="" />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer className="" />
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