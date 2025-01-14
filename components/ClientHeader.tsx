'use client'

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import SignoutButton from "@/components/SignoutButton";

export default function ClientHeader({imageUrl, email}: {imageUrl: string | undefined, email: string | undefined}) {
    const router = useRouter();
    const pathname = usePathname();
    const isOnDashboard = pathname === '/organizer';
    const [navigationStack, setNavigationStack] = useState<string[]>([]);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as HTMLElement;
            if (!target.closest('.avatar-dropdown')) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);

    // Update navigation stack when pathname changes
    useEffect(() => {
        if (!pathname.includes('add') && !pathname.includes('edit')) {
            setNavigationStack(prev => [...prev, pathname]);
        }
    }, [pathname]);

    const handleBack = () => {
        const previousRoute = navigationStack[navigationStack.length - 2];
        if (previousRoute) {
            router.push(previousRoute);
            setNavigationStack(prev => prev.slice(0, -2));
        } else {
            router.push('/organizer');
        }
    };

    const toggleDropdown = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsDropdownOpen(!isDropdownOpen);
    };

    return (
        <header className="sticky top-0 z-50 bg-transparent text-gray-100">
            <div className="max-w-6xl mx-auto px-2 sm:px-6 lg:px-8 py-2 sm:py-4">
                <div className="bg-gradient-to-t from-[#151515] via-[#151817] to-[#181A1A] rounded-full px-3 sm:px-6 py-2 border border-gray-700">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-2 sm:space-x-4">
                            {!isOnDashboard && (
                                <button 
                                    onClick={handleBack} 
                                    className={`p-1.5 sm:p-2 rounded-full transition duration-300 focus:outline-none ${
                                        isOnDashboard 
                                        ? 'cursor-not-allowed' 
                                        : 'hover:bg-gray-800'
                                    }`}
                                    aria-label="Go back"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                    </svg>
                                </button>
                            )}
                            <Link href="/organizer/">
                                <span className="text-xs sm:text-sm font-bold px-3 sm:px-7 rounded-full py-2 sm:py-3 font-poppins text-gray-300 hover:text-white hover:bg-white/5 transition-all duration-300">
                                    Dashboard
                                </span>
                            </Link>
                            <Link href="/organizer/myevents" className="hidden md:block">
                                <span className="text-xs sm:text-sm font-bold px-3 sm:px-7 rounded-full py-2 sm:py-3 font-poppins text-gray-300 hover:text-white hover:bg-white/5 transition-all duration-300">
                                    My Events
                                </span>
                            </Link>
                        </div>
                        
                        <div className="flex items-center space-x-3 sm:space-x-6">
                            <div className="relative avatar-dropdown">
                                {imageUrl && (
                                    <>
                                        {/* Mobile: Clickable Avatar */}
                                        <button 
                                            onClick={toggleDropdown}
                                            className="md:hidden focus:outline-none"
                                        >
                                            <Avatar className="h-10 w-10 ring-1 ring-gray-700 hover:ring-gray-500 transition-all">
                                                <AvatarImage src={imageUrl} alt={email || 'User'} />
                                                <AvatarFallback className="bg-gray-800 text-gray-200 text-xs">
                                                    {email ? email.charAt(0).toUpperCase() : "U"}
                                                </AvatarFallback>
                                            </Avatar>
                                        </button>

                                        {/* Desktop: Non-clickable Avatar */}
                                        <div className="hidden md:block">
                                            <Avatar className="h-8 w-8 ring-1 ring-gray-700 transition-all">
                                                <AvatarImage src={imageUrl} alt={email || 'User'} />
                                                <AvatarFallback className="bg-gray-800 text-gray-200 text-sm">
                                                    {email ? email.charAt(0).toUpperCase() : "U"}
                                                </AvatarFallback>
                                            </Avatar>
                                        </div>
                                    </>
                                )}
                                
                                {/* Mobile Dropdown */}
                                {isDropdownOpen && (
                                    <div className="absolute right-0 mt-2 w-48 md:hidden bg-gray-800/95 backdrop-blur-sm rounded-lg shadow-lg transform origin-top-right transition-all duration-200 ease-out border border-gray-700/50">
                                        <div className="py-2 px-1 space-y-1">
                                            <Link href="/organizer/myevents">
                                                <div className="block px-4 py-2 text-sm text-gray-200 rounded-lg transition-colors bg-white/5 border border-gray-600/30 mx-1 hover:bg-white/10">
                                                    <div className="flex items-center space-x-2">
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                        </svg>
                                                        <span>My Events</span>
                                                    </div>
                                                </div>
                                            </Link>
                                            <div className="mx-1">
                                                <SignoutButton />
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                            
                            {/* Desktop Sign Out Button */}
                            <div className="hidden md:block">
                                <SignoutButton />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}
