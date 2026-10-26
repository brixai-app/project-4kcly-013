import type { Artisan, Filter, Product } from "@/types";

export type EditorialSection = {
  id: string;
  title: string;
  eyebrow: string;
  body: string;
  image: string;
};

export const products: Product[] = [
  {
    id: "mojri-001",
    name: "Amber Stitch Mojri",
    slug: "amber-stitch-mojri",
    price: 4890,
    image: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1533867617858-e7b97e060509?auto=format&fit=crop&w=800&q=80",
    ],
    category: "Mojri",
    collection: "Heritage Edit",
    description: "Hand-finished leather mojri with tonal embroidery and a softly structured toe.",
    artisanId: "artisan-01",
    sizes: ["6", "7", "8", "9", "10"],
    colors: ["Terracotta", "Sand"],
    featured: true,
    inStock: true,
    material: "Vegetable-tanned leather",
    origin: "Jodhpur, Rajasthan",
  },
  {
    id: "mojri-002",
    name: "Indigo Court Mojri",
    slug: "indigo-court-mojri",
    price: 5290,
    image: "https://images.unsplash.com/photo-1533867617858-e7b97e060509?auto=format&fit=crop&w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1533867617858-e7b97e060509?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&w=800&q=80",
    ],
    category: "Mojri",
    collection: "Evening Archive",
    description: "Deep indigo handwork with a refined silhouette for ceremonial dressing.",
    artisanId: "artisan-02",
    sizes: ["6", "7", "8", "9"],
    colors: ["Indigo", "Ink"],
    featured: true,
    inStock: true,
    material: "Leather and silk thread",
    origin: "Jodhpur, Rajasthan",
  },
  {
    id: "mojri-003",
    name: "Ivory Loom Mojri",
    slug: "ivory-loom-mojri",
    price: 4590,
    image: "https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=1400&q=85",
    ],
    category: "Mojri",
    collection: "Ivory Series",
    description: "Minimal ivory-toned mojri with delicate loom-inspired detailing.",
    artisanId: "artisan-03",
    sizes: ["5", "6", "7", "8", "9"],
    colors: ["Ivory", "Bone"],
    featured: false,
    inStock: true,
    material: "Soft leather",
    origin: "Jodhpur, Rajasthan",
  },
  {
    id: "mojri-004",
    name: "Marigold Dune Mojri",
    slug: "marigold-dune-mojri",
    price: 4990,
    image: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=1400&q=85",
    gallery: [
      "https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=1400&q=85",
      "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1400&q=85",
    ],
    category: "Mojri",
    collection: "Sunlit Craft",
    description: "Warm marigold embroidery set against a supple leather base.",
    artisanId: "artisan-01",
    sizes: ["6", "7", "8", "9", "10"],
    colors: ["Marigold", "Clay"],
    featured: false,
    inStock: true,
    material: "Leather with cotton thread",
    origin: "Jodhpur, Rajasthan",
  },
  {
    id: "mojri-005",
    name: "Noor Thread Mojri",
    slug: "noor-thread-mojri",
    price: 5690,
    image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1400&q=85",
    gallery: [
      "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1400&q=85",
      "https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=1400&q=85",
    ],
    category: "Mojri",
    collection: "Noor Collection",
    description: "A polished occasion pair with luminous threadwork and a clean profile.",
    artisanId: "artisan-02",
    sizes: ["6", "7", "8", "9", "10", "11"],
    colors: ["Gold", "Sand"],
    featured: true,
    inStock: false,
    material: "Leather, zari thread",
    origin: "Jodhpur, Rajasthan",
  },
  {
    id: "mojri-006",
    name: "Desert Bloom Mojri",
    slug: "desert-bloom-mojri",
    price: 5190,
    image: "https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=1400&q=85",
    gallery: [
      "https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=1400&q=85",
      "https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=800&q=80",
    ],
    category: "Mojri",
    collection: "Desert Bloom",
    description: "Floral accents and a balanced fit designed for long wear.",
    artisanId: "artisan-03",
    sizes: ["5", "6", "7", "8", "9"],
    colors: ["Clay", "Rosewood"],
    featured: false,
    inStock: true,
    material: "Full-grain leather",
    origin: "Jodhpur, Rajasthan",
  },
];

export const artisans: Artisan[] = [
  {
    id: "artisan-01",
    name: "Rafiq Khan",
    location: "Jodhpur",
    craft: "Hand embroidery and leather finishing",
    bio: "Rafiq shapes each pair with precise stitching and a restrained, architectural hand.",
    portrait: "https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=800&q=80",
    yearsExperience: 24,
  },
  {
    id: "artisan-02",
    name: "Amina Bano",
    location: "Jodhpur",
    craft: "Threadwork and surface ornament",
    bio: "Amina balances luminous threadwork with a disciplined silhouette rooted in tradition.",
    portrait: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=800&q=80",
    yearsExperience: 18,
  },
  {
    id: "artisan-03",
    name: "Salim Ali",
    location: "Jodhpur",
    craft: "Pattern cutting and leather shaping",
    bio: "Salim refines the last and cut so the mojri wears softly from the first step.",
    portrait: "https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=800&q=80",
    yearsExperience: 31,
  },
];

export const filters: Filter = {
  query: "",
  category: "Mojri",
  collection: "Heritage Edit",
  priceMin: 0,
  priceMax: 10000,
  inStockOnly: false,
  featuredOnly: false,
  artisanId: "",
};

export const categories = ["Mojri", "Slip-on", "Occasion", "Everyday"];
export const collections = ["Heritage Edit", "Evening Archive", "Ivory Series", "Sunlit Craft", "Noor Collection", "Desert Bloom"];
export const editorialSections: EditorialSection[] = [
  {
    id: "atelier-lookbook",
    eyebrow: "Jodhpur Atelier",
    title: "Crafted in the desert, composed like couture.",
    body: "A luxury editorial storefront for authentic Rajasthani mojris, balancing ivory paper textures, terracotta leather tones, and deep indigo contrast.",
    image: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=1400&q=85",
  },
  {
    id: "craft-manifesto",
    eyebrow: "Craft Manifesto",
    title: "Hand-finished pairs shaped by patient, generational skill.",
    body: "Each silhouette is cut, stitched, and refined in Jodhpur with a focus on comfort, longevity, and ceremonial presence.",
    image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1400&q=85",
  },
];

export const mockData = {
  products,
  artisans,
  filters,
  categories,
  collections,
  editorialSections,
};

export default mockData;