import { auth } from "@/auth";
import { redirect } from "next/navigation";
import {prisma} from "@/lib/prisma"
import SignoutButton from "@/components/signout-button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default async function Page() {
  const session = await auth();
  // If there's no authenticated user, redirect
  if (!session?.user) {
    redirect("/organizer/login");
  }
  const userId = session.user.id;
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { image:true,email:true },
  });
  console.log("User Details",user)
  // The image is available on session.user.image
  const imageUrl = user?.image??undefined
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
                <SignoutButton/>
            </div>
        </div>
    </div>
  );
}
