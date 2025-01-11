import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { fetchVenueById } from "@/app/actions/fetchvenuedata";
import VenuePageLeftSection from "@/components/VenuePageLeftSection";
import VenuePageRightSection from "@/components/VenuePageRightSection";

export default async function Page({ searchParams }: { searchParams: { id: string } }) {
  const session = await auth();

  if (!session?.user) {
    redirect("/organizer/login");
  }

  const venueId = searchParams.id;

  let venue = null;
  try {
    venue = await fetchVenueById(venueId);
  } catch (error) {
    
  }

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

  return (
    <div className="flex h-screen">
      <VenuePageLeftSection venue={venue} />
      <VenuePageRightSection events={events} venueId={venueId} />
    </div>
  );
}
