'use client'

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import SignoutButton from "@/components/SignoutButton";

export default function ClientHeader({imageUrl, email}: {imageUrl: string | undefined, email: string | undefined}) {
    const router = useRouter();
    const pathname = usePathname();
    const isOnDashboard = pathname === '/organizer';

    return (
        <header className="sticky top-0 z-50 bg-black text-gray-100">
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="bg-gradient-to-t from-[#151515] via-[#151817] to-[#181A1A] rounded-full px-6 py-2 border border-gray-700">
            <div className="flex justify-between items-center">
                <div className="flex items-center space-x-4">
                    {!isOnDashboard && (
                        <button 
                            onClick={() => router.back()} 
                            className={`p-2 rounded-full transition duration-300 focus:outline-none ${
                                isOnDashboard 
                                ? 'cursor-not-allowed' 
                                : 'hover:bg-gray-800'
                            }`}
                            aria-label="Go back"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                        </button>
                    )}
                    <Link href="/organizer/">
                        <span className="text-sm font-medium bg-gray-600/40 px-7 rounded-full py-3 font-poppins hover:bg-gray-600/20 hover:text-white/50 transition duration-300">
                            Dashboard
                        </span>
                    </Link>
                </div>
                
                <div className="flex items-center space-x-6">
                    {imageUrl && (
                        <Avatar className="h-8 w-8 ring-1 ring-gray-700">
                            <AvatarImage src={imageUrl} alt={email || 'User'} />
                            <AvatarFallback className="bg-gray-800 text-gray-200">
                                {email ? email.charAt(0).toUpperCase() : "U"}
                            </AvatarFallback>
                        </Avatar>
                    )}
                    <SignoutButton />
                </div>
            </div>
        </div>
    </div>
</header>

    );
}
