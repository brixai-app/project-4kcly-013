import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Toaster } from 'sonner';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { cn } from '@/lib/utils';

export interface AppLayoutProps {
  showGutterFrame?: boolean;
}

export function AppLayout({ showGutterFrame = true }: AppLayoutProps) {
  const location = useLocation();

  return (
    <div className="min-h-screen w-full bg-[#F9F6F2] text-[#2E2B28]">
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute inset-0 opacity-70" />
        <div className="absolute inset-y-0 left-0 w-px bg-[#D9D1C7]/60" />
        <div className="absolute inset-y-0 right-0 w-px bg-[#D9D1C7]/60" />
      </div>

      <Header />

      <main
        className={cn(
          'relative z-10 flex-1',
          showGutterFrame && 'pt-6 md:pt-10 pb-12 md:pb-16'
        )}
      >
        <div
          className={cn(
            'w-full mx-auto',
            'px-4 sm:px-6 lg:px-10 xl:px-16',
            'max-w-7xl'
          )}
        >
          <div className="rounded-[18px] border border-[#D9D1C7] bg-[#FAF7F3]/90 backdrop-blur-sm shadow-[0_22px_60px_rgba(15,14,12,0.12)] overflow-hidden">
            <div className="border-b border-[#E5DDD2] px-4 sm:px-6 lg:px-10 py-3 sm:py-4 flex items-center justify-between">
              <div className="flex items-baseline gap-3">
                <span className="text-[11px] sm:text-xs font-semibold tracking-[0.22em] uppercase text-[#9A8E82]">
                  Jootiya
                </span>
                <span className="hidden sm:inline-block h-3 w-px bg-[#D9D1C7]" />
                <span className="hidden sm:inline-block text-[11px] tracking-[0.18em] uppercase text-[#B0A69D]">
                  Maison de Chaussures
                </span>
              </div>
              <div className="flex items-center gap-4 text-[10px] sm:text-xs tracking-[0.2em] uppercase text-[#9A8E82]">
                <span className="hidden md:inline-block">
                  Curated Footwear Editions
                </span>
                <span className="inline-flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#8B0000]" />
                  <span>Live</span>
                </span>
              </div>
            </div>

            <div className="relative">
              <AnimatePresence mode="wait">
                <motion.div
                  key={location.pathname}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.35, ease: [0.22, 0.61, 0.36, 1] }}
                  className="min-h-[70vh]"
                >
                  <Outlet />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </main>

      <Footer />

      <Toaster
        theme="light"
        toastOptions={{
          style: {
            background: '#FFFFFF',
            borderRadius: 16,
            border: '1px solid #D9D1C7',
            color: '#2E2B28',
            fontFamily: 'Inter, system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
          },
        }}
        position="top-right"
        richColors
      />
    </div>
  );
}

export default AppLayout;