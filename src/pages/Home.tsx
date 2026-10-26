import React from 'react';
import { HomeExperience } from '@/components/StorefrontSections';

export function Home({ className = '' }: { className?: string } = {}) {
  return (
    <main className={className}>
      <HomeExperience />
    </main>
  );
}

export default Home;