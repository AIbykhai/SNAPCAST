import { redirect } from "next/navigation"

export default function DashboardPage() {
  // Redirect to creator page since Dashboard is removed
  redirect("/dashboard/creator")
}
