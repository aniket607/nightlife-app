"use client"
import { signOut } from "next-auth/react"
import { Button } from "./ui/button"
export default function signoutButton() {
  return (
    <div>
        <Button variant="destructive" className="w-fit rounded-full" onClick={() => signOut()}>Sign Out</Button>
    </div>
  )
}

