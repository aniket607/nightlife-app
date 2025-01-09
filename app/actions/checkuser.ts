"use server"
import client from "@/lib/prisma";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export async function checkUser() {
  const session = await auth();
  const sesId = session?.user?.id;

  // Ensure the user is logged in and we have a valid sesId
  if (!sesId) {
    redirect("/organizer") // or throw an error/redirect as needed
  }

  const response = await client.user.findUnique({
    where: { id: sesId },
    select: {
      access: true,
    },
  });
  return response?.access;
}
