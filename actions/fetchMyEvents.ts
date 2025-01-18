"use server";
import prisma from "@/lib/prisma"; // Adjust to your project structure
import { startOfDay } from "date-fns";
import { Event, Venue } from "@prisma/client";

interface EventWithVenue extends Event {
  venue: Venue;
}
interface EventsResult {
  upcomingEvents: EventWithVenue[];
  pastEvents: EventWithVenue[];
}

export async function fetchMyEvents(userId: string): Promise<EventsResult> {
  const now = new Date();
  const start = startOfDay(now);

  try {
    // Fetch all events for the user in a single query
    const events = await prisma.event.findMany({
      where: {
        userId: userId,
      },
      orderBy: {
        eventDate: "asc", // Sort by eventDate in ascending order
      },
      include: {
        venue: true, // Include venue details if needed
      }
    });

    // Split events into upcoming and past arrays
    const { upcomingEvents, pastEvents } = events.reduce<EventsResult>((acc, event) => {
      if (new Date(event.eventDate) > start) {
        acc.upcomingEvents.push(event);
      } else {
        acc.pastEvents.push(event);
      }
      return acc;
    }, { upcomingEvents: [], pastEvents: [] } as EventsResult);
    return { upcomingEvents, pastEvents };
  } catch (error) {
    console.error("[fetchMyEvents] Error fetching events:", error);
    throw new Error("Failed to fetch events. Please try again later.");
  }
}
