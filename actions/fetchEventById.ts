"use server";
import prisma from "@/lib/prisma"; // Adjust to your project structure

export async function fetchEventById(id: number) {
  try {
    // Fetch a single venue by its id
    const event = await prisma.event.findUnique({
      where: {
        eventId: id,
      },
    });

    // If no venue is found, throw an error
    if (!event) {
      throw new Error(`Venue with id ${id} not found.`);
    }

    return event; // Return the fetched venue
  } catch (error) {
    console.error("[fetchVenueById] Error fetching venue:", error);
    throw new Error("Failed to fetch venue. Please try again later.");
  }
}
