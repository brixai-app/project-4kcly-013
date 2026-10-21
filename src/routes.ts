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
    "navLabel": "Catalog",
    "showInNav": true
  },
  {
    "path": "/product/:id",
    "name": "ProductDetailPage",
    "filePath": "src/pages/ProductDetailPage.tsx",
    "showInNav": false
  },
  {
    "path": "/cart",
    "name": "CartPage",
    "filePath": "src/pages/CartPage.tsx",
    "navLabel": "Cart",
    "showInNav": true
  },
  {
    "path": "/checkout",
    "name": "CheckoutPage",
    "filePath": "src/pages/CheckoutPage.tsx",
    "showInNav": false
  }
];

export const NAV_LINKS: Array<{ path: string; label: string }> = [
  {
    "path": "/",
    "label": "Home"
  },
  {
    "path": "/catalog",
    "label": "Catalog"
  },
  {
    "path": "/cart",
    "label": "Cart"
  }
];
