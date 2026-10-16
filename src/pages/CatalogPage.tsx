import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Filter, X, ShoppingBag } from "lucide-react";
import {
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Badge,
  Tabs,
  TabsList,
  TabsTrigger,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  Sheet,
  SheetContent,
  Separator,
} from "@/components/ui/shadcn";
import { Product, ProductVariantKey, formatMoney } from "@/mock";
import { cn } from "@/lib/utils";

export interface CatalogPageProps {
  products: Product[];
  searchValue: string;
  onAddToCart: (productId: string, variant: ProductVariantKey, qty: number) => void;
  onToast: (message: string, type?: "success" | "error" | "info") => void;
  // Optional filter helpers passed from App or derived locally later
  availableBrands?: string[];
  availableSizes?: string[];
  availableColors?: string[];
}

type SortOptionKey = "newest" | "price_asc" | "price_desc";

const sortOptions: { key: SortOptionKey; label: string }[] = [
  { key: "newest", label: "Newest" },
  { key: "price_asc", label: "Price: Low–High" },
  { key: "price_desc", label: "Price: High–Low" },
];

const colorSwatchMap: Record<string, string> = {
  Bone: "bg-stone-200",
  Onyx: "bg-neutral-900",
  Cacao: "bg-amber-900",
  Sand: "bg-stone-300",
  Eclipse: "bg-slate-900",
  Ivory: "bg-stone-100",
  Sable: "bg-neutral-800",
  Crema: "bg-amber-100",
  "Smoked Taupe": "bg-stone-500",
  Smoke: "bg-slate-500",
  Stone: "bg-zinc-400",
  Espresso: "bg-amber-950",
  "Espresso Ombre": "bg-gradient-to-br from-amber-900 to-amber-600",
  Ink: "bg-zinc-900",
  Cloud: "bg-slate-100",
  Obsidian: "bg-black",
  Noir: "bg-neutral-950",
};

const cardMotionProps = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 16 },
  transition: { duration: 0.25, ease: "easeOut" },
};

const filterBarMotion = {
  initial: { opacity: 0, y: -8 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.25, ease: "easeOut" },
};

const sheetMotion = {
  initial: { opacity: 0, x: 40 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 40 },
  transition: { duration: 0.25, ease: "easeOut" },
};

export const CatalogPage: React.FC<CatalogPageProps> = ({
  products,
  searchValue,
  onAddToCart,
  onToast,
  availableBrands,
  availableSizes,
  availableColors,
}) => {
  const brands = useMemo(() => {
    if (availableBrands && availableBrands.length) return ["All", ...availableBrands];
    const set = new Set<string>();
    products.forEach((p) => set.add(p.brand));
    return ["All", ...Array.from(set).sort()];
  }, [products, availableBrands]);

  const allSizes = useMemo(() => {
    if (availableSizes && availableSizes.length) return availableSizes;
    const set = new Set<string>();
    products.forEach((p) => p.sizes.forEach((s) => set.add(s)));
    return Array.from(set).sort((a, b) => {
      const na = parseFloat(a.replace(/[^0-9.]/g, ""));
      const nb = parseFloat(b.replace(/[^0-9.]/g, ""));
      if (isNaN(na) || isNaN(nb)) return a.localeCompare(b);
      return na - nb;
    });
  }, [products, availableSizes]);

  const allColors = useMemo(() => {
    if (availableColors && availableColors.length) return availableColors;
    const set = new Set<string>();
    products.forEach((p) => p.colors.forEach((c) => set.add(c)));
    return Array.from(set).sort();
  }, [products, availableColors]);

  const [brandFilter, setBrandFilter] = useState<string>("All");
  const [sizeFilter, setSizeFilter] = useState<string[]>([]);
  const [colorFilter, setColorFilter] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<SortOptionKey>("newest");

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariantKey | null>(null);
  const [qty, setQty] = useState<number>(1);

  const handleToggleSize = (size: string) => {
    setSizeFilter((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };

  const handleToggleColor = (color: string) => {
    setColorFilter((prev) =>
      prev.includes(color) ? prev.filter((c) => c !== color) : [...prev, color]
    );
  };

  const filteredProducts = useMemo(() => {
    const term = searchValue.trim().toLowerCase();
    let list = products.slice();

    if (brandFilter !== "All") {
      list = list.filter((p) => p.brand === brandFilter);
    }

    if (sizeFilter.length) {
      list = list.filter((p) => p.sizes.some((s) => sizeFilter.includes(s)));
    }

    if (colorFilter.length) {
      list = list.filter((p) => p.colors.some((c) => colorFilter.includes(c)));
    }

    if (term) {
      list = list.filter((p) => {
        const haystack = `${p.name} ${p.brand} ${p.tags.join(" ")}`.toLowerCase();
        return haystack.includes(term);
      });
    }

    list.sort((a, b) => {
      if (sortBy === "newest") {
        return (
          new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime()
        );
      }
      if (sortBy === "price_asc") return a.price - b.price;
      if (sortBy === "price_desc") return b.price - a.price;
      return 0;
    });

    return list;
  }, [products, brandFilter, sizeFilter, colorFilter, searchValue, sortBy]);

  const openSheetForProduct = (product: Product) => {
    setSelectedProduct(product);
    const defaultVariant: ProductVariantKey = {
      size: product.sizes[0],
      color: product.colors[0],
    };
    setSelectedVariant(defaultVariant);
    setQty(1);
  };

  const closeSheet = () => {
    setSelectedProduct(null);
    setSelectedVariant(null);
    setQty(1);
  };

  const handleAddToCart = () => {
    if (!selectedProduct || !selectedVariant) {
      onToast("Please select a size and color.", "error");
      return;
    }
    if (qty < 1) {
      onToast("Quantity must be at least 1.", "error");
      return;
    }
    onAddToCart(selectedProduct.id, selectedVariant, qty);
    onToast("Added to cart", "success");
  };

  const handleVariantSizeSelect = (size: string) => {
    if (!selectedProduct) return;
    const color = selectedVariant?.color ?? selectedProduct.colors[0];
    setSelectedVariant({ size, color });
  };

  const handleVariantColorSelect = (color: string) => {
    if (!selectedProduct) return;
    const size = selectedVariant?.size ?? selectedProduct.sizes[0];
    setSelectedVariant({ size, color });
  };

  const activeSortLabel = sortOptions.find((o) => o.key === sortBy)?.label;

  return (
    <div className="min-h-screen bg-gradient-to-b from-neutral-50 to-stone-100 dark:from-neutral-900 dark:to-neutral-950">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 pb-16 pt-8 sm:px-6 lg:px-8">
        {/* Page heading */}
        <header className="flex flex-col gap-2 border-b border-neutral-200 pb-4 dark:border-neutral-800">
          <p className="text-xs uppercase tracking-[0.2em] text-neutral-500 dark:text-neutral-400">
            The Catalog
          </p>
          <div className="flex flex-wrap items-end justify-between gap-3">
            <h1 className="text-3xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-50 sm:text-4xl md:text-[2.6rem]">
              Footnotes from the Atelier
            </h1>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              {filteredProducts.length} styles curated for you
            </p>
          </div>
        </header>

        {/* Filter + sort bar */}
        <motion.section
          {...filterBarMotion}
          className="flex flex-col gap-3 rounded-2xl border border-neutral-200/80 bg-white/80 p-3 shadow-sm shadow-neutral-200/50 backdrop-blur-sm dark:border-neutral-800/80 dark:bg-neutral-900/80 dark:shadow-black/40 sm:p-4"
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-neutral-500 dark:text-neutral-400">
              <Filter className="h-3 w-3" />
              <span>Refine</span>
            </div>
            {(sizeFilter.length > 0 || colorFilter.length > 0 || brandFilter !== "All") && (
              <button
                type="button"
                onClick={() => {
                  setBrandFilter("All");
                  setSizeFilter([]);
                  setColorFilter([]);
                }}
                className="inline-flex items-center gap-1 text-xs text-neutral-600 underline-offset-4 hover:text-neutral-900 hover:underline dark:text-neutral-300 dark:hover:text-neutral-50"
              >
                <X className="h-3 w-3" />
                Clear all
              </button>
            )}
          </div>

          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            {/* Brand tabs */}
            <Tabs
              value={brandFilter}
              onValueChange={setBrandFilter}
              className="w-full md:w-auto"
            >
              <TabsList className="flex w-full justify-start gap-1 overflow-x-auto rounded-full bg-neutral-100/70 p-1 dark:bg-neutral-800/70">
                {brands.map((brand) => (
                  <TabsTrigger
                    key={brand}
                    value={brand}
                    className="whitespace-nowrap rounded-full px-3 py-1 text-xs font-medium text-neutral-700 ring-offset-neutral-100 data-[state=active]:bg-neutral-900 data-[state=active]:text-neutral-50 data-[state=active]:shadow-sm dark:text-neutral-200 dark:ring-offset-neutral-900 dark:data-[state=active]:bg-neutral-50 dark:data-[state=active]:text-neutral-950"
                  >
                    {brand === "All" ? "All Houses" : brand}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>

            {/* Right-side controls */}
            <div className="flex flex-wrap items-center gap-2">
              {/* Size filter */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="inline-flex items-center gap-2 rounded-full border-neutral-200 bg-white px-3 py-1 text-xs font-medium text-neutral-800 hover:bg-neutral-100 hover:text-neutral-900 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100 dark:hover:bg-neutral-800"
                  >
                    <span>Size</span>
                    {sizeFilter.length > 0 && (
                      <Badge className="rounded-full bg-neutral-900 px-1.5 py-0 text-[0.6rem] font-semibold text-neutral-50 dark:bg-neutral-100 dark:text-neutral-900">
                        {sizeFilter.length}
                      </Badge>
                    )}
                    <ChevronDown className="h-3 w-3 opacity-70" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-52 rounded-2xl border-neutral-200 bg-white/95 p-2 shadow-lg shadow-neutral-200/70 backdrop-blur-sm dark:border-neutral-700 dark:bg-neutral-900/95 dark:shadow-black/60">
                  {allSizes.map((size) => {
                    const active = sizeFilter.includes(size);
                    return (
                      <DropdownMenuItem
                        key={size}
                        onClick={() => handleToggleSize(size)}
                        className={cn(
                          "flex cursor-pointer items-center justify-between rounded-xl px-2 py-1.5 text-xs text-neutral-800 focus:bg-neutral-100 dark:text-neutral-100 dark:focus:bg-neutral-800",
                          active &&
                            "bg-neutral-900 text-neutral-50 dark:bg-neutral-100 dark:text-neutral-900"
                        )}
                      >
                        <span>{size}</span>
                        {active && (
                          <span className="text-[0.65rem] uppercase tracking-[0.18em]">
                            Selected
                          </span>
                        )}
                      </DropdownMenuItem>
                    );
                  })}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Color filter */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="inline-flex items-center gap-2 rounded-full border-neutral-200 bg-white px-3 py-1 text-xs font-medium text-neutral-800 hover:bg-neutral-100 hover:text-neutral-900 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100 dark:hover:bg-neutral-800"
                  >
                    <span>Color</span>
                    {colorFilter.length > 0 && (
                      <Badge className="rounded-full bg-neutral-900 px-1.5 py-0 text-[0.6rem] font-semibold text-neutral-50 dark:bg-neutral-100 dark:text-neutral-900">
                        {colorFilter.length}
                      </Badge>
                    )}
                    <ChevronDown className="h-3 w-3 opacity-70" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-60 rounded-2xl border-neutral-200 bg-white/95 p-2 shadow-lg shadow-neutral-200/70 backdrop-blur-sm dark:border-neutral-700 dark:bg-neutral-900/95 dark:shadow-black/60">
                  <div className="grid grid-cols-2 gap-1">
                    {allColors.map((color) => {
                      const active = colorFilter.includes(color);
                      const swatchClass = colorSwatchMap[color] ?? "bg-neutral-500";
                      return (
                        <DropdownMenuItem
                          key={color}
                          onClick={() => handleToggleColor(color)}
                          className={cn(
                            "flex cursor-pointer items-center gap-2 rounded-xl px-2 py-1.5 text-xs text-neutral-800 focus:bg-neutral-100 dark:text-neutral-100 dark:focus:bg-neutral-800",
                            active &&
                              "bg-neutral-900 text-neutral-50 dark:bg-neutral-100 dark:text-neutral-900"
                          )}
                        >
                          <span
                            className={cn(
                              "h-4 w-4 rounded-full border border-black/10 shadow-sm shadow-black/10 dark:border-white/10 dark:shadow-black/40",
                              swatchClass
                            )}
                          />
                          <span className="truncate">{color}</span>
                        </DropdownMenuItem>
                      );
                    })}
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Sort */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="inline-flex items-center gap-2 rounded-full border-neutral-200 bg-white px-3 py-1 text-xs font-medium text-neutral-800 hover:bg-neutral-100 hover:text-neutral-900 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100 dark:hover:bg-neutral-800"
                  >
                    <span>{activeSortLabel}</span>
                    <ChevronDown className="h-3 w-3 opacity-70" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-44 rounded-2xl border-neutral-200 bg-white/95 p-1 shadow-lg shadow-neutral-200/70 backdrop-blur-sm dark:border-neutral-700 dark:bg-neutral-900/95 dark:shadow-black/60">
                  {sortOptions.map((opt) => (
                    <DropdownMenuItem
                      key={opt.key}
                      onClick={() => setSortBy(opt.key)}
                      className={cn(
                        "flex cursor-pointer items-center justify-between rounded-xl px-2 py-1.5 text-xs text-neutral-800 focus:bg-neutral-100 dark:text-neutral-100 dark:focus:bg-neutral-800",
                        sortBy === opt.key &&
                          "bg-neutral-900 text-neutral-50 dark:bg-neutral-100 dark:text-neutral-900"
                      )}
                    >
                      <span>{opt.label}</span>
                      {sortBy === opt.key && (
                        <span className="text-[0.65rem] uppercase tracking-[0.18em]">
                          Active
                        </span>
                      )}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </motion.section>

        {/* Masonry grid */}
        {filteredProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-4 rounded-3xl border border-dashed border-neutral-300 bg-white/60 p-10 text-center dark:border-neutral-700 dark:bg-neutral-900/60">
            <p className="text-sm uppercase tracking-[0.2em] text-neutral-500 dark:text-neutral-400">
              Nothing found
            </p>
            <p className="max-w-md text-sm text-neutral-700 dark:text-neutral-200">
              We couldn&apos;t locate a pair that matches this composition. Loosen a filter or
              clear the search to rediscover the full collection.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setBrandFilter("All");
                setSizeFilter([]);
                setColorFilter([]);
              }}
              className="rounded-full border-neutral-800 px-5 text-xs font-semibold tracking-wide text-neutral-900 hover:bg-neutral-900 hover:text-neutral-50 dark:border-neutral-200 dark:text-neutral-50 dark:hover:bg-neutral-100 dark:hover:text-neutral-900"
            >
              Reset composition
            </Button>
          </div>
        ) : (
          <section className="mt-2">
            {/* Asymmetric columns: 3 on lg, 2 on md, 1 on small */}
            <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
              <AnimatePresence>
                {filteredProducts.map((product, index) => {
                  const primaryImage = product.images.find((img) => img.isPrimary) ??
                    product.images[0];
                  const tall =
                    product.category === "boot" || product.category === "high-top";

                  return (
                    <motion.div
                      key={product.id}
                      {...cardMotionProps}
                      transition={{ ...cardMotionProps.transition, delay: index * 0.03 }}
                      className={cn(
                        "mb-4 break-inside-avoid",
                        tall ? "sm:pb-6" : "sm:pb-3"
                      )}
                    >
                      <Card
                        className="group relative flex h-full cursor-pointer flex-col overflow-hidden rounded-3xl border border-neutral-200/80 bg-white/90 shadow-sm shadow-neutral-200/60 ring-0 transition-[background-color,box-shadow,border-color] hover:border-neutral-900/70 hover:shadow-lg hover:shadow-neutral-300/80 dark:border-neutral-800/80 dark:bg-neutral-950/90 dark:shadow-black/50 dark:hover:border-neutral-50/80"
                        onClick={() => openSheetForProduct(product)}
                      >
                        <CardHeader className="relative overflow-hidden p-0">
                          <div className="relative aspect-[4/5] w-full overflow-hidden">
                            <motion.img
                              src={primaryImage?.url}
                              alt={primaryImage?.alt}
                              className="h-full w-full object-cover transition-[filter,transform,opacity] duration-500 ease-out group-hover:scale-[1.03] group-hover:brightness-105 dark:group-hover:brightness-110"
                              whileHover={{ scale: 1.03 }}
                            />
                            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-neutral-950/70 via-neutral-950/0 to-neutral-950/10 opacity-70 mix-blend-multiply" />
                            <div className="absolute left-4 top-4 flex flex-col gap-1">
                              {product.badges.slice(0, 2).map((badge) => (
                                <Badge
                                  key={badge}
                                  className="w-fit rounded-full border border-amber-200/60 bg-amber-50/80 px-2 py-0.5 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-amber-900 shadow-sm shadow-amber-100/80 backdrop-blur-sm dark:border-amber-500/50 dark:bg-amber-500/15 dark:text-amber-100 dark:shadow-black/50"
                                >
                                  {badge}
                                </Badge>
                              ))}
                            </div>
                            <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
                              <div className="max-w-[70%]">
                                <p className="text-[0.7rem] uppercase tracking-[0.22em] text-neutral-200/90">
                                  {product.brand}
                                </p>
                                <CardTitle className="mt-1 text-base font-semibold text-neutral-50">
                                  {product.name}
                                </CardTitle>
                              </div>
                              <div className="rounded-full bg-neutral-950/80 px-3 py-1 text-[0.7rem] font-medium text-neutral-50 shadow-sm shadow-black/40 backdrop-blur-sm dark:bg-black/80">
                                {formatMoney(product.price, product.currency)}
                              </div>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="flex flex-1 flex-col gap-3 p-4">
                          <CardDescription className="line-clamp-3 text-xs leading-relaxed text-neutral-600 dark:text-neutral-300">
                            {product.description}
                          </CardDescription>
                          <div className="mt-auto flex items-center justify-between gap-3 pt-2">
                            <div className="flex flex-wrap items-center gap-1.5">
                              {product.colors.slice(0, 3).map((c) => (
                                <span
                                  key={c}
                                  className={cn(
                                    "h-4 w-4 rounded-full border border-black/10 shadow-sm shadow-black/10 dark:border-white/10 dark:shadow-black/40",
                                    colorSwatchMap[c] ?? "bg-neutral-500"
                                  )}
                                  title={c}
                                />
                              ))}
                              {product.colors.length > 3 && (
                                <span className="text-[0.65rem] text-neutral-500 dark:text-neutral-400">
                                  +{product.colors.length - 3}
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-[0.68rem] uppercase tracking-[0.2em] text-neutral-500 dark:text-neutral-400">
                                {product.category}
                              </span>
                              <Separator className="h-4 w-px bg-neutral-200 dark:bg-neutral-700" />
                              <span className="text-[0.68rem] text-neutral-500 dark:text-neutral-400">
                                EU {product.sizes[0]}–{product.sizes[product.sizes.length - 1]}
                              </span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          </section>
        )}

        {/* Product detail slide-over sheet */}
        <Sheet open={!!selectedProduct} onOpenChange={(open) => !open && closeSheet()}>
          <SheetContent
            side="right"
            className="w-full max-w-md border-l border-neutral-200 bg-neutral-50/95 p-0 shadow-2xl shadow-neutral-400/70 backdrop-blur-xl dark:border-neutral-800 dark:bg-neutral-950/95 dark:shadow-black/80 sm:max-w-lg"
          >
            <AnimatePresence mode="wait">
              {selectedProduct && (
                <motion.div
                  key={selectedProduct.id}
                  {...sheetMotion}
                  className="flex h-full flex-col overflow-hidden"
                >
                  <div className="flex items-center justify-between border-b border-neutral-200 px-5 py-3 dark:border-neutral-800">
                    <div className="flex flex-col">
                      <p className="text-[0.68rem] uppercase tracking-[0.2em] text-neutral-500 dark:text-neutral-400">
                        {selectedProduct.brand}
                      </p>
                      <h2 className="text-lg font-semibold tracking-tight text-neutral-900 dark:text-neutral-50">
                        {selectedProduct.name}
                      </h2>
                    </div>
                    <button
                      type="button"
                      onClick={closeSheet}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-neutral-200 bg-white text-neutral-700 shadow-sm transition-colors hover:border-neutral-900 hover:bg-neutral-900 hover:text-neutral-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:border-neutral-50 dark:hover:bg-neutral-50 dark:hover:text-neutral-950"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="flex-1 overflow-y-auto px-5 pb-5 pt-3">
                    {/* Gallery */}
                    <div className="flex flex-col gap-3">
                      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-100 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
                        <img
                          src={
                            selectedProduct.images.find((img) => img.isPrimary)?.url ??
                            selectedProduct.images[0]?.url
                          }
                          alt={
                            selectedProduct.images.find((img) => img.isPrimary)?.alt ??
                            selectedProduct.images[0]?.alt
                          }
                          className="h-full w-full object-cover"
                        />
                        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-black/0 to-black/10 mix-blend-multiply" />
                        <div className="absolute bottom-3 left-3 rounded-full bg-neutral-950/80 px-3 py-1 text-[0.7rem] font-medium text-neutral-50 shadow-sm shadow-black/50 backdrop-blur-sm dark:bg-black/80">
                          {formatMoney(
                            selectedProduct.price,
                            selectedProduct.currency
                          )}
                        </div>
                      </div>

                      {selectedProduct.images.length > 1 && (
                        <div className="flex gap-2 overflow-x-auto pb-1">
                          {selectedProduct.images.map((img) => (
                            <button
                              key={img.url}
                              type="button"
                              onClick={() => {
                                const nextImages = [
                                  img,
                                  ...selectedProduct.images.filter((i) => i.url !== img.url),
                                ];
                                selectedProduct.images.splice(0, nextImages.length, ...nextImages);
                              }}
                              className="group relative aspect-video h-20 flex-shrink-0 overflow-hidden rounded-xl border border-neutral-200 bg-neutral-100 shadow-sm transition-colors hover:border-neutral-900 dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-neutral-50"
                            >
                              <img
                                src={img.url}
                                alt={img.alt}
                                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                              />
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Editorial copy */}
                    <div className="mt-4 space-y-3">
                      <p className="text-xs uppercase tracking-[0.2em] text-neutral-500 dark:text-neutral-400">
                        Notes from the studio
                      </p>
                      <p className="text-sm leading-relaxed text-neutral-800 dark:text-neutral-200">
                        {selectedProduct.editorialCopy}
                      </p>

                      <div className="grid gap-3 rounded-2xl border border-neutral-200 bg-white/80 p-3 text-xs shadow-sm shadow-neutral-200/60 dark:border-neutral-800 dark:bg-neutral-950/80 dark:shadow-black/60">
                        <div className="flex items-start justify-between gap-3">
                          <span className="text-neutral-500 dark:text-neutral-400">
                            Materials
                          </span>
                          <span className="max-w-[60%] text-right text-neutral-800 dark:text-neutral-200">
                            {selectedProduct.materials.join(", ")}
                          </span>
                        </div>
                        <Separator className="bg-neutral-200 dark:bg-neutral-800" />
                        <div className="flex items-center justify-between gap-3">
                          <span className="text-neutral-500 dark:text-neutral-400">
                            Origin
                          </span>
                          <span className="text-neutral-800 dark:text-neutral-200">
                            {selectedProduct.origin}
                          </span>
                        </div>
                        <div className="flex items-center justify-between gap-3">
                          <span className="text-neutral-500 dark:text-neutral-400">
                            Release
                          </span>
                          <span className="text-neutral-800 dark:text-neutral-200">
                            {new Date(
                              selectedProduct.releaseDate
                            ).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "short",
                            })}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Variant selection */}
                    <div className="mt-5 space-y-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <p className="text-xs uppercase tracking-[0.2em] text-neutral-500 dark:text-neutral-400">
                            Size
                          </p>
                          <p className="text-[0.7rem] text-neutral-500 dark:text-neutral-400">
                            EU {selectedProduct.sizes[0]}–{
                              selectedProduct.sizes[selectedProduct.sizes.length - 1]
                            }
                          </p>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {selectedProduct.sizes.map((size) => {
                            const active = selectedVariant?.size === size;
                            return (
                              <button
                                key={size}
                                type="button"
                                onClick={() => handleVariantSizeSelect(size)}
                                className={cn(
                                  "min-w-[2.4rem] rounded-full border px-2 py-1 text-[0.72rem] font-medium uppercase tracking-[0.14em] text-neutral-800 transition-colors hover:border-neutral-900 hover:bg-neutral-900 hover:text-neutral-50 dark:text-neutral-100 dark:hover:border-neutral-50 dark:hover:bg-neutral-50 dark:hover:text-neutral-900",
                                  active
                                    ? "border-neutral-900 bg-neutral-900 text-neutral-50 dark:border-neutral-50 dark:bg-neutral-50 dark:text-neutral-900"
                                    : "border-neutral-200 bg-white/80 dark:border-neutral-700 dark:bg-neutral-900/70"
                                )}
                              >
                                {size}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <p className="text-xs uppercase tracking-[0.2em] text-neutral-500 dark:text-neutral-400">
                          Color
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {selectedProduct.colors.map((color) => {
                            const active = selectedVariant?.color === color;
                            const swatchClass = colorSwatchMap[color] ?? "bg-neutral-500";
                            return (
                              <button
                                key={color}
                                type="button"
                                onClick={() => handleVariantColorSelect(color)}
                                className={cn(
                                  "inline-flex items-center gap-2 rounded-full border px-2 py-1 pr-3 text-[0.72rem] font-medium text-neutral-800 transition-colors hover:border-neutral-900 hover:bg-neutral-900 hover:text-neutral-50 dark:text-neutral-100 dark:hover:border-neutral-50 dark:hover:bg-neutral-50 dark:hover:text-neutral-900",
                                  active
                                    ? "border-neutral-900 bg-neutral-900 text-neutral-50 dark:border-neutral-50 dark:bg-neutral-50 dark:text-neutral-900"
                                    : "border-neutral-200 bg-white/80 dark:border-neutral-700 dark:bg-neutral-900/70"
                                )}
                              >
                                <span
                                  className={cn(
                                    "h-4 w-4 rounded-full border border-black/10 shadow-sm shadow-black/10 dark:border-white/10 dark:shadow-black/40",
                                    swatchClass
                                  )}
                                />
                                <span>{color}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      <div className="flex items-center justify-between gap-3 pt-1">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setQty((q) => Math.max(1, q - 1))}
                            className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-neutral-200 bg-white text-sm font-medium text-neutral-800 hover:border-neutral-900 hover:bg-neutral-900 hover:text-neutral-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100 dark:hover:border-neutral-50 dark:hover:bg-neutral-50 dark:hover:text-neutral-900"
                          >
                            -
                          </button>
                          <span className="min-w-[2ch] text-center text-sm font-medium text-neutral-900 dark:text-neutral-50">
                            {qty}
                          </span>
                          <button
                            type="button"
                            onClick={() => setQty((q) => q + 1)}
                            className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-neutral-200 bg-white text-sm font-medium text-neutral-800 hover:border-neutral-900 hover:bg-neutral-900 hover:text-neutral-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100 dark:hover:border-neutral-50 dark:hover:bg-neutral-50 dark:hover:text-neutral-900"
                          >
                            +
                          </button>
                        </div>
                        <div className="text-right text-sm font-semibold text-neutral-900 dark:text-neutral-50">
                          {selectedProduct
                            ? formatMoney(
                                selectedProduct.price * qty,
                                selectedProduct.currency
                              )
                            : null}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-neutral-200 bg-white/90 px-5 py-3 shadow-[0_-8px_20px_rgba(0,0,0,0.04)] backdrop-blur-sm dark:border-neutral-800 dark:bg-neutral-950/90 dark:shadow-black/60">
                    <Button
                      type="button"
                      onClick={handleAddToCart}
                      className="flex w-full items-center justify-center gap-2 rounded-full bg-neutral-900 px-4 py-2 text-sm font-semibold text-neutral-50 shadow-sm shadow-neutral-900/40 hover:bg-neutral-800 dark:bg-neutral-50 dark:text-neutral-950 dark:shadow-black/60 dark:hover:bg-neutral-200"
                    >
                      <ShoppingBag className="h-4 w-4" />
                      Add to bag
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
};

export default CatalogPage;