import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, Filter, X } from "lucide-react";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Badge,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  Input,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  Slider,
} from "@/components/ui/shadcn";
import { toast } from "sonner";
import {
  Product,
  CatalogFilters,
  CatalogSortOption,
  applyCatalogFilters,
  getAllBrands,
  getAllCategories,
  getAllSizes,
  getProducts,
  paginateProducts,
  sortCatalog,
  addToCart,
  formatPrice,
} from "@/mock";

// NOTE: This page uses fully mocked client-side data and cart helpers from src/mock.ts.
// There is NO backend; cart updates are persisted to localStorage via the mock layer.

const PAGE_SIZE = 6;

const sortOptions: { value: CatalogSortOption; label: string }[] = [
  { value: "featured", label: "Featured" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "rating-desc", label: "Rating" },
];

interface QuickViewState {
  open: boolean;
  product: Product | null;
}

const CatalogPage: React.FC = () => {
  const allProducts = useMemo(() => getProducts(), []);
  const brands = useMemo(() => getAllBrands(), []);
  const categories = useMemo(() => getAllCategories(), []);
  const sizes = useMemo(() => getAllSizes(), []);

  const [filters, setFilters] = useState<CatalogFilters>({});
  const [sort, setSort] = useState<CatalogSortOption>("featured");
  const [page, setPage] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  const [quickView, setQuickView] = useState<QuickViewState>({
    open: false,
    product: null,
  });
  const [quickViewSize, setQuickViewSize] = useState<string | undefined>(
    undefined
  );
  const [quickViewQty, setQuickViewQty] = useState<number>(1);

  const [priceRange, setPriceRange] = useState<[number, number]>(() => {
    const prices = allProducts.map((p) => p.price);
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    return [min, max];
  });

  // Derived filtered + sorted
  const filteredSorted = useMemo(() => {
    const base: CatalogFilters = {
      ...filters,
      minPrice: priceRange[0],
      maxPrice: priceRange[1],
    };
    const f = applyCatalogFilters(allProducts, base);
    return sortCatalog(f, sort);
  }, [allProducts, filters, sort, priceRange]);

  const visibleProducts = useMemo(
    () => paginateProducts(filteredSorted, 1, page * PAGE_SIZE),
    [filteredSorted, page]
  );

  useEffect(() => {
    setPage(1);
  }, [filters, sort, priceRange]);

  useEffect(() => {
    setHasMore(visibleProducts.length < filteredSorted.length);
  }, [visibleProducts.length, filteredSorted.length]);

  useEffect(() => {
    if (!hasMore) return;
    const target = loadMoreRef.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !isLoadingMore) {
          setIsLoadingMore(true);
          setTimeout(() => {
            setPage((prev) => prev + 1);
            setIsLoadingMore(false);
          }, 350);
        }
      },
      { threshold: 0.4 }
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [hasMore, isLoadingMore]);

  const handleFilterChange = (key: keyof CatalogFilters, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const openQuickView = (product: Product) => {
    setQuickView({ open: true, product });
    setQuickViewSize(undefined);
    setQuickViewQty(1);
  };

  const closeQuickView = () => {
    setQuickView({ open: false, product: null });
  };

  const handleQuickAdd = () => {
    if (!quickView.product) return;
    const { success, error } = addToCart(
      quickView.product.id,
      quickViewSize,
      quickViewQty
    );
    if (!success && error) {
      toast.error(error);
      return;
    }
    toast.success("Added to cart", {
      description: `${quickView.product.name} • Size ${quickViewSize}`,
    });
    closeQuickView();
  };

  const minPriceGlobal = useMemo(
    () => Math.min(...allProducts.map((p) => p.price)),
    [allProducts]
  );
  const maxPriceGlobal = useMemo(
    () => Math.max(...allProducts.map((p) => p.price)),
    [allProducts]
  );

  return (
    <div className="min-h-screen bg-[#F5F1EB] text-[#2B2B2B]">
      <main className="mx-auto max-w-7xl px-4 pb-16 pt-10 sm:px-6 lg:px-8">
        <section className="mb-8 flex flex-col gap-6 border-b border-[#D9CFC0] pb-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-[#A89F91]">
              The Catalog
            </p>
            <h1 className="mt-2 font-['Playfair_Display'] text-3xl font-semibold tracking-tight text-[#2B2B2B] sm:text-4xl">
              Curated luxury for the city wanderer
            </h1>
            <p className="mt-3 max-w-xl font-['Lato'] text-sm text-neutral-700">
              Browse a tightly edited selection of sneakers, boots, loafers and
              sandals – each pair photographed in natural light, crafted in
              limited runs, and designed to move effortlessly from daylight to
              after dark.
            </p>
          </div>
          <div className="flex flex-col gap-3 md:flex-row md:items-center">
            <div className="flex items-center gap-2 text-xs font-semibold tracking-[0.18em] text-[#A89F91]">
              <span className="h-px w-5 bg-[#A89F91]" />
              <span>
                {filteredSorted.length.toString().padStart(2, "0")} styles
                refined
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-['Lato'] text-xs uppercase tracking-[0.16em] text-neutral-600">
                Sort by
              </span>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-[#D9CFC0] bg-[#F5F1EB]/80 px-3 py-1 text-xs font-['Lato'] tracking-[0.12em] text-neutral-800 hover:bg-white/90"
                  >
                    {sortOptions.find((s) => s.value === sort)?.label ??
                      "Featured"}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-48 border-[#D9CFC0] bg-[#FDF9F2] font-['Lato'] text-xs">
                  {sortOptions.map((option) => (
                    <DropdownMenuItem
                      key={option.value}
                      className="cursor-pointer text-[11px] uppercase tracking-[0.16em] text-neutral-700 hover:bg-[#F5F1EB]"
                      onClick={() => setSort(option.value)}
                    >
                      {option.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </section>

        <section className="mb-10 grid gap-6 lg:grid-cols-[minmax(0,260px)_1fr]">
          <FiltersPanel
            brands={brands}
            categories={categories}
            sizes={sizes}
            filters={filters}
            onFilterChange={handleFilterChange}
            priceRange={priceRange}
            setPriceRange={setPriceRange}
            globalPriceRange={[minPriceGlobal, maxPriceGlobal]}
          />

          <div className="flex flex-col">
            {visibleProducts.length === 0 ? (
              <div className="flex h-64 flex-col items-center justify-center rounded-2xl border border-dashed border-[#D9CFC0] bg-white/40 text-center">
                <p className="font-['Playfair_Display'] text-lg text-neutral-800">
                  No styles match these filters.
                </p>
                <p className="mt-2 max-w-sm font-['Lato'] text-xs text-neutral-600">
                  Refine less, discover more – try adjusting your size or price
                  range to reveal pairs waiting just outside your search.
                </p>
                <Button
                  variant="ghost"
                  size="sm"
                  className="mt-4 border border-transparent bg-white px-4 py-1 font-['Lato'] text-xs uppercase tracking-[0.16em] text-neutral-800 shadow-sm hover:border-[#BFA06F]/60 hover:bg-[#FDF8EE]"
                  onClick={() => {
                    setFilters({});
                    setPriceRange([minPriceGlobal, maxPriceGlobal]);
                  }}
                >
                  Reset filters
                </Button>
              </div>
            ) : (
              <>
                <MasonryGrid
                  products={visibleProducts}
                  onQuickView={openQuickView}
                />

                <div ref={loadMoreRef} className="mt-10 flex justify-center">
                  {hasMore ? (
                    <div className="flex items-center gap-3 text-xs text-neutral-600">
                      <span className="h-px w-8 bg-[#D9CFC0]" />
                      <span className="font-['Lato'] uppercase tracking-[0.16em]">
                        {isLoadingMore
                          ? "Curating additional pairs…"
                          : "Scroll to reveal more"}
                      </span>
                      <span className="h-px w-8 bg-[#D9CFC0]" />
                    </div>
                  ) : (
                    <div className="flex items-center gap-3 text-xs text-neutral-600">
                      <span className="h-px w-8 bg-[#D9CFC0]" />
                      <span className="font-['Lato'] uppercase tracking-[0.16em]">
                        You have reached the end
                      </span>
                      <span className="h-px w-8 bg-[#D9CFC0]" />
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </section>
      </main>

      <QuickViewDialog
        state={quickView}
        onOpenChange={(open) => {
          if (!open) closeQuickView();
        }}
        selectedSize={quickViewSize}
        onSizeChange={setQuickViewSize}
        quantity={quickViewQty}
        onQuantityChange={setQuickViewQty}
        onAdd={handleQuickAdd}
      />
    </div>
  );
};

interface FiltersPanelProps {
  brands: string[];
  categories: string[];
  sizes: string[];
  filters: CatalogFilters;
  onFilterChange: (key: keyof CatalogFilters, value: any) => void;
  priceRange: [number, number];
  setPriceRange: (range: [number, number]) => void;
  globalPriceRange: [number, number];
}

const FiltersPanel: React.FC<FiltersPanelProps> = ({
  brands,
  categories,
  sizes,
  filters,
  onFilterChange,
  priceRange,
  setPriceRange,
  globalPriceRange,
}) => {
  const [minInput, setMinInput] = useState<string>(
    Math.round(priceRange[0]).toString()
  );
  const [maxInput, setMaxInput] = useState<string>(
    Math.round(priceRange[1]).toString()
  );
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setMinInput(Math.round(priceRange[0]).toString());
    setMaxInput(Math.round(priceRange[1]).toString());
  }, [priceRange]);

  const applyPriceInputs = () => {
    const minNum = Number(minInput) || globalPriceRange[0];
    const maxNum = Number(maxInput) || globalPriceRange[1];
    const clampedMin = Math.max(globalPriceRange[0], Math.min(minNum, maxNum));
    const clampedMax = Math.min(globalPriceRange[1], Math.max(maxNum, clampedMin));
    setPriceRange([clampedMin, clampedMax]);
  };

  const body = (
    <Card className="border-[#D9CFC0] bg-[#FDF9F2]/90 shadow-sm backdrop-blur-sm">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <div>
          <CardTitle className="font-['Playfair_Display'] text-sm font-semibold uppercase tracking-[0.18em] text-neutral-800">
            Filter
          </CardTitle>
          <p className="mt-1 font-['Lato'] text-[11px] text-neutral-600">
            Tailor the grid to your ritual – by silhouette, house, or size.
          </p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-full border border-transparent text-neutral-500 hover:border-[#D9CFC0] hover:bg-white"
          onClick={() => {
            onFilterChange("category", undefined);
            onFilterChange("brand", undefined);
            onFilterChange("size", undefined);
            setPriceRange(globalPriceRange);
          }}
          aria-label="Reset filters"
        >
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <p className="font-['Lato'] text-[11px] font-semibold uppercase tracking-[0.18em] text-neutral-700">
            Category
          </p>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-between border-[#D9CFC0] bg-white/90 font-['Lato'] text-xs text-neutral-800 hover:bg-white"
              >
                <span>
                  {filters.category && filters.category !== "All"
                    ? filters.category
                    : "All categories"}
                </span>
                <Filter className="ml-2 h-3.5 w-3.5 text-neutral-500" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-48 border-[#D9CFC0] bg-[#FDF9F2] font-['Lato'] text-xs">
              <DropdownMenuItem
                onClick={() => onFilterChange("category", "All")}
                className="cursor-pointer text-[11px] uppercase tracking-[0.16em] text-neutral-700 hover:bg-[#F5F1EB]"
              >
                All categories
              </DropdownMenuItem>
              {categories.map((category) => (
                <DropdownMenuItem
                  key={category}
                  onClick={() => onFilterChange("category", category)}
                  className="cursor-pointer text-[11px] uppercase tracking-[0.16em] text-neutral-700 hover:bg-[#F5F1EB]"
                >
                  {category}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="space-y-2">
          <p className="font-['Lato'] text-[11px] font-semibold uppercase tracking-[0.18em] text-neutral-700">
            House
          </p>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-between border-[#D9CFC0] bg-white/90 font-['Lato'] text-xs text-neutral-800 hover:bg-white"
              >
                <span>
                  {filters.brand && filters.brand !== "All"
                    ? filters.brand
                    : "All houses"}
                </span>
                <Filter className="ml-2 h-3.5 w-3.5 text-neutral-500" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 border-[#D9CFC0] bg-[#FDF9F2] font-['Lato'] text-xs">
              <DropdownMenuItem
                onClick={() => onFilterChange("brand", "All")}
                className="cursor-pointer text-[11px] uppercase tracking-[0.16em] text-neutral-700 hover:bg-[#F5F1EB]"
              >
                All houses
              </DropdownMenuItem>
              {brands.map((brand) => (
                <DropdownMenuItem
                  key={brand}
                  onClick={() => onFilterChange("brand", brand)}
                  className="cursor-pointer text-[11px] uppercase tracking-[0.16em] text-neutral-700 hover:bg-[#F5F1EB]"
                >
                  {brand}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="space-y-2">
          <p className="font-['Lato'] text-[11px] font-semibold uppercase tracking-[0.18em] text-neutral-700">
            Size
          </p>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-between border-[#D9CFC0] bg-white/90 font-['Lato'] text-xs text-neutral-800 hover:bg-white"
              >
                <span>
                  {filters.size && filters.size !== "All"
                    ? `EU ${filters.size}`
                    : "All sizes"}
                </span>
                <Filter className="ml-2 h-3.5 w-3.5 text-neutral-500" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-40 border-[#D9CFC0] bg-[#FDF9F2] font-['Lato'] text-xs">
              <DropdownMenuItem
                onClick={() => onFilterChange("size", "All")}
                className="cursor-pointer text-[11px] uppercase tracking-[0.16em] text-neutral-700 hover:bg-[#F5F1EB]"
              >
                All sizes
              </DropdownMenuItem>
              {sizes.map((size) => (
                <DropdownMenuItem
                  key={size}
                  onClick={() => onFilterChange("size", size)}
                  className="cursor-pointer text-[11px] uppercase tracking-[0.16em] text-neutral-700 hover:bg-[#F5F1EB]"
                >
                  EU {size}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="space-y-3">
          <p className="font-['Lato'] text-[11px] font-semibold uppercase tracking-[0.18em] text-neutral-700">
            Price
          </p>
          <div className="px-1">
            <Slider
              value={priceRange}
              min={globalPriceRange[0]}
              max={globalPriceRange[1]}
              step={10}
              onValueChange={(val) => {
                if (Array.isArray(val) && val.length === 2) {
                  setPriceRange([val[0], val[1]]);
                }
              }}
              className="text-[#BFA06F]"
            />
          </div>
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <p className="font-['Lato'] text-[10px] uppercase tracking-[0.16em] text-neutral-500">
                Min
              </p>
              <Input
                type="number"
                value={minInput}
                onChange={(e) => setMinInput(e.target.value)}
                onBlur={applyPriceInputs}
                className="mt-1 h-8 border-[#D9CFC0] bg:white/90 font-['Lato'] text-xs text-neutral-800 focus-visible:border-[#BFA06F] focus-visible:ring-[#BFA06F]/30"
              />
            </div>
            <span className="mt-5 text-[11px] text-neutral-500">to</span>
            <div className="flex-1">
              <p className="font-['Lato'] text-[10px] uppercase tracking-[0.16em] text-neutral-500">
                Max
              </p>
              <Input
                type="number"
                value={maxInput}
                onChange={(e) => setMaxInput(e.target.value)}
                onBlur={applyPriceInputs}
                className="mt-1 h-8 border-[#D9CFC0] bg:white/90 font-['Lato'] text-xs text-neutral-800 focus-visible:border-[#BFA06F] focus-visible:ring-[#BFA06F]/30"
              />
            </div>
          </div>
          <p className="font-['Lato'] text-[11px] text-neutral-500">
            {formatPrice(priceRange[0])} — {formatPrice(priceRange[1])}
          </p>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <>
      <div className="mb-4 flex items-center justify-between lg:hidden">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setMobileOpen((v) => !v)}
          className="border-[#D9CFC0] bg-white/90 font-['Lato'] text-xs uppercase tracking-[0.16em] text-neutral-700 hover:bg:white"
        >
          <Filter className="mr-2 h-3.5 w-3.5" /> Filters
        </Button>
      </div>
      <div className="hidden lg:block">{body}</div>
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="fixed inset-0 z-30 bg-black/25 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileOpen(false)}
          >
            <motion.div
              className="absolute inset-x-0 bottom-0 max-h-[80vh] overflow-y-auto rounded-t-3xl border border-[#D9CFC0] bg-[#FDF9F2] p-4 shadow-2xl"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 260, damping: 26 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mb-3 flex items-center justify-between">
                <p className="font-['Playfair_Display'] text-sm uppercase tracking-[0.18em] text-neutral-800">
                  Filter
                </p>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-full border border-transparent text-neutral-500 hover:border-[#D9CFC0] hover:bg:white"
                  onClick={() => setMobileOpen(false)}
                  aria-label="Close filters"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              {body}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

interface MasonryGridProps {
  products: Product[];
  onQuickView: (product: Product) => void;
}

const MasonryGrid: React.FC<MasonryGridProps> = ({ products, onQuickView }) => {
  return (
    <div className="columns-1 gap-6 md:columns-2 xl:columns-3">
      <AnimatePresence>
        {products.map((product, index) => (
          <motion.div
            key={product.id}
            layout
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{
              duration: 0.4,
              delay: index * 0.04,
              ease: [0.19, 1, 0.22, 1],
            }}
            className="mb-6 break-inside-avoid"
          >
            <ProductCard product={product} onQuickView={() => onQuickView(product)} />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

interface ProductCardProps {
  product: Product;
  onQuickView: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onQuickView }) => {
  const isTall = product.category === "Boots" || product.category === "Sneakers";

  return (
    <article className="group relative overflow-hidden rounded-3xl border border-[#D9CFC0] bg-white/90 shadow-[0_22px_45px_rgba(15,14,10,0.09)]">
      <div
        className={`relative overflow-hidden ${
          isTall ? "h-80 sm:h-[22rem]" : "h-64 sm:h-[19rem]"
        }`}
      >
        <motion.img
          src={product.images[0]}
          alt={product.name}
          className="h-full w-full object-cover object-center"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent opacity-80" />
        <div className="absolute left-5 right-5 top-4 flex items-center justify-between">
          <Badge className="bg-black/65 px-3 py-1 font-['Lato'] text-[11px] uppercase tracking-[0.18em] text-[#F5F1EB] shadow-lg">
            {product.brand}
          </Badge>
          <div className="flex items:center gap-1 rounded-full bg-black/55 px-2 py-1 text-[11px] text-[#F5F1EB] shadow-lg">
            <span className="font-['Lato'] uppercase tracking-[0.16em]">
              {product.rating.toFixed(1)}
            </span>
            <span className="text-[10px]">★</span>
          </div>
        </div>
        <div className="absolute inset-x-4 bottom-4 flex items-end justify-between">
          <div>
            <h3 className="font-['Bodoni_Moda'] text-base font-semibold tracking-wide text-[#F5F1EB]">
              {product.name}
            </h3>
            <p className="mt-1 font-['Lato'] text-xs text-[#F5F1EB]/80">
              {product.category} • from {formatPrice(product.price)}
            </p>
          </div>
          <Button
            size="icon"
            variant="secondary"
            onClick={onQuickView}
            className="h-9 w-9 rounded-full border border-[#F5F1EB]/40 bg-[#F5F1EB]/90 text-neutral-900 shadow-md transition-colors hover:bg-[#BFA06F] hover:text-[#2B2B2B]"
            aria-label="Quick view"
          >
            <Eye className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex flex-wrap items-center gap-1.5">
          {product.tags?.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-[#F5F1EB] px-2 py-0.5 font-['Lato'] text-[10px] uppercase tracking-[0.18em] text-neutral-600"
            >
              {tag}
            </span>
          ))}
        </div>
        <p className="font-['Lato'] text-xs text-neutral-700">
          From {formatPrice(product.price)}
        </p>
      </div>
    </article>
  );
};

interface QuickViewDialogProps {
  state: QuickViewState;
  onOpenChange: (open: boolean) => void;
  selectedSize: string | undefined;
  onSizeChange: (size: string | undefined) => void;
  quantity: number;
  onQuantityChange: (qty: number) => void;
  onAdd: () => void;
}

const QuickViewDialog: React.FC<QuickViewDialogProps> = ({
  state,
  onOpenChange,
  selectedSize,
  onSizeChange,
  quantity,
  onQuantityChange,
  onAdd,
}) => {
  const product = state.product;

  return (
    <Dialog open={state.open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl gap-0 border-[#D9CFC0] bg-[#FDF9F2] p-0 text-[#2B2B2B]">
        {product && (
          <div className="grid gap-0 md:grid-cols:[minmax(0,1.2fr)_minmax(0,1fr)] md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
            <div className="relative overflow-hidden rounded-l-xl bg-black/5">
              <motion.img
                src={product.images[0]}
                alt={product.name}
                className="h-full w-full object-cover object-center"
                initial={{ scale: 1.02, opacity: 0.9 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.6, ease: [0.19, 1, 0.22, 1] }}
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-black/5" />
              <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
                <div>
                  <p className="font-['Lato'] text-[11px] uppercase tracking-[0.2em] text-[#F5F1EB]/90">
                    {product.brand}
                  </p>
                  <h2 className="mt-1 font-['Bodoni_Moda'] text-lg font-semibold tracking-[0.08em] text-[#F5F1EB]">
                    {product.name}
                  </h2>
                </div>
                <div className="rounded-full bg-black/55 px-3 py-1 text-right text-[11px] text-[#F5F1EB]">
                  <p className="font-['Lato'] uppercase tracking-[0.16em]">
                    {formatPrice(product.price)}
                  </p>
                  <p className="mt-0.5 font-['Lato'] text-[10px] text-[#F5F1EB]/80">
                    {product.category}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col p-6">
              <DialogHeader>
                <DialogTitle className="font-['Playfair_Display'] text-base tracking-[0.16em] text-neutral-800">
                  Briefing
                </DialogTitle>
                <DialogDescription className="mt-2 font-['Lato'] text-xs leading-relaxed text-neutral-700">
                  {product.description.slice(0, 210)}{" "}
                  {product.description.length > 210 ? "…" : ""}
                </DialogDescription>
              </DialogHeader>

              <div className="mt-4 flex flex-wrap gap-2 text-[11px] text-neutral-600">
                <span className="rounded-full bg-[#F5F1EB] px-2 py-0.5 font-['Lato'] uppercase tracking-[0.18em]">
                  Rating {product.rating.toFixed(1)} ★
                </span>
                <span className="rounded-full bg-[#F5F1EB] px-2 py-0.5 font-['Lato'] uppercase tracking-[0.18em]">
                  {product.category}
                </span>
                {product.tags?.slice(0, 2).map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-[#F5F1EB] px-2 py-0.5 font-['Lato'] uppercase tracking-[0.18em]"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div className="mt-6 space-y-4">
                <div>
                  <p className="font-['Lato'] text-[11px] font-semibold uppercase tracking-[0.18em] text-neutral-700">
                    Size
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {product.sizes?.map((size) => {
                      const value = String(size);
                      const isSelected = selectedSize === value;
                      return (
                        <button
                          key={value}
                          type="button"
                          onClick={() => onSizeChange(value)}
                          className={`min-w-[3rem] rounded-full border px-3 py-1 text-xs font-['Lato'] uppercase tracking-[0.16em] transition-colors ${
                            isSelected
                              ? "border-[#2B2B2B] bg-[#2B2B2B] text-[#FDF9F2]"
                              : "border-[#D9CFC0] bg-white text-neutral-800 hover:border-[#BFA06F]"
                          }`}
                        >
                          EU {value}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <p className="font-['Lato'] text-[11px] font-semibold uppercase tracking-[0.18em] text-neutral-700">
                    Quantity
                  </p>
                  <div className="mt-2 inline-flex items-center rounded-full border border-[#D9CFC0] bg-white px-2 py-1 text-xs font-['Lato'] text-neutral-800">
                    <button
                      type="button"
                      onClick={() => onQuantityChange(Math.max(1, quantity - 1))}
                      className="h-7 w-7 rounded-full text-center text-sm hover:bg-[#F5F1EB]"
                      aria-label="Decrease quantity"
                    >
                      −
                    </button>
                    <span className="mx-3 w-4 text-center text-xs tracking-[0.16em]">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => onQuantityChange(quantity + 1)}
                      className="h-7 w-7 rounded-full text-center text-sm hover:bg-[#F5F1EB]"
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              <DialogFooter className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="text-sm font-['Lato'] text-neutral-800">
                  <p className="text-[11px] uppercase tracking-[0.2em] text-neutral-500">
                    Investment
                  </p>
                  <p className="mt-1 text-base font-semibold">
                    {formatPrice(product.price * Math.max(1, quantity))}
                  </p>
                </div>
                <Button
                  type="button"
                  disabled={!selectedSize}
                  onClick={onAdd}
                  className="w-full justify-center border-[#2B2B2B] bg-[#2B2B2B] px-6 py-2 font-['Lato'] text-[11px] uppercase tracking-[0.24em] text-[#FDF9F2] shadow-md hover:bg-black sm:w-auto"
                >
                  {selectedSize ? `Add to cart – EU ${selectedSize}` : "Select a size"}
                </Button>
              </DialogFooter>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default CatalogPage;