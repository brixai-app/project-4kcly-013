import { Product, ProductImage, Size, ColorVariant, StockKey } from '@/types';

const baseSizes: Size[] = ['EU 36', 'EU 37', 'EU 38', 'EU 39', 'EU 40', 'EU 41', 'EU 42', 'EU 43', 'EU 44'];
const now = new Date().toISOString();

function makeImages(urls: string[], altBase: string): ProductImage[] {
  return urls.map((url, index) => ({
    url,
    alt: `${altBase} view ${index + 1}`,
  }));
}

function buildStock(sizes: Size[], colors: ColorVariant[], base: number): Record<StockKey, number> {
  const stock: Partial<Record<StockKey, number>> = {};
  sizes.forEach((size, sIndex) => {
    colors.forEach((color, cIndex) => {
      const key = `${size}-${color}` as StockKey;
      const variantFactor = (sIndex + cIndex) % 3;
      const qty = base + variantFactor * 2;
      stock[key] = qty;
    });
  });
  return stock as Record<StockKey, number>;
}

export const products: Product[] = [
  {
    id: 'jootiya-atelier-heel-01',
    name: 'Atelier Curved Strap Heel',
    slug: 'atelier-curved-strap-heel',
    description:
      'A sculptural 90mm heel in Italian leather, finished with a curved instep strap and hand-painted edges for a gallery-ready silhouette.',
    price: 14990,
    currency: 'INR',
    category: 'Heels',
    collection: 'Gallery Evenings',
    featured: true,
    images: makeImages(
      [
        'https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=1400&q=85',
        'https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1400&q=85',
      ],
      'Atelier curved strap heel',
    ),
    sizes: baseSizes.slice(1, 7),
    colors: ['Black', 'Ivory', 'Burgundy'],
    stockByKey: buildStock(baseSizes.slice(1, 7), ['Black', 'Ivory', 'Burgundy'], 4),
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 'jootiya-monk-loafer-01',
    name: 'Monk Strap City Loafer',
    slug: 'monk-strap-city-loafer',
    description:
      'A low-slung city loafer with double monk hardware in brushed metal, balanced on a slim leather sole for long-haul elegance.',
    price: 12990,
    currency: 'INR',
    category: 'Loafers',
    collection: 'Concrete Ballet',
    featured: true,
    images: makeImages(
      [
        'https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80',
      ],
      'Monk strap city loafer',
    ),
    sizes: baseSizes.slice(2),
    colors: ['Cognac', 'Black', 'Navy'],
    stockByKey: buildStock(baseSizes.slice(2), ['Cognac', 'Black', 'Navy'], 5),
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 'jootiya-orbit-sneaker-01',
    name: 'Orbit Low Volume Sneaker',
    slug: 'orbit-low-volume-sneaker',
    description:
      'An ultra-clean leather sneaker with hidden stitching, low-volume padding, and a tonal rubber cupsole for silent movement.',
    price: 9990,
    currency: 'INR',
    category: 'Sneakers',
    collection: 'Studio Off-Duty',
    featured: true,
    images: makeImages(
      [
        'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=800&q=80',
      ],
      'Orbit low volume sneaker',
    ),
    sizes: baseSizes.slice(1),
    colors: ['White', 'Tan', 'Navy'],
    stockByKey: buildStock(baseSizes.slice(1), ['White', 'Tan', 'Navy'], 6),
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 'jootiya-stride-sandal-01',
    name: 'Offset Strap Gallery Sandal',
    slug: 'offset-strap-gallery-sandal',
    description:
      'Minimalist leather straps intersect over a padded footbed, with squared-off toes and a low architectural heel for all-day installations.',
    price: 8990,
    currency: 'INR',
    category: 'Sandals',
    collection: 'Summer Edit',
    featured: false,
    images: makeImages(
      [
        'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=800&q=80',
      ],
      'Offset strap gallery sandal',
    ),
    sizes: baseSizes.slice(0, 7),
    colors: ['Tan', 'Ivory'],
    stockByKey: buildStock(baseSizes.slice(0, 7), ['Tan', 'Ivory'], 7),
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 'jootiya-column-boot-01',
    name: 'Column Mid Shaft Boot',
    slug: 'column-mid-shaft-boot',
    description:
      'A columnar mid shaft boot with a subtle square toe and internal zip, cut from smooth calf leather that pools softly at the ankle.',
    price: 17990,
    currency: 'INR',
    category: 'Boots',
    collection: 'Noir Season',
    featured: true,
    images: makeImages(
      [
        'https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=1400&q=85',
        'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80',
      ],
      'Column mid shaft boot',
    ),
    sizes: baseSizes.slice(2),
    colors: ['Black', 'Olive'],
    stockByKey: buildStock(baseSizes.slice(2), ['Black', 'Olive'], 3),
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 'jootiya-arc-mule-01',
    name: 'Arc Backless Mule',
    slug: 'arc-backless-mule',
    description:
      'Backless slip-on mule with a soft arc across the vamp, molded leather insole, and a beveled micro-heel for quiet entrances.',
    price: 10990,
    currency: 'INR',
    category: 'Mules',
    collection: 'Lobby Hours',
    featured: false,
    images: makeImages(
      [
        'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=800&q=80',
      ],
      'Arc backless mule',
    ),
    sizes: baseSizes.slice(1, 8),
    colors: ['Ivory', 'Cognac'],
    stockByKey: buildStock(baseSizes.slice(1, 8), ['Ivory', 'Cognac'], 4),
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 'jootiya-soft-slide-01',
    name: 'Sculpted Padded Slide',
    slug: 'sculpted-padded-slide',
    description:
      'A sculpted padded slide with oversized straps and a lightly contoured footbed, finished in matte leather for slow coastal days.',
    price: 7990,
    currency: 'INR',
    category: 'Slides',
    collection: 'Resort Lines',
    featured: false,
    images: makeImages(
      [
        'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=1400&q=85',
      ],
      'Sculpted padded slide',
    ),
    sizes: baseSizes.slice(0, 6),
    colors: ['Tan', 'White'],
    stockByKey: buildStock(baseSizes.slice(0, 6), ['Tan', 'White'], 8),
    createdAt: now,
    updatedAt: now,
  },
];

export function getProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}

export function computeStockKey(size: Size, color: ColorVariant): StockKey {
  return `${size}-${color}` as StockKey;
}

export const mockData = {
  products,
  getProductById,
  computeStockKey,
};

export default mockData;