import { cn } from "@/lib/utils"

interface OnboardingProgressProps {
  currentStep: number
  totalSteps: number
}

export function OnboardingProgress({ currentStep, totalSteps }: OnboardingProgressProps) {
  return (
    <div className="w-full">
      <div className="flex justify-between mb-2">
        {Array.from({ length: totalSteps }).map((_, index) => (
          <div key={index} className="flex flex-col items-center">
            <div
              className={cn(
                "flex h-10 w-10 items-center justify-center rounded-full text-sm font-medium",
                index + 1 <= currentStep ? "bg-primary text-white" : "bg-gray-200 text-gray-500",
              )}
            >
              {index + 1}
            </div>
            <span className="mt-2 text-sm">Step {index + 1}</span>
          </div>
        ))}
      </div>
      <div className="relative h-2 w-full rounded-full bg-gray-200">
        <div
          className="absolute left-0 top-0 h-2 rounded-full bg-primary"
          style={{ width: `${(currentStep / totalSteps) * 100}%` }}
        />
      </div>
    </div>
  )
}
