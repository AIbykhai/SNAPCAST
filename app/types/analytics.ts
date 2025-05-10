export type DateRange =
  | "last7"
  | "last30"
  | "last90"
  | ("custom" & {
      startDate?: Date
      endDate?: Date
    })

export type SortColumn = "date" | "reach" | "likes" | "comments" | "shares" | "engagementRate"
export type SortDirection = "asc" | "desc"

export interface Post {
  id: string
  platform: string
  date: string
  content: string
  reach: number
  likes: number
  comments: number
  shares: number
  engagementRate: number
}
