"use server";
import prisma from "@/lib/prisma"; // Adjust to your project structure

export async function fetchVenues() {
  try {
    // Fetch all venues from the database
    const venueData = await prisma.venue.findMany();
    return venueData; // Return the fetched data
  } catch (error) {
    console.error("[fetchVenues] Error fetching venues:", error);
    throw new Error("Failed to fetch venues. Please try again later.");
  }
}
