"use server";
import prisma from "@/lib/prisma"; // Adjust to your project structure

// Define types for the guestlists
type StagGuest = {
  type: 'stag';
  glId: number;
  guestName: string;
  guestAge: number;
  guestMobile: string;
  guestEmail: string;
  eventId: number;
};

type CoupleGuest = {
  type: 'couple';
  glId: number;
  maleName: string;
  femaleName: string;
  maleAge: number;
  femaleAge: number;
  maleMobile: string;
  femaleMobile: string;
  maleEmail: string;
  femaleEmail: string | null;
  eventId: number;
};

type CombinedGuestlist = StagGuest | CoupleGuest;

export async function fetchGuestlist(eventId: number) {
  try {
    // Fetch both stag and couple guestlists in parallel
    const [stagGuests, coupleGuests] = await Promise.all([
      prisma.stagGuestlist.findMany({
        where: { eventId },
      }),
      prisma.coupleGuestlist.findMany({
        where: { eventId },
      }),
    ]);

    // Transform and combine the results
    const formattedStagGuests: StagGuest[] = stagGuests.map(guest => ({
      type: 'stag',
      ...guest
    }));

    const formattedCoupleGuests: CoupleGuest[] = coupleGuests.map(guest => ({
      type: 'couple',
      ...guest
    }));

    // Combine both lists
    const combinedGuestlist: CombinedGuestlist[] = [
      ...formattedStagGuests,
      ...formattedCoupleGuests
    ];

    return {
      success: true,
      data: {
        stagGuests: formattedStagGuests,
        coupleGuests: formattedCoupleGuests,
        combined: combinedGuestlist
      }
    };

  } catch (error) {
    console.error("[fetchGuestlist] Error fetching guestlist:", error);
    return {
      success: false,
      error: "Failed to fetch guestlist data",
      data: {
        stagGuests: [],
        coupleGuests: [],
        combined: []
      }
    };
  }
}
