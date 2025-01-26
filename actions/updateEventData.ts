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
});

export async function updateEventData(
  formData: FormData,
  userId: string,
  eventId: string,
  venueId: string
) {
  const data = Object.fromEntries(formData);
  console.log("[updateEventData] Raw form data:", data);
  console.log("[updateEventData] coupleGl raw value:", data.coupleGl);

  try {
    const validatedData = formSchema.safeParse(data);
    console.log("[updateEventData] Validated data:", validatedData.success ? validatedData.data : validatedData.error);
    
    if (!validatedData.success) {
      console.error("[updateEventData] Validation errors:", validatedData.error.errors);
      return { success: false, errors: validatedData.error.errors };
    }

    const updatedEvent = await prisma.event.update({
      where: {
        eventId: parseInt(eventId)
      },
      data: {
        eventName: validatedData.data.eventName,
        eventDescription: validatedData.data.eventDescription || null,
        eventDate: new Date(validatedData.data.eventDate),
        eventTime: new Date(Date.UTC(1970, 0, 1, ...validatedData.data.eventTime.split(':').map(Number))),
        stagGlCount: validatedData.data.stagGlCount,
        coupleGl: validatedData.data.coupleGl,
        coupleGlCount: validatedData.data.coupleGl ? validatedData.data.coupleGlCount : null,
        eventImgUrl: validatedData.data.eventImgUrl || null,
        eventType: validatedData.data.eventType,
        userId: userId,
        venueId: venueId,
      },
    });

    console.log("[updateEventData] Updated event:", updatedEvent);
    return { success: true, data: updatedEvent };
  } catch (error) {
    // Enhanced error logging
    console.error("[updateEventData] Unexpected error:", error);

    if (error instanceof TypeError) {
      console.error("[updateEventData] TypeError occurred. Check input values.");
      return { 
        success: false, 
        error: error instanceof Error ? error.message : "Type error occurred" 
      };
    }

    return { 
      success: false, 
      error: error instanceof Error ? error.message : "An unexpected error occurred" 
    };
  }
}
