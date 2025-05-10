"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

interface PasteContentStepProps {
  formData: any
  setFormData: (data: any) => void
  onNext: () => void
  onBack: () => void
}

export function PasteContentStep({ formData, setFormData, onNext, onBack }: PasteContentStepProps) {
  const [expandedItems, setExpandedItems] = useState<string[]>(["item-0"])

  const handleContentChange = (index: number, value: string) => {
    const updatedContent = [...formData.pastedContent]
    updatedContent[index] = value

    setFormData({
      ...formData,
      pastedContent: updatedContent,
    })
  }

  const handleAccordionChange = (value: string) => {
    setExpandedItems(value === "" ? [] : [value])
  }

  const isNextDisabled = formData.pastedContent.some((content: string) => !content.trim())

  return (
    <Card className="shadow-lg">
      <CardContent className="p-6">
        <div className="mb-6">
          <h2 className="mb-2 text-2xl font-semibold">Paste Your Content</h2>
          <p className="text-gray-600">Paste up to three posts or articles that best represent your brand voice</p>
        </div>

        <Accordion
          type="single"
          collapsible
          value={expandedItems[0]}
          onValueChange={handleAccordionChange}
          className="mb-6"
        >
          {[0, 1, 2].map((index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="text-lg font-medium">
                Content Sample {index + 1}
                {formData.pastedContent[index] ? (
                  <span className="ml-2 text-sm text-green-600">✓ Added</span>
                ) : (
                  <span className="ml-2 text-sm text-gray-400">Required</span>
                )}
              </AccordionTrigger>
              <AccordionContent>
                <Textarea
                  placeholder="Paste your content here..."
                  value={formData.pastedContent[index]}
                  onChange={(e) => handleContentChange(index, e.target.value)}
                  className="min-h-[200px]"
                />
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        <div className="mt-8 flex justify-between">
          <Button variant="outline" onClick={onBack}>
            Back
          </Button>
          <Button onClick={onNext} disabled={isNextDisabled}>
            Next
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
