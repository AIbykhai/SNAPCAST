"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Loader2 } from "lucide-react"

interface PreviewPanelProps {
  generatedContent: string
  setGeneratedContent: (value: string) => void
  onRegenerate: () => void
  onSchedule: () => void
  isGenerating: boolean
  hasGenerated: boolean
}

export function PreviewPanel({
  generatedContent,
  setGeneratedContent,
  onRegenerate,
  onSchedule,
  isGenerating,
  hasGenerated,
}: PreviewPanelProps) {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Content Preview</CardTitle>
        <CardDescription>Review and edit your AI-generated content</CardDescription>
      </CardHeader>
      <CardContent>
        {isGenerating ? (
          <div className="flex min-h-[200px] flex-col items-center justify-center space-y-4 rounded-md border border-dashed p-8 text-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <div>
              <p className="text-lg font-medium">Generating content...</p>
              <p className="text-sm text-muted-foreground">Our AI is crafting the perfect content for you</p>
            </div>
          </div>
        ) : hasGenerated ? (
          <div className="space-y-2">
            <Textarea
              className="min-h-[200px] resize-none"
              value={generatedContent}
              onChange={(e) => setGeneratedContent(e.target.value)}
            />
            <div className="text-right">
              <button onClick={onRegenerate} className="text-sm text-primary underline hover:text-primary/80">
                Regenerate
              </button>
            </div>
          </div>
        ) : (
          <div className="flex min-h-[200px] flex-col items-center justify-center rounded-md border border-dashed p-8 text-center">
            <div>
              <p className="text-lg font-medium">No content generated yet</p>
              <p className="text-sm text-muted-foreground">
                Fill in the content creator form and click "Generate" to see your AI-generated content here
              </p>
            </div>
          </div>
        )}
      </CardContent>
      {hasGenerated && (
        <CardFooter>
          <Button className="w-full" onClick={onSchedule}>
            Schedule
          </Button>
        </CardFooter>
      )}
    </Card>
  )
}
