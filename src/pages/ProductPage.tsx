import React, { useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Star, StarHalf, ChevronLeft, ChevronRight, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  Badge,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  Input,
} from "@/components/ui/shadcn";

import {
  Product,
  Review,
  getProductById,
  addToCart,
  formatPrice,
  formatDate,
} from "@/mock";

// NOTE: This entire page works against a fully client-side mock data layer
// implemented in src/mock.ts. There is NO backend – all cart operations,
// product lookup, and persistence are done in-memory with localStorage mocks.

const GOLD = "#BFA06F";

const imageVariants = {
  enter: { opacity: 0, x: 40 },
  center: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -40 },
};

function getInitials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase() ?? "")
    .join("");
}

interface StarRatingProps {
  rating: number;
  size?: number;
}

const StarRating: React.FC<StarRatingProps> = ({ rating, size = 18 }) => {
  const full = Math.floor(rating);
  const hasHalf = rating - full >= 0.25 && rating - full < 0.85;
  const empty = 5 - full - (hasHalf ? 1 : 0);

  return (
    <div className="flex items-center gap-1" aria-label={`Rated ${rating.toFixed(
      1
    )} out of 5`}>
      {Array.from({ length: full }).map((_, i) => (
        <Star
          key={`full-${i}`}
          size={size}
          className="text-[${GOLD}] fill-[${GOLD}]"
        />
      ))}
      {hasHalf && (
        <StarHalf size={size} className={`text-[${GOLD}] fill-[${GOLD}]`} />
      )}
      {Array.from({ length: empty }).map((_, i) => (
        <Star
          key={`empty-${i}`}
          size={size}
          className="text-neutral-400 dark:text-neutral-600"
        />
      ))}
    </div>
  );
};

const ProductPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const product: Product | undefined = useMemo(() => {
    if (!id) return undefined;
    return getProductById(id);
  }, [id]);

  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string | undefined>();
  const [quantity, setQuantity] = useState<number>(1);
  const [sizeError, setSizeError] = useState<string | null>(null);

  if (!product) {
    return (
      <main className="min-h-[60vh] bg-[#F5F1EB] dark:bg-neutral-950 text-neutral-900 dark:text-neutral-50 px-4 sm:px-6 lg:px-10 pt-28 pb-16">
        <div className="max-w-5xl mx-auto">
          <Button
            variant="ghost"
            className="mb-6 px-0 text-sm text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-neutral-50"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>
          <Card className="border border-neutral-200/70 dark:border-neutral-800 bg-white/70 dark:bg-neutral-900/70 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="font-['Playfair_Display'] text-2xl tracking-tight">
                Piece not found
              </CardTitle>
              <CardDescription className="text-neutral-600 dark:text-neutral-400">
                The pair you were seeking has either been archived or never existed.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <p className="text-sm text-neutral-700 dark:text-neutral-300 max-w-xl">
                Explore the catalog to discover our current curation of sneakers, boots, loafers, and sandals – each crafted in limited runs.
              </p>
              <Button
                onClick={() => navigate("/catalog")}
                className="rounded-full bg-[${GOLD}] hover:bg-[#a98a57] text-neutral-900 px-6 py-2 text-sm font-medium tracking-wide"
              >
                Browse catalog
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    );
  }

  const images = product.images && product.images.length > 0 ? product.images : [
    "https://images.unsplash.com/photo-1514986888952-8cd320577b68?auto=format&fit=crop&w=1600&q=80",
  ];

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % images.length);
  };

  const handleSelectSize = (size: string) => {
    setSelectedSize(size);
    setSizeError(null);
  };

  const handleChangeQuantity = (value: string) => {
    const num = Number(value.replace(/[^0-9]/g, ""));
    if (!num) {
      setQuantity(1);
      return;
    }
    setQuantity(Math.min(5, Math.max(1, num)));
  };

  const handleAddToCart = () => {
    const result = addToCart(product.id, selectedSize, quantity);
    if (!result.success) {
      if (result.error?.toLowerCase().includes("size")) {
        setSizeError(result.error);
      }
      toast.error(result.error ?? "Unable to add to cart.");
      return;
    }
    toast.success("Added to cart", {
      description: `${product.name} • ${selectedSize} • ${quantity} pair${quantity > 1 ? "s" : ""}`,
    });
  };

  const canAdd = Boolean(selectedSize) && quantity >= 1 && quantity <= 5;

  return (
    <main className="min-h-screen bg-[#F5F1EB] dark:bg-neutral-950 text-neutral-900 dark:text-neutral-50 px-4 sm:px-6 lg:px-10 pt-24 pb-16">
      <div className="max-w-6xl mx-auto">
        <Button
          variant="ghost"
          className="mb-6 px-0 text-sm text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-neutral-50"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to discovery
        </Button>

        <section className="grid lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] gap-10 lg:gap-16 items-start">
          {/* Image gallery */}
          <div>
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-3xl bg-neutral-200/80 dark:bg-neutral-900/80 border border-neutral-200/70 dark:border-neutral-800 shadow-[0_22px_45px_rgba(0,0,0,0.14)]">
              <AnimatePresence initial={false} custom={activeIndex}>
                <motion.img
                  key={activeIndex}
                  src={images[activeIndex]}
                  alt={product.name}
                  className="h-full w-full object-cover"
                  variants={imageVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ type: "spring", stiffness: 220, damping: 28, opacity: { duration: 0.35 } }}
                />
              </AnimatePresence>

              <div className="absolute inset-x-5 top-5 flex items-center justify-between">
                <Badge className="rounded-full bg-neutral-900/70 text-neutral-50 text-[11px] tracking-[0.18em] uppercase border border-white/10 px-3 py-1 backdrop-blur">
                  {product.category}
                </Badge>
                <span className="rounded-full bg-white/80 dark:bg-neutral-900/80 text-[11px] tracking-[0.22em] uppercase text-neutral-800 dark:text-neutral-200 px-3 py-1 border border-neutral-200/70 dark:border-neutral-700 backdrop-blur font-medium">
                  {product.brand}
                </span>
              </div>

              {images.length > 1 && (
                <div className="absolute inset-y-0 left-0 right-0 flex items-center justify-between px-4">
                  <button
                    type="button"
                    onClick={handlePrev}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-neutral-900/55 text-neutral-50 border border-white/20 backdrop-blur hover:bg-neutral-900/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-900 focus-visible:ring-neutral-50/70 transition-colors"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={handleNext}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-neutral-900/55 text-neutral-50 border border-white/20 backdrop-blur hover:bg-neutral-900/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-900 focus-visible:ring-neutral-50/70 transition-colors"
                    aria-label="Next image"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              )}

              <div className="absolute bottom-4 inset-x-5 flex items-end justify-between gap-4">
                <div className="flex flex-col gap-1">
                  <p className="text-[11px] uppercase tracking-[0.22em] text-neutral-200/90">
                    Jootiya Edition
                  </p>
                  <p className="text-[13px] text-neutral-50/90 max-w-xs leading-snug">
                    Limited-run silhouette, curated for gallery floors, hotel lobbies, and late checkouts.
                  </p>
                </div>
                {images.length > 1 && (
                  <div className="flex gap-2 bg-neutral-900/40 px-2 py-1.5 rounded-full border border-white/15 backdrop-blur">
                    {images.map((src, i) => (
                      <button
                        key={src + i}
                        type="button"
                        onClick={() => setActiveIndex(i)}
                        className={`h-8 w-8 overflow-hidden rounded-full border transition-colors ${
                          i === activeIndex
                            ? "border-[" + GOLD + "]"
                            : "border-transparent opacity-70 hover:opacity-100"
                        }`}
                        aria-label={`View image ${i + 1}`}
                      >
                        <img
                          src={src}
                          alt="Thumbnail"
                          className="h-full w-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {images.length > 1 && (
              <div className="mt-4 hidden sm:flex gap-3 overflow-x-auto pb-1">
                {images.map((src, i) => (
                  <button
                    key={src + i}
                    type="button"
                    onClick={() => setActiveIndex(i)}
                    className={`relative flex-shrink-0 h-20 w-20 overflow-hidden rounded-2xl border transition-all duration-200 ${
                      i === activeIndex
                        ? "border-[" + GOLD + "] shadow-md"
                        : "border-neutral-200/80 dark:border-neutral-800 hover:border-neutral-400 dark:hover:border-neutral-500"
                    }`}
                  >
                    <img src={src} alt={`${product.name} angle ${i + 1}`} className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product info & actions */}
          <div className="space-y-8">
            <section className="space-y-3">
              <p className="text-xs tracking-[0.32em] uppercase text-neutral-500 dark:text-neutral-400">
                {product.brand}
              </p>
              <h1 className="font-['Bodoni_Moda'] text-3xl sm:text-4xl lg:text-5xl leading-tight tracking-tight text-neutral-900 dark:text-neutral-50">
                {product.name}
              </h1>
              <div className="flex flex-wrap items-center gap-3 text-sm">
                <div className="flex items-center gap-2">
                  <StarRating rating={product.rating} />
                  <span className="text-neutral-700 dark:text-neutral-300 text-xs">
                    {product.rating.toFixed(1)} • {product.reviews.length} review
                    {product.reviews.length !== 1 && "s"}
                  </span>
                </div>
                <span className="h-5 w-px bg-neutral-300 dark:bg-neutral-700" aria-hidden="true" />
                <span className="text-xs uppercase tracking-[0.22em] text-neutral-600 dark:text-neutral-400">
                  {product.category}
                </span>
              </div>
            </section>

            <section className="flex items-end justify-between gap-6">
              <div className="space-y-1">
                <p className="text-[11px] uppercase tracking-[0.28em] text-neutral-500 dark:text-neutral-400">
                  Investment
                </p>
                <p className="text-2xl sm:text-3xl font-semibold text-neutral-900 dark:text-neutral-50">
                  {formatPrice(product.price)}
                </p>
                <p className="text-xs text-neutral-600 dark:text-neutral-400">
                  Inclusive of duties. Crafted in limited batches.
                </p>
              </div>
              <div className="text-right">
                <p className="text-[11px] uppercase tracking-[0.28em] text-neutral-500 dark:text-neutral-400">
                  Dispatch window
                </p>
                <p className="text-xs text-neutral-700 dark:text-neutral-300">
                  Ships within 2–3 business days worldwide.
                </p>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="font-['Playfair_Display'] text-base tracking-tight text-neutral-900 dark:text-neutral-50">
                Select your composition
              </h2>

              {/* Size selector */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-xs text-neutral-700 dark:text-neutral-300">
                    Size (US)
                  </p>
                  <button
                    type="button"
                    className="text-[11px] underline underline-offset-2 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100"
                  >
                    View size guide
                  </button>
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className={`w-full justify-between rounded-full border px-4 py-2 h-11 text-sm bg-white/80 dark:bg-neutral-900/80 hover:bg-white dark:hover:bg-neutral-900 ${
                        sizeError ? "border-red-500/80" : "border-neutral-300 dark:border-neutral-700"
                      }`}
                    >
                      <span className={selectedSize ? "text-neutral-900 dark:text-neutral-50" : "text-neutral-500"}>
                        {selectedSize ? `US ${selectedSize}` : "Select size"}
                      </span>
                      <ChevronDownIcon />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56 bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 rounded-2xl p-1.5 shadow-xl">
                    {product.sizes.map((size) => (
                      <DropdownMenuItem
                        key={size}
                        className="text-sm rounded-xl cursor-pointer flex items-center justify-between px-3 py-2.5 focus:bg-neutral-100 dark:focus:bg-neutral-800"
                        onClick={() => handleSelectSize(size)}
                      >
                        <span className="text-neutral-900 dark:text-neutral-50">US {size}</span>
                        {selectedSize === size && (
                          <span className={`h-1.5 w-1.5 rounded-full bg-[${GOLD}]`} />
                        )}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>

                {sizeError && (
                  <p className="text-[11px] text-red-600 mt-1">{sizeError}</p>
                )}

                <p className="text-[11px] text-neutral-600 dark:text-neutral-400">
                  All pairs are engineered for a glove-like fit. If between sizes, we recommend sizing up.
                </p>
              </div>

              {/* Quantity */}
              <div className="space-y-1">
                <p className="text-xs text-neutral-700 dark:text-neutral-300">Quantity</p>
                <div className="flex items-center gap-3">
                  <Input
                    value={quantity}
                    onChange={(e) => handleChangeQuantity(e.target.value)}
                    className="w-20 rounded-full border-neutral-300 dark:border-neutral-700 bg-white/80 dark:bg-neutral-900/80 text-center text-sm"
                    inputMode="numeric"
                    min={1}
                    max={5}
                  />
                  <p className="text-[11px] text-neutral-600 dark:text-neutral-400">
                    Limit 5 pairs per client.
                  </p>
                </div>
              </div>

              {/* CTA */}
              <div className="pt-2 flex flex-col gap-3">
                <Button
                  disabled={!canAdd}
                  onClick={handleAddToCart}
                  className={`w-full rounded-full px-6 py-3 text-sm font-semibold tracking-[0.18em] uppercase flex items-center justify-center gap-2 shadow-sm transition-colors ${
                    canAdd
                      ? `bg-[${GOLD}] hover:bg-[#a98a57] text-neutral-900`
                      : "bg-neutral-300 text-neutral-600 cursor-not-allowed dark:bg-neutral-800 dark:text-neutral-500"
                  }`}
                >
                  <span>Add to cart</span>
                </Button>
                <p className="text-[11px] text-neutral-600 dark:text-neutral-400">
                  No charges are processed in this mock experience – cart and orders are simulated locally in your browser.
                </p>
              </div>
            </section>

            <section className="space-y-3 border-t border-neutral-200 dark:border-neutral-800 pt-6">
              <h2 className="font-['Playfair_Display'] text-base tracking-tight text-neutral-900 dark:text-neutral-50">
                Story & make
              </h2>
              <p className="text-sm leading-relaxed text-neutral-700 dark:text-neutral-300">
                {product.description}
              </p>
            </section>
          </div>
        </section>

        {/* Reviews */}
        <section className="mt-14 border-t border-neutral-200 dark:border-neutral-800 pt-10">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-6">
            <div>
              <h2 className="font-['Playfair_Display'] text-xl tracking-tight text-neutral-900 dark:text-neutral-50 mb-1">
                Client impressions
              </h2>
              <p className="text-sm text-neutral-700 dark:text-neutral-300 max-w-xl">
                Each pair moves differently through a city. Read how other collectors wear their {product.name.toLowerCase()}.
              </p>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <StarRating rating={product.rating} />
              <div className="flex flex-col text-right">
                <span className="text-xs text-neutral-700 dark:text-neutral-300">
                  {product.rating.toFixed(1)} overall
                </span>
                <span className="text-[11px] text-neutral-500 dark:text-neutral-400">
                  Based on {product.reviews.length} review
                  {product.reviews.length !== 1 && "s"}
                </span>
              </div>
            </div>
          </div>

          {product.reviews.length === 0 ? (
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              No impressions yet. Be the first to wear this silhouette out into the world.
            </p>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {product.reviews.map((review) => (
                <article
                  key={review.id}
                  className="rounded-3xl border border-neutral-200/80 dark:border-neutral-800 bg-white/70 dark:bg-neutral-950/70 backdrop-blur-sm px-5 py-5 flex flex-col gap-3 shadow-[0_16px_35px_rgba(0,0,0,0.06)]"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-full bg-neutral-900 text-neutral-50 flex items-center justify-center text-xs font-medium tracking-wide">
                        {getInitials(review.author)}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-neutral-900 dark:text-neutral-50">
                          {review.author}
                        </p>
                        <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                          {formatDate(review.date)}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <StarRating rating={review.rating} size={15} />
                      <span className="text-[11px] text-neutral-600 dark:text-neutral-400">
                        {review.rating.toFixed(1)} / 5
                      </span>
                    </div>
                  </div>
                  <p className="text-sm leading-relaxed text-neutral-800 dark:text-neutral-200">
                    {review.comment}
                  </p>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
};

const ChevronDownIcon: React.FC = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-4 w-4 text-neutral-700 dark:text-neutral-300"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M6 9l6 6 6-6" />
  </svg>
);

export default ProductPage;