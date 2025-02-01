"use server";
import prisma from "@/lib/prisma";
import { startOfDay } from "date-fns";
import { Event } from "@prisma/client";

interface EventsResult {
  upcomingEvents: Event[];
  pastEvents: Event[];
}

export async function fetchEventsOfVenue(venueId: string): Promise<EventsResult> {
  const now = new Date();
  const start = startOfDay(now);

  try {
    // Fetch all events for the venue in a single query
    const events = await prisma.event.findMany({
      where: {
        venueId: venueId,
      },
      orderBy: {
        eventDate: "asc", // Sort by eventDate in ascending order
      },
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
    console.error("[fetchEventsOfVenue] Error fetching events:", error);
    throw new Error("Failed to fetch events. Please try again later.");
  }
}
