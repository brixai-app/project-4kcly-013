export type ProductCategory = 'mojri' | 'juttis' | 'bridal' | 'everyday' | 'limited';

export interface Artisan {
  id: string;
  name: string;
  location: string;
  specialty?: string;
  portraitUrl?: string;
  story?: string;
}

export interface Product {
  id: string;
  name: string;
  category: ProductCategory | string;
  price: number;
  originalPrice?: number;
  description?: string;
  imageUrl: string;
  gallery?: string[];
  artisanId?: string;
  artisan?: Artisan;
  sizes?: string[];
  colors?: string[];
  material?: string;
  inStock?: boolean;
  featured?: boolean;
  newArrival?: boolean;
  limitedEdition?: boolean;
  slug?: string;
}

export interface CartItem {
  productId: string;
  quantity: number;
  size?: string;
  color?: string;
  price: number;
  product?: Product;
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
  notes?: string;
}

export interface Order {
  id: string;
  items: CartItem[];
  shipping: ShippingInfo;
  subtotal: number;
  shippingFee: number;
  total: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: string;
  customerEmail?: string;
}

export interface CustomOrderRequest {
  id?: string;
  name: string;
  email: string;
  phone?: string;
  occasion?: string;
  size?: string;
  colorPreference?: string;
  budget?: string;
  notes?: string;
  createdAt?: string;
}

export interface CatalogFilterState {
  category: string;
  size: string;
  color: string;
  priceRange: string;
  search: string;
  sort: string;
}

export interface CatalogFilterOption {
  label: string;
  value: string;
}

export interface CatalogFilterGroup {
  key: keyof CatalogFilterState;
  label: string;
  options: CatalogFilterOption[];
}

export default Product;