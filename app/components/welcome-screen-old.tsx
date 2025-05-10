"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Highlight } from "@/components/ui/highlight"

export function WelcomeScreen() {
  const router = useRouter()

  const handleGetStarted = () => {
    // In a real application, you would navigate to the next step in the onboarding flow
    console.log("Get Started clicked")
    router.push("/onboarding/step-1")
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-white to-orange-50 p-4">
      <div className="mx-auto max-w-2xl text-center">
        <div className="mb-12">
          <h1 className="mb-6 text-5xl font-bold tracking-tight text-gray-900">
            Get Started with <Highlight>AI Content Creation</Highlight>
          </h1>

          <p className="mb-8 text-xl text-gray-600">
            We help your business make content 5x faster, more on-brand and post everywhere in one click!
          </p>

          <div className="flex justify-center">
            <div className="relative h-64 w-64">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="h-full w-full rounded-full bg-accent p-8">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-full w-full text-primary"
                  >
                    <path d="M12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" />
                    <path d="M12 8v-2" />
                    <path d="M12 18v-2" />
                    <path d="M16 12h2" />
                    <path d="M6 12h2" />
                    <path d="M8 7l2 2" />
                    <path d="M14 7l-2 2" />
                    <path d="M8 17l2-2" />
                    <path d="M14 17l-2-2" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Button onClick={handleGetStarted} size="lg" className="px-8 py-6 text-lg font-medium">
          Get Started
        </Button>
      </div>
    </div>
  )
}
