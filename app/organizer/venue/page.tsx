"use client";

import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { fetchVenueById } from "@/app/actions/fetchvenuedata";
import { useSearchParams } from "next/navigation";
import { log } from "console";

interface Venue {
  id: string;
  venueName: string;
  venueArea: string;
  rating: number;
  address: string;
  locationUrl: string | null; // Allow locationUrl to be null
  venueImgUrl: string;
  userId: string;
  // Add other fields as necessary
}

const venueData = {
  venueImage:
    "https://aws-nightlife.s3.eu-north-1.amazonaws.com/1736532942633-2024-07-09.jpg",
  venueName: "Grand Venue",
  venueRating: 4.8,
  venueAddress: "123 Main St, Downtown City, 12345",
  venueArea: "Downtown",
};

const events = [
  {
    id: 1,
    image:
      "https://aws-nightlife.s3.eu-north-1.amazonaws.com/1736532942633-2024-07-09.jpg",
    name: "Event One",
    date: "January 20, 2025",
    description:
      "A fun and exciting event to enjoy. Lorem ipsum dolor sit amet consectetur adipisicing elit. Minus, pariatur!",
  },
  {
    id: 2,
    image:
      "https://aws-nightlife.s3.eu-north-1.amazonaws.com/1736532942633-2024-07-09.jpg",
    name: "Event Two",
    date: "February 10, 2025",
    description:
      "An event full of learning and networking. Lorem ipsum dolor sit amet consectetur adipisicing elit. Minus, pariatur!",
  },
  {
    id: 3,
    image:
      "https://aws-nightlife.s3.eu-north-1.amazonaws.com/1736532942633-2024-07-09.jpg",
    name: "Event Three",
    date: "March 5, 2025",
    description:
      "Celebrate with us at this grand event. Lorem ipsum dolor sit amet consectetur adipisicing elit. Minus, pariatur!",
  },
];

export default function page() {
  // const paramValue = searchParams.id
  // console.log(paramValue)
  const searchParams = useSearchParams();
  const paramValue = searchParams.get("id");
  console.log(paramValue);

  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [venue, setVenue] = useState<Venue | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(true);
  console.log(venue)

  useEffect(() => {
    const checkSession = async () => {
      const session = await auth();
      if (!session?.user) {
        redirect("/organizer/login");
      }
    };

    const fetchVenueData = async () => {
      try {
        const venueData = await fetchVenueById(String(paramValue));
        setVenue(venueData);
      } catch (error: any) {
        console.error("Error:", error.message);
      } finally {
        setLoading(false); // Stop loading after fetching is complete
      }
    };

    checkSession();
    fetchVenueData();
  }, []);

  const handleImageClick = (image: string) => {
    setSelectedImage(image);
  };

  const closePopup = () => {
    setSelectedImage(null);
  };

  //const session = await auth();
  // if (!session?.user) {
  //   redirect("/organizer/login");
  // }

  if (loading) {
    return <div></div>;
  }

  return (
    <div className="flex h-screen">
      {/* Left Section */}
      <div className="w-1/3 bg-white p-10 border-r border-gray-300 sticky top-0">
        {/* Venue Image */}
        <div className="w-full h-64 rounded-md overflow-hidden">
          <img
            src={venue?.venueImgUrl}
            alt={venue?.venueName}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Venue Info */}
        <div className="mt-4">
          <h1 className="text-2xl font-semibold text-gray-800">
            {venue?.venueName}
          </h1>
          <p className="text-sm text-yellow-500">★ {venue?.rating}</p>
          <p className="text-sm text-gray-600 mt-2">Area: {venue?.venueArea}</p>
          <p className="text-sm text-gray-500 mt-1">
            Address: {venue?.address}
          </p>
        </div>
      </div>

      {/* Right Section */}
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
                  className="w-full h-full object-cover cursor-pointer "
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
