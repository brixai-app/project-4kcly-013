import type { Artisan, Product } from '@/types';

export const artisans: Artisan[] = [
  {
    id: 'artisan-1',
    name: 'Rafiq Khan',
    location: 'Jodhpur, Rajasthan',
    specialty: 'Hand-stitched bridal mojris',
    story:
      'Rafiq carries forward a family workshop known for precise hand-cut uppers, dense embroidery, and a disciplined last that keeps ceremonial pairs elegant yet wearable.',
    image: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=800&q=80',
    yearsActive: 28,
    techniques: ['Hand-stitching', 'Aari embroidery', 'Leather finishing'],
  },
  {
    id: 'artisan-2',
    name: 'Imran Ali',
    location: 'Old City, Jodhpur',
    specialty: 'Mirror-work and festive pairs',
    story:
      'Imran works with reflective embellishment and tonal threadwork, balancing ornament with comfort for long wedding evenings and formal gatherings.',
    image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=1200&q=80',
    yearsActive: 19,
    techniques: ['Mirror work', 'Thread embroidery', 'Edge binding'],
  },
  {
    id: 'artisan-3',
    name: 'Salim Baloch',
    location: 'Mehrangarh Quarter',
    specialty: 'Heritage leather finishing',
    story:
      'Salim is known for supple leather preparation, hand-burnished soles, and a restrained finish that lets the silhouette and craft speak first.',
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80',
    yearsActive: 24,
    techniques: ['Leather tanning', 'Hand burnishing', 'Sole shaping'],
  },
];

export const products: Product[] = [
  {
    id: 'mj-001',
    name: 'Mehrab Ivory Mojri',
    category: 'Bridal',
    occasion: 'Wedding',
    artisanId: 'artisan-1',
    artisanName: 'Rafiq Khan',
    price: 7490,
    originalPrice: 8990,
    description:
      'An ivory ceremonial mojri with fine tonal embroidery, a softly structured toe, and a polished finish designed for wedding rituals and evening receptions.',
    details: ['Hand-stitched upper', 'Cushioned leather insole', 'Ceremonial silhouette'],
    sizes: ['6', '7', '8', '9', '10'],
    colors: ['Ivory', 'Champagne'],
    image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=800&q=80',
    ],
    featured: true,
    inStock: true,
    material: 'Leather, silk thread',
    care: 'Store in a dust bag and keep away from moisture.',
    fit: 'True to size',
    origin: 'Jodhpur, Rajasthan',
  },
  {
    id: 'mj-002',
    name: 'Nawaab Maroon Mojri',
    category: 'Festive',
    occasion: 'Celebration',
    artisanId: 'artisan-2',
    artisanName: 'Imran Ali',
    price: 5890,
    description:
      'A deep maroon pair with mirror accents and a refined profile, made for festive dressing and formal cultural occasions.',
    details: ['Mirror-work detailing', 'Flexible sole', 'Festive profile'],
    sizes: ['6', '7', '8', '9', '10', '11'],
    colors: ['Maroon', 'Wine'],
    image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1400&q=85',
    gallery: [
      'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1400&q=85',
      'https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?auto=format&fit=crop&w=800&q=80',
    ],
    featured: true,
    inStock: true,
    material: 'Leather, glass mirror, cotton thread',
    care: 'Wipe gently with a dry cloth after wear.',
    fit: 'Narrow to regular',
    origin: 'Jodhpur, Rajasthan',
  },
  {
    id: 'mj-003',
    name: 'Sunehri Gold Mojri',
    category: 'Occasionwear',
    occasion: 'Reception',
    artisanId: 'artisan-3',
    artisanName: 'Salim Baloch',
    price: 6390,
    originalPrice: 7190,
    description:
      'A restrained gold mojri with a luminous surface and minimal ornament, tailored for receptions and elevated evening dressing.',
    details: ['Hand-burnished sole', 'Minimal ornament', 'Soft lining'],
    sizes: ['7', '8', '9', '10'],
    colors: ['Gold', 'Antique Gold'],
    image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80',
    featured: false,
    inStock: true,
    material: 'Leather, metallic textile',
    care: 'Avoid direct sunlight for prolonged periods.',
    fit: 'True to size',
    origin: 'Jodhpur, Rajasthan',
  },
  {
    id: 'mj-004',
    name: 'Rangrez Indigo Mojri',
    category: 'Everyday',
    occasion: 'Daily Wear',
    artisanId: 'artisan-1',
    artisanName: 'Rafiq Khan',
    price: 4290,
    description:
      'A versatile indigo mojri with a clean upper and durable sole, designed for long wear without losing its heritage character.',
    details: ['Durable sole', 'Everyday comfort', 'Clean finish'],
    sizes: ['6', '7', '8', '9', '10', '11'],
    colors: ['Indigo', 'Navy'],
    image: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=800&q=80',
    featured: false,
    inStock: true,
    material: 'Leather, cotton lining',
    care: 'Brush lightly and air dry naturally.',
    fit: 'Regular',
    origin: 'Jodhpur, Rajasthan',
  },
  {
    id: 'mj-005',
    name: 'Noor Sand Mojri',
    category: 'Bridal',
    occasion: 'Engagement',
    artisanId: 'artisan-2',
    artisanName: 'Imran Ali',
    price: 6990,
    description:
      'A sand-toned engagement pair with delicate threadwork and a graceful toe line, balancing ceremony with understated luxury.',
    details: ['Delicate threadwork', 'Engagement-ready', 'Soft toe box'],
    sizes: ['5', '6', '7', '8', '9'],
    colors: ['Sand', 'Beige'],
    image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=1400&q=85',
    featured: true,
    inStock: true,
    material: 'Leather, silk thread',
    care: 'Keep dry and store with shoe trees if possible.',
    fit: 'True to size',
    origin: 'Jodhpur, Rajasthan',
  },
  {
    id: 'mj-006',
    name: 'Qila Black Mojri',
    category: 'Formal',
    occasion: 'Evening',
    artisanId: 'artisan-3',
    artisanName: 'Salim Baloch',
    price: 5590,
    description:
      'A black formal mojri with a sharp profile and polished finish, suited to sherwanis, bandhgalas, and evening tailoring.',
    details: ['Formal profile', 'Polished finish', 'Comfort lining'],
    sizes: ['6', '7', '8', '9', '10'],
    colors: ['Black'],
    image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=800&q=80',
    featured: false,
    inStock: true,
    material: 'Leather, textile lining',
    care: 'Use a soft cloth and avoid abrasive cleaners.',
    fit: 'Regular',
    origin: 'Jodhpur, Rajasthan',
  },
];

export const categories = ['All', 'Bridal', 'Festive', 'Occasionwear', 'Everyday', 'Formal'];
export const occasions = ['All', 'Wedding', 'Celebration', 'Reception', 'Daily Wear', 'Engagement', 'Evening'];
export const sizes = ['All', '5', '6', '7', '8', '9', '10', '11'];
export const artisansList = ['All', ...artisans.map((artisan) => artisan.name)];

export const editorialStories = [
  {
    id: 'story-1',
    title: 'The Jodhpur Last',
    eyebrow: 'Heritage Craft',
    description:
      'Each pair begins with a disciplined last, shaped to preserve the mojri’s elegant curve while keeping the fit grounded in comfort.',
    image: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=1400&q=85',
  },
  {
    id: 'story-2',
    title: 'Thread, Mirror, Silence',
    eyebrow: 'Maker Notes',
    description:
      'Our artisans work in measured layers: thread, mirror, leather, and finish. The result is ornament that feels composed rather than loud.',
    image: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'story-3',
    title: 'From Workshop to Wardrobe',
    eyebrow: 'Editorial Drop',
    description:
      'A curated selection of ceremonial and everyday pairs designed to move from ritual dressing to contemporary wardrobes with ease.',
    image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=1200&q=80',
  },
];

const mockData = {
  artisans,
  products,
  categories,
  occasions,
  sizes,
  artisansList,
  editorialStories,
};

export default mockData;
export { mockData };
