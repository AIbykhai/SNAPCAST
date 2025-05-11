import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"

export async function middleware(request: NextRequest) {
  // Skip middleware for NextAuth API routes
  if (request.nextUrl.pathname.startsWith('/api/auth')) {
    return NextResponse.next()
  }
  
  // Rest of your middleware logic
  const path = request.nextUrl.pathname
  const publicPaths = ["/auth/login", "/auth/register", "/"]
  const isPublicPath = publicPaths.some(
    (publicPath) => path === publicPath || path.startsWith(publicPath)
  )
  
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  })
  
  if (isPublicPath && token) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }
  
  if (!isPublicPath && !token) {
    return NextResponse.redirect(new URL("/auth/login", request.url))
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: [
    "/dashboard/:path*", 
    "/onboarding/:path*", 
    "/auth/login", 
    "/auth/register",
    "/profile",
    "/account-analyst",
  ],
}
