export type Product = {
  id: string;
  name: string;
  slug: string;
  price: number;
  currency?: string;
  category: string;
  collection?: string;
  description?: string;
  image: string;
  gallery?: string[];
  artisan?: string;
  origin?: string;
  material?: string;
  sizes?: string[];
  featured?: boolean;
  inStock?: boolean;
  rating?: number;
  reviewCount?: number;
};

export type Review = {
  id: string;
  productId: string;
  author: string;
  rating: number;
  title?: string;
  body: string;
  createdAt: string;
};

export type CartItem = {
  productId: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  size?: string;
  color?: string;
};

export type Order = {
  id: string;
  orderNumber: string;
  items: CartItem[];
  subtotal: number;
  shipping: number;
  total: number;
  currency?: string;
  customerName: string;
  email: string;
  phone?: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  status: "pending" | "paid" | "processing" | "shipped" | "delivered" | "cancelled";
  createdAt: string;
};

export type CheckoutField = {
  name: string;
  label: string;
  type: "text" | "email" | "tel" | "textarea" | "select";
  required?: boolean;
  placeholder?: string;
  autoComplete?: string;
  options?: string[];
};

export type ApiResponse<T> = {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
};

export type ProductsResponse = ApiResponse<Product[]>;
export type ProductResponse = ApiResponse<Product>;
export type ReviewsResponse = ApiResponse<Review[]>;
export type OrderResponse = ApiResponse<Order>;
export type OrdersResponse = ApiResponse<Order[]>;
export type CartResponse = ApiResponse<CartItem[]>;
export type CheckoutResponse = ApiResponse<{ orderId: string; orderNumber: string }>;

export default {};