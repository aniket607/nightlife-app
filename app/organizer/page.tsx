import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { checkUser } from "../../actions/checkUser";
import AddVenueButton from "@/components/AddVenueButton";
import VenueCardAdmin from "@/components/VenueCardAdmin";
import { fetchVenues } from "../../actions/fetchVenues";

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
    <div className="min-h-screen bg-gray-300 dark:bg-primary py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-secondary rounded-lg shadow-md overflow-hidden">
          <div className="p-6">
            {checkaccess ? (
              <div className="space-y-6">
                <div className="flex justify-end mb-4">
                  <AddVenueButton />
                </div>
                  {myVenues.length > 0 && (
                    <div className="h-auto border border-black dark:border-gray-500 rounded-md">
                    <div className="font-bold text-lg mb-1 pt-6 pl-6 dark:text-gray-200">My Venues:</div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 px-2 mb-4">
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
                  </div>
                  )}
                <div className="h-auto border border-black dark:border-gray-500 rounded-md mt-6">
                <div className="font-bold text-lg mb-1 pt-6 pl-6 dark:text-gray-200">All Venues:</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 px-2 mb-4">
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
