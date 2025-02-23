'use client';

import Image from "next/image";
import { Event, Venue } from "@prisma/client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import EventCardSkeleton from "./EventCardSkeleton";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import parse from "html-react-parser";
import { FaRegCopy } from "react-icons/fa";


interface EventWithVenue extends Event {
  venue: Venue;
}

interface MyEventsCardProps {
  pastEvents: EventWithVenue[];
  upcomingEvents: EventWithVenue[];
}

function EventCard({ event, isPast }: { event: EventWithVenue, isPast?: boolean }) {
  const router = useRouter();

  const domain = "https://nightlife-two.vercel.app/events"
  const cleanEventName = event.eventName.replace(/\s+/g, '')
  const eventString = `${domain}/${event.eventId}-${cleanEventName}`

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(eventString);
      // toast.success("Success!")
    } catch (error) {
    }
  };
  
  return (
    <div className="flex flex-col md:flex-row bg-gradient-to-r from-gray-900/90 via-gray-800/90 to-gray-900/90 rounded-3xl shadow-lg w-full overflow-clip hover:shadow-xl transition-all h-auto relative group">
      {/* Date and Time Section */}
      <div className="flex flex-row sm:flex-col items-center justify-between sm:justify-center p-4 sm:min-w-[100px] border-b sm:border-b-0 sm:border-r border-gray-700/50 bg-gray-900/50 relative z-10 backdrop-blur-sm">
        <div className="flex items-center sm:flex-col sm:items-center">
          <span className="text-gray-400 text-sm font-medium uppercase mr-2 sm:mr-0">
            {new Date(event.eventDate).toLocaleDateString("en-US", {
              month: "short",
            })}
          </span>
          <span className="text-gray-200 text-2xl sm:text-3xl font-bold sm:mt-1">
            {new Date(event.eventDate).getDate()}
          </span>
        </div>
        <span className="text-gray-400 text-base sm:text-lg font-medium sm:mt-2">
          {(() => {
            const hours = event.eventTime.getUTCHours();
            const minutes = event.eventTime.getUTCMinutes().toString().padStart(2, "0");
            const amPm = hours >= 12 ? "PM" : "AM";
            const hours12 = hours % 12 || 12;
            return `${hours12}:${minutes} ${amPm}`;
          })()}
        </span>
      </div>

      {/* Content Section */}
      <div className="flex-1 flex flex-col md:flex-row">
        {/* Event Image */}
        <div className="relative w-40 md:w-[120px] h-[250px] md:h-auto">
          <Image
            src={event?.eventImgUrl || "/placeholder-image.jpg"}
            alt={event.eventName}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 120px"
          />
        </div>

        {/* Event Details */}
        <div className="flex-1 p-4">
          <div className="flex flex-col h-full">
            {/* Event and Venue Names */}
            <div>
              <div className="flex items-center flex-col md:flex-row gap-3">
                <h3 className="text-xl font-semibold text-gray-200">{event.eventName}</h3>
                <span className="px-2.5 py-1 text-xs font-medium rounded-full 
                  bg-gray-800/80 border border-gray-700/50 text-gray-300 
                  backdrop-blur-sm
                  transition-all duration-300
                  hover:bg-gray-700/80 hover:border-gray-600/50 
                  hover:text-gray-200 hover:scale-105 
                  hover:shadow-md hover:shadow-gray-900/50
                  group-hover:border-gray-500/50">
                  {event.eventType}
                </span>
              </div>
              <Link 
                href={`/organizer/venue/?id=${event.venueId}`}
                className="text-sm text-blue-400 hover:text-blue-300 transition-colors mt-1 inline-block"
              >
                @ {event.venue.venueName}
              </Link>
            </div>

            {/* Description */}
            <div className="text-sm text-gray-400 mt-2 flex-grow prose prose-invert max-w-none
              prose-ul:list-disc prose-ul:pl-5 prose-ul:mt-0 prose-ul:mb-0
              prose-ol:list-decimal prose-ol:pl-5 prose-ol:mt-0 prose-ol:mb-0
              prose-li:mt-0 prose-li:mb-0
              prose-p:mt-0 prose-p:mb-0">
              {parse(event?.eventDescription??"")}
            </div>

            {/* Bottom Section */}
            <div className="mt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              {/* Slots Available - Now with both stag and couple */}
              <div className="flex gap-2">
                <div className="inline-flex items-center px-2.5 py-1 rounded-full bg-gray-700/50 border border-gray-600/50">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                  <span className="text-sm font-medium text-gray-300">
                    {event.stagGlCount} stag
                  </span>
                </div>

                {event.coupleGlCount !== null && (
                  <div className="inline-flex items-center px-2.5 py-1 rounded-full bg-gray-700/50 border border-gray-600/50">
                    <svg
                      className="w-4 h-4 mr-1.5 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                      />
                    </svg>
                    <span className="text-sm font-medium text-gray-300">
                      {event.coupleGlCount} couple
                    </span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 w-full sm:w-auto">
                <button
                onClick={handleCopy}
                className="flex-1 sm:flex-none px-6 py-2.5 rounded-lg text-sm font-semibold
                bg-white/10 backdrop-blur-md border border-white/20
                text-white shadow-lg
                transition-all duration-300
                hover:bg-white/20 hover:border-white/30 hover:scale-105 hover:shadow-white/20
                active:scale-95 active:bg-white/25 group relative overflow-hidden"
                >
                  <FaRegCopy/>
                </button>
                <button 
                  disabled={isPast}
                  className="flex-1 sm:flex-none px-6 py-2.5 rounded-lg text-sm font-semibold
                    bg-white/10 backdrop-blur-md border border-white/20
                    text-white shadow-lg
                    transition-all duration-300
                    hover:bg-white/20 hover:border-white/30 hover:scale-105 hover:shadow-white/20
                    active:scale-95 active:bg-white/25
                    disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:bg-white/10
                    group relative overflow-hidden"
                  onClick={() => router.push(`/organizer/myevents/editevent?eventId=${event.eventId}`)}
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    <svg 
                      className="w-4 h-4 transition-transform group-hover:rotate-12" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                    Edit Event
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/5 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
                <button 
                  className="flex-1 sm:flex-none px-6 py-2.5 rounded-lg text-sm font-semibold
                    bg-black/30 backdrop-blur-md border border-white/10
                    text-white shadow-lg
                    transition-all duration-300
                    hover:bg-black/40 hover:border-white/20 hover:scale-105 hover:shadow-purple-500/20
                    active:scale-95 active:bg-black/50
                    disabled:opacity-50 disabled:cursor-not-allowed
                    group relative overflow-hidden"
                  onClick={() => router.push(`/organizer/myevents/guestlist?eventId=${event.eventId}`)}
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    <svg 
                      className="w-4 h-4 transition-transform group-hover:-translate-y-0.5" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                    View Guestlist
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500/0 via-purple-500/5 to-purple-500/0 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function MyEventsCard({ pastEvents, upcomingEvents }: MyEventsCardProps) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="max-w-4xl mx-auto">
      <Accordion type="single" collapsible defaultValue="upcoming" className="space-y-4">
        <AccordionItem value="past" className="border-none">
          <AccordionTrigger className="flex items-center justify-between p-4 bg-gradient-to-r from-slate-900/40 via-zinc-900/40 to-slate-900/50 text-white rounded-lg shadow-lg backdrop-blur-md transition-transform transform hover:scale-105">
            <span className="text-lg font-bold">PAST</span>
          </AccordionTrigger>
          <AccordionContent className="p-2 md:p-4 bg-gradient-to-br from-slate-950/40 via-zinc-900/40 to-slate-950/40 backdrop-blur-md rounded-lg shadow-md">
            <div className="space-y-4 mt-4">
              {isLoading ? (
                Array(2).fill(0).map((_, index) => (
                  <EventCardSkeleton key={`past-skeleton-${index}`} />
                ))
              ) : pastEvents.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-400">No past events</p>
                </div>
              ) : (
                pastEvents.map((event) => (
                  <EventCard key={event.eventId} event={event} isPast={true} />
                ))
              )}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="upcoming" className="border-none">
          <AccordionTrigger className="flex items-center justify-between p-4 bg-gradient-to-r from-slate-900/40 via-zinc-900/40 to-slate-900/50 text-white rounded-lg shadow-lg backdrop-blur-md transition-transform transform hover:scale-105">
            <span className="text-lg font-bold">UPCOMING</span>
          </AccordionTrigger>
          <AccordionContent className="p-4 bg-gradient-to-br from-slate-950/30 via-zinc-900/30 to-slate-950/30 backdrop-blur-md rounded-lg shadow-md">
            <div className="space-y-4 mt-4">
              {isLoading ? (
                Array(2).fill(0).map((_, index) => (
                  <EventCardSkeleton key={`upcoming-skeleton-${index}`} />
                ))
              ) : upcomingEvents.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-400">No upcoming events</p>
                </div>
              ) : (
                upcomingEvents.map((event) => (
                  <EventCard key={event.eventId} event={event} isPast={false} />
                ))
              )}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
