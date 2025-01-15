'use server';

import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { checkUser } from "../../actions/checkUser";
import { fetchVenues } from "../../actions/fetchVenues";
import OrganizerPage from "./OrganizerPage";

export default async function Page() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }
  
  const userId = session.user.id;
  const [checkaccess, venueData] = await Promise.all([
    checkUser(),
    fetchVenues()
  ]);

  const myVenues = venueData.filter(venue => venue.userId === userId);

  return (
    <OrganizerPage 
      initialVenues={venueData}
      myVenues={myVenues}
      hasAccess={Boolean(checkaccess)}
    />
  );
}
