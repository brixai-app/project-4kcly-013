import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { CatalogExperience } from '@/components/StorefrontSections';

export function ShopPage({ className = '' }: { className?: string } = {}) {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') ?? '';

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const nextQuery = searchParams.get('q') ?? '';
    if (nextQuery !== query) return;
  }, [query, searchParams]);

  useEffect(() => {
    const syncQuery = () => {
      const current = new URLSearchParams(window.location.search);
      const next = current.get('q') ?? '';
      if (next !== query) setSearchParams(current, { replace: true });
    };
    window.addEventListener('popstate', syncQuery);
    return () => window.removeEventListener('popstate', syncQuery);
  }, [query, setSearchParams]);

  return <CatalogExperience className={className} />;
}

export default ShopPage;