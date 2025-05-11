import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"

export async function middleware(request: NextRequest) {
  // Skip middleware for all auth-related routes
  if (request.nextUrl.pathname.startsWith("/api/auth") || request.nextUrl.pathname.startsWith("/auth")) {
    return NextResponse.next()
  }

  // Get the pathname
  const path = request.nextUrl.pathname

  // Public paths that don't require authentication
  const publicPaths = ["/"]

  // Check if the path is public
  const isPublicPath = publicPaths.some((publicPath) => path === publicPath || path.startsWith(publicPath))

  try {
    // Get the token
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    })

    // If the path is not public and the user is not authenticated, redirect to login
    if (!isPublicPath && !token) {
      return NextResponse.redirect(new URL("/auth/login", request.url))
    }

    return NextResponse.next()
  } catch (error) {
    console.error("Middleware error:", error)
    // On error, allow the request to proceed to avoid blocking the application
    return NextResponse.next()
  }
}

export const config = {
  matcher: [
    // Include your protected routes
    "/dashboard/:path*",
    "/onboarding/:path*",
    "/profile",
    "/account-analyst",

    // Exclude all auth routes and static files
    "/((?!auth|api/auth|_next/static|_next/image|favicon.ico).*)",
  ],
}
