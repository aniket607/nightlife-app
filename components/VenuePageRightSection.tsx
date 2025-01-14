"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface Event {
  eventId: number; // Assuming `Int` maps to `number`
  eventName: string;
  eventDescription?: string | null; // Optional field
  eventDate: Date; // Maps to `DateTime`
  eventTime: Date; // `DateTime @db.Time` also maps to `Date`
  glCount: number;
  eventImgUrl?: string | null; // Optional field
  venueId: string;
  userId: string;
  createdAt: Date; // Maps to `DateTime`
}

export default function VenuePageRightSection({ events,venueId }: { events: Event[], venueId:string}) {
  const [selectedImage, setSelectedImage] = useState<string | null>();
  const router=useRouter();

  const handleImageClick = (image: string | null) => {
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
    <div className="p-4 sm:p-6 md:p-10">
      <div className="flex w-full mb-4 justify-between items-center px-2 sm:px-4 md:px-8">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-gray-800">Events</h2>
        <button 
          className="bg-gray-600 text-white hover:bg-black px-3 sm:px-4 py-1.5 sm:py-2 rounded-md text-sm sm:text-base font-normal transition-colors"
          onClick={handleAddEvent}
        >
          Add Event
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 px-2 sm:px-4 md:px-8">
        {events.map((event) => (
          <div
            key={event?.eventId}
            className="flex flex-col sm:flex-row bg-purple-50 rounded-md shadow-md w-full sm:h-60"
          >
            {/* Event Image */}
            <div className="w-full sm:w-1/3 h-48 sm:h-full rounded-t-md sm:rounded-l-md sm:rounded-t-none overflow-hidden relative">
              <Image
                src={event?.eventImgUrl || '/placeholder-image.jpg'}
                alt={event.eventName || "Event Image"}
                fill
                className="object-cover cursor-pointer rounded"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                onClick={() => handleImageClick(event?.eventImgUrl || null)}
              />
            </div>

            {/* Event Info */}
            <div className="flex flex-col items-start p-4 w-full sm:w-2/3">
              <h3 className="text-xl sm:text-2xl md:text-3xl font-semibold text-gray-800 truncate w-full">
                {event.eventName}
              </h3>
              <p className="text-sm sm:text-base text-gray-600 mt-1">
                {event.eventDate.toISOString().split("T")[0]}
              </p>
              <p className="text-sm w-full sm:w-[80%] text-gray-600 mt-2 line-clamp-3">
                {event.eventDescription}
              </p>
            </div>
          </div>
        ))}
      </div>

      {selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="relative bg-white rounded-lg overflow-hidden w-full max-w-lg aspect-square">
            <button
              className="absolute top-2 right-2 text-gray-800 bg-gray-200 hover:bg-gray-300 rounded-full p-2 z-10"
              onClick={closePopup}
            >
              ✕
            </button>
            <div className="relative w-full h-full">
              <Image
                src={selectedImage}
                alt="Popup"
                fill
                className="object-contain"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
