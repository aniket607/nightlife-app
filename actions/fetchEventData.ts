"use server";
import prisma from "@/lib/prisma"; // Adjust to your project structure

export async function fetchEventByVenueId(id: string) {
  try {
    // Fetch a single venue by its id
    const events = await prisma.event.findMany({
      where: {
        venueId: id,
      },
    });

    // If no venue is found, throw an error
    if (!events) {
      throw new Error(`Venue with id ${id} not found.`);
    }

    return events; // Return the fetched venue
  } catch (error) {
    console.error("[fetchVenueById] Error fetching venue:", error);
    throw new Error("Failed to fetch venue. Please try again later.");
  }
}
