export type Product = {
  id: string;
  name: string;
  slug: string;
  price: number;
  description: string;
  category: string;
  artisanId: string;
  image: string;
  gallery?: string[];
  sizes?: string[];
  colors?: string[];
  featured?: boolean;
  inStock?: boolean;
  rating?: number;
};

export type Artisan = {
  id: string;
  name: string;
  title: string;
  location: string;
  bio: string;
  image: string;
  specialties?: string[];
};

export type CartItem = {
  productId: string;
  quantity: number;
  size?: string;
  color?: string;
};

export type ShippingInfo = {
  fullName: string;
  email: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
};

export type PaymentInfo = {
  method: "cod" | "upi" | "card" | "wallet";
  transactionId?: string;
  last4?: string;
  status?: "pending" | "authorized" | "paid" | "failed";
};

export type Order = {
  id: string;
  userId?: string;
  items: CartItem[];
  shipping: ShippingInfo;
  payment: PaymentInfo;
  subtotal: number;
  shippingFee: number;
  total: number;
  status: "draft" | "placed" | "processing" | "shipped" | "delivered" | "cancelled";
  createdAt: string;
};

export type Filter = {
  categories: string[];
  artisans: string[];
  priceRange: [number, number];
  search: string;
  sortBy: "featured" | "newest" | "price-asc" | "price-desc";
};

export type CheckoutStep = "cart" | "shipping" | "payment" | "review" | "confirmation";

export default Product;