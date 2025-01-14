"use client"
import { signOut } from "next-auth/react"
import { Button } from "./ui/button"

export default function signoutButton() {
  return (
    <Button 
      variant="destructive" 
      className="w-full text-xs sm:text-sm px-3 sm:px-4 py-1.5 sm:py-2 h-auto md:rounded-full rounded-lg hover:bg-red-600/90 hover:scale-[0.98] active:scale-95 transition-all duration-200"
      onClick={() => signOut()}
    >
      Sign Out
    </Button>
  );
}
