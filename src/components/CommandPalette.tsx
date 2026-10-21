import React, { useEffect, useId, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowRight, CornerDownLeft, Home, Search, ShoppingBag, Store, Users } from 'lucide-react';
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  Input,
  ScrollArea,
} from '@/components/ui/shadcn';
import {
  NAV_LINKS,
  ROUTES,
  formatPrice,
  getArtisan,
  searchProducts,
  setOverlay,
  useMockStore,
} from '@/mock';

export function CommandPalette() {
  const navigate = useNavigate();
  const location = useLocation();
  const open = useMockStore((state) => state.overlays.command);
  const products = useMockStore((state) => state.products);
  const cart = useMockStore((state) => state.cart);
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);
  const previousLocation = useRef(location.key);
  const focusFrame = useRef<number | null>(null);
  const id = useId();
  const listId = `${id}-results`;
  const hintId = `${id}-hint`;
  const term = query.trim();
  const units = cart.reduce((total, line) => total + line.quantity, 0);

  const matches = useMemo(
    () => searchProducts(term, term ? 8 : 4),
    [term, products],
  );

  const quickLinks = useMemo(() => {
    const links = [
      ...NAV_LINKS.map((link) => ({
        key: `page:${link.path}`,
        label: link.label,
        detail: link.path === ROUTES.home
          ? 'Return to the Jootiya lookbook'
          : link.path === ROUTES.artisans
            ? 'Discover the hands behind the craft'
            : 'Explore every handcrafted Mojri',
        path: link.path,
        kind: 'page' as const,
        image: '',
        icon: link.path === ROUTES.home ? Home : link.path === ROUTES.artisans ? Users : Store,
      })),
      {
        key: 'action:cart',
        label: 'Shopping bag',
        detail: units ? `${units} ${units === 1 ? 'pair' : 'pairs'} in your bag` : 'Your next heirloom awaits',
        path: '',
        kind: 'cart' as const,
        image: '',
        icon: ShoppingBag,
      },
    ];
    const words = term.normalize('NFKC').toLocaleLowerCase('en-IN').split(/\s+/).filter(Boolean);
    return links.filter((link) => words.every((word) => `${link.label} ${link.detail} ${link.kind === 'cart' ? 'cart checkout' : ''}`.toLocaleLowerCase('en-IN').includes(word)));
  }, [term, units]);

  const productResults = matches.map((product) => ({
    key: `product:${product.id}`,
    label: product.name,
    detail: `${product.color} · ${getArtisan(product.artisanId)?.name ?? 'Jodhpur atelier'} · ${formatPrice(product.price)}`,
    path: ROUTES.product(product.slug),
    kind: 'product' as const,
    image: product.images[0]?.src ?? '',
    icon: ShoppingBag,
  }));
  const results = [...productResults, ...quickLinks];
  const activeIndex = Math.min(selected, Math.max(0, results.length - 1));
  const activeKey = results[activeIndex]?.key;

  useEffect(() => {
    function onShortcut(event: KeyboardEvent) {
      if (!(event.metaKey || event.ctrlKey) || event.key.toLowerCase() !== 'k' || event.altKey || event.isComposing) return;
      event.preventDefault();
      if (event.repeat) return;
      const isOpen = useMockStore.getState().overlays.command;
      if (!isOpen) {
        returnFocusRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
        setQuery('');
        setSelected(0);
      }
      setOverlay('command', !isOpen);
    }
    window.addEventListener('keydown', onShortcut);
    return () => window.removeEventListener('keydown', onShortcut);
  }, []);

  useEffect(() => {
    if (previousLocation.current !== location.key) {
      previousLocation.current = location.key;
      if (useMockStore.getState().overlays.command) setOverlay('command', false);
    }
  }, [location.key]);

  useEffect(() => {
    if (!open || !activeKey) return;
    document.getElementById(`${id}-option-${activeIndex}`)?.scrollIntoView({ block: 'nearest', behavior: 'auto' });
  }, [open, activeKey, activeIndex, id]);

  useEffect(() => () => {
    if (focusFrame.current !== null) window.cancelAnimationFrame(focusFrame.current);
  }, []);

  function activate(index: number) {
    const result = results[index];
    if (!result) return;
    if (result.kind === 'cart') {
      // The central overlay action closes command search before opening the bag.
      setOverlay('cart', true);
      return;
    }
    setOverlay('command', false);
    navigate(result.path);
  }

  function searchCollection() {
    const parameters = new URLSearchParams();
    if (term) parameters.set('q', term);
    setOverlay('command', false);
    navigate(`${ROUTES.catalog}${parameters.size ? `?${parameters.toString()}` : ''}`);
  }

  function onSearchKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.nativeEvent.isComposing) return;
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      if (!results.length) return;
      const direction = event.key === 'ArrowDown' ? 1 : -1;
      setSelected((activeIndex + direction + results.length) % results.length);
    } else if (event.key === 'Enter') {
      event.preventDefault();
      if (results.length) activate(activeIndex);
      else if (term) searchCollection();
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (nextOpen) {
          setQuery('');
          setSelected(0);
        }
        setOverlay('command', nextOpen);
      }}
    >
      <DialogContent
        className="fixed inset-y-0 left-auto right-0 flex h-dvh max-h-dvh w-full max-w-none translate-x-0 translate-y-0 flex-col gap-0 overflow-hidden rounded-none border-y-0 border-l border-r-0 border-[#d8cabb] bg-[#faf7f0] p-0 text-[#342b28] shadow-2xl sm:max-w-xl sm:rounded-none dark:border-[#57483e] dark:bg-[#241e1b] dark:text-[#f6eee3] data-[state=open]:slide-in-from-right data-[state=closed]:slide-out-to-right motion-reduce:animate-none [&>button]:right-6 [&>button]:top-7"
        onOpenAutoFocus={(event) => {
          event.preventDefault();
          if (focusFrame.current !== null) window.cancelAnimationFrame(focusFrame.current);
          returnFocusRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : returnFocusRef.current;
          setQuery('');
          setSelected(0);
          inputRef.current?.focus();
        }}
        onCloseAutoFocus={(event) => {
          event.preventDefault();
          focusFrame.current = window.requestAnimationFrame(() => {
            focusFrame.current = null;
            const overlays = useMockStore.getState().overlays;
            if (overlays.cart || overlays.command || overlays.mobileNav || overlays.sizeGuide || overlays.lightbox !== null) return;
            const target = returnFocusRef.current;
            if (target?.isConnected) target.focus({ preventScroll: true });
          });
        }}
      >
        <DialogHeader className="shrink-0 space-y-3 px-6 pb-6 pt-9 pr-16 sm:px-9 sm:pr-16">
          <p className="text-xs font-medium uppercase tracking-[0.24em] text-[#795e50] dark:text-[#cfb8a5]">The Jootiya edit</p>
          <DialogTitle className="break-words font-serif text-3xl font-normal tracking-tight sm:text-4xl">Find your next heirloom.</DialogTitle>
          <DialogDescription className="text-sm leading-relaxed text-[#75665c] dark:text-[#c6b5a7]">
            Discover Mojris by name, material, colour or artisan.
          </DialogDescription>
        </DialogHeader>

        <div className="shrink-0 px-6 pb-6 sm:px-9">
          <label htmlFor={`${id}-search`} className="sr-only">Search the Jootiya collection and pages</label>
          <div className="relative">
            <Search aria-hidden="true" className="pointer-events-none absolute left-4 top-4 h-5 w-5 text-[#795e50] dark:text-[#cfb8a5]" />
            <Input
              ref={inputRef}
              id={`${id}-search`}
              type="search"
              value={query}
              maxLength={200}
              autoComplete="off"
              spellCheck={false}
              placeholder="Try ivory, leather or Meera…"
              role="combobox"
              aria-autocomplete="list"
              aria-expanded={open}
              aria-controls={listId}
              aria-activedescendant={results.length ? `${id}-option-${activeIndex}` : undefined}
              aria-describedby={hintId}
              className="h-13 min-h-12 rounded-none border-[#cdbdab] bg-[#fffdf8] py-4 pl-12 pr-4 text-base text-[#342b28] focus-visible:ring-[#733e43] dark:border-[#665247] dark:bg-[#302723] dark:text-[#f6eee3]"
              onChange={(event) => {
                setQuery(event.target.value);
                setSelected(0);
              }}
              onKeyDown={onSearchKeyDown}
            />
          </div>
          <p id={hintId} className="mt-3 text-xs leading-relaxed text-[#75665c] dark:text-[#c6b5a7]">Use ↑ ↓ to explore, Enter to open, and Escape to close.</p>
        </div>

        <ScrollArea className="min-h-0 flex-1 border-y border-[#e4d9cb] dark:border-[#57483e]">
          <div className="px-6 py-6 sm:px-9">
            <p role="status" aria-live="polite" aria-atomic="true" className="mb-4 text-xs font-medium uppercase tracking-[0.18em] text-[#795e50] dark:text-[#cfb8a5]">
              {term ? `${results.length} ${results.length === 1 ? 'suggestion' : 'suggestions'}` : 'Popular pairs & useful places'}
            </p>
            <div id={listId} role="listbox" aria-label="Search suggestions" className="space-y-2">
              {results.map((result, index) => {
                const Icon = result.icon;
                const isActive = index === activeIndex;
                return (
                  <Button
                    key={result.key}
                    id={`${id}-option-${index}`}
                    type="button"
                    variant="ghost"
                    role="option"
                    aria-selected={isActive}
                    tabIndex={-1}
                    className={`flex h-auto min-h-20 w-full items-center justify-start gap-4 whitespace-normal rounded-none border p-3 text-left transition-colors motion-reduce:transition-none ${isActive ? 'border-[#bda48f] bg-[#eee4d7] text-[#49272b] dark:border-[#957663] dark:bg-[#43342c] dark:text-[#fff6e9]' : 'border-transparent text-inherit hover:bg-[#f0e8dd] hover:text-[#49272b] dark:hover:bg-[#43342c] dark:hover:text-[#fff6e9]'}`}
                    onMouseEnter={() => setSelected(index)}
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={() => activate(index)}
                  >
                    {result.image ? (
                      <img src={result.image} alt="" loading="lazy" className="h-16 w-12 shrink-0 bg-[#e9dfd0] object-cover" />
                    ) : (
                      <span className="flex h-12 w-12 shrink-0 items-center justify-center border border-[#d8cabb] dark:border-[#746052]"><Icon aria-hidden="true" className="h-5 w-5" /></span>
                    )}
                    <span className="min-w-0 flex-1 space-y-1">
                      <span className="block break-words font-serif text-lg font-normal">{result.label}</span>
                      <span className="block break-words text-xs font-normal leading-relaxed text-[#75665c] dark:text-[#d1bdac]">{result.detail}</span>
                    </span>
                    <ArrowRight aria-hidden="true" className="h-4 w-4 shrink-0" />
                  </Button>
                );
              })}
            </div>
            {!results.length && (
              <div className="space-y-4 py-10">
                <h2 className="break-words font-serif text-2xl">No discoveries just yet.</h2>
                <p className="break-words text-sm leading-7 text-[#75665c] dark:text-[#c6b5a7]">Try a colour such as Burgundy or Ivory, a material such as leather, or an artisan’s name.</p>
                <Button variant="outline" className="rounded-none border-[#bda48f] bg-transparent text-inherit hover:bg-[#eee4d7] hover:text-[#49272b] dark:hover:bg-[#43342c] dark:hover:text-[#fff6e9]" onClick={() => { setQuery(''); setSelected(0); inputRef.current?.focus(); }}>Clear search</Button>
              </div>
            )}
          </div>
        </ScrollArea>

        <div className="shrink-0 space-y-4 px-6 py-6 sm:px-9">
          <Button onClick={searchCollection} className="min-h-12 w-full justify-between gap-3 whitespace-normal rounded-none bg-[#733e43] px-5 py-3 text-[#fffaf2] transition-colors hover:bg-[#582d32] focus-visible:ring-[#733e43] dark:bg-[#e7ccba] dark:text-[#38201f] dark:hover:bg-[#f3dfcf]">
            <span>{term ? 'Search the full collection' : 'Explore the full collection'}</span>
            <CornerDownLeft aria-hidden="true" className="h-4 w-4 shrink-0" />
          </Button>
          <p className="text-xs leading-relaxed text-[#75665c] dark:text-[#c6b5a7]">A browser-only demonstration with fictional products and artisans. No payment or shipment takes place.</p>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default CommandPalette;