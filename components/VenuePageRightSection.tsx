"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

interface Event {
  id: number;
  image: string;
  name: string;
  date: string;
  description: string;
}

export default function VenuePageRightSection({ events,venueId }: { events: Event[], venueId:string}) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const router=useRouter();

  const handleImageClick = (image: string) => {
    setSelectedImage(image);
  };

  const closePopup = () => {
    setSelectedImage(null);
  };
  const handleAddEvent = () => {
    if (venueId) {
      // Redirect to /organizer/venue/addevent with the same 'id' param
      router.push(`/organizer/venue/addevent?id=${encodeURIComponent(venueId)}`);
    }
  };

  return (
    <div className="p-10">
      <div className="flex w-full mb-4 justify-between items-center">
        <h2 className="text-4xl font-semibold text-gray-800 ml-20">Events</h2>
        <button 
        className="!bg-gray-600 !text-white hover:!bg-black px-4 py-2 rounded-md font-normal mr-20"
        onClick={handleAddEvent}
        >
          Add Event
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {events.map((event) => (
          <div
            key={event.id}
            className="flex bg-gray-400 rounded-md shadow-md h-60 w-[50vw] m-auto"
          >
            {/* Event Image */}
            <div className="w-1/3 h-full rounded-l-md overflow-hidden">
              <img
                src={event.image}
                alt={event.name}
                className="w-full h-full object-cover cursor-pointer rounded"
                onClick={() => handleImageClick(event.image)}
              />
            </div>

            {/* Event Info */}
            <div className="flex flex-col items-start p-4 w-2/3">
              <h3 className="text-3xl font-semibold text-gray-800 truncate">
                {event.name}
              </h3>
              <p className="text-base text-gray-600 mt-1">{event.date}</p>
              <p className="text-sm w-[80%] text-gray-600 mt-2 line-clamp-3">
                {event.description}
              </p>
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
