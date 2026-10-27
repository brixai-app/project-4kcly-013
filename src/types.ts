export type Product = {
  id: string;
  name: string;
  slug: string;
  price: number;
  description: string;
  category: string;
  collection: string;
  material: string;
  color: string;
  sizes: string[];
  image: string;
  gallery?: string[];
  featured?: boolean;
  artisan?: string;
  origin?: string;
  inStock?: boolean;
};

export type ArtisanStory = {
  id: string;
  name: string;
  title: string;
  story: string;
  image: string;
  location?: string;
  years?: number;
};

export type CartItem = {
  productId: string;
  name: string;
  slug: string;
  price: number;
  image: string;
  quantity: number;
  size?: string;
  color?: string;
};

export type Cart = {
  items: CartItem[];
  subtotal: number;
  itemCount: number;
};

export type Filter = {
  categories: string[];
  collections: string[];
  materials: string[];
  sizes: string[];
  colors: string[];
  priceRange: [number, number];
  search: string;
};

export type Variant = {
  id: string;
  label: string;
  value: string;
  available?: boolean;
};

export type PersistedOrder = {
  id: string;
  cartId?: string;
  customerName: string;
  email: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  notes?: string;
  items: CartItem[];
  subtotal: number;
  status: "draft" | "submitted" | "confirmed" | "cancelled";
  createdAt: string;
  updatedAt?: string;
};

export default {};