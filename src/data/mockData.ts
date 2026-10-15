import {
  Product,
  ProductColorToken,
  ProductSortOption,
  ProductTag,
  ProductCategory,
  MasonryColumnConfig,
  AppTypographyTokens,
  JootiyaTheme,
} from '@/types';

const typographyTokens: AppTypographyTokens = {
  displayFamily: '"Playfair Display", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  bodyFamily: '"Inter", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  accentFamily: '"Bodoni Moda", "Playfair Display", serif',
};

const theme: JootiyaTheme = {
  background: '#F9F6F2',
  surface: '#FFFFFF',
  border: '#D9D1C7',
  text: '#2E2B28',
  muted: '#6F675E',
  accent: '#8B0000',
  accentHover: '#6F0000',
  accentText: '#FFFFFF',
  radius: 16,
};

const masonryConfig: MasonryColumnConfig[] = [
  { minWidth: 0, columnCount: 1 },
  { minWidth: 640, columnCount: 2 },
  { minWidth: 1024, columnCount: 3 },
];

const sortOptions: ProductSortOption[] = [
  {
    id: 'featured',
    label: 'Featured',
    field: 'featured',
    direction: 'desc',
  },
  {
    id: 'price-low-high',
    label: 'Price: Low to High',
    field: 'price',
    direction: 'asc',
  },
  {
    id: 'price-high-low',
    label: 'Price: High to Low',
    field: 'price',
    direction: 'desc',
  },
  {
    id: 'new-arrivals',
    label: 'New Arrivals',
    field: 'createdAt',
    direction: 'desc',
  },
  {
    id: 'name-a-z',
    label: 'Name A–Z',
    field: 'name',
    direction: 'asc',
  },
];

const allSizesEU = (defaults: number[]): { id: string; sizeLabel: string; scale: 'EU'; value: number; stock: number; isDefault?: boolean }[] => {
  const baseSizes = [36, 37, 38, 39, 40, 41, 42, 43];
  return baseSizes.map((size) => ({
    id: `eu-${size}`,
    sizeLabel: `EU ${size}`,
    scale: 'EU',
    value: size,
    stock: defaults.includes(size) ? 0 : 6 + (size % 3),
    isDefault: size === 40,
  }));
};

const slugify = (value: string): string =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');

const baseTags: ProductTag[] = ['leather', 'minimal', 'street'];

const baseCategories: ProductCategory[] = ['sneakers', 'loafers', 'boots', 'sandals', 'heels', 'slides', 'derby', 'oxford', 'limited', 'accessories'];

const colorTokens: ProductColorToken[] = ['ivory', 'sand', 'taupe', 'charcoal', 'black', 'white', 'crimson', 'olive', 'navy', 'cognac'];

const euro = (price: number) => price;

const products: Product[] = [
  {
    id: 'jootiya-atelier-high-ivory',
    slug: slugify('Atelier High Sneaker in Ivory Canvas'),
    name: 'Atelier High',
    subtitle: 'Ivory Canvas High-Top Sneaker',
    description:
      'A sculpted high-top silhouette in washed ivory canvas with a molded outsole and leather heel tab. Designed for all-day gallery walks and late-night rooftops.',
    category: 'sneakers',
    collection: 'Atelier Canvas Vol. I',
    price: euro(320),
    compareAtPrice: euro(360),
    currency: 'EUR',
    images: [
      {
        id: 'atelier-ivory-1',
        url: 'https://images.unsplash.com/photo-1731272832794-d66014ad7d87?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMDY2MTIyfDB8MXxzZWFyY2h8MXx8bWluaW1hbGlzdCUyMGxlYXRoZXIlMjBncmFpbiUyMHRleHR1cmUlMjBvdmVybGF5JTIwc2VhbWxlc3N8ZW58MHwwfHx8MTc5MjA3NzU4OHww&ixlib=rb-4.1.0&q=80&w=1080&q=80&w=1200&auto=format&fit=crop',
        alt: 'Ivory luxury high-top sneakers on textured studio backdrop',
        priority: true,
      },
      {
        id: 'atelier-ivory-2',
        url: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=800&q=80',
        alt: 'Side angle of ivory luxury sneakers on warm-toned background',
      },
      {
        id: 'atelier-ivory-3',
        url: 'https://images.unsplash.com/photo-1755541608110-3440a0f168ed?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMDY2MTIyfDB8MXxzZWFyY2h8M3x8bWluaW1hbGlzdCUyMGxlYXRoZXIlMjBncmFpbiUyMHRleHR1cmUlMjBvdmVybGF5JTIwc2VhbWxlc3N8ZW58MHwwfHx8MTc5MjA3NzU4OHww&ixlib=rb-4.1.0&q=80&w=1080&q=80&w=1200&auto=format&fit=crop',
        alt: 'Detail shot of sneaker stitching and laces',
      },
    ],
    colors: ['ivory', 'sand', 'charcoal'],
    primaryColor: 'ivory',
    sizes: allSizesEU([]),
    tags: ['new', 'bestseller', 'editorial-pick', 'leather', 'street'],
    isFeatured: true,
    isLimited: false,
    createdAt: '2024-03-12T10:00:00.000Z',
    popularityScore: 96,
    metadata: {
      weightGrams: 620,
      upperMaterial: 'Washed cotton canvas with Italian calf leather trim',
      liningMaterial: 'Breathable microfibre',
      soleMaterial: 'Natural rubber with recycled content',
      construction: 'Sidewall stitched cupsole',
      countryOfOrigin: 'Portugal',
      careInstructions: 'Spot clean with a soft brush and mild soap. Avoid machine washing.',
      fitNote: 'True to size with a softly padded collar for ankle comfort.',
    },
  },
  {
    id: 'jootiya-atelier-high-charcoal',
    slug: slugify('Atelier High Sneaker in Charcoal'),
    name: 'Atelier High',
    subtitle: 'Charcoal Canvas High-Top Sneaker',
    description:
      'The same minimalist Atelier High, reimagined in deep charcoal canvas with tone-on-tone laces. A quiet statement piece for monochrome wardrobes.',
    category: 'sneakers',
    collection: 'Atelier Canvas Vol. I',
    price: euro(320),
    currency: 'EUR',
    images: [
      {
        id: 'atelier-charcoal-1',
        url: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=800&q=80',
        alt: 'Charcoal luxury sneakers set against a dark studio backdrop',
        priority: true,
      },
      {
        id: 'atelier-charcoal-2',
        url: 'https://images.unsplash.com/photo-1630905119003-329447458f85?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMDY2MTIyfDB8MXxzZWFyY2h8Mnx8YXJjaGl0ZWN0dXJhbCUyMGJvdXRpcXVlJTIwaW50ZXJpb3IlMjBuZXV0cmFsJTIwcGFsZXR0ZXxlbnwwfDB8fHwxNzkyMDc3NjAxfDA&ixlib=rb-4.1.0&q=80&w=1080&q=80&w=1200&auto=format&fit=crop',
        alt: 'Editorial overhead shot of dark sneakers on neutral palette',
      },
    ],
    colors: ['charcoal', 'black', 'ivory'],
    primaryColor: 'charcoal',
    sizes: allSizesEU([36, 43]),
    tags: ['bestseller', 'editorial-pick', 'street', 'minimal'],
    isFeatured: true,
    isLimited: true,
    createdAt: '2024-04-02T09:00:00.000Z',
    popularityScore: 91,
    metadata: {
      weightGrams: 615,
      upperMaterial: 'Organic cotton canvas with waxed finish',
      liningMaterial: 'Recycled mesh',
      soleMaterial: 'Vulcanised rubber',
      construction: 'Hand-lasted, vulcanised',
      countryOfOrigin: 'Italy',
      careInstructions: 'Brush off dust regularly; apply fabric protector before first wear.',
      fitNote: 'Slightly narrow at the forefoot. Size up if between sizes.',
    },
  },
  {
    id: 'jootiya-lido-sandal-sand',
    slug: slugify('Lido Leather Sandal in Sand'),
    name: 'Lido Sandal',
    subtitle: 'Cross-Strap Sandal in Sand Leather',
    description:
      'An understated slip-on sandal with padded cross straps in sand calf leather and a contoured footbed. Designed for slow seaside mornings and city terraces.',
    category: 'sandals',
    collection: 'Seaside Study',
    price: euro(260),
    currency: 'EUR',
    images: [
      {
        id: 'lido-sand-1',
        url: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=800&q=80',
        alt: 'Minimal leather sandals styled on a stone plinth',
        priority: true,
      },
      {
        id: 'lido-sand-2',
        url: 'https://images.unsplash.com/photo-1630905119003-329447458f85?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMDY2MTIyfDB8MXxzZWFyY2h8Mnx8YXJjaGl0ZWN0dXJhbCUyMGJvdXRpcXVlJTIwaW50ZXJpb3IlMjBuZXV0cmFsJTIwcGFsZXR0ZXxlbnwwfDB8fHwxNzkyMDc3NjAxfDA&ixlib=rb-4.1.0&q=80&w=1080&q=80&w=1200&auto=format&fit=crop',
        alt: 'Lifestyle shot of sandals on a warm neutral backdrop',
      },
    ],
    colors: ['sand', 'ivory', 'cognac'],
    primaryColor: 'sand',
    sizes: allSizesEU([37, 42]),
    tags: ['new', 'handmade', 'leather', 'minimal'],
    isFeatured: true,
    isLimited: false,
    createdAt: '2024-05-10T12:30:00.000Z',
    popularityScore: 88,
    metadata: {
      heelHeightMm: 15,
      weightGrams: 420,
      upperMaterial: 'Italian calf leather',
      liningMaterial: 'Nappa leather',
      soleMaterial: 'Stacked leather with rubber insert',
      construction: 'Stitched leather sole',
      countryOfOrigin: 'Spain',
      careInstructions: 'Condition leather every few months; store with shoe trees.',
      fitNote: 'Slightly generous; if between sizes, take the smaller.',
    },
  },
  {
    id: 'jootiya-loom-runner-olive',
    slug: slugify('Loom Runner in Olive Mesh'),
    name: 'Loom Runner',
    subtitle: 'Olive Technical Runner',
    description:
      'A lightweight runner in olive technical mesh with tonal suede overlays and a sculpted sole. Built for the city with just enough trail attitude.',
    category: 'sneakers',
    collection: 'Urban Circuit',
    price: euro(290),
    compareAtPrice: euro(320),
    currency: 'EUR',
    images: [
      {
        id: 'loom-olive-1',
        url: 'https://images.unsplash.com/photo-1731272832794-d66014ad7d87?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMDY2MTIyfDB8MXxzZWFyY2h8MXx8bWluaW1hbGlzdCUyMGxlYXRoZXIlMjBncmFpbiUyMHRleHR1cmUlMjBvdmVybGF5JTIwc2VhbWxlc3N8ZW58MHwwfHx8MTc5MjA3NzU4OHww&ixlib=rb-4.1.0&q=80&w=1080&q=80&w=1200&auto=format&fit=crop',
        alt: 'Technical runner sneaker in olive on warm studio floor',
        priority: true,
      },
      {
        id: 'loom-olive-2',
        url: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=800&q=80',
        alt: 'Close-up detail of sneaker sole and midsole sculpting',
      },
    ],
    colors: ['olive', 'charcoal', 'sand'],
    primaryColor: 'olive',
    sizes: allSizesEU([39]),
    tags: ['new', 'vegan', 'street', 'arch-support'],
    isFeatured: true,
    isLimited: true,
    createdAt: '2024-06-01T08:15:00.000Z',
    popularityScore: 93,
    metadata: {
      weightGrams: 540,
      upperMaterial: 'Recycled performance mesh and vegan suede',
      liningMaterial: 'Moisture-wicking technical textile',
      soleMaterial: 'EVA midsole with rubber outsole',
      construction: 'Cemented lightweight runner',
      countryOfOrigin: 'Vietnam',
      careInstructions: 'Air dry only; remove insoles and laces for a quicker dry.',
      fitNote: 'Designed with integrated arch support and a softly rockered sole.',
    },
  },
  {
    id: 'jootiya-gallery-loafer-cognac',
    slug: slugify('Gallery Loafer in Cognac Leather'),
    name: 'Gallery Loafer',
    subtitle: 'Cognac Penny Loafer',
    description:
      'A refined penny loafer with a softly squared toe in hand-finished cognac leather. Equally suited to tailoring and selvedge denim.',
    category: 'loafers',
    collection: 'Gallery Line',
    price: euro(380),
    currency: 'EUR',
    images: [
      {
        id: 'gallery-cognac-1',
        url: 'https://images.unsplash.com/photo-1630905119003-329447458f85?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMDY2MTIyfDB8MXxzZWFyY2h8Mnx8YXJjaGl0ZWN0dXJhbCUyMGJvdXRpcXVlJTIwaW50ZXJpb3IlMjBuZXV0cmFsJTIwcGFsZXR0ZXxlbnwwfDB8fHwxNzkyMDc3NjAxfDA&ixlib=rb-4.1.0&q=80&w=1080&q=80&w=1200&auto=format&fit=crop',
        alt: 'Polished leather loafers on a sculptural plinth',
        priority: true,
      },
      {
        id: 'gallery-cognac-2',
        url: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1400&q=85',
        alt: 'Interior boutique shot with leather loafers and soft lighting',
      },
    ],
    colors: ['cognac', 'black', 'taupe'],
    primaryColor: 'cognac',
    sizes: allSizesEU([36]),
    tags: ['bestseller', 'leather', 'minimal'],
    isFeatured: true,
    isLimited: false,
    createdAt: '2024-02-20T11:45:00.000Z',
    popularityScore: 89,
    metadata: {
      heelHeightMm: 20,
      weightGrams: 580,
      upperMaterial: 'Full-grain calf leather',
      liningMaterial: 'Vegetable-tanned leather',
      soleMaterial: 'Leather with rubber forepart',
      construction: 'Blake-stitched',
      countryOfOrigin: 'Italy',
      careInstructions: 'Use cedar shoe trees; polish with neutral cream.',
      fitNote: 'Breaks in beautifully; snug at first wear is expected.',
    },
  },
  {
    id: 'jootiya-orbit-boot-black',
    slug: slugify('Orbit Chelsea Boot in Black'),
    name: 'Orbit Boot',
    subtitle: 'Black Chelsea Boot',
    description:
      'A sleek Chelsea boot on a subtly exaggerated sole, cut from matte black leather. A sharp line that anchors wide trousers and fluid tailoring.',
    category: 'boots',
    collection: 'Orbit Volume',
    price: euro(420),
    compareAtPrice: euro(460),
    currency: 'EUR',
    images: [
      {
        id: 'orbit-black-1',
        url: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=800&q=80',
        alt: 'Black leather Chelsea boots on neutral fabric backdrop',
        priority: true,
      },
      {
        id: 'orbit-black-2',
        url: 'https://images.unsplash.com/photo-1630905119003-329447458f85?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMDY2MTIyfDB8MXxzZWFyY2h8Mnx8YXJjaGl0ZWN0dXJhbCUyMGJvdXRpcXVlJTIwaW50ZXJpb3IlMjBuZXV0cmFsJTIwcGFsZXR0ZXxlbnwwfDB8fHwxNzkyMDc3NjAxfDA&ixlib=rb-4.1.0&q=80&w=1080&q=80&w=1200&auto=format&fit=crop',
        alt: 'Detailed profile shot of modern Chelsea boot sole',
      },
    ],
    colors: ['black', 'charcoal'],
    primaryColor: 'black',
    sizes: allSizesEU([41, 42]),
    tags: ['exclusive', 'leather', 'evening'],
    isFeatured: true,
    isLimited: true,
    createdAt: '2024-01-15T14:20:00.000Z',
    popularityScore: 87,
    metadata: {
      heelHeightMm: 30,
      weightGrams: 760,
      upperMaterial: 'Smooth calf leather',
      liningMaterial: 'Full leather lining',
      soleMaterial: 'Chunky rubber lug sole',
      construction: 'Goodyear-welted',
      countryOfOrigin: 'Spain',
      careInstructions: 'Brush and condition regularly; resole with a specialist when worn.',
      fitNote: 'Elastic gussets allow for an easy slip-on fit; true to size.',
    },
  },
  {
    id: 'jootiya-orchard-heel-crimson',
    slug: slugify('Orchard Heel in Crimson Satin'),
    name: 'Orchard Heel',
    subtitle: 'Crimson Evening Sandal',
    description:
      'A slender evening sandal with crossed front straps and a wrapped heel in deep crimson satin. A quietly dramatic line under slip dresses and sharp suiting.',
    category: 'heels',
    collection: 'Nocturne Edit',
    price: euro(390),
    currency: 'EUR',
    images: [
      {
        id: 'orchard-crimson-1',
        url: 'https://images.unsplash.com/photo-1624289659886-f37f6d061673?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMDY2MTIyfDB8MXxzZWFyY2h8MXx8c3RyZWV0JTIwc3R5bGUlMjBsdXh1cnklMjBzbmVha2VycyUyMGF1dHVtbiUyMGVkaXRvcmlhbHxlbnwwfDB8fHwxNzkyMDc3NjAzfDA&ixlib=rb-4.1.0&q=80&w=1080&q=80&w=1200&auto=format&fit=crop',
        alt: 'Crimson satin heels on a draped textile set',
        priority: true,
      },
      {
        id: 'orchard-crimson-2',
        url: 'https://images.unsplash.com/photo-1638265499174-62c2cb29137a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMDY2MTIyfDB8MXxzZWFyY2h8MXx8bHV4dXJ5JTIwc25lYWtlciUyMGVkaXRvcmlhbCUyMGxvb2tib29rJTIwc3R1ZGlvJTIwbGlnaHRpbmd8ZW58MHwwfHx8MTc5MjA3NzU4NHww&ixlib=rb-4.1.0&q=80&w=1080&q=80&w=1200&auto=format&fit=crop',
        alt: 'High-fashion overhead shot of red heels in soft shadow',
      },
    ],
    colors: ['crimson', 'black'],
    primaryColor: 'crimson',
    sizes: allSizesEU([36, 37]),
    tags: ['evening', 'limited-run', 'editorial-pick'],
    isFeatured: true,
    isLimited: true,
    createdAt: '2024-06-18T16:00:00.000Z',
    popularityScore: 90,
    metadata: {
      heelHeightMm: 85,
      weightGrams: 460,
      upperMaterial: 'Silk blend satin',
      liningMaterial: 'Nappa leather',
      soleMaterial: 'Leather with anti-slip insert',
      construction: 'Hand-lasted sandal',
      countryOfOrigin: 'Italy',
      careInstructions: 'Avoid water contact; store in dust bags to prevent snags.',
      fitNote: 'Delicate straps designed to hug the foot; true to size.',
    },
  },
  {
    id: 'jootiya-studio-slide-taupe',
    slug: slugify('Studio Slide in Taupe'),
    name: 'Studio Slide',
    subtitle: 'Molded Slide in Taupe',
    description:
      'A sculptural slide with a softly squared profile in cloudy taupe. Lightweight and water-friendly with a distinctly architectural silhouette.',
    category: 'slides',
    collection: 'Studio Forms',
    price: euro(180),
    currency: 'EUR',
    images: [
      {
        id: 'studio-taupe-1',
        url: 'https://images.unsplash.com/photo-1741086154510-522e68f76933?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMDY2MTIyfDB8MXxzZWFyY2h8Mnx8bWluaW1hbGlzdCUyMGxlYXRoZXIlMjBncmFpbiUyMHRleHR1cmUlMjBvdmVybGF5JTIwc2VhbWxlc3N8ZW58MHwwfHx8MTc5MjA3NzU4OHww&ixlib=rb-4.1.0&q=80&w=1080&q=80&w=1200&auto=format&fit=crop',
        alt: 'Taupe sculptural slides on neutral textured surface',
        priority: true,
      },
      {
        id: 'studio-taupe-2',
        url: 'https://images.unsplash.com/photo-1630905119003-329447458f85?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMDY2MTIyfDB8MXxzZWFyY2h8Mnx8YXJjaGl0ZWN0dXJhbCUyMGJvdXRpcXVlJTIwaW50ZXJpb3IlMjBuZXV0cmFsJTIwcGFsZXR0ZXxlbnwwfDB8fHwxNzkyMDc3NjAxfDA&ixlib=rb-4.1.0&q=80&w=1080&q=80&w=1200&auto=format&fit=crop',
        alt: 'Close-up of molded slide with soft lighting',
      },
    ],
    colors: ['taupe', 'sand', 'ivory'],
    primaryColor: 'taupe',
    sizes: allSizesEU([43]),
    tags: ['vegan', 'street', 'minimal'],
    isFeatured: false,
    isLimited: false,
    createdAt: '2024-03-05T10:30:00.000Z',
    popularityScore: 82,
    metadata: {
      weightGrams: 280,
      upperMaterial: 'Single-piece molded EVA',
      liningMaterial: 'Unlined',
      soleMaterial: 'EVA foam',
      construction: 'Injection molded',
      countryOfOrigin: 'Portugal',
      careInstructions: 'Rinse with water; air dry away from direct heat.',
      fitNote: 'Roomy, wide-friendly fit with a cushioned step.',
    },
  },
  {
    id: 'jootiya-archive-derby-ivory',
    slug: slugify('Archive Derby in Ivory'),
    name: 'Archive Derby',
    subtitle: 'Ivory Split-Toe Derby',
    description:
      'A split-toe derby on a slim leather sole in soft ivory leather, finished with waxed cotton laces. A subtle archival reference for modern wardrobes.',
    category: 'derby',
    collection: 'Archive Line',
    price: euro(410),
    currency: 'EUR',
    images: [
      {
        id: 'archive-ivory-1',
        url: 'https://images.unsplash.com/photo-1630905119003-329447458f85?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMDY2MTIyfDB8MXxzZWFyY2h8Mnx8YXJjaGl0ZWN0dXJhbCUyMGJvdXRpcXVlJTIwaW50ZXJpb3IlMjBuZXV0cmFsJTIwcGFsZXR0ZXxlbnwwfDB8fHwxNzkyMDc3NjAxfDA&ixlib=rb-4.1.0&q=80&w=1080&q=80&w=1200&auto=format&fit=crop',
        alt: 'Ivory derby shoes on neutral architectural set',
        priority: true,
      },
      {
        id: 'archive-ivory-2',
        url: 'https://images.unsplash.com/photo-1630905119003-329447458f85?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMDY2MTIyfDB8MXxzZWFyY2h8Mnx8YXJjaGl0ZWN0dXJhbCUyMGJvdXRpcXVlJTIwaW50ZXJpb3IlMjBuZXV0cmFsJTIwcGFsZXR0ZXxlbnwwfDB8fHwxNzkyMDc3NjAxfDA&ixlib=rb-4.1.0&q=80&w=1080&q=80&w=1200&auto=format&fit=crop',
        alt: 'Detail of split-toe construction and lace stay',
      },
    ],
    colors: ['ivory', 'cognac', 'black'],
    primaryColor: 'ivory',
    sizes: allSizesEU([39, 40]),
    tags: ['handmade', 'leather', 'minimal'],
    isFeatured: false,
    isLimited: true,
    createdAt: '2023-12-02T09:10:00.000Z',
    popularityScore: 78,
    metadata: {
      heelHeightMm: 22,
      weightGrams: 690,
      upperMaterial: 'Aniline-dyed calf leather',
      liningMaterial: 'Natural leather',
      soleMaterial: 'Leather',
      construction: 'Goodyear-welted',
      countryOfOrigin: 'Spain',
      careInstructions: 'Use neutral cream; avoid coloured polishes to maintain shade.',
      fitNote: 'Slim profile last; high insteps may prefer half size up.',
    },
  },
  {
    id: 'jootiya-laced-oxford-black',
    slug: slugify('Laced Oxford in Black'),
    name: 'Laced Oxford',
    subtitle: 'Black Wholecut Oxford',
    description:
      'A wholecut Oxford carved from a single piece of black calf leather with hidden seams. Understated, quietly formal, meticulously finished.',
    category: 'oxford',
    collection: 'Ceremony',
    price: euro(450),
    compareAtPrice: euro(490),
    currency: 'EUR',
    images: [
      {
        id: 'laced-black-1',
        url: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1400&q=85',
        alt: 'Black Oxford shoes in a refined boutique interior',
        priority: true,
      },
      {
        id: 'laced-black-2',
        url: 'https://images.unsplash.com/photo-1630905119003-329447458f85?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMDY2MTIyfDB8MXxzZWFyY2h8Mnx8YXJjaGl0ZWN0dXJhbCUyMGJvdXRpcXVlJTIwaW50ZXJpb3IlMjBuZXV0cmFsJTIwcGFsZXR0ZXxlbnwwfDB8fHwxNzkyMDc3NjAxfDA&ixlib=rb-4.1.0&q=80&w=1080&q=80&w=1200&auto=format&fit=crop',
        alt: 'Close-up of polished black Oxford shoe on plinth',
      },
    ],
    colors: ['black', 'charcoal'],
    primaryColor: 'black',
    sizes: allSizesEU([42, 43]),
    tags: ['evening', 'leather'],
    isFeatured: false,
    isLimited: false,
    createdAt: '2023-11-10T18:45:00.000Z',
    popularityScore: 80,
    metadata: {
      heelHeightMm: 25,
      weightGrams: 710,
      upperMaterial: 'Polished calf leather',
      liningMaterial: 'Leather',
      soleMaterial: 'Oak-bark tanned leather',
      construction: 'Hand-welted',
      countryOfOrigin: 'Italy',
      careInstructions: 'Buff with a soft cloth; use a high-shine wax for evening wear.',
      fitNote: 'Formal last with slight taper; allow a brief break-in period.',
    },
  },
  {
    id: 'jootiya-vault-limited-sneaker-crimson',
    slug: slugify('Vault Limited Sneaker in Crimson'),
    name: 'Vault Sneaker',
    subtitle: 'Limited-Run Crimson Edition',
    description:
      'A limited-run sneaker with paneled crimson leather and tonal stitching, produced in individually numbered pairs. A collector’s shape with everyday comfort.',
    category: 'limited',
    collection: 'Vault Editions',
    price: euro(520),
    currency: 'EUR',
    images: [
      {
        id: 'vault-crimson-1',
        url: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=800&q=80',
        alt: 'Crimson limited-edition sneaker in editorial studio lighting',
        priority: true,
      },
      {
        id: 'vault-crimson-2',
        url: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=800&q=80',
        alt: 'Detail of limited sneaker heel counter and stitching',
      },
    ],
    colors: ['crimson', 'charcoal', 'black'],
    primaryColor: 'crimson',
    sizes: allSizesEU([36, 37, 38, 42, 43]),
    tags: ['exclusive', 'limited-run', 'editorial-pick', 'leather', 'street'],
    isFeatured: true,
    isLimited: true,
    createdAt: '2024-06-30T19:00:00.000Z',
    popularityScore: 98,
    metadata: {
      weightGrams: 640,
      upperMaterial: 'Italian calf leather with embossed grain',
      liningMaterial: 'Soft leather lining',
      soleMaterial: 'Custom rubber midsole and outsole',
      construction: 'Sidewall stitched',
      countryOfOrigin: 'Portugal',
      careInstructions: 'Use colour-matched cream; avoid prolonged direct sunlight.',
      fitNote: 'Numbered pairs; once sold out, the colour will not be restocked.',
    },
  },
  {
    id: 'jootiya-atelier-cap-accessory-ivory',
    slug: slugify('Atelier Cap Ivory Accessory'),
    name: 'Atelier Cap',
    subtitle: 'Ivory Cotton Cap',
    description:
      'A six-panel cotton cap in washed ivory with tonal embroidery and a leather back strap. Complements the Atelier sneaker line without feeling branded.',
    category: 'accessories',
    collection: 'Atelier Canvas Vol. I',
    price: euro(110),
    currency: 'EUR',
    images: [
      {
        id: 'atelier-cap-1',
        url: 'https://images.unsplash.com/photo-1741086154510-522e68f76933?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMDY2MTIyfDB8MXxzZWFyY2h8Mnx8bWluaW1hbGlzdCUyMGxlYXRoZXIlMjBncmFpbiUyMHRleHR1cmUlMjBvdmVybGF5JTIwc2VhbWxlc3N8ZW58MHwwfHx8MTc5MjA3NzU4OHww&ixlib=rb-4.1.0&q=80&w=1080&q=80&w=1200&auto=format&fit=crop',
        alt: 'Ivory cotton cap styled against a neutral backdrop',
        priority: true,
      },
      {
        id: 'atelier-cap-2',
        url: 'https://images.unsplash.com/photo-1630905119003-329447458f85?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMDY2MTIyfDB8MXxzZWFyY2h8Mnx8YXJjaGl0ZWN0dXJhbCUyMGJvdXRpcXVlJTIwaW50ZXJpb3IlMjBuZXV0cmFsJTIwcGFsZXR0ZXxlbnwwfDB8fHwxNzkyMDc3NjAxfDA&ixlib=rb-4.1.0&q=80&w=1080&q=80&w=1200&auto=format&fit=crop',
        alt: 'Detail view of cap strap and hardware',
      },
    ],
    colors: ['ivory', 'sand', 'charcoal'],
    primaryColor: 'ivory',
    sizes: [
      {
        id: 'onesize',
        sizeLabel: 'One Size',
        scale: 'EU',
        value: 0,
        stock: 24,
        isDefault: true,
      },
    ],
    tags: ['new', 'editorial-pick', 'minimal'],
    isFeatured: false,
    isLimited: false,
    createdAt: '2024-04-24T13:30:00.000Z',
    popularityScore: 76,
    metadata: {
      upperMaterial: 'Organic cotton twill',
      liningMaterial: 'Unlined',
      soleMaterial: 'N/A',
      construction: 'Six-panel with leather strap',
      countryOfOrigin: 'Portugal',
      careInstructions: 'Spot clean only; do not machine wash.',
      fitNote: 'Adjustable back strap for a tailored fit.',
    },
  },
];

const brandMap: Record<string, string> = {
  atelier: 'Jootiya Atelier',
  lido: 'Jootiya Lido',
  loom: 'Jootiya Loom',
  gallery: 'Jootiya Gallery',
  orbit: 'Jootiya Orbit',
  orchard: 'Jootiya Nocturne',
  studio: 'Jootiya Studio',
  archive: 'Jootiya Archive',
  laced: 'Jootiya Ceremony',
  vault: 'Jootiya Vault',
};

const deriveBrandFromSlug = (slug: string): string => {
  const token = slug.split('-')[0] ?? '';
  return brandMap[token] ?? 'Jootiya';
};

const brands: string[] = Array.from(
  new Set(
    products.map((p) => deriveBrandFromSlug(p.slug)),
  ),
).sort();

const categories: ProductCategory[] = Array.from(
  new Set(products.map((p) => p.category)),
).sort() as ProductCategory[];

const availableColors: ProductColorToken[] = Array.from(
  new Set(products.flatMap((p) => p.colors)),
).sort() as ProductColorToken[];

const availableTags: ProductTag[] = Array.from(
  new Set(products.flatMap((p) => p.tags)),
).sort() as ProductTag[];

const allSlugs: string[] = products.map((p) => p.slug);

const getProductById = (id: string | null | undefined): Product | undefined =>
  products.find((p) => p.id === id);

const getProductBySlug = (slug: string | null | undefined): Product | undefined =>
  products.find((p) => p.slug === slug);

const getFeaturedProducts = (limit?: number): Product[] => {
  const list = products
    .filter((p) => p.isFeatured ?? false)
    .sort((a, b) => (b.popularityScore ?? 0) - (a.popularityScore ?? 0));
  if (!limit || limit >= list.length) return list;
  return list.slice(0, limit);
};

const getNewArrivals = (limit?: number): Product[] => {
  const list = [...products].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
  if (!limit || limit >= list.length) return list;
  return list.slice(0, limit);
};

const getRelatedProducts = (productId: string, limit = 4): Product[] => {
  const current = getProductById(productId);
  if (!current) return getFeaturedProducts(limit);
  const scored = products
    .filter((p) => p.id !== current.id)
    .map((p) => {
      let score = 0;
      if (p.category === current.category) score += 3;
      if (p.collection && p.collection === current.collection) score += 2;
      const sharedTags = p.tags.filter((t) => current.tags.includes(t)).length;
      score += sharedTags;
      return { product: p, score };
    })
    .sort((a, b) => b.score - a.score || (b.product.popularityScore ?? 0) - (a.product.popularityScore ?? 0))
    .map((entry) => entry.product);
  return scored.slice(0, limit);
};

const mockData = {
  products,
  brands,
  categories,
  availableColors,
  availableTags,
  sortOptions,
  masonryConfig,
  typographyTokens,
  theme,
  allSlugs,
  getProductById,
  getProductBySlug,
  getFeaturedProducts,
  getNewArrivals,
  getRelatedProducts,
  deriveBrandFromSlug,
};

export {
  products,
  brands,
  categories,
  availableColors,
  availableTags,
  sortOptions,
  masonryConfig,
  typographyTokens,
  theme,
  allSlugs,
  getProductById,
  getProductBySlug,
  getFeaturedProducts,
  getNewArrivals,
  getRelatedProducts,
  deriveBrandFromSlug,
};

export default mockData;
export { mockData };
