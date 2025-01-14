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
  glCount: z.coerce.number().min(0, "Guest list count must be a positive number"),
  eventImgUrl: z.string().url("Invalid image URL"),
});

export async function putEventData(formData: FormData, userId: string, venueId: string) {
  // Convert FormData to an object
  const data = Object.fromEntries(formData);
  console.log("[putEventData] Incoming form data:", data);

  try {
    // Run Zod validation
    const validatedData = formSchema.safeParse(data);

    if (!validatedData.success) {
      console.error("[putEventData] Validation errors:", validatedData.error.errors);
      return { success: false, errors: validatedData.error.errors };
    }

    // Convert eventTime from string to a UTC Date object
    const [hours, minutes] = validatedData.data.eventTime.split(":").map(Number);
    const eventTimeAsUTCDate = new Date(Date.UTC(1970, 0, 1, hours, minutes)); // Use UTC explicitly

    // Insert into the database
    const createdEvent = await prisma.event.create({
      data: {
        eventName: validatedData.data.eventName,
        eventDescription: validatedData.data.eventDescription || null,
        eventDate: new Date(validatedData.data.eventDate), // Convert string to Date object
        eventTime: eventTimeAsUTCDate, // Store time as a UTC Date object
        glCount: validatedData.data.glCount,
        eventImgUrl: validatedData.data.eventImgUrl,
        userId,
        venueId,
      },
    });

    console.log("[putEventData] Successfully created event:", createdEvent);
    return { success: true, data: createdEvent };
  } catch (error) {
    // Enhanced error logging
    console.error("[putEventData] Unexpected error:", error);

    if (error instanceof TypeError) {
      console.error("[putEventData] TypeError occurred. Check input values.");
    }

    return { success: false, error: "An unexpected error occurred" };
  }
}
