import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import SignoutButton from "@/components/SignoutButton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { checkUser } from "../actions/checkUser";
import AddEventButton from "@/components/AddEventButton";
import VenueCardAdmin from "@/components/VenueCardAdmin";
import { fetchVenues } from "../actions/fetchVenues";

export default async function Page() {
  const session = await auth();
  if (!session?.user) {
    redirect("/organizer/login");
  }

  const userId = session.user.id;
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { image: true, email: true },
  });

  const imageUrl = user?.image ?? undefined;
  const checkaccess = await checkUser();
  const venueData=await fetchVenues();

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <div className="text-2xl font-bold">Organizer Dashboard</div>
              <div className="flex items-center space-x-4">
                <Avatar>
                  <AvatarImage src={imageUrl} />
                  <AvatarFallback>
                    {user?.email ? user.email.charAt(0).toUpperCase() : "U"}
                  </AvatarFallback>
                </Avatar>
                <SignoutButton />
              </div>
            </div>
            {checkaccess ? (
              <div className="space-y-6">
                <AddEventButton />
                <div className="h-auto border border-black rounded-md p-4 flex flex-col">
                {venueData.map((venue) => (
        <VenueCardAdmin
          key={venue.id}
          venueId={venue.id}
          venueImage={venue.venueImgUrl}
          name={venue.venueName}
          rating={venue.rating}
          area={venue.venueArea}
          address={venue.address}
        />
      ))}
                </div>
              </div>
            ) : (
              <NoAccessComponent />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function NoAccessComponent() {
  return (
    <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md shadow-md">
      <h2 className="text-xl font-bold mb-2">Access Denied</h2>
      <p className="mb-2">
        You don&apos;t have access to create venues/events.
      </p>
      <p>
        Please WhatsApp @
        <a
          href="https://wa.me/+917974767742"
          target="_blank"
          rel="noopener noreferrer"
          className="text-red-700 hover:text-red-900 underline ml-1"
        >
          <strong>+917974767742</strong>
        </a>{" "}
        to become an organizer.
      </p>
    </div>
  );
}
