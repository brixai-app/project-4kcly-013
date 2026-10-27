import type { Artisan, Product, Review } from '@/types';

export const artisans: Artisan[] = [
  {
    id: 'artisan-1',
    name: 'Rafiq Khan',
    title: 'Master Mojri Cutter',
    location: 'Jodhpur, Rajasthan',
    story:
      'Rafiq shapes each pair with a measured hand, balancing heritage patterning with a clean, modern silhouette refined for long wear.',
    image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=800&q=80',
    specialties: ['Hand-cut uppers', 'Leather finishing', 'Thread detailing'],
    yearsActive: 24,
  },
  {
    id: 'artisan-2',
    name: 'Amina Bano',
    title: 'Embroidery Atelier Lead',
    location: 'Jodhpur, Rajasthan',
    story:
      'Amina translates floral and geometric motifs into restrained surface work, giving every pair a quiet, couture-like depth.',
    image: 'https://images.unsplash.com/photo-1533867617858-e7b97e060509?auto=format&fit=crop&w=800&q=80',
    specialties: ['Zardozi accents', 'Mirror work', 'Surface embroidery'],
    yearsActive: 18,
  },
  {
    id: 'artisan-3',
    name: 'Salim Noor',
    title: 'Lasting & Sole Artisan',
    location: 'Jodhpur, Rajasthan',
    story:
      'Salim finishes the structure from inside out, ensuring the sole, arch, and toe line remain elegant without sacrificing comfort.',
    image: 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&w=800&q=80',
    specialties: ['Sole shaping', 'Comfort lasting', 'Edge burnishing'],
    yearsActive: 21,
  },
];

export const products: Product[] = [
  {
    id: 'prod-1',
    name: 'Mehrab Ivory Mojri',
    slug: 'mehrab-ivory-mojri',
    price: 3490,
    compareAtPrice: 4290,
    category: 'Wedding Edit',
    collection: 'The Heritage Edit',
    description:
      'An ivory mojri with hand-finished edges, subtle tonal embroidery, and a softened profile designed for ceremonial dressing.',
    image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1400&q=85',
    gallery: [
      'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1400&q=85',
      'https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=1400&q=85',
    ],
    artisanId: 'artisan-1',
    featured: true,
    newArrival: true,
    inStock: true,
    sizes: ['UK 5', 'UK 6', 'UK 7', 'UK 8', 'UK 9'],
    materials: ['Genuine leather', 'Cotton lining', 'Hand embroidery'],
    color: 'Ivory',
    rating: 4.9,
    reviewCount: 128,
  },
  {
    id: 'prod-2',
    name: 'Noor Terracotta Mojri',
    slug: 'noor-terracotta-mojri',
    price: 2890,
    compareAtPrice: null,
    category: 'Occasion Wear',
    collection: 'Sunset Atelier',
    description:
      'A terracotta-toned pair with a sculpted toe and understated threadwork that pairs easily with festive tailoring.',
    image: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=1400&q=85',
    gallery: [
      'https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=1400&q=85',
      'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80',
    ],
    artisanId: 'artisan-2',
    featured: true,
    inStock: true,
    sizes: ['UK 6', 'UK 7', 'UK 8', 'UK 9', 'UK 10'],
    materials: ['Suede leather', 'Silk thread', 'Leather sole'],
    color: 'Terracotta',
    rating: 4.8,
    reviewCount: 94,
  },
  {
    id: 'prod-3',
    name: 'Saffron Court Mojri',
    slug: 'saffron-court-mojri',
    price: 3190,
    compareAtPrice: 3790,
    category: 'Festive Classics',
    collection: 'The Court Series',
    description:
      'A saffron mojri with antique-gold accents and a polished finish that reads refined from day ceremony to evening reception.',
    image: 'https://images.unsplash.com/photo-1533867617858-e7b97e060509?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1533867617858-e7b97e060509?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=800&q=80',
    ],
    artisanId: 'artisan-3',
    featured: false,
    newArrival: true,
    inStock: true,
    sizes: ['UK 5', 'UK 6', 'UK 7', 'UK 8'],
    materials: ['Full-grain leather', 'Hand-stitched upper', 'Padded insole'],
    color: 'Saffron',
    rating: 4.7,
    reviewCount: 61,
  },
  {
    id: 'prod-4',
    name: 'Obsidian Dusk Mojri',
    slug: 'obsidian-dusk-mojri',
    price: 3690,
    compareAtPrice: null,
    category: 'Evening Edit',
    collection: 'Midnight Loom',
    description:
      'A charcoal-black silhouette with a sleek profile, designed to anchor formal looks with quiet authority.',
    image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=1400&q=85',
    gallery: [
      'https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=1400&q=85',
      'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1400&q=85',
    ],
    artisanId: 'artisan-1',
    featured: true,
    inStock: true,
    sizes: ['UK 6', 'UK 7', 'UK 8', 'UK 9', 'UK 10'],
    materials: ['Polished leather', 'Soft lining', 'Leather outsole'],
    color: 'Charcoal',
    rating: 4.9,
    reviewCount: 83,
  },
];

export const reviews: Review[] = [
  {
    id: 'rev-1',
    productId: 'prod-1',
    author: 'Aarav S.',
    rating: 5,
    title: 'Elegant and exceptionally comfortable',
    body:
      'The finish is immaculate and the fit feels tailored. It looked refined with sherwani and remained comfortable through the evening.',
    createdAt: '2026-01-12T10:20:00.000Z',
  },
  {
    id: 'rev-2',
    productId: 'prod-2',
    author: 'Meera K.',
    rating: 5,
    title: 'Beautiful color and craftsmanship',
    body:
      'The terracotta tone is richer in person and the embroidery is subtle, which makes it feel luxurious rather than ornate.',
    createdAt: '2026-02-03T14:05:00.000Z',
  },
  {
    id: 'rev-3',
    productId: 'prod-4',
    author: 'Kabir M.',
    rating: 4,
    title: 'Sharp silhouette, premium feel',
    body:
      'The pair has a clean line and a polished look that works beautifully for formal evenings. Packaging was also excellent.',
    createdAt: '2026-02-18T08:45:00.000Z',
  },
];

export const navigation = [
  { label: 'Home', href: '/' },
  { label: 'Shop', href: '/shop' },
  { label: 'Craft', href: '/#craft' },
  { label: 'Journal', href: '/#journal' },
];

export const editorial = {
  hero: {
    eyebrow: 'Jodhpur atelier / handcrafted mojris',
    title: 'Crafted for ceremonial presence, refined for modern dressing.',
    description:
      'A luxury commerce experience shaped by ivory light, terracotta warmth, and the disciplined hand of Jodhpuri artisans.',
    ctaLabel: 'Explore Collection',
    ctaHref: '/shop',
    image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1400&q=85',
  },
  manifesto: {
    title: 'Heritage, edited with restraint.',
    body:
      'Each pair is cut, stitched, and finished in small batches, preserving the tactile character of traditional mojri making while presenting it through a contemporary editorial lens.',
  },
};

export const mockData = { products, artisans, reviews, navigation, editorial };
export default mockData;