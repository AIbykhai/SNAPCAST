import { auth0 } from "@/lib/auth0"
import Image from "next/image"
import Link from "next/link"

export default async function ProfilePage() {
  const session = await auth0.getSession()

  if (!session || !session.user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-semibold mb-4">Profile</h1>
        <p>You are not logged in.</p>
        <p>
          Please{" "}
          <Link href="/auth/login" className="text-blue-600 hover:underline">
            log in
          </Link>{" "}
          to view your profile.
        </p>
      </div>
    )
  }

  const { user } = session

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">User Profile</h1>
      <div className="bg-white shadow-md rounded-lg p-6">
        <div className="flex items-center space-x-4 mb-6">
          {user.picture && (
            <Image
              src={user.picture}
              alt={user.name || "User avatar"}
              width={80}
              height={80}
              className="rounded-full"
            />
          )}
          <div>
            <h2 className="text-2xl font-semibold">
              {user.name || "No name provided"}
            </h2>
            <p className="text-gray-600">
              {user.email || "No email provided"}
            </p>
            {user.email_verified !== undefined && (
              <p
                className={`text-sm ${
                  user.email_verified ? "text-green-600" : "text-red-600"
                }`}
              >
                Email {user.email_verified ? "Verified" : "Not Verified"}
              </p>
            )}
          </div>
        </div>

        <div className="mt-6">
          <h3 className="text-xl font-semibold mb-2">User Details:</h3>
          <pre className="bg-gray-100 p-4 rounded-md overflow-auto text-sm">
            {JSON.stringify(user, null, 2)}
          </pre>
        </div>

        <div className="mt-8">
          <button
            onClick={async () => {
              // Call the logout API
              await fetch("/api/auth/logout", { method: "POST" });
              // Redirect to the login page
              window.location.href = "/login";
            }}
            style={{ color: "blue", background: "none", border: "none", cursor: "pointer", textDecoration: "underline" }}
          >
            Log Out
          </button>
        </div>
      </div>
    </div>
  )
}
