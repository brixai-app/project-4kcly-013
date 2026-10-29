import React, { useEffect, useMemo, useState } from 'react';
import { HashRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { Toaster } from 'sonner';
import { CartProvider } from '@/context/CartContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CartDrawer from '@/components/CartDrawer';
import AuthModal from '@/components/AuthModal';
import { HomePage } from '@/pages/Home';
import { ShopPage } from '@/pages/ShopPage';
import { ProductDetailPage } from '@/pages/ProductDetailPage';
import { ArtisanStoriesPage } from '@/pages/ArtisanStoriesPage';
import { CartPage, CheckoutPage, DashboardPage, CustomOrderPage } from '@/pages/CommercePages';

function AppShell() {
  const location = useLocation();
  const [cartOpen, setCartOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [authTab, setAuthTab] = useState<'signin' | 'signup'>('signin');

  useEffect(() => {
    const onOpenCart = () => setCartOpen(true);
    const onOpenAuth = (event: Event) => {
      const detail = (event as CustomEvent<{ tab?: 'signin' | 'signup' }>).detail;
      setAuthTab(detail?.tab ?? 'signin');
      setAuthOpen(true);
    };
    window.addEventListener('jootiya:open-cart', onOpenCart);
    window.addEventListener('jootiya:open-auth', onOpenAuth as EventListener);
    return () => {
      window.removeEventListener('jootiya:open-cart', onOpenCart);
      window.removeEventListener('jootiya:open-auth', onOpenAuth as EventListener);
    };
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location.pathname]);

  const showChrome = useMemo(() => !location.pathname.startsWith('/checkout'), [location.pathname]);

  return (
    <div className="min-h-screen bg-[#F5F1EB] text-[#302D29]">
      {showChrome ? <Header /> : null}
      <main className="min-h-[calc(100vh-8rem)]">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/shop" element={<ShopPage />} />
          <Route path="/product/:slug" element={<ProductDetailPage />} />
          <Route path="/stories" element={<ArtisanStoriesPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/custom-order" element={<CustomOrderPage />} />
          <Route path="/login" element={<Navigate to="/" replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      {showChrome ? <Footer /> : null}
      <CartDrawer open={cartOpen} onOpenChange={setCartOpen} />
      <AuthModal open={authOpen} onOpenChange={setAuthOpen} defaultTab={authTab} />
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