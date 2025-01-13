"use client";
import React from "react";
import { useRouter } from "next/navigation"; // Import useRouter for navigation

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

  // Function to handle button click and redirect
  const handleViewVenue = () => {
    // Redirect to 'organizer/venue' with the venue name as a query parameter
    router.push(`/organizer/venue?id=${encodeURIComponent(venueId)}`);
  };

  return (
    <div className="flex flex-col border border-gray-300 rounded-lg m-4 w-80 overflow-clip shadow-xl">
      <div className="flex-shrink-0 w-80 h-48 overflow-hidden ">
        <img
          src={venueImage}
          alt={name}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="mx-2 mt-2 flex flex-col flex-grow">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-800">{name}</h2>
          <div>
            <span className="text-base text-yellow-400 ">★ </span>
            <span className="font-bold text-black">{rating}</span>
          </div>
        </div>

        <p className="text-sm text-gray-600 mt-1">{area}</p>

        <p className="text-xs text-gray-500 mt-1">{address}</p>

        <div className="">
          <button
            className="bg-purple-600 !text-white font-bold hover:bg-purple-700 text-sm py-1 px-1 w-full rounded my-3"
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
