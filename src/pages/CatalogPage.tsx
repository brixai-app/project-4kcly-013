import React from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Filter, X } from "lucide-react";

import mockStore, { MojriProduct, MojriStyle } from "@/mock";
import {
  Button,
  Card,
  CardContent,
  Badge,
  Input,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  Separator,
} from "@/components/ui/shadcn";

// NOTE: This page is fully frontend-only and talks to the mocked client store in src/mock.ts.
// There is NO backend. All filtering/searching is done in-memory with localStorage persistence
// handled by the mock store.

const pageVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0 },
};

const cardVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0 },
};

const CatalogPage: React.FC = () => {
  const navigate = useNavigate();

  // Subscribe to mock store. In App we likely use useSyncExternalStore, but here
  // we can keep it simple with a manual subscription hook to respect the central store.
  const [state, setState] = React.useState(mockStore.getSnapshot());

  React.useEffect(() => {
    const unsubscribe = mockStore.subscribe((next) => {
      setState(next);
    });
    return () => unsubscribe();
  }, []);

  const artisans = state.artisans;
  const search = state.search;
  const allProducts = mockStore.getFilteredProducts();

  const handleSearchChange = (value: string) => {
    mockStore.setSearchTerm(value);
  };

  const handleArtisanFilter = (artisanId: string | null) => {
    mockStore.setSearchArtisan(artisanId);
  };

  const handleStyleFilter = (style: MojriStyle | "All") => {
    mockStore.setSearchStyle(style);
  };

  const clearFilters = () => {
    mockStore.clearSearchFilters();
  };

  const styleOptions: Array<MojriStyle | "All"> = [
    "All",
    "Classic",
    "Contemporary",
    "Bridal",
    "Everyday",
    "Heritage",
  ];

  const activeArtisan = search.artisanId
    ? artisans.find((a) => a.id === search.artisanId)
    : null;

  const styleLabel = search.style === "All" ? "Style" : search.style;
  const artisanLabel = activeArtisan ? activeArtisan.name : "Artisan";

  const hasFilters = Boolean(
    search.term.trim() || search.artisanId || search.style !== "All",
  );

  // Simple asymmetric masonry by mapping index to span variants
  const getCardLayoutClasses = (index: number) => {
    const mod = index % 6;
    switch (mod) {
      case 0:
        return "md:col-span-2 md:row-span-2";
      case 1:
        return "md:col-span-1 md:row-span-1";
      case 2:
        return "md:col-span-1 md:row-span-2";
      case 3:
        return "md:col-span-2 md:row-span-1";
      case 4:
        return "md:col-span-1 md:row-span-1";
      case 5:
      default:
        return "md:col-span-1 md:row-span-2";
    }
  };

  const onViewDetails = (product: MojriProduct) => {
    navigate(`/product/${product.id}`);
  };

  return (
    <motion.main
      className="min-h-screen w-full bg-[#f5efe8] text-slate-900 dark:bg-[#100f10] dark:text-slate-100"
      initial="hidden"
      animate="visible"
      exit="hidden"
      variants={pageVariants}
      transition={{ duration: 0.45, ease: "easeOut" }}
    >
      {/* Top intro + filters */}
      <section className="w-full pt-20 pb-10 lg:pt-24 lg:pb-12">
        <div className="w-full max-w-[1600px] mx-auto px-6 lg:px-12">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-xl space-y-3">
              <p className="uppercase tracking-[0.28em] text-xs text-amber-700/70 dark:text-amber-200/70">
                The Jodhpur Edit
              </p>
              <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl leading-tight">
                Curated Mojris from
                <span className="block text-amber-900 dark:text-amber-200"> the blue city ateliers</span>
              </h1>
              <p className="text-sm sm:text-base text-slate-700/80 dark:text-slate-200/80">
                Browse an intentionally small catalog of hand-finished mojris, each pair
                traced back to a named artisan in Jodhpur. Filter by house style or by the
                hands that stitched them.
              </p>
            </div>

            <div className="flex flex-col gap-3 w-full max-w-xl lg:max-w-md">
              <div className="flex gap-3 items-center w-full">
                <div className="flex-1 relative">
                  <Input
                    value={search.term}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    placeholder="Search by mojri or artisan"
                    className="h-11 rounded-none border-amber-900/10 bg-white/60 text-sm tracking-wide placeholder:text-slate-400 focus-visible:ring-amber-700/40 dark:bg-[#161516] dark:border-amber-100/10"
                  />
                  {search.term && (
                    <button
                      type="button"
                      onClick={() => handleSearchChange("")}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-100 transition-colors"
                      aria-label="Clear search"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="rounded-none border-amber-900/20 bg-white/70 px-3 h-9 text-xs uppercase tracking-[0.19em] flex items-center gap-2 hover:bg-amber-50/80 dark:bg-[#161516] dark:border-amber-50/20 dark:hover:bg-[#1c1b1d]"
                    >
                      <Filter className="h-3 w-3" />
                      <span>{styleLabel}</span>
                      <ChevronDown className="h-3 w-3" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="rounded-none border-amber-900/15 bg-[#f9f3ec] dark:bg-[#181719]">
                    {styleOptions.map((opt) => (
                      <DropdownMenuItem
                        key={opt}
                        onClick={() => handleStyleFilter(opt)}
                        className="cursor-pointer text-xs font-medium tracking-[0.16em] uppercase text-slate-800 dark:text-slate-100"
                      >
                        {opt === "All" ? "All styles" : opt}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="rounded-none border-amber-900/20 bg-white/70 px-3 h-9 text-xs uppercase tracking-[0.19em] flex items-center gap-2 hover:bg-amber-50/80 dark:bg-[#161516] dark:border-amber-50/20 dark:hover:bg-[#1c1b1d]"
                    >
                      <span>{artisanLabel}</span>
                      <ChevronDown className="h-3 w-3" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="rounded-none border-amber-900/15 bg-[#f9f3ec] dark:bg-[#181719]">
                    <DropdownMenuItem
                      onClick={() => handleArtisanFilter(null)}
                      className="cursor-pointer text-xs font-medium tracking-[0.16em] uppercase text-slate-800 dark:text-slate-100"
                    >
                      All artisans
                    </DropdownMenuItem>
                    <Separator className="my-1 bg-amber-900/10 dark:bg-amber-50/15" />
                    {artisans.map((artisan) => (
                      <DropdownMenuItem
                        key={artisan.id}
                        onClick={() => handleArtisanFilter(artisan.id)}
                        className="cursor-pointer text-xs font-medium tracking-[0.12em] uppercase text-slate-700 dark:text-slate-100"
                      >
                        {artisan.name}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>

                {hasFilters && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearFilters}
                    className="rounded-none h-9 px-3 text-[11px] uppercase tracking-[0.18em] text-amber-900 hover:text-amber-950 hover:bg-amber-100/60 dark:text-amber-200 dark:hover:bg-amber-50/10"
                  >
                    Clear
                  </Button>
                )}

                <div className="ml-auto flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                  <span>{allProducts.length.toString().padStart(2, "0")} pairs</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Catalog grid */}
      <section className="w-full pb-16 lg:pb-24">
        <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-12">
          {allProducts.length === 0 ? (
            <div className="py-20 flex flex-col items-center justify-center text-center gap-4">
              <p className="font-serif text-2xl sm:text-3xl text-slate-800 dark:text-slate-100">
                Nothing matches this composition yet.
              </p>
              <p className="max-w-md text-sm text-slate-600 dark:text-slate-300">
                Try softening your filters or exploring all artisans – our Jodhpur edit is
                intentionally small and intimate.
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={clearFilters}
                className="rounded-none border-amber-900/20 bg-white/70 h-9 px-4 text-[11px] uppercase tracking-[0.18em] hover:bg-amber-50/80 dark:bg-[#161516] dark:border-amber-50/20 dark:hover:bg-[#1c1b1d]"
              >
                Reset filters
              </Button>
            </div>
          ) : (
            <AnimatePresence mode="sync">
              <motion.div
                layout
                className="grid grid-cols-1 md:grid-cols-3 auto-rows-[260px] md:auto-rows-[260px] gap-4 sm:gap-5 lg:gap-6"
              >
                {allProducts.map((product, index) => {
                  const artisan = artisans.find(
                    (a) => a.id === product.artisanId,
                  );
                  const layoutClasses = getCardLayoutClasses(index);

                  return (
                    <motion.article
                      key={product.id}
                      layout
                      variants={cardVariants}
                      initial="hidden"
                      animate="visible"
                      exit="hidden"
                      transition={{
                        duration: 0.35,
                        ease: "easeOut",
                      }}
                      whileHover={{
                        y: -4,
                        boxShadow:
                          "0 18px 45px rgba(15, 14, 12, 0.18)",
                      }}
                      className={`${layoutClasses} group cursor-pointer`}
                      onClick={() => onViewDetails(product)}
                    >
                      <Card className="h-full w-full overflow-hidden rounded-none border-amber-900/15 bg-[#f9f3ec]/90 backdrop-blur-sm dark:bg-[#171618]/90 dark:border-amber-50/15">
                        <CardContent className="p-0 h-full flex flex-col">
                          <div className="relative flex-1 overflow-hidden">
                            <motion.img
                              src={product.heroImage}
                              alt={product.name}
                              className="h-full w-full object-cover object-center transition-opacity duration-500 group-hover:opacity-95"
                              loading="lazy"
                              whileHover={{ scale: 1.02 }}
                              transition={{ duration: 0.4, ease: "easeOut" }}
                            />
                            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#15120f]/60 via-transparent to-transparent" />

                            <div className="absolute left-4 right-4 bottom-4 flex flex-col gap-2">
                              <div className="flex items-center justify-between">
                                <Badge
                                  className="rounded-none border border-amber-50/40 bg-black/50 px-2 py-1 text-[10px] font-medium tracking-[0.19em] uppercase text-amber-50 backdrop-blur-sm"
                                  variant="outline"
                                >
                                  {product.style}
                                </Badge>

                                {product.isLimitedEdition && (
                                  <Badge
                                    variant="outline"
                                    className="rounded-none border-amber-200/80 bg-amber-50/80 px-2 py-1 text-[10px] font-semibold tracking-[0.18em] uppercase text-amber-900"
                                  >
                                    Limited run
                                  </Badge>
                                )}
                              </div>

                              <div className="space-y-1">
                                <h2 className="font-serif text-lg sm:text-xl text-amber-50 leading-snug">
                                  {product.name}
                                </h2>
                                <p className="text-[11px] uppercase tracking-[0.19em] text-amber-100/80">
                                  {artisan ? artisan.name : "Unknown artisan"}
                                </p>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center justify-between px-4 py-3 border-t border-amber-900/10 dark:border-amber-50/10 bg-[#f2e8dc]/80 dark:bg-[#141316]">
                            <div className="space-y-0.5">
                              <p className="text-xs tracking-[0.13em] uppercase text-slate-600 dark:text-slate-300">
                                ₹ {product.priceINR.toLocaleString("en-IN")} INR
                              </p>
                              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                                Sizes {product.sizes[0]}–{
                                  product.sizes[product.sizes.length - 1]
                                }
                              </p>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              className="rounded-none border-amber-900/40 bg-transparent px-4 h-8 text-[11px] uppercase tracking-[0.18em] text-amber-950 hover:bg-amber-900 hover:text-amber-50 dark:border-amber-50/40 dark:text-amber-50"
                              onClick={(e) => {
                                e.stopPropagation();
                                onViewDetails(product);
                              }}
                            >
                              View details
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.article>
                  );
                })}
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </section>
    </motion.main>
  );
};

export default CatalogPage;