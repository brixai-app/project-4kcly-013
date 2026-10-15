import React from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { products, computeStock, formatMoney } from "../mock";
import { ROUTES } from "../mock";
import { ChevronRight } from "lucide-react";

export interface CartItemInput {
  productId: string;
  size: number;
  color: string;
  quantity: number;
}

interface MainFeatureProps {
  route: { name: string; id?: string };
  onNavigate: (path: string) => void;
  onAddToCart: (item: CartItemInput) => void;
  filters: {
    category: string | null;
    size: number | null;
    color: string | null;
  };
}

const heroImage =
  "https://images.unsplash.com/photo-1528701800489-20be3c30c1d5?auto=format&fit=crop&w=1600&q=80";

const HeroBanner: React.FC<{ onBrowse: () => void }> = ({ onBrowse }) => (
  <section className="relative mb-10 overflow-hidden rounded-3xl bg-[#2B2B2B] text-[#F5F1EB]">
    <div
      className="absolute inset-0 bg-cover bg-center"
      style={{ backgroundImage: `url(${heroImage})` }}
    />
    <div className="absolute inset-0 bg-gradient-to-r from-[#2B2B2B]/80 via-[#2B2B2B]/60 to-transparent" />
    <div className="relative px-8 py-16 sm:px-12 sm:py-20 lg:px-16 lg:py-24 flex flex-col lg:flex-row lg:items-end gap-10">
      <div className="max-w-xl space-y-6">
        <p className="font-['Bodoni_Moda'] text-xs tracking-[0.3em] uppercase text-[#BFA06F]">
          Jootiya / AW Capsule
        </p>
        <h1 className="font-['Playfair_Display'] text-3xl sm:text-4xl lg:text-5xl leading-tight">
          Sculpted sneakers for the
          <span className="block">city’s quietest rooms.</span>
        </h1>
        <p className="font-['Inter'] text-sm sm:text-base text-[#F5F1EB]/80 max-w-md">
          Discover hand-finished silhouettes in warm ivory, deep taupe and soft
          charcoal. Limited pairs, photographed like an editor’s favorite page.
        </p>
        <button
          onClick={onBrowse}
          className="inline-flex items-center gap-2 rounded-full bg-[#BFA06F] px-5 py-2.5 text-xs font-['Inter'] uppercase tracking-[0.2em] text-[#2B2B2B] shadow-lg hover:bg-[#a58a5c] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#BFA06F] focus-visible:ring-offset-[#F5F1EB]"
        >
          Browse the Edit
          <ChevronRight className="h-3 w-3" />
        </button>
      </div>
      <div className="ml-auto text-right max-w-xs space-y-3 text-[11px] font-['Inter'] uppercase tracking-[0.16em] text-[#F5F1EB]/70 hidden md:block">
        <p>Shot on 35mm in a converted atelier loft. Every crease is intentional.</p>
        <p>Complimentary worldwide shipping on the first drop (mock only).</p>
      </div>
    </div>
  </section>
);

const ProductCard: React.FC<{
  product: (typeof products)[number];
  onClick: () => void;
}> = ({ product, onClick }) => {
  return (
    <motion.button
      whileHover={{ y: -4, scale: 1.02 }}
      whileFocus={{ scale: 1.01 }}
      className="mb-6 w-full text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#BFA06F] rounded-3xl overflow-hidden bg-white shadow-[0_18px_45px_rgba(0,0,0,0.08)]"
      onClick={onClick}
    >
      <div className="relative aspect-[4/5] overflow-hidden">
        <img
          src={product.images[0]}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-500 ease-out hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#2B2B2B]/40 via-transparent to-transparent" />
        {product.featured && (
          <span className="absolute left-3 top-3 rounded-full bg-[#F5F1EB]/90 px-3 py-1 text-[10px] font-['Inter'] uppercase tracking-[0.14em] text-[#7E6B5A]">
            Featured
          </span>
        )}
      </div>
      <div className="p-4 space-y-1">
        <p className="text-[11px] font-['Inter'] uppercase tracking-[0.18em] text-[#7E6B5A]">
          {product.category}
        </p>
        <h3 className="font-['Playfair_Display'] text-lg text-[#2B2B2B]">
          {product.name}
        </h3>
        <p className="font-['Inter'] text-sm text-[#2B2B2B]">
          {formatMoney(product.price)}
        </p>
      </div>
    </motion.button>
  );
};

