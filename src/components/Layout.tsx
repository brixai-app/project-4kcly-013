import { useEffect, useRef } from 'react';
import { Outlet, useLocation, useNavigationType } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { NAV_LINKS, getProduct } from '@/mock';
import Header from './Header';
import Footer from './Footer';
import CartDrawer from './CartDrawer';
import CommandPalette from './CommandPalette';

const globalStyles = `
  :root, :root.dark {
    color-scheme: light;
    --background: 40 43% 97%;
    --foreground: 25 20% 18%;
    --card: 40 43% 97%;
    --card-foreground: 25 20% 18%;
    --popover: 40 43% 97%;
    --popover-foreground: 25 20% 18%;
    --primary: 345 40% 27%;
    --primary-foreground: 40 43% 97%;
    --secondary: 34 30% 90%;
    --secondary-foreground: 25 20% 18%;
    --muted: 34 30% 92%;
    --muted-foreground: 25 15% 38%;
    --accent: 34 30% 90%;
    --accent-foreground: 345 40% 27%;
    --destructive: 355 58% 35%;
    --destructive-foreground: 40 43% 97%;
    --border: 30 22% 81%;
    --input: 30 22% 74%;
    --ring: 345 40% 34%;
    --radius: 0.375rem;
    --font-sans: 'DM Sans', Arial, sans-serif;
    --font-serif: 'Playfair Display', 'Bodoni MT', Georgia, serif;
    font-family: var(--font-sans);
    background: #faf7f1;
    color: #372c25;
    font-synthesis: none;
    text-rendering: optimizeLegibility;
    -webkit-font-smoothing: antialiased;
  }
  html { min-width: 320px; scroll-padding-top: 2rem; }
  body {
    display: block;
    margin: 0;
    min-width: 320px;
    min-height: 100vh;
    background: #faf7f1;
    color: #372c25;
    font-family: var(--font-sans);
    line-height: 1.6;
  }
  #root {
    width: 100%;
    max-width: none;
    min-height: 100vh;
    margin: 0;
    padding: 0;
    text-align: left;
    isolation: isolate;
  }
  *, *::before, *::after { box-sizing: border-box; }
  h1, h2, h3, h4, h5, h6, .font-serif {
    font-family: var(--font-serif);
    font-synthesis: none;
  }
  h1, h2, h3, h4, h5, h6 { overflow-wrap: break-word; }
  button, input, textarea, select { font-family: inherit; }
  button, [role='button'], a, input, textarea, select { -webkit-tap-highlight-color: transparent; }
  :where(a, button, input, textarea, select, [tabindex]):focus-visible {
    outline: 2px solid #79394b;
    outline-offset: 4px;
  }
  #main-content:focus { outline: none; }
  ::selection { background: #e5cbd0; color: #40222b; }
  .jootiya-inner {
    width: 100%;
    max-width: 1600px;
    margin-inline: auto;
    padding-inline: 1.5rem;
  }
  .jootiya-shell > header, .jootiya-shell > footer,
  .jootiya-shell main, .jootiya-page { width: 100%; min-width: 0; }
  @media (min-width: 1024px) { .jootiya-inner { padding-inline: 3rem; } }
  @media (prefers-reduced-motion: reduce) {
    html { scroll-behavior: auto !important; }
    *, *::before, *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
      scroll-behavior: auto !important;
    }
  }
`;

