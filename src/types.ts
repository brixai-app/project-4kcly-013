export type Product = {
  id: string;
  name: string;
  slug: string;
  price: number;
  currency?: string;
  category: string;
  artisanId?: string;
  description?: string;
  image: string;
  images?: string[];
  sizes?: string[];
  colors?: string[];
  inStock?: boolean;
  featured?: boolean;
  material?: string;
  origin?: string;
  care?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type Artisan = {
  id: string;
  name: string;
  slug: string;
  title?: string;
  location?: string;
  bio?: string;
  portrait?: string;
  specialties?: string[];
  yearsActive?: number;
  featured?: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export type CartItem = {
  id: string;
  productId: string;
  product?: Product;
  name: string;
  price: number;
  quantity: number;
  image: string;
  size?: string;
  color?: string;
};

export type Order = {
  id: string;
  userId?: string;
  items: CartItem[];
  subtotal: number;
  shipping?: number;
  discount?: number;
  total: number;
  currency?: string;
  status: "pending" | "confirmed" | "packed" | "shipped" | "delivered" | "cancelled";
  shippingAddress?: string;
  paymentMethod?: string;
  promoCode?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type UserProfile = {
  id: string;
  name?: string;
  email?: string;
  phone?: string;
  avatar?: string;
  role?: "customer" | "artisan" | "admin";
  city?: string;
  country?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type CustomOrderRequest = {
  id: string;
  userId?: string;
  name: string;
  email: string;
  phone?: string;
  occasion?: string;
  notes?: string;
  budget?: number;
  preferredColors?: string[];
  preferredMaterials?: string[];
  status?: "new" | "reviewing" | "quoted" | "approved" | "in_progress" | "completed" | "declined";
  createdAt?: string;
  updatedAt?: string;
};

export type FilterOption = {
  label: string;
  value: string;
  count?: number;
};

export type ProductFilters = {
  query?: string;
  category?: string;
  artisanId?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  featured?: boolean;
  sortBy?: "featured" | "newest" | "price-asc" | "price-desc" | "name-asc";
};

export type ApiResponse<T> = {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
};

export type PaginatedResponse<T> = ApiResponse<T[]> & {
  page?: number;
  pageSize?: number;
  total?: number;
  totalPages?: number;
};

export type AuthSessionResponse = ApiResponse<{
  user: UserProfile | null;
  sessionId?: string;
}>;

export default {
  Product: undefined,
  Artisan: undefined,
  CartItem: undefined,
  Order: undefined,
  UserProfile: undefined,
  CustomOrderRequest: undefined,
  FilterOption: undefined,
  ProductFilters: undefined,
  ApiResponse: undefined,
  PaginatedResponse: undefined,
  AuthSessionResponse: undefined,
};