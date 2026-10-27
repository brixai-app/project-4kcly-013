import type { Artisan, Product, ProductCategory, ShippingMethod } from '@/types';

export const imageAssets = {
  heroPrimary: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=800&q=80',
  heroSecondary: 'https://images.unsplash.com/photo-1533867617858-e7b97e060509?auto=format&fit=crop&w=800&q=80',
  heroAccent: 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&w=800&q=80',
  artisanOne: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=1400&q=85',
  artisanTwo: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1400&q=85',
  artisanThree: 'https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=1400&q=85',
} as const;

export const categories: ProductCategory[] = ['Mojri', 'Jutti', 'Kolhapuri', 'Accessories', 'New In', 'Best Sellers'];

export const shippingMethods: ShippingMethod[] = [
  { id: 'standard', label: 'Standard Delivery', eta: '4-6 business days', price: 0 },
  { id: 'express', label: 'Express Delivery', eta: '2-3 business days', price: 249 },
  { id: 'priority', label: 'Priority Hand Delivery', eta: '1-2 business days', price: 499 },
];

export const artisans: Artisan[] = [
  {
    id: 'artisan-1',
    name: 'Rafiq Khan',
    location: 'Jodhpur, Rajasthan',
    specialty: 'Hand-stitched men’s mojris',
    portraitUrl: imageAssets.artisanOne,
    story: 'Rafiq shapes supple uppers with a quiet precision inherited across three generations of workshop craft.',
  },
  {
    id: 'artisan-2',
    name: 'Amina Bano',
    location: 'Bikaner, Rajasthan',
    specialty: 'Mirror-work and embroidered juttis',
    portraitUrl: imageAssets.artisanTwo,
    story: 'Amina balances delicate embroidery with durable construction, creating pieces that feel ceremonial yet wearable.',
  },
  {
    id: 'artisan-3',
    name: 'Salim Noor',
    location: 'Jaipur, Rajasthan',
    specialty: 'Vegetable-tanned finishing and dyeing',
    portraitUrl: imageAssets.artisanThree,
    story: 'Salim finishes each pair with natural dyes and burnished edges that deepen beautifully with time.',
  },
];

export const products: Product[] = [
  {
    id: 'prod-001',
    slug: 'maharaja-ivory-mojri',
    name: 'Maharaja Ivory Mojri',
    category: 'Mojri',
    price: 3499,
    compareAtPrice: 4299,
    description: 'An ivory leather mojri with hand-finished piping, a softly pointed toe, and a refined ceremonial silhouette.',
    image: imageAssets.heroPrimary,
    gallery: [imageAssets.heroPrimary, imageAssets.heroSecondary, imageAssets.heroAccent],
    artisanId: 'artisan-1',
    sizes: ['6', '7', '8', '9', '10', '11'],
    colors: ['Ivory', 'Sand'],
    inStock: true,
    featured: true,
    newArrival: false,
    rating: 4.9,
    reviewCount: 128,
    material: 'Vegetable-tanned leather',
    care: 'Store in a dust bag and condition lightly after wear.',
  },
  {
    id: 'prod-002',
    slug: 'noor-ember-jutti',
    name: 'Noor Ember Jutti',
    category: 'Jutti',
    price: 2899,
    description: 'A deep ember jutti with tonal embroidery and a cushioned footbed for long evenings and formal occasions.',
    image: imageAssets.heroSecondary,
    gallery: [imageAssets.heroSecondary, imageAssets.heroAccent],
    artisanId: 'artisan-2',
    sizes: ['5', '6', '7', '8', '9'],
    colors: ['Ember', 'Wine'],
    inStock: true,
    featured: true,
    newArrival: true,
    rating: 4.8,
    reviewCount: 94,
    material: 'Leather upper with textile embroidery',
    care: 'Wipe gently with a dry cloth and avoid direct moisture.',
  },
  {
    id: 'prod-003',
    slug: 'sandstone-kolhapuri',
    name: 'Sandstone Kolhapuri',
    category: 'Kolhapuri',
    price: 2199,
    description: 'A pared-back Kolhapuri with braided straps, a matte finish, and a grounded everyday profile.',
    image: imageAssets.heroAccent,
    gallery: [imageAssets.heroAccent, imageAssets.heroPrimary],
    artisanId: 'artisan-3',
    sizes: ['6', '7', '8', '9', '10'],
    colors: ['Sandstone', 'Cocoa'],
    inStock: true,
    featured: false,
    newArrival: true,
    rating: 4.7,
    reviewCount: 61,
    material: 'Natural leather',
    care: 'Keep away from prolonged sun exposure and polish sparingly.',
  },
  {
    id: 'prod-004',
    slug: 'heritage-thread-clutch',
    name: 'Heritage Thread Clutch',
    category: 'Accessories',
    price: 1799,
    description: 'A compact accessory pouch with woven detailing, ideal for gifting, travel, and ceremonial dressing.',
    image: imageAssets.artisanOne,
    gallery: [imageAssets.artisanOne, imageAssets.artisanTwo],
    artisanId: 'artisan-2',
    sizes: ['One Size'],
    colors: ['Natural', 'Charcoal'],
    inStock: true,
    featured: false,
    newArrival: false,
    rating: 4.6,
    reviewCount: 37,
    material: 'Textile and leather trim',
    care: 'Spot clean only and store flat.',
  },
  {
    id: 'prod-005',
    slug: 'desert-loom-mojri',
    name: 'Desert Loom Mojri',
    category: 'Best Sellers',
    price: 3199,
    compareAtPrice: 3799,
    description: 'A bestselling mojri with subtle loom texture, softened lining, and a versatile profile for daily wear.',
    image: imageAssets.artisanTwo,
    gallery: [imageAssets.artisanTwo, imageAssets.artisanThree],
    artisanId: 'artisan-1',
    sizes: ['6', '7', '8', '9', '10', '11'],
    colors: ['Taupe', 'Clay'],
    inStock: true,
    featured: true,
    newArrival: false,
    rating: 4.9,
    reviewCount: 201,
    material: 'Full-grain leather',
    care: 'Use a neutral conditioner and air dry naturally.',
  },
  {
    id: 'prod-006',
    slug: 'atelier-midnight-jutti',
    name: 'Atelier Midnight Jutti',
    category: 'New In',
    price: 3699,
    description: 'A midnight-toned jutti with restrained metallic accents and a sculpted, elegant finish.',
    image: imageAssets.artisanThree,
    gallery: [imageAssets.artisanThree, imageAssets.heroPrimary, imageAssets.heroAccent],
    artisanId: 'artisan-3',
    sizes: ['5', '6', '7', '8', '9', '10'],
    colors: ['Midnight', 'Graphite'],
    inStock: false,
    featured: true,
    newArrival: true,
    rating: 4.8,
    reviewCount: 48,
    material: 'Leather with metallic threadwork',
    care: 'Keep in breathable storage and avoid abrasive surfaces.',
  },
];

export const editorialCopy = {
  heroTitle: 'Jootiya',
  heroSubtitle: 'Luxury Jodhpuri mojris, shaped by hand and framed like collectible fashion.',
  heroBody:
    'Warm parchment surfaces, deep charcoal typography, and soft-gold detailing guide a modern editorial storefront rooted in authentic craft.',
  heroCta: 'Explore Collection',
  manifestoTitle: 'Craft, carried forward',
  manifestoBody:
    'Every pair is selected for silhouette, finish, and the quiet authority of workmanship that improves with wear.',
  newsletterTitle: 'Receive the next drop',
  newsletterBody:
    'Early access to new arrivals, artisan stories, and seasonal edits from the Jootiya atelier.',
} as const;

const mockData = {
  imageAssets,
  categories,
  shippingMethods,
  artisans,
  products,
  editorialCopy,
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
