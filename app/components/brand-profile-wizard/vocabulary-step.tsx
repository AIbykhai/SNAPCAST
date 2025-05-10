"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"

interface VocabularyStepProps {
  formData: any
  setFormData: (data: any) => void
  onNext: () => void
  onBack: () => void
}

export function VocabularyStep({ formData, setFormData, onNext, onBack }: VocabularyStepProps) {
  const handleVocabularyChange = (value: string) => {
    setFormData({
      ...formData,
      vocabulary: value,
    })
  }

  return (
    <Card className="shadow-lg">
      <CardContent className="p-6">
        <div className="mb-6">
          <h2 className="mb-2 text-2xl font-semibold">Brand Vocabulary</h2>
          <p className="text-gray-600">
            Enter words and phrases that are important to your brand voice. Separate each with a comma.
          </p>
        </div>

        <div className="mb-6">
          <Textarea
            placeholder="innovative, user-friendly, cutting-edge, transformative..."
            value={formData.vocabulary}
            onChange={(e) => handleVocabularyChange(e.target.value)}
            className="min-h-[200px]"
          />
          <p className="mt-2 text-sm text-gray-500">
            These words will help guide the AI in creating content that matches your brand voice.
          </p>
        </div>

        <div className="mt-8 flex justify-between">
          <Button variant="outline" onClick={onBack}>
            Back
          </Button>
          <Button onClick={onNext}>Next</Button>
        </div>
      </CardContent>
    </Card>
  )
}
