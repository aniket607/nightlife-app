"use client"
import { signOut } from "next-auth/react"
import { Button } from "./ui/button"
export default function signoutButton() {
  return (
    <div>
        <Button 
          variant="destructive" 
          className="w-fit text-xs sm:text-sm px-3 sm:px-4 py-1 sm:py-2 h-auto rounded-full"
          onClick={() => signOut()}
        >
          Sign Out
        </Button>
    </div>
  )
}
