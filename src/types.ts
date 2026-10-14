export type Size = 'EU 36' | 'EU 37' | 'EU 38' | 'EU 39' | 'EU 40' | 'EU 41' | 'EU 42' | 'EU 43' | 'EU 44';

export type ColorVariant = 'Black' | 'White' | 'Tan' | 'Cognac' | 'Ivory' | 'Burgundy' | 'Navy' | 'Olive';

export type StockKey = `${Size}-${ColorVariant}`;

export type Category =
  | 'Heels'
  | 'Loafers'
  | 'Sneakers'
  | 'Sandals'
  | 'Boots'
  | 'Mules'
  | 'Slides';

export interface ProductImage {
  url: string;
  alt: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  currency: 'INR';
  category: Category;
  collection: string;
  featured: boolean;
  images: ProductImage[];
  sizes: Size[];
  colors: ColorVariant[];
  stockByKey: Record<StockKey, number>;
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  currency: 'INR';
  size: Size;
  color: ColorVariant;
  quantity: number;
  imageUrl: string;
  maxAvailable: number;
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

export type PaymentMethod = 'card' | 'upi' | 'cod';

export interface Order {
  id: string;
  items: CartItem[];
  subtotal: number;
  shippingFee: number;
  total: number;
  currency: 'INR';
  shippingInfo: ShippingInfo;
  paymentMethod: PaymentMethod;
  createdAt: string;
}

export interface CartState {
  items: CartItem[];
  lastUpdated: string | null;
}

const defaultTypes = {};
export default defaultTypes;