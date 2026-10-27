import type { Artisan, FilterOption, NavigationLink, Product, ProductCategory, ShopSortOption } from '@/types';

export const verifiedImages = {
  hero: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=1400&q=85',
  craft: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1400&q=85',
  artisan: 'https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=1400&q=85',
  product1: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=800&q=80',
  product2: 'https://images.unsplash.com/photo-1533867617858-e7b97e060509?auto=format&fit=crop&w=800&q=80',
  product3: 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&w=800&q=80',
  product4: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=1400&q=85',
  product5: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1400&q=85',
  product6: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=800&q=80',
} as const;

export const products: Product[] = [
  { id: 'jootiya-001', name: 'Mehrab Embroidered Mojri', category: 'Mojri', price: 4890, image: verifiedImages.product1, images: [verifiedImages.product1, verifiedImages.product4], artisanId: 'artisan-1', description: 'Hand-finished Jodhpur mojri with mirror-thread embroidery and a supple leather lining.', details: ['Hand-stitched upper', 'Vegetable-tanned leather', 'Cushioned insole'], sizes: ['38', '39', '40', '41', '42', '43'], color: 'Antique Gold', material: 'Leather and silk thread', inStock: true, featured: true, rating: 4.9, reviewCount: 128 },
  { id: 'jootiya-002', name: 'Nawaab Heritage Jutti', category: 'Heritage', price: 5290, image: verifiedImages.product2, images: [verifiedImages.product2, verifiedImages.product5], artisanId: 'artisan-2', description: 'A ceremonial silhouette with tonal zari work and a refined almond toe.', details: ['Zari embroidery', 'Soft heel cup', 'Formal occasion ready'], sizes: ['37', '38', '39', '40', '41', '42'], color: 'Ivory', material: 'Leather, zari, cotton lining', inStock: true, featured: true, rating: 4.8, reviewCount: 94 },
  { id: 'jootiya-003', name: 'Thar Slip-on Mojri', category: 'Slip-on', price: 3990, image: verifiedImages.product3, images: [verifiedImages.product3, verifiedImages.product6], artisanId: 'artisan-3', description: 'Minimal slip-on crafted for daily wear with a soft, breathable interior.', details: ['Easy slip-on profile', 'Breathable lining', 'Flexible sole'], sizes: ['38', '39', '40', '41', '42'], color: 'Charcoal', material: 'Suede and leather', inStock: true, featured: false, rating: 4.7, reviewCount: 61 },
  { id: 'jootiya-004', name: 'Sunehri Wedding Mojri', category: 'Wedding', price: 6890, image: verifiedImages.product4, images: [verifiedImages.product4, verifiedImages.product1], artisanId: 'artisan-1', description: 'A richly embellished wedding pair with antique gold accents and ceremonial depth.', details: ['Wedding embellishment', 'Hand-beaded finish', 'Premium comfort padding'], sizes: ['39', '40', '41', '42', '43', '44'], color: 'Vermilion', material: 'Leather, beadwork, silk', inStock: true, featured: true, rating: 5, reviewCount: 52 },
  { id: 'jootiya-005', name: 'Jharokha Limited Edition', category: 'Limited', price: 7590, image: verifiedImages.product5, images: [verifiedImages.product5, verifiedImages.product2], artisanId: 'artisan-4', description: 'A collector’s edition with architectural motifs inspired by Jodhpur façades.', details: ['Numbered release', 'Architectural motif', 'Collector packaging'], sizes: ['38', '39', '40', '41', '42', '43'], color: 'Sandstone', material: 'Leather and metallic thread', inStock: false, featured: true, rating: 4.9, reviewCount: 33 },
  { id: 'jootiya-006', name: 'Rangrez Mojri', category: 'Mojri', price: 4590, image: verifiedImages.product6, images: [verifiedImages.product6, verifiedImages.product3], artisanId: 'artisan-5', description: 'A vivid artisan-made pair balancing comfort, color, and traditional craft detail.', details: ['Colorfast dye work', 'Hand-cut patterning', 'Everyday luxury'], sizes: ['37', '38', '39', '40', '41', '42', '43'], color: 'Indigo', material: 'Leather, cotton, thread', inStock: true, featured: false, rating: 4.8, reviewCount: 77 },
];

