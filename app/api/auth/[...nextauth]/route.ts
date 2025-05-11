import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

// Create a minimal configuration to test if the basic setup works
const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // For testing purposes, accept any credentials
        // This will help us determine if the issue is with the database connection
        if (credentials?.email && credentials?.password) {
          return {
            id: "1",
            name: "Test User",
            email: credentials.email,
          }
        }
        return null
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/auth/login",
  },
  debug: true,
})

export { handler as GET, handler as POST }
