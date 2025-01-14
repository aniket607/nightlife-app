"use client";

import Image from "next/image";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import EventCardSkeleton from "./EventCardSkeleton";
import AddEventButton from "./AddEventButton";
import { useState, useEffect } from "react";

interface Event {
  eventId: number; // Assuming `Int` maps to `number`
  eventName: string;
  eventDescription?: string | null; // Optional field
  eventDate: Date; // Maps to `DateTime`
  eventTime: Date; // Keep as Date since it comes from database as Date
  glCount: number;
  eventImgUrl?: string | null; // Optional field
  venueId: string;
  userId: string;
  createdAt: Date; // Maps to `DateTime`
}

interface VenuePageRightSectionProps {
  upcomingEvents: Event[];
  pastEvents: Event[];
  venueId: string;
}

export default function VenuePageRightSection({
  upcomingEvents,
  pastEvents,
  venueId,
}: VenuePageRightSectionProps) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Set loading to false after a short delay to prevent flash
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="w-full bg-transparent">
      <div className="flex w-full mb-4 sm:mb-6 justify-between items-center p-4 sm:p-6">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-gray-200">
          Events
        </h2>
        <AddEventButton venueId={venueId} />
      </div>

      <div className="px-2 sm:px-4 md:px-6 space-y-4 sm:space-y-6">
        {/* Past Events */}
        <Accordion type="single" collapsible className="bg-gray-800/50 rounded-lg px-4">
          <AccordionItem value="item-1" className="border-gray-700">
            <AccordionTrigger className="hover:no-underline group/title">
              <div className="flex items-center space-x-3">
                <span className="text-2xl font-bold bg-gradient-to-r from-gray-200 to-gray-400 bg-clip-text text-transparent group-hover/title:from-white group-hover/title:to-gray-300 transition-all">
                  PAST
                </span>
                <div className="h-px flex-1 bg-gradient-to-r from-gray-700 to-transparent"></div>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="grid grid-cols-1 gap-4">
                {isLoading ? (
                  // Show 2 skeleton cards while loading
                  Array(2)
                    .fill(0)
                    .map((_, index) => <EventCardSkeleton key={index} />)
                ) : pastEvents.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-400">No past events</p>
                  </div>
                ) : (
                  pastEvents.map((event: Event) => (
                    <div
                      key={event?.eventId}
                      className="flex flex-col sm:flex-row bg-gradient-to-r from-gray-900/90 via-gray-800/90 to-gray-900/90 rounded-lg shadow-lg w-full overflow-hidden hover:shadow-xl transition-all sm:h-[200px] relative group"
                    >
                      {/* Decorative Pattern */}
                      <div
                        className="absolute inset-0 opacity-5 pointer-events-none"
                        style={{
                          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                        }}
                      ></div>

                      {/* Date and Time Section */}
                      <div className="flex flex-row sm:flex-col items-center justify-between sm:justify-center p-4 sm:min-w-[100px] border-b sm:border-b-0 sm:border-r border-gray-700/50 bg-gray-900/50 relative z-10 backdrop-blur-sm">
                        <div className="flex items-center sm:flex-col sm:items-center">
                          <span className="text-gray-400 text-sm font-medium uppercase mr-2 sm:mr-0">
                            {new Date(event.eventDate).toLocaleDateString(
                              "en-US",
                              {
                                month: "short",
                              }
                            )}
                          </span>
                          <span className="text-gray-200 text-2xl sm:text-3xl font-bold sm:mt-1">
                            {new Date(event.eventDate).getDate()}
                          </span>
                        </div>
                        <span className="text-gray-400 text-base sm:text-lg font-medium sm:mt-2">
                          {(() => {
                            const hours = event.eventTime.getUTCHours();
                            const minutes =
                              event.eventTime.getUTCMinutes().toString().padStart(
                                2,
                                "0"
                              );
                            const amPm = hours >= 12 ? "PM" : "AM";
                            const hours12 = hours % 12 || 12;
                            return `${hours12}:${minutes} ${amPm}`;
                          })()}
                        </span>
                      </div>

                      {/* Content Section */}
                      <div className="flex sm:flex-row flex-1">
                        {/* Mobile: Side by side layout */}
                        <div className="flex flex-row sm:hidden flex-1">
                          {/* Event Image */}
                          <div className="relative w-1/3 aspect-[3/4]">
                            <Image
                              src={event?.eventImgUrl || "/placeholder-image.jpg"}
                              alt={event.eventName || "Event Image"}
                              fill
                              className="object-cover"
                              sizes="(max-width: 640px) 33vw, 120px"
                            />
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-gray-900/10"></div>
                          </div>

                          {/* Event Info */}
                          <div className="flex flex-col p-4 flex-1">
                            <h3 className="text-lg font-semibold text-gray-200 truncate">
                              {event.eventName}
                            </h3>
                            <p className="text-sm text-gray-400 mt-2 line-clamp-3">
                              {event.eventDescription}
                            </p>
                            <div className="mt-auto pt-2">
                              <div className="inline-flex items-center px-2.5 py-1 rounded-full bg-gray-700/50 border border-gray-600/50 backdrop-blur-sm">
                                <svg
                                  className="w-4 h-4 mr-1.5 text-gray-400"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                  xmlns="http://www.w3.org/2000/svg"
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
                            </div>
                          </div>
                        </div>

                        {/* Desktop: Original layout */}
                        <div className="hidden sm:flex sm:flex-row flex-1">
                          {/* Event Image */}
                          <div className="relative w-[120px] h-full">
                            <Image
                              src={event?.eventImgUrl || "/placeholder-image.jpg"}
                              alt={event.eventName || "Event Image"}
                              fill
                              className="object-cover"
                              sizes="120px"
                            />
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-gray-900/10"></div>
                          </div>

                          {/* Event Info */}
                          <div className="flex flex-col p-4 flex-1">
                            <h3 className="text-xl font-semibold text-gray-200 truncate">
                              {event.eventName}
                            </h3>
                            <p className="text-sm text-gray-400 mt-2 line-clamp-4">
                              {event.eventDescription}
                            </p>
                            <div className="mt-auto pt-2">
                              <div className="inline-flex items-center px-2.5 py-1 rounded-full bg-gray-700/50 border border-gray-600/50 backdrop-blur-sm">
                                <svg
                                  className="w-4 h-4 mr-1.5 text-gray-400"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                  xmlns="http://www.w3.org/2000/svg"
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
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        {/* Upcoming Events */}
        <Accordion
          type="single"
          collapsible
          defaultValue="item-1"
          className="bg-gray-800/50 rounded-lg px-4 mb-6"
        >
          <AccordionItem value="item-1" className="border-gray-700">
            <AccordionTrigger className="hover:no-underline group/title">
              <div className="flex items-center space-x-3">
                <span className="text-2xl font-bold bg-gradient-to-r from-gray-200 to-gray-400 bg-clip-text text-transparent group-hover/title:from-white group-hover/title:to-gray-300 transition-all">
                  UPCOMING
                </span>
                <div className="h-px flex-1 bg-gradient-to-r from-gray-700 to-transparent"></div>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="grid grid-cols-1 gap-4">
                {isLoading ? (
                  // Show 2 skeleton cards while loading
                  Array(2)
                    .fill(0)
                    .map((_, index) => <EventCardSkeleton key={index} />)
                ) : upcomingEvents.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-400">No upcoming events</p>
                    <div className="mt-4">
                      <AddEventButton venueId={venueId} />
                    </div>
                  </div>
                ) : (
                  upcomingEvents.map((event: Event) => (
                    <div
                      key={event?.eventId}
                      className="flex flex-col sm:flex-row bg-gradient-to-r from-gray-900/90 via-gray-800/90 to-gray-900/90 rounded-lg shadow-lg w-full overflow-hidden hover:shadow-xl transition-all sm:h-[200px] relative group"
                    >
                      {/* Decorative Pattern */}
                      <div
                        className="absolute inset-0 opacity-5 pointer-events-none"
                        style={{
                          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                        }}
                      ></div>

                      {/* Date and Time Section */}
                      <div className="flex flex-row sm:flex-col items-center justify-between sm:justify-center p-4 sm:min-w-[100px] border-b sm:border-b-0 sm:border-r border-gray-700/50 bg-gray-900/50 relative z-10 backdrop-blur-sm">
                        <div className="flex items-center sm:flex-col sm:items-center">
                          <span className="text-gray-400 text-sm font-medium uppercase mr-2 sm:mr-0">
                            {new Date(event.eventDate).toLocaleDateString(
                              "en-US",
                              {
                                month: "short",
                              }
                            )}
                          </span>
                          <span className="text-gray-200 text-2xl sm:text-3xl font-bold sm:mt-1">
                            {new Date(event.eventDate).getDate()}
                          </span>
                        </div>
                        <span className="text-gray-400 text-base sm:text-lg font-medium sm:mt-2">
                          {(() => {
                            const hours = event.eventTime.getUTCHours();
                            const minutes =
                              event.eventTime.getUTCMinutes().toString().padStart(
                                2,
                                "0"
                              );
                            const amPm = hours >= 12 ? "PM" : "AM";
                            const hours12 = hours % 12 || 12;
                            return `${hours12}:${minutes} ${amPm}`;
                          })()}
                        </span>
                      </div>

                      {/* Content Section */}
                      <div className="flex sm:flex-row flex-1">
                        {/* Mobile: Side by side layout */}
                        <div className="flex flex-row sm:hidden flex-1">
                          {/* Event Image */}
                          <div className="relative w-1/3 aspect-[3/4]">
                            <Image
                              src={event?.eventImgUrl || "/placeholder-image.jpg"}
                              alt={event.eventName || "Event Image"}
                              fill
                              className="object-cover"
                              sizes="(max-width: 640px) 33vw, 120px"
                            />
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-gray-900/10"></div>
                          </div>

                          {/* Event Info */}
                          <div className="flex flex-col p-4 flex-1">
                            <h3 className="text-lg font-semibold text-gray-200 truncate">
                              {event.eventName}
                            </h3>
                            <p className="text-sm text-gray-400 mt-2 line-clamp-3">
                              {event.eventDescription}
                            </p>
                            <div className="mt-auto pt-2">
                              <div className="inline-flex items-center px-2.5 py-1 rounded-full bg-gray-700/50 border border-gray-600/50 backdrop-blur-sm">
                                <svg
                                  className="w-4 h-4 mr-1.5 text-gray-400"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                  xmlns="http://www.w3.org/2000/svg"
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
                            </div>
                          </div>
                        </div>

                        {/* Desktop: Original layout */}
                        <div className="hidden sm:flex sm:flex-row flex-1">
                          {/* Event Image */}
                          <div className="relative w-[120px] h-full">
                            <Image
                              src={event?.eventImgUrl || "/placeholder-image.jpg"}
                              alt={event.eventName || "Event Image"}
                              fill
                              className="object-cover"
                              sizes="120px"
                            />
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-gray-900/10"></div>
                          </div>

                          {/* Event Info */}
                          <div className="flex flex-col p-4 flex-1">
                            <h3 className="text-xl font-semibold text-gray-200 truncate">
                              {event.eventName}
                            </h3>
                            <p className="text-sm text-gray-400 mt-2 line-clamp-4">
                              {event.eventDescription}
                            </p>
                            <div className="mt-auto pt-2">
                              <div className="inline-flex items-center px-2.5 py-1 rounded-full bg-gray-700/50 border border-gray-600/50 backdrop-blur-sm">
                                <svg
                                  className="w-4 h-4 mr-1.5 text-gray-400"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                  xmlns="http://www.w3.org/2000/svg"
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
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
}
