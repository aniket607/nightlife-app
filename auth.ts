
import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/prisma"

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [Google],
  callbacks: {
    signIn: async ({user, account}) => {
      console.log("User signed in");
      return true
    },
    redirect({ url, baseUrl }) {
      // Force clean redirect to dashboard for Configuration error
      if (url.includes('error=Configuration')) {
        return `${baseUrl}/organizer#` 
      }
      
      // For all other cases, maintain the URL structure
      if (url.startsWith('/')) return `${baseUrl}${url}`
      if (new URL(url).origin === baseUrl) return url
      return `${baseUrl}/organizer`
    }
  },

  pages: {
    signIn: "/login",
    error: '/organizer'
  }
})
