import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { fetchMyEvents } from "@/actions/fetchMyEvents";

import MyEventsCard from "@/components/MyEventsCard";

async function page() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  const id: string = session?.user?.id ?? "";

  const myEvents = await fetchMyEvents(id);
  const {pastEvents, upcomingEvents} = myEvents

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
        My Events
      </h1>
      <div>
        <MyEventsCard pastEvents={pastEvents} upcomingEvents={upcomingEvents}/>
      </div>
    </div>
  );
}

export default page;
