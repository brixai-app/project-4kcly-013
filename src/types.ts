export type Product = {
  id: string;
  name: string;
  slug: string;
  price: number;
  image: string;
  gallery?: string[];
  category: string;
  collection?: string;
  description?: string;
  artisanId?: string;
  sizes?: string[];
  colors?: string[];
  featured?: boolean;
  inStock?: boolean;
  material?: string;
  origin?: string;
};

export type Artisan = {
  id: string;
  name: string;
  location?: string;
  craft?: string;
  bio?: string;
  portrait?: string;
  yearsExperience?: number;
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
  phone?: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
};

export type Order = {
  id: string;
  userId?: string;
  items: CartItem[];
  shipping: ShippingInfo;
  subtotal: number;
  shippingCost: number;
  total: number;
  status: "pending" | "paid" | "fulfilled" | "cancelled";
  createdAt: string;
};

export type Filter = {
  query?: string;
  category?: string;
  collection?: string;
  priceMin?: number;
  priceMax?: number;
  inStockOnly?: boolean;
  featuredOnly?: boolean;
  artisanId?: string;
};

export type AuthUser = {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
};

export type AuthSession = {
  user?: AuthUser | null;
  expires?: string | null;
};

export type AuthCredentials = {
  email: string;
  password: string;
  name?: string;
};

export default {};