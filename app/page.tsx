import { redirect } from "next/navigation"
import { getAuthStatus } from "@/lib/auth-utils"

export default function Home() {
  // Check if the user is authenticated
  const isAuthenticated = getAuthStatus()

  // If not authenticated, redirect to login page
  if (!isAuthenticated) {
    redirect("/auth/login")
  }

  // If authenticated, redirect to creator page (since we removed Dashboard)
  redirect("/dashboard/creator")
}