export const artisans: Artisan[] = [
  { id: 'artisan-1', name: 'Bhanwar Singh', location: 'Jodhpur, Rajasthan', specialty: 'Mirror-thread embroidery', portrait: verifiedImages.artisan, story: 'A third-generation mojri maker known for ceremonial detailing and precise hand finishing.', yearsExperience: 28, featured: true },
  { id: 'artisan-2', name: 'Amina Bano', location: 'Jodhpur, Rajasthan', specialty: 'Zari and beadwork', portrait: verifiedImages.product2, story: 'Creates heirloom juttis with a disciplined balance of ornament and wearability.', yearsExperience: 19, featured: true },
  { id: 'artisan-3', name: 'Rafiq Khan', location: 'Jodhpur, Rajasthan', specialty: 'Everyday comfort lasts', portrait: verifiedImages.product3, story: 'Focuses on ergonomic lasts and soft interiors for long-wear slip-on silhouettes.', yearsExperience: 14, featured: false },
  { id: 'artisan-4', name: 'Lalita Devi', location: 'Jodhpur, Rajasthan', specialty: 'Architectural motifs', portrait: verifiedImages.product5, story: 'Translates Jodhpur’s jharokha geometry into refined limited-edition footwear.', yearsExperience: 22, featured: true },
  { id: 'artisan-5', name: 'Imran Ali', location: 'Jodhpur, Rajasthan', specialty: 'Natural dye finishing', portrait: verifiedImages.product6, story: 'Blends saturated color with traditional construction for contemporary collectors.', yearsExperience: 16, featured: false },
];

export const categories: ProductCategory[] = ['Mojri', 'Jutti', 'Slip-on', 'Wedding', 'Heritage', 'Limited'];

export const filterOptions: FilterOption[] = [
  { label: 'All Categories', value: 'all' },
  { label: 'Mojri', value: 'Mojri' },
  { label: 'Jutti', value: 'Jutti' },
  { label: 'Slip-on', value: 'Slip-on' },
  { label: 'Wedding', value: 'Wedding' },
  { label: 'Heritage', value: 'Heritage' },
  { label: 'Limited', value: 'Limited' },
];

export const sizeOptions: FilterOption[] = [
  { label: '37', value: '37' },
  { label: '38', value: '38' },
  { label: '39', value: '39' },
  { label: '40', value: '40' },
  { label: '41', value: '41' },
  { label: '42', value: '42' },
  { label: '43', value: '43' },
  { label: '44', value: '44' },
];

export const sortOptions: ShopSortOption[] = [
  { label: 'Featured', value: 'featured' },
  { label: 'Price: Low to High', value: 'price-asc' },
  { label: 'Price: High to Low', value: 'price-desc' },
  { label: 'Newest', value: 'newest' },
];

export const navigationLinks: NavigationLink[] = [
  { label: 'Home', href: '/' },
  { label: 'Shop', href: '/shop' },
  { label: 'Journey', href: '/journey' },
];

export const editorialContent = {
  heroEyebrow: 'Jodhpur Craft Ledger',
  heroTitle: 'Authentic Mojris, Handcrafted in the Blue City',
  heroDescription: 'A luxury storefront for Rajasthani footwear shaped by artisan hands, ceremonial detail, and enduring comfort.',
  heroCta: 'Explore Collection',
  manifestoTitle: 'Crafted with patience, worn with distinction.',
  manifestoBody: 'Each pair is cut, stitched, and finished in small batches by master artisans preserving the language of Jodhpur craft.',
  newsletterTitle: 'Receive the next drop',
  newsletterBody: 'Private previews, artisan stories, and limited releases delivered with restraint.',
} as const;

export const mockData = {
  verifiedImages,
  products,
  artisans,
  categories,
  filterOptions,
  sizeOptions,
  sortOptions,
  navigationLinks,
  editorialContent,
};

export default mockData;
export const sizeGuide: any = [
  { size: 'XS', chest: '34-36', waist: '28-30' },
  { size: 'S', chest: '36-38', waist: '30-32' },
  { size: 'M', chest: '38-40', waist: '32-34' },
  { size: 'L', chest: '40-42', waist: '34-36' },
  { size: 'XL', chest: '42-44', waist: '36-38' },
];
