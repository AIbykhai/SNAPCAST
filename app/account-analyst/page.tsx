"use client"

import { useState } from "react"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar"
import { AnalystLayout } from "@/components/account-analyst/analyst-layout"
import { ResultsList } from "@/components/account-analyst/results-list"
import { UrlInputPanel } from "@/components/account-analyst/url-input-panel"
import { Highlight } from "@/components/ui/highlight"
import { analyzeAccount } from "@/lib/api-client"
import { useToast } from "@/hooks/use-toast"
import type { AnalysisResult, SortOption } from "@/types/analyst"

export default function AccountAnalystPage() {
  const [url, setUrl] = useState("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [results, setResults] = useState<AnalysisResult[]>([])
  const [sortOption, setSortOption] = useState<SortOption>("engagement")
  const [contentInspirationId, setContentInspirationId] = useState<string | null>(null)
  const [aiModel, setAiModel] = useState<string | null>(null)
  const { toast } = useToast()

  const handleAnalyze = async () => {
    if (!url) return

    setIsAnalyzing(true)

    try {
      // Call our API to analyze the account
      const result = await analyzeAccount({
        accountUrl: url,
      })

      setResults(result.results)
      setAiModel(result.model)

      toast({
        title: "Analysis complete",
        description: `Analyzed using ${result.model}`,
      })
    } catch (error) {
      console.error("Error analyzing account:", error)
      toast({
        title: "Error analyzing account",
        description: error instanceof Error ? error.message : "Please try again",
        variant: "destructive",
      })
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleReset = () => {
    setUrl("")
    setResults([])
    setContentInspirationId(null)
    setAiModel(null)
  }

  const handleUseAsInspiration = (postId: string) => {
    setContentInspirationId(postId)
    // In a real application, this would navigate to the content creator
    // or pass the selected post to the content creator component
    toast({
      title: "Inspiration selected",
      description: "Post selected as inspiration",
    })
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
            {aiModel && <p className="mt-2 text-sm text-muted-foreground">Analysis powered by {aiModel}</p>}
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
