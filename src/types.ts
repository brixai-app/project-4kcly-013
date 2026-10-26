export type Product = {
  id: string;
  slug: string;
  name: string;
  category: string;
  collection: string;
  price: number;
  originalPrice?: number | null;
  description: string;
  story?: string;
  image: string;
  images?: string[];
  artisanId?: string | null;
  material?: string;
  color?: string;
  sizes?: string[];
  inStock: boolean;
  stock: number;
  featured?: boolean;
  tags?: string[];
};

export type Artisan = {
  id: string;
  name: string;
  village?: string;
  district?: string;
  specialty: string;
  bio: string;
  portrait?: string;
  yearsActive?: number;
  techniques?: string[];
};

export type CartItem = {
  productId: string;
  quantity: number;
  size?: string | null;
  color?: string | null;
};

export type ShippingInfo = {
  fullName: string;
  phone: string;
  email: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
};

export type PaymentInfo = {
  method: "cod" | "upi" | "card" | "netbanking";
  upiId?: string;
  cardLast4?: string;
  cardholderName?: string;
};

export type Order = {
  id: string;
  orderNumber: string;
  items: CartItem[];
  shipping: ShippingInfo;
  payment: PaymentInfo;
  subtotal: number;
  shippingFee: number;
  total: number;
  status: "pending" | "confirmed" | "packed" | "shipped" | "delivered" | "cancelled";
  createdAt: string;
};

export type FilterState = {
  query: string;
  categories: string[];
  collections: string[];
  priceRange: [number, number];
  inStockOnly: boolean;
  artisanIds: string[];
};

export type CheckoutValidationErrors = Partial<{
  fullName: string;
  phone: string;
  email: string;
  addressLine1: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  paymentMethod: string;
  upiId: string;
  cardholderName: string;
  cardLast4: string;
}>;

export type CheckoutValidationResult = {
  valid: boolean;
  errors: CheckoutValidationErrors;
};

export default Product;