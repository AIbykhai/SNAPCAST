'use client';

import Link from 'next/link';

// Define a minimal interface for the user prop as Session/Claims types might not be directly exported
interface AuthUser {
  name?: string | null;
  email?: string | null;
  // picture?: string | null; // We could add other properties if needed by AuthStatus
  [key: string]: any; // Allow other properties from the Auth0 user object
}

interface AuthStatusProps {
  user?: AuthUser | null;
  // We could add isLoading/error props if RootLayout handles their state,
  // but for simplicity, let's just pass the user from the server-side session.
}

export default function AuthStatus({ user }: AuthStatusProps) {
  // isLoading and error are no longer managed here directly via useUser()

  if (user) {
    return (
      <div className="flex items-center space-x-4">
        <span className="text-sm">
          Welcome, {user.name || user.email}!
        </span>
        <button onClick={async () => {
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
    );
  }

  return (
    <Link href="/auth/login" className="text-sm text-blue-600 hover:underline">
      Log In
    </Link>
  );
} 