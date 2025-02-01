'use client';

import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { useState } from 'react';

export default function AddEventButton() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = () => {
    setIsLoading(true);
    router.push('/organizer/addvenue');
  };

  return (
    <Button 
      onClick={handleClick}
      disabled={isLoading}
      className="!bg-gray-600 !text-white text-xs sm:text-sm font-bold hover:!bg-black !px-4 sm:!px-8 !py-1.5 sm:!py-2 rounded-full transition-colors duration-300 flex items-center gap-2"
    >
      {isLoading ? (
        <svg className="animate-spin h-4 w-4 sm:h-5 sm:w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      ) : (
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-4 w-4 sm:h-5 sm:w-5" 
          viewBox="0 0 20 20" 
          fill="currentColor"
        >
          <path 
            fillRule="evenodd" 
            d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" 
            clipRule="evenodd" 
          />
        </svg>
      )}
      {isLoading ? 'Loading...' : 'Add Venue'}
    </Button>
  );
}
