"use server";

import { z } from "zod";
import prisma from "@/lib/prisma"; // Adjust to your project structure

// 1. Create a Zod schema
const formSchema = z.object({
  eventName: z.string().min(4, "Event name is required and must be at least 4 characters"),
  eventDescription: z.string().optional(),
  eventDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: "Invalid date format",
  }),
  eventTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Invalid time format (HH:mm)"),
  stagGlCount: z.coerce.number().min(0, "Stag guest list count must be a positive number"),
  coupleGl: z.enum(["true", "false"]).transform((val) => val === "true"),
  coupleGlCount: z.coerce.number().min(0, "Couple guest list count must be a positive number").optional(),
  eventImgUrl: z.string().url("Invalid image URL"),
  eventType: z.string().default("Regular"),
  artistNames: z.array(z.string()).optional(), // Accepting artist names as an array
});

export async function putEventData(formData: FormData, userId: string, venueId: string) {
  // Convert FormData to an object
  const data = Object.fromEntries(formData);

  try {
    // Run Zod validation
    const validatedData = formSchema.safeParse({
      ...data,
      artistNames: JSON.parse(formData.get("artistNames") as string),
    });

    if (!validatedData.success) {
      console.error("[putEventData] Validation errors:", validatedData.error.errors);
      return { success: false, errors: validatedData.error.errors };
    }

    const { artistNames, ...eventData } = validatedData.data;

    // Fetch existing artists by name
    // const existingArtists = await prisma.artist.findMany({
    //   where: { name: { in: artistNames } },
    // });

    // Determine new artists to create
    // const existingArtistNames = new Set(existingArtists.map((artist) => artist.name));
    // const newArtistNames = artistNames?.filter((name) => !existingArtistNames.has(name));

    // Create new artists if necessary
   // let newArtists = [];
  //  if (Array.isArray(newArtistNames) && newArtistNames.length > 0) {
  //   await prisma.artist.createMany({
  //     data: newArtistNames.map((name) => ({ name })),
  //     skipDuplicates: true,
  //   });
  // }

    // Fetch all artists (existing + newly created)
    const allArtists = await prisma.artist.findMany({
      where: { name: { in: artistNames } },
      select: { id: true },
    });

    // Create the event and link artists
    const createdEvent = await prisma.event.create({
      data: {
        eventName: eventData.eventName,
        eventDescription: eventData.eventDescription || null,
        eventDate: new Date(eventData.eventDate),
        eventTime: new Date(Date.UTC(1970, 0, 1, ...eventData.eventTime.split(":").map(Number))),
        stagGlCount: eventData.stagGlCount,
        coupleGl: eventData.coupleGl,
        coupleGlCount: eventData.coupleGl ? eventData.coupleGlCount : null,
        eventImgUrl: eventData.eventImgUrl,
        eventType: eventData.eventType,
        userId,
        venueId,
        artists: {
          create: allArtists.map((artist) => ({
            artistId: artist.id, // Link artist by ID
          })),
        },
      },
      include: { artists: true },
    });

    console.log("[putEventData] Successfully created event with artists:", createdEvent);
    return { success: true, data: createdEvent };
  } catch (error) {
    console.error("[putEventData] Unexpected error:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}
