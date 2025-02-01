'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';

const VenueFormSection = dynamic(() => import("@/components/VenueFormSection"), {
  loading: () => (
    <div className="w-full max-w-2xl mx-auto p-6 bg-gray-800/50 rounded-lg animate-pulse">
      <div className="h-8 bg-gray-700 rounded mb-8"></div>
      <div className="space-y-6">
        <div className="h-12 bg-gray-700 rounded"></div>
        <div className="h-12 bg-gray-700 rounded"></div>
        <div className="h-12 bg-gray-700 rounded"></div>
      </div>
    </div>
  ),
  ssr: false
});

export default function DynamicVenueForm() {
  return (
    <Suspense fallback={
      <div className="w-full max-w-2xl mx-auto p-6 bg-gray-800/50 rounded-lg animate-pulse">
        <div className="h-8 bg-gray-700 rounded mb-8"></div>
        <div className="space-y-6">
          <div className="h-12 bg-gray-700 rounded"></div>
          <div className="h-12 bg-gray-700 rounded"></div>
          <div className="h-12 bg-gray-700 rounded"></div>
        </div>
      </div>
    }>
      <VenueFormSection />
    </Suspense>
  );
}