export type ProductCategory = 'Mojri' | 'Jutti' | 'Slip-on' | 'Wedding' | 'Heritage' | 'Limited';

export interface Product {
  id: string;
  name: string;
  category: ProductCategory | string;
  price: number;
  image: string;
  images?: string[];
  artisanId?: string;
  description?: string;
  details?: string[];
  sizes?: string[];
  color?: string;
  material?: string;
  inStock?: boolean;
  featured?: boolean;
  rating?: number;
  reviewCount?: number;
}

export interface Artisan {
  id: string;
  name: string;
  location: string;
  specialty: string;
  portrait: string;
  story?: string;
  yearsExperience?: number;
  featured?: boolean;
}

export interface CartItem {
  productId: string;
  quantity: number;
  size?: string;
  color?: string;
}

export interface ShippingInfo {
  fullName: string;
  email: string;
  phone: string;
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
  subtotal: number;
  shippingFee: number;
  total: number;
  status: 'pending' | 'confirmed' | 'packed' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: string;
}

export interface CustomOrderRequest {
  id?: string;
  name: string;
  email: string;
  phone: string;
  occasion: string;
  size: string;
  colorPreference?: string;
  notes?: string;
  budget?: string;
}

export interface ProductFilters {
  query: string;
  category: string;
  size: string;
  priceRange: string;
  featuredOnly: boolean;
}

export interface ShopSortOption {
  label: string;
  value: string;
}

export interface FilterOption {
  label: string;
  value: string;
}

export interface NavigationLink {
  label: string;
  href: string;
}

export interface AuthFormValues {
  name?: string;
  email: string;
  password: string;
}

export default {};