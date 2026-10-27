import type { Artisan, Product, ShopSortOption } from '@/types';

export const verifiedImages = {
  hero1: 'https://images.unsplash.com/photo-1533867617858-e7b97e060509?auto=format&fit=crop&w=800&q=80',
  hero2: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=800&q=80',
  hero3: 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&w=800&q=80',
  hero4: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=800&q=80',
  hero5: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=800&q=80',
  atelier1: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=1400&q=85',
  atelier2: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1400&q=85',
  atelier3: 'https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=1400&q=85',
} as const;

export const categories = ['Featured', 'Wedding', 'Everyday', 'Festive', 'Hand-Embroidered', 'Leather'] as const;

export const shopSortOptions: ShopSortOption[] = [
  { label: 'Featured', value: 'featured' },
  { label: 'Price: Low to High', value: 'price-asc' },
  { label: 'Price: High to Low', value: 'price-desc' },
  { label: 'Newest', value: 'newest' },
];

export const artisans: Artisan[] = [
  {
    id: 'artisan-1',
    name: 'Rafiq Khan',
    location: 'Jodhpur, Rajasthan',
    specialty: 'Hand-cut leather uppers and hand-stitched soles',
    story: 'A third-generation mojri maker whose atelier balances desert restraint with ceremonial detail.',
    image: verifiedImages.atelier1,
  },
  {
    id: 'artisan-2',
    name: 'Naseem Bano',
    location: 'Bikaner, Rajasthan',
    specialty: 'Mirror work, zari edging, and bridal finishing',
    story: 'Known for luminous embroidery that softens traditional silhouettes into modern heirlooms.',
    image: verifiedImages.atelier2,
  },
  {
    id: 'artisan-3',
    name: 'Imran Ali',
    location: 'Jaipur, Rajasthan',
    specialty: 'Natural dyeing and hand-burnished leather',
    story: 'Creates tonal finishes that age beautifully, with a focus on comfort and longevity.',
    image: verifiedImages.atelier3,
  },
];

export const heroSlides = [
  {
    id: 'slide-1',
    title: 'The Desert Atelier',
    eyebrow: 'Jootiya / Authentic Jodhpuri Mojris',
    description: 'A warm-ivory editorial journal of hand-finished pairs, ceremonial textures, and quiet luxury.',
    image: verifiedImages.hero1,
    ctaLabel: 'Explore Collection',
  },
  {
    id: 'slide-2',
    title: 'Crafted for Ceremony',
    eyebrow: 'Handmade in Rajasthan',
    description: 'Fine leather, precise embroidery, and silhouettes shaped for weddings, festivals, and everyday elegance.',
    image: verifiedImages.hero2,
    ctaLabel: 'Shop Latest Drop',
  },
  {
    id: 'slide-3',
    title: 'Heritage, Refined',
    eyebrow: 'Artisan-led Design',
    description: 'A restrained palette, gold detailing, and enduring comfort designed to move from ritual to modern life.',
    image: verifiedImages.hero3,
    ctaLabel: 'View Story',
  },
] as const;

export const products: Product[] = [
  {
    id: 'mojri-1',
    name: 'Noor Ivory Mojri',
    category: 'Wedding',
    price: 3499,
    image: verifiedImages.hero4,
    description: 'Ivory leather mojri with tonal embroidery and a softly structured toe.',
    artisan: 'Rafiq Khan',
    material: 'Vegetable-tanned leather',
    sizes: ['6', '7', '8', '9', '10', '11'],
    featured: true,
    inStock: true,
    rating: 4.9,
    tags: ['bridal', 'embroidered', 'handmade'],
  },
  {
    id: 'mojri-2',
    name: 'Saffron Court Mojri',
    category: 'Festive',
    price: 2899,
    image: verifiedImages.hero5,
    description: 'Warm saffron finish with mirror accents and a cushioned leather insole.',
    artisan: 'Naseem Bano',
    material: 'Leather and textile embroidery',
    sizes: ['6', '7', '8', '9', '10'],
    featured: true,
    inStock: true,
    rating: 4.8,
    tags: ['festive', 'mirror-work', 'gold'],
  },
  {
    id: 'mojri-3',
    name: 'Charcoal Heritage Mojri',
    category: 'Everyday',
    price: 2399,
    image: verifiedImages.atelier1,
    description: 'Minimal charcoal mojri with hand-burnished finish and a flexible sole.',
    artisan: 'Imran Ali',
    material: 'Burnished leather',
    sizes: ['7', '8', '9', '10', '11'],
    featured: false,
    inStock: true,
    rating: 4.7,
    tags: ['minimal', 'everyday', 'classic'],
  },
  {
    id: 'mojri-4',
    name: 'Mughal Bloom Mojri',
    category: 'Hand-Embroidered',
    price: 4199,
    image: verifiedImages.atelier2,
    description: 'Floral threadwork with a refined almond toe and ceremonial finish.',
    artisan: 'Naseem Bano',
    material: 'Leather, silk thread',
    sizes: ['6', '7', '8', '9'],
    featured: true,
    inStock: true,
    rating: 5,
    tags: ['embroidered', 'statement', 'occasion'],
  },
  {
    id: 'mojri-5',
    name: 'Sandstone Classic Mojri',
    category: 'Everyday',
    price: 2199,
    image: verifiedImages.atelier3,
    description: 'Neutral sandstone tone with a clean profile and all-day comfort.',
    artisan: 'Rafiq Khan',
    material: 'Soft leather',
    sizes: ['6', '7', '8', '9', '10', '11'],
    featured: false,
    inStock: true,
    rating: 4.6,
    tags: ['neutral', 'versatile', 'lightweight'],
  },
  {
    id: 'mojri-6',
    name: 'Royal Ember Mojri',
    category: 'Wedding',
    price: 4599,
    image: verifiedImages.hero2,
    description: 'Deep ember tones with zari detailing and a polished ceremonial silhouette.',
    artisan: 'Imran Ali',
    material: 'Leather with zari embroidery',
    sizes: ['7', '8', '9', '10'],
    featured: true,
    inStock: false,
    rating: 4.9,
    tags: ['bridal', 'zari', 'limited'],
  },
];

const mockData = {
  verifiedImages,
  categories,
  shopSortOptions,
  artisans,
  heroSlides,
  products,
};

export default mockData;
export { mockData };

export const sizeGuide: any = [
  { size: 'XS', chest: '34-36', waist: '28-30' },
  { size: 'S', chest: '36-38', waist: '30-32' },
  { size: 'M', chest: '38-40', waist: '32-34' },
  { size: 'L', chest: '40-42', waist: '34-36' },
  { size: 'XL', chest: '42-44', waist: '36-38' },
];

export const editorialContent: any = {
  title: 'Crafted with Purpose',
  subtitle: 'Modern Aesthetics & Timeless Form',
  description: 'Every collection is meticulously designed to merge functional utility with striking visual hierarchy.',
  sections: [],
};
