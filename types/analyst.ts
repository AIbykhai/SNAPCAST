export type SortOption = "reach" | "engagement" | "theme"

export interface AnalysisResult {
  id: string
  title: string
  content: string
  theme: string
  reach: number
  engagementRate: number
}
