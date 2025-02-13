"use server";

import { z } from "zod";
import prisma from "@/lib/prisma"; // Adjust to your project structure

// Modify the validation logic in updateEventData.ts
const formSchema = z.object({
  eventName: z.string().min(4, "Event name is required and must be at least 4 characters"),
  eventDescription: z.string().optional(),
  eventDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: "Invalid date format",
  }),
  eventTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Invalid time format (HH:mm)"),
  stagGlCount: z.coerce.number().min(0, "Stag guest list count must be a positive number"),
  coupleGl: z.string()
    .transform((val) => val === "true")  // Explicitly transform string to boolean
    .pipe(z.boolean()),  // Validate as boolean
  coupleGlCount: z.coerce.number().min(0),
  eventImgUrl: z.string().url("Invalid image URL").optional(),
  eventType: z.string().default("Regular"),
  artistNames: z.array(z.string()).optional(),
});

// export async function updateEventData(
//   formData: FormData,
//   userId: string,
//   eventId: string,
//   venueId: string
// ) {
//   const data = Object.fromEntries(formData);
//   console.log("[updateEventData] Raw form data:", data);

//   try {
//     const validatedData = formSchema.safeParse({
//       ...data,
//       artistNames: JSON.parse(formData.get("artistNames") as string || "[]"),
//     });

//     if (!validatedData.success) {
//       console.error("[updateEventData] Validation errors:", validatedData.error.errors);
//       return { success: false, errors: validatedData.error.errors };
//     }

//     const { artistNames, ...eventData } = validatedData.data;

//     // Fetch existing artists linked to this event
//     const existingArtists = await prisma.eventArtist.findMany({
//       where: { eventId: parseInt(eventId) },
//       select: { artistId: true },
//     });

//     const existingArtistIds = existingArtists.map((artist) => artist.artistId);

//     // Get the IDs of artists in the new update
//     const allArtists = await prisma.artist.findMany({
//       where: { name: { in: artistNames } },
//       select: { id: true, name: true },
//     });

//     const newArtistIds = allArtists.map((artist) => artist.id);

//     // Artists to be removed (in existing but not in new)
//     const artistsToRemove = existingArtistIds.filter((id) => !newArtistIds.includes(id));

//     // Artists to be added (in new but not in existing)
//     const artistsToAdd = newArtistIds.filter((id) => !existingArtistIds.includes(id));

//     // Perform the event update
//     const updatedEvent = await prisma.event.update({
//       where: { eventId: parseInt(eventId) },
//       data: {
//         eventName: eventData.eventName,
//         eventDescription: eventData.eventDescription || null,
//         eventDate: new Date(eventData.eventDate),
//         eventTime: new Date(Date.UTC(1970, 0, 1, ...eventData.eventTime.split(":").map(Number))),
//         stagGlCount: eventData.stagGlCount,
//         coupleGl: eventData.coupleGl,
//         coupleGlCount: eventData.coupleGl ? eventData.coupleGlCount : null,
//         eventImgUrl: eventData.eventImgUrl || null,
//         eventType: eventData.eventType,
//         userId: userId,
//         venueId: venueId,
//         artists: {
//           deleteMany: artistsToRemove.map((artistId) => ({
//             eventId: parseInt(eventId),
//             artistId,
//           })),
//           create: artistsToAdd.map((artistId) => ({
//             artistId,
//           })),
//         },
//       },
//       include: { artists: true },
//     });

//     console.log("[updateEventData] Updated event with artists:", updatedEvent);
//     return { success: true, data: updatedEvent };
//   } catch (error) {
//     console.error("[updateEventData] Unexpected error:", error);
//     return {
//       success: false,
//       error: error instanceof Error ? error.message : "An unexpected error occurred",
//     };
//   }
// }

export async function updateEventData(
  formData: FormData,
  userId: string,
  eventId: string,
  venueId: string
) {
  const data = Object.fromEntries(formData);
  console.log("[updateEventData] Raw form data:", data);

  try {
    const validatedData = formSchema.safeParse({
      ...data,
      artistNames: JSON.parse(formData.get("artistNames") as string || "[]"),
    });

    if (!validatedData.success) {
      console.error("[updateEventData] Validation errors:", validatedData.error.errors);
      return { success: false, errors: validatedData.error.errors };
    }

    const { artistNames, ...eventData } = validatedData.data;

    // Fetch existing artists linked to this event
    const existingArtists = await prisma.eventArtist.findMany({
      where: { eventId: parseInt(eventId) },
      select: { artistId: true },
    });

    const existingArtistIds = existingArtists.map((artist) => artist.artistId);

    // Get the IDs of artists in the new update
    const allArtists = await prisma.artist.findMany({
      where: { name: { in: artistNames } },
      select: { id: true, name: true },
    });

    const newArtistIds = allArtists.map((artist) => artist.id);

    // Artists to be removed (in existing but not in new)
    const artistsToRemove = existingArtistIds.filter((id) => !newArtistIds.includes(id));

    // Artists to be added (in new but not in existing)
    const artistsToAdd = newArtistIds.filter((id) => !existingArtistIds.includes(id));

    // Perform the event update
    const updatedEvent = await prisma.event.update({
      where: { eventId: parseInt(eventId) },
      data: {
        eventName: eventData.eventName,
        eventDescription: eventData.eventDescription || null,
        eventDate: new Date(eventData.eventDate),
        eventTime: new Date(Date.UTC(1970, 0, 1, ...eventData.eventTime.split(":").map(Number))),
        stagGlCount: eventData.stagGlCount,
        coupleGl: eventData.coupleGl,
        coupleGlCount: eventData.coupleGl ? eventData.coupleGlCount : null,
        eventImgUrl: eventData.eventImgUrl || null,
        eventType: eventData.eventType,
        userId: userId,
        venueId: venueId,
        artists: {
          deleteMany: artistsToRemove.map((artistId) => ({
            eventId: parseInt(eventId),
            artistId,
          })),
          create: artistsToAdd.map((artistId) => ({
            artistId,
          })),
        },
      },
      include: { artists: true },
    });

    console.log("[updateEventData] Updated event with artists:", updatedEvent);
    return { success: true, data: updatedEvent };
  } catch (error) {
    console.error("[updateEventData] Unexpected error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}

