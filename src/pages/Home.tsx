import React from 'react';
import { HomeEditorial } from '@/components/CommerceSections';

export function Home({ className = '' }: { className?: string } = {}) {
  return (
    <main className={className}>
      <HomeEditorial />
    </main>
  );
}

export default Home;