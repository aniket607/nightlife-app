import { fetchGuestlist } from '@/actions/fetchGuestlist';
import GuestListTable from '@/components/GuestListTable';
import React from 'react';
import { auth } from "@/auth";
import { redirect } from "next/navigation";

interface Guestlist {
  glId: number;
  guestName: string;
  guestAge: number;
  guestMobile: bigint;
  guestEmail: string;
  eventId: number;
}

export default async function Page({ searchParams }: { searchParams: { eventId: string } }) {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  // Await the searchParams
  const params = await searchParams;
  const eventId = parseInt(params.eventId, 10);
  
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
