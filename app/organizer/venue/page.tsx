import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { fetchVenueById } from "@/actions/fetchvenuedata";
import VenuePageLeftSection from "@/components/VenuePageLeftSection";
import VenuePageRightSection from "@/components/VenuePageRightSection";
import { fetchEventByVenueId } from "@/actions/fetchEventData";

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

export default async function Page({ searchParams }: { searchParams: Promise<{ id: string }> }) {
  const session = await auth();

  if (!session?.user) {
    redirect("/organizer/login");
  }

  const { id: venueId } = await searchParams;

  if(!venueId) redirect("/organizer/");

  let venue = null;
  try {
    venue = await fetchVenueById(venueId);
  } catch (error) {
    // Handle error
  }

  let events: Event[] = [];
  try {
    const response = await fetchEventByVenueId(venueId);
    events = response || []
    console.log(events)
  } catch (error) {
    // Handle error
  }

  // const events = [
  //   {
  //     id: 1,
  //     image:
  //       "https://aws-nightlife.s3.eu-north-1.amazonaws.com/KavaEventBanner.jpeg",
  //     name: "Event One",
  //     date: "January 20, 2025",
  //     description:
  //       "A fun and exciting event to enjoy. Lorem ipsum dolor sit amet consectetur adipisicing elit. Minus, pariatur!",
  //   },
  //   {
  //     id: 2,
  //     image:
  //       "https://aws-nightlife.s3.eu-north-1.amazonaws.com/KavaEventBanner.jpeg",
  //     name: "Event Two",
  //     date: "February 10, 2025",
  //     description:
  //       "An event full of learning and networking. Lorem ipsum dolor sit amet consectetur adipisicing elit. Minus, pariatur!",
  //   },
  //   {
  //     id: 3,
  //     image:
  //       "https://aws-nightlife.s3.eu-north-1.amazonaws.com/KavaEventBanner.jpeg",
  //     name: "Event Three",
  //     date: "March 5, 2025",
  //     description:
  //       "Celebrate with us at this grand event. Lorem ipsum dolor sit amet consectetur adipisicing elit. Minus, pariatur!",
  //   },
  // ];

  return (
    <div className="mx-auto h-screen bg-secondary">
      <div className="flex h-full overflow-hidden">
        <VenuePageLeftSection venue={venue} />
        <div className="w-2/3 h-full overflow-y-auto">
          <VenuePageRightSection events={events} venueId={venueId} />
        </div>
      </div>
    </div>
  );
  
  
}