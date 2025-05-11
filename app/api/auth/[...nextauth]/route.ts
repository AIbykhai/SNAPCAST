import NextAuth from "next-auth"
import { authOptions } from "@/lib/auth"

// Enable debug mode to get more detailed logs
const handler = NextAuth({
  ...authOptions,
  debug: true, // Add debug mode for troubleshooting
})

export { handler as GET, handler as POST }
