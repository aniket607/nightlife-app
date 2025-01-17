'use client';

import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";

export default function AddEventButton() {
  const router = useRouter();

  const handleClick = () => {
    router.push('/organizer/addvenue');
  };

  return (
    <Button 
      onClick={handleClick}
      className="!bg-gray-600 !text-white text-xs sm:text-sm font-bold hover:!bg-black !px-4 sm:!px-8 !py-1.5 sm:!py-2 rounded-full transition-colors duration-300 flex items-center gap-2"
    >
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
      Add Venue
    </Button>
  );
}
