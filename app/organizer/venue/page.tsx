import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { fetchVenueById } from "@/actions/fetchvenuedata";
import VenuePageLeftSection from "@/components/VenuePageLeftSection";
import VenuePageRightSection from "@/components/VenuePageRightSection";
import { fetchEventsOfVenue } from "@/actions/fetchEventsOfVenue";

export default async function Page({ searchParams }: { searchParams: Promise<{ id: string }> }) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const { id: venueId } = await searchParams;

  if(!venueId) redirect("/organizer/");

  // Fetch venue and events data in parallel
  const [venue, eventsResult] = await Promise.all([
    fetchVenueById(venueId).catch(() => null),
    fetchEventsOfVenue(venueId).catch(() => ({ upcomingEvents: [], pastEvents: [] }))
  ]);

  if (!venue) {
    redirect("/organizer/");
  }

  const { upcomingEvents, pastEvents } = eventsResult;

  return (
    <div className="min-h-screen bg-secondary">
      {/* Mobile View */}
      <div className="block md:hidden">
        <div className="bg-secondary">
          <VenuePageLeftSection venue={venue} />
        </div>
        <div>
          <VenuePageRightSection
            venueId={venueId}
            pastEvents={pastEvents}
            upcomingEvents={upcomingEvents}
          />
        </div>
      </div>

      {/* Desktop View */}
      <div className="hidden md:grid md:grid-cols-[400px_1fr] min-h-screen">
        <div className="sticky top-[72px] h-fit bg-secondary">
          <div className="h-[calc(100vh-72px)]">
            <VenuePageLeftSection venue={venue} />
          </div>
        </div>
        <div className="min-h-screen overflow-y-auto">
          <VenuePageRightSection
            venueId={venueId}
            pastEvents={pastEvents}
            upcomingEvents={upcomingEvents}
          />
        </div>
      </div>
    </div>
  );
}