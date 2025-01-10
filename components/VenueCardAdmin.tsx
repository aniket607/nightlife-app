import React from "react";

interface VenueCardAdminProps {
  venueImage: string;
  name: string;
  rating: number;
  area: string;
  address: string;
}

const VenueCardAdmin: React.FC<VenueCardAdminProps> = ({
  venueImage,
  name,
  rating,
  area,
  address,
}) => {
  return (
    <div className="flex border border-gray-300 rounded-lg p-4 shadow-md m-4">
      <div className="flex-shrink-0 w-24 h-24 rounded-md overflow-hidden">
        <img
          src={venueImage}
          alt={name}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="ml-4 flex flex-col flex-grow">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-800">{name}</h2>
          <span className="text-base text-yellow-500">★ {rating}</span>
        </div>

        <p className="text-sm text-gray-600 mt-1">Area: {area}</p>

        <p className="text-sm text-gray-500 mt-2">Address: {address}</p>

        <div className="mt-auto flex justify-end">
          <button className="bg-blue-500 text-white text-sm font-medium py-1 px-4 rounded hover:bg-blue-600">
            View Venue
          </button>
        </div>
      </div>
    </div>
  );
};

export default VenueCardAdmin;
