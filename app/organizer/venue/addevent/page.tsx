import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import React from 'react'

export default async function page({ searchParams }: { searchParams: { id: string } }) {
      const session = await auth();
      if (!session?.user) {
        redirect("/organizer/login");
      }
      const userId=session.user.id;
      const venueId = searchParams.id;
  return (
    <div>page</div>
  )
}

