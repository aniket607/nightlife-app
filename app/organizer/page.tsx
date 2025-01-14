import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { checkUser } from "../../actions/checkUser";
import AddVenueButton from "@/components/AddVenueButton";
import VenueCardAdmin from "@/components/VenueCardAdmin";
import { fetchVenues } from "../../actions/fetchVenues";

export default async function Page() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  const userId = session.user.id;

  const checkaccess = await checkUser();
  const venueData=await fetchVenues();
  const myVenues = venueData.filter(venue => venue.userId === userId);

  return (
    <div className="min-h-screen bg-gray-300 dark:bg-primary py-4 sm:py-8">
      <div className="max-w-6xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-secondary rounded-lg shadow-md overflow-hidden">
          <div className="p-4 sm:p-6">
            {checkaccess ? (
              <div className="space-y-4 sm:space-y-6">
                <div className="flex justify-end mb-2 sm:mb-4">
                  <AddVenueButton />
                </div>
                  {myVenues.length > 0 && (
                    <div className="h-auto border border-black dark:border-gray-500 rounded-md">
                    <div className="font-bold text-base sm:text-lg mb-2 pt-4 sm:pt-6 px-4 sm:px-6 dark:text-gray-200">My Venues:</div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
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
                <div className="h-auto border border-black dark:border-gray-500 rounded-md mt-4 sm:mt-6">
                <div className="font-bold text-base sm:text-lg mb-2 pt-4 sm:pt-6 px-4 sm:px-6 dark:text-gray-200">All Venues:</div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
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
    <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-3 sm:p-4 rounded-md shadow-md">
      <h2 className="text-lg sm:text-xl font-bold mb-2">Access Denied</h2>
      <p className="mb-2 text-sm sm:text-base">
        You don&apos;t have access to create venues/events.
      </p>
      <p className="text-sm sm:text-base">
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
