export type ProductCategory =
  | 'sneakers'
  | 'loafers'
  | 'boots'
  | 'sandals'
  | 'heels'
  | 'slides'
  | 'derby'
  | 'oxford'
  | 'limited'
  | 'accessories';

export type ProductTag =
  | 'new'
  | 'bestseller'
  | 'exclusive'
  | 'limited-run'
  | 'editorial-pick'
  | 'handmade'
  | 'vegan'
  | 'leather'
  | 'evening'
  | 'street'
  | 'minimal'
  | 'arch-support';

export type ProductColorToken =
  | 'ivory'
  | 'sand'
  | 'taupe'
  | 'charcoal'
  | 'black'
  | 'white'
  | 'crimson'
  | 'olive'
  | 'navy'
  | 'cognac';

export type ProductSizeScale = 'EU' | 'UK' | 'US';

export type SortDirection = 'asc' | 'desc';

export type ProductSortField =
  | 'price'
  | 'name'
  | 'createdAt'
  | 'popularity'
  | 'featured';

export type ProductSortOptionId =
  | 'featured'
  | 'price-low-high'
  | 'price-high-low'
  | 'new-arrivals'
  | 'name-a-z';

export interface ProductSortOption {
  id: ProductSortOptionId;
  label: string;
  field: ProductSortField;
  direction: SortDirection;
}

export interface ProductVariantSize {
  id: string;
  sizeLabel: string;
  scale: ProductSizeScale;
  value: number;
  stock: number;
  isDefault?: boolean;
}

export interface ProductImage {
  id: string;
  url: string;
  alt: string;
  priority?: boolean;
}

export interface ProductMetadata {
  heelHeightMm?: number;
  weightGrams?: number;
  upperMaterial?: string;
  liningMaterial?: string;
  soleMaterial?: string;
  construction?: string;
  countryOfOrigin?: string;
  careInstructions?: string;
  fitNote?: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  subtitle?: string;
  description: string;
  category: ProductCategory;
  collection?: string;
  price: number;
  compareAtPrice?: number;
  currency: string;
  images: ProductImage[];
  colors: ProductColorToken[];
  primaryColor: ProductColorToken;
  sizes: ProductVariantSize[];
  tags: ProductTag[];
  isFeatured?: boolean;
  isLimited?: boolean;
  createdAt: string;
  popularityScore?: number;
  metadata?: ProductMetadata;
}

export interface CartItem {
  id: string;
  productId: string;
  sizeId: string;
  quantity: number;
  unitPrice: number;
  currency: string;
  addedAt: string;
}

export interface CartItemResolved extends CartItem {
  product: Product;
  size: ProductVariantSize;
  lineTotal: number;
}

export type CartStatus = 'idle' | 'updating' | 'checking-out';

export interface CartTotals {
  subtotal: number;
  shipping: number;
  tax: number;
  discount: number;
  grandTotal: number;
  currency: string;
}

export interface CartState {
  items: CartItem[];
  status: CartStatus;
  currency: string;
  lastUpdatedAt?: string;
}

export interface CartPersistedState extends CartState {
  version: number;
}

export type ShippingMethodId = 'standard' | 'express';

export interface ShippingMethod {
  id: ShippingMethodId;
  label: string;
  description: string;
  amount: number;
  estimatedDaysMin: number;
  estimatedDaysMax: number;
}

export type PaymentMethodId = 'card' | 'cod';

export interface UserShippingInfo {
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

export interface CheckoutFormState {
  shipping: UserShippingInfo;
  shippingMethodId: ShippingMethodId;
  paymentMethodId: PaymentMethodId;
  agreeToTerms: boolean;
  subscribeToNewsletter: boolean;
}

export interface CheckoutValidationError {
  field: string;
  message: string;
}

export interface CheckoutResult {
  success: boolean;
  orderId?: string;
  errors?: CheckoutValidationError[];
}

export interface ProductFilterState {
  query: string;
  categories: ProductCategory[];
  tags: ProductTag[];
  colors: ProductColorToken[];
  priceMin?: number;
  priceMax?: number;
  onlyInStock: boolean;
  onlyFeatured: boolean;
}

export interface ActiveSortState {
  optionId: ProductSortOptionId;
  field: ProductSortField;
  direction: SortDirection;
}

export interface MasonryColumnConfig {
  minWidth: number;
  columnCount: number;
}

export interface BreadcrumbItem {
  label: string;
  href: string;
  isCurrent?: boolean;
}

export interface ApiErrorShape {
  code: string;
  message: string;
  field?: string;
}

export interface AppTypographyTokens {
  displayFamily: string;
  bodyFamily: string;
  accentFamily: string;
}

export interface JootiyaTheme {
  background: string;
  surface: string;
  border: string;
  text: string;
  muted: string;
  accent: string;
  accentHover: string;
  accentText: string;
  radius: number;
}

export interface PersistOptions {
  key: string;
  version: number;
}

export interface CartContextValue {
  state: CartState;
  addItem: (product: Product, sizeId: string, quantity?: number) => void;
  removeItem: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
  getResolvedItems: (products: Product[]) => CartItemResolved[];
  getTotals: (products: Product[], shippingMethod?: ShippingMethod) => CartTotals;
}

export interface ProductDetailModalProps {
  productId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export interface QuantityStepperProps {
  value: number;
  min?: number;
  max?: number;
  onChange: (value: number) => void;
  disabled?: boolean;
}

export interface SelectFieldOption {
  label: string;
  value: string;
}

export interface SelectFieldProps {
  label?: string;
  value: string;
  options: SelectFieldOption[];
  placeholder?: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  error?: string;
}

const types = {
  version: 1,
};

export default types;