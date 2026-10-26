export type ProductCategory = 'mojri' | 'juttis' | 'bridal' | 'mens' | 'womens' | 'artisan';

export type ProductSize = 'XS' | 'S' | 'M' | 'L' | 'XL' | 'UK 6' | 'UK 7' | 'UK 8' | 'UK 9' | 'UK 10' | 'UK 11';

export type ProductColor = 'ivory' | 'maroon' | 'antique-gold' | 'tan' | 'black' | 'rust';

export interface Artisan {
  id: string;
  name: string;
  location: string;
  lineage: string;
  specialty: string;
  portraitUrl?: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  category: ProductCategory;
  price: number;
  description: string;
  image: string;
  gallery?: string[];
  artisanId?: string;
  artisanName?: string;
  colors?: ProductColor[];
  sizes?: ProductSize[];
  featured?: boolean;
  inStock?: boolean;
  material?: string;
  craftsmanship?: string;
}

export interface CartItem {
  productId: string;
  quantity: number;
  size?: ProductSize;
  color?: ProductColor;
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
}

export interface PaymentInfo {
  method: 'card' | 'upi' | 'cod';
  last4?: string;
  provider?: string;
  transactionId?: string;
}

export interface Order {
  id: string;
  userId?: string;
  items: CartItem[];
  shipping: ShippingInfo;
  payment: PaymentInfo;
  subtotal: number;
  shippingFee: number;
  total: number;
  status: 'pending' | 'confirmed' | 'packed' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: string;
}

export interface CatalogFilters {
  query: string;
  category: ProductCategory | 'all';
  artisanId: string | 'all';
  priceRange: [number, number];
  sortBy: 'featured' | 'newest' | 'price-asc' | 'price-desc';
}

export interface CatalogFilterOption<T extends string = string> {
  label: string;
  value: T;
}

export interface CatalogFilterGroup<T extends string = string> {
  label: string;
  options: CatalogFilterOption<T>[];
}

export interface CheckoutPayload {
  items: CartItem[];
  shipping: ShippingInfo;
  payment: PaymentInfo;
}

export type AppTypes = {
  Product: Product;
  Artisan: Artisan;
  CartItem: CartItem;
  Order: Order;
  ShippingInfo: ShippingInfo;
  PaymentInfo: PaymentInfo;
  CatalogFilters: CatalogFilters;
};

export default AppTypes;