import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Info, Quote, ArrowLeft, Sparkles } from "lucide-react";
import { toast } from "sonner";

import {
  Button,
  Badge,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  Avatar,
  AvatarImage,
  AvatarFallback,
  Input,
  Separator,
} from "@/components/ui/shadcn";

import {
  Product,
  Artisan,
  getProductById,
  getArtisanById,
  addToCart,
  subscribe,
  unsubscribe,
} from "@/mock";

// NOTE: This page is 100% frontend-only and uses mocked data & state helpers
// from src/mock.ts. There is NO backend; all cart operations are stored in
// browser localStorage through the mock layer.

const accentBurgundy = "#7b2222"; // for inline styles when needed

export const DetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [product, setProduct] = useState<Product | null>(null);
  const [artisan, setArtisan] = useState<Artisan | null>(null);
  const [selectedSize, setSelectedSize] = useState<number | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [artisanOpen, setArtisanOpen] = useState<boolean>(false);

  // Load product + artisan on mount / id change
  useEffect(() => {
    if (!id) return;
    const p = getProductById(id);
    setProduct(p ?? null);
    if (p) {
      const a = getArtisanById(p.artisanId);
      setArtisan(a ?? null);
      if (p.sizes && p.sizes.length > 0) {
        setSelectedSize(p.sizes[0]);
      }
    }
  }, [id]);

  // Subscribe to global mock pub/sub so cart-triggered re-renders stay aligned
  useEffect(() => {
    const listener = () => {
      // no-op for now, but this keeps us wired into global state changes
      // to make future enhancements (like low-stock banners) reactive.
      setProduct((prev) => (prev ? { ...prev } : prev));
    };
    subscribe(listener);
    return () => unsubscribe(listener);
  }, []);

  const maxQtyForSelectedSize = useMemo(() => {
    if (!product || selectedSize == null) return 1;
    const key = String(selectedSize);
    const stock = product.stockBySize?.[key] ?? 0;
    return stock > 0 ? Math.min(stock, 10) : 0; // cap max qty at 10 for UI sanity
  }, [product, selectedSize]);

  const handleQtyChange = (value: string) => {
    const parsed = parseInt(value.replace(/[^0-9]/g, ""), 10);
    if (isNaN(parsed)) {
      setQuantity(1);
      return;
    }
    if (parsed < 1) {
      setQuantity(1);
    } else if (maxQtyForSelectedSize > 0 && parsed > maxQtyForSelectedSize) {
      setQuantity(maxQtyForSelectedSize);
    } else {
      setQuantity(parsed);
    }
  };

  const handleAddToCart = () => {
    if (!product) return;
    if (selectedSize == null) {
      toast.error("Choose your mojri size before adding to cart.");
      return;
    }
    if (maxQtyForSelectedSize === 0) {
      toast.error("This size is currently handcrafted to order and marked as unavailable.");
      return;
    }

    addToCart(product.id, selectedSize, quantity);

    toast.success("Added to your Jootiya tray.", {
      description: `${product.name} · Size ${selectedSize} · Qty ${quantity}`,
      action: {
        label: "View cart",
        onClick: () => navigate("/checkout"),
      },
    });
  };

  if (!product) {
    return (
      <div className="w-full min-h-[70vh] bg-neutral-100 dark:bg-neutral-950 flex flex-col items-center justify-center px-6 lg:px-12">
        <div className="max-w-[800px] w-full text-center space-y-6">
          <h1 className="text-3xl md:text-4xl tracking-tight font-['Playfair_Display'] text-neutral-900 dark:text-neutral-50">
            This pair slipped out of our courtyard.
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400 text-base md:text-lg">
            The mojri you were looking for is no longer on this shelf. Explore the catalog to
            discover other handcrafted pairs from Jodhpur ateliers.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Button
              variant="outline"
              onClick={() => navigate(-1)}
              className="border-neutral-400/70 text-neutral-800 dark:text-neutral-100 hover:bg-neutral-200/60 dark:hover:bg-neutral-800/70 rounded-full px-6"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Go back
            </Button>
            <Button
              onClick={() => navigate("/catalog")}
              className="rounded-full px-6 bg-[rgba(107,33,33,0.95)] hover:bg-[rgba(127,29,29,1)] text-amber-50 shadow-sm"
            >
              Browse all mojris
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const heroImage = product.heroImage || product.images?.[0];
  const artisanInitials = artisan?.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <div className="w-full min-h-screen bg-neutral-100 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-50 flex flex-col">
      {/* Hero Section */}
      <motion.section
        className="relative w-full min-h-[70vh] overflow-hidden bg-neutral-900"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        {heroImage && (
          <div className="absolute inset-0">
            <img
              src={heroImage}
              alt={product.name}
              className="w-full h-full object-cover object-center scale-105 md:scale-100"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/40 to-neutral-900/40" />
          </div>
        )}

        <div className="relative w-full max-w-[1600px] mx-auto px-6 lg:px-12 py-16 md:py-24 flex flex-col justify-end min-h-[70vh]">
          <div className="max-w-2xl space-y-6">
            <div className="inline-flex items-center gap-2 mb-2">
              <Badge className="bg-amber-100/90 text-amber-900 border border-amber-200/70 font-medium tracking-wide uppercase text-[10px] rounded-full px-3 py-1">
                Handcrafted in Jodhpur
              </Badge>
              <Badge className="bg-neutral-900/80 text-amber-100 border border-amber-500/60 font-semibold rounded-full px-3 py-1">
                {product.style}
              </Badge>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-['Playfair_Display'] tracking-tight text-amber-50 drop-shadow-md">
              {product.name}
            </h1>

            <p className="max-w-xl text-sm md:text-base text-neutral-200/90 leading-relaxed">
              {product.description}
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-neutral-300 mb-1">
                  Investment
                </p>
                <p className="text-2xl md:text-3xl font-semibold text-amber-100">
                  ₹{product.price.toLocaleString("en-IN")} <span className="text-xs ml-1 opacity-80">{product.currency}</span>
                </p>
              </div>

              <Separator orientation="vertical" className="hidden sm:block h-12 bg-neutral-500/60" />

              <div className="flex flex-col gap-1 text-xs md:text-sm text-neutral-200/90">
                <span>
                  {product.originCity}, {product.originState}
                </span>
                {artisan && (
                  <span className="inline-flex items-center gap-1">
                    by <span className="font-medium">{artisan.atelierName}</span>
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Main body */}
      <section className="w-full py-10 md:py-14 bg-neutral-100 dark:bg-neutral-950">
        <div className="w-full max-w-[1600px] mx-auto px-6 lg:px-12 grid gap-10 lg:gap-16 lg:grid-cols-[minmax(0,1.7fr)_minmax(0,1.1fr)] items-start">
          {/* Left column: story & details */}
          <div className="space-y-10">
            {/* Cultural heritage block */}
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full bg-neutral-900/5 dark:bg-neutral-100/5 px-3 py-1 border border-neutral-200/70 dark:border-neutral-800/80">
                <Sparkles className="h-3.5 w-3.5 text-[rgba(127,29,29,0.95)]" />
                <span className="uppercase tracking-[0.18em] text-[10px] text-neutral-700 dark:text-neutral-300">
                  Cultural story
                </span>
              </div>

              <blockquote className="relative pl-6 md:pl-8 py-3 border-l-2 border-[rgba(120,53,15,0.9)] text-sm md:text-base text-neutral-800 dark:text-neutral-100 leading-relaxed">
                <Quote className="absolute -left-3 md:-left-4 -top-2 h-5 w-5 text-[rgba(120,53,15,0.8)] bg-neutral-100 dark:bg-neutral-950 rounded-full p-0.5 shadow-sm" />
                <p className="mb-3 italic">{product.culturalHeritage}</p>
                <p className="text-xs md:text-sm text-neutral-600 dark:text-neutral-400 flex items-center gap-2">
                  <span>Authenticity note:</span>
                  <span className="font-medium text-neutral-800 dark:text-neutral-200">{product.authenticity}</span>
                </p>
              </blockquote>

              {product.artisanQuote && (
                <p className="text-xs md:text-sm text-neutral-600 dark:text-neutral-400 flex items-start gap-2">
                  <span className="mt-[3px] text-[rgba(120,53,15,0.9)]">—</span>
                  <span className="italic">“{product.artisanQuote}”</span>
                </p>
              )}
            </div>

            {/* Materials & craft technique */}
            <div className="space-y-6">
              <div className="flex items-center justify-between gap-4">
                <h2 className="text-lg md:text-xl font-['Playfair_Display'] tracking-tight text-neutral-900 dark:text-neutral-50">
                  Material & craft
                </h2>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-3">
                  <p className="text-xs uppercase tracking-[0.16em] text-neutral-500 dark:text-neutral-400">
                    Material story
                  </p>
                  <p className="text-sm md:text-base text-neutral-800 dark:text-neutral-100 leading-relaxed">
                    {product.material}
                  </p>
                </div>
                <div className="space-y-3">
                  <p className="text-xs uppercase tracking-[0.16em] text-neutral-500 dark:text-neutral-400">
                    Craft technique
                  </p>
                  <p className="text-sm md:text-base text-neutral-800 dark:text-neutral-100 leading-relaxed">
                    {product.craftTechnique}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 pt-1">
                {product.tags?.slice(0, 6).map((tag) => (
                  <Badge
                    key={tag}
                    variant="outline"
                    className="border-neutral-300/80 dark:border-neutral-700/80 bg-neutral-50/60 dark:bg-neutral-900/60 text-[11px] font-normal tracking-wide rounded-full px-3 py-1"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Care & sizing */}
            <div className="space-y-6">
              <h2 className="text-lg md:text-xl font-['Playfair_Display'] tracking-tight text-neutral-900 dark:text-neutral-50">
                Care & fit
              </h2>

              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-3">
                  <p className="text-xs uppercase tracking-[0.16em] text-neutral-500 dark:text-neutral-400">
                    Care ritual
                  </p>
                  <p className="text-sm md:text-base text-neutral-800 dark:text-neutral-100 leading-relaxed">
                    {product.care}
                  </p>
                </div>
                <div className="space-y-3">
                  <p className="text-xs uppercase tracking-[0.16em] text-neutral-500 dark:text-neutral-400">
                    Sizing notes
                  </p>
                  <p className="text-sm md:text-base text-neutral-800 dark:text-neutral-100 leading-relaxed">
                    {product.sizingNotes}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right column: purchase panel & artisan */}
          <aside className="space-y-8 lg:space-y-10 lg:pl-4 xl:pl-8">
            {/* Purchase panel */}
            <div className="rounded-3xl border border-neutral-200/80 dark:border-neutral-800/80 bg-white/80 dark:bg-neutral-900/90 shadow-[0_18px_45px_rgba(15,23,42,0.16)] backdrop-blur-sm p-5 md:p-6">
              <div className="flex items-start justify-between gap-3 mb-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-neutral-500 dark:text-neutral-400 mb-1">
                    Reserve your pair
                  </p>
                  <p className="text-xl md:text-2xl font-semibold text-neutral-900 dark:text-neutral-50">
                    ₹{product.price.toLocaleString("en-IN")} {product.currency}
                  </p>
                </div>
                <Badge className="bg-[rgba(127,29,29,0.97)] text-amber-50 rounded-full px-3 py-1 text-[11px] tracking-wide">
                  Made to small batch
                </Badge>
              </div>

              {/* Size selector */}
              <div className="space-y-3 mb-5">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-xs uppercase tracking-[0.16em] text-neutral-600 dark:text-neutral-400">
                    Select size (EU)
                  </p>
                  <span className="text-[11px] text-neutral-500 dark:text-neutral-400 flex items-center gap-1">
                    <Info className="h-3.5 w-3.5" />
                    No left-right; moulds to your feet with wear
                  </span>
                </div>

                <Tabs
                  value={selectedSize != null ? String(selectedSize) : undefined}
                  onValueChange={(val) => setSelectedSize(parseInt(val, 10))}
                  className="w-full"
                >
                  <TabsList className="grid grid-cols-4 gap-1 bg-neutral-100/80 dark:bg-neutral-900/80 rounded-2xl p-1">
                    {product.sizes.map((size) => {
                      const stock = product.stockBySize?.[String(size)] ?? 0;
                      const isLow = stock > 0 && stock <= 3;
                      const isOut = stock === 0;
                      return (
                        <TabsTrigger
                          key={size}
                          value={String(size)}
                          disabled={isOut}
                          className="flex flex-col items-center justify-center rounded-xl border border-transparent data-[state=active]:border-[rgba(127,29,29,0.95)] data-[state=active]:bg-white dark:data-[state=active]:bg-neutral-950 text-xs md:text-sm py-2.5 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                          <span className="font-medium">{size}</span>
                          <span className="mt-0.5 text-[10px] text-neutral-500 dark:text-neutral-400">
                            {isOut ? "Waitlist" : isLow ? "Few left" : "In atelier"}
                          </span>
                        </TabsTrigger>
                      );
                    })}
                  </TabsList>

                  {product.sizes.map((size) => {
                    const stock = product.stockBySize?.[String(size)] ?? 0;
                    return (
                      <TabsContent key={size} value={String(size)} className="mt-2">
                        <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                          {stock === 0
                            ? "Currently being freshly crafted. We will notify you when this size is back on the shelf."
                            : stock <= 3
                            ? `Only ${stock} pair${stock > 1 ? "s" : ""} ready to ship from Jodhpur.`
                            : "Handcrafted in a limited batch. Ready to dispatch from Jodhpur."}
                        </p>
                      </TabsContent>
                    );
                  })}
                </Tabs>
              </div>

              {/* Quantity & CTA */}
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex flex-col gap-1">
                    <span className="text-xs uppercase tracking-[0.16em] text-neutral-600 dark:text-neutral-400">
                      Quantity
                    </span>
                    <div className="flex items-center gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 rounded-full border-neutral-300/80 dark:border-neutral-700/80 text-neutral-800 dark:text-neutral-100"
                        onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                        disabled={quantity <= 1}
                      >
                        −
                      </Button>
                      <Input
                        value={quantity.toString()}
                        onChange={(e) => handleQtyChange(e.target.value)}
                        className="w-14 h-9 text-center rounded-full border-neutral-300/80 dark:border-neutral-700/80 bg-neutral-50/80 dark:bg-neutral-900/80 focus-visible:ring-neutral-400 dark:focus-visible:ring-neutral-600 text-sm"
                        inputMode="numeric"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 rounded-full border-neutral-300/80 dark:border-neutral-700/80 text-neutral-800 dark:text-neutral-100"
                        onClick={() => setQuantity((q) => (maxQtyForSelectedSize ? Math.min(maxQtyForSelectedSize, q + 1) : q + 1))}
                        disabled={maxQtyForSelectedSize !== 0 && quantity >= maxQtyForSelectedSize}
                      >
                        +
                      </Button>
                    </div>
                  </div>
                  <div className="text-right space-y-1">
                    <p className="text-xs uppercase tracking-[0.16em] text-neutral-500 dark:text-neutral-400">
                      Estimated total
                    </p>
                    <p className="text-base md:text-lg font-semibold text-neutral-900 dark:text-neutral-50">
                      ₹{(product.price * quantity).toLocaleString("en-IN")} {product.currency}
                    </p>
                  </div>
                </div>

                <motion.div whileHover={{ y: -1 }} whileTap={{ y: 0 }} transition={{ type: "spring", stiffness: 260, damping: 20 }}>
                  <Button
                    className="w-full rounded-full h-11 md:h-12 text-sm md:text-base font-medium bg-[rgba(127,29,29,0.98)] hover:bg-[rgba(153,27,27,1)] text-amber-50 shadow-[0_16px_32px_rgba(127,29,29,0.45)] flex items-center justify-center gap-2"
                    type="button"
                    onClick={handleAddToCart}
                  >
                    Add to handcrafted tray
                  </Button>
                </motion.div>

                <p className="text-[11px] text-neutral-500 dark:text-neutral-400 leading-relaxed">
                  This is a fully mocked, frontend-only experience. Your selection is kept safely
                  in your browser using localStorage so you can continue exploring without losing
                  your Jootiya tray.
                </p>
              </div>
            </div>

            {/* Artisan card & dialog */}
            {artisan && (
              <div className="rounded-3xl border border-neutral-200/80 dark:border-neutral-800/80 bg-white/70 dark:bg-neutral-900/90 shadow-[0_12px_32px_rgba(15,23,42,0.16)] p-5 md:p-6 flex flex-col gap-4">
                <div className="flex items-center gap-4">
                  <Avatar className="h-12 w-12 rounded-full border border-neutral-200/80 dark:border-neutral-700/80">
                    <AvatarImage src={artisan.avatarUrl} alt={artisan.name} />
                    <AvatarFallback className="bg-neutral-800 text-amber-100 text-sm font-medium">
                      {artisanInitials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs uppercase tracking-[0.16em] text-neutral-500 dark:text-neutral-400 mb-0.5">
                      Artisan
                    </p>
                    <p className="text-sm md:text-base font-medium text-neutral-900 dark:text-neutral-50 truncate">
                      {artisan.name}
                    </p>
                    <p className="text-xs text-neutral-600 dark:text-neutral-400 line-clamp-1">
                      {artisan.atelierName} · {artisan.location}
                    </p>
                  </div>
                  <Badge className="bg-neutral-900 text-amber-100 rounded-full px-3 py-1 text-[10px] tracking-wide">
                    {artisan.yearsOfCraft}+ yrs
                  </Badge>
                </div>

                <p className="text-xs md:text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed">
                  {artisan.bioShort}
                </p>

                <Dialog open={artisanOpen} onOpenChange={setArtisanOpen}>
                  <div className="flex items-center justify-between gap-3 pt-1">
                    <Button
                      type="button"
                      variant="outline"
                      className="rounded-full px-4 h-9 text-xs md:text-sm border-neutral-300/80 dark:border-neutral-700/80 text-neutral-800 dark:text-neutral-100 hover:bg-neutral-100/70 dark:hover:bg-neutral-800/80"
                      onClick={() => setArtisanOpen(true)}
                    >
                      Meet the artisan
                    </Button>
                    <span className="text-[11px] text-neutral-500 dark:text-neutral-400">
                      {artisan.specialties.slice(0, 2).join(" · ")}
                    </span>
                  </div>

                  <DialogContent className="max-w-2xl w-[96vw] md:w-[90vw] bg-neutral-50/95 dark:bg-neutral-950/95 border border-neutral-200/80 dark:border-neutral-800/80 backdrop-blur-md rounded-3xl overflow-hidden">
                    <DialogHeader>
                      <DialogTitle className="font-['Playfair_Display'] text-xl md:text-2xl tracking-tight text-neutral-900 dark:text-neutral-50 flex items-center gap-3">
                        <Avatar className="h-9 w-9 border border-neutral-200/80 dark:border-neutral-700/80">
                          <AvatarImage src={artisan.avatarUrl} alt={artisan.name} />
                          <AvatarFallback className="bg-neutral-800 text-amber-100 text-xs font-medium">
                            {artisanInitials}
                          </AvatarFallback>
                        </Avatar>
                        {artisan.name}
                      </DialogTitle>
                      <DialogDescription className="text-xs md:text-sm text-neutral-600 dark:text-neutral-400 flex flex-col md:flex-row md:items-center md:justify-between gap-1 md:gap-3">
                        <span>{artisan.atelierName}</span>
                        <span>{artisan.location}</span>
                      </DialogDescription>
                    </DialogHeader>

                    <div className="mt-4 space-y-6 max-h-[60vh] overflow-y-auto pr-1">
                      <div className="space-y-3">
                        <p className="text-xs uppercase tracking-[0.16em] text-neutral-500 dark:text-neutral-400">
                          Atelier story
                        </p>
                        <p className="text-sm md:text-base text-neutral-800 dark:text-neutral-100 leading-relaxed">
                          {artisan.bioLong}
                        </p>
                      </div>

                      <Separator className="bg-neutral-200/80 dark:bg-neutral-800/80" />

                      <div className="space-y-3">
                        <p className="text-xs uppercase tracking-[0.16em] text-neutral-500 dark:text-neutral-400">
                          Making process
                        </p>
                        <ol className="space-y-3 md:space-y-4 text-sm md:text-base">
                          {artisan.makingProcessSteps.map((step, index) => (
                            <li key={index} className="relative pl-7 md:pl-8 text-neutral-800 dark:text-neutral-100">
                              <span
                                className="absolute left-0 mt-0.5 flex h-5 w-5 items-center justify-center rounded-full border border-[rgba(120,53,15,0.8)] bg-amber-50/90 dark:bg-neutral-900 text-[11px] font-semibold"
                                style={{ color: accentBurgundy }}
                              >
                                {index + 1}
                              </span>
                              {step}
                            </li>
                          ))}
                        </ol>
                      </div>

                      {artisan.sustainabilityNotes && (
                        <div className="space-y-2 pt-2">
                          <p className="text-xs uppercase tracking-[0.16em] text-neutral-500 dark:text-neutral-400">
                            Sustainability notes
                          </p>
                          <p className="text-sm text-neutral-800 dark:text-neutral-100 leading-relaxed">
                            {artisan.sustainabilityNotes}
                          </p>
                        </div>
                      )}
                    </div>

                    <DialogFooter className="pt-3 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                      <div className="flex flex-wrap gap-2 text-[11px] text-neutral-500 dark:text-neutral-400">
                        {artisan.awards.slice(0, 2).map((award) => (
                          <Badge
                            key={award}
                            variant="outline"
                            className="border-neutral-300/80 dark:border-neutral-700/80 bg-neutral-50/80 dark:bg-neutral-900/80 rounded-full px-3 py-1"
                          >
                            {award}
                          </Badge>
                        ))}
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        className="rounded-full px-4 h-9 border-neutral-300/80 dark:border-neutral-700/80 text-neutral-800 dark:text-neutral-100 hover:bg-neutral-100/80 dark:hover:bg-neutral-800/80"
                        onClick={() => setArtisanOpen(false)}
                      >
                        Close atelier view
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            )}
          </aside>
        </div>
      </section>
    </div>
  );
};

export default DetailPage;