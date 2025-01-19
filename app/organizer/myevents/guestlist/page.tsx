"use client";
import { fetchGuestlist } from '@/actions/fetchGuestlist';
import GuestListTable from '@/components/GuestListTable';
import React, { useState, useEffect, Suspense } from 'react';
import { checkEventAccess } from '@/actions/checkEventAccess';
import { useSearchParams } from 'next/navigation';

type GuestlistType = 'stag' | 'couple';

interface StagGuest {
  type: 'stag';
  glId: number;
  guestName: string;
  guestAge: number;
  guestMobile: string;
  guestEmail: string;
  eventId: number;
}

interface CoupleGuest {
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
}

// Create a separate component for the main content
function GuestListContent() {
  const searchParams = useSearchParams();
  const eventId = searchParams.get('eventId');
  
  const [activeList, setActiveList] = useState<GuestlistType>('stag');
  const [guestlistData, setGuestlistData] = useState<{
    stagGuests: StagGuest[];
    coupleGuests: CoupleGuest[];
    combined: (StagGuest | CoupleGuest)[];
  }>({ stagGuests: [], coupleGuests: [], combined: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadGuestlist = async () => {
      if (!eventId) {
        setError("Event ID is required");
        setIsLoading(false);
        return;
      }

      const parsedEventId = parseInt(eventId, 10);
      if (isNaN(parsedEventId)) {
        setError("Invalid event ID");
        setIsLoading(false);
        return;
      }

      try {
        const hasAccess = await checkEventAccess(parsedEventId);
        if (!hasAccess) {
          setError("You don't have access to this event");
          setIsLoading(false);
          return;
        }

        const result = await fetchGuestlist(parsedEventId);
        if (result.success) {
          setGuestlistData(result.data);
        } else {
          setError(result.error || "Failed to fetch guestlist");
        }
      } catch (error) {
        console.error('Error fetching guestlist:', error);
        setError("An error occurred while fetching the guestlist");
      } finally {
        setIsLoading(false);
      }
    };

    loadGuestlist();
  }, [eventId]);

  if (isLoading) {
    return (
      <div className="container mx-auto p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <div className="text-center p-4 bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700">
          <p className="text-gray-200">{error}</p>
        </div>
      </div>
    );
  }

  const hasStagGuests = guestlistData.stagGuests.length > 0;
  const hasCoupleGuests = guestlistData.coupleGuests.length > 0;
  const hasNoGuests = !hasStagGuests && !hasCoupleGuests;

  return (
    <div className="container mx-auto p-4">
      {!hasNoGuests && (
        <div className="flex justify-center mb-6">
          <div className="inline-flex rounded-3xl border border-gray-700 p-1 bg-gray-800/50 backdrop-blur-sm">
            <button
              onClick={() => setActiveList('stag')}
              className={`px-4 py-2 rounded-2xl text-sm font-medium transition-all duration-200 ${
                activeList === 'stag'
                  ? 'bg-gray-700 text-white shadow-lg'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              Stag Guestlist {hasStagGuests && `(${guestlistData.stagGuests.length})`}
            </button>
            <button
              onClick={() => setActiveList('couple')}
              className={`px-4 py-2 rounded-2xl text-sm font-medium transition-all duration-200 ${
                activeList === 'couple'
                  ? 'bg-gray-700 text-white shadow-lg'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              Couple Guestlist {hasCoupleGuests && `(${guestlistData.coupleGuests.length})`}
            </button>
          </div>
        </div>
      )}

      {hasNoGuests ? (
        <div className="text-center p-4 bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700">
          <p className="text-gray-400">No guests in guestlist</p>
        </div>
      ) : (
        <GuestListTable 
          stagGuests={guestlistData.stagGuests}
          coupleGuests={guestlistData.coupleGuests}
          activeList={activeList}
        />
      )}
    </div>
  );
}

// Main page component with Suspense
export default function Page() {
  return (
    <Suspense fallback={
      <div className="container mx-auto p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto"></div>
        </div>
      </div>
    }>
      <GuestListContent />
    </Suspense>
  );
}
