"use client";

import Image from 'next/image';
import { useRef, useEffect } from 'react';

interface Venue {
  id: string;
  venueName: string;
  venueArea: string;
  rating: number;
  address: string;
  locationUrl: string | null;
  venueImgUrl: string;
  userId: string;
}

export default function VenuePageLeftSection({ venue }: { venue: Venue | null }) {
  const leftSectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const leftSection = leftSectionRef.current;
    if (leftSection) {
      const preventScroll = (e: WheelEvent) => {
        e.preventDefault();
        e.stopPropagation();
      };
      leftSection.addEventListener('wheel', preventScroll, { passive: false });
      return () => {
        leftSection.removeEventListener('wheel', preventScroll);
      };
    }
  }, []);

  return (
    <div ref={leftSectionRef} className="w-1/3 bg-white p-8 border-r border-gray-300 h-screen overflow-hidden">
      
      {/* Venue Image */}

<div className="w-[100] h-60 rounded-md overflow-hidden relative">
  <Image
    src={venue?.venueImgUrl || '/placeholder-image.jpg'}
    alt={venue?.venueName || "Venue Image"}
    layout="fill"
    objectFit="cover"
    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
  />
</div>

      {/* Venue Info */}
      <div className="mt-4">
        <h1 className="text-4xl font-semibold text-gray-800">
          {venue?.venueName || "Venue Name"}
        </h1>
        <p className="text-base font-semibold text-yellow-500">★ {venue?.rating || 0}</p>
        <p className="text-sm font-medium text-gray-900 mt-2">Area: {venue?.venueArea}</p>
        <p className="text-sm font-medium text-gray-900 mt-1">Address: {venue?.address}</p>
      </div>
    </div>
  );
}
