"use server";
import prisma from "@/lib/prisma"; // Adjust according to your project structure

export async function upsertArtists(artistNames: string[]) {
  try {
    // Fetch existing artists by name
    const existingArtists = await prisma.artist.findMany({
      where: { name: { in: artistNames } },
      select: { name: true }, // Fetch only names
    });

    // Extract existing artist names
    const existingArtistNames = new Set(existingArtists.map((artist) => artist.name));

    // Filter names that are not in DB
    const newArtists = artistNames.filter((name) => !existingArtistNames.has(name));

    // Insert new artists if any
    if (newArtists.length > 0) {
      await prisma.artist.createMany({
        data: newArtists.map((name) => ({ name })),
        skipDuplicates: true, // Ensures no duplicates if race conditions occur
      });
    }

    return { message: "Upsert complete", newArtists };
  } catch (error) {
    console.error("[upsertArtists] Error inserting artists:", error);
    throw new Error("Failed to insert artists. Please try again later.");
  }
}
