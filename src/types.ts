export type ProductCategory = 'Mojri' | 'Jutti' | 'Kolhapuri' | 'Accessories' | 'New In' | 'Best Sellers';

export type ShippingMethod = {
  id: string;
  label: string;
  eta: string;
  price: number;
};

export type PaymentMethod = 'card' | 'upi' | 'cod' | 'wallet';

export type FilterState = {
  query: string;
  categories: ProductCategory[];
  priceRange: [number, number];
  sortBy: 'featured' | 'newest' | 'price-asc' | 'price-desc';
};

export type Artisan = {
  id: string;
  name: string;
  location: string;
  specialty: string;
  portraitUrl: string;
  story: string;
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  category: ProductCategory;
  price: number;
  compareAtPrice?: number | null;
  description: string;
  image: string;
  gallery?: string[];
  artisanId?: string | null;
  sizes: string[];
  colors?: string[];
  inStock: boolean;
  featured?: boolean;
  newArrival?: boolean;
  rating?: number;
  reviewCount?: number;
  material?: string;
  care?: string;
};

export type CartItem = {
  productId: string;
  quantity: number;
  size: string;
  color?: string | null;
};

export type CustomerProfile = {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
};

export type OrderStatus = 'pending' | 'paid' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export type Order = {
  id: string;
  customer: CustomerProfile;
  items: CartItem[];
  subtotal: number;
  shipping: number;
  total: number;
  shippingMethod: ShippingMethod;
  paymentMethod: PaymentMethod;
  status: OrderStatus;
  createdAt: string;
};

export type AuthSessionUser = {
  id: string;
  name: string;
  email: string;
  image?: string | null;
};

export type AuthCredentials = {
  email: string;
  password: string;
  name?: string;
};

export type AuthResponse = {
  user: AuthSessionUser | null;
  token?: string | null;
  error?: string | null;
};

export default {};