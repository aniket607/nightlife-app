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

export default async function Page({ searchParams }: { searchParams: { id: number } }) {

      const session = await auth();
      if (!session?.user) {
        redirect("/login");
      }
    
     // const id: string = session?.user?.id ?? "";

  const eventId = searchParams?.id;

  let guestlist: Guestlist[] = []; // Initialize with an empty array
  try {
    guestlist = await fetchGuestlist(eventId); // Fetch data
  } catch (error) {
    console.error('Error fetching guestlist:', error);
  }

  return (
    <div>
      
      <GuestListTable guestlist={guestlist} />
    </div>
  );
}
