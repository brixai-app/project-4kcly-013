export type ProductSize = 'UK 5' | 'UK 6' | 'UK 7' | 'UK 8' | 'UK 9' | 'UK 10';

export interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  compareAtPrice?: number | null;
  category: string;
  collection: string;
  description: string;
  image: string;
  gallery: string[];
  artisanId: string;
  featured?: boolean;
  newArrival?: boolean;
  inStock?: boolean;
  sizes: ProductSize[];
  materials: string[];
  color: string;
  rating?: number;
  reviewCount?: number;
}

export interface Artisan {
  id: string;
  name: string;
  title: string;
  location: string;
  story: string;
  image: string;
  specialties: string[];
  yearsActive?: number;
}

export interface Review {
  id: string;
  productId: string;
  author: string;
  rating: number;
  title: string;
  body: string;
  createdAt: string;
}

export interface CartItem {
  productId: string;
  quantity: number;
  size: ProductSize;
  price: number;
  name: string;
  image: string;
  slug: string;
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
  country: 'India';
}

export interface PaymentInfo {
  method: 'card' | 'upi' | 'cod';
  cardHolderName?: string;
  cardNumber?: string;
  expiryMonth?: string;
  expiryYear?: string;
  cvv?: string;
  upiId?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  items: CartItem[];
  subtotal: number;
  shipping: number;
  total: number;
  shippingInfo: ShippingInfo;
  paymentInfo: PaymentInfo;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered';
  createdAt: string;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  image?: string | null;
}

export interface SessionUser {
  user: AuthUser | null;
  expires?: string | null;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}

export default {} as const;