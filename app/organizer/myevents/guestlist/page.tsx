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

interface PageProps {
  params: { [key: string]: string | string[] | undefined };
  searchParams: { [key: string]: string | string[] | undefined };
}

export default async function Page({ searchParams }: PageProps) {
  const eventId = parseInt(searchParams.eventId as string, 10);
  
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

  let guestlist: Guestlist[] = []; // Initialize with an empty array
  try {
    guestlist = await fetchGuestlist(eventId);
    console.log("Fetched guestlist:", guestlist);
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
