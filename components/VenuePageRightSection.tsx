"use client";

import { useState } from "react";

interface Event {
  id: number;
  image: string;
  name: string;
  date: string;
  description: string;
}

export default function VenuePageRightSection({ events }: { events: Event[] }) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleImageClick = (image: string) => {
    setSelectedImage(image);
  };

  const closePopup = () => {
    setSelectedImage(null);
  };

  return (
    <div className="w-2/3 p-10 overflow-y-scroll">
      <div className="flex w-full mb-4 justify-between items-center">
        <h2 className="text-2xl font-semibold text-gray-800 ml-20">Events</h2>
        <button className="!bg-purple-600 !text-white hover:bg-purple-700 p-2 rounded font-normal mr-20">
          Add Event
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {events.map((event) => (
          <div
            key={event.id}
            className="flex bg-gray-100 rounded-md shadow-md h-60 w-[50vw] m-auto"
          >
            {/* Event Image */}
            <div className="w-1/3 h-full rounded-l-md overflow-hidden">
              <img
                src={event.image}
                alt={event.name}
                className="w-full h-full object-cover cursor-pointer"
                onClick={() => handleImageClick(event.image)}
              />
            </div>

            {/* Event Info */}
            <div className="flex flex-col justify-center items-start p-4 w-2/3">
              <h3 className="text-2xl font-semibold text-gray-800 truncate">
                {event.name}
              </h3>
              <p className="text-base text-gray-500 mt-1">{event.date}</p>
              <p className="text-sm text-gray-600 mt-2 line-clamp-3">
                {event.description}
              </p>
              <button className="!bg-purple-600 !text-white hover:bg-purple-700 p-2 rounded font-normal mt-10">
                Add Event
              </button>
            </div>
          </div>
        ))}
      </div>

      {selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="relative bg-white rounded-lg overflow-hidden max-w-md">
            <button
              className="absolute top-2 right-2 text-gray-800 bg-gray-200 hover:bg-gray-300 rounded-full p-2"
              onClick={closePopup}
            >
              ✕
            </button>
            <img
              src={selectedImage}
              alt="Popup"
              className="w-full h-auto max-h-screen"
            />
          </div>
        </div>
      )}
    </div>
  );
}
