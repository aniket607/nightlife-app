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
    <div className="w-full h-full bg-gradient-to-r from-gray-900/90 via-gray-800/90 to-gray-900/90 p-4 sm:p-6 md:p-8 border-b md:border-b-0 md:border-r border-gray-700/50 relative">
      
      {/* Decorative Pattern */}
      <div className="absolute inset-0 opacity-5 pointer-events-none" 
           style={{
             backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
           }}
      ></div>

      {/* Content with relative positioning */}
      <div className="relative z-10">
        {/* Venue Image */}
        <div className="w-full h-32 sm:h-48 md:h-60 rounded-md overflow-hidden relative">
          <Image
            src={venue?.venueImgUrl || '/placeholder-image.jpg'}
            alt={venue?.venueName || "Venue Image"}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="rounded-md object-cover"
          />
        </div>

        {/* Venue Info */}
        <div className="mt-4">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-semibold text-gray-200">
            {venue?.venueName || "Venue Name"}
          </h1>
          <div className="flex items-center mt-1">
            <span className="text-lg text-yellow-500">★</span>
            <span className="text-base font-semibold text-gray-300 ml-1">{venue?.rating || 0}</span>
          </div>
          <div className="mt-4 space-y-2">
            <p className="text-sm font-medium text-gray-400">
              <span className="font-semibold text-gray-300">Area:</span> {venue?.venueArea}
            </p>
            <p className="text-sm font-medium text-gray-400 break-words">
              <span className="font-semibold text-gray-300">Address:</span> {venue?.address}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
