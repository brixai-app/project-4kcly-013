import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowUpRight, Menu, Search, ShoppingBag } from 'lucide-react';
import {
  Badge,
  Button,
  Separator,
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/shadcn';
import { ASSETS, DEMO_NOTICE, NAV_LINKS, setOverlay, useMockStore } from '@/mock';

const focusStyle = 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#763b45] focus-visible:ring-offset-4 focus-visible:ring-offset-[#faf7f1] dark:focus-visible:ring-[#dfb5a8] dark:focus-visible:ring-offset-[#241e1b]';

export function Header() {
  const { pathname } = useLocation();
  const totalUnits = useMockStore((state) => state.cart.reduce((total, line) => total + line.quantity, 0));
  const mobileNavOpen = useMockStore((state) => state.overlays.mobileNav);
  const commandOpen = useMockStore((state) => state.overlays.command);
  const cartOpen = useMockStore((state) => state.overlays.cart);
  const homePath = NAV_LINKS.find((link) => link.path === '/')?.path ?? '/';
  const isActive = (path: string) => path === '/' ? pathname === path : pathname === path || pathname.startsWith(`${path}/`);
  const closeNavigation = () => setOverlay('mobileNav', false);

  return (
    <TooltipProvider delayDuration={250}>
      <a
        href="#main-content"
        className={`sr-only fixed left-6 top-4 z-[100] rounded-md bg-[#763b45] px-5 py-3 text-sm font-medium text-white focus:not-sr-only ${focusStyle}`}
      >
        Skip to main content
      </a>

      <header className="relative z-30 w-full border-b border-[#d9cebf]/70 bg-[#faf7f1] text-[#352a25] dark:border-[#51443b] dark:bg-[#241e1b] dark:text-[#f2e8dc]">
        <div className="flex w-full min-w-0 items-center justify-between gap-3 px-6 py-5 sm:gap-6 lg:px-12 lg:py-6">
          <div className="flex min-w-0 items-center gap-3 lg:gap-5">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label="Open navigation menu"
              aria-haspopup="dialog"
              aria-expanded={mobileNavOpen}
              onClick={() => setOverlay('mobileNav', true)}
              className={`h-11 w-11 shrink-0 rounded-full text-inherit hover:bg-[#eee6da] dark:hover:bg-[#3a3029] lg:hidden ${focusStyle}`}
            >
              <Menu className="h-5 w-5" aria-hidden="true" />
            </Button>

            <Link
              to={homePath}
              aria-label="Jootiya — home"
              onClick={closeNavigation}
              className={`inline-flex min-w-0 flex-col items-start rounded-sm ${focusStyle}`}
            >
              {ASSETS.logo ? (
                <img
                  src={ASSETS.logo}
                  alt="Jootiya"
                  className="h-10 w-auto max-w-[132px] object-contain sm:h-12 sm:max-w-[180px]"
                />
              ) : (
                <span className="font-['Playfair_Display',Georgia,serif] text-[32px] leading-none tracking-[-0.05em] sm:text-[40px]">
                  Jootiya<span className="text-[#763b45] dark:text-[#dfb5a8]">.</span>
                </span>
              )}
              <span className="mt-2 hidden text-[9px] font-medium uppercase leading-normal tracking-[0.24em] text-[#796858] sm:block dark:text-[#c2b09f]">
                Handcrafted in Jodhpur
              </span>
            </Link>
          </div>

          <nav aria-label="Main navigation" className="hidden min-w-0 items-center gap-8 lg:flex xl:gap-12">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                aria-current={isActive(link.path) ? 'page' : undefined}
                className={`rounded-sm border-b py-2 text-[13px] font-medium tracking-[0.03em] transition-colors duration-200 ${focusStyle} ${isActive(link.path) ? 'border-[#763b45] text-[#763b45] dark:border-[#dfb5a8] dark:text-[#dfb5a8]' : 'border-transparent text-[#67574a] hover:border-[#baa48e] hover:text-[#763b45] dark:text-[#d4c3b2] dark:hover:text-[#dfb5a8]'}`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex shrink-0 items-center gap-1 sm:gap-3">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  aria-label="Search the collection. Keyboard shortcut: Control or Command K"
                  aria-haspopup="dialog"
                  aria-expanded={commandOpen}
                  onClick={() => setOverlay('command', true)}
                  className={`h-11 gap-3 rounded-full px-3 text-inherit hover:bg-[#eee6da] dark:hover:bg-[#3a3029] ${focusStyle}`}
                >
                  <Search className="h-[19px] w-[19px]" aria-hidden="true" />
                  <span className="hidden text-xs xl:inline">Search</span>
                  <kbd aria-hidden="true" className="hidden rounded border border-[#d9cebf] px-1.5 py-0.5 text-[10px] text-[#796858] xl:inline dark:border-[#655346] dark:text-[#c2b09f]">
                    ⌘ / Ctrl K
                  </kbd>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Search Mojris · Ctrl / ⌘ K</TooltipContent>
            </Tooltip>

            <Separator orientation="vertical" className="hidden h-5 bg-[#d9cebf] sm:block dark:bg-[#655346]" />

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  aria-label={`Open shopping bag, ${totalUnits} ${totalUnits === 1 ? 'item' : 'items'}`}
                  aria-haspopup="dialog"
                  aria-expanded={cartOpen}
                  onClick={() => setOverlay('cart', true)}
                  className={`h-11 gap-2 rounded-full px-2 sm:px-3 text-inherit hover:bg-[#eee6da] dark:hover:bg-[#3a3029] ${focusStyle}`}
                >
                  <ShoppingBag className="h-[19px] w-[19px]" aria-hidden="true" />
                  <span className="hidden text-xs xl:inline">Bag</span>
                  <Badge aria-hidden="true" className="min-w-5 justify-center rounded-full border-transparent bg-[#763b45] px-1.5 py-0.5 text-[10px] leading-4 text-[#fffaf5] hover:bg-[#763b45] dark:bg-[#dfb5a8] dark:text-[#241e1b]">
                    {totalUnits}
                  </Badge>
                </Button>
              </TooltipTrigger>
              <TooltipContent>View your shopping bag</TooltipContent>
            </Tooltip>
          </div>
        </div>
      </header>

      <Sheet open={mobileNavOpen} onOpenChange={(open) => setOverlay('mobileNav', open)}>
        <SheetContent side="left" className="flex w-[min(90vw,400px)] flex-col gap-0 overflow-y-auto border-[#d9cebf] bg-[#faf7f1] p-6 text-[#352a25] dark:border-[#51443b] dark:bg-[#241e1b] dark:text-[#f2e8dc]">
          <SheetHeader className="pr-8 text-left">
            <SheetTitle className="font-['Playfair_Display',Georgia,serif] text-4xl font-normal tracking-tight text-inherit">Jootiya.</SheetTitle>
            <SheetDescription className="pt-2 text-[#796858] dark:text-[#c2b09f]">Rajasthani soul. Jodhpur craftsmanship.</SheetDescription>
          </SheetHeader>
          <Separator className="my-8 bg-[#d9cebf] dark:bg-[#51443b]" />
          <nav aria-label="Mobile navigation" className="flex min-w-0 flex-col gap-3">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={closeNavigation}
                aria-current={isActive(link.path) ? 'page' : undefined}
                className={`flex min-w-0 items-center justify-between gap-4 rounded-md px-3 py-4 font-['Playfair_Display',Georgia,serif] text-2xl transition-colors duration-200 ${focusStyle} ${isActive(link.path) ? 'bg-[#eee4d8] text-[#763b45] dark:bg-[#3a3029] dark:text-[#dfb5a8]' : 'hover:bg-[#eee6da] dark:hover:bg-[#3a3029]'}`}
              >
                <span className="whitespace-normal break-words">{link.label}</span>
                <ArrowUpRight className="h-4 w-4 shrink-0" aria-hidden="true" />
              </Link>
            ))}
          </nav>
          <Separator className="my-8 bg-[#d9cebf] dark:bg-[#51443b]" />
          <Button type="button" variant="outline" onClick={() => setOverlay('command', true)} className={`h-12 justify-start gap-3 border-[#cbbba9] bg-transparent text-inherit hover:bg-[#eee6da] dark:hover:bg-[#3a3029] ${focusStyle}`}>
            <Search className="h-4 w-4" aria-hidden="true" />
            Search the collection
          </Button>
          <div className="mt-auto pt-12">
            <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-[#763b45] dark:text-[#dfb5a8]">From the heart of Rajasthan</p>
            <p className="mt-3 text-xs leading-relaxed text-[#796858] dark:text-[#c2b09f]">{DEMO_NOTICE}</p>
          </div>
        </SheetContent>
      </Sheet>
    </TooltipProvider>
  );
}

export default Header;