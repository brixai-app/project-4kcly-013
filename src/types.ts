export type Product = {
  id: string;
  name: string;
  slug: string;
  price: number;
  description: string;
  category: string;
  collection?: string;
  image: string;
  images?: string[];
  sizes?: string[];
  colors?: string[];
  artisan?: Artisan;
  rating?: number;
  reviewCount?: number;
  inStock?: boolean;
  featured?: boolean;
};

export type Artisan = {
  id: string;
  name: string;
  location?: string;
  craft?: string;
  bio?: string;
  image?: string;
};

export type Review = {
  id: string;
  productId: string;
  author: string;
  rating: number;
  title?: string;
  body: string;
  createdAt?: string;
};

export type CartItem = {
  product: Product;
  quantity: number;
  selectedSize?: string;
  selectedColor?: string;
};

export type ShippingDetails = {
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

export type PaymentMethod = "card" | "upi" | "cod";

export type Order = {
  id: string;
  items: CartItem[];
  shipping: ShippingDetails;
  paymentMethod: PaymentMethod;
  subtotal: number;
  shippingFee: number;
  total: number;
  status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";
  createdAt: string;
};

export type ApiResponse<T> = {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
};

export type ProductsResponse = ApiResponse<Product[]>;
export type ProductResponse = ApiResponse<Product>;
export type ReviewsResponse = ApiResponse<Review[]>;
export type OrderResponse = ApiResponse<Order>;
export type OrdersResponse = ApiResponse<Order[]>;
export type AuthResponse = ApiResponse<{
  user?: {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
  } | null;
}>;

export default Product;