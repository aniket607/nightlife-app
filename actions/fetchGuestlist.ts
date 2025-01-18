"use server";
import prisma from "@/lib/prisma"; // Adjust to your project structure

export async function fetchGuestlist(id: number) {
  try {
    // Fetch a single venue by its id
    const guestlist = await prisma.guestlist.findMany({
      where: {
        eventId: id,
      },
    });

    // If no venue is found, throw an error
    if (!guestlist) {
      throw new Error(`Venue with id ${id} not found.`);
    }

    return guestlist; // Return the fetched venue
  } catch (error) {
    console.error("[fetchVenueById] Error fetching venue:", error);
    throw new Error("Failed to fetch venue. Please try again later.");
  }
}
