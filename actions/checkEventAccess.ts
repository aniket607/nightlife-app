"use server"
import client from "@/lib/prisma";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export async function checkEventAccess(eventId: number):Promise<boolean> {
  const session = await auth();
  const sesId = session?.user?.id;

  // Ensure the user is logged in and we have a valid sesId
  if (!sesId) {
    redirect("/organizer") 
  }

  try {
    const event = await client.event.findUnique({
      where: {
        eventId: eventId,
      },
      select: {
        userId: true
      }
    });

    if (!event) {
      console.error("[checkEventAccess] Event not found:", eventId);
      return false;
    }

    // Check if the event's userId matches the session user's id
    return event.userId === sesId;
    
  } catch (error) {
    console.error("[checkEventAccess] Error checking event access:", error);
    return false;
  }
}
