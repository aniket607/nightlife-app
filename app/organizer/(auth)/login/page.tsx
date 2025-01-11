import { GalleryVerticalEnd } from 'lucide-react'

import { LoginForm } from "@/components/LoginForm"
import { auth } from '@/auth';
import { redirect } from 'next/navigation';

export default async function LoginPage() {
   const session = await auth();
    if (session) {
      redirect("/organizer/");
    }
    
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-gray-600 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <a href="#" className="flex items-center gap-2 self-center font-medium">
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <GalleryVerticalEnd className="size-4" />
          </div>
          Nightlife
        </a>
        <LoginForm />
      </div>
    </div>
  )
}

