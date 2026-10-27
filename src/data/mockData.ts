import type { ArtisanStory, Filter, Product } from "@/types";

export const categories = ["Mojris", "Juttis", "Bridal", "Everyday", "Festive", "Heritage"];
export const collections = ["Atelier Edit", "Wedding Vault", "Desert Classics", "Heritage Archive"];
export const materials = ["Leather", "Suede", "Silk Thread", "Hand Embroidery", "Mirror Work"];
export const sizes = ["UK 5", "UK 6", "UK 7", "UK 8", "UK 9", "UK 10"];
export const colors = ["Terracotta", "Ivory", "Onyx", "Saffron", "Indigo", "Gold"];

export const filterOptions: Filter = {
  categories,
  collections,
  materials,
  sizes,
  colors,
  priceRange: [2499, 8999],
  search: "",
};

export const products: Product[] = [
  {
    id: "mj-001",
    name: "Mehrab Terracotta Mojri",
    slug: "mehrab-terracotta-mojri",
    price: 3499,
    description: "A hand-finished terracotta Mojri with mirror-thread detailing and a softly pointed toe shaped for ceremonial ease.",
    category: "Mojris",
    collection: "Atelier Edit",
    material: "Leather",
    color: "Terracotta",
    sizes: ["UK 6", "UK 7", "UK 8", "UK 9"],
    image: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1533867617858-e7b97e060509?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&w=800&q=80",
    ],
    featured: true,
    artisan: "Rafiq Ali",
    origin: "Jodhpur",
    inStock: true,
  },
  {
    id: "mj-002",
    name: "Noor Ivory Jutti",
    slug: "noor-ivory-jutti",
    price: 4299,
    description: "Ivory leather with tonal embroidery and a refined low profile, designed for long celebrations and quiet luxury.",
    category: "Juttis",
    collection: "Wedding Vault",
    material: "Leather",
    color: "Ivory",
    sizes: ["UK 5", "UK 6", "UK 7", "UK 8"],
    image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=800&q=80",
    gallery: ["https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=800&q=80"],
    featured: true,
    artisan: "Shabnam Bano",
    origin: "Jodhpur",
    inStock: true,
  },
  {
    id: "mj-003",
    name: "Sunehri Gold Bridal Mojri",
    slug: "sunehri-gold-bridal-mojri",
    price: 8999,
    description: "A bridal statement pair with gold zari, mirror accents, and a cushioned interior for all-day ceremony wear.",
    category: "Bridal",
    collection: "Wedding Vault",
    material: "Hand Embroidery",
    color: "Gold",
    sizes: ["UK 6", "UK 7", "UK 8", "UK 9", "UK 10"],
    image: "https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=1400&q=85",
    gallery: [
      "https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=1400&q=85",
      "https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=800&q=80",
    ],
    featured: true,
    artisan: "Imran Khan",
    origin: "Jodhpur",
    inStock: true,
  },
  {
    id: "mj-004",
    name: "Bikaner Indigo Everyday",
    slug: "bikaner-indigo-everyday",
    price: 2999,
    description: "A versatile indigo pair with subtle stitchwork and a supple sole, made for daily rotation with tailored looks.",
    category: "Everyday",
    collection: "Desert Classics",
    material: "Suede",
    color: "Indigo",
    sizes: ["UK 6", "UK 7", "UK 8", "UK 9"],
    image: "https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&w=800&q=80",
    featured: false,
    artisan: "Amina Noor",
    origin: "Jodhpur",
    inStock: true,
  },
  {
    id: "mj-005",
    name: "Thar Saffron Heritage",
    slug: "thar-saffron-heritage",
    price: 5199,
    description: "Saffron-toned heritage Mojri with hand-applied threadwork and a sculpted silhouette inspired by desert arches.",
    category: "Heritage",
    collection: "Heritage Archive",
    material: "Silk Thread",
    color: "Saffron",
    sizes: ["UK 5", "UK 6", "UK 7", "UK 8", "UK 9"],
    image: "https://images.unsplash.com/photo-1533867617858-e7b97e060509?auto=format&fit=crop&w=800&q=80",
    gallery: ["https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=800&q=80"],
    featured: false,
    artisan: "Nadeem Hussain",
    origin: "Jodhpur",
    inStock: true,
  },
  {
    id: "mj-006",
    name: "Rangrez Onyx Festive",
    slug: "rangrez-onyx-festive",
    price: 4599,
    description: "An onyx festive pair with restrained gold edging and a polished finish that balances drama with versatility.",
    category: "Festive",
    collection: "Atelier Edit",
    material: "Mirror Work",
    color: "Onyx",
    sizes: ["UK 6", "UK 7", "UK 8", "UK 9"],
    image: "https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=800&q=80",
    featured: false,
    artisan: "Farah Siddiqui",
    origin: "Jodhpur",
    inStock: true,
  },
];

export const artisanStories: ArtisanStory[] = [
  {
    id: "art-001",
    name: "Rafiq Ali",
    title: "Master cutter, third-generation maker",
    story: "Rafiq shapes each upper by hand, preserving the balance between ceremonial elegance and everyday comfort in every pair.",
    image: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=1400&q=85",
    location: "Jodhpur",
    years: 24,
  },
  {
    id: "art-002",
    name: "Shabnam Bano",
    title: "Embroidery specialist",
    story: "Shabnam layers thread, mirror, and beadwork with a measured hand, turning each Mojri into a quiet heirloom.",
    image: "https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=1400&q=85",
    location: "Jodhpur",
    years: 18,
  },
  {
    id: "art-003",
    name: "Imran Khan",
    title: "Bridal finishing artisan",
    story: "Imran refines the final contour, ensuring the bridal line carries both structure and softness from aisle to after-hours.",
    image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=800&q=80",
    location: "Jodhpur",
    years: 21,
  },
];

export const mockData = {
  products,
  artisanStories,
  filterOptions,
  categories,
  collections,
  materials,
  sizes,
  colors,
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
