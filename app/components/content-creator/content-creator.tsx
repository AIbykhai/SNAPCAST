"use client"

import { useState } from "react"
import { CreatorPanel } from "./creator-panel"
import { PreviewPanel } from "./preview-panel"

export function ContentCreator() {
  const [userInput, setUserInput] = useState("")
  const [selectedTheme, setSelectedTheme] = useState("")
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(["Instagram"])
  const [generatedContent, setGeneratedContent] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [hasGenerated, setHasGenerated] = useState(false)

  const handleGenerate = () => {
    if (!userInput) return

    setIsGenerating(true)

    // Simulate API call to generate content
    setTimeout(() => {
      const platformText = selectedPlatforms.includes("Instagram")
        ? "Perfect for Instagram! 📸✨"
        : selectedPlatforms.includes("LinkedIn")
          ? "Great for your professional network on LinkedIn! 💼"
          : selectedPlatforms.includes("Facebook")
            ? "Share this with your Facebook community! 👥"
            : selectedPlatforms.includes("X")
              ? "Tweet this out! 🔄"
              : "Share on TikTok! 🎵"

      const themeText = selectedTheme ? `Using your "${selectedTheme}" theme: ` : ""

      setGeneratedContent(
        `${themeText}${userInput}\n\n${platformText}\n\nHere's some additional engaging content based on your input: ${userInput.split(" ").reverse().join(" ")}. This will help boost your engagement and connect with your audience!`,
      )
      setIsGenerating(false)
      setHasGenerated(true)
    }, 1500)
  }

  const handleRegenerate = () => {
    setIsGenerating(true)

    // Simulate API call to regenerate content
    setTimeout(() => {
      setGeneratedContent(
        `Here's a fresh take on your content: ${userInput}\n\nThis alternative approach will help you stand out and engage your audience in a new way. Try adding some emojis for extra personality! ✨🚀`,
      )
      setIsGenerating(false)
    }, 1500)
  }

  const handleSchedule = () => {
    // In a real app, this would open a scheduling modal or navigate to scheduling page
    alert("Content scheduled successfully!")
    setUserInput("")
    setGeneratedContent("")
    setHasGenerated(false)
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
      />
    </div>
  )
}
