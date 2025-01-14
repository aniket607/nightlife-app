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
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-50 [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
      
      {/* Gradient Blob */}
      <div 
        className="absolute inset-0 bg-gradient-to-br from-indigo-500/30 via-purple-500/30 to-pink-500/30 blur-3xl"
        style={{ 
          clipPath: 'polygon(50% 0%, 100% 0, 100% 50%, 100% 100%, 50% 100%, 0 100%, 0 50%, 0 0)' 
        }}
      ></div>
      
      {/* Content */}
      <div className="relative flex min-h-screen flex-col items-center justify-center px-4 py-16 sm:px-6 sm:py-24">
        {/* Logo Section */}
        <div className="mb-6 sm:mb-8 flex items-center gap-2 scale-90 sm:scale-100">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 backdrop-blur-sm">
            <GalleryVerticalEnd className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">Nightlife</h1>
        </div>
        
        {/* Login Form */}
        <div className="w-full">
          <LoginForm />
        </div>
        
        {/* Footer */}
        <div className="mt-6 sm:mt-8 text-center text-xs sm:text-sm text-gray-400 max-w-sm mx-auto">
          <p className="px-4">Experience the best nightlife in your city</p>
        </div>
      </div>
    </div>
  )
}
