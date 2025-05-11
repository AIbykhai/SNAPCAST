"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Highlight } from "@/components/ui/highlight"
import { OnboardingProgress } from "@/components/onboarding-progress"

export default function OnboardingStep1() {
  const router = useRouter()

  const handleNext = () => {
    // In a real application, you would save the user's preferences
    router.push("/onboarding/step-2")
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-start bg-gradient-to-b from-white to-orange-50 p-4 pt-8">
      <div className="w-full max-w-3xl">
        <OnboardingProgress currentStep={1} totalSteps={5} />

        <div className="mt-12 text-center">
          <h1 className="mb-6 text-4xl font-bold tracking-tight text-gray-900">
            Get Started with <Highlight>AI Content Creation</Highlight>
          </h1>

          <p className="mb-12 text-xl text-gray-600">
            Welcome to your AI Social Person! We'll guide you through a few simple steps to set up your content creation
            assistant.
          </p>

          <Card className="mb-12 p-8 text-left">
            <h2 className="mb-6 text-2xl font-bold">What you'll need:</h2>

            <ul className="space-y-4">
              <li className="flex items-start">
                <svg className="mr-3 h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Examples of content you like</span>
              </li>
              <li className="flex items-start">
                <svg className="mr-3 h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Your brand voice preferences</span>
              </li>
              <li className="flex items-start">
                <svg className="mr-3 h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>A few minutes to complete the setup</span>
              </li>
            </ul>
          </Card>

          <div className="flex justify-between">
            <Button variant="outline" onClick={() => router.push("/")}>
              Back
            </Button>
            <Button onClick={handleNext}>Next</Button>
          </div>
        </div>
      </div>
    </div>
  )
}
