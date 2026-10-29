import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, Home, Package, ShoppingBag } from 'lucide-react';
import type { Order, OrderItem, MojriProduct } from "@/types";
import { getProductBySlug } from "@/data/mockData";
import { cn } from "@/lib/utils";

type LocationState = { orderId?: string } | null;

const orderStorageKey = "jootiya.latestOrder";

function formatCurrency(value: number) {
  return `₹${Math.round(value).toLocaleString("en-IN")}`;
}

function getStoredOrder(): Order | null {
  try {
    const raw = localStorage.getItem(orderStorageKey);
    return raw ? (JSON.parse(raw) as Order) : null;
  } catch {
    return null;
  }
}

function getFallbackItems(items: OrderItem[] = []) {
  return items.map((item) => {
    const product = getProductBySlug(item?.productId ?? "") as MojriProduct | null;
    return { ...item, image: item?.image ?? product?.image ?? "" };
  });
}

export default function OrderConfirmationPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    const state = location.state as LocationState;
    const stored = getStoredOrder();
    if (stored) {
      setOrder(stored);
      return;
    }
    if (state?.orderId) {
      navigate("/checkout", { replace: true });
      return;
    }
    navigate("/", { replace: true });
  }, [location.state, navigate]);

  const items = useMemo(() => getFallbackItems(order?.items ?? []), [order]);
  const deliveryDate = useMemo(() => {
    const base = new Date(order?.createdAt ?? Date.now());
    base.setDate(base.getDate() + 5);
    return base.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
  }, [order?.createdAt]);

  if (!order) return null;

  return (
    <main className="bg-[#F7F0E3] px-4 py-8 text-[#211A17] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <motion.section
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
          className="overflow-hidden border border-[#CDBB9D] bg-[#FFFDFC]"
        >
          <div className="grid gap-0 lg:grid-cols-[1.15fr_0.85fr]">
            <div className="p-6 sm:p-8 lg:p-10">
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center border border-[#CDBB9D] bg-[#F7F0E3]">
                  <CheckCircle2 className="h-5 w-5 text-[#741F2B]" />
                </div>
                <div className="min-w-0">
                  <p className="font-[Bodoni_Moda] text-3xl font-light tracking-tight sm:text-4xl">Order confirmed</p>
                  <p className="text-xs uppercase tracking-[0.28em] text-[#6F6258]">Reference {order.id}</p>
                </div>
              </div>

              <p className="max-w-2xl text-sm leading-7 text-[#6F6258] sm:text-base">
                Your Mojris have been reserved and are now being prepared with care. We have saved your latest order and
                will keep you updated as it moves through fulfillment.
              </p>

              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                <div className="border border-[#CDBB9D] p-4">
                  <p className="text-xs uppercase tracking-[0.24em] text-[#6F6258]">Total</p>
                  <p className="mt-2 font-[Bodoni_Moda] text-2xl font-light">{formatCurrency(order.total)}</p>
                </div>
                <div className="border border-[#CDBB9D] p-4">
                  <p className="text-xs uppercase tracking-[0.24em] text-[#6F6258]">Delivery</p>
                  <p className="mt-2 font-[Bodoni_Moda] text-2xl font-light">{deliveryDate}</p>
                </div>
                <div className="border border-[#CDBB9D] p-4">
                  <p className="text-xs uppercase tracking-[0.24em] text-[#6F6258]">Status</p>
                  <p className="mt-2 font-[Bodoni_Moda] text-2xl font-light capitalize">{order.status}</p>
                </div>
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  to="/"
                  className="inline-flex items-center gap-2 border border-[#741F2B] bg-[#741F2B] px-5 py-3 text-xs font-semibold uppercase tracking-[0.24em] text-white transition-colors hover:bg-[#561620]"
                >
                  <Home className="h-4 w-4" />
                  Home
                </Link>
                <Link
                  to="/catalog"
                  className="inline-flex items-center gap-2 border border-[#CDBB9D] bg-transparent px-5 py-3 text-xs font-semibold uppercase tracking-[0.24em] text-[#211A17] transition-colors hover:bg-[#F7F0E3]"
                >
                  <ShoppingBag className="h-4 w-4" />
                  Continue shopping
                </Link>
              </div>
            </div>

            <aside className="border-t border-[#CDBB9D] bg-[#F7F0E3] p-6 sm:p-8 lg:border-l lg:border-t-0">
              <div className="flex items-center gap-2">
                <Package className="h-4 w-4 text-[#741F2B]" />
                <p className="text-xs uppercase tracking-[0.28em] text-[#6F6258]">Purchased Mojris</p>
              </div>

              <div className="mt-5 flex flex-col gap-4">
                {items.map((item) => (
                  <div key={`${item.productId}-${item.size ?? "na"}-${item.color ?? "na"}`} className="flex gap-4 border-b border-[#CDBB9D] pb-4 last:border-b-0 last:pb-0">
                    <img
                      src={item.image ?? ""}
                      alt={item.name ?? "Mojri"}
                      crossOrigin="anonymous"
                      className="h-24 w-20 shrink-0 border border-[#CDBB9D] object-cover"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-[Bodoni_Moda] text-lg font-light">{item.name}</p>
                      <p className="mt-1 text-xs uppercase tracking-[0.22em] text-[#6F6258]">
                        Qty {item.quantity ?? 1}
                        {item.size ? ` · Size ${item.size}` : ""}
                        {item.color ? ` · ${item.color}` : ""}
                      </p>
                      <p className="mt-2 text-sm font-semibold">{formatCurrency(item.price * (item.quantity ?? 1))}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 border border-[#CDBB9D] bg-[#FFFDFC] p-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[#6F6258]">Subtotal</span>
                  <span>{formatCurrency(order.subtotal)}</span>
                </div>
                <div className="mt-2 flex items-center justify-between text-sm">
                  <span className="text-[#6F6258]">Shipping</span>
                  <span>{formatCurrency(order.shipping)}</span>
                </div>
                <div className="mt-3 flex items-center justify-between border-t border-[#CDBB9D] pt-3 text-base font-semibold">
                  <span>Total</span>
                  <span>{formatCurrency(order.total)}</span>
                </div>
              </div>

              <Link
                to="/catalog"
                className={cn(
                  "mt-6 inline-flex w-full items-center justify-center gap-2 border border-[#CDBB9D] px-5 py-3 text-xs font-semibold uppercase tracking-[0.24em] text-[#211A17] transition-colors hover:bg-[#FFFDFC]"
                )}
              >
                Explore more
                <ArrowRight className="h-4 w-4" />
              </Link>
            </aside>
          </div>
        </motion.section>
      </div>
    </main>
  );
}
export { OrderConfirmationPage };
