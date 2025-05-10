"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2 } from "lucide-react"

interface CreatorPanelProps {
  userInput: string
  setUserInput: (value: string) => void
  selectedTheme: string
  setSelectedTheme: (value: string) => void
  selectedPlatforms: string[]
  setSelectedPlatforms: (value: string[]) => void
  onGenerate: () => void
  isGenerating: boolean
}

export function CreatorPanel({
  userInput,
  setUserInput,
  selectedTheme,
  setSelectedTheme,
  selectedPlatforms,
  setSelectedPlatforms,
  onGenerate,
  isGenerating,
}: CreatorPanelProps) {
  const themes = [
    { value: "professional", label: "Professional" },
    { value: "casual", label: "Casual" },
    { value: "humorous", label: "Humorous" },
    { value: "inspirational", label: "Inspirational" },
    { value: "educational", label: "Educational" },
    { value: "promotional", label: "Promotional" },
    { value: "storytelling", label: "Storytelling" },
    { value: "question", label: "Question" },
    { value: "news", label: "News" },
  ]

  const platforms = ["Instagram", "Facebook", "LinkedIn", "X", "TikTok"]

  const togglePlatform = (platform: string) => {
    if (selectedPlatforms.includes(platform)) {
      setSelectedPlatforms(selectedPlatforms.filter((p) => p !== platform))
    } else {
      setSelectedPlatforms([...selectedPlatforms, platform])
    }
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Content Creator</CardTitle>
        <CardDescription>Create engaging content for your social media platforms</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Textarea
            placeholder="What's on your mind today?"
            className="min-h-[200px] resize-none"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Choose a Saved Theme</label>
          <Select value={selectedTheme} onValueChange={setSelectedTheme}>
            <SelectTrigger>
              <SelectValue placeholder="Select a theme" />
            </SelectTrigger>
            <SelectContent>
              {themes.map((theme) => (
                <SelectItem key={theme.value} value={theme.value}>
                  {theme.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Select Platforms</label>
          <div className="flex flex-wrap gap-2">
            {platforms.map((platform) => (
              <Button
                key={platform}
                variant={selectedPlatforms.includes(platform) ? "default" : "outline"}
                size="sm"
                onClick={() => togglePlatform(platform)}
                className="rounded-full"
              >
                {platform}
              </Button>
            ))}
          </div>
        </div>

        <Button className="w-full" onClick={onGenerate} disabled={!userInput.trim() || isGenerating}>
          {isGenerating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            "Generate"
          )}
        </Button>
      </CardContent>
    </Card>
  )
}
