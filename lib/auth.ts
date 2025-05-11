import type { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { compare } from "bcryptjs"
import { db } from "@/lib/db"
import { users } from "@/lib/schema"
import { eq } from "drizzle-orm"

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            return null
          }

          // Wrap database operations in try/catch
          let user
          try {
            user = await db.query.users.findFirst({
              where: eq(users.email, credentials.email),
            })
          } catch (dbError) {
            console.error("Database error:", dbError)
            // Return null instead of throwing to prevent non-JSON responses
            return null
          }

          if (!user) {
            return null
          }

          let isPasswordValid
          try {
            isPasswordValid = await compare(credentials.password, user.passwordHash)
          } catch (compareError) {
            console.error("Password comparison error:", compareError)
            return null
          }

          if (!isPasswordValid) {
            return null
          }

          return {
            id: user.id.toString(),
            email: user.email,
            name: user.name || "",
          }
        } catch (error) {
          console.error("Auth error:", error)
          // Return null instead of throwing to prevent non-JSON responses
          return null
        }
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      try {
        if (token) {
          session.user.id = token.id as string
          session.user.name = (token.name as string) || ""
          session.user.email = token.email as string
        }
        return session
      } catch (error) {
        console.error("Session callback error:", error)
        return session
      }
    },
    async jwt({ token, user }) {
      try {
        if (user) {
          token.id = user.id
          token.email = user.email
          token.name = user.name || ""
        }
        return token
      } catch (error) {
        console.error("JWT callback error:", error)
        return token
      }
    },
  },
  pages: {
    signIn: "/auth/login",
    error: "/auth/error", // Add an error page
  },
  // Add these options to help with debugging
  debug: true,
  logger: {
    error(code, metadata) {
      console.error(`NextAuth error: ${code}`, metadata)
    },
    warn(code) {
      console.warn(`NextAuth warning: ${code}`)
    },
    debug(code, metadata) {
      console.log(`NextAuth debug: ${code}`, metadata)
    },
  },
}
