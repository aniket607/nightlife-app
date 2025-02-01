"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation"; // Import useRouter for navigation
import Image from "next/image";

interface VenueCardAdminProps {
  venueId:string;
  venueImage: string;
  name: string;
  rating: number;
  area: string;
  address: string;
}

const VenueCardAdmin: React.FC<VenueCardAdminProps> = ({
  venueId,
  venueImage,
  name,
  rating,
  area,
  address,
}) => {
  const router = useRouter(); // Initialize Next.js router

  // Prefetch the venue page data when component mounts
  useEffect(() => {
    router.prefetch(`/organizer/venue?id=${encodeURIComponent(venueId)}`);
  }, [router, venueId]);

  // Function to handle button click and redirect
  const handleViewVenue = () => {
    // Redirect to 'organizer/venue' with the venue name as a query parameter
    router.push(`/organizer/venue?id=${encodeURIComponent(venueId)}`);
  };

  return (
    <div className="flex flex-col border border-gray-300 rounded-lg overflow-hidden shadow-xl">
      <div className="relative w-full aspect-video">
         <Image
            src={venueImage || '/placeholder-image.jpg'}
            alt={name || "Venue Image"}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="rounded-t-lg object-cover"
          />
      </div>

      <div className="p-3 sm:p-4 flex flex-col flex-grow">
        <div className="flex items-center justify-between">
          <h2 className="text-base sm:text-lg font-semibold text-gray-800 dark:text-white truncate">{name}</h2>
          <div className="flex-shrink-0 ml-2">
            <span className="text-base text-yellow-400 ">★ </span>
            <span className="font-bold text-black dark:text-white">{rating}</span>
          </div>
        </div>

        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 truncate">{area}</p>

        <p className="text-xs text-gray-500 dark:text-gray-300 mt-1 line-clamp-2">{address}</p>

        <div className="mt-auto pt-3">
          <button
            className="w-full bg-gray-600 !text-white font-bold hover:bg-black text-sm py-2 px-4 rounded transition-colors"
            onClick={handleViewVenue} // Add onClick handler
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default VenueCardAdmin;
