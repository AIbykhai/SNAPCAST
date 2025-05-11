"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Pencil, Check, X, Loader2 } from "lucide-react"

interface ReviewStepProps {
  formData: any
  setFormData: (data: any) => void
  onNext: () => void
  onBack: () => void
  isGenerating?: boolean
}

export function ReviewStep({ formData, setFormData, onNext, onBack, isGenerating = false }: ReviewStepProps) {
  const [isEditingVoice, setIsEditingVoice] = useState(false)
  const [editedVoice, setEditedVoice] = useState(formData.brandVoiceSummary)
  const [editingVocabulary, setEditingVocabulary] = useState<number | null>(null)
  const [editedVocabularyItem, setEditedVocabularyItem] = useState("")

  const handleSaveVoice = () => {
    setFormData({
      ...formData,
      brandVoiceSummary: editedVoice,
    })
    setIsEditingVoice(false)
  }

  const handleCancelVoiceEdit = () => {
    setEditedVoice(formData.brandVoiceSummary)
    setIsEditingVoice(false)
  }

  const handleEditVocabularyItem = (index: number) => {
    setEditingVocabulary(index)
    setEditedVocabularyItem(formData.suggestedVocabulary[index])
  }

  const handleSaveVocabularyItem = (index: number) => {
    const updatedVocabulary = [...formData.suggestedVocabulary]
    updatedVocabulary[index] = editedVocabularyItem

    setFormData({
      ...formData,
      suggestedVocabulary: updatedVocabulary,
    })

    setEditingVocabulary(null)
  }

  const handleCancelVocabularyEdit = () => {
    setEditingVocabulary(null)
  }

  if (isGenerating) {
    return (
      <Card className="shadow-lg">
        <CardContent className="flex flex-col items-center justify-center p-12 text-center">
          <Loader2 className="mb-4 h-12 w-12 animate-spin text-primary" />
          <h2 className="mb-2 text-xl font-semibold">Generating Your Brand Profile</h2>
          <p className="text-muted-foreground">
            Our AI is analyzing your content to create a personalized brand voice and vocabulary...
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="shadow-lg">
      <CardContent className="p-6">
        <div className="mb-6">
          <h2 className="mb-2 text-2xl font-semibold">Review Your Brand Profile</h2>
          <p className="text-gray-600">Review and edit the generated brand voice summary and vocabulary</p>
          {formData.aiModel && <p className="mt-2 text-sm text-muted-foreground">Generated using {formData.aiModel}</p>}
        </div>

        <div className="mb-8">
          <div className="mb-2 flex items-center justify-between">
            <h3 className="text-lg font-medium">Brand Voice Summary</h3>
            {!isEditingVoice ? (
              <Button variant="ghost" size="sm" onClick={() => setIsEditingVoice(true)} className="h-8 px-2">
                <Pencil className="mr-1 h-4 w-4" />
                Edit
              </Button>
            ) : (
              <div className="flex space-x-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSaveVoice}
                  className="h-8 px-2 text-green-600 hover:bg-green-50 hover:text-green-700"
                >
                  <Check className="mr-1 h-4 w-4" />
                  Save
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCancelVoiceEdit}
                  className="h-8 px-2 text-red-600 hover:bg-red-50 hover:text-red-700"
                >
                  <X className="mr-1 h-4 w-4" />
                  Cancel
                </Button>
              </div>
            )}
          </div>

          {isEditingVoice ? (
            <Textarea value={editedVoice} onChange={(e) => setEditedVoice(e.target.value)} className="min-h-[120px]" />
          ) : (
            <div className="rounded-lg border p-4">
              <p>{formData.brandVoiceSummary}</p>
            </div>
          )}
        </div>

        <div className="mb-8">
          <div className="mb-2 flex items-center justify-between">
            <h3 className="text-lg font-medium">Suggested Vocabulary</h3>
            <span className="text-sm text-muted-foreground">Click on any word to edit</span>
          </div>

          <div className="flex flex-wrap gap-2">
            {formData.suggestedVocabulary.map((word: string, index: number) => (
              <div key={index}>
                {editingVocabulary === index ? (
                  <div className="flex items-center space-x-1">
                    <input
                      type="text"
                      value={editedVocabularyItem}
                      onChange={(e) => setEditedVocabularyItem(e.target.value)}
                      className="h-8 w-32 rounded-md border px-2 text-sm"
                      autoFocus
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSaveVocabularyItem(index)}
                      className="h-6 w-6 p-0 text-green-600 hover:bg-green-50 hover:text-green-700"
                    >
                      <Check className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleCancelVocabularyEdit}
                      className="h-6 w-6 p-0 text-red-600 hover:bg-red-50 hover:text-red-700"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ) : (
                  <Badge
                    variant="secondary"
                    className="cursor-pointer px-3 py-1 hover:bg-accent"
                    onClick={() => handleEditVocabularyItem(index)}
                  >
                    {word}
                  </Badge>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 flex justify-between">
          <Button variant="outline" onClick={onBack}>
            Back
          </Button>
          <Button onClick={onNext}>Save & Continue</Button>
        </div>
      </CardContent>
    </Card>
  )
}
