import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { ShoppingBag, Search } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { cn } from '@/lib/utils';

export interface HeaderProps {
  className?: string;
}

const categories: { label: string; value: string }[] = [
  { label: 'Heels', value: 'Heels' },
  { label: 'Loafers', value: 'Loafers' },
  { label: 'Sneakers', value: 'Sneakers' },
  { label: 'Sandals', value: 'Sandals' },
  { label: 'Boots', value: 'Boots' },
  { label: 'Mules', value: 'Mules' },
  { label: 'Slides', value: 'Slides' },
];

export function Header({ className = '' }: HeaderProps) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { itemCount, openDrawer } = useCart();
  const initialQuery = searchParams.get('q') ?? '';
  const [searchValue, setSearchValue] = useState(initialQuery);

  useEffect(() => {
    setSearchValue(searchParams.get('q') ?? '');
  }, [searchParams]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(window.location.hash.split('?')[1] ?? '');
    if (searchValue.trim()) {
      params.set('q', searchValue.trim());
    } else {
      params.delete('q');
    }
    navigate(`/shop?${params.toString()}`);
  };

  const handleCategoryClick = (value: string) => {
    const params = new URLSearchParams(window.location.hash.split('?')[1] ?? '');
    params.set('category', value);
    navigate(`/shop?${params.toString()}`);
  };

  return (
    <header
      className={cn(
        'sticky top-0 z-40 border-b border-[#E6DED3] bg-[#F9F6F2]/90 backdrop-blur-sm',
        className
      )}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-4 py-4">
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-full border border-[#E6DED3] bg-white flex items-center justify-center">
              <span className="text-xs font-semibold tracking-[0.2em] text-[#2E2B28]">
                JY
              </span>
            </div>
            <span className="text-xl font-light tracking-[0.3em] text-[#2E2B28] uppercase">
              Jootiya
            </span>
          </Link>
          <nav className="hidden items-center gap-5 text-xs font-semibold uppercase tracking-[0.25em] text-[#6F675E] md:flex">
            <Link to="/" className="hover:text-[#2E2B28] transition-colors">
              Editorial
            </Link>
            <button
              type="button"
              onClick={() => navigate('/shop')}
              className="hover:text-[#2E2B28] transition-colors"
            >
              Shop
            </button>
            {categories.slice(0, 4).map(cat => (
              <button
                key={cat.value}
                type="button"
                onClick={() => handleCategoryClick(cat.value)}
                className="hover:text-[#2E2B28] transition-colors"
              >
                {cat.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="flex flex-1 items-center justify-end gap-4">
          <form
            onSubmit={handleSearchSubmit}
            className="hidden max-w-xs flex-1 items-center rounded-full border border-[#E6DED3] bg-white/80 px-3 py-1.5 text-xs md:flex"
          >
            <Search className="mr-2 h-3.5 w-3.5 text-[#BFA06A]" />
            <input
              type="text"
              value={searchValue}
              onChange={e => setSearchValue(e.target.value)}
              placeholder="Search silhouettes, leather, color..."
              className="h-6 flex-1 bg-transparent font-serif text-xs text-[#2E2B28] placeholder:text-[#B1A89D] focus:outline-none"
            />
          </form>

          <button
            type="button"
            onClick={openDrawer}
            className="relative flex h-9 w-9 items-center justify-center rounded-full border border-[#E6DED3] bg-white transition-colors hover:border-[#BFA06A]"
          >
            <ShoppingBag className="h-4 w-4 text-[#2E2B28]" />
            {itemCount > 0 && (
              <span className="absolute -right-1 -top-1 min-w-[1.2rem] rounded-full bg-[#BFA06A] px-1 text-center text-[0.6rem] font-semibold leading-4 text-black">
                {itemCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;