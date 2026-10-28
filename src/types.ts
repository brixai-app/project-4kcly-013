export type ProductCategory = 'Mojri' | 'Jutti' | 'Slip-on' | 'Wedding' | 'Heritage' | 'Everyday';
export type ProductGender = 'Men' | 'Women' | 'Unisex';
export type ProductAvailability = 'in_stock' | 'low_stock' | 'preorder' | 'sold_out';

export interface Product {
  id: string;
  slug: string;
  name: string;
  category: ProductCategory;
  gender: ProductGender;
  price: number;
  compareAtPrice?: number | null;
  description: string;
  artisan: string;
  material: string;
  color: string;
  sizes: string[];
  image: string;
  gallery?: string[];
  rating?: number;
  reviewCount?: number;
  availability?: ProductAvailability;
  featured?: boolean;
  newArrival?: boolean;
  handcrafted?: boolean;
  stock?: number;
  tags?: string[];
}

export interface Artisan {
  id: string;
  name: string;
  location: string;
  specialty: string;
  story: string;
  portrait: string;
  yearsActive?: number;
  signature?: string[];
}

export interface CartItem {
  productId: string;
  quantity: number;
  size: string;
  product?: Product;
}

export interface OrderAddress {
  fullName: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface Order {
  id: string;
  userId?: string | null;
  items: CartItem[];
  subtotal: number;
  shipping: number;
  total: number;
  currency: string;
  status: 'pending' | 'confirmed' | 'packed' | 'shipped' | 'delivered' | 'cancelled';
  shippingAddress: OrderAddress;
  createdAt: string;
  updatedAt?: string;
}

export interface CustomOrderRequest {
  id?: string;
  name: string;
  phone: string;
  email?: string;
  occasion: string;
  size: string;
  colorPreference?: string;
  notes?: string;
  referenceImages?: string[];
  status?: 'new' | 'reviewing' | 'quoted' | 'approved' | 'in_production' | 'completed';
  createdAt?: string;
}

export interface ProductFilterState {
  query: string;
  categories: ProductCategory[];
  genders: ProductGender[];
  sizes: string[];
  priceRange: [number, number];
  availability: ProductAvailability[];
  featuredOnly: boolean;
  handcraftedOnly: boolean;
  sortBy: 'featured' | 'newest' | 'price-asc' | 'price-desc' | 'rating';
}

export interface CheckoutPayload {
  items: CartItem[];
  shippingAddress: OrderAddress;
  paymentMethod: 'card' | 'upi' | 'cod';
  notes?: string;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface ApiErrorResponse {
  success: false;
  message: string;
  code?: string;
  details?: unknown;
}

export interface ProductsResponse extends ApiResponse<Product[]> {}
export interface ProductResponse extends ApiResponse<Product> {}
export interface OrdersResponse extends ApiResponse<Order[]> {}
export interface OrderResponse extends ApiResponse<Order> {}
export interface ArtisanResponse extends ApiResponse<Artisan[]> {}
export interface CheckoutResponse extends ApiResponse<Order> {}

export type FilterPayload = ProductFilterState;
export type CheckoutRequest = CheckoutPayload;

const types = {};
export default types;