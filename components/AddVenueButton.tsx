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
      className="!bg-purple-600 !text-white font-bold hover:bg-purple-700 !px-8"
    >
      Add Venue
    </Button>
  );
}
