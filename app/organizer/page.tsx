import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import SignoutButton from "@/components/signout-button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import UploadForm from "@/components/UploadForm";
import { checkUser } from "../actions/checkuser";

export default async function Page() {
  const session = await auth();
  if (!session?.user) {
    redirect("/organizer/login");
  }
  
  const userId = session.user.id;
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { image: true, email: true },
  });
  
  const imageUrl = user?.image ?? undefined;
  const checkaccess = await checkUser();

  return (
    <div className="container">
      <div className="flex justify-between">
        <div>Organizer Dashboard</div>
        <div>
          <Avatar>
            <AvatarImage src={imageUrl} />
            <AvatarFallback>
              {user?.email ? user.email.charAt(0).toUpperCase() : 'U'}
            </AvatarFallback>
          </Avatar>
          <SignoutButton />
        </div>
      </div>
      {checkaccess ? (
        <UploadForm />
      ) : (
        <NoAccessComponent />
      )}
    </div>
  );
}

function NoAccessComponent() {
  return (
    <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mt-4 rounded-md shadow-md">
      <h2 className="text-xl font-bold mb-2">Access Denied</h2>
      <p className="mb-2">You don&apos;t have access to create venues/events.</p>
      <p>Please contact <strong>support@xyz.com</strong> to become an organizer.</p>
    </div>
  );
}
