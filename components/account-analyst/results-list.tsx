"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { Sparkles } from "lucide-react"
import type { AnalysisResult, SortOption } from "@/types/analyst"

interface ResultsListProps {
  results: AnalysisResult[]
  sortOption: SortOption
  setSortOption: (option: SortOption) => void
  onUseAsInspiration: (postId: string) => void
  contentInspirationId: string | null
  isLoading: boolean
}

export function ResultsList({
  results,
  sortOption,
  setSortOption,
  onUseAsInspiration,
  contentInspirationId,
  isLoading,
}: ResultsListProps) {
  const [sortedResults, setSortedResults] = useState<AnalysisResult[]>([])

  useEffect(() => {
    // Sort results based on the selected sort option
    const sorted = [...results].sort((a, b) => {
      if (sortOption === "reach") {
        return b.reach - a.reach
      } else if (sortOption === "engagement") {
        return b.engagementRate - a.engagementRate
      } else if (sortOption === "theme") {
        return a.theme.localeCompare(b.theme)
      }
      return 0
    })

    setSortedResults(sorted)
  }, [results, sortOption])

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Analyzing Account...</h2>
        </div>
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardHeader className="pb-2">
              <Skeleton className="h-4 w-3/4" />
            </CardHeader>
            <CardContent className="pb-2">
              <Skeleton className="mb-2 h-16" />
              <div className="flex items-center justify-between">
                <Skeleton className="h-6 w-16" />
                <div className="flex space-x-2">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-16" />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Skeleton className="h-9 w-full" />
            </CardFooter>
          </Card>
        ))}
      </div>
    )
  }

  if (results.length === 0) {
    return (
      <div className="rounded-lg border p-8 text-center">
        <h2 className="mb-2 text-xl font-semibold">No Results Yet</h2>
        <p className="mb-4 text-muted-foreground">
          Enter a social media account URL and click "Analyze" to see top-performing content
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Top Performing Content</h2>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-muted-foreground">Sort by:</span>
          <Select value={sortOption} onValueChange={(value) => setSortOption(value as SortOption)}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="engagement">Engagement Rate</SelectItem>
              <SelectItem value="reach">Reach</SelectItem>
              <SelectItem value="theme">Theme</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {sortedResults.map((result) => (
        <Card key={result.id} className={contentInspirationId === result.id ? "border-primary" : ""}>
          <CardHeader className="pb-2">
            <h3 className="font-medium">{result.title}</h3>
          </CardHeader>
          <CardContent className="pb-2">
            <p className="mb-3 text-sm text-muted-foreground line-clamp-3">{result.content}</p>
            <div className="flex items-center justify-between">
              <Badge variant="outline" className="bg-accent text-accent-foreground">
                {result.theme}
              </Badge>
              <div className="flex space-x-4 text-sm">
                <div>
                  <span className="font-medium">{result.reach.toLocaleString()}</span>{" "}
                  <span className="text-muted-foreground">Reach</span>
                </div>
                <div>
                  <span className="font-medium">{(result.engagementRate * 100).toFixed(1)}%</span>{" "}
                  <span className="text-muted-foreground">Engagement</span>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button
              variant={contentInspirationId === result.id ? "default" : "outline"}
              className="w-full"
              onClick={() => onUseAsInspiration(result.id)}
            >
              <Sparkles className="mr-2 h-4 w-4" />
              {contentInspirationId === result.id ? "Selected as Inspiration" : "Use as Inspiration"}
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