/** Browser-only demo shell; business data and persistence remain in src/mock.ts. */
export function Layout() {
  const location = useLocation();
  const navigationType = useNavigationType();
  const reducedMotion = useReducedMotion();
  const mainRef = useRef<HTMLElement>(null);
  const announcementRef = useRef<HTMLDivElement>(null);
  const scrollPositions = useRef(new Map<string, { x: number; y: number }>());
  const previousPath = useRef<string | null>(null);

  useEffect(() => {
    const stylesheetId = 'jootiya-google-fonts';
    if (!document.getElementById(stylesheetId)) {
      const link = document.createElement('link');
      link.id = stylesheetId;
      link.rel = 'stylesheet';
      link.href = 'https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Playfair+Display:wght@400;500;600;700&display=swap';
      document.head.appendChild(link);
    }
    // Keep the shared stylesheet mounted. Local font stacks work offline.
    const previousRestoration = window.history.scrollRestoration;
    window.history.scrollRestoration = 'manual';
    return () => {
      window.history.scrollRestoration = previousRestoration;
    };
  }, []);

  useEffect(() => {
    const routeChanged = previousPath.current !== location.pathname;
    const firstVisit = previousPath.current === null;
    previousPath.current = location.pathname;

    let title = NAV_LINKS.find((link) => link.path === location.pathname)?.label;
    if (location.pathname.startsWith('/product/')) {
      try {
        const slug = decodeURIComponent(location.pathname.slice('/product/'.length));
        title = getProduct(slug)?.name ?? 'Product unavailable';
      } catch {
        title = 'Product unavailable';
      }
    }
    if (location.pathname === '/checkout') {
      title = new URLSearchParams(location.search).has('order')
        ? 'Order confirmation'
        : 'Demo checkout';
    }
    title = title ?? 'Jodhpur Mojris';
    const oldTitle = document.title;
    document.title = `${title} | Jootiya`;

    if (announcementRef.current) announcementRef.current.textContent = '';
    const announceTimer = window.setTimeout(() => {
      if (announcementRef.current) {
        announcementRef.current.textContent = `${title} page loaded.`;
      }
    }, 150);

    const restoreFrame = window.requestAnimationFrame(() => {
      if (routeChanged && !firstVisit && navigationType !== 'POP') {
        mainRef.current?.focus({ preventScroll: true });
      }
      if (location.hash) {
        let anchor = location.hash.slice(1);
        try { anchor = decodeURIComponent(anchor); } catch { /* Use the literal ID. */ }
        const target = document.getElementById(anchor);
        if (target) {
          target.scrollIntoView({ behavior: 'instant', block: 'start' });
          return;
        }
      }
      const saved = navigationType === 'POP'
        ? scrollPositions.current.get(location.key)
        : undefined;
      if (saved) {
        window.scrollTo({ left: saved.x, top: saved.y, behavior: 'instant' });
      } else if (routeChanged || navigationType !== 'POP') {
        window.scrollTo({ left: 0, top: 0, behavior: 'instant' });
      }
    });

    const rememberScroll = () => {
      const positions = scrollPositions.current;
      positions.set(location.key, { x: window.scrollX, y: window.scrollY });
      if (positions.size > 100) {
        const oldest = positions.keys().next().value;
        if (oldest !== undefined) positions.delete(oldest);
      }
    };
    window.addEventListener('scroll', rememberScroll, { passive: true });
    return () => {
      window.cancelAnimationFrame(restoreFrame);
      window.clearTimeout(announceTimer);
      window.removeEventListener('scroll', rememberScroll);
      document.title = oldTitle;
    };
  }, [location.key, location.pathname, location.search, location.hash, navigationType]);

  return (
    <div className="jootiya-shell flex min-h-screen w-full flex-col bg-[#faf7f1] text-[#372c25]">
      <style>{globalStyles}</style>
      <Header />
      <main
        id="main-content"
        ref={mainRef}
        tabIndex={-1}
        className="min-w-0 flex-1"
        aria-label="Main content"
      >
        <motion.div
          key={location.pathname}
          className="jootiya-page"
          initial={reducedMotion ? false : { opacity: 0.75 }}
          animate={{ opacity: 1 }}
          transition={{ duration: reducedMotion ? 0 : 0.22, ease: 'easeOut' }}
        >
          <Outlet />
        </motion.div>
      </main>
      <Footer />
      <CartDrawer />
      <CommandPalette />
      <div
        ref={announcementRef}
        className="sr-only"
        role="status"
        aria-live="polite"
        aria-atomic="true"
      />
    </div>
  );
}

export default Layout;