import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { CartProvider } from '@/context/CartContext';
import Header from '@/components/Header';
import CartDrawer from '@/components/CartDrawer';
import Home from '@/pages/Home';
import ShopPage from '@/pages/ShopPage';
import { useCart } from '@/context/CartContext';
import { products } from '@/data/mockData';

function ScrollToTop() {
  React.useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);
  return null;
}

function Layout({ children }: { children?: React.ReactNode }) {
  const { isDrawerOpen, closeDrawer } = useCart();
  return (
    <div className="min-h-screen bg-[#F9F6F2] text-[#2E2B28]">
      <Header className="border-b border-[#E6DED3]" />
      <main className="min-h-[calc(100vh-80px)]">{children}</main>
      <footer className="border-t border-[#E6DED3] bg-[#FFFFFF]">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-8 text-sm text-[#6F675E] sm:flex-row sm:items-center sm:justify-between">
          <p className="font-['Lora']">
            © {new Date().getFullYear()} Jootiya. Crafted for those who linger on details.
          </p>
          <div className="flex gap-6">
            <button type="button" className="text-xs tracking-[0.2em] uppercase">
              Privacy
            </button>
            <button type="button" className="text-xs tracking-[0.2em] uppercase">
              Terms
            </button>
            <button type="button" className="text-xs tracking-[0.2em] uppercase">
              Support
            </button>
          </div>
        </div>
      </footer>
      <CartDrawer className="" />
      {isDrawerOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/25"
          onClick={() => closeDrawer()}
        />
      )}
      <Toaster
        position="top-center"
        richColors
        toastOptions={{
          classNames: {
            toast:
              'rounded-[16px] border border-[#E6DED3] bg-[#FFFFFF] font-["Lora"] text-[#2E2B28]',
            title: 'font-["Playfair Display"] text-base',
            description: 'text-sm text-[#6F675E]',
            actionButton:
              'bg-[#BFA06A] text-black rounded-md px-3 py-1 text-xs tracking-[0.18em] uppercase',
            cancelButton:
              'border border-[#E6DED3] rounded-md px-3 py-1 text-xs tracking-[0.18em] uppercase',
          },
        }}
      />
    </div>
  );
}

function ProductRouteWrapper() {
  const search = new URLSearchParams(window.location.hash.split('?')[1] ?? '');
  const id = search.get('id');
  const product = products.find(p => p.id === (id ?? '')) ?? products[0];
  return (
    <>
      <ScrollToTop />
      <ShopPage className="" />
      
      <div data-product-id={product?.id ?? ''} />
    </>
  );
}

function CheckoutPage() {
  return (
    <>
      <ScrollToTop />
      <ShopPage className="" />
    </>
  );
}

function ConfirmationPage() {
  return (
    <>
      <ScrollToTop />
      <Home className="" />
    </>
  );
}

export function App() {
  return (
    <CartProvider>
      <HashRouter>
        <Layout>
          <Routes>
            <Route
              path="/"
              element={
                <>
                  <ScrollToTop />
                  <Home className="" />
                </>
              }
            />
            <Route
              path="/shop"
              element={
                <>
                  <ScrollToTop />
                  <ShopPage className="" />
                </>
              }
            />
            <Route path="/product/:slug" element={<ProductRouteWrapper />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/confirmation" element={<ConfirmationPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Layout>
      </HashRouter>
    </CartProvider>
  );
}

export default App;