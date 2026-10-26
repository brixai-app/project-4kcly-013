import type { Artisan, CatalogFilterGroup, Product, ProductCategory } from '@/types';

export const artisans: Artisan[] = [
  {
    id: 'artisan-1',
    name: 'Rafiq Khan',
    location: 'Jodhpur, Rajasthan',
    lineage: 'Fourth-generation mojri maker',
    specialty: 'Hand-embroidered bridal silhouettes',
    portraitUrl: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'artisan-2',
    name: 'Imran Ali',
    location: 'Mehrangarh Quarter, Jodhpur',
    lineage: 'Family workshop since 1968',
    specialty: 'Mirrorwork and antique-gold thread',
    portraitUrl: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'artisan-3',
    name: 'Salma Bano',
    location: 'Old City, Jodhpur',
    lineage: 'Heritage leather finishing house',
    specialty: 'Soft tan uppers and comfort lasts',
    portraitUrl: 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&w=800&q=80',
  },
];

export const products: Product[] = [
  {
    id: 'prod-1',
    slug: 'mehrangarh-ivory-mojri',
    name: 'Mehrangarh Ivory Mojri',
    category: 'mojri',
    price: 4999,
    description: 'An ivory leather mojri with restrained maroon piping and hand-finished comfort lining.',
    image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1533867617858-e7b97e060509?auto=format&fit=crop&w=800&q=80',
    ],
    artisanId: 'artisan-1',
    artisanName: 'Rafiq Khan',
    colors: ['ivory', 'maroon'],
    sizes: ['UK 6', 'UK 7', 'UK 8', 'UK 9', 'UK 10'],
    featured: true,
    inStock: true,
    material: 'Vegetable-tanned leather',
    craftsmanship: 'Hand-stitched upper with padded heel collar',
  },
  {
    id: 'prod-2',
    slug: 'sindoor-maroon-jutti',
    name: 'Sindoor Maroon Jutti',
    category: 'juttis',
    price: 4299,
    description: 'Deep-maroon jutti with antique-gold embroidery and a softly tapered toe.',
    image: 'https://images.unsplash.com/photo-1533867617858-e7b97e060509?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1533867617858-e7b97e060509?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=800&q=80',
    ],
    artisanId: 'artisan-2',
    artisanName: 'Imran Ali',
    colors: ['maroon', 'antique-gold'],
    sizes: ['UK 6', 'UK 7', 'UK 8', 'UK 9'],
    featured: true,
    inStock: true,
    material: 'Supple leather with silk threadwork',
    craftsmanship: 'Mirrorwork paneling and hand-burnished edges',
  },
  {
    id: 'prod-3',
    slug: 'thar-rust-bridal-mojri',
    name: 'Thar Rust Bridal Mojri',
    category: 'bridal',
    price: 6899,
    description: 'A ceremonial rust-toned bridal pair with dense embroidery and luminous antique-gold accents.',
    image: 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=1400&q=85',
    ],
    artisanId: 'artisan-1',
    artisanName: 'Rafiq Khan',
    colors: ['rust', 'antique-gold'],
    sizes: ['UK 6', 'UK 7', 'UK 8', 'UK 9', 'UK 10', 'UK 11'],
    featured: true,
    inStock: true,
    material: 'Full-grain leather and zari thread',
    craftsmanship: 'Bridal density embroidery with cushioned insole',
  },
  {
    id: 'prod-4',
    slug: 'desert-tan-mens-mojri',
    name: 'Desert Tan Men’s Mojri',
    category: 'mens',
    price: 3899,
    description: 'A clean tan mojri designed for everyday tailoring, with a refined low-profile silhouette.',
    image: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=1400&q=85',
    ],
    artisanId: 'artisan-3',
    artisanName: 'Salma Bano',
    colors: ['tan', 'ivory'],
    sizes: ['UK 7', 'UK 8', 'UK 9', 'UK 10', 'UK 11'],
    featured: false,
    inStock: true,
    material: 'Soft leather upper with leather sole',
    craftsmanship: 'Minimal stitch detailing and flexible construction',
  },
  {
    id: 'prod-5',
    slug: 'jaisalmer-black-womens-jutti',
    name: 'Jaisalmer Black Women’s Jutti',
    category: 'womens',
    price: 4599,
    description: 'A polished black jutti with subtle tonal embroidery and a graceful almond toe.',
    image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1400&q=85',
    ],
    artisanId: 'artisan-2',
    artisanName: 'Imran Ali',
    colors: ['black', 'antique-gold'],
    sizes: ['UK 6', 'UK 7', 'UK 8', 'UK 9'],
    featured: false,
    inStock: true,
    material: 'Polished leather with cotton lining',
    craftsmanship: 'Tonal embroidery and hand-shaped toe box',
  },
  {
    id: 'prod-6',
    slug: 'heritage-ivory-artisan-mojri',
    name: 'Heritage Ivory Artisan Mojri',
    category: 'artisan',
    price: 5199,
    description: 'A collector’s ivory mojri shaped by patient handwork, antique-gold thread, and a supple finish.',
    image: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=1400&q=85',
    gallery: [
      'https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=1400&q=85',
      'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1400&q=85',
    ],
    artisanId: 'artisan-3',
    artisanName: 'Salma Bano',
    colors: ['ivory', 'antique-gold'],
    sizes: ['UK 6', 'UK 7', 'UK 8', 'UK 9', 'UK 10'],
    featured: true,
    inStock: true,
    material: 'Hand-finished leather and silk thread',
    craftsmanship: 'Artisan-led finishing with heritage stitchwork',
  },
];

export const heroSlides = [
  {
    id: 'slide-1',
    title: 'Jodhpur, Worn Softly',
    eyebrow: 'Heritage craft',
    description: 'A full-bleed editorial study in ivory leather, maroon accents, and hand-finished restraint.',
    image: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=1400&q=85',
    ctaLabel: 'Explore Collection',
    ctaHref: '/shop',
  },
  {
    id: 'slide-2',
    title: 'Thread, Leather, Lineage',
    eyebrow: 'Artisan lineage',
    description: 'Mojris shaped in family workshops where comfort, ceremony, and precision remain inseparable.',
    image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1400&q=85',
    ctaLabel: 'Shop Latest Drop',
    ctaHref: '/shop',
  },
  {
    id: 'slide-3',
    title: 'The Quiet Luxury of Craft',
    eyebrow: 'Editorial footwear',
    description: 'Warm ivory canvases and antique-gold details frame a modern ritual of dressing well.',
    image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=1400&q=85',
    ctaLabel: 'Discover Story',
    ctaHref: '/journey',
  },
];

export const styleMetadata = {
  palette: {
    background: '#F7F0E4',
    surface: '#FFFDF8',
    border: '#CDBB9F',
    textPrimary: '#2B1715',
    textMuted: '#765F55',
    accent: '#741F2B',
    accentHover: '#57151F',
  },
  typography: {
    display: 'Playfair Display',
    body: 'Lora',
  },
  categories: [
    { label: 'All Mojris', value: 'all' },
    { label: 'Mojri', value: 'mojri' },
    { label: 'Juttis', value: 'juttis' },
    { label: 'Bridal', value: 'bridal' },
    { label: 'Mens', value: 'mens' },
    { label: 'Womens', value: 'womens' },
    { label: 'Artisan', value: 'artisan' },
  ] as CatalogFilterGroup<ProductCategory | 'all'>['options'],
};

export const categoryLabels: Record<ProductCategory, string> = {
  mojri: 'Mojri',
  juttis: 'Juttis',
  bridal: 'Bridal',
  mens: 'Mens',
  womens: 'Womens',
  artisan: 'Artisan',
};

export const productBySlug = Object.fromEntries(products.map((product) => [product.slug, product])) as Record<string, Product>;
export const productById = Object.fromEntries(products.map((product) => [product.id, product])) as Record<string, Product>;
export const artisanById = Object.fromEntries(artisans.map((artisan) => [artisan.id, artisan])) as Record<string, Artisan>;

export const featuredProducts = products.filter((product) => product.featured ?? false);
export const verifiedImageUrls = [
  'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1533867617858-e7b97e060509?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=1400&q=85',
  'https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1400&q=85',
  'https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=1400&q=85',
];

export const mockData = {
  artisans,
  products,
  heroSlides,
  styleMetadata,
  categoryLabels,
  productBySlug,
  productById,
  artisanById,
  featuredProducts,
  verifiedImageUrls,
};

export default mockData;
export const categories = (mockData as any)?.categories ?? [];
