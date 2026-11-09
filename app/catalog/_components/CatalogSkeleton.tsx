'use client';

import React from 'react';

export default function CatalogSkeleton() {
  return (
    <main className="grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="h-64 md:h-80 rounded-3xl bg-stone-200/70 animate-pulse" />
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="h-64 rounded-2xl bg-stone-200/70 animate-pulse" />
        ))}
      </div>
    </main>
  );
}
