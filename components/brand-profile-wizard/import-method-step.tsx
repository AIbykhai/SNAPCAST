"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"

interface ImportMethodStepProps {
  formData: any
  setFormData: (data: any) => void
  onNext: () => void
  onBack: () => void
}

export function ImportMethodStep({ formData, setFormData, onNext, onBack }: ImportMethodStepProps) {
  const handleImportMethodChange = (value: string) => {
    setFormData({
      ...formData,
      importMethod: value,
    })
  }

  const isNextDisabled = !formData.importMethod

  return (
    <Card className="shadow-lg">
      <CardContent className="p-6">
        <div className="mb-6">
          <h2 className="mb-2 text-2xl font-semibold">Choose Import Method</h2>
          <p className="text-gray-600">Select how you want to provide content samples for your brand voice analysis</p>
        </div>

        <RadioGroup value={formData.importMethod} onValueChange={handleImportMethodChange} className="space-y-4">
          <div className="flex items-start space-x-3 rounded-lg border p-4 transition-colors hover:bg-accent">
            <RadioGroupItem value="paste" id="paste" className="mt-1" />
            <div className="flex-1">
              <Label htmlFor="paste" className="text-base font-medium">
                Paste your own content
              </Label>
              <p className="text-sm text-gray-500">
                Manually paste up to three posts or articles that represent your brand voice
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3 rounded-lg border p-4 transition-colors hover:bg-accent">
            <RadioGroupItem value="social" id="social" className="mt-1" />
            <div className="flex-1">
              <Label htmlFor="social" className="text-base font-medium">
                Import from social media
              </Label>
              <p className="text-sm text-gray-500">Connect to your social media accounts to import existing content</p>
            </div>
          </div>
        </RadioGroup>

        <div className="mt-8 flex justify-end">
          <Button onClick={onNext} disabled={isNextDisabled}>
            Next
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
