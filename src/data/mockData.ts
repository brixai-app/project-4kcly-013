import type { Artisan, Filter, Product } from "@/types";

export const mockData = {
  navigation: [
    { label: "Home", href: "/" },
    { label: "Shop", href: "/shop" },
    { label: "Artisans", href: "/artisans" },
    { label: "About", href: "/about" },
  ],
  filters: {
    categories: ["All", "Classic Mojri", "Wedding Edit", "Everyday Heritage", "Embroidered", "Minimal"],
    artisans: ["All", "Bikaner Studio", "Jodhpur Atelier", "Jaipur Workshop", "Marwar Collective"],
    priceRange: [999, 8999] as [number, number],
    search: "",
    sortBy: "featured" as Filter["sortBy"],
  },
  editorial: {
    hero: {
      eyebrow: "Jodhpur atelier / handcrafted heritage",
      title: "Mojris shaped for ceremony, city, and slow living.",
      body:
        "Warm ivory canvases, muted-gold detailing, and tactile leatherwork define a refined edit of authentic Jodhpuri Mojris.",
      cta: "Explore Collection",
      image: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=1400&q=85",
    },
    manifesto: [
      "Hand-finished uppers, softened linings, and heritage silhouettes.",
      "Designed for weddings, gatherings, and everyday ritual.",
      "Rooted in Rajasthani craft with a contemporary editorial eye.",
    ],
  },
  products: [
    {
      id: "prod-001",
      name: "Mehr Ivory Mojri",
      slug: "mehr-ivory-mojri",
      price: 2499,
      description: "A clean ivory mojri with subtle tonal embroidery and a softened almond toe.",
      category: "Classic Mojri",
      artisanId: "art-001",
      image: "https://images.unsplash.com/photo-1533867617858-e7b97e060509?auto=format&fit=crop&w=800&q=80",
      gallery: [
        "https://images.unsplash.com/photo-1533867617858-e7b97e060509?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&w=800&q=80",
      ],
      sizes: ["6", "7", "8", "9", "10"],
      colors: ["Ivory", "Sand"],
      featured: true,
      inStock: true,
      rating: 4.8,
    },
    {
      id: "prod-002",
      name: "Noor Terracotta Mojri",
      slug: "noor-terracotta-mojri",
      price: 2899,
      description: "Terracotta leather with restrained threadwork and a polished festive finish.",
      category: "Wedding Edit",
      artisanId: "art-002",
      image: "https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&w=800&q=80",
      gallery: [
        "https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=800&q=80",
      ],
      sizes: ["6", "7", "8", "9", "10", "11"],
      colors: ["Terracotta", "Rust"],
      featured: true,
      inStock: true,
      rating: 4.9,
    },
    {
      id: "prod-003",
      name: "Saanjh Black Mojri",
      slug: "saanjh-black-mojri",
      price: 2199,
      description: "A minimal black mojri with a matte finish and versatile ceremonial profile.",
      category: "Minimal",
      artisanId: "art-003",
      image: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=1400&q=85",
      gallery: [
        "https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=1400&q=85",
        "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1400&q=85",
      ],
      sizes: ["7", "8", "9", "10", "11"],
      colors: ["Black", "Charcoal"],
      featured: false,
      inStock: true,
      rating: 4.7,
    },
    {
      id: "prod-004",
      name: "Riwaayat Embroidered Mojri",
      slug: "riwaayat-embroidered-mojri",
      price: 3499,
      description: "Dense hand embroidery across the vamp with a supple leather base and festive sheen.",
      category: "Embroidered",
      artisanId: "art-004",
      image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1400&q=85",
      gallery: [
        "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1400&q=85",
        "https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=1400&q=85",
      ],
      sizes: ["6", "7", "8", "9"],
      colors: ["Gold", "Ivory"],
      featured: true,
      inStock: true,
      rating: 5,
    },
    {
      id: "prod-005",
      name: "Marwar Sand Mojri",
      slug: "marwar-sand-mojri",
      price: 1999,
      description: "An everyday heritage staple in sand-toned leather with a softly structured fit.",
      category: "Everyday Heritage",
      artisanId: "art-001",
      image: "https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=1400&q=85",
      gallery: [
        "https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=1400&q=85",
        "https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=800&q=80",
      ],
      sizes: ["6", "7", "8", "9", "10"],
      colors: ["Sand", "Beige"],
      featured: false,
      inStock: true,
      rating: 4.6,
    },
    {
      id: "prod-006",
      name: "Aangan Gold Mojri",
      slug: "aangan-gold-mojri",
      price: 3999,
      description: "A ceremonial gold mojri with luminous thread accents and a refined formal silhouette.",
      category: "Wedding Edit",
      artisanId: "art-002",
      image: "https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=800&q=80",
      gallery: [
        "https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=800&q=80",
      ],
      sizes: ["7", "8", "9", "10", "11"],
      colors: ["Gold", "Antique Brass"],
      featured: true,
      inStock: false,
      rating: 4.9,
    },
  ] satisfies Product[],
  artisans: [
    {
      id: "art-001",
      name: "Rafiq Khan",
      title: "Master Leather Cutter",
      location: "Jodhpur, Rajasthan",
      bio: "Rafiq shapes each upper with a disciplined hand, balancing comfort, symmetry, and the quiet elegance of traditional mojri construction.",
      image: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=800&q=80",
      specialties: ["Leather cutting", "Last shaping", "Everyday heritage"],
    },
    {
      id: "art-002",
      name: "Amina Bano",
      title: "Embroidery Artisan",
      location: "Bikaner, Rajasthan",
      bio: "Amina leads the threadwork studio, translating ceremonial motifs into restrained surfaces that feel both festive and modern.",
      image: "https://images.unsplash.com/photo-1533867617858-e7b97e060509?auto=format&fit=crop&w=800&q=80",
      specialties: ["Hand embroidery", "Wedding edits", "Gold detailing"],
    },
    {
      id: "art-003",
      name: "Imran Ali",
      title: "Finishing Specialist",
      location: "Jaipur, Rajasthan",
      bio: "Imran oversees burnishing, lining, and final balance so every pair lands with a polished, wearable finish.",
      image: "https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&w=800&q=80",
      specialties: ["Finishing", "Polishing", "Comfort lining"],
    },
  ] satisfies Artisan[],
};

export const navigation = mockData.navigation;
export const filters = mockData.filters;
export const editorial = mockData.editorial;
export const products = mockData.products;
export const artisans = mockData.artisans;

export default mockData;
export const categories = (mockData as any)?.categories ?? [];

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
