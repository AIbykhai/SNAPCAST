import type { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { compare } from "bcryptjs" // Make sure this is bcryptjs, not bcrypt
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

            const user = await db.query.users.findFirst({
                where: eq(users.email, credentials.email),
            })

            if (!user) {
                return null
            }

            const isPasswordValid = await compare(credentials.password, user.passwordHash)

            if (!isPasswordValid) {
                return null
            }

            return {
                id: user.id.toString(),
                email: user.email,
                name: user.name,
            }
        } catch (error) {
            console.error("Auth error:", error)
            return null
        }
    }
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string
        session.user.name = token.name as string
        session.user.email = token.email as string
      }
      return session
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.email = user.email
        token.name = user.name
      }
      return token
    },
  },
  pages: {
    signIn: "/auth/login",
    // You can also customize other pages:
    // signOut: '/auth/signout',
    // error: '/auth/error',
    // newUser: '/auth/new-user'
  },
  // Add these options to help with debugging
  debug: process.env.NODE_ENV === "development",
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
