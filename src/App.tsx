import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import AppLayout from '@/components/AppLayout';
import { CartProvider } from '@/context/CartContext';
import Home from '@/pages/Home';
import ShopPage from '@/pages/ShopPage';
import ProductPage from '@/pages/ProductPage';
import About from '@/pages/About';
import Contact from '@/pages/Contact';
import Checkout from '@/pages/Checkout';

export function App() {
  return (
    <React.StrictMode>
      <HashRouter>
        <CartProvider>
          <div className="min-h-screen bg-[#F9F6F2] text-[#2E2B28] font-['Inter',system-ui,sans-serif]">
            <AppLayout showGutterFrame>
              <Routes>
                <Route path="/" element={<Home className="" />} />
                <Route path="/shop" element={<ShopPage className="" />} />
                <Route path="/product/:slug" element={<ProductPage className="" />} />
                <Route path="/about" element={<About className="" />} />
                <Route path="/contact" element={<Contact className="" />} />
                <Route path="/checkout" element={<Checkout className="" />} />
                <Route path="*" element={<Home className="" />} />
              </Routes>
            </AppLayout>
          </div>
          <Toaster
            position="top-right"
            richColors
            toastOptions={{
              style: {
                background: '#FFFFFF',
                borderRadius: 16,
                border: '1px solid #D9D1C7',
                color: '#2E2B28',
                fontFamily: 'Inter, system-ui, sans-serif',
              },
              className: 'shadow-lg shadow-black/5',
            }}
          />
        </CartProvider>
      </HashRouter>
    </React.StrictMode>
  );
}

export default App;