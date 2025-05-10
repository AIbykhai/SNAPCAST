"use client"

import { useState } from "react"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar"
import { AnalystLayout } from "@/components/account-analyst/analyst-layout"
import { ResultsList } from "@/components/account-analyst/results-list"
import { UrlInputPanel } from "@/components/account-analyst/url-input-panel"
import { Highlight } from "@/components/ui/highlight"
import { mockAnalysisResults } from "@/lib/mock-data"
import type { AnalysisResult, SortOption } from "@/types/analyst"

export default function AccountAnalystPage() {
  const [url, setUrl] = useState("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [results, setResults] = useState<AnalysisResult[]>([])
  const [sortOption, setSortOption] = useState<SortOption>("engagement")
  const [contentInspirationId, setContentInspirationId] = useState<string | null>(null)

  const handleAnalyze = async () => {
    if (!url) return

    setIsAnalyzing(true)

    try {
      // In a real application, this would be an API call to analyze the URL
      // For this example, we'll use mock data
      await new Promise((resolve) => setTimeout(resolve, 1500))
      setResults(mockAnalysisResults)
    } catch (error) {
      console.error("Error analyzing account:", error)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleReset = () => {
    setUrl("")
    setResults([])
    setContentInspirationId(null)
  }

  const handleUseAsInspiration = (postId: string) => {
    setContentInspirationId(postId)
    // In a real application, this would navigate to the content creator
    // or pass the selected post to the content creator component
    console.log("Using post as inspiration:", postId)
  }

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <DashboardSidebar />
      <div className="flex-1">
        <DashboardHeader />
        <main className="container mx-auto p-4 md:p-6">
          <div className="mb-8">
            <h1 className="mb-2 text-3xl font-bold md:text-4xl">
              AI <Highlight>Account Analyst</Highlight>
            </h1>
            <p className="text-gray-600">
              Analyze any social media account to discover top-performing content and themes
            </p>
          </div>

          <AnalystLayout>
            <UrlInputPanel
              url={url}
              setUrl={setUrl}
              onAnalyze={handleAnalyze}
              onReset={handleReset}
              isAnalyzing={isAnalyzing}
            />

            <ResultsList
              results={results}
              sortOption={sortOption}
              setSortOption={setSortOption}
              onUseAsInspiration={handleUseAsInspiration}
              contentInspirationId={contentInspirationId}
              isLoading={isAnalyzing}
            />
          </AnalystLayout>
        </main>
      </div>
    </div>
  )
}
