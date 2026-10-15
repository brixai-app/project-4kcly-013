import { v4 as uuidv4 } from "uuid";

// NOTE: This file provides MOCK DATA ONLY. No backend is used.
// All data is client-side and should later be replaced with real APIs.

export const CATEGORIES = ["Sneakers", "Formal", "Casual"];

// Neutral / gold aligned colors
export const COLOR_OPTIONS = [
  { name: "Ivory", hex: "#F5F1EB" },
  { name: "Charcoal", hex: "#2B2B2B" },
  { name: "Taupe", hex: "#7E6B5A" },
  { name: "Gold", hex: "#BFA06F" },
];

// Helper to build stock key
const stockKey = (size, color) => `${size}-${color}`;

const baseSizes = [38, 39, 40, 41, 42, 43, 44];

// High-res imagery from Unsplash (placeholder only)
export const products = [
  {
    id: uuidv4(),
    name: "Auric Linea Sneaker",
    description:
      "Hand-finished low-top sneaker in full-grain calf leather with brushed gold foxing detail. Crafted in Italy with a leather-wrapped insole and stitched cupsole for all-day city pacing.",
    price: 620,
    category: "Sneakers",
    images: [
      "https://images.unsplash.com/photo-1542293787938-4d352b042b24?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1514986888952-8cd320577b68?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1508682641872-16f2688c3c87?auto=format&fit=crop&w=1600&q=80",
    ],
    sizes: baseSizes,
    colors: ["#F5F1EB", "#2B2B2B", "#BFA06F"],
    featured: true,
  },
  {
    id: uuidv4(),
    name: "Noir Atelier Derby",
    description:
      "A sculpted derby in hand-burnished charcoal leather with beveled outsole and waxed cotton laces. Designed for discreet impact at gallery openings and late dinners alike.",
    price: 540,
    category: "Formal",
    images: [
      "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1545239351-1141bd82e8a6?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=1600&q=80",
    ],
    sizes: baseSizes,
    colors: ["#2B2B2B", "#7E6B5A"],
    featured: true,
  },
  {
    id: uuidv4(),
    name: "Ivory Passage Mule",
    description:
      "Supple ivory mule with a sculpted stacked heel and padded lambskin insole. Finished with hand-stitched piping and a subtly squared toe.",
    price: 480,
    category: "Casual",
    images: [
      "https://images.unsplash.com/photo-1525966222134-24f116b9b42f?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1529927066849-66e1abc70a2e?auto=format&fit=crop&w=1600&q=80",
    ],
    sizes: [36, 37, 38, 39, 40, 41],
    colors: ["#F5F1EB", "#BFA06F"],
    featured: true,
  },
  {
    id: uuidv4(),
    name: "Taupe Flight Runner",
    description:
      "Technical runner in sanded taupe nubuck with breathable mesh underlays and ultra-light midsole. Built for airport sprints and curated city walks.",
    price: 590,
    category: "Sneakers",
    images: [
      "https://images.unsplash.com/photo-1539185441755-769473a23570?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1600&q=80",
    ],
    sizes: baseSizes,
    colors: ["#7E6B5A", "#2B2B2B"],
    featured: false,
  },
  {
    id: uuidv4(),
    name: "Gallery Night Loafer",
    description:
      "Soft-structured loafer in matte charcoal suede with hand-rolled apron stitching and flexible leather sole.",
    price: 560,
    category: "Formal",
    images: [
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1543076447-215ad9ba6923?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1574344148302-46a574c3dc19?auto=format&fit=crop&w=1600&q=80",
    ],
    sizes: baseSizes,
    colors: ["#2B2B2B", "#F5F1EB"],
    featured: false,
  },
  {
    id: uuidv4(),
    name: "Sunlit Court Sneaker",
    description:
      "Court-inspired sneaker in grained ivory leather with brushed taupe overlays and gold foil signature. Finished with a cushioned collar and stitched rubber outsole.",
    price: 610,
    category: "Sneakers",
    images: [
      "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1549298916-3834c2cbd6ac?auto=format&fit=crop&w=1600&q=80",
    ],
    sizes: baseSizes,
    colors: ["#F5F1EB", "#7E6B5A", "#BFA06F"],
    featured: true,
  },
];

// Build stock map for each product (1-8 pairs per size/color)
products.forEach((p) => {
  const map = {};
  p.sizes.forEach((size) => {
    p.colors.forEach((color) => {
      const base = 2 + Math.floor(Math.random() * 7); // 2-8
      map[stockKey(size, color)] = base;
    });
  });
  p.stockBySizeColor = map;
});

export const getProductById = (id) => products.find((p) => p.id === id) || null;

export const listFeaturedProducts = () => products.filter((p) => p.featured);

export const computeStock = (product, size, color) => {
  if (!product || size == null || !color) return 0;
  const key = stockKey(size, color);
  return product.stockBySizeColor?.[key] ?? 0;
};

export const computeCartLineTotal = (product, quantity) => {
  if (!product) return 0;
  return product.price * quantity;
};

export const computeCartTotal = (cartItems) => {
  return cartItems.reduce((sum, line) => {
    const product = getProductById(line.productId);
    return sum + computeCartLineTotal(product, line.quantity);
  }, 0);
};

export const formatMoney = (value) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
};

export const maskCardNumber = (cardNumber) => {
  if (!cardNumber) return "";
  const digits = cardNumber.replace(/\D/g, "");
  if (digits.length < 4) return "****";
  const last4 = digits.slice(-4);
  return `•••• •••• •••• ${last4}`;
};

export const makeDeliveryEstimate = () => {
  const now = new Date();
  const minDays = 5;
  const maxDays = 8;
  const days = minDays + Math.floor(Math.random() * (maxDays - minDays + 1));
  const delivery = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);
  return delivery.toISOString();
};

export const createOrder = ({ items, shippingInfo, paymentInfo }) => {
  const totalPrice = computeCartTotal(items);
  const orderDate = new Date().toISOString();
  const deliveryEstimate = makeDeliveryEstimate();
  const id = uuidv4();
  return {
    id,
    items,
    shippingInfo,
    paymentInfo: {
      cardNumber: maskCardNumber(paymentInfo.cardNumber),
      brand: paymentInfo.brand || "Jootiya MockCard",
    },
    totalPrice,
    orderDate,
    deliveryEstimate,
  };
};

export const saveOrderToStorage = (order) => {
  try {
    const existing = JSON.parse(localStorage.getItem("jootiya_orders") || "[]");
    existing.push(order);
    localStorage.setItem("jootiya_orders", JSON.stringify(existing));
  } catch (e) {
    console.error("Failed to save order", e);
  }
};

export const loadLastOrder = () => {
  try {
    const existing = JSON.parse(localStorage.getItem("jootiya_orders") || "[]");
    return existing[existing.length - 1] || null;
  } catch (e) {
    console.error("Failed to load order", e);
    return null;
  }
};

export const CART_STORAGE_KEY = "jootiya_cart";

export const loadCartFromStorage = () => {
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch (e) {
    console.error("Failed to load cart", e);
    return [];
  }
};

export const saveCartToStorage = (cart) => {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  } catch (e) {
    console.error("Failed to save cart", e);
  }
};

export const EMPTY_SHIPPING_INFO = {
  name: "",
  addressLine1: "",
  addressLine2: "",
  city: "",
  state: "",
  zip: "",
  phone: "",
};

export const validatePhone = (value) => {
  if (!value) return false;
  return /^\+?\d{10,15}$/.test(value);
};

export const validateCardNumber = (value) => {
  if (!value) return false;
  const digits = value.replace(/\D/g, "");
  return digits.length === 16;
};

export const formatCardInput = (value) => {
  const digits = value.replace(/\D/g, "").slice(0, 16);
  const groups = digits.match(/.{1,4}/g) || [];
  return groups.join(" ");
};

export const ROUTES = {
  HOME: "/",
  PRODUCT: (id = ":id") => `/product/${id}`,
  CHECKOUT: "/checkout",
  CONFIRMATION: "/order-confirmation",
};

export const parseRoute = (pathname) => {
  if (pathname === ROUTES.HOME) return { name: "home" };
  if (pathname === ROUTES.CHECKOUT) return { name: "checkout" };
  if (pathname === ROUTES.CONFIRMATION) return { name: "confirmation" };
  if (pathname.startsWith("/product/")) {
    const id = pathname.replace("/product/", "");
    return { name: "product", id };
  }
  return { name: "home" };
};