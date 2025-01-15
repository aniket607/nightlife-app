"use client";
import { useState } from 'react';

interface SearchVenueProps {
  onSearch: (query: string) => void;
}

export function SearchVenue({ onSearch }: SearchVenueProps) {
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    onSearch(value);
    console.log('Searching for:', value);
  };

  return (
    <div className="relative w-full max-w-[200px] sm:max-w-[250px] md:max-w-[300px] lg:max-w-[320px]">
      <input
        type="text"
        placeholder="Search venues..."
        onChange={handleSearch}
        className="w-full px-3 sm:px-4 py-1.5 sm:py-2 text-sm sm:text-base
                 bg-gray-800/30 border border-gray-700/50 rounded-lg 
                 text-gray-200 placeholder-gray-400
                 focus:outline-none focus:ring-2 focus:ring-gray-600
                 transition-all duration-200"
      />
      <div className="absolute inset-y-0 right-2 sm:right-3 flex items-center pointer-events-none">
        <svg 
          className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" 
          fill="none" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth="2" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
        </svg>
      </div>
    </div>
  );
}
