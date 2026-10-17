import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Filter, SlidersHorizontal, X, Scale, Sparkles, Info } from "lucide-react";
import { toast } from "sonner";
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Input,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/shadcn";
import {
  Product,
  ProductColor,
  ProductStyle,
  Filters,
  getFilteredProducts,
  getArtisans,
  getCart,
  addToCart,
  subscribe,
  unsubscribe,
} from "@/mock";

interface LocalFilters extends Filters {
  style?: ProductStyle | "all";
  color?: ProductColor | "all";
  artisanId?: string | "all";
}

const styleOptions: (ProductStyle | "all")[] = [
  "all",
  "Bridal",
  "Everyday",
  "Festive",
  "Classic",
  "Heritage",
];

const colorOptions: (ProductColor | "all")[] = [
  "all",
  "Ivory",
  "Maroon",
  "Gold",
  "Sand",
  "Black",
  "Indigo",
  "Rose",
];

const CatalogPage: React.FC = () => {
  const [filters, setFilters] = useState<LocalFilters>({
    style: "all",
    color: "all",
    artisanId: "all",
    query: "",
  });

  const [products, setProducts] = useState<Product[]>(() => getFilteredProducts({}));

  const [comparisonOpen, setComparisonOpen] = useState(false);
  const [quickAddOpen, setQuickAddOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedSize, setSelectedSize] = useState<number | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  const artisans = useMemo(() => getArtisans(), []);

  // Sync products with filters
  useEffect(() => {
    const { style, color, artisanId, query } = filters;
    const effectiveFilters: Filters = {
      style: style && style !== "all" ? (style as ProductStyle) : undefined,
      color: color && color !== "all" ? (color as ProductColor) : undefined,
      artisanId: artisanId && artisanId !== "all" ? (artisanId as string) : undefined,
      query: query && query.trim().length > 0 ? query.trim() : undefined,
    };
    const next = getFilteredProducts(effectiveFilters);
    setProducts(next);
  }, [filters.style, filters.color, filters.artisanId, filters.query]);

  // Subscribe to cart changes (for future reactive disabling etc.)
  useEffect(() => {
    const listener = () => {
      // Trigger re-render by touching a dummy state via getCart
      getCart();
    };
    subscribe(listener);
    return () => unsubscribe(listener);
  }, []);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.style && filters.style !== "all") count += 1;
    if (filters.color && filters.color !== "all") count += 1;
    if (filters.artisanId && filters.artisanId !== "all") count += 1;
    if (filters.query && filters.query.trim() !== "") count += 1;
    return count;
  }, [filters]);

  const clearFilter = (key: keyof LocalFilters) => {
    setFilters((prev) => {
      const next = { ...prev };
      if (key === "style" || key === "color" || key === "artisanId") {
        (next as any)[key] = "all";
      } else if (key === "query") {
        next.query = "";
      }
      return next;
    });
  };

  const clearAllFilters = () => {
    setFilters({ style: "all", color: "all", artisanId: "all", query: "" });
  };

  const handleOpenQuickAdd = (product: Product) => {
    setSelectedProduct(product);
    setSelectedSize(product.sizes[0] ?? null);
    setQuickAddOpen(true);
  };

  const handleConfirmQuickAdd = () => {
    if (!selectedProduct || selectedSize == null) return;
    setIsAdding(true);
    try {
      addToCart(selectedProduct.id, selectedSize, 1);
      toast.success("Added to your Jootiya curation", {
        description: `${selectedProduct.name} · Size ${selectedSize}`,
      });
      setQuickAddOpen(false);
    } catch (err) {
      toast.error("Unable to add to cart", {
        description:
          err instanceof Error
            ? err.message
            : "This is a mocked flow in your browser.",
      });
    } finally {
      setIsAdding(false);
    }
  };

  const filteredForComparison = useMemo(() => {
    return products.slice(0, 6);
  }, [products]);

  return (
    <div className="w-full min-h-screen bg-stone-50 dark:bg-stone-900 text-stone-900 dark:text-stone-50 flex flex-col">
      {/* Page header / intro */}
      <section className="w-full border-b border-stone-200/80 dark:border-stone-800/80 bg-gradient-to-b from-stone-50 via-stone-50 to-stone-100 dark:from-stone-950 dark:via-stone-900 dark:to-stone-900">
        <div className="w-full max-w-[1600px] mx-auto px-6 lg:px-12 py-10 lg:py-14 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-3 max-w-2xl">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight font-['Playfair_Display'] text-stone-900 dark:text-stone-50">
              The Jootiya catalog
            </h1>
            <p className="text-sm sm:text-base leading-relaxed text-stone-600 dark:text-stone-300">
              A curated edit of authentic Jodhpur mojris—bridal, festive, and everyday pairs
              carrying the weight of Marwar stories, stitched into soft leather and silk.
              This is a fully mocked, frontend-only experience; all selections live in your
              browser.
            </p>
          </div>

          {/* High-level filter summary */}
          <div className="flex flex-col items-start lg:items-end gap-3">
            <div className="inline-flex items-center gap-2 rounded-full bg-stone-900 text-stone-50 px-4 py-2 shadow-sm">
              <Scale className="h-4 w-4 text-amber-400" />
              <span className="text-xs font-medium tracking-wide uppercase">
                {products.length} mojris curated
              </span>
            </div>
            <div className="flex flex-wrap gap-2 text-xs text-stone-600 dark:text-stone-300">
              <span>Styles: Bridal · Festive · Everyday · Classic · Heritage</span>
            </div>
          </div>
        </div>
      </section>

      {/* Filters + Grid */}
      <section className="w-full flex-1">
        <div className="w-full max-w-[1600px] mx-auto px-6 lg:px-12 py-6 lg:py-8 flex flex-col gap-6">
          {/* Filter bar */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="w-full rounded-2xl border border-stone-200/80 dark:border-stone-800/80 bg-white/90 dark:bg-stone-950/80 backdrop-blur-sm shadow-sm px-4 lg:px-6 py-4 flex flex-col gap-4"
          >
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <div className="inline-flex items-center gap-2 text-xs font-medium tracking-wide uppercase text-stone-500 dark:text-stone-400">
                <Filter className="h-4 w-4" />
                <span>Refine selection</span>
                {activeFilterCount > 0 && (
                  <Badge
                    variant="outline"
                    className="border-amber-500/50 text-amber-700 dark:text-amber-300 bg-amber-50/60 dark:bg-amber-950/40 rounded-full px-2 py-0.5 text-[11px]"
                  >
                    {activeFilterCount} active
                  </Badge>
                )}
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 px-3 text-xs text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-stone-50 hover:bg-stone-100 dark:hover:bg-stone-800"
                  onClick={() => setComparisonOpen((v) => !v)}
                >
                  <Sparkles className="h-3.5 w-3.5 mr-1.5 text-amber-600" />
                  Compare craft details
                </Button>
                {activeFilterCount > 0 && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 px-3 text-xs border-stone-300/80 dark:border-stone-700/80 hover:bg-stone-100 dark:hover:bg-stone-800"
                    onClick={clearAllFilters}
                  >
                    <X className="h-3.5 w-3.5 mr-1" />
                    Clear all
                  </Button>
                )}
              </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-3 lg:items-center lg:justify-between">
              <div className="flex flex-wrap gap-2">
                {/* Style filter */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-9 rounded-full border-stone-300/80 dark:border-stone-600/80 text-xs px-3 flex items-center gap-1.5 hover:border-stone-400 dark:hover:border-stone-400 hover:bg-stone-100/80 dark:hover:bg-stone-800/70"
                    >
                      <SlidersHorizontal className="h-3.5 w-3.5" />
                      <span>Style</span>
                      {filters.style && filters.style !== "all" && (
                        <span className="text-[11px] text-amber-700 dark:text-amber-300 ml-1">
                          {filters.style}
                        </span>
                      )}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="min-w-[140px]">
                    {styleOptions.map((opt) => (
                      <DropdownMenuItem
                        key={opt}
                        onSelect={() => setFilters((prev) => ({ ...prev, style: opt }))}
                        className="text-xs"
                      >
                        {opt === "all" ? "All styles" : opt}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Color filter */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-9 rounded-full border-stone-300/80 dark:border-stone-600/80 text-xs px-3 flex items-center gap-1.5 hover:border-stone-400 dark:hover:border-stone-400 hover:bg-stone-100/80 dark:hover:bg-stone-800/70"
                    >
                      <span className="inline-block h-2.5 w-2.5 rounded-full bg-gradient-to-tr from-amber-500 via-rose-400 to-indigo-500 mr-1" />
                      <span>Color</span>
                      {filters.color && filters.color !== "all" && (
                        <span className="text-[11px] text-amber-700 dark:text-amber-300 ml-1">
                          {filters.color}
                        </span>
                      )}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="min-w-[140px]">
                    {colorOptions.map((opt) => (
                      <DropdownMenuItem
                        key={opt}
                        onSelect={() => setFilters((prev) => ({ ...prev, color: opt }))}
                        className="text-xs"
                      >
                        {opt === "all" ? "All hues" : opt}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Artisan filter */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-9 rounded-full border-stone-300/80 dark:border-stone-600/80 text-xs px-3 flex items-center gap-1.5 hover:border-stone-400 dark:hover:border-stone-400 hover:bg-stone-100/80 dark:hover:bg-stone-800/70"
                    >
                      <span className="inline-block h-2.5 w-2.5 rounded-full bg-stone-900 dark:bg-stone-50 mr-1" />
                      <span>Artisan</span>
                      {filters.artisanId && filters.artisanId !== "all" && (
                        <span className="text-[11px] text-amber-700 dark:text-amber-300 ml-1 max-w-[120px] truncate">
                          {artisans.find((a) => a.id === filters.artisanId)?.name ?? ""}
                        </span>
                      )}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="min-w-[180px]">
                    <DropdownMenuItem
                      onSelect={() => setFilters((prev) => ({ ...prev, artisanId: "all" }))}
                      className="text-xs"
                    >
                      All ateliers
                    </DropdownMenuItem>
                    {artisans.map((artisan) => (
                      <DropdownMenuItem
                        key={artisan.id}
                        onSelect={() =>
                          setFilters((prev) => ({ ...prev, artisanId: artisan.id }))
                        }
                        className="text-xs"
                      >
                        {artisan.atelierName}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="flex-1 flex items-center gap-2 min-w-[220px]">
                <Input
                  value={filters.query ?? ""}
                  onChange={(e) =>
                    setFilters((prev) => ({ ...prev, query: e.target.value }))
                  }
                  placeholder="Search motifs, colors, occasions..."
                  className="h-9 text-sm rounded-full border-stone-300/80 dark:border-stone-700/80 bg-stone-50/80 dark:bg-stone-900/80 focus-visible:ring-amber-500 focus-visible:border-amber-500"
                />
              </div>
            </div>

            {/* Active filter chips */}
            {activeFilterCount > 0 && (
              <div className="flex flex-wrap gap-2 text-xs pt-1">
                {filters.style && filters.style !== "all" && (
                  <Badge
                    variant="outline"
                    className="flex items-center gap-1 rounded-full border-stone-300/80 dark:border-stone-600/80 bg-stone-50/60 dark:bg-stone-900/60 text-stone-700 dark:text-stone-100"
                  >
                    Style: {filters.style}
                    <button
                      type="button"
                      className="ml-0.5 hover:text-amber-700"
                      onClick={() => clearFilter("style")}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                )}
                {filters.color && filters.color !== "all" && (
                  <Badge
                    variant="outline"
                    className="flex items-center gap-1 rounded-full border-stone-300/80 dark:border-stone-600/80 bg-stone-50/60 dark:bg-stone-900/60 text-stone-700 dark:text-stone-100"
                  >
                    Color: {filters.color}
                    <button
                      type="button"
                      className="ml-0.5 hover:text-amber-700"
                      onClick={() => clearFilter("color")}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                )}
                {filters.artisanId && filters.artisanId !== "all" && (
                  <Badge
                    variant="outline"
                    className="flex items-center gap-1 rounded-full border-stone-300/80 dark:border-stone-600/80 bg-stone-50/60 dark:bg-stone-900/60 text-stone-700 dark:text-stone-100 max-w-xs"
                  >
                    Artisan:{" "}
                    {artisans.find((a) => a.id === filters.artisanId)?.atelierName ??
                      filters.artisanId}
                    <button
                      type="button"
                      className="ml-0.5 hover:text-amber-700"
                      onClick={() => clearFilter("artisanId")}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                )}
                {filters.query && filters.query.trim() !== "" && (
                  <Badge
                    variant="outline"
                    className="flex items-center gap-1 rounded-full border-stone-300/80 dark:border-stone-600/80 bg-stone-50/60 dark:bg-stone-900/60 text-stone-700 dark:text-stone-100 max-w-xs"
                  >
                    Query:{" "}
                    <span className="truncate max-w-[120px]">{filters.query}</span>
                    <button
                      type="button"
                      className="ml-0.5 hover:text-amber-700"
                      onClick={() => clearFilter("query")}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                )}
              </div>
            )}
          </motion.div>

          {/* Product grid */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="w-full"
          >
            {products.length === 0 ? (
              <div className="w-full py-16 flex flex-col items-center justify-center text-center gap-3 border border-dashed border-stone-300/80 dark:border-stone-700/80 rounded-3xl bg-stone-50/60 dark:bg-stone-900/40">
                <Info className="h-6 w-6 text-stone-500 mb-1" />
                <p className="text-sm font-medium text-stone-800 dark:text-stone-100">
                  No mojris match this curation yet.
                </p>
                <p className="text-xs text-stone-500 max-w-md">
                  Try softening the filters or searching by a broader mood—"festive", "indigo",
                  or "bridal".
                </p>
                <Button
                  size="sm"
                  variant="outline"
                  className="mt-2 border-stone-300/80 dark:border-stone-600/80 hover:bg-stone-100 dark:hover:bg-stone-800"
                  onClick={clearAllFilters}
                >
                  Reset filters
                </Button>
              </div>
            ) : (
              <div className="grid gap-5 sm:gap-6 md:gap-7 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {products.map((product) => {
                  const artisan = artisans.find((a) => a.id === product.artisanId);
                  return (
                    <motion.div
                      key={product.id}
                      whileHover={{ translateY: -6 }}
                      transition={{ duration: 0.2, ease: "easeOut" }}
                      className="h-full"
                    >
                      <Card className="group h-full flex flex-col overflow-hidden border-stone-200/90 dark:border-stone-800/90 bg-white/95 dark:bg-stone-950/90 shadow-sm hover:shadow-md transition-shadow duration-200">
                        <div className="relative aspect-[4/3] overflow-hidden bg-stone-100 dark:bg-stone-900">
                          <motion.img
                            src={product.heroImage}
                            alt={product.name}
                            className="h-full w-full object-cover object-center"
                            whileHover={{ scale: 1.05 }}
                            transition={{ duration: 0.4, ease: "easeOut" }}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-stone-950/70 via-transparent to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-200" />
                          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between gap-2">
                            <div className="flex flex-col gap-1">
                              <Badge className="w-fit bg-amber-600/90 hover:bg-amber-600 text-[11px] tracking-wide uppercase rounded-full px-2.5 py-0.5">
                                {product.style}
                              </Badge>
                              <span className="text-xs text-stone-100">
                                {artisan?.atelierName ?? "Jodhpur atelier"}
                              </span>
                            </div>
                            <div className="text-right">
                              <span className="block text-sm text-stone-200">
                                ₹ {product.price.toLocaleString("en-IN")}
                              </span>
                              <span className="block text-[11px] text-stone-300">
                                Handcrafted in Jodhpur
                              </span>
                            </div>
                          </div>
                        </div>

                        <CardHeader className="pb-2 px-4 pt-4">
                          <CardTitle className="text-base font-semibold tracking-tight text-stone-900 dark:text-stone-50 line-clamp-2 font-['Playfair_Display']">
                            {product.name}
                          </CardTitle>
                          <CardDescription className="text-xs text-stone-600 dark:text-stone-300 line-clamp-2">
                            {product.description}
                          </CardDescription>
                        </CardHeader>

                        <CardContent className="px-4 pb-3">
                          <div className="flex flex-wrap gap-1.5 mb-2">
                            <Badge
                              variant="outline"
                              className="rounded-full border-amber-500/30 bg-amber-50/60 dark:bg-amber-950/40 text-[11px] text-amber-800 dark:text-amber-300"
                            >
                              {product.color} hue
                            </Badge>
                            <Badge
                              variant="outline"
                              className="rounded-full border-stone-300/80 dark:border-stone-600/80 bg-stone-50/60 dark:bg-stone-900/60 text-[11px] text-stone-700 dark:text-stone-100"
                            >
                              {product.material.split(" ").slice(0, 3).join(" ")}…
                            </Badge>
                            <Badge
                              variant="outline"
                              className="rounded-full border-stone-300/80 dark:border-stone-600/80 bg-stone-50/60 dark:bg-stone-900/60 text-[11px] text-stone-700 dark:text-stone-100"
                            >
                              {product.craftTechnique.split(" ").slice(0, 2).join(" ")}…
                            </Badge>
                          </div>
                          <p className="text-[11px] text-stone-500 dark:text-stone-400 line-clamp-2">
                            "{product.artisanQuote}"
                          </p>
                        </CardContent>

                        <CardFooter className="mt-auto px-4 pb-4 flex items-center justify-between gap-3">
                          <div className="flex flex-col text-[11px] text-stone-500 dark:text-stone-400">
                            <span>
                              Sizes {product.sizes[0]}–
                              {product.sizes[product.sizes.length - 1]}
                            </span>
                            <span className="text-[10px]">
                              Typical break-in: {product.sizingNotes.split(".")[0]}.
                            </span>
                          </div>
                          <Button
                            size="sm"
                            className="h-9 px-3 rounded-full bg-stone-900 hover:bg-stone-800 text-stone-50 text-xs tracking-wide shadow-sm"
                            onClick={() => handleOpenQuickAdd(product)}
                          >
                            Quick add
                          </Button>
                        </CardFooter>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </motion.div>

          {/* Comparison table */}
          {comparisonOpen && filteredForComparison.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 12 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="mt-4 border border-stone-200/80 dark:border-stone-800/80 rounded-2xl bg-white/95 dark:bg-stone-950/90 shadow-sm overflow-hidden"
            >
              <div className="px-4 pt-4 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-amber-600" />
                  <div className="flex flex-col">
                    <span className="text-xs font-medium uppercase tracking-wide text-stone-700 dark:text-stone-100">
                      Craft comparison
                    </span>
                    <span className="text-[11px] text-stone-500 dark:text-stone-400">
                      Top {filteredForComparison.length} matches from this view.
                    </span>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-full text-stone-500 hover:text-stone-900 dark:hover:text-stone-50 hover:bg-stone-100 dark:hover:bg-stone-800"
                  onClick={() => setComparisonOpen(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="mt-2 overflow-x-auto">
                <Table className="min-w-full text-xs">
                  <TableHeader>
                    <TableRow className="border-b-stone-200/80 dark:border-b-stone-800/80">
                      <TableHead className="w-[22%] text-[11px] uppercase tracking-wide text-stone-500 dark:text-stone-400">
                        Mojri
                      </TableHead>
                      <TableHead className="w-[12%] text-[11px] uppercase tracking-wide text-stone-500 dark:text-stone-400">
                        Style
                      </TableHead>
                      <TableHead className="w-[12%] text-[11px] uppercase tracking-wide text-stone-500 dark:text-stone-400">
                        Color
                      </TableHead>
                      <TableHead className="w-[18%] text-[11px] uppercase tracking-wide text-stone-500 dark:text-stone-400">
                        Material
                      </TableHead>
                      <TableHead className="w-[18%] text-[11px] uppercase tracking-wide text-stone-500 dark:text-stone-400">
                        Craft technique
                      </TableHead>
                      <TableHead className="w-[18%] text-[11px] uppercase tracking-wide text-stone-500 dark:text-stone-400 text-right">
                        Artisan
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredForComparison.map((product) => {
                      const artisan = artisans.find((a) => a.id === product.artisanId);
                      return (
                        <TableRow
                          key={product.id}
                          className="border-b-stone-100/80 dark:border-b-stone-800/80 hover:bg-stone-50/80 dark:hover:bg-stone-900/60"
                        >
                          <TableCell className="py-2.5 align-top">
                            <div className="flex flex-col gap-0.5">
                              <span className="text-[13px] font-medium text-stone-900 dark:text-stone-50">
                                {product.name}
                              </span>
                              <span className="text-[11px] text-stone-500 dark:text-stone-400">
                                ₹ {product.price.toLocaleString("en-IN")} · Sizes {" "}
                                {product.sizes[0]}–
                                {product.sizes[product.sizes.length - 1]}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="py-2.5 align-top text-[12px] text-stone-700 dark:text-stone-100">
                            {product.style}
                          </TableCell>
                          <TableCell className="py-2.5 align-top text-[12px] text-stone-700 dark:text-stone-100">
                            {product.color}
                          </TableCell>
                          <TableCell className="py-2.5 align-top text-[11px] text-stone-600 dark:text-stone-300">
                            {product.material}
                          </TableCell>
                          <TableCell className="py-2.5 align-top text-[11px] text-stone-600 dark:text-stone-300">
                            {product.craftTechnique}
                          </TableCell>
                          <TableCell className="py-2.5 align-top text-right text-[11px] text-stone-600 dark:text-stone-300">
                            {artisan?.atelierName ?? "Jodhpur atelier"}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </motion.div>
          )}
        </div>
      </section>

      {/* Quick add size dialog */}
      <Dialog open={quickAddOpen} onOpenChange={setQuickAddOpen}>
        <DialogContent className="max-w-md border-stone-200/80 dark:border-stone-800/80 bg-stone-50/95 dark:bg-stone-950/95">
          {selectedProduct && (
            <>
              <DialogHeader>
                <DialogTitle className="font-['Playfair_Display'] text-lg">
                  Choose your size
                </DialogTitle>
                <DialogDescription className="text-xs text-stone-600 dark:text-stone-300">
                  This is a mocked client-side flow. Your selection is stored only in this
                  browser's localStorage—no order is actually placed.
                </DialogDescription>
              </DialogHeader>

              <div className="mt-3 flex items-start gap-3">
                <div className="h-20 w-24 overflow-hidden rounded-xl bg-stone-200/80 dark:bg-stone-900/80">
                  <motion.img
                    src={selectedProduct.heroImage}
                    alt={selectedProduct.name}
                    className="h-full w-full object-cover object-center"
                    initial={{ scale: 1.02 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.35, ease: "easeOut" }}
                  />
                </div>
                <div className="flex-1 flex flex-col gap-1">
                  <p className="text-sm font-medium text-stone-900 dark:text-stone-50">
                    {selectedProduct.name}
                  </p>
                  <p className="text-xs text-stone-600 dark:text-stone-300">
                    ₹ {selectedProduct.price.toLocaleString("en-IN")} · {selectedProduct.style}
                  </p>
                  <p className="text-[11px] text-stone-500 dark:text-stone-400 line-clamp-2">
                    {selectedProduct.sizingNotes}
                  </p>
                </div>
              </div>

              <div className="mt-4 space-y-2">
                <span className="text-xs font-medium text-stone-700 dark:text-stone-200">
                  Available sizes
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedProduct.sizes.map((size) => {
                    const stock = selectedProduct.stockBySize[String(size)] ?? 0;
                    const isDisabled = stock <= 0;
                    const isActive = selectedSize === size;
                    return (
                      <button
                        key={size}
                        type="button"
                        disabled={isDisabled}
                        onClick={() => setSelectedSize(size)}
                        className={`px-2.5 py-1 rounded-full text-xs border transition-colors ${
                          isActive
                            ? "border-stone-900 bg-stone-900 text-stone-50 dark:border-stone-50 dark:bg-stone-50 dark:text-stone-900"
                            : "border-stone-300/80 dark:border-stone-700/80 bg-transparent text-stone-700 dark:text-stone-100 hover:bg-stone-100 dark:hover:bg-stone-800"
                        } ${isDisabled ? "opacity-40 cursor-not-allowed" : ""}`}
                      >
                        {size}
                      </button>
                    );
                  })}
                </div>
                <p className="text-[11px] text-stone-500 dark:text-stone-400">
                  Stock is mocked for this demo; choosing a size will simply store it in your
                  local cart.
                </p>
              </div>

              <DialogFooter className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="text-[11px] text-stone-500 dark:text-stone-400">
                  You can adjust quantities later in the cart mock.
                </div>
                <div className="flex gap-2 justify-end">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 px-3 border-stone-300/80 dark:border-stone-700/80"
                    onClick={() => setQuickAddOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    className="h-8 px-3 rounded-full bg-stone-900 hover:bg-stone-800 text-stone-50 text-xs"
                    disabled={selectedSize == null || isAdding}
                    onClick={handleConfirmQuickAdd}
                  >
                    {isAdding ? "Adding..." : "Add to cart"}
                  </Button>
                </div>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CatalogPage;