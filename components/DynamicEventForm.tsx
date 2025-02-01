"use client";

import dynamic from 'next/dynamic';
import { Suspense } from 'react';

const EventFormSection = dynamic(() => import("@/components/EventFormSection"), {
  loading: () => (
    <div className="w-full max-w-2xl mx-auto">
      <div className="bg-gray-800/50 rounded-lg p-6 animate-pulse">
        <div className="h-8 bg-gray-700 rounded mb-8 w-1/2"></div>
        <div className="aspect-video w-full bg-gray-700 rounded-lg mb-6"></div>
        <div className="space-y-6">
          <div className="h-12 bg-gray-700 rounded"></div>
          <div className="h-12 bg-gray-700 rounded"></div>
          <div className="grid grid-cols-2 gap-4">
            <div className="h-12 bg-gray-700 rounded"></div>
            <div className="h-12 bg-gray-700 rounded"></div>
          </div>
          <div className="h-24 bg-gray-700 rounded"></div>
          <div className="h-12 bg-gray-700 rounded"></div>
        </div>
      </div>
    </div>
  ),
  ssr: false
});

interface DynamicEventFormProps {
  userId: string;
  venueId: string;
}

export default function DynamicEventForm({ userId, venueId }: DynamicEventFormProps) {
  return (
    <Suspense fallback={
      <div className="w-full max-w-2xl mx-auto">
        <div className="bg-gray-800/50 rounded-lg p-6 animate-pulse">
          <div className="h-8 bg-gray-700 rounded mb-8 w-1/2"></div>
          <div className="aspect-video w-full bg-gray-700 rounded-lg mb-6"></div>
          <div className="space-y-6">
            <div className="h-12 bg-gray-700 rounded"></div>
            <div className="h-12 bg-gray-700 rounded"></div>
            <div className="grid grid-cols-2 gap-4">
              <div className="h-12 bg-gray-700 rounded"></div>
              <div className="h-12 bg-gray-700 rounded"></div>
            </div>
            <div className="h-24 bg-gray-700 rounded"></div>
            <div className="h-12 bg-gray-700 rounded"></div>
          </div>
        </div>
      </div>
    }>
      <EventFormSection userId={userId} venueId={venueId} />
    </Suspense>
  );
}
