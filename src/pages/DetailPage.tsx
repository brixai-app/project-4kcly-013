import React, { useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import {
  Button,
  Badge,
  Separator,
  Sheet,
  SheetContent,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/shadcn";
import { mockStore } from "@/mock";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  ShoppingBag,
  Star,
} from "lucide-react";

interface DetailPageProps {
  /**
   * Global cart sheet state lives in App.tsx.
   * We only trigger it from here.
   */
  onOpenCartSheet?: () => void;
}

const imageVariants = {
  enter: {
    opacity: 0,
    scale: 1.02,
  },
  center: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.4, ease: "easeOut" },
  },
  exit: {
    opacity: 0,
    scale: 0.98,
    transition: { duration: 0.3, ease: "easeIn" },
  },
};

const thumbVariants = {
  rest: { opacity: 0.7 },
  hover: { opacity: 1, transition: { duration: 0.2 } },
};

const DetailPage: React.FC<DetailPageProps> = ({ onOpenCartSheet }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Products are mock-only; pulled from mockStore (frontend-only, localStorage-backed)
  const product = useMemo(() => {
    if (!id) return undefined;
    // Allow either id or slug
    return mockStore.getProductById(id) ?? mockStore.getProductBySlug(id);
  }, [id]);

  const artisan = product
    ? mockStore.getArtisanById(product.artisanId)
    : undefined;

  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState<number | null>(
    product?.sizes?.[0] ?? null,
  );
  const [isLocalCartSheetOpen, setIsLocalCartSheetOpen] = useState(false);

  if (!product) {
    return (
      <div className="w-full min-h-[70vh] bg-stone-950 text-stone-50 flex flex-col">
        <div className="w-full max-w-[1600px] mx-auto px-6 lg:px-12 py-24 flex flex-col gap-8">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-sm text-stone-300 hover:text-stone-50 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
          <div className="flex flex-col gap-4">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif tracking-tight">
              This Mojri has stepped out of frame.
            </h1>
            <p className="max-w-2xl text-sm md:text-base text-stone-300 leading-relaxed">
              You may have followed an old bookmark or a link to a piece that is no
              longer in this editorial selection. Explore the living catalog to
              discover other mojris from Jodhpur.
            </p>
            <Button
              variant="outline"
              className="w-fit border-stone-600 text-stone-50 hover:bg-stone-100/5 hover:border-stone-300 rounded-full px-6 py-2 text-sm tracking-wide uppercase"
              onClick={() => navigate("/catalog")}
            >
              Return to catalog
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const images = product.images && product.images.length > 0
    ? product.images
    : [
        {
          id: product.id,
          url: product.heroImage,
          alt: product.name,
        },
      ];

  const currentImage = images[Math.min(activeIndex, images.length - 1)];

  const handlePrev = () => {
    setActiveIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handleAddToCart = () => {
    if (!selectedSize) {
      toast("Choose a size first", {
        description: "Each mojri is cut to measure – select your EU size to continue.",
      });
      return;
    }

    mockStore.addToCart(product.id, selectedSize, 1);

    toast.success("Added to your Jootiya basket", {
      description: `${product.name} · EU ${selectedSize}`,
    });
  };

  const openCartSheet = () => {
    if (onOpenCartSheet) {
      onOpenCartSheet();
    } else {
      setIsLocalCartSheetOpen(true);
    }
  };

  const cartLines = mockStore.getCartDetailed();
  const subtotal = mockStore.getCartSubtotal();

  return (
    <div className="w-full min-h-screen bg-stone-950 text-stone-50 flex flex-col">
      {/* Main content */}
      <main className="flex-1 w-full">
        <div className="w-full max-w-[1600px] mx-auto px-6 lg:px-12 py-12 lg:py-20 flex flex-col gap-12">
          {/* Back + meta row */}
          <div className="flex items-center justify-between gap-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-2 text-xs md:text-sm text-stone-300 hover:text-stone-50 tracking-wide uppercase"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to edit
            </button>
            {product.isLimitedEdition && (
              <Badge className="bg-amber-200/10 text-amber-200 border border-amber-300/30 rounded-full px-3 py-1 text-[11px] tracking-[0.18em] uppercase">
                Limited edition run
              </Badge>
            )}
          </div>

          <div className="grid lg:grid-cols-[minmax(0,3fr)_minmax(0,2.2fr)] gap-10 xl:gap-16 items-start">
            {/* Image gallery */}
            <section className="space-y-4">
              <div className="relative w-full aspect-[4/3] md:aspect-[16/10] overflow-hidden rounded-3xl border border-stone-800 bg-stone-900">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.img
                    key={currentImage.id}
                    src={currentImage.url}
                    alt={currentImage.alt}
                    variants={imageVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    className="w-full h-full object-cover"
                  />
                </AnimatePresence>

                {/* Soft gradient overlay at bottom for text readability */}
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-stone-950/80 via-stone-950/0" />

                {/* Controls */}
                <div className="absolute inset-x-0 bottom-0 px-4 sm:px-6 pb-4 flex items-end justify-between gap-3">
                  <div className="flex flex-col gap-2 max-w-[70%]">
                    <p className="text-[11px] md:text-xs tracking-[0.2em] uppercase text-stone-300">
                      Jodhpur · {artisan?.region ?? "Unknown atelier"}
                    </p>
                    <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-serif leading-tight">
                      {product.name}
                    </h1>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handlePrev}
                      className="inline-flex items-center justify-center rounded-full border border-stone-700 bg-stone-900/80 hover:bg-stone-800 text-stone-50 w-9 h-9 sm:w-10 sm:h-10 transition-colors"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={handleNext}
                      className="inline-flex items-center justify-center rounded-full border border-stone-700 bg-stone-900/80 hover:bg-stone-800 text-stone-50 w-9 h-9 sm:w-10 sm:h-10 transition-colors"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Thumbnails */}
              <div className="flex items-center gap-3 overflow-x-auto pb-1">
                {images.map((img, index) => (
                  <motion.button
                    key={img.id}
                    type="button"
                    variants={thumbVariants}
                    initial="rest"
                    whileHover="hover"
                    animate={index === activeIndex ? "hover" : "rest"}
                    onClick={() => setActiveIndex(index)}
                    className={`relative flex-shrink-0 w-20 h-16 sm:w-24 sm:h-20 rounded-2xl overflow-hidden border transition-colors ${
                      index === activeIndex
                        ? "border-stone-100"
                        : "border-stone-700/70 hover:border-stone-400/80"
                    }`}
                  >
                    <img
                      src={img.url}
                      alt={img.alt}
                      className="w-full h-full object-cover"
                    />
                    {img.emphasis === "primary" && (
                      <div className="absolute inset-0 bg-gradient-to-t from-stone-950/25 via-transparent" />
                    )}
                  </motion.button>
                ))}
              </div>
            </section>

            {/* Right column – details */}
            <section className="space-y-8">
              {/* Price & artisan */}
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex flex-col gap-1">
                    <span className="text-[11px] tracking-[0.22em] uppercase text-stone-400">
                      Mojri from Jodhpur
                    </span>
                    <div className="inline-flex items-center gap-2">
                      <p className="text-xl md:text-2xl lg:text-3xl font-serif">
                        ₹{product.priceINR.toLocaleString("en-IN")}<span className="text-xs md:text-sm font-sans text-stone-300 ml-2">(incl. craft)</span>
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1 text-right">
                    {artisan && (
                      <p className="text-xs text-stone-300">
                        Crafted by
                        <span className="ml-1 font-medium text-stone-50">
                          {artisan.name}
                        </span>
                      </p>
                    )}
                    <p className="text-[11px] text-stone-400">
                      {artisan?.yearsOfCraft ?? 0} years of hand memory
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <Badge className="bg-stone-100/10 text-stone-50 border border-stone-400/40 rounded-full px-3 py-1 text-[11px] tracking-[0.2em] uppercase">
                    {product.style} edit
                  </Badge>
                  <Badge className="bg-emerald-200/10 text-emerald-200 border border-emerald-300/30 rounded-full px-3 py-1 text-[11px] tracking-[0.18em] uppercase">
                    Hand-finished pair
                  </Badge>
                </div>
              </div>

              <Separator className="bg-stone-800" />

              {/* Size selection */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-[11px] tracking-[0.22em] uppercase text-stone-400">
                    Choose your EU size
                  </p>
                  <div className="flex items-center gap-1 text-[11px] text-stone-400">
                    <Star className="w-3 h-3 text-amber-300" />
                    <span>True to size</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => {
                    const isActive = selectedSize === size;
                    return (
                      <button
                        key={size}
                        type="button"
                        onClick={() => setSelectedSize(size)}
                        className={`px-3 py-2 rounded-full border text-xs md:text-sm transition-colors ${
                          isActive
                            ? "border-stone-50 bg-stone-50 text-stone-900"
                            : "border-stone-700 text-stone-100 hover:border-stone-300 hover:bg-stone-900"
                        }`}
                      >
                        EU {size}
                      </button>
                    );
                  })}
                </div>

                <p className="text-xs text-stone-400 leading-relaxed">
                  {product.fitNotes}
                </p>
              </div>

              <Separator className="bg-stone-800" />

              {/* Materials + story snippet */}
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <p className="text-[11px] tracking-[0.22em] uppercase text-stone-400">
                    Materials
                  </p>
                  <ul className="space-y-1 text-sm text-stone-100">
                    {product.materials.map((m) => (
                      <li key={m} className="flex items-baseline gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-stone-200 mt-1" />
                        <span>{m}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="space-y-3">
                  <p className="text-[11px] tracking-[0.22em] uppercase text-stone-400">
                    From the artisan's lane
                  </p>
                  <p className="text-sm text-stone-200 leading-relaxed">
                    {artisan?.shortBio}
                  </p>
                  {artisan && (
                    <button
                      type="button"
                      onClick={() => navigate(`/catalog?artisan=${artisan.id}`)}
                      className="text-[11px] tracking-[0.2em] uppercase text-stone-300 hover:text-stone-50 underline-offset-4 hover:underline"
                    >
                      View more from {artisan.name.split(" ")[0]}
                    </button>
                  )}
                </div>
              </div>

              {/* Long description */}
              <div className="space-y-3">
                <p className="text-[11px] tracking-[0.22em] uppercase text-stone-400">
                  Editorial note
                </p>
                <p className="text-sm md:text-base text-stone-200 leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Actions */}
              <div className="space-y-4">
                <div className="flex flex-wrap items-center gap-3">
                  <Button
                    onClick={handleAddToCart}
                    className="rounded-full px-6 py-2 h-11 md:h-12 text-xs md:text-sm tracking-[0.22em] uppercase bg-amber-200 text-stone-950 hover:bg-amber-300 shadow-[0_18px_45px_rgba(0,0,0,0.45)]"
                  >
                    <ShoppingBag className="w-4 h-4 mr-2" />
                    Add to basket
                  </Button>
                  <Button
                    variant="outline"
                    onClick={openCartSheet}
                    className="rounded-full px-5 py-2 h-11 md:h-12 text-[11px] md:text-xs tracking-[0.22em] uppercase border-stone-500 text-stone-100 hover:bg-stone-900/80 hover:border-stone-300"
                  >
                    View basket & checkout
                  </Button>
                </div>
                <p className="text-[11px] text-stone-500 max-w-sm leading-relaxed">
                  This is a fully mocked, frontend-only experience. Your basket and
                  checkouts live in your browser via localStorage – nothing is actually
                  charged or shipped.
                </p>
              </div>
            </section>
          </div>
        </div>
      </main>

      {/* Fallback local cart sheet – used only if App.tsx doesn't control a global sheet. */}
      <Sheet open={isLocalCartSheetOpen} onOpenChange={setIsLocalCartSheetOpen}>
        <SheetContent className="w-full sm:max-w-md border-l border-stone-800 bg-stone-950 text-stone-50 px-0">
          <div className="h-full flex flex-col">
            <div className="px-6 pt-6 pb-4 flex items-center justify-between">
              <div>
                <p className="text-[11px] tracking-[0.2em] uppercase text-stone-400">
                  Basket preview
                </p>
                <h2 className="text-xl font-serif">Your Jootiya curation</h2>
              </div>
              <Badge className="rounded-full bg-stone-100/10 text-stone-100 border border-stone-400/40">
                {cartLines.length} piece{cartLines.length !== 1 ? "s" : ""}
              </Badge>
            </div>

            <Separator className="bg-stone-800" />

            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
              {cartLines.length === 0 ? (
                <p className="text-sm text-stone-400">
                  Your curation is still blank. Add a mojri to see it breathe here.
                </p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow className="border-stone-800">
                      <TableHead className="text-[11px] tracking-[0.18em] uppercase text-stone-400">
                        Piece
                      </TableHead>
                      <TableHead className="text-[11px] tracking-[0.18em] uppercase text-stone-400 text-right">
                        Total
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {cartLines.map((line) => (
                      <TableRow key={line.lineId} className="border-stone-900/80">
                        <TableCell className="align-top pr-4">
                          <div className="flex gap-3">
                            <div className="w-14 h-14 rounded-xl overflow-hidden bg-stone-900 border border-stone-800 flex-shrink-0">
                              <img
                                src={line.product.heroImage}
                                alt={line.product.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="space-y-1">
                              <p className="text-xs font-medium text-stone-100">
                                {line.product.name}
                              </p>
                              <p className="text-[11px] text-stone-400">
                                EU {line.size} · Qty {line.quantity}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="align-top text-right text-xs text-stone-100">
                          ₹{line.lineTotalINR.toLocaleString("en-IN")}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </div>

            <Separator className="bg-stone-800" />

            <div className="px-6 py-5 space-y-3 border-t border-stone-900/80 bg-stone-950/95">
              <div className="flex items-center justify-between text-sm">
                <span className="text-stone-400">Subtotal</span>
                <span className="font-medium text-stone-50">
                  ₹{subtotal.toLocaleString("en-IN")}
                </span>
              </div>
              <p className="text-[11px] text-stone-500">
                Checkout is fully simulated for this demo – no payments are processed.
              </p>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default DetailPage;