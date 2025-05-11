"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertCircle } from "lucide-react"

export default function AuthErrorPage() {
  const searchParams = useSearchParams()
  const [error, setError] = useState<string>("")

  useEffect(() => {
    const errorParam = searchParams.get("error")

    // Map error codes to user-friendly messages
    const errorMessages: Record<string, string> = {
      Configuration: "There is a problem with the server configuration.",
      AccessDenied: "You do not have permission to sign in.",
      Verification: "The verification link may have been used or has expired.",
      Default: "An error occurred during authentication.",
    }

    setError(errorParam ? errorMessages[errorParam] || errorMessages.Default : errorMessages.Default)
  }, [searchParams])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-red-500" />
            <CardTitle>Authentication Error</CardTitle>
          </div>
          <CardDescription>There was a problem signing you in</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-700">{error}</p>
          <p className="mt-4 text-sm text-gray-500">If this problem persists, please contact support.</p>
        </CardContent>
        <CardFooter>
          <div className="flex w-full flex-col space-y-2">
            <Button asChild>
              <Link href="/auth/login">Try Again</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/">Return to Home</Link>
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
