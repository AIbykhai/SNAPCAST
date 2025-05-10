"use client"

import { useState, useEffect } from "react"
import { OnboardingProgress } from "@/components/onboarding-progress"
import { ImportMethodStep } from "./import-method-step"
import { PasteContentStep } from "./paste-content-step"
import { ImportFromSocialStep } from "./import-from-social-step"
import { VocabularyStep } from "./vocabulary-step"
import { ReviewStep } from "./review-step"
import { Highlight } from "@/components/ui/highlight"

interface BrandProfileWizardProps {
  formData: any
  setFormData: (data: any) => void
  onComplete: () => void
}

export function BrandProfileWizard({ formData, setFormData, onComplete }: BrandProfileWizardProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [totalSteps, setTotalSteps] = useState(4)

  // Determine total steps based on import method
  useEffect(() => {
    if (formData.importMethod === "paste") {
      setTotalSteps(4)
    } else if (formData.importMethod === "social") {
      setTotalSteps(4)
    } else {
      setTotalSteps(4)
    }
  }, [formData.importMethod])

  const handleNext = () => {
    if (currentStep === 1) {
      // If we're on step 1, the next step depends on the import method
      if (formData.importMethod === "paste") {
        setCurrentStep(2) // Go to step 2A
      } else if (formData.importMethod === "social") {
        setCurrentStep(2) // Go to step 2B
      }
    } else if (currentStep === 2) {
      // From step 2A or 2B, go to step 3
      setCurrentStep(3)
    } else if (currentStep === 3) {
      // From step 3, go to step 4
      // Generate brand voice summary and suggested vocabulary based on input
      const brandVoiceSummary = generateBrandVoiceSummary(formData)
      const suggestedVocabulary = generateSuggestedVocabulary(formData)

      setFormData({
        ...formData,
        brandVoiceSummary,
        suggestedVocabulary,
      })

      setCurrentStep(4)
    } else if (currentStep === 4) {
      // Complete the wizard
      onComplete()
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  // Generate a brand voice summary based on the user's input
  const generateBrandVoiceSummary = (data: any) => {
    // In a real application, this would be a more sophisticated analysis
    return "Your brand voice is professional yet approachable, with a focus on clarity and expertise. You tend to use concise sentences and avoid jargon, making complex topics accessible to your audience. Your content has a consistent tone that balances authority with conversational elements."
  }

  // Generate suggested vocabulary based on the user's input
  const generateSuggestedVocabulary = (data: any) => {
    // In a real application, this would analyze the provided content
    return [
      "innovative",
      "streamlined",
      "efficient",
      "user-friendly",
      "cutting-edge",
      "transformative",
      "intuitive",
      "seamless",
      "powerful",
      "flexible",
    ]
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <OnboardingProgress currentStep={currentStep} totalSteps={totalSteps} />
      </div>

      <div className="mb-8 text-center">
        <h1 className="mb-4 text-3xl font-bold md:text-4xl">
          Step 1: <Highlight>Brand Profiling</Highlight>
        </h1>
        <p className="text-gray-600 md:text-lg">Let's create a consistent voice for your AI-generated content</p>
      </div>

      <div className="mx-auto max-w-3xl">
        {currentStep === 1 && (
          <ImportMethodStep formData={formData} setFormData={setFormData} onNext={handleNext} onBack={handleBack} />
        )}

        {currentStep === 2 && formData.importMethod === "paste" && (
          <PasteContentStep formData={formData} setFormData={setFormData} onNext={handleNext} onBack={handleBack} />
        )}

        {currentStep === 2 && formData.importMethod === "social" && (
          <ImportFromSocialStep formData={formData} setFormData={setFormData} onNext={handleNext} onBack={handleBack} />
        )}

        {currentStep === 3 && (
          <VocabularyStep formData={formData} setFormData={setFormData} onNext={handleNext} onBack={handleBack} />
        )}

        {currentStep === 4 && (
          <ReviewStep formData={formData} setFormData={setFormData} onNext={handleNext} onBack={handleBack} />
        )}
      </div>
    </div>
  )
}
