"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Loader2 } from "lucide-react"

interface UrlInputPanelProps {
  url: string
  setUrl: (url: string) => void
  onAnalyze: () => void
  onReset: () => void
  isAnalyzing: boolean
}

export function UrlInputPanel({ url, setUrl, onAnalyze, onReset, isAnalyzing }: UrlInputPanelProps) {
  return (
    <Card className="sticky top-4">
      <CardHeader>
        <CardTitle>Account URL</CardTitle>
        <CardDescription>Enter a social media account URL to analyze their top-performing content</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <Input
              placeholder="https://twitter.com/username"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              disabled={isAnalyzing}
            />
            <p className="text-xs text-muted-foreground">
              Supports Twitter, Instagram, LinkedIn, and Facebook profiles
            </p>
          </div>

          <div className="flex items-center justify-between">
            <Button onClick={onAnalyze} disabled={!url.trim() || isAnalyzing} className="w-full">
              {isAnalyzing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                "Analyze"
              )}
            </Button>
          </div>

          {(url.trim() || isAnalyzing) && (
            <div className="text-center">
              <button
                onClick={onReset}
                className="text-sm text-muted-foreground underline hover:text-primary"
                disabled={isAnalyzing}
              >
                Reset
              </button>
            </div>
          )}

          <div className="rounded-lg border p-4">
            <h3 className="mb-2 font-medium">How it works</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>1. Enter a social media account URL</li>
              <li>2. Our AI analyzes their top-performing content</li>
              <li>3. Use the insights to inspire your own content</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
