import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { fetchVenueById } from "@/actions/fetchvenuedata";
import VenuePageLeftSection from "@/components/VenuePageLeftSection";
import VenuePageRightSection from "@/components/VenuePageRightSection";
import { fetchUpcomingEventByVenueId } from "@/actions/fetchUpcomingEventData";
import { fetchPastEventByVenueId } from "@/actions/fetchPastEventData";

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
    redirect("/login");
  }

  const { id: venueId } = await searchParams;

  if(!venueId) redirect("/organizer/");

  let venue = null;
  try {
    venue = await fetchVenueById(venueId);
  } catch (error) {
    // Handle error
  }

  let upcomingEvents: Event[] = [];
  try {
    const response = await fetchUpcomingEventByVenueId(venueId);
    upcomingEvents = response || []
    console.log(upcomingEvents)
  } catch (error) {
    // Handle error
  }
  
  let pastEvents: Event[] = [];
  try {
    const response = await fetchUpcomingEventByVenueId(venueId);
    pastEvents = response || []
    console.log(pastEvents)
  } catch (error) {
    // Handle error
  }

  return (
    <div className="min-h-screen bg-secondary">
      {/* Mobile View */}
      <div className="md:hidden">
        <div className="w-full">
          <VenuePageLeftSection venue={venue} />
        </div>
        <div className="w-full">
          <VenuePageRightSection  pastEvents={pastEvents} upcomingEvents={upcomingEvents} venueId={venueId} />
        </div>
      </div>

      {/* Desktop View */}
      <div className="hidden md:flex">
        <div className="w-1/3 fixed top-[64px] bottom-0">
          <VenuePageLeftSection venue={venue} />
        </div>
        <div className="w-1/3">
          {/* Spacer div to match fixed left section */}
        </div>
        <div className="w-2/3 overflow-y-auto">
          <VenuePageRightSection pastEvents={pastEvents} upcomingEvents={upcomingEvents} venueId={venueId} />
        </div>
      </div>
    </div>
  );
}