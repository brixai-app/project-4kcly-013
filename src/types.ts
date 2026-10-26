export type CatalogFilter = {
  query: string;
  category: string;
  occasion: string;
  size: string;
  priceRange: string;
  artisan: string;
  sortBy: string;
};

export type ShippingInfo = {
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

export type Product = {
  id: string;
  name: string;
  category: string;
  occasion: string;
  artisanId: string;
  artisanName: string;
  price: number;
  originalPrice?: number;
  description: string;
  details?: string[];
  sizes: string[];
  colors?: string[];
  image: string;
  gallery?: string[];
  featured?: boolean;
  inStock?: boolean;
  material?: string;
  care?: string;
  fit?: string;
  origin?: string;
};

export type Artisan = {
  id: string;
  name: string;
  location: string;
  specialty: string;
  story: string;
  image: string;
  yearsActive?: number;
  techniques?: string[];
};

export type CartItem = {
  productId: string;
  quantity: number;
  size?: string;
  color?: string;
};

export type Order = {
  id: string;
  items: CartItem[];
  shipping: ShippingInfo;
  subtotal: number;
  shippingCost: number;
  total: number;
  createdAt: string;
  status: string;
  notes?: string;
};

export type CustomOrderRequest = {
  fullName: string;
  email: string;
  phone: string;
  occasion: string;
  size: string;
  colorPreference: string;
  budget: string;
  timeline: string;
  notes: string;
};

export type CheckoutFormValues = ShippingInfo & {
  notes?: string;
  paymentMethod: string;
};

export default {};