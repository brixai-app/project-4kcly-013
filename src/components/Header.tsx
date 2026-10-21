import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronDown, ArrowUpRight, Menu, ShoppingBag } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import {
  Button,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetClose,
} from '@/components/ui/shadcn';
import { NAV_LINKS } from '@/routes';
import { categories, selectCartCount, useStore } from '@/mock';
import { cn } from '@/lib/utils';

/** Navigation only; demo commerce data and drawer state remain in mock.ts. */
export function Header() {
  const location = useLocation();
  const reduceMotion = useReducedMotion();
  const itemCount = useStore(selectCartCount);
  const cartOpen = useStore((state) => state.cartOpen);
  const setCartOpen = useStore((state) => state.setCartOpen);
  const catalogPath = NAV_LINKS.find((link) => link.path === '/catalog')?.path ?? '/catalog';
  const selectedCategory = new URLSearchParams(location.search).get('category');
  const onCatalog = location.pathname === catalogPath;

  function isActive(path: string): boolean {
    const destination = new URL(path, 'https://jootiya.example');
    const matchesPath = destination.pathname === '/'
      ? location.pathname === '/'
      : location.pathname === destination.pathname ||
        location.pathname.startsWith(`${destination.pathname}/`);
    return matchesPath && (!destination.search || destination.search === location.search);
  }

  function collectionPath(categoryId: string): string {
    return `${catalogPath}?${new URLSearchParams({ category: categoryId }).toString()}`;
  }

  const navigationClass = (active: boolean) => cn(
    'inline-flex min-h-11 items-center border-b px-1 py-3 text-xs font-medium uppercase tracking-[0.15em]',
    'transition-colors duration-200 focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4',
    active
      ? 'border-foreground text-foreground'
      : 'border-transparent text-muted-foreground hover:border-foreground/40 hover:text-foreground',
  );

  return (
    <header className="relative z-30 w-full border-b border-border bg-background text-foreground">
      <a
        href="#main-content"
        className="sr-only z-50 rounded-md bg-foreground px-5 py-3 text-background focus:not-sr-only focus:absolute focus:left-6 focus:top-3 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
      >
        Skip to content
      </a>

      <div className="flex w-full flex-wrap items-center justify-between gap-x-6 gap-y-1 border-b border-border/70 px-6 py-2.5 text-[10px] uppercase tracking-[0.16em] text-muted-foreground lg:px-12">
        <p>Rajasthani Mojris · Inspired by Jodhpur</p>
        <p className="hidden sm:block">Browser-only demo · No real payments</p>
      </div>

      <div className="flex min-h-24 w-full items-center justify-between gap-4 px-6 lg:min-h-28 lg:gap-8 lg:px-12">
        <div className="flex min-w-0 items-center gap-3 lg:gap-0">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-11 w-11 shrink-0 rounded-none lg:hidden"
                aria-label="Open storefront navigation"
              >
                <Menu className="h-5 w-5" aria-hidden="true" />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="left"
              className="flex w-[min(90vw,420px)] flex-col overflow-y-auto bg-background px-6 pb-8 pt-14 sm:px-8"
            >
              <SheetHeader className="text-left">
                <SheetTitle className="font-serif text-4xl font-normal tracking-tight">
                  Jootiya
                </SheetTitle>
                <SheetDescription className="pt-2 text-sm leading-relaxed">
                  Discover the Rajasthani Mojri, through a Jodhpur-inspired lens.
                </SheetDescription>
              </SheetHeader>

              <nav aria-label="Mobile navigation" className="mt-8 flex flex-col gap-1">
                {NAV_LINKS.map((link) => (
                  <SheetClose key={link.path} asChild>
                    <Link
                      to={link.path}
                      aria-current={isActive(link.path) ? 'page' : undefined}
                      className={cn(
                        'flex min-h-14 items-center justify-between gap-4 border-b border-border py-4 font-serif text-2xl transition-colors hover:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                        isActive(link.path) && 'underline decoration-1 underline-offset-8',
                      )}
                    >
                      {link.label}
                      <ArrowUpRight className="h-4 w-4 shrink-0" aria-hidden="true" />
                    </Link>
                  </SheetClose>
                ))}
              </nav>

              <section className="mt-9" aria-labelledby="mobile-collections-title">
                <h2 id="mobile-collections-title" className="mb-3 text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
                  Explore the collections
                </h2>
                <nav aria-label="Mobile collections" className="flex flex-col gap-1">
                  {categories.map((category) => (
                    <SheetClose key={category.id} asChild>
                      <Link
                        to={collectionPath(category.id)}
                        aria-current={onCatalog && selectedCategory === category.id ? 'page' : undefined}
                        className="flex min-h-12 items-center rounded-sm px-2 py-3 text-sm transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring aria-[current=page]:bg-muted aria-[current=page]:font-semibold"
                      >
                        {category.name}
                      </Link>
                    </SheetClose>
                  ))}
                </nav>
              </section>
              <p className="mt-auto pt-10 text-xs leading-relaxed text-muted-foreground">
                An illustrative storefront. Products and artisan stories are demo content;
                orders and payments are simulated.
              </p>
            </SheetContent>
          </Sheet>

          <Link
            to="/"
            aria-label="Jootiya — home"
            className="inline-flex min-h-12 min-w-0 flex-col justify-center rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4"
          >
            <span className="font-serif text-3xl leading-none tracking-[-0.04em] sm:text-4xl lg:text-[42px]">Jootiya<span className="text-primary">.</span></span>
            <span className="mt-2 hidden text-[9px] uppercase tracking-[0.24em] text-muted-foreground sm:block">The art of the Mojri</span>
          </Link>
        </div>

        <nav aria-label="Main navigation" className="hidden min-w-0 items-center gap-6 lg:flex xl:gap-10">
          {NAV_LINKS.map((link) => (
            <Link key={link.path} to={link.path} aria-current={isActive(link.path) ? 'page' : undefined} className={navigationClass(isActive(link.path))}>
              {link.label}
            </Link>
          ))}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="min-h-11 gap-2 rounded-none px-2 text-xs font-medium uppercase tracking-[0.15em] text-muted-foreground hover:text-foreground data-[state=open]:bg-muted" aria-label="Browse collections">
                Collections
                <ChevronDown className="h-3.5 w-3.5" aria-hidden="true" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" sideOffset={12} className="w-80 max-w-[calc(100vw-3rem)] rounded-none border-border bg-popover p-2 shadow-lg">
              {categories.map((category) => (
                <DropdownMenuItem key={category.id} asChild className="cursor-pointer rounded-none p-3 focus:bg-muted">
                  <Link to={collectionPath(category.id)} aria-current={onCatalog && selectedCategory === category.id ? 'page' : undefined} className="flex min-h-14 items-center justify-between gap-4">
                    <span className="min-w-0">
                      <span className="block font-serif text-lg">{category.name}</span>
                      <span className="mt-1 block whitespace-normal text-xs leading-relaxed text-muted-foreground">{category.description}</span>
                    </span>
                    <ArrowUpRight className="h-4 w-4 shrink-0" aria-hidden="true" />
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>

        <Button
          type="button"
          variant="ghost"
          onClick={() => setCartOpen(true)}
          aria-label={`Open shopping bag, ${itemCount} ${itemCount === 1 ? 'item' : 'items'}`}
          aria-haspopup="dialog"
          aria-expanded={cartOpen}
          className="min-h-12 shrink-0 gap-2 rounded-none px-2 text-xs font-medium uppercase tracking-[0.12em] sm:gap-3 sm:px-3"
        >
          <ShoppingBag className="h-[19px] w-[19px]" strokeWidth={1.5} aria-hidden="true" />
          <span className="hidden sm:inline">Bag</span>
          <motion.span
            key={itemCount}
            initial={reduceMotion ? false : { opacity: 0.5, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.18 }}
            aria-hidden="true"
            className="inline-flex min-h-6 min-w-6 items-center justify-center rounded-full bg-foreground px-1.5 text-[10px] tabular-nums text-background"
          >
            {itemCount}
          </motion.span>
        </Button>
      </div>
      <span role="status" aria-live="polite" aria-atomic="true" className="sr-only">
        Shopping bag: {itemCount} {itemCount === 1 ? 'item' : 'items'}.
      </span>
    </header>
  );
}

export default Header;