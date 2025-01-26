import { fetchEventById } from "@/actions/fetchEventById";
import { checkEventAccess } from "@/actions/checkEventAccess";
import UpdateEventForm from '@/components/UpdateEventForm';
import { notFound } from 'next/navigation';

export default async function EditEventPage({
  searchParams,
}: {
  searchParams: { eventId: string };
}) {
  const { eventId } = await searchParams
  if (!eventId) {
    notFound();
  }
  const parsedEventId = parseInt(eventId, 10);
    console.log("eventId:",parsedEventId)

  // Check if user has access to this event
  const hasAccess = await checkEventAccess(parsedEventId);
  if (!hasAccess) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center p-4 bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700">
          <p className="text-gray-200">You don&apos;t have access to edit this event</p>
        </div>
      </div>
    );
  }

  try {
    // Fetch event data
    const eventData = await fetchEventById(parsedEventId);
    
    if (!eventData) {
      return (
        <div className="flex justify-center items-center min-h-screen">
          <div className="text-center p-4 bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700">
            <p className="text-gray-200">Event not found</p>
          </div>
        </div>
      );
    }

    return <UpdateEventForm eventData={eventData} />;
    
  } catch (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center p-4 bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700">
          <p className="text-gray-200">Error loading event data</p>
        </div>
      </div>
    );
  }
}
