// src/mock.ts
// Single source of truth for all mock data, types, state helpers, and localStorage persistence.
// 100% frontend-only mock implementation.

// ----------------------
// Types & Interfaces
// ----------------------

export type CurrencyCode = "INR";

export type ProductStyle = "Bridal" | "Everyday" | "Festive" | "Classic" | "Heritage";
export type ProductColor =
  | "Ivory"
  | "Maroon"
  | "Gold"
  | "Sand"
  | "Black"
  | "Indigo"
  | "Rose";

export interface Product {
  id: string;
  slug: string;
  name: string;
  price: number;
  currency: CurrencyCode;
  images: string[];
  heroImage: string;
  style: ProductStyle;
  color: ProductColor;
  material: string;
  motif: string;
  craftTechnique: string;
  originCity: "Jodhpur";
  originState: "Rajasthan";
  authenticity: string;
  care: string;
  sizingNotes: string;
  sizes: number[];
  stockBySize: Record<string, number>;
  tags: string[];
  description: string;
  culturalHeritage: string;
  artisanId: string;
  artisanQuote: string;
  featuredRank: number;
  createdAt: string;
}

export interface ArtisanSocialLinks {
  instagram?: string;
  pinterest?: string;
  youtube?: string;
  website?: string;
}

export interface Artisan {
  id: string;
  name: string;
  atelierName: string;
  avatarUrl: string;
  location: string;
  languages: string[];
  yearsOfCraft: number;
  lineage: string;
  specialties: string[];
  bioShort: string;
  bioLong: string;
  makingProcessSteps: string[];
  sustainabilityNotes: string;
  awards: string[];
  socialLinks: ArtisanSocialLinks;
}

export interface CartItem {
  productId: string;
  size: number;
  qty: number;
  unitPrice: number;
}

export interface Cart {
  items: CartItem[];
  updatedAt: string;
}

export interface ShippingAddress {
  fullName: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatarUrl?: string; // optional: Header uses this for the Avatar image
  defaultShipping?: ShippingAddress;
}

export type OrderStatus = "confirmed" | "preparing" | "shipped" | "delivered";

export interface OrderItemSnapshot {
  productId: string;
  name: string;
  size: number;
  qty: number;
  unitPrice: number;
  lineTotal: number;
}

export interface OrderTotals {
  subtotal: number;
  estimatedShipping: number;
  total: number;
  itemCount: number;
}

export interface Order {
  id: string;
  placedAt: string;
  items: OrderItemSnapshot[];
  totals: OrderTotals;
  shippingAddress: ShippingAddress;
  status: OrderStatus;
  artisanNotes?: string;
}

export interface Filters {
  style?: ProductStyle;
  color?: ProductColor;
  artisanId?: string;
  query?: string;
}

export interface SearchSuggestionResult {
  products: Product[];
  artisans: Artisan[];
}

export interface CartTotals {
  subtotal: number;
  estimatedShipping: number;
  total: number;
  itemCount: number;
}

// ----------------------
// Safe Storage Utilities
// ----------------------

const STORAGE_KEYS = {
  CART: "jootiya_cart_v1",
  USER: "jootiya_user_v1",
  ORDERS: "jootiya_orders_v1",
} as const;

function isStorageAvailable(): boolean {
  try {
    if (typeof window === "undefined" || !("localStorage" in window)) return false;
    const testKey = "__jootiya_test__";
    window.localStorage.setItem(testKey, "1");
    window.localStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
}

const canUseStorage = isStorageAvailable();

export function load<T>(key: string, fallback: T): T {
  if (!canUseStorage) return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw) as T;
    return parsed ?? fallback;
  } catch {
    return fallback;
  }
}

export function save<T>(key: string, value: T): void {
  if (!canUseStorage) return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore
  }
}

// ----------------------
// Seed Artisans
// ----------------------

const seedArtisans: Artisan[] = [
  {
    id: "artisan-lalima-ji",
    name: "Lalima Devi",
    atelierName: "Lalima Zardozi Atelier",
    avatarUrl:
      "https://images.pexels.com/photos/3760852/pexels-photo-3760852.jpeg?auto=compress&cs=tinysrgb&w=400",
    location: "Old City, Jodhpur, Rajasthan",
    languages: ["Marwari", "Hindi"],
    yearsOfCraft: 28,
    lineage: "Third-generation zardozi artisan from a family of Jodhpur mojri makers.",
    specialties: ["Fine zardozi", "Bridal motifs", "24k zari threading"],
    bioShort:
      "Known for feather-light bridal mojris that balance royal opulence with all-evening comfort.",
    bioLong:
      "In the blue lanes of Jodhpur, Lalima Devi leads a small women-led atelier that has kept the art of zardozi mojris alive for three generations. Each pair is embroidered in soft afternoon light, where gossip, folk songs, and the rhythm of needlework braid together. Her pieces quietly travel from local weddings to global runways, always carrying a fragment of Marwar in every stitch.",
    makingProcessSteps: [
      "Sketching motifs inspired by Jodhpur frescoes and palace jaalis.",
      "Selecting leather treated with natural oils for breathable comfort.",
      "Hand-embroidering zardozi patterns in small batches over several days.",
      "Lasting and shaping mojris without rigid left-right distinction for easier break-in.",
      "Finishing edges with soft cotton piping and burnishing the leather sole.",
    ],
    sustainabilityNotes:
      "Works only with local tanneries using vegetable tanning and supports home-based women artisans with fair wages.",
    awards: [
      "Rajasthan Handloom & Handicraft Excellence Award, 2018",
      "Featured in 'Crafts of Marwar' independent documentary, 2021",
    ],
    socialLinks: {
      instagram: "https://instagram.com/lalima.mojris",
      pinterest: "https://pinterest.com/jodhpurmojris",
    },
  },
  {
    id: "artisan-salim-ji",
    name: "Salim Khan",
    atelierName: "Khan Mojri Karkhana",
    avatarUrl:
      "https://images.pexels.com/photos/461198/pexels-photo-461198.jpeg?auto=compress&cs=tinysrgb&w=400",
    location: "Clock Tower Bazaar, Jodhpur, Rajasthan",
    languages: ["Marwari", "Hindi", "Urdu"],
    yearsOfCraft: 34,
    lineage: "Descendant of royal shoemakers to the Rathore court of Jodhpur.",
    specialties: ["Classic men's mojris", "Hand-burnished leather", "Minimalist silhouettes"],
    bioShort:
      "Salim ji is renowned for perfectly balanced mojris that mold to the wearer like a second skin.",
    bioLong:
      "Inside a modest karkhana facing the old clock tower, Salim Khan maps every mojri to the easy, unhurried walks of Jodhpur streets. His focus on structure, balance, and long-wearing comfort has earned him a quiet but loyal clientele—from local mahrajahs to film costume designers who value authenticity over spectacle.",
    makingProcessSteps: [
      "Pattern-making relying on decades-old wooden templates.",
      "Selecting full-grain leather with visible, honest grain.",
      "Hand-stitching uppers using waxed cotton thread.",
      "Natural sun-drying followed by slow hand-burnishing.",
      "Finishing with a thin oil layer for a lived-in sheen.",
    ],
    sustainabilityNotes:
      "Each pair is made-to-small-batch to avoid overproduction; scrap leather is reused for children's mojris and sample swatches.",
    awards: ["Crafts Council of India Heritage Artisan, 2015"],
    socialLinks: {
      instagram: "https://instagram.com/khan.mojri",
      youtube: "https://youtube.com/@khan-mojri",
    },
  },
  {
    id: "artisan-meera-ji",
    name: "Meera Rathore",
    atelierName: "Meera Blue City Studio",
    avatarUrl:
      "https://images.pexels.com/photos/3738088/pexels-photo-3738088.jpeg?auto=compress&cs=tinysrgb&w=400",
    location: "Navchokiya, Jodhpur, Rajasthan",
    languages: ["Marwari", "Hindi", "English"],
    yearsOfCraft: 16,
    lineage: "Trained under local masters and textile artists from Ahmedabad.",
    specialties: ["Indigo dye", "Block-printed mojris", "Contemporary silhouettes"],
    bioShort:
      "Meera brings the blue of Jodhpur's walls onto supple mojri leather through experimental natural dyes.",
    bioLong:
      "Balancing design school training with childhood memories of Marwar fairs, Meera runs a young, design-forward atelier. She works closely with natural dyers and block printers to translate traditional motifs into quietly modern mojris that pair as easily with linen trousers as they do with lehengas.",
    makingProcessSteps: [
      "Preparing natural indigo vats with local dye masters.",
      "Hand-block printing motifs on cotton that is later bonded with leather.",
      "Cutting contemporary silhouettes with slightly elongated toes.",
      "Hand-stitching linings with soft cotton for barefoot comfort.",
      "Edge finishing and subtle speckle waxing for a lived-in feel.",
    ],
    sustainabilityNotes:
      "Uses natural dyes, rainwater harvesting for rinses, and reuses test prints for lining and packaging.",
    awards: [
      "Design Talent Award - Rajasthan Craft Council, 2020",
      "Featured in 'Indigo Futures' exhibition, 2022",
    ],
    socialLinks: {
      instagram: "https://instagram.com/meerabluecity",
      pinterest: "https://pinterest.com/meeramojris",
      website: "https://meerabluecity.example.com",
    },
  },
  {
    id: "artisan-omprakash-ji",
    name: "Omprakash Ji",
    atelierName: "Marwar Heritage Mojris",
    avatarUrl:
      "https://images.pexels.com/photos/2777898/pexels-photo-2777898.jpeg?auto=compress&cs=tinysrgb&w=400",
    location: "Sur Sagar, Jodhpur, Rajasthan",
    languages: ["Marwari", "Hindi"],
    yearsOfCraft: 42,
    lineage: "Started as an apprentice at 13, now mentors a cluster of rural artisans.",
    specialties: ["Gota patti", "Mirror work", "Festival mojris"],
    bioShort:
      "Omprakash ji's mojris carry the joyful maximalism of Marwar weddings.",
    bioLong:
      "For Omprakash ji, a mojri is a moving piece of festival—something that should look at home under fairy lights and desert sunsets. His atelier works with gota, mirrors, and metallic threads to compose exuberant, yet balanced pieces that never feel costume-like.",
    makingProcessSteps: [
      "Choosing base textiles that can hold intricate embellishment.",
      "Mapping mirror placement to catch light with every step.",
      "Hand-applying gota borders with tiny, almost invisible stitches.",
      "Reinforcing stress points for long-term durability.",
      "Final softening and lining for barefoot festivals.",
    ],
    sustainabilityNotes:
      "Collaborates with rural women's collectives for embellishment work, ensuring flexible hours and fair compensation.",
    awards: ["Rajasthan State Craft Mentor Award, 2012"],
    socialLinks: {
      instagram: "https://instagram.com/marwarheritagemojris",
    },
  },
];

// ----------------------
// Seed Products
// ----------------------

const seedProducts: Product[] = [
  {
    id: "mojri-noor-ivory-bride",
    slug: "noor-ivory-bridal-zardozi-mojri",
    name: "Noor Ivory Bridal Zardozi Mojri",
    price: 8200,
    currency: "INR",
    images: [
      "https://images.pexels.com/photos/169211/pexels-photo-169211.jpeg?auto=compress&cs=tinysrgb&w=1200",
      "https://images.pexels.com/photos/2690323/pexels-photo-2690323.jpeg?auto=compress&cs=tinysrgb&w=1200",
    ],
    heroImage:
      "https://images.pexels.com/photos/2690323/pexels-photo-2690323.jpeg?auto=compress&cs=tinysrgb&w=1600",
    style: "Bridal",
    color: "Ivory",
    material: "Vegetable-tanned leather with silk brocade upper",
    motif: "Fine floral zardozi with scattered pearls",
    craftTechnique: "Hand-embroidered zardozi using real zari on silk brocade",
    originCity: "Jodhpur",
    originState: "Rajasthan",
    authenticity:
      "Designed and embroidered entirely in Jodhpur, each pair is signed on the lining by Lalima Devi.",
    care:
      "Keep away from moisture, wipe gently with a soft cloth after wear, store in the breathable muslin pouch provided.",
    sizingNotes:
      "Runs slightly snug for the first 2–3 wears. If you are between sizes, we recommend sizing up.",
    sizes: [35, 36, 37, 38, 39, 40, 41],
    stockBySize: {
      "35": 3,
      "36": 6,
      "37": 10,
      "38": 8,
      "39": 5,
      "40": 4,
      "41": 2,
    },
    tags: ["bridal", "ivory", "zardozi", "pearls", "limited edition", "lalima atelier"],
    description:
      "Noor is an ode to slow bridal rituals—the pausing of bangles, the tying of ghungroos, the quiet moments before music. A slender silhouette in ivory silk brocade, traced in fine zardozi and hand-set pearls.",
    culturalHeritage:
      "Inspired by the understated ivory mojris once commissioned for royal brides of Marwar, Noor stays faithful to traditional left-right agnostic shapes while softening the inner lining for modern comfort.",
    artisanId: "artisan-lalima-ji",
    artisanQuote:
      "A bridal mojri should glow softly, like the last light on Mehrangarh's walls—not shout.",
    featuredRank: 1,
    createdAt: "2023-11-05T10:00:00.000Z",
  },
  {
    id: "mojri-mehr-maroon-festive",
    slug: "mehr-maroon-festive-mojri",
    name: "Mehr Maroon Festive Mojri",
    price: 4800,
    currency: "INR",
    images: [
      "https://images.pexels.com/photos/1407358/pexels-photo-1407358.jpeg?auto=compress&cs=tinysrgb&w=1200",
      "https://images.pexels.com/photos/783745/pexels-photo-783745.jpeg?auto=compress&cs=tinysrgb&w=1200",
    ],
    heroImage:
      "https://images.pexels.com/photos/1407358/pexels-photo-1407358.jpeg?auto=compress&cs=tinysrgb&w=1600",
    style: "Festive",
    color: "Maroon",
    material: "Hand-dyed maroon velvet with leather lining",
    motif: "Gold gota patti vines",
    craftTechnique: "Hand-applied gota borders with delicate backstitching",
    originCity: "Jodhpur",
    originState: "Rajasthan",
    authenticity:
      "Cut and embellished in Sur Sagar by Omprakash ji's festival collective.",
    care:
      "Keep away from liquids and oils, brush velvet gently in one direction, air after heavy wear.",
    sizingNotes: "True to size with a snug velvet upper that relaxes with wear.",
    sizes: [36, 37, 38, 39, 40, 41, 42],
    stockBySize: {
      "36": 8,
      "37": 10,
      "38": 10,
      "39": 6,
      "40": 4,
      "41": 4,
      "42": 2,
    },
    tags: ["festive", "maroon", "velvet", "gota patti", "omprakash atelier"],
    description:
      "Mehr is made for sangeet floors and courtyard mehfils: a plush maroon velvet base traced with fluid gota vines that shimmer, not glare, under fairy lights.",
    culturalHeritage:
      "Gota patti, once reserved for royal garments, finds a softer expression here—adapted for bare-foot comfort and all-night dancing.",
    artisanId: "artisan-omprakash-ji",
    artisanQuote:
      "Maroon is the color of celebration in Marwar; it hides dust and remembers every night of dancing.",
    featuredRank: 3,
    createdAt: "2023-10-12T08:30:00.000Z",
  },
  {
    id: "mojri-sooraj-sand-everyday",
    slug: "sooraj-sand-everyday-leather-mojri",
    name: "Sooraj Sand Everyday Leather Mojri",
    price: 3600,
    currency: "INR",
    images: [
      "https://images.pexels.com/photos/19090/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=1200",
      "https://images.pexels.com/photos/267202/pexels-photo-267202.jpeg?auto=compress&cs=tinysrgb&w=1200",
    ],
    heroImage:
      "https://images.pexels.com/photos/19090/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=1600",
    style: "Everyday",
    color: "Sand",
    material: "Hand-burnished sand leather with cotton lining",
    motif: "Minimal tonal stitch lines",
    craftTechnique: "Traditional hand-lasting on wooden blocks, slow burnishing by hand",
    originCity: "Jodhpur",
    originState: "Rajasthan",
    authenticity:
      "Pattern cut using Salim ji's decades-old templates mastered for daily wear.",
    care: "Brush off dust with a soft bristle brush, condition lightly once a season.",
    sizingNotes:
      "True to size with a balanced, forgiving width. Ideal as a first mojri for new wearers.",
    sizes: [39, 40, 41, 42, 43],
    stockBySize: {
      "39": 10,
      "40": 12,
      "41": 12,
      "42": 10,
      "43": 6,
    },
    tags: ["everyday", "sand", "minimal", "leather", "salim atelier"],
    description:
      "Sooraj is the mojri you reach for without thinking—soft sand leather that pairs with denim, linens, or a cotton kurta with equal ease.",
    culturalHeritage:
      "Retains the classic, gently upturned Marwari toe while subtly refining internal padding for city pavements.",
    artisanId: "artisan-salim-ji",
    artisanQuote: "If you forget you are wearing them by noon, the mojri has done its job.",
    featuredRank: 4,
    createdAt: "2023-09-01T09:00:00.000Z",
  },
  {
    id: "mojri-neel-indigo-classic",
    slug: "neel-indigo-classic-mojri",
    name: "Neel Indigo Classic Mojri",
    price: 4200,
    currency: "INR",
    images: [
      "https://images.pexels.com/photos/2048548/pexels-photo-2048548.jpeg?auto=compress&cs=tinysrgb&w=1200",
      "https://images.pexels.com/photos/1192602/pexels-photo-1192602.jpeg?auto=compress&cs=tinysrgb&w=1200",
    ],
    heroImage:
      "https://images.pexels.com/photos/2048548/pexels-photo-2048548.jpeg?auto=compress&cs=tinysrgb&w=1600",
    style: "Classic",
    color: "Indigo",
    material: "Indigo-dyed leather with block-printed cotton lining",
    motif: "Subtle block-printed buta on lining",
    craftTechnique: "Natural indigo vat dyeing and hand-block printing",
    originCity: "Jodhpur",
    originState: "Rajasthan",
    authenticity:
      "Dyed and printed in collaboration with Meera Blue City Studio's natural dye partners.",
    care:
      "Colour may gently evolve with time. Avoid harsh detergents, let dry in shade if damp.",
    sizingNotes: "True to size with a gently hugging upper. Breaks in over 2–3 wears.",
    sizes: [36, 37, 38, 39, 40, 41],
    stockBySize: {
      "36": 4,
      "37": 8,
      "38": 8,
      "39": 10,
      "40": 8,
      "41": 4,
    },
    tags: ["classic", "indigo", "natural dye", "meera studio"],
    description:
      "Neel carries the unmistakable blue of Jodhpur—deep, grainy, and full of quiet detail. A versatile pair for both pared-back saris and crisp shirts.",
    culturalHeritage:
      "Honours Jodhpur's indigo legacy by keeping the palette monochrome while letting grain and texture take centre stage.",
    artisanId: "artisan-meera-ji",
    artisanQuote: "Indigo is never flat; it remembers every dip in the dye vat.",
    featuredRank: 2,
    createdAt: "2023-08-15T07:00:00.000Z",
  },
  {
    id: "mojri-raas-gold-festive",
    slug: "raas-gold-festive-mirrorwork-mojri",
    name: "Raas Gold Mirrorwork Mojri",
    price: 5400,
    currency: "INR",
    images: [
      "https://images.pexels.com/photos/3755706/pexels-photo-3755706.jpeg?auto=compress&cs=tinysrgb&w=1200",
      "https://images.pexels.com/photos/3755703/pexels-photo-3755703.jpeg?auto=compress&cs=tinysrgb&w=1200",
    ],
    heroImage:
      "https://images.pexels.com/photos/3755706/pexels-photo-3755706.jpeg?auto=compress&cs=tinysrgb&w=1600",
    style: "Festive",
    color: "Gold",
    material: "Gold-toned brocade with leather base",
    motif: "Scattered mirror and gota florets",
    craftTechnique: "Hand-applied mirror work with couching stitches",
    originCity: "Jodhpur",
    originState: "Rajasthan",
    authenticity:
      "A signature festival pair from Marwar Heritage Mojris, assembled by a 6-person embellishment team.",
    care:
      "Store wrapped in soft tissue, avoid impact on mirrors, dab gently if soiled.",
    sizingNotes:
      "Snug across the forefoot to keep mirrors stable; breaks in with warmth of wear.",
    sizes: [35, 36, 37, 38, 39, 40],
    stockBySize: {
      "35": 5,
      "36": 5,
      "37": 7,
      "38": 9,
      "39": 6,
      "40": 4,
    },
    tags: ["festive", "gold", "mirror work", "gota", "omprakash atelier"],
    description:
      "Raas is built for garba nights and rooftop weddings—small mirrors catch the slightest movement, echoing the spin of a ghagra.",
    culturalHeritage:
      "Mirror work travels across Gujarat and Rajasthan; here, it leans into Marwar restraint, keeping sparkle measured.",
    artisanId: "artisan-omprakash-ji",
    artisanQuote: "The trick is to let the mirrors dance without making the foot feel heavy.",
    featuredRank: 5,
    createdAt: "2023-09-23T10:15:00.000Z",
  },
  {
    id: "mojri-khamma-black-classic",
    slug: "khamma-black-classic-mens-mojri",
    name: "Khamma Black Classic Men's Mojri",
    price: 3900,
    currency: "INR",
    images: [
      "https://images.pexels.com/photos/298863/pexels-photo-298863.jpeg?auto=compress&cs=tinysrgb&w=1200",
      "https://images.pexels.com/photos/19090/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=1200",
    ],
    heroImage:
      "https://images.pexels.com/photos/298863/pexels-photo-298863.jpeg?auto=compress&cs=tinysrgb&w=1600",
    style: "Classic",
    color: "Black",
    material: "Hand-burnished black leather with soft inner padding",
    motif: "Minimal saddle stitch",
    craftTechnique: "Traditional hand-stitching and burnishing by Salim ji",
    originCity: "Jodhpur",
    originState: "Rajasthan",
    authenticity:
      "Each pair is burnished by hand using cotton cloth and natural wax in Khan Mojri Karkhana.",
    care: "Brush off dust, condition annually, avoid direct heat.",
    sizingNotes: "Generous through the midfoot, ideal for long days of standing.",
    sizes: [40, 41, 42, 43, 44],
    stockBySize: {
      "40": 10,
      "41": 10,
      "42": 8,
      "43": 6,
      "44": 4,
    },
    tags: ["classic", "black", "mens", "salim atelier"],
    description:
      "Khamma is a bow to those who like their mojris understated—inky black leather, a quiet upturn, and a weightless feel under formal or casual wear.",
    culturalHeritage:
      "Borrowing from court footwear worn with achkans, this pair removes ornament to spotlight silhouette and craftsmanship.",
    artisanId: "artisan-salim-ji",
    artisanQuote: "Some feet ask for silence, not decoration.",
    featuredRank: 6,
    createdAt: "2023-07-19T11:00:00.000Z",
  },
  {
    id: "mojri-gulab-rose-heritage",
    slug: "gulab-rose-heritage-mojri",
    name: "Gulab Rose Heritage Mojri",
    price: 5100,
    currency: "INR",
    images: [
      "https://images.pexels.com/photos/1126993/pexels-photo-1126993.jpeg?auto=compress&cs=tinysrgb&w=1200",
      "https://images.pexels.com/photos/1124465/pexels-photo-1124465.jpeg?auto=compress&cs=tinysrgb&w=1200",
    ],
    heroImage:
      "https://images.pexels.com/photos/1126993/pexels-photo-1126993.jpeg?auto=compress&cs=tinysrgb&w=1600",
    style: "Heritage",
    color: "Rose",
    material: "Rose silk with leather sole",
    motif: "Vintage-inspired rose vines with tiny sequins",
    craftTechnique: "Fine aari embroidery by a women-led cluster",
    originCity: "Jodhpur",
    originState: "Rajasthan",
    authenticity:
      "Motifs adapted from a 19th-century haveli fresco from the old city.",
    care:
      "Keep in dust bag, avoid abrasion on sequins, dab away spills immediately.",
    sizingNotes: "Slim profile; narrow-footed wearers may size down.",
    sizes: [35, 36, 37, 38, 39],
    stockBySize: {
      "35": 3,
      "36": 5,
      "37": 7,
      "38": 7,
      "39": 4,
    },
    tags: ["heritage", "rose", "aari", "lalima atelier"],
    description:
      "Gulab revisits an old haveli mural in soft rose silk, with winding vines that catch daylight in the subtlest way.",
    culturalHeritage:
      "Jodhpur havelis often carried rose frescoes in inner courtyards; Gulab brings that intimacy to the foot.",
    artisanId: "artisan-lalima-ji",
    artisanQuote: "Some colours belong to shade more than sunlight—rose is one of them.",
    featuredRank: 7,
    createdAt: "2023-06-11T09:30:00.000Z",
  },
  {
    id: "mojri-aangan-sand-everyday",
    slug: "aangan-sand-stitched-everyday-mojri",
    name: "Aangan Hand-Stitched Sand Mojri",
    price: 3300,
    currency: "INR",
    images: [
      "https://images.pexels.com/photos/19090/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=1200",
      "https://images.pexels.com/photos/267301/pexels-photo-267301.jpeg?auto=compress&cs=tinysrgb&w=1200",
    ],
    heroImage:
      "https://images.pexels.com/photos/267301/pexels-photo-267301.jpeg?auto=compress&cs=tinysrgb&w=1600",
    style: "Everyday",
    color: "Sand",
    material: "Matte sand leather with canvas lining",
    motif: "Contrast top stitches",
    craftTechnique: "Hand-guided machine stitching with hand-finished edges",
    originCity: "Jodhpur",
    originState: "Rajasthan",
    authenticity: "Cut in Salim ji's karkhana as a daily-wear option for city commutes.",
    care: "Wipe with a damp cloth, let dry naturally, condition occasionally.",
    sizingNotes: "Roomy toe box, ideal for all-day wear.",
    sizes: [37, 38, 39, 40, 41, 42],
    stockBySize: {
      "37": 9,
      "38": 12,
      "39": 12,
      "40": 10,
      "41": 8,
      "42": 6,
    },
    tags: ["everyday", "sand", "stitched", "salim atelier"],
    description:
      "Aangan is the pair you leave by the door—reliable, soft, and structured enough for daily errands and desk days alike.",
    culturalHeritage:
      "Blends traditional mojri construction with subtle top-stitch references from worker shoes seen in old Jodhpur bazaars.",
    artisanId: "artisan-salim-ji",
    artisanQuote: "Daily pairs should age with you, not wear out before you do.",
    featuredRank: 8,
    createdAt: "2023-05-20T09:00:00.000Z",
  },
];

// ----------------------
// In-memory State & Helpers
// ----------------------

let productsState: Product[] | null = null;
let artisansState: Artisan[] | null = null;
let cartState: Cart | null = null;

// Simple pub-sub for cart changes
const cartSubscribers = new Set<() => void>();

function notifyCartSubscribers() {
  cartSubscribers.forEach((fn) => {
    try {
      fn();
    } catch {
      // ignore subscriber errors
    }
  });
}

export function subscribe(listener: () => void): void {
  cartSubscribers.add(listener);
}

export function unsubscribe(listener: () => void): void {
  cartSubscribers.delete(listener);
}

// ----------------------
// Accessors for mock data
// ----------------------

export function getProducts(): Product[] {
  if (!productsState) {
    // clone to avoid external mutation
    productsState = seedProducts.map((p) => ({ ...p, stockBySize: { ...p.stockBySize } }));
  }
  return productsState.map((p) => ({ ...p, stockBySize: { ...p.stockBySize } }));
}

export function getArtisans(): Artisan[] {
  if (!artisansState) {
    artisansState = seedArtisans.map((a) => ({ ...a }));
  }
  return artisansState.map((a) => ({ ...a, socialLinks: { ...a.socialLinks } }));
}

export function getProductById(id: string): Product | undefined {
  return getProducts().find((p) => p.id === id);
}

export function getProductsByIds(ids: string[]): Product[] {
  const set = new Set(ids);
  return getProducts().filter((p) => set.has(p.id));
}

// ----------------------
// Filtering & Search
// ----------------------

export function getFilteredProducts(filters: Filters): Product[] {
  const all = getProducts();
  if (!filters || Object.keys(filters).length === 0) {
    return all;
  }

  return all.filter((product) => {
    if (filters.style && product.style !== filters.style) return false;
    if (filters.color && product.color !== filters.color) return false;
    if (filters.artisanId && product.artisanId !== filters.artisanId) return false;

    if (filters.query && filters.query.trim() !== "") {
      const q = filters.query.trim().toLowerCase();
      const haystack = [
        product.name,
        product.description,
        product.craftTechnique,
        product.material,
        product.motif,
        product.tags.join(" "),
      ]
        .join(" ")
        .toLowerCase();
      if (!haystack.includes(q)) return false;
    }

    return true;
  });
}

export function searchSuggestions(query: string): SearchSuggestionResult {
  const trimmed = query.trim();
  if (!trimmed) {
    return { products: [], artisans: [] };
  }
  const q = trimmed.toLowerCase();

  const products = getProducts().filter((p) => {
    const text = [p.name, p.description, p.tags.join(" ")].join(" ").toLowerCase();
    return text.includes(q);
  });

  const artisans = getArtisans().filter((a) => {
    const text = [a.name, a.atelierName, a.bioShort].join(" ").toLowerCase();
    return text.includes(q);
  });

  return { products, artisans };
}

// Convenience wrapper to match Header import name
export function getSearchSuggestions(query: string): SearchSuggestionResult {
  return searchSuggestions(query);
}

// ----------------------
// Cart implementation
// ----------------------

function getEmptyCart(): Cart {
  return { items: [], updatedAt: new Date().toISOString() };
}

export function getCart(): Cart {
  if (!cartState) {
    cartState = load<Cart>(STORAGE_KEYS.CART, getEmptyCart());
  }
  // clone to avoid mutation
  return {
    ...cartState,
    items: cartState.items.map((i) => ({ ...i })),
  };
}

function persistCart(next: Cart) {
  cartState = { ...next, items: next.items.map((i) => ({ ...i })) };
  save<Cart>(STORAGE_KEYS.CART, cartState);
  notifyCartSubscribers();
}

export function addToCart(productId: string, size: number, qty: number): void {
  if (qty <= 0) return;
  const product = getProductById(productId);
  if (!product) {
    throw new Error("Product not found in mock catalog.");
  }

  const cart = getCart();
  const existing = cart.items.find(
    (item) => item.productId === productId && item.size === size,
  );

  if (existing) {
    existing.qty += qty;
  } else {
    cart.items.push({
      productId,
      size,
      qty,
      unitPrice: product.price,
    });
  }

  cart.updatedAt = new Date().toISOString();
  persistCart(cart);
}

export function removeFromCart(productId: string, size: number): void {
  const cart = getCart();
  cart.items = cart.items.filter(
    (item) => !(item.productId === productId && item.size === size),
  );
  cart.updatedAt = new Date().toISOString();
  persistCart(cart);
}

export function clearCart(): void {
  persistCart(getEmptyCart());
}

export function getCartTotals(): CartTotals {
  const cart = getCart();
  const subtotal = cart.items.reduce(
    (acc, item) => acc + item.unitPrice * item.qty,
    0,
  );
  const itemCount = cart.items.reduce((acc, item) => acc + item.qty, 0);
  const estimatedShipping = subtotal > 0 ? 250 : 0;
  const total = subtotal + estimatedShipping;
  return { subtotal, estimatedShipping, total, itemCount };
}

// Alias to satisfy Header import name while keeping existing usage intact
export function computeCartTotals(cart: Cart): CartTotals {
  const subtotal = cart.items.reduce(
    (acc, item) => acc + item.unitPrice * item.qty,
    0,
  );
  const itemCount = cart.items.reduce((acc, item) => acc + item.qty, 0);
  const estimatedShipping = subtotal > 0 ? 250 : 0;
  const total = subtotal + estimatedShipping;
  return { subtotal, estimatedShipping, total, itemCount };
}

// ----------------------
// Orders (minimal mock)
// ----------------------

export function getOrders(): Order[] {
  return load<Order[]>(STORAGE_KEYS.ORDERS, []);
}

export function addMockOrderFromCart(address: ShippingAddress): Order {
  const cart = getCart();
  if (cart.items.length === 0) {
    throw new Error("Cannot place order with an empty cart in this mock.");
  }

  const productsById = new Map(getProducts().map((p) => [p.id, p] as const));

  const items: OrderItemSnapshot[] = cart.items.map((item) => {
    const product = productsById.get(item.productId);
    const name = product ? product.name : "Unknown mojri";
    const lineTotal = item.unitPrice * item.qty;
    return {
      productId: item.productId,
      name,
      size: item.size,
      qty: item.qty,
      unitPrice: item.unitPrice,
      lineTotal,
    };
  });

  const subtotal = items.reduce((acc, i) => acc + i.lineTotal, 0);
  const itemCount = items.reduce((acc, i) => acc + i.qty, 0);
  const estimatedShipping = subtotal > 0 ? 250 : 0;
  const total = subtotal + estimatedShipping;

  const order: Order = {
    id: `mock-order-${Date.now()}`,
    placedAt: new Date().toISOString(),
    items,
    totals: { subtotal, estimatedShipping, total, itemCount },
    shippingAddress: { ...address },
    status: "confirmed",
  };

  const current = getOrders();
  const next = [order, ...current];
  save<Order[]>(STORAGE_KEYS.ORDERS, next);

  clearCart();

  return order;
}

// ----------------------
// User profile (lightweight)
// ----------------------

export function getUser(): UserProfile | null {
  return load<UserProfile | null>(STORAGE_KEYS.USER, null);
}

export function saveUser(profile: UserProfile | null): void {
  if (!profile) {
    save<UserProfile | null>(STORAGE_KEYS.USER, null);
  } else {
    save<UserProfile | null>(STORAGE_KEYS.USER, { ...profile });
  }
}

// Convenience: featured products sorted by rank
export function getFeaturedProducts(limit = 8): Product[] {
  return [...getProducts()]
    .sort((a, b) => a.featuredRank - b.featuredRank)
    .slice(0, limit);
}