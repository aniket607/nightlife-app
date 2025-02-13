"use server";
import prisma from "@/lib/prisma"; // Adjust to your project structure

export async function fetchEventById(id: number) {
  try {
    // Fetch the event along with its artists
    const event = await prisma.event.findUnique({
      where: {
        eventId: id,
      },
      include: {
        artists: {
          include: {
            artist: true, // Include the Artist details
          },
        },
      },
    });

    // If no event is found, throw an error
    if (!event) {
      throw new Error(`Event with id ${id} not found.`);
    }

    // Transform the event data to include artist names directly
    const formattedEvent = {
      ...event,
      artists: event.artists.map((eventArtist) => ({
        id: eventArtist.artist.id,
        name: eventArtist.artist.name,
      })),
    };
    console.log(formattedEvent)

    return formattedEvent;
  } catch (error) {
    console.error("[fetchEventById] Error fetching event:", error);
    throw new Error("Failed to fetch event. Please try again later.");
  }
}
