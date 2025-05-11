"use client"

import { useState } from "react"
import { CreatorPanel } from "./creator-panel"
import { PreviewPanel } from "./preview-panel"
import { generateContent, createPost } from "@/lib/api-client"
import { useToast } from "@/hooks/use-toast"

export function ContentCreator() {
  const [userInput, setUserInput] = useState("")
  const [selectedTheme, setSelectedTheme] = useState("")
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(["Instagram"])
  const [generatedContent, setGeneratedContent] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [hasGenerated, setHasGenerated] = useState(false)
  const [aiModel, setAiModel] = useState<string | null>(null)
  const { toast } = useToast()

  const handleGenerate = async () => {
    if (!userInput) return

    setIsGenerating(true)

    try {
      // Call our API to generate content
      const result = await generateContent({
        prompt: userInput,
        platform: selectedPlatforms[0], // Currently we only support one platform at a time
        theme: selectedTheme,
      })

      setGeneratedContent(result.content)
      setAiModel(result.model)
      setHasGenerated(true)

      toast({
        title: "Content generated",
        description: `Generated using ${result.model}`,
      })
    } catch (error) {
      console.error("Error generating content:", error)
      toast({
        title: "Error generating content",
        description: error instanceof Error ? error.message : "Please try again",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const handleRegenerate = async () => {
    setIsGenerating(true)

    try {
      // Call our API to generate content again
      const result = await generateContent({
        prompt: `Please provide an alternative version of this content: ${userInput}`,
        platform: selectedPlatforms[0],
        theme: selectedTheme,
      })

      setGeneratedContent(result.content)
      setAiModel(result.model)

      toast({
        title: "Content regenerated",
        description: `Generated using ${result.model}`,
      })
    } catch (error) {
      console.error("Error regenerating content:", error)
      toast({
        title: "Error regenerating content",
        description: error instanceof Error ? error.message : "Please try again",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const handleSchedule = async () => {
    try {
      // Create a post
      await createPost({
        content: generatedContent,
        platform: selectedPlatforms[0],
        scheduledFor: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Schedule for tomorrow
      })

      toast({
        title: "Content scheduled",
        description: "Your content has been scheduled for tomorrow",
      })

      // Reset form
      setUserInput("")
      setGeneratedContent("")
      setHasGenerated(false)
    } catch (error) {
      console.error("Error scheduling content:", error)
      toast({
        title: "Error scheduling content",
        description: error instanceof Error ? error.message : "Please try again",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <CreatorPanel
        userInput={userInput}
        setUserInput={setUserInput}
        selectedTheme={selectedTheme}
        setSelectedTheme={setSelectedTheme}
        selectedPlatforms={selectedPlatforms}
        setSelectedPlatforms={setSelectedPlatforms}
        onGenerate={handleGenerate}
        isGenerating={isGenerating}
      />
      <PreviewPanel
        generatedContent={generatedContent}
        setGeneratedContent={setGeneratedContent}
        onRegenerate={handleRegenerate}
        onSchedule={handleSchedule}
        isGenerating={isGenerating}
        hasGenerated={hasGenerated}
        aiModel={aiModel}
      />
    </div>
  )
}
