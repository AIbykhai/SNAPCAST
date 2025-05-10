import { cookies } from "next/headers";
import { auth } from "./auth";
import { redirect } from "next/navigation";
import { cache } from "react";

// Cache the getCurrentUser function for the duration of a request
export const getCurrentUser = cache(async () => {
  const cookieStore = cookies();
  const sessionId = cookieStore.get(auth.sessionCookieName)?.value;
  
  if (!sessionId) {
    return null;
  }
  
  try {
    const { user } = await auth.validateSession(sessionId);
    return user;
  } catch (error) {
    console.error("Error validating session:", error);
    return null;
  }
});

// Use this function in pages that require authentication
export async function requireAuth() {
  const user = await getCurrentUser();
  
  if (!user) {
    redirect("/login");
  }
  
  return user;
}

// Use this function to protect routes from authenticated users
export async function redirectIfAuthenticated(redirectTo: string = "/dashboard") {
  const user = await getCurrentUser();
  
  if (user) {
    redirect(redirectTo);
  }
  
  return null;
} 