"use client";

import Image from 'next/image';

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
  return (
    <div className="w-full bg-white dark:bg-primary p-4 sm:p-6 md:p-8 border-b md:border-b-0 md:border-r border-gray-300">
      
      {/* Venue Image */}

      <div className="w-full h-48 sm:h-60 rounded-md overflow-hidden relative">
        <Image
          src={venue?.venueImgUrl || '/placeholder-image.jpg'}
          alt={venue?.venueName || "Venue Image"}
          layout="fill"
          objectFit="cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="rounded-md"
        />
      </div>

      {/* Venue Info */}
      <div className="mt-4">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-gray-400">
          {venue?.venueName || "Venue Name"}
        </h1>
        <p className="text-base font-semibold text-yellow-500 mt-1">★ {venue?.rating || 0}</p>
        <p className="text-sm font-medium text-gray-500 mt-2">Area: {venue?.venueArea}</p>
        <p className="text-sm font-medium text-gray-500 mt-1 break-words">Address: {venue?.address}</p>
      </div>
    </div>
  );
}
