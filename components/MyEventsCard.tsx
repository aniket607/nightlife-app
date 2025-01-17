'use client';

import Image from "next/image";
import { Event, Venue } from "@prisma/client";
import Link from "next/link";
import { useState, useEffect } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface EventWithVenue extends Event {
  venue: Venue;
}

interface MyEventsCardProps {
  pastEvents: EventWithVenue[];
  upcomingEvents: EventWithVenue[];
}

function EventCard({ event }: { event: EventWithVenue }) {
  return (
    <div className="flex flex-col sm:flex-row bg-gradient-to-r from-gray-900/90 via-gray-800/90 to-gray-900/90 rounded-lg shadow-lg w-full overflow-hidden hover:shadow-xl transition-all h-auto relative group">
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
      <div className="flex-1 flex flex-col sm:flex-row">
        {/* Event Image */}
        <div className="relative w-full sm:w-[120px] h-[200px] sm:h-auto">
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
              <h3 className="text-xl font-semibold text-gray-200">{event.eventName}</h3>
              <Link 
                href={`/organizer/venue/?id=${event.venueId}`}
                className="text-sm text-blue-400 hover:text-blue-300 transition-colors mt-1 inline-block"
              >
                @ {event.venue.venueName}
              </Link>
            </div>

            {/* Description */}
            <p className="text-sm text-gray-400 mt-2 flex-grow">
              {event.eventDescription}
            </p>

            {/* Bottom Section */}
            <div className="mt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              {/* Slots Available */}
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
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                <span className="text-sm font-medium text-gray-300">
                  {event.glCount} slots available
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 w-full sm:w-auto">
                <button 
                  className="flex-1 sm:flex-none px-6 py-2.5 rounded-lg text-sm font-semibold
                    bg-white/10 backdrop-blur-md border border-white/20
                    text-white shadow-lg
                    transition-all duration-300
                    hover:bg-white/20 hover:border-white/30 hover:scale-105 hover:shadow-white/20
                    active:scale-95 active:bg-white/25
                    disabled:opacity-50 disabled:cursor-not-allowed
                    group relative overflow-hidden"
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
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="max-w-4xl mx-auto">
      <Accordion type="single" collapsible defaultValue="upcoming" className="space-y-4">
          <AccordionItem value="past" className="border-none">
              <AccordionTrigger className="hover:no-underline group">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl font-bold bg-gradient-to-r from-gray-200 to-gray-400 bg-clip-text text-transparent group-hover:from-white group-hover:to-gray-300 transition-all">
                    PAST
                  </span>
                  <div className="h-px flex-1 bg-gradient-to-r from-gray-700 to-transparent"></div>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4 mt-4">
                  {isLoading ? (
                    Array(2).fill(0).map((_, index) => (
                      <EventCard
                        key={`past-skeleton-${index}`}
                        event={{
                          ...pastEvents[0],
                          eventId: index,
                          eventName: "Loading...",
                          eventDescription: "Loading...",
                          venue: { ...pastEvents[0]?.venue, venueName: "Loading..." }
                        }}
                      />
                    ))
                  ) : pastEvents.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-gray-400">No past events</p>
                    </div>
                  ) : (
                    pastEvents.map((event) => (
                      <EventCard key={event.eventId} event={event} />
                    ))
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="upcoming" className="border-none">
              <AccordionTrigger className="hover:no-underline group">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl font-bold bg-gradient-to-r from-gray-200 to-gray-400 bg-clip-text text-transparent group-hover:from-white group-hover:to-gray-300 transition-all">
                    UPCOMING
                  </span>
                  <div className="h-px flex-1 bg-gradient-to-r from-gray-700 to-transparent"></div>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4 mt-4">
                  {isLoading ? (
                    Array(2).fill(0).map((_, index) => (
                      <EventCard
                        key={`upcoming-skeleton-${index}`}
                        event={{
                          ...upcomingEvents[0],
                          eventId: index,
                          eventName: "Loading...",
                          eventDescription: "Loading...",
                          venue: { ...upcomingEvents[0]?.venue, venueName: "Loading..." }
                        }}
                      />
                    ))
                  ) : upcomingEvents.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-gray-400">No upcoming events</p>
                    </div>
                  ) : (
                    upcomingEvents.map((event) => (
                      <EventCard key={event.eventId} event={event} />
                    ))
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>
      </Accordion>
    </div>
  );
}
