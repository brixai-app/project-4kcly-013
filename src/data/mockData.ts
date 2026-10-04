import type { Category, CatalogSort, EditorialStory, Product, Size } from "@/types";

export const assets = {
  sneaker: "https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=800&q=80",
  runway: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=1400&q=85",
  wardrobe: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80",
  lookbook: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1400&q=85",
  portrait: "https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&w=800&q=80",
  interior: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80",
  atelier: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=800&q=80".replace("5170230230", "5170230"),
} as const;

export const imageryDisclosure = "Representative catalog photography: all sneaker styles share one supplied sample image. It does not depict each style, color, or material. Editorial images illustrate the mood of the collection.";
export const mockCheckoutDisclosure = "Demonstration boutique. Checkout is simulated; no payment is collected and no products are shipped.";
export const sizeOptions: Size[] = [35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46];
export const sizes = sizeOptions;
export const currency = "INR" as const;
export const locale = "en-IN";

const makeProduct = (
  id: string, slug: string, name: string, collection: string, price: number,
  color: string, material: string, description: string, featured = false, isNew = false,
): Product => ({
  id, slug, name, collection, price, color, material, description,
  category: "sneakers", image: assets?.sneaker ?? "", images: [assets?.sneaker ?? ""],
  sizes: [...sizeOptions],
  stock: { 35: 2, 36: 3, 37: 4, 38: 5, 39: 6, 40: 6, 41: 5, 42: 4, 43: 3, 44: 2, 45: 1, 46: 0 },
  featured, isNew,
});

export const products: Product[] = [
  makeProduct("se-001", "court-01", "Court 01", "The Everyday Edit", 8490, "Ivory", "Leather upper, rubber sole", "A pared-back court silhouette imagined for unhurried days. Sample specification; photography is representative.", true, true),
  makeProduct("se-002", "atelier-low", "Atelier Low", "Atelier Collection", 11490, "Chalk", "Suede and leather upper, rubber sole", "Soft textures meet a restrained low profile. Sample specification; photography is representative.", true, true),
  makeProduct("se-003", "city-runner", "City Runner", "Urban Rhythm", 9990, "Stone", "Mesh and suede upper, rubber sole", "A layered runner concept for the everyday city wardrobe. Sample specification; photography is representative.", true),
  makeProduct("se-004", "linea-02", "Linea 02", "The Everyday Edit", 7490, "Charcoal", "Leather upper, rubber sole", "Clean lines and understated proportions define this wardrobe staple. Sample specification; photography is representative.", true),
  makeProduct("se-005", "studio-high", "Studio High", "Atelier Collection", 12990, "Warm white", "Canvas and leather upper, rubber sole", "An elevated high-top concept with an architectural silhouette. Sample specification; photography is representative.", false, true),
  makeProduct("se-006", "weekend-court", "Weekend Court", "Off Duty", 6990, "Sand", "Canvas upper, rubber sole", "An easy court-inspired shape for a relaxed wardrobe. Sample specification; photography is representative."),
  makeProduct("se-007", "terra-runner", "Terra Runner", "Urban Rhythm", 10490, "Taupe", "Textile and suede upper, rubber sole", "Earth-toned layers give this runner concept a quiet presence. Sample specification; photography is representative.", false, true),
  makeProduct("se-008", "signature-low", "Signature Low", "Atelier Collection", 14490, "Ivory / crimson", "Leather upper, rubber sole", "A minimal low-top concept with a restrained crimson accent. Sample specification; photography is representative."),
];

export const categories: { value: Category; label: string }[] = [
  { value: "sneakers", label: "Sneakers" },
  { value: "loafers", label: "Loafers" },
  { value: "boots", label: "Boots" },
  { value: "heels", label: "Heels" },
  { value: "sandals", label: "Sandals" },
];

export const navigationLinks = [
  { label: "New arrivals", href: "/shop?sort=newest" },
  { label: "Sneakers", href: "/shop?category=sneakers" },
  { label: "All footwear", href: "/shop" },
  { label: "Our story", href: "/#our-story" },
];

export const collections = [
  { id: "everyday", name: "The Everyday Edit", href: "/shop?collection=The%20Everyday%20Edit", image: assets?.lookbook ?? "" },
  { id: "atelier", name: "Atelier Collection", href: "/shop?collection=Atelier%20Collection", image: assets?.atelier ?? "" },
  { id: "urban", name: "Urban Rhythm", href: "/shop?collection=Urban%20Rhythm", image: assets?.runway ?? "" },
  { id: "off-duty", name: "Off Duty", href: "/shop?collection=Off%20Duty", image: assets?.lookbook ?? "" },
];

export const editorialStories: EditorialStory[] = [
  { id: "hero", title: "A quieter kind of statement.", subtitle: "SOLE ÉLITE / Collection 01", description: "Considered silhouettes. An instinct for the everyday extraordinary.", image: assets?.runway ?? "", href: "/shop", caption: "THE NEW EDIT — 01" },
  { id: "everyday", title: "Beyond the ordinary.", subtitle: "The Everyday Edit", description: "An exploration of clean lines, warm neutrals, and the rhythm of everyday dressing.", image: assets?.lookbook ?? "", href: "/shop?collection=The%20Everyday%20Edit", caption: "A STUDY IN SIMPLICITY" },
  { id: "atelier", title: "The art of restraint.", subtitle: "Our point of view", description: "We imagine footwear as the finishing gesture: thoughtful proportions, tactile materials, and a silhouette that lets you lead.", image: assets?.atelier ?? "", href: "/shop?collection=Atelier%20Collection", caption: "SOLE ÉLITE / ATELIER NOTES" },
];

export const sortOptions: { value: CatalogSort; label: string }[] = [
  { value: "featured", label: "Featured" },
  { value: "newest", label: "New arrivals" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
];

export const shippingRules = {
  currency, country: "India", freeShippingThreshold: 10000, standardShippingFee: 250,
  estimatedDelivery: "5–7 business days", returnWindowDays: 14,
  description: "Demo shipping is ₹250, complimentary on merchandise subtotals of ₹10,000 or more.",
  returns: "Illustrative policy: unworn footwear in original packaging may be returned within 14 days. No real orders or returns are processed.",
};

export const customerCare = [
  { id: "sizing", title: "Finding your fit", content: "Sizes are listed in EU sizing. Availability varies by style; EU 46 is currently unavailable in this sample catalog." },
  { id: "delivery", title: "Delivery & returns", content: shippingRules?.description ?? "" },
  { id: "care", title: "Caring for your footwear", content: "Brush away dry dust gently. Use material-appropriate cleaners, avoid soaking, and air-dry away from direct heat." },
  { id: "checkout", title: "About this boutique", content: mockCheckoutDisclosure },
  { id: "imagery", title: "Catalog photography", content: imageryDisclosure },
];

export const footerLinks = [
  { label: "Shop the collection", href: "/shop" },
  { label: "Wishlist", href: "/wishlist" },
  { label: "Shopping bag", href: "/cart" },
  { label: "Customer care", href: "/#customer-care" },
];

export const mockData = {
  assets, products, categories, collections, editorialStories, navigationLinks, footerLinks,
  sizeOptions, sizes, sortOptions, customerCare, shippingRules, currency, locale,
  imageryDisclosure, mockCheckoutDisclosure,
};

export default mockData;