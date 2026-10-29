export type MojriProduct = {
  id: string;
  name: string;
  slug: string;
  price: number;
  description: string;
  category: string;
  collection: string;
  artisanId: string;
  image: string;
  gallery: string[];
  sizes: string[];
  colors: string[];
  featured?: boolean;
  inStock?: boolean;
  provenance?: string;
  care?: string;
};

export type Artisan = {
  id: string;
  name: string;
  slug: string;
  location: string;
  specialty: string;
  story: string;
  portrait: string;
  yearsActive?: number;
  techniques: string[];
};

export type CartItem = {
  productId: string;
  quantity: number;
  size?: string;
  color?: string;
};

export type UserSession = {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  createdAt: string;
};

export type CheckoutForm = {
  fullName: string;
  email: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  paymentMethod: "cod" | "upi" | "card";
};

export type FilterState = {
  query: string;
  category: string;
  collection: string;
  artisanId: string;
  priceRange: [number, number];
  sortBy: "featured" | "newest" | "price-asc" | "price-desc";
};

export type OrderItem = {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  size?: string;
  color?: string;
  image?: string;
};

export type Order = {
  id: string;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  total: number;
  customer: CheckoutForm;
  createdAt: string;
  status: "placed" | "processing" | "shipped" | "delivered";
};

export default {};