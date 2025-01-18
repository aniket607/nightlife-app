"use server";
import prisma from "@/lib/prisma"; // Adjust to your project structure

export async function fetchGuestlist(eventId: number) {
  try {
    const guestlist = await prisma.guestlist.findMany({
      where: {
        eventId,
      },
    });

    return guestlist;
  } catch (error) {
    console.error("[fetchGuestlist] Error fetching guestlist:", error);
    return []; // Return empty array on error
  }
}
