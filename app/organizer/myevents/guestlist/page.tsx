import { fetchGuestlist } from '@/actions/fetchGuestlist';
import GuestListTable from '@/components/GuestListTable';
import React from 'react';
import { checkEventAccess } from '@/actions/checkEventAccess';

interface Guestlist {
  glId: number;
  guestName: string;
  guestAge: number;
  guestMobile: bigint;
  guestEmail: string;
  eventId: number;
}

export default async function Page({ searchParams }: { searchParams: Promise<{ eventId: string }> }) {
  const { eventId: eventIdStr } = await searchParams;
  
  if (!eventIdStr) {
    return (
      <div className="container mx-auto p-4">
        <div className="text-center p-4 bg-red-50 rounded-lg">
          <p className="text-red-600">Event ID is required</p>
        </div>
      </div>
    );
  }

  const eventId = parseInt(eventIdStr, 10);
  
  const hasaccess = await checkEventAccess(eventId);

  if (!hasaccess) {
    return (
      <div className="container mx-auto p-4">
        <div className="text-center p-4 bg-red-50 rounded-lg">
          <p className="text-red-600">You don&apos;t have access to this event</p>
        </div>
      </div>
    );
  }
  
  if (isNaN(eventId)) {
    return (
      <div className="container mx-auto p-4">
        <div className="text-center p-4 bg-red-50 rounded-lg">
          <p className="text-red-600">Invalid event ID</p>
        </div>
      </div>
    );
  }

  let guestlist: Guestlist[] = [];
  try {
    guestlist = await fetchGuestlist(eventId);
  } catch (error) {
    console.error('Error fetching guestlist:', error);
  }

  return (
    <div className="container mx-auto p-4">
      {guestlist.length > 0 ? (
        <GuestListTable guestlist={guestlist} />
      ) : (
        <div className="text-center p-4 bg-gray-50 rounded-lg">
          <p className="text-gray-600">No guests in guestlist</p>
        </div>
      )}
    </div>
  );
}
