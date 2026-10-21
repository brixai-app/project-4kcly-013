import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Filter, RotateCcw } from "lucide-react";
import { Button, Badge, Card, CardHeader, CardTitle, CardDescription, CardContent, Separator, DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/shadcn";
import { cn } from "@/lib/utils";
import { ColorOption, useCatalog, CatalogFilters, MOCK_ARTISANS } from "@/mock";
import ProductCard from "@/components/ProductCard";

// NOTE: This page uses fully mocked catalog data and client-side filtering
// from src/mock.ts only. There is no backend. All interactions are
// purely frontend.

const COLOR_LABELS: Record<ColorOption, string> = {
  "deep-indigo": "Deep Indigo",
  "warm-ochre": "Warm Ochre",
  "sand-beige": "Sand Beige",
  marigold: "Marigold",
};

interface LocalFilters {
  size?: string;
  color?: ColorOption;
  artisanId?: string;
}

const CatalogPage: React.FC = () => {
  const [filters, setFilters] = useState<LocalFilters>({});

  const { products: filteredProducts, artisans, allSizes, allColors } = useCatalog(
    filters as CatalogFilters,
  );

  const hasActiveFilters = useMemo(
    () => Boolean(filters.size || filters.color || filters.artisanId),
    [filters],
  );

  const activeArtisan = useMemo(
    () => MOCK_ARTISANS.find((a) => a.id === filters.artisanId),
    [filters.artisanId],
  );

  const handleReset = () => {
    setFilters({});
  };

  const handleSizeChange = (value?: string) => {
    setFilters((prev) => ({ ...prev, size: value || undefined }));
  };

  const handleColorChange = (value?: ColorOption) => {
    setFilters((prev) => ({ ...prev, color: value || undefined }));
  };

  const handleArtisanChange = (value?: string) => {
    setFilters((prev) => ({ ...prev, artisanId: value || undefined }));
  };

  // Split products into a staggered three-column layout for desktop,
  // collapsing to one/two columns on smaller screens.
  const { col1, col2, col3 } = useMemo(() => {
    const c1: typeof filteredProducts = [];
    const c2: typeof filteredProducts = [];
    const c3: typeof filteredProducts = [];
    filteredProducts.forEach((p, index) => {
      if (index % 3 === 0) c1.push(p);
      else if (index % 3 === 1) c2.push(p);
      else c3.push(p);
    });
    return { col1: c1, col2: c2, col3: c3 };
  }, [filteredProducts]);

  return (
    <div className="w-full min-h-screen bg-[#f5f0e8] text-slate-900">
      {/* Page header / intro */}
      <section className="w-full border-b border-slate-200/70 bg-gradient-to-b from-[#f5f0e8] to-[#f0e6d9]">
        <div className="w-full max-w-[1600px] mx-auto px-6 lg:px-12 py-10 lg:py-14 flex flex-col gap-6">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 min-w-0">
            <div className="min-w-0">
              <p className="uppercase tracking-[0.25em] text-xs text-slate-500 mb-3">
                Catalog
              </p>
              <h1 className="font-['Playfair_Display'] text-3xl sm:text-4xl lg:text-5xl leading-tight text-slate-900 whitespace-normal break-words">
                Rajasthani Mojris, Curated for the Modern Mehfil
              </h1>
              <p className="mt-4 max-w-2xl text-sm sm:text-base text-slate-700 leading-relaxed">
                An intimate edit of handcrafted mojris shaped in Jaipur and Jodhpur ateliers.
                Filter by size, color and artisan to find the pair that feels written just for you.
              </p>
            </div>

            {/* Filter panel */}
            <Card className="lg:max-w-md bg-white/70 backdrop-blur-sm border-slate-200 shadow-sm">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between w-full gap-2">
                  <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4 text-slate-500" />
                    <CardTitle className="text-sm font-semibold tracking-wide text-slate-900 uppercase">
                      Refine Selection
                    </CardTitle>
                  </div>
                  {hasActiveFilters && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-full text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                      onClick={handleReset}
                      aria-label="Reset filters"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </Button>
                  )}
                </div>
                <CardDescription className="text-xs text-slate-600 mt-1">
                  These filters work fully on the client using mocked catalog data.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Size filter */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between w-full">
                    <span className="text-xs font-medium tracking-wide text-slate-700 uppercase">
                      Size
                    </span>
                    {filters.size && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 px-2 text-[11px] text-slate-600 hover:text-slate-900"
                        onClick={() => handleSizeChange(undefined)}
                      >
                        Clear
                      </Button>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2.5">
                    {allSizes.map((size) => {
                      const active = filters.size === size;
                      return (
                        <button
                          key={size}
                          type="button"
                          onClick={() => handleSizeChange(active ? undefined : size)}
                          className={cn(
                            "rounded-full px-4 py-1.5 border text-xs font-medium flex items-center gap-1.5 transition-colors",
                            "border-slate-300 text-slate-700 bg-white/80 hover:bg-slate-900/5",
                            active &&
                              "border-indigo-700 bg-indigo-800/10 text-indigo-900",
                          )}
                        >
                          <span>{size}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <Separator className="bg-slate-200/80" />

                {/* Color filter */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between w-full">
                    <span className="text-xs font-medium tracking-wide text-slate-700 uppercase">
                      Color Story
                    </span>
                    {filters.color && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 px-2 text-[11px] text-slate-600 hover:text-slate-900"
                        onClick={() => handleColorChange(undefined)}
                      >
                        Clear
                      </Button>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2.5">
                    {allColors.map((color) => {
                      const active = filters.color === color;
                      return (
                        <button
                          key={color}
                          type="button"
                          onClick={() => handleColorChange(active ? undefined : color)}
                          className={cn(
                            "rounded-full px-4 py-1.5 border text-xs font-medium flex items-center gap-2 transition-colors",
                            "border-slate-300 text-slate-700 bg-white/80 hover:bg-slate-900/5",
                            active &&
                              "border-amber-700 bg-amber-700/10 text-amber-900",
                          )}
                        >
                          <span
                            className={cn(
                              "w-3 h-3 rounded-full border border-white shadow-sm",
                              color === "deep-indigo" && "bg-indigo-900",
                              color === "warm-ochre" && "bg-amber-700",
                              color === "sand-beige" && "bg-amber-200",
                              color === "marigold" && "bg-orange-500",
                            )}
                          />
                          <span>{COLOR_LABELS[color]}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <Separator className="bg-slate-200/80" />

                {/* Artisan filter */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between w-full">
                    <span className="text-xs font-medium tracking-wide text-slate-700 uppercase">
                      Artisan Atelier
                    </span>
                    {filters.artisanId && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 px-2 text-[11px] text-slate-600 hover:text-slate-900"
                        onClick={() => handleArtisanChange(undefined)}
                      >
                        Clear
                      </Button>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2.5 items-center">
                    {artisans.map((artisan) => {
                      const active = filters.artisanId === artisan.id;
                      return (
                        <button
                          key={artisan.id}
                          type="button"
                          onClick={() =>
                            handleArtisanChange(active ? undefined : artisan.id)
                          }
                          className={cn(
                            "rounded-full px-4 py-1.5 border text-xs font-medium flex items-center gap-2 transition-colors",
                            "border-slate-300 text-slate-700 bg-white/80 hover:bg-slate-900/5",
                            active &&
                              "border-slate-900 bg-slate-900 text-amber-100",
                          )}
                        >
                          <span className="inline-flex h-6 w-6 rounded-full bg-slate-900/90 text-[10px] font-semibold text-amber-100 items-center justify-center">
                            {artisan.name
                              .split(" ")
                              .map((p) => p[0])
                              .join("")}
                          </span>
                          <span>{artisan.name}</span>
                          <span className="text-[10px] uppercase tracking-wide text-slate-500">
                            {artisan.region.split(",")[0]}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {hasActiveFilters && activeArtisan && (
                  <div className="pt-3 border-t border-dashed border-slate-200/80 mt-1 space-y-1">
                    <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
                      Viewing edit from
                    </p>
                    <p className="font-['Playfair_Display'] text-sm text-slate-900">
                      {activeArtisan.name}
                    </p>
                    <p className="text-[11px] text-slate-600">
                      {activeArtisan.craftNotes}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Active filters summary & sort (sort is illustrative only, client-side) */}
      <section className="w-full border-b border-slate-200/70 bg-[#f5f0e8]/90">
        <div className="w-full max-w-[1600px] mx-auto px-6 lg:px-12 py-4 flex flex-col md:flex-row md:items-center justify-between gap-3 min-w-0">
          <div className="flex flex-wrap items-center gap-2 min-w-0">
            <span className="text-xs font-medium tracking-wide text-slate-700 uppercase">
              {filteredProducts.length} styles curated
            </span>
            {hasActiveFilters && (
              <>
                <Separator orientation="vertical" className="h-5 bg-slate-300/80" />
                <div className="flex flex-wrap gap-2">
                  {filters.size && (
                    <Badge
                      variant="outline"
                      className="rounded-full border-slate-300 text-xs px-3 py-1 bg-white/80"
                    >
                      Size: {filters.size}
                    </Badge>
                  )}
                  {filters.color && (
                    <Badge
                      variant="outline"
                      className="rounded-full border-slate-300 text-xs px-3 py-1 bg-white/80 flex items-center gap-1.5"
                    >
                      <span
                        className={cn(
                          "w-2.5 h-2.5 rounded-full border border-white shadow-sm",
                          filters.color === "deep-indigo" && "bg-indigo-900",
                          filters.color === "warm-ochre" && "bg-amber-700",
                          filters.color === "sand-beige" && "bg-amber-200",
                          filters.color === "marigold" && "bg-orange-500",
                        )}
                      />
                      <span>{COLOR_LABELS[filters.color]}</span>
                    </Badge>
                  )}
                  {filters.artisanId && activeArtisan && (
                    <Badge
                      variant="outline"
                      className="rounded-full border-slate-300 text-xs px-3 py-1 bg-white/80"
                    >
                      Artisan: {activeArtisan.name}
                    </Badge>
                  )}
                </div>
              </>
            )}
          </div>

          <div className="flex items-center gap-2 justify-end">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-9 rounded-full border-slate-300 bg-white/80 text-xs font-medium text-slate-700 hover:bg-slate-100"
                >
                  Sort: Featured
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="min-w-[180px]">
                <DropdownMenuItem className="text-xs text-slate-800">
                  Featured (default)
                </DropdownMenuItem>
                <DropdownMenuItem className="text-xs text-slate-700">
                  Price: Low to High (mock)
                </DropdownMenuItem>
                <DropdownMenuItem className="text-xs text-slate-700">
                  Price: High to Low (mock)
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </section>

      {/* Catalog grid section */}
      <section className="w-full bg-[#f5f0e8] pb-16 pt-8">
        <div className="w-full max-w-[1600px] mx-auto px-6 lg:px-12">
          {filteredProducts.length === 0 ? (
            <div className="py-16 flex flex-col items-center justify-center text-center gap-4">
              <p className="font-['Playfair_Display'] text-2xl text-slate-900">
                This edit is momentarily empty.
              </p>
              <p className="max-w-md text-sm text-slate-700 leading-relaxed">
                We couldn't find mojris matching this exact combination. Try easing one of the
                filters or explore the full catalog to discover more silhouettes.
              </p>
              <Button
                variant="outline"
                className="mt-2 rounded-full border-slate-400 bg-white px-6 text-xs font-semibold tracking-wide text-slate-800 hover:bg-slate-900 hover:text-amber-50"
                onClick={handleReset}
              >
                Clear all filters
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8 items-start">
              {/* For smaller screens, a simple grid; for desktop we use staggered vertical rhythm
                  via varied motion/spacing per column. */}

              {/* Column 1 */}
              <div className="flex flex-col gap-6 min-w-0">
                {col1.map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.06 }}
                    className={cn(
                      index % 2 === 0 ? "mt-0" : "mt-4 md:mt-6 xl:mt-8",
                    )}
                  >
                    <ProductCard product={product} featured={index === 0} />
                  </motion.div>
                ))}
              </div>

              {/* Column 2 */}
              <div className="flex flex-col gap-6 min-w-0">
                {col2.map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.12 + index * 0.06 }}
                    className={cn(
                      index % 2 === 0 ? "mt-3 md:mt-6" : "mt-0",
                    )}
                  >
                    <ProductCard product={product} />
                  </motion.div>
                ))}
              </div>

              {/* Column 3 */}
              <div className="flex flex-col gap-6 min-w-0">
                {col3.map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.18 + index * 0.06 }}
                    className={cn(
                      index % 2 === 0 ? "mt-6 xl:mt-10" : "mt-1 md:mt-4",
                    )}
                  >
                    <ProductCard product={product} />
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default CatalogPage;