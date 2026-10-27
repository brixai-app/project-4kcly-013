import React, { useEffect, useMemo, useState } from 'react';
import { HashRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Toaster } from 'sonner';
import { AnimatePresence, motion } from 'framer-motion';
import Header from './components/Header';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import AuthModal from './components/AuthModal';
import { CartProvider } from './context/CartContext';
import Home, { ArtisansPage } from './pages/Home';
import ShopPage from './pages/ShopPage';
import CheckoutPage from './pages/CheckoutPage';
import { products } from './data/mockData';
import ProductDetailModal from './components/ProductDetailModal';

const safePathname = (pathname?: string) => pathname ?? '/';

function AppRoutes() {
  const location = useLocation();
  const [cartOpen, setCartOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [authTab, setAuthTab] = useState<'signin' | 'signup'>('signin');
  const [previewSlug, setPreviewSlug] = useState('');
  const previewProduct = useMemo(() => products?.find((p) => p?.slug === previewSlug) ?? null, [previewSlug]);

  useEffect(() => {
    const onOpenCart = () => setCartOpen(true);
    const onOpenAuth = (e: Event) => {
      const detail = (e as CustomEvent<{ tab?: 'signin' | 'signup' }>).detail;
      setAuthTab(detail?.tab ?? 'signin');
      setAuthOpen(true);
    };
    const onPreview = (e: Event) => {
      const detail = (e as CustomEvent<{ slug?: string }>).detail;
      setPreviewSlug(detail?.slug ?? '');
    };
    window.addEventListener('jootiya:open-cart', onOpenCart);
    window.addEventListener('jootiya:open-auth', onOpenAuth);
    window.addEventListener('jootiya:preview-product', onPreview);
    return () => {
      window.removeEventListener('jootiya:open-cart', onOpenCart);
      window.removeEventListener('jootiya:open-auth', onOpenAuth);
      window.removeEventListener('jootiya:preview-product', onPreview);
    };
  }, []);

  useEffect(() => {
    setCartOpen(false);
    setAuthOpen(false);
    setPreviewSlug('');
  }, [location.pathname]);

  const routeKey = safePathname(location.pathname);

  return (
    <div className="min-h-screen bg-[#F5F1EB] text-[#2B2B2B]">
      <Header />
      <AnimatePresence mode="wait">
        <motion.main
          key={routeKey}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className="min-h-[calc(100vh-0px)]"
        >
          <Routes location={location}>
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<ShopPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/artisans" element={<ArtisansPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </motion.main>
      </AnimatePresence>
      <Footer />
      <CartDrawer open={cartOpen} onOpenChange={setCartOpen} />
      <AuthModal open={authOpen} onOpenChange={setAuthOpen} defaultTab={authTab} />
      <ProductDetailModal open={!!previewSlug} onOpenChange={(open) => !open && setPreviewSlug('')} product={previewProduct} slug={previewSlug} />
      <Toaster position="top-right" richColors closeButton />
    </div>
  );
}

export function App() {
  return (
    <HashRouter>
      <CartProvider>
        <AppRoutes />
      </CartProvider>
    </HashRouter>
  );
}

export default App;