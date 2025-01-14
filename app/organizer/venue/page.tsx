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

  let events: Event[] = [];
  try {
    const response = await fetchEventByVenueId(venueId);
    events = response || []
    console.log(events)
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
          <VenuePageRightSection events={events} venueId={venueId} />
        </div>
      </div>

      {/* Desktop View */}
      <div className="hidden md:flex h-[calc(100vh-64px)]">
        <div className="w-1/3 h-full">
          <div className="fixed w-1/3 h-[calc(100vh-64px)]">
            <VenuePageLeftSection venue={venue} />
          </div>
        </div>
        <div className="w-2/3 overflow-y-auto">
          <VenuePageRightSection events={events} venueId={venueId} />
        </div>
      </div>
    </div>
  );
}