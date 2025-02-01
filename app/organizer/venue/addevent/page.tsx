import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import DynamicEventForm from '@/components/DynamicEventForm';

export default async function Page({ searchParams }: { searchParams: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }
  const userId = session.user.id;
  const { id: venueId } = await searchParams;

  if (!venueId) {
    redirect("/organizer");
  }
  
  return (
    <div className="min-h-screen w-full bg-primary py-4 sm:py-6 md:py-8 px-3 sm:px-4">
      <div className="container mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-200 mb-6 sm:mb-8 text-center">Add New Event</h1>
        <DynamicEventForm userId={userId!} venueId={venueId} />
      </div>
    </div>
  );
}
