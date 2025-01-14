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
    <div className="w-full h-full bg-white dark:bg-primary p-4 sm:p-6 md:p-8 border-b md:border-b-0 md:border-r border-gray-300 flex flex-col">
      
      {/* Venue Image */}

      <div className="w-full h-48 sm:h-60 rounded-md overflow-hidden relative">
        <Image
          src={venue?.venueImgUrl || '/placeholder-image.jpg'}
          alt={venue?.venueName || "Venue Image"}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="rounded-md object-cover"
        />
      </div>

      {/* Venue Info */}
      <div className="mt-4 flex-1">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-gray-800 dark:text-gray-200">
          {venue?.venueName || "Venue Name"}
        </h1>
        <div className="flex items-center mt-1">
          <span className="text-lg text-yellow-500">★</span>
          <span className="text-base font-semibold text-gray-700 dark:text-gray-300 ml-1">{venue?.rating || 0}</span>
        </div>
        <div className="mt-4 space-y-2">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
            <span className="font-semibold">Area:</span> {venue?.venueArea}
          </p>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400 break-words">
            <span className="font-semibold">Address:</span> {venue?.address}
          </p>
        </div>
      </div>
    </div>
  );
}
