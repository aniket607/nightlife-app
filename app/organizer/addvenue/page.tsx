import { auth } from "@/auth";
import { redirect } from "next/navigation";
import DynamicVenueForm from "@/components/DynamicVenueForm";

export default async function Page() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  return (
    <div className="container mx-auto">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-200 mb-6 sm:mb-8 text-center">Add New Venue</h1>
      <div className="flex items-center justify-center">
        <DynamicVenueForm />
      </div>
    </div>
  );
}