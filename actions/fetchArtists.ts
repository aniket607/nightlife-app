"use server";
import prisma from "@/lib/prisma"; // Adjust to your project structure

export async function fetchArtists(query: string) {
  try {
    const artists = await prisma.artist.findMany({
        where: { name: { contains: query, mode: "insensitive" } },
        take: 3,
      });
      return artists
  } catch (error) {
    console.error("[fetchVenues] Error fetching venues:", error);
    throw new Error("Failed to fetch venues. Please try again later.");
  }
}