const ProductGrid: React.FC<{
  filtered: typeof products;
  onSelect: (id: string) => void;
}> = ({ filtered, onSelect }) => {
  return (
    <section className="mb-16">
      <div className="flex items-baseline justify-between mb-6">
        <div>
          <h2 className="font-['Playfair_Display'] text-xl text-[#2B2B2B]">
            The Ivory City Edit
          </h2>
          <p className="font-['Inter'] text-xs text-[#7E6B5A] tracking-[0.16em] uppercase">
            Curated silhouettes · {filtered.length} styles
          </p>
        </div>
      </div>
      <div className="columns-1 sm:columns-2 lg:columns-3 gap-6">
        {filtered.map((p) => (
          <ProductCard key={p.id} product={p} onClick={() => onSelect(p.id)} />
        ))}
      </div>
    </section>
  );
};

const ProductGallery: React.FC<{
  images: string[];
}> = ({ images }) => {
  const [active, setActive] = React.useState(0);
  const main = images[active] ?? images[0];
  return (
    <div className="space-y-4">
      <div className="relative overflow-hidden rounded-3xl bg-[#F5F1EB]">
        <div className="group relative">
          <img
            src={main}
            alt="Product view"
            className="w-full object-cover max-h-[520px] transition-transform duration-700 group-hover:scale-105"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-black/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      </div>
      <div className="flex gap-3 overflow-x-auto pb-1">
        {images.map((src, idx) => (
          <button
            key={src}
            onClick={() => setActive(idx)}
            className={`relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-2xl border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#BFA06F] ${
              idx === active
                ? "border-[#BFA06F]"
                : "border-[rgba(126,107,90,0.3)] hover:border-[#BFA06F]"
            }`}
          >
            <img src={src} alt="Detail" className="h-full w-full object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
};

const SizeSelector: React.FC<{
  sizes: number[];
  value: number | null;
  onChange: (size: number) => void;
}> = ({ sizes, value, onChange }) => (
  <div className="space-y-2">
    <p className="font-['Inter'] text-xs tracking-[0.18em] uppercase text-[#7E6B5A]">
      Size
    </p>
    <div className="flex flex-wrap gap-2">
      {sizes.map((size) => (
        <button
          key={size}
          onClick={() => onChange(size)}
          className={`min-w-[44px] rounded-full border px-3 py-1 text-xs font-['Inter'] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#BFA06F] ${
            value === size
              ? "border-[#2B2B2B] bg-[#2B2B2B] text-[#F5F1EB]"
              : "border-[rgba(43,43,43,0.25)] bg-white text-[#2B2B2B] hover:border-[#2B2B2B]"
          }`}
        >
          {size}
        </button>
      ))}
    </div>
  </div>
);

const ColorSelector: React.FC<{
  colors: string[];
  value: string | null;
  onChange: (color: string) => void;
}> = ({ colors, value, onChange }) => (
  <div className="space-y-2">
    <p className="font-['Inter'] text-xs tracking-[0.18em] uppercase text-[#7E6B5A]">
      Color
    </p>
    <div className="flex flex-wrap gap-2">
      {colors.map((color) => (
        <button
          key={color}
          onClick={() => onChange(color)}
          className={`flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-['Inter'] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#BFA06F] ${
            value === color
              ? "border-[#2B2B2B] bg-[#2B2B2B] text-[#F5F1EB]"
              : "border-[rgba(43,43,43,0.25)] bg-white text-[#2B2B2B] hover:border-[#2B2B2B]"
          }`}
        >
          <span
            className="h-4 w-4 rounded-full border border-black/10"
            style={{ backgroundColor: color }}
          />
          <span>{color}</span>
        </button>
      ))}
    </div>
  </div>
);

const ProductDetailView: React.FC<{
  productId: string;
  onAddToCart: (item: CartItemInput) => void;
}> = ({ productId, onAddToCart }) => {
  const product = products.find((p) => p.id === productId);
  const [size, setSize] = React.useState<number | null>(null);
  const [color, setColor] = React.useState<string | null>(null);
  const [quantity, setQuantity] = React.useState(1);

  React.useEffect(() => {
    if (product) {
      setSize(product.sizes[0] ?? null);
      setColor(product.colors[0] ?? null);
    }
  }, [productId]);

  if (!product) {
    return (
      <div className="py-16 text-center font-['Inter'] text-sm text-[#2B2B2B]">
        Product not found.
      </div>
    );
  }

  const stock = computeStock(product, size, color);
  const disabled = !size || !color || stock <= 0;

  const handleAdd = () => {
    if (disabled) {
      toast.error("Select an available size and color.");
      return;
    }
    const safeQty = Math.min(quantity, Math.min(5, stock));
    onAddToCart({ productId: product.id, size: size!, color: color!, quantity: safeQty });
    toast.success("Added to your Jootiya edit.");
  };

  return (
    <section className="py-10 lg:py-14">
      <div className="grid gap-10 lg:grid-cols-2">
        <ProductGallery images={product.images} />
        <div className="space-y-6">
          <div className="space-y-2">
            <p className="font-['Inter'] text-xs tracking-[0.18em] uppercase text-[#7E6B5A]">
              {product.category} · Jootiya Studio
            </p>
            <h1 className="font-['Playfair_Display'] text-2xl sm:text-3xl text-[#2B2B2B]">
              {product.name}
            </h1>
            <p className="font-['Inter'] text-sm text-[#2B2B2B]">
              {formatMoney(product.price)}
            </p>
          </div>
          <p className="font-['Inter'] text-sm leading-relaxed text-[#2B2B2B]">
            {product.description}
          </p>
          <div className="space-y-4">
            <SizeSelector sizes={product.sizes} value={size} onChange={setSize} />
            <ColorSelector colors={product.colors} value={color} onChange={setColor} />
            <div className="flex items-center gap-4 pt-2">
              <div className="space-y-1">
                <p className="font-['Inter'] text-xs tracking-[0.16em] uppercase text-[#7E6B5A]">
                  Quantity
                </p>
                <div className="inline-flex items-center rounded-full border border-[rgba(43,43,43,0.25)] bg-white">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    disabled={quantity <= 1}
                    className="px-3 py-1 text-sm text-[#2B2B2B] disabled:opacity-40"
                  >
                    -
                  </button>
                  <span className="px-3 text-sm font-['Inter'] text-[#2B2B2B]">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity((q) => Math.min(5, q + 1))}
                    disabled={quantity >= 5 || (stock && quantity >= stock)}
                    className="px-3 py-1 text-sm text-[#2B2B2B] disabled:opacity-40"
                  >
                    +
                  </button>
                </div>
              </div>
              <p className="font-['Inter'] text-xs text-[#7E6B5A]">
                {size && color ? (
                  stock > 0 ? (
                    <span>
                      {stock} pairs available in {size} / {color}
                    </span>
                  ) : (
                    <span>Out of stock in this combination</span>
                  )
                ) : (
                  <span>Select a size and color to view availability.</span>
                )}
              </p>
            </div>
            <div className="pt-2">
              <button
                onClick={handleAdd}
                disabled={disabled}
                className="inline-flex w-full items-center justify-center rounded-full bg-[#BFA06F] px-6 py-3 text-xs font-['Inter'] uppercase tracking-[0.22em] text-[#2B2B2B] shadow-lg hover:bg-[#a58a5c] disabled:opacity-50 disabled:cursor-not-allowed transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#BFA06F] focus-visible:ring-offset-[#F5F1EB]"
              >
                Add to cart
              </button>
            </div>
          </div>
          <div className="border-t border-[rgba(43,43,43,0.08)] pt-4 space-y-2">
            <p className="font-['Bodoni_Moda'] text-xs tracking-[0.24em] uppercase text-[#7E6B5A]">
              Details
            </p>
            <ul className="space-y-1 text-xs font-['Inter'] text-[#2B2B2B]">
              <li>Hand-finished in small European workshops (mock data).</li>
              <li>Complimentary global shipping and returns on first drop.</li>
              <li>Responsibly sourced leathers and textiles.</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

const MainFeature: React.FC<MainFeatureProps> = ({
  route,
  onNavigate,
  onAddToCart,
  filters,
}) => {
  if (route.name === "product" && route.id) {
    return (
      <main className="mx-auto max-w-6xl px-6 pb-16 pt-8 bg-[#F5F1EB] min-h-screen">
        <button
          onClick={() => onNavigate(ROUTES.HOME)}
          className="mb-6 text-xs font-['Inter'] tracking-[0.18em] uppercase text-[#7E6B5A] hover:text-[#2B2B2B] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#BFA06F] rounded-full px-3 py-1 inline-flex items-center gap-1"
        >
          <span>Back to edit</span>
        </button>
        <ProductDetailView productId={route.id} onAddToCart={onAddToCart} />
      </main>
    );
  }

  const filtered = products.filter((p) => {
    if (filters.category && p.category !== filters.category) return false;
    if (filters.size && !p.sizes.includes(filters.size)) return false;
    if (filters.color && !p.colors.includes(filters.color)) return false;
    return true;
  });

  return (
    <main className="mx-auto max-w-6xl px-6 pb-16 pt-8 bg-[#F5F1EB] min-h-screen">
      <HeroBanner onBrowse={() => {}} />
      <ProductGrid
        filtered={filtered}
        onSelect={(id) => onNavigate(ROUTES.PRODUCT(id))}
      />
    </main>
  );
};

export default MainFeature;