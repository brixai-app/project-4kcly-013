import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Trash2, ArrowLeft, Plus, Minus, ShoppingBag } from "lucide-react";
import {
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  Separator,
} from "@/components/ui/shadcn";
import type { Cart, CartItem, Product } from "@/mock";
import { computeCartTotals, formatMoney } from "@/mock";

// NOTE: This page works entirely with frontend-only mocked data/state
// provided via props from src/mock.ts. There is **no backend** – all cart
// interactions, pricing and checkout are local mocks persisted to
// localStorage through the helpers in src/mock.ts.

export interface CartPageProps {
  cart: Cart;
  products: Product[];
  onUpdateQty: (lineId: string, qty: number) => void;
  onRemove: (lineId: string) => void;
  onCheckout: () => { orderNumber: string } | void;
  onToast: (opts: { title: string; description?: string; variant?: "default" | "success" | "destructive" }) => void;
}

const tableVariants = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
};

const rowVariants = {
  initial: { opacity: 0, y: 6 },
  animate: { opacity: 1, y: 0 },
};

const summaryVariants = {
  initial: { opacity: 0, x: 16 },
  animate: { opacity: 1, x: 0 },
};

export const CartPage: React.FC<CartPageProps> = ({
  cart,
  products,
  onUpdateQty,
  onRemove,
  onCheckout,
  onToast,
}) => {
  const navigate = useNavigate();
  const totals = computeCartTotals(cart);

  const handleDecrease = (line: CartItem) => {
    const nextQty = line.quantity - 1;
    onUpdateQty(line.id, nextQty);
    onToast({
      title: nextQty <= 0 ? "Removed from cart" : "Quantity updated",
      description:
        nextQty <= 0
          ? `${getProduct(line)?.name ?? "Item"} was removed from your cart.`
          : `Updated quantity to ${nextQty} pair${nextQty === 1 ? "" : "s"}.`,
      variant: nextQty <= 0 ? "destructive" : "default",
    });
  };

  const handleIncrease = (line: CartItem) => {
    const nextQty = line.quantity + 1;
    onUpdateQty(line.id, nextQty);
    onToast({
      title: "Quantity updated",
      description: `Updated quantity to ${nextQty} pairs.`,
      variant: "default",
    });
  };

  const handleRemove = (line: CartItem) => {
    onRemove(line.id);
    onToast({
      title: "Removed from cart",
      description: `${getProduct(line)?.name ?? "Item"} was removed from your cart.`,
      variant: "destructive",
    });
  };

  const handleCheckout = () => {
    const result = onCheckout();
    const orderNumber = (result as { orderNumber?: string } | void)?.orderNumber;
    onToast({
      title: "Order confirmed",
      description: orderNumber
        ? `Your order ${orderNumber} has been placed. This is a mocked client-side checkout.`
        : "Your order has been placed. This is a mocked client-side checkout.",
      variant: "success",
    });
    navigate("/");
  };

  const getProduct = (line: CartItem): Product | undefined =>
    products.find((p) => p.id === line.productId);

  const hasItems = cart.items.length > 0;

  return (
    <main className="min-h-[calc(100vh-6rem)] bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-50">
      <div className="mx-auto max-w-6xl px-4 pb-16 pt-10 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-neutral-500 dark:text-neutral-400">
              Cart
            </p>
            <h1 className="mt-1 text-3xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-50 sm:text-4xl lg:text-[2.75rem]">
              Your edit, in transit
            </h1>
          </div>
          {hasItems && (
            <Button
              variant="ghost"
              className="hidden items-center gap-2 rounded-full border border-neutral-200 bg-white px-4 py-2 text-xs font-medium uppercase tracking-[0.2em] text-neutral-800 shadow-sm transition-colors hover:border-neutral-900 hover:bg-neutral-900 hover:text-neutral-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100 dark:hover:border-neutral-50 dark:hover:bg-neutral-50 dark:hover:text-neutral-900 sm:inline-flex"
              onClick={() => navigate("/catalog")}
            >
              <ArrowLeft className="h-3 w-3" />
              Continue curating
            </Button>
          )}
        </div>

        {!hasItems ? (
          <EmptyCart onBrowse={() => navigate("/catalog")} />
        ) : (
          <div className="grid gap-8 lg:grid-cols-[minmax(0,2.1fr)_minmax(0,1fr)]">
            <motion.section
              className="overflow-hidden rounded-2xl border border-neutral-200 bg-white/80 shadow-sm backdrop-blur-sm dark:border-neutral-800 dark:bg-neutral-900/70"
              variants={tableVariants}
              initial="initial"
              animate="animate"
              transition={{ duration: 0.28, ease: "easeOut" }}
            >
              <div className="flex items-center justify-between px-6 pb-3 pt-5">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-neutral-500 dark:text-neutral-400">
                    Selection
                  </p>
                  <p className="mt-1 text-sm text-neutral-700 dark:text-neutral-200">
                    {cart.items.length} item{cart.items.length === 1 ? "" : "s"} curated
                  </p>
                </div>
              </div>
              <Separator className="border-neutral-200 dark:border-neutral-800" />
              <div className="overflow-x-auto">
                <Table className="min-w-full">
                  <TableHeader>
                    <TableRow className="border-neutral-200/80 bg-neutral-50/80 text-xs uppercase tracking-[0.18em] text-neutral-500 backdrop-blur-sm dark:border-neutral-800 dark:bg-neutral-900/60 dark:text-neutral-400">
                      <TableHead className="w-[55%] font-normal">Item</TableHead>
                      <TableHead className="w-[15%] text-right font-normal">Unit</TableHead>
                      <TableHead className="w-[20%] text-center font-normal">Quantity</TableHead>
                      <TableHead className="w-[10%] text-right font-normal">Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {cart.items.map((line, index) => {
                      const product = getProduct(line);
                      const primaryImage = product?.images.find((i) => i.isPrimary) ??
                        product?.images[0];

                      return (
                        <motion.tr
                          key={line.id}
                          variants={rowVariants}
                          initial="initial"
                          animate="animate"
                          transition={{
                            duration: 0.22,
                            ease: "easeOut",
                            delay: index * 0.02,
                          }}
                          className="border-b border-neutral-100/80 align-top last:border-0 hover:bg-neutral-50/80 dark:border-neutral-800/80 dark:hover:bg-neutral-900/70"
                        >
                          <TableCell className="py-5">
                            <div className="flex gap-4">
                              {primaryImage && (
                                <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-xl bg-neutral-100 shadow-sm ring-1 ring-neutral-200/70 dark:bg-neutral-900 dark:ring-neutral-700/80">
                                  <img
                                    src={primaryImage.url}
                                    alt={primaryImage.alt}
                                    className="h-full w-full object-cover transition-transform duration-300 ease-out group-hover:scale-105"
                                  />
                                </div>
                              )}
                              <div className="flex min-w-0 flex-1 flex-col justify-between">
                                <div>
                                  <p className="text-[0.7rem] uppercase tracking-[0.22em] text-neutral-500 dark:text-neutral-400">
                                    {product?.brand ?? "Jootiya"}
                                  </p>
                                  <p className="mt-1 line-clamp-2 text-sm font-medium text-neutral-900 dark:text-neutral-50">
                                    {product?.name ?? "Archived piece"}
                                  </p>
                                  <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                                    {line.variant.size && (
                                      <span>
                                        Size <span className="font-medium">{line.variant.size}</span>
                                      </span>
                                    )}
                                    {line.variant.size && line.variant.color && <span className="mx-1 text-neutral-400">·</span>}
                                    {line.variant.color && (
                                      <span>
                                        Color <span className="font-medium">{line.variant.color}</span>
                                      </span>
                                    )}
                                  </p>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => handleRemove(line)}
                                  className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-neutral-500 transition-colors hover:text-red-600 dark:text-neutral-400 dark:hover:text-red-400"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                  Remove
                                </button>
                              </div>
                            </div>
                          </TableCell>

                          <TableCell className="whitespace-nowrap py-5 text-right align-middle text-sm text-neutral-800 dark:text-neutral-100">
                            {formatMoney(line.unitPrice, line.currency)}
                          </TableCell>

                          <TableCell className="py-5 align-middle">
                            <div className="flex items-center justify-center gap-2">
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8 rounded-full border-neutral-200 bg-white text-neutral-900 shadow-sm transition-colors hover:border-neutral-900 hover:bg-neutral-900 hover:text-neutral-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100 dark:hover:border-neutral-50 dark:hover:bg-neutral-50 dark:hover:text-neutral-900"
                                onClick={() => handleDecrease(line)}
                                aria-label="Decrease quantity"
                              >
                                <Minus className="h-3 w-3" />
                              </Button>
                              <span className="min-w-[1.5rem] text-center text-sm font-medium tabular-nums text-neutral-900 dark:text-neutral-50">
                                {line.quantity}
                              </span>
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8 rounded-full border-neutral-200 bg-white text-neutral-900 shadow-sm transition-colors hover:border-neutral-900 hover:bg-neutral-900 hover:text-neutral-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100 dark:hover:border-neutral-50 dark:hover:bg-neutral-50 dark:hover:text-neutral-900"
                                onClick={() => handleIncrease(line)}
                                aria-label="Increase quantity"
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                            </div>
                          </TableCell>

                          <TableCell className="whitespace-nowrap py-5 text-right align-middle text-sm font-medium text-neutral-900 dark:text-neutral-50">
                            {formatMoney(line.unitPrice * line.quantity, line.currency)}
                          </TableCell>
                        </motion.tr>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </motion.section>

            <motion.aside
              className="self-start"
              variants={summaryVariants}
              initial="initial"
              animate="animate"
              transition={{ duration: 0.26, ease: "easeOut" }}
            >
              <Card className="sticky top-24 rounded-2xl border-neutral-200 bg-white/90 shadow-sm backdrop-blur-sm dark:border-neutral-800 dark:bg-neutral-900/80">
                <CardHeader className="space-y-1 pb-4">
                  <CardTitle className="text-base font-semibold tracking-tight text-neutral-900 dark:text-neutral-50">
                    Order summary
                  </CardTitle>
                  <CardDescription className="text-xs text-neutral-500 dark:text-neutral-400">
                    All duties included. This is a fully mocked luxury checkout with client-side totals only.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 text-sm text-neutral-700 dark:text-neutral-200">
                  <div className="flex items-center justify-between">
                    <span>Subtotal</span>
                    <span className="tabular-nums font-medium text-neutral-900 dark:text-neutral-50">
                      {formatMoney(totals.subtotal, totals.currency)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-neutral-600 dark:text-neutral-300">
                    <span>Estimated tax</span>
                    <span className="tabular-nums">
                      {formatMoney(totals.estimatedTax, totals.currency)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-neutral-600 dark:text-neutral-300">
                    <span>Shipping</span>
                    <span className="tabular-nums">
                      {totals.shipping === 0
                        ? "—"
                        : formatMoney(totals.shipping, totals.currency)}
                    </span>
                  </div>
                  <Separator className="my-3 border-neutral-200 dark:border-neutral-800" />
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-neutral-700 dark:text-neutral-200">Total</span>
                    <span className="text-right">
                      <span className="block text-xs uppercase tracking-[0.18em] text-neutral-500 dark:text-neutral-400">
                        {totals.currency}
                      </span>
                      <span className="mt-0.5 block text-lg font-semibold tracking-tight text-neutral-900 dark:text-neutral-50 tabular-nums">
                        {formatMoney(totals.total, totals.currency)}
                      </span>
                    </span>
                  </div>
                </CardContent>
                <CardFooter className="mt-2 flex flex-col gap-3">
                  <Button
                    className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-neutral-900 px-5 py-3 text-sm font-medium uppercase tracking-[0.2em] text-neutral-50 shadow-md transition-colors hover:bg-neutral-800 dark:bg-neutral-50 dark:text-neutral-900 dark:hover:bg-neutral-200"
                    onClick={handleCheckout}
                  >
                    <ShoppingBag className="h-4 w-4" />
                    Place order
                  </Button>
                  <p className="text-[0.68rem] leading-relaxed text-neutral-500 dark:text-neutral-400">
                    By placing this order you acknowledge this is a demonstration-only, frontend mock checkout. No real payments are processed.
                  </p>
                </CardFooter>
              </Card>
            </motion.aside>
          </div>
        )}
      </div>
    </main>
  );
};

interface EmptyCartProps {
  onBrowse: () => void;
}

const EmptyCart: React.FC<EmptyCartProps> = ({ onBrowse }) => {
  return (
    <motion.section
      className="flex min-h-[320px] flex-col items-stretch justify-between rounded-3xl border border-dashed border-neutral-300 bg-white/80 p-8 text-neutral-900 shadow-sm backdrop-blur-sm dark:border-neutral-800 dark:bg-neutral-900/70 dark:text-neutral-50 sm:p-10 lg:flex-row lg:items-center lg:gap-12"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      <div className="max-w-xl">
        <p className="text-xs uppercase tracking-[0.25em] text-neutral-500 dark:text-neutral-400">
          Jootiya Edit
        </p>
        <h2 className="mt-3 text-2xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-50 sm:text-3xl">
          Your cart is still a blank canvas
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-neutral-600 dark:text-neutral-300">
          We keep our carts as curated as our collections. Drift through the catalog, linger on a silhouette, and return when your story feels ready to ship.
        </p>
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <Button
            className="inline-flex items-center gap-2 rounded-full bg-neutral-900 px-5 py-3 text-xs font-medium uppercase tracking-[0.22em] text-neutral-50 shadow-md transition-colors hover:bg-neutral-800 dark:bg-neutral-50 dark:text-neutral-900 dark:hover:bg-neutral-200"
            onClick={onBrowse}
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Return to catalog
          </Button>
          <span className="text-[0.68rem] uppercase tracking-[0.22em] text-neutral-500 dark:text-neutral-400">
            Maison Jootiya — Luxury Footwear &amp; Sneakers
          </span>
        </div>
      </div>
      <div className="mt-8 flex flex-1 items-center justify-end lg:mt-0">
        <div className="relative flex h-40 w-40 items-center justify-center rounded-full bg-gradient-to-br from-neutral-900 to-stone-700 shadow-2xl dark:from-neutral-50 dark:to-stone-200">
          <div className="absolute -left-6 top-8 h-10 w-10 rounded-full border border-neutral-200/40 bg-white/70 shadow-md backdrop-blur-sm dark:border-neutral-700/60 dark:bg-neutral-900/70" />
          <div className="absolute -right-4 -bottom-4 h-16 w-16 rounded-full border border-amber-300/40 bg-amber-100/70 shadow-md backdrop-blur-sm dark:border-amber-500/60 dark:bg-amber-200/70" />
          <ShoppingBag className="relative h-14 w-14 text-amber-200 drop-shadow-md dark:text-amber-600" />
        </div>
      </div>
    </motion.section>
  );
};

export default CartPage;