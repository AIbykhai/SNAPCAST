"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, Loader2 } from "lucide-react"

interface ImportFromSocialStepProps {
  formData: any
  setFormData: (data: any) => void
  onNext: () => void
  onBack: () => void
}

export function ImportFromSocialStep({ formData, setFormData, onNext, onBack }: ImportFromSocialStepProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  // Mock data for imported posts
  const mockPosts = [
    {
      id: 1,
      content:
        "Just launched our new AI-powered content creation tool! It helps businesses create engaging content 5x faster while maintaining brand consistency. #AIContent #ContentCreation",
    },
    {
      id: 2,
      content:
        "The future of content creation is here. Our platform uses advanced AI to understand your brand voice and generate content that sounds just like you. Try it today!",
    },
    {
      id: 3,
      content:
        "Content creation shouldn't be a bottleneck for your marketing team. Our AI tool helps you scale your content strategy without sacrificing quality or authenticity.",
    },
    {
      id: 4,
      content:
        "Wondering how AI can transform your content strategy? Join our webinar next week to learn how businesses are saving 15+ hours per week with our platform.",
    },
    {
      id: 5,
      content:
        "Consistency is key in building a strong brand. Our AI ensures your content maintains a consistent voice across all channels, even when multiple team members are involved.",
    },
    {
      id: 6,
      content:
        "We're excited to announce our integration with major social media platforms! Now you can create and schedule content all in one place.",
    },
    {
      id: 7,
      content:
        "Quality content at scale is no longer a pipe dream. Our AI analyzes your best-performing content to create more of what your audience loves.",
    },
    {
      id: 8,
      content:
        "Behind every great brand is a consistent voice. Our AI helps you maintain that voice across all your content, no matter who's creating it.",
    },
    {
      id: 9,
      content:
        "ROI matters. Our customers report a 40% increase in engagement after implementing our AI content creation tools. #ContentMarketing",
    },
    {
      id: 10,
      content:
        "We believe AI should enhance human creativity, not replace it. That's why our platform focuses on collaboration between AI and content creators.",
    },
  ]

  const handleFetchPosts = () => {
    if (!formData.socialMediaUrl) {
      setError("Please enter a valid social media URL")
      return
    }

    setIsLoading(true)
    setError("")

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      setFormData({
        ...formData,
        importedPosts: mockPosts,
      })
    }, 1500)
  }

  const handlePostSelection = (postId: number) => {
    const currentSelected = [...formData.selectedPosts]

    if (currentSelected.includes(postId)) {
      // Remove if already selected
      setFormData({
        ...formData,
        selectedPosts: currentSelected.filter((id) => id !== postId),
      })
    } else {
      // Add if not selected and less than 3 are selected
      if (currentSelected.length < 3) {
        setFormData({
          ...formData,
          selectedPosts: [...currentSelected, postId],
        })
      }
    }
  }

  const isNextDisabled = formData.selectedPosts.length !== 3

  return (
    <Card className="shadow-lg">
      <CardContent className="p-6">
        <div className="mb-6">
          <h2 className="mb-2 text-2xl font-semibold">Import from Social Media</h2>
          <p className="text-gray-600">Enter your social media profile URL to import your posts</p>
        </div>

        <div className="mb-6 flex space-x-2">
          <Input
            placeholder="https://twitter.com/yourusername"
            value={formData.socialMediaUrl}
            onChange={(e) => setFormData({ ...formData, socialMediaUrl: e.target.value })}
            className="flex-1"
          />
          <Button onClick={handleFetchPosts} disabled={isLoading || !formData.socialMediaUrl}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Fetching...
              </>
            ) : (
              "Fetch"
            )}
          </Button>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {formData.importedPosts.length > 0 && (
          <div className="mb-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-medium">Select 3 posts</h3>
              <span className="text-sm text-gray-500">{formData.selectedPosts.length}/3 selected</span>
            </div>

            <div className="space-y-4">
              {formData.importedPosts.map((post: any) => (
                <div key={post.id} className="flex space-x-3 rounded-lg border p-4">
                  <Checkbox
                    id={`post-${post.id}`}
                    checked={formData.selectedPosts.includes(post.id)}
                    onCheckedChange={() => handlePostSelection(post.id)}
                    disabled={formData.selectedPosts.length >= 3 && !formData.selectedPosts.includes(post.id)}
                  />
                  <div className="flex-1">
                    <Label htmlFor={`post-${post.id}`} className="text-sm">
                      {post.content}
                    </Label>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

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
