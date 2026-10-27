import React, { useEffect, useMemo, useState } from 'react';
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Toaster } from 'sonner';
import { CartProvider } from '@/context/CartContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CartDrawer from '@/components/CartDrawer';
import AuthModal from '@/components/AuthModal';
import Home from '@/pages/Home';
import ShopPage from '@/pages/ShopPage';
import JourneyPages from '@/pages/JourneyPages';

function AppShell() {
  const location = useLocation();
  const [cartOpen, setCartOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);

  useEffect(() => {
    const onOpenCart = () => setCartOpen(true);
    const onOpenAuth = () => setAuthOpen(true);
    window.addEventListener('jootiya:open-cart', onOpenCart);
    window.addEventListener('jootiya:open-auth', onOpenAuth);
    return () => {
      window.removeEventListener('jootiya:open-cart', onOpenCart);
      window.removeEventListener('jootiya:open-auth', onOpenAuth);
    };
  }, []);

  const pageKey = useMemo(() => location.pathname + location.search, [location.pathname, location.search]);

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#1A1A1A]">
      <Header />
      <main className="relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={pageKey}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="min-h-[calc(100vh-8rem)]"
          >
            <Routes location={location}>
              <Route path="/" element={<Home />} />
              <Route path="/shop" element={<ShopPage />} />
              <Route path="/cart" element={<JourneyPages />} />
              <Route path="/checkout" element={<JourneyPages />} />
              <Route path="/artisans" element={<JourneyPages />} />
              <Route path="/artisans/:id" element={<JourneyPages />} />
              <Route path="/product/:slug" element={<JourneyPages />} />
              <Route path="*" element={<Home />} />
            </Routes>
          </motion.div>
        </AnimatePresence>
      </main>
      <Footer />
      <CartDrawer open={cartOpen} onOpenChange={setCartOpen} />
      <AuthModal open={authOpen} onOpenChange={setAuthOpen} />
      <Toaster
        position="top-right"
        richColors={false}
        closeButton
        toastOptions={{
          style: {
            background: '#F5F1E9',
            color: '#1A1A1A',
            border: '1px solid #D8CDBD',
            borderRadius: '4px',
          },
        }}
      />
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