import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import SignoutButton from "@/components/signout-button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { checkUser } from "../actions/checkuser";
import AddEventButton from "@/components/AddEventButton";
import VenueCardAdmin from "@/components/VenueCardAdmin";

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

  const venues = [
    {
      id: 1,
      image: 'https://fastly.picsum.photos/id/122/4147/2756.jpg?hmac=-B_1uAvYufznhjeA9xSSAJjqt07XrVzDWCf5VDNX0pQ',
      name: 'Grand Hall',
      rating: 4.8,
      area: 'MG Road',
      address: '45 MG Road, Indore, 452001',
    },
    {
      id: 2,
      image: 'https://fastly.picsum.photos/id/122/4147/2756.jpg?hmac=-B_1uAvYufznhjeA9xSSAJjqt07XrVzDWCf5VDNX0pQ',
      name: 'Banquet Bliss',
      rating: 4.5,
      area: 'Vijay Nagar',
      address: '678 Vijay Nagar, Indore, 452001',
    },
    {
      id: 3,
      image: 'https://fastly.picsum.photos/id/122/4147/2756.jpg?hmac=-B_1uAvYufznhjeA9xSSAJjqt07XrVzDWCf5VDNX0pQ',
      name: 'Elegant Venue',
      rating: 4.9,
      area: 'Palasia',
      address: '12 Palasia, Indore, 452001',
    },
  ];


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
                {venues.map((venue) => (
        <VenueCardAdmin
          key={venue.id}
          venueImage={venue.image}
          name={venue.name}
          rating={venue.rating}
          area={venue.area}
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
