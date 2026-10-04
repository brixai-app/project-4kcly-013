export type Size = 35 | 36 | 37 | 38 | 39 | 40 | 41 | 42 | 43 | 44 | 45 | 46;
export type ShoeSize = Size;
export type Category = "sneakers" | "loafers" | "boots" | "heels" | "sandals";
export type CatalogSort = "featured" | "price-asc" | "price-desc" | "newest";

export interface Product {
  id: string;
  slug: string;
  name: string;
  category: Category;
  collection: string;
  description: string;
  price: number;
  image: string;
  images: string[];
  sizes: Size[];
  stock: Partial<Record<Size, number>>;
  color: string;
  material: string;
  featured?: boolean;
  isNew?: boolean;
}

export interface CartItem {
  id: string;
  product: Product;
  size: Size;
  quantity: number;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  wishlist: string[];
}

export interface CatalogFilters {
  search: string;
  categories: Category[];
  sizes: Size[];
  minPrice: number | null;
  maxPrice: number | null;
  sort: CatalogSort;
  inStockOnly: boolean;
}

export interface EditorialStory {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  href: string;
  caption?: string;
}

export interface CheckoutValues {
  fullName: string;
  email: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  phone?: string;
}

export interface Order {
  id: string;
  items: CartItem[];
  customer: CheckoutValues;
  subtotal: number;
  shipping: number;
  total: number;
  currency: "INR";
  createdAt: string;
  status: "confirmed" | "cancelled";
  isMock: true;
}

export type types = { Product: Product; CartItem: CartItem; UserProfile: UserProfile; CatalogFilters: CatalogFilters; EditorialStory: EditorialStory; CheckoutValues: CheckoutValues; Order: Order; Size: Size; Category: Category };
export type { types as default };