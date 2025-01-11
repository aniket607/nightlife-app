import { auth } from '@/auth';
import EventFormSection from '@/components/EventFormSection';
import { redirect } from 'next/navigation';
import React from 'react'

export default async function Page({ searchParams }: { searchParams: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user) {
    redirect("/organizer/login");
  }
  const userId = session.user.id;
  const { id: venueId } = await searchParams;
  
  return (
    <div>
      <EventFormSection userId={userId!} venueId={venueId}/>
    </div>
  )
}
