export type PaymentMethod = 'card' | 'upi' | 'cod';

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  image: string;
  description?: string;
  artisan?: string;
  material?: string;
  sizes?: string[];
  featured?: boolean;
  inStock?: boolean;
  rating?: number;
  tags?: string[];
}

export interface Artisan {
  id: string;
  name: string;
  location: string;
  specialty: string;
  story?: string;
  image?: string;
}

export interface CartItem {
  productId: string;
  quantity: number;
  size?: string;
  product?: Product;
}

export interface ShippingInfo {
  fullName: string;
  phone: string;
  email: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface Order {
  id: string;
  items: CartItem[];
  shipping: ShippingInfo;
  paymentMethod: PaymentMethod;
  subtotal: number;
  shippingFee: number;
  total: number;
  status: 'pending' | 'confirmed' | 'packed' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: string;
}

export interface ProductFilters {
  query: string;
  category: string;
  priceRange: [number, number];
  artisan?: string;
  inStockOnly?: boolean;
}

export interface ShopSortOption {
  label: string;
  value: 'featured' | 'price-asc' | 'price-desc' | 'newest';
}

export interface CheckoutFormState {
  shipping: ShippingInfo;
  paymentMethod: PaymentMethod;
  notes?: string;
}

export default {};