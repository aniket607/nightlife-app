import { auth } from "@/auth";
import { redirect } from "next/navigation";
import VenueFormSection from "@/components/VenueFormSection";

export default async function Page() {
  const session = await auth();
  if (!session?.user) {
    redirect("/organizer/login");
  }

  return (
    <div className="min-h-screen w-full bg-primary">
      <div className="container mx-auto h-screen flex items-center justify-center overflow-x-hidden">
        <VenueFormSection />
      </div>
    </div>

  );
}
