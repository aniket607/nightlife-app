import React from 'react';

export default function EventCardSkeleton() {
  return (
    <div className="flex flex-col sm:flex-row bg-gradient-to-r from-gray-900/90 via-gray-800/90 to-gray-900/90 rounded-lg shadow-lg w-full overflow-hidden sm:h-[200px] relative animate-pulse">
      {/* Date and Time Section Skeleton */}
      <div className="flex flex-row sm:flex-col items-center justify-between sm:justify-center p-4 sm:min-w-[100px] border-b sm:border-b-0 sm:border-r border-gray-700/50 bg-gray-900/50">
        <div className="flex items-center sm:flex-col sm:items-center">
          <div className="h-4 w-12 bg-gray-700 rounded mr-2 sm:mr-0"></div>
          <div className="h-8 w-8 bg-gray-700 rounded sm:mt-1"></div>
        </div>
        <div className="h-4 w-16 bg-gray-700 rounded sm:mt-2"></div>
      </div>

      {/* Content Section */}
      <div className="flex sm:flex-row flex-1">
        {/* Mobile: Side by side layout */}
        <div className="flex flex-row sm:hidden flex-1">
          {/* Event Image Skeleton */}
          <div className="relative w-1/3 aspect-[3/4] bg-gray-700"></div>

          {/* Event Info Skeleton */}
          <div className="flex flex-col p-4 flex-1 space-y-4">
            <div className="h-6 bg-gray-700 rounded w-3/4"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-700 rounded w-full"></div>
              <div className="h-4 bg-gray-700 rounded w-5/6"></div>
              <div className="h-4 bg-gray-700 rounded w-4/6"></div>
            </div>
            <div className="mt-auto">
              <div className="h-8 bg-gray-700 rounded w-32"></div>
            </div>
          </div>
        </div>

        {/* Desktop: Original layout */}
        <div className="hidden sm:flex sm:flex-row flex-1">
          {/* Event Image Skeleton */}
          <div className="relative w-[120px] h-full bg-gray-700"></div>

          {/* Event Info Skeleton */}
          <div className="flex flex-col p-4 flex-1 space-y-4">
            <div className="h-7 bg-gray-700 rounded w-3/4"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-700 rounded w-full"></div>
              <div className="h-4 bg-gray-700 rounded w-5/6"></div>
              <div className="h-4 bg-gray-700 rounded w-4/6"></div>
              <div className="h-4 bg-gray-700 rounded w-3/6"></div>
            </div>
            <div className="mt-auto">
              <div className="h-8 bg-gray-700 rounded w-32"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
