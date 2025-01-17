import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { fetchMyEvents } from "@/actions/fetchMyEvents";
import { Event } from "@/components/VenuePageRightSection";
import Image from "next/image";
import MyEventsCard from "@/components/MyEventsCard";

async function page() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  const id: string = session?.user?.id ?? "";

  const myEvents = await fetchMyEvents(id);
  console.log(myEvents)
  const {pastEvents, upcomingEvents} = myEvents

  return (
    <div className="m-auto">
      <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-200 to-gray-400 bg-clip-text text-transparent group-hover/title:from-white group-hover/title:to-gray-300 transition-all my-10">
        My Events
      </h1>
      <div className="grid grid-cols-1 gap-4 border rounded p-5 m-5">
        <MyEventsCard pastEvents={pastEvents} upcomingEvents={upcomingEvents}/>
      </div>
    </div>
  );
}

export default page;
