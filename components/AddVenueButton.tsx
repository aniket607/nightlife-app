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
      className="!bg-gray-600 !text-white font-bold hover:!bg-black !px-8 !py-2"
    >
      Add Venue
    </Button>
  );
}
