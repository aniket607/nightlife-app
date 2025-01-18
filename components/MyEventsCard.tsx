"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import EventCardSkeleton from "./EventCardSkeleton";

export interface Event {
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

interface MyEventsCardProps {
  upcomingEvents: Event[];
  pastEvents: Event[];
}

export default function MyEventsCard({
  pastEvents,
  upcomingEvents,
}: MyEventsCardProps) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Set loading to false after a short delay to prevent flash
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  console.log(pastEvents);
  console.log(upcomingEvents);

  return (
    <div>
      <Accordion
        type="single"
        collapsible
        className="bg-gray-800/50 rounded-lg px-4"
      >
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
              ) : pastEvents?.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-400">No past events</p>
                </div>
              ) : (
                pastEvents?.map((event: Event) => (
                  <div
                    key={event?.eventId}
                    className="flex flex-col sm:flex-row bg-gradient-to-r from-gray-900/90 via-gray-800/90 to-gray-900/90 rounded-lg shadow-lg w-full overflow-hidden hover:shadow-xl transition-all h-auto relative group"
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
                          const minutes = event.eventTime
                            .getUTCMinutes()
                            .toString()
                            .padStart(2, "0");
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
                        <div className="relative w-1/3 aspect-[3/4] bg-gradient-to-br from-gray-800/80 via-gray-900/90 to-black before:absolute before:inset-0 before:bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent_70%)] before:opacity-50">
                          <Image
                            src={event?.eventImgUrl || "/placeholder-image.jpg"}
                            alt={event.eventName}
                            fill
                            sizes="(max-width: 768px) 33vw"
                            className="object-cover transition-opacity duration-300"
                            placeholder="blur"
                            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDABQODxIPDRQSEBIXFRQdHx4eHRoaHSQtJSEkMjU1LC0yMi4xODY6Ojo4MS89PUFGRlJSUjI+SVlOUENOQ0pJUlL/2wBDAR0XFx0aHR4eHRoaHSQtJSEkMjU1LC0yMi4xODY6Ojo4MS89PUFGRlJSUjI+SVlOUENOQ0pJUlJSUlJSUlJSUlL/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAb/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
                            loading="lazy"
                          />
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
                            <div className="flex mt-2">
                              <button className="!bg-gray-600 !text-white text-xs sm:text-sm font-semibold hover:!bg-black !px-4 sm:!px-8 !py-1.5 sm:!py-2 rounded-md transition-colors duration-300 flex items-center gap-2 mr-5">
                                Edit
                              </button>
                              <button className="!bg-gray-600 !text-white text-xs sm:text-sm font-semibold hover:!bg-black !px-4 sm:!px-8 !py-1.5 sm:!py-2 rounded-md transition-colors duration-300 flex items-center gap-2">
                                Guestlist
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Desktop: Original layout */}
                      <div className="hidden sm:flex sm:flex-row flex-1">
                        {/* Event Image */}
                        <div className="relative w-[120px] h-full bg-gradient-to-br from-gray-800/80 via-gray-900/90 to-black before:absolute before:inset-0 before:bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent_70%)] before:opacity-50">
                          <Image
                            src={event?.eventImgUrl || "/placeholder-image.jpg"}
                            alt={event.eventName}
                            fill
                            sizes="120px"
                            className="object-cover transition-opacity duration-300"
                            placeholder="blur"
                            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDABQODxIPDRQSEBIXFRQdHx4eHRoaHSQtJSEkMjU1LC0yMi4xODY6Ojo4MS89PUFGRlJSUjI+SVlOUENOQ0pJUlL/2wBDAR0XFx0aHR4eHRoaHSQtJSEkMjU1LC0yMi4xODY6Ojo4MS89PUFGRlJSUjI+SVlOUENOQ0pJUlJSUlJSUlJSUlL/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAb/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
                            loading="lazy"
                          />
                        </div>

                        {/* Event Info */}
                        <div className="flex flex-col p-4 flex-1">
                          <h3 className="text-xl font-semibold text-gray-200 truncate">
                            {event.eventName}
                          </h3>
                          <p className="text-sm text-gray-400 mt-2 line-clamp-4">
                            {event.eventDescription}
                          </p>
                          <div className="mt-auto pt-2 flex justify-between">
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
                            <button className="!bg-gray-600 !text-white text-xs sm:text-sm font-semibold hover:!bg-black !px-4 sm:!px-8 !py-1.5 sm:!py-2 rounded-md transition-colors duration-300 flex items-center gap-2">
                              Edit
                            </button>
                            <button className="!bg-gray-600 !text-white text-xs sm:text-sm font-semibold hover:!bg-black !px-4 sm:!px-8 !py-1.5 sm:!py-2 rounded-md transition-colors duration-300 flex items-center gap-2">
                              Guestlist
                            </button>
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
  );
}