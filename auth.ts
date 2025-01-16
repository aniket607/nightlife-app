
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
      // If the url is relative, prefix it with the base url
      if (url.startsWith('/')) return `${baseUrl}${url}`
      // If the url is absolute but on the same host, return it
      else if (new URL(url).origin === baseUrl) return url
      // Default to the organizer dashboard
      return `${baseUrl}/organizer`
    }
  },

  pages: {
    signIn: "/login",
  }
})
