"use client";

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
    <div className="w-1/3 bg-white p-10 border-r border-gray-300 sticky top-0">
      {/* Venue Image */}
      <div className="w-full h-64 rounded-md overflow-hidden">
        <img
          src={venue?.venueImgUrl}
          alt={venue?.venueName || "Venue Image"}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Venue Info */}
      <div className="mt-4">
        <h1 className="text-2xl font-semibold text-gray-800">
          {venue?.venueName || "Venue Name"}
        </h1>
        <p className="text-sm text-yellow-500">★ {venue?.rating || 0}</p>
        <p className="text-sm text-gray-600 mt-2">Area: {venue?.venueArea}</p>
        <p className="text-sm text-gray-500 mt-1">Address: {venue?.address}</p>
      </div>
    </div>
  );
}
