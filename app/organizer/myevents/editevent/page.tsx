// "use client"
// import UpdateEventForm from '@/components/UpdateEventForm'
// import { useSearchParams } from 'next/navigation';
// import { fetchEventById } from "@/actions/fetchEventById";

// export default function page() {

//   const [searchParams] = useSearchParams();
//   const eventId = searchParams.get("eventId");

//   return (
//     <div>
//         <UpdateEventForm />
//     </div>
//   )
// }

// src/app/organizer/myevents/editevent/page.tsx
'use client'

import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import UpdateEventForm from '@/components/UpdateEventForm';
import { fetchEventById } from "@/actions/fetchEventById";

interface Event {
  eventId: number; // Assuming `Int` maps to `number`
  eventName: string;
  eventDescription?: string | null; // Optional field
  eventDate: Date; // Maps to `DateTime`
  eventTime: Date; // `DateTime @db.Time` also maps to `Date`
  stagGlCount: number;
  coupleGl: boolean;
  coupleGlCount: number | null;
  eventImgUrl?: string | null; // Optional field
  venueId: string;
  eventType: string;
  userId: string;
  createdAt: Date; // Maps to `DateTime`
}

const EditEventPage = () => {

  const [userId,setUserId] = useState<string | undefined>("")

    const checkAuth = async() =>{
      const session = await auth();
    if (!session?.user) {
      redirect("/login");
    }
    else return session?.user?.id ?? ""
    }

    useEffect(() => {
      const fetchUserId = async () => {
          const id = await checkAuth(); // Wait for the promise to resolve
          setUserId(id); // Set the resolved user ID
      };

      fetchUserId(); // Call the async function
  }, []);


    const searchParams = useSearchParams();
    const eventId = searchParams.get("eventId");
    
    const [eventData, setEventData] = useState<Event | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        if (eventId) {
            const fetchData = async () => {
                try {
                    const data = await fetchEventById(Number(eventId));
                    setEventData(data);
                } catch (err) {
                    setError(true)
                } finally {
                    setLoading(false);
                }
            };

            fetchData();
        }
    }, [eventId]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error loading event data: {error}</div>;

    return (
        <UpdateEventForm eventData={eventData}/>
    );
};

export default EditEventPage;
