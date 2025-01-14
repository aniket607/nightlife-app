"use server";
import prisma from "@/lib/prisma"; // Adjust to your project structure

export async function fetchVenueById(id: string) {
  try {
    // Fetch a single venue by its id
    const venue = await prisma.venue.findUnique({
      where: {
        id: id,
      },
    });

    // If no venue is found, throw an error
    if (!venue) {
      throw new Error(`Venue with id ${id} not found.`);
    }

    return venue; // Return the fetched venue
  } catch (error) {
    console.error("[fetchVenueById] Error fetching venue:", error);
    throw new Error("Failed to fetch venue. Please try again later.");
  }
}
