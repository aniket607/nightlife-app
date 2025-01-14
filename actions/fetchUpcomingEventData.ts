"use server";
import prisma from "@/lib/prisma"; // Adjust to your project structure
import { startOfDay } from "date-fns";

export async function fetchUpcomingEventByVenueId(id: string) {
  const now = new Date(); // Current date and time
  const start = startOfDay(now); // Normalize to start of the day
  try {
    // Fetch events by venueId where eventDate is in the future, sorted by eventDate
    const events = await prisma.event.findMany({
      where: {
        venueId: id,
        eventDate: {
          gt: start, // Ensure eventDate is greater than the current date
        },
      },
      orderBy: {
        eventDate: "asc", // Sort by eventDate in ascending order
      },
    });

    // If no events are found, return an empty array or handle it as needed
    if (!events || events.length === 0) {
      return [];
    }

    return events;
  } catch (error) {
    console.error("[fetchEventByVenueId] Error fetching events:", error);
    throw new Error("Failed to fetch events. Please try again later.");
  }
}
