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
        <header className="sticky top-0 z-50 bg-gradient-to-r from-purple-400 to-indigo-400 text-white shadow-lg">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center py-4">
                    <div className="flex items-center space-x-8">
                        {!isOnDashboard && (
                            <button 
                            onClick={() => router.back()} 
                            className={`p-2 rounded-full transition duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                                isOnDashboard 
                                ? 'bg-gray-300 cursor-not-allowed' 
                                : 'bg-white/20 hover:bg-indigo-700'
                            }`}
                            aria-label="Go back"
                            disabled={isOnDashboard}
                            >
                            <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${isOnDashboard ? 'text-gray-500' : 'text-white'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            </button>
                        )}
                        <Link href="/organizer/">
                            <span className="text-xl font-extrabold tracking-tight bg-white/5 px-3 py-3 rounded-md hover:text-black/60 hover:bg-white/15 transition duration-300">
                                Dashboard
                            </span>
                        </Link>
                        {/* <nav className="hidden md:flex space-x-6">
                            <Link href="/organizer/venues" className="text-base font-medium hover:text-indigo-200 transition duration-300">
                                Venues
                            </Link>
                            <Link href="/organizer/events" className="text-base font-medium hover:text-indigo-200 transition duration-300">
                                Events
                            </Link>
                            <Link href="/organizer/analytics" className="text-base font-medium hover:text-indigo-200 transition duration-300">
                                Analytics
                            </Link>
                        </nav> */}
                    </div>
                    <div className="flex items-center space-x-4">
                        {imageUrl && (
                            <Avatar className="h-8 w-8 ring-2 ring-white">
                                <AvatarImage src={imageUrl} alt={email || 'User'} />
                                <AvatarFallback className="bg-indigo-500 text-white">
                                    {email ? email.charAt(0).toUpperCase() : "U"}
                                </AvatarFallback>
                            </Avatar>
                        )}
                        <SignoutButton />
                    </div>
                </div>
            </div>
        </header>
    );
}
