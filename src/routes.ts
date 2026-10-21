// Programmatically generated route table and navigation manifest
export interface RouteItem {
  path: string;
  name: string;
  filePath: string;
  navLabel?: string;
  showInNav: boolean;
}

export const APP_ROUTES: RouteItem[] = [
  {
    "path": "/",
    "name": "HomePage",
    "filePath": "src/pages/HomePage.tsx",
    "navLabel": "Home",
    "showInNav": true
  },
  {
    "path": "/catalog",
    "name": "CatalogPage",
    "filePath": "src/pages/CatalogPage.tsx",
    "navLabel": "Shop Mojris",
    "showInNav": true
  },
  {
    "path": "/product/:slug",
    "name": "ProductDetailPage",
    "filePath": "src/pages/ProductDetailPage.tsx",
    "showInNav": false
  },
  {
    "path": "/checkout",
    "name": "CheckoutPage",
    "filePath": "src/pages/CheckoutPage.tsx",
    "showInNav": false
  },
  {
    "path": "/artisans",
    "name": "ArtisanStoryPage",
    "filePath": "src/pages/ArtisanStoryPage.tsx",
    "navLabel": "Our Artisans",
    "showInNav": true
  }
];

export const NAV_LINKS: Array<{ path: string; label: string }> = [
  {
    "path": "/",
    "label": "Home"
  },
  {
    "path": "/catalog",
    "label": "Shop Mojris"
  },
  {
    "path": "/artisans",
    "label": "Our Artisans"
  }
];
