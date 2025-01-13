import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { checkUser } from "../actions/checkUser";
import AddVenueButton from "@/components/AddVenueButton";
import VenueCardAdmin from "@/components/VenueCardAdmin";
import { fetchVenues } from "../actions/fetchVenues";

export default async function Page() {
  const session = await auth();
  if (!session?.user) {
    redirect("/organizer/login");
  }

  const userId = session.user.id;

  const checkaccess = await checkUser();
  const venueData=await fetchVenues();
  const myVenues = venueData.filter(venue => venue.userId === userId);

  return (
    <div className="min-h-screen bg-gray-300 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6">
            {checkaccess ? (
              <div className="space-y-6">
                <AddVenueButton />
                  {myVenues.length > 0 && (
                    <div className="h-auto border border-black rounded-md p-4 flex flex-col mb-6">
                      <div className="font-bold pl-5 mb-4">My Venues:</div>
                      {myVenues.map((venue) => (
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
                  )}
                <div className="h-auto border border-black rounded-md p-4 flex flex-col">
                  <div className="font-bold pl-5">All Venues:</div>
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
