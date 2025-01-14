"use server";

import { z } from "zod";
import prisma from "@/lib/prisma"; 
import { auth } from "@/auth";
import { Prisma } from "@prisma/client"; // Imported Prisma types for error handling

// 1. Create a Zod schema
const formSchema = z.object({
  venue_name: z.string().min(4, "Name is required/minimum 4 Characters"),
  venue_area: z.string(),
  venue_rating: z.coerce.number().max(5),
  venue_addr: z.string(),
  locationUrl: z.string().url("Invalid Location URL"),
  venueImgUrl: z.string().url("Invalid image URL"),
});

export async function putVenueData(formData: FormData) {
  const session = await auth();
  const sesId = session?.user?.id;

  // Convert FormData to an object
  const data = Object.fromEntries(formData);
  console.log("[putvenuedata] Incoming form data:", data);

  try {
    // Run Zod validation
    const validatedData = formSchema.safeParse(data);

    if (!validatedData.success) {
      console.error("[putvenuedata] Validation errors:", validatedData.error.errors);
      return { success: false, errors: validatedData.error.errors };
    }

    // Insert into the database
    const createdVenue = await prisma.venue.create({
      data: {
        venueName: validatedData.data.venue_name,
        venueArea: validatedData.data.venue_area,
        rating: validatedData.data.venue_rating,
        address: validatedData.data.venue_addr,
        locationUrl: validatedData.data.locationUrl,
        venueImgUrl: validatedData.data.venueImgUrl,
        userId: sesId ?? "", // Use session ID or fallback to empty string
      },
    });

    console.log("[putvenuedata] Successfully created venue:", createdVenue);
    return { success: true, data: createdVenue };
  } catch (error) {
    // Handle Prisma-specific errors
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        // Unique constraint violation
        const targetField = (error.meta?.target as string[] | undefined)?.[0]; // Safely access meta.target
        console.error("[putvenuedata] Unique constraint error on:", targetField);

        // Return a layman-friendly message for duplicate names
        if (targetField === "venueName") {
          return {
            success: false,
            error: "A venue with this name already exists. Please choose a different name.",
          };
        }

        // Generic fallback for other unique constraint violations
        return {
          success: false,
          error: `A record with the same ${targetField || "field"} already exists.`,
        };
      }
    }

    // Handle unexpected errors
    console.error("[putvenuedata] Unexpected error:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}
