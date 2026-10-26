import React, { Suspense, useEffect, useMemo, useState } from 'react';
import { HashRouter, Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Toaster } from 'sonner';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { CartDrawer } from '@/components/CartDrawer';
import { AuthModal } from '@/components/AuthModal';
import { CartProvider } from '@/context/CartContext';
import { Home } from '@/pages/Home';
import { ShopPage } from '@/pages/ShopPage';
import { JourneyPages } from '@/pages/JourneyPages';

function AppShell() {
  const location = useLocation();
  const navigate = useNavigate();
  const [authOpen, setAuthOpen] = useState(false);

  useEffect(() => {
    const onOpenAuth = () => setAuthOpen(true);
    window.addEventListener('jootiya:open-auth', onOpenAuth as EventListener);
    return () => window.removeEventListener('jootiya:open-auth', onOpenAuth as EventListener);
  }, []);

  useEffect(() => {
    if (location.pathname === '/cart') navigate('/shop', { replace: true });
  }, [location.pathname, navigate]);

  const pageKey = useMemo(() => location.pathname + location.search, [location.pathname, location.search]);

  return (
    <div className="min-h-screen bg-[#F7F0E4] text-[#2B1715]">
      <Header />
      <main className="min-h-[calc(100vh-8rem)]">
        <AnimatePresence mode="wait">
          <motion.div
            key={pageKey}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="min-h-[calc(100vh-8rem)]"
          >
            <Suspense fallback={<div className="px-4 py-16 text-center text-sm uppercase tracking-[0.3em] text-[#765F55]">Loading</div>}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/shop" element={<ShopPage />} />
                <Route path="/journey/*" element={<JourneyPages />} />
                <Route path="/cart" element={<Navigate to="/shop" replace />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Suspense>
          </motion.div>
        </AnimatePresence>
      </main>
      <Footer />
      <CartDrawer />
      <AuthModal open={authOpen} onOpenChange={setAuthOpen} />
      <Toaster position="top-right" richColors closeButton toastOptions={{ style: { background: '#FFFDF8', color: '#2B1715', border: '1px solid #CDBB9F' } }} />
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