import type { Artisan, MojriProduct } from "@/types";

export const heroSlides = [
  {
    id: "heritage-loom",
    title: "Jodhpuri Mojris, reimagined as collector pieces.",
    subtitle: "Hand-finished silhouettes shaped by atelier craft, provenance, and ceremonial restraint.",
    image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1400&q=85",
    cta: "Explore Collection",
  },
  {
    id: "atelier-light",
    title: "Muted gold, maroon, and ivory in a cinematic editorial rhythm.",
    subtitle: "A tactile storefront for authentic craftsmanship and modern occasion dressing.",
    image: "https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=1400&q=85",
    cta: "Shop Latest Drop",
  },
  {
    id: "craft-provenance",
    title: "Every pair carries the hand of an artisan and the memory of place.",
    subtitle: "From cutwork to finish, each detail is selected for longevity and grace.",
    image: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=1400&q=85",
    cta: "Meet the Artisans",
  },
] as const;

export const artisans: Artisan[] = [
  {
    id: "artisan-1",
    name: "Rafiq Khan",
    slug: "rafiq-khan",
    location: "Jodhpur, Rajasthan",
    specialty: "Hand-stitched leather finishing",
    story: "Rafiq carries a family practice of shaping supple leather into refined ceremonial footwear, balancing durability with a quiet, formal elegance.",
    portrait: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=800&q=80",
    yearsActive: 24,
    techniques: ["Hand stitching", "Edge burnishing", "Last shaping"],
  },
  {
    id: "artisan-2",
    name: "Amina Bano",
    slug: "amina-bano",
    location: "Jodhpur, Rajasthan",
    specialty: "Threadwork and surface ornament",
    story: "Amina’s atelier is known for restrained embellishment, where thread, texture, and tone are composed with editorial precision.",
    portrait: "https://images.unsplash.com/photo-1533867617858-e7b97e060509?auto=format&fit=crop&w=800&q=80",
    yearsActive: 18,
    techniques: ["Thread embroidery", "Pattern drafting", "Bead placement"],
  },
  {
    id: "artisan-3",
    name: "Imran Ali",
    slug: "imran-ali",
    location: "Jodhpur, Rajasthan",
    specialty: "Pattern cutting and comfort fit",
    story: "Imran refines each silhouette for a secure, graceful fit, preserving the traditional profile while improving wearability for long occasions.",
    portrait: "https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&w=800&q=80",
    yearsActive: 21,
    techniques: ["Pattern cutting", "Lining assembly", "Fit calibration"],
  },
] as const;

export const products: MojriProduct[] = [
  {
    id: "mj-001",
    name: "Noor Maroon Mojri",
    slug: "noor-maroon-mojri",
    price: 3499,
    description: "A formal maroon mojri with tonal embroidery, soft lining, and a polished finish for weddings and evening gatherings.",
    category: "Men",
    collection: "Heritage Edit",
    artisanId: "artisan-1",
    image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=800&q=80",
    ],
    sizes: ["6", "7", "8", "9", "10"],
    colors: ["Maroon", "Deep Wine"],
    featured: true,
    inStock: true,
    provenance: "Hand-finished in Jodhpur using traditional leatherwork methods.",
    care: "Store in a dry cloth bag and wipe gently after wear.",
  },
  {
    id: "mj-002",
    name: "Ivory Court Mojri",
    slug: "ivory-court-mojri",
    price: 2899,
    description: "An ivory pair with subtle thread detailing and a clean profile designed for daytime ceremonies and refined dressing.",
    category: "Men",
    collection: "Ceremony Line",
    artisanId: "artisan-2",
    image: "https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=800&q=80",
    ],
    sizes: ["5", "6", "7", "8", "9"],
    colors: ["Ivory", "Sand"],
    inStock: true,
    provenance: "Crafted in small batches with hand-placed finishing details.",
    care: "Keep away from moisture and direct sunlight when stored.",
  },
  {
    id: "mj-003",
    name: "Sandstone Regal Mojri",
    slug: "sandstone-regal-mojri",
    price: 3199,
    description: "A sand-toned mojri with a structured toe, muted sheen, and versatile styling for festive wardrobes.",
    category: "Men",
    collection: "Regal Essentials",
    artisanId: "artisan-3",
    image: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=1400&q=85",
    gallery: [
      "https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=1400&q=85",
      "https://images.unsplash.com/photo-1533867617858-e7b97e060509?auto=format&fit=crop&w=800&q=80",
    ],
    sizes: ["6", "7", "8", "9", "10", "11"],
    colors: ["Sand", "Taupe"],
    featured: true,
    inStock: true,
    provenance: "Designed for ceremonial wear with a balanced, enduring silhouette.",
    care: "Brush lightly and air dry naturally after use.",
  },
  {
    id: "mj-004",
    name: "Saffron Thread Mojri",
    slug: "saffron-thread-mojri",
    price: 3699,
    description: "A richly detailed pair with saffron threadwork and a formal profile for special occasions and gifting.",
    category: "Women",
    collection: "Festival Atelier",
    artisanId: "artisan-2",
    image: "https://images.unsplash.com/photo-1533867617858-e7b97e060509?auto=format&fit=crop&w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1533867617858-e7b97e060509?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&w=800&q=80",
    ],
    sizes: ["4", "5", "6", "7", "8"],
    colors: ["Saffron", "Antique Gold"],
    inStock: true,
    provenance: "Finished by hand with a focus on texture and ceremonial warmth.",
    care: "Wipe with a soft dry cloth and store flat.",
  },
  {
    id: "mj-005",
    name: "Charcoal Heritage Mojri",
    slug: "charcoal-heritage-mojri",
    price: 3299,
    description: "A charcoal mojri with understated ornamentation and a versatile finish for formal and evening looks.",
    category: "Men",
    collection: "Heritage Edit",
    artisanId: "artisan-1",
    image: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=1200&q=80",
    ],
    sizes: ["6", "7", "8", "9", "10"],
    colors: ["Charcoal", "Graphite"],
    featured: true,
    inStock: true,
    provenance: "A refined staple shaped through traditional handcraft and careful finishing.",
    care: "Avoid prolonged exposure to damp surfaces.",
  },
  {
    id: "mj-006",
    name: "Ivory Pearl Mojri",
    slug: "ivory-pearl-mojri",
    price: 2999,
    description: "A luminous ivory pair with pearl-toned accents and a graceful, occasion-ready silhouette.",
    category: "Women",
    collection: "Ceremony Line",
    artisanId: "artisan-3",
    image: "https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=1400&q=85",
    ],
    sizes: ["4", "5", "6", "7"],
    colors: ["Ivory", "Pearl"],
    inStock: true,
    provenance: "Made in limited quantities with a focus on comfort and poise.",
    care: "Store in breathable packaging and keep away from sharp objects.",
  },
];

export const collections = [
  { id: "heritage-edit", name: "Heritage Edit", slug: "heritage-edit" },
  { id: "ceremony-line", name: "Ceremony Line", slug: "ceremony-line" },
  { id: "regal-essentials", name: "Regal Essentials", slug: "regal-essentials" },
  { id: "festival-atelier", name: "Festival Atelier", slug: "festival-atelier" },
] as const;

export const categories = ["Men", "Women"] as const;

export const getProductBySlug = (slug: string) => products.find((product) => product.slug === slug) ?? null;
export const getArtisanBySlug = (slug: string) => artisans.find((artisan) => artisan.slug === slug) ?? null;
export const getArtisanById = (id: string) => artisans.find((artisan) => artisan.id === id) ?? null;
export const getCollectionBySlug = (slug: string) => collections.find((collection) => collection.slug === slug) ?? null;

export const getSafeImage = (url?: string, slug = "jootiya") =>
  url?.startsWith("http") ? url : `https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=1400&q=85

export const mockData = {
  heroSlides,
  artisans,
  products,
  collections,
  categories,
  getProductBySlug,
  getArtisanBySlug,
  getArtisanById,
  getCollectionBySlug,
  getSafeImage,
};

export default mockData;
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
