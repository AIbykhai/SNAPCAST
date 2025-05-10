import { NextResponse, type NextRequest } from "next/server";

// This is a simplified middleware for demonstration purposes
// In a real application, you would use a proper authentication system
export async function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const publicPaths = [
    "/login",
    "/register",
    "/api/auth/login",
    "/api/auth/register",
    "/api/auth/logout"
  ];
  const isPublicPath = publicPaths.some(path => url.pathname.startsWith(path));
  
  // Skip authentication for public paths and static assets
  if (
    isPublicPath || 
    url.pathname.startsWith('/_next') || 
    url.pathname.includes('.') // Static files like images, CSS, etc.
  ) {
    return NextResponse.next();
  }

  // Just check for the presence of the session cookie
  const sessionId = request.cookies.get("auth_session")?.value;
  if (!sessionId) {
    // Redirect to login page if no session
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     * This ensures authentication middleware processes most routes.
     */
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
