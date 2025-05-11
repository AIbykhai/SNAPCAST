"use client"

import { useState, useEffect } from "react"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar"
import { AnalyticsHeader } from "@/components/analytics/analytics-header"
import { FilterBar } from "@/components/analytics/filter-bar"
import { RecentPostsTable } from "@/components/analytics/recent-posts-table"
import { Highlight } from "@/components/ui/highlight"
import { getAnalytics } from "@/lib/api-client"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"
import type { DateRange, SortDirection, SortColumn, Post } from "@/types/analytics"

export default function AnalyticsPage() {
  const [dateRange, setDateRange] = useState<DateRange>("last30")
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(["Instagram", "Facebook", "LinkedIn", "X"])
  const [currentPage, setCurrentPage] = useState(1)
  const [sortColumn, setSortColumn] = useState<SortColumn>("date")
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc")
  const [isLoading, setIsLoading] = useState(true)
  const [posts, setPosts] = useState<Post[]>([])
  const [summary, setSummary] = useState({
    totalPosts: 0,
    totalReach: 0,
    totalLikes: 0,
    totalComments: 0,
    totalShares: 0,
    totalEngagement: 0,
    averageEngagementRate: "0",
  })
  const { toast } = useToast()

  // Fetch analytics data
  useEffect(() => {
    async function fetchAnalytics() {
      setIsLoading(true)

      try {
        // Prepare date parameters
        let startDate: string | undefined
        let endDate: string | undefined

        const now = new Date()
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())

        if (dateRange === "last7") {
          const sevenDaysAgo = new Date(today)
          sevenDaysAgo.setDate(today.getDate() - 7)
          startDate = sevenDaysAgo.toISOString()
        } else if (dateRange === "last30") {
          const thirtyDaysAgo = new Date(today)
          thirtyDaysAgo.setDate(today.getDate() - 30)
          startDate = thirtyDaysAgo.toISOString()
        } else if (dateRange === "last90") {
          const ninetyDaysAgo = new Date(today)
          ninetyDaysAgo.setDate(today.getDate() - 90)
          startDate = ninetyDaysAgo.toISOString()
        } else if (dateRange === "custom" && dateRange.startDate && dateRange.endDate) {
          startDate = dateRange.startDate.toISOString()
          endDate = dateRange.endDate.toISOString()
        }

        // Get analytics data
        const data = await getAnalytics({
          startDate,
          endDate,
          platforms: selectedPlatforms,
        })

        // Transform data for the table
        const transformedPosts: Post[] = data.posts.map((item: any) => ({
          id: item.post.id,
          platform: item.post.platform,
          date: item.post.publishedAt || item.post.createdAt,
          content: item.post.content,
          reach: item.analytics?.reach || 0,
          likes: item.analytics?.likes || 0,
          comments: item.analytics?.comments || 0,
          shares: item.analytics?.shares || 0,
          engagementRate: Number.parseFloat(item.analytics?.engagementRate || "0"),
        }))

        setPosts(transformedPosts)
        setSummary(data.summary)
      } catch (error) {
        console.error("Error fetching analytics:", error)
        toast({
          title: "Error fetching analytics",
          description: "Failed to load analytics data",
          variant: "destructive",
        })

        // Set empty data
        setPosts([])
        setSummary({
          totalPosts: 0,
          totalReach: 0,
          totalLikes: 0,
          totalComments: 0,
          totalShares: 0,
          totalEngagement: 0,
          averageEngagementRate: "0",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchAnalytics()
  }, [dateRange, selectedPlatforms, toast])

  // Sort posts
  const sortedPosts = [...posts].sort((a, b) => {
    if (sortColumn === "date") {
      return sortDirection === "asc"
        ? new Date(a.date).getTime() - new Date(b.date).getTime()
        : new Date(b.date).getTime() - new Date(a.date).getTime()
    } else if (sortColumn === "reach") {
      return sortDirection === "asc" ? a.reach - b.reach : b.reach - a.reach
    } else if (sortColumn === "likes") {
      return sortDirection === "asc" ? a.likes - b.likes : b.likes - a.likes
    } else if (sortColumn === "comments") {
      return sortDirection === "asc" ? a.comments - b.comments : b.comments - a.comments
    } else if (sortColumn === "shares") {
      return sortDirection === "asc" ? a.shares - b.shares : b.shares - a.shares
    } else if (sortColumn === "engagementRate") {
      return sortDirection === "asc" ? a.engagementRate - b.engagementRate : b.engagementRate - a.engagementRate
    }
    return 0
  })

  // Paginate posts
  const postsPerPage = 20
  const totalPages = Math.ceil(sortedPosts.length / postsPerPage)
  const paginatedPosts = sortedPosts.slice((currentPage - 1) * postsPerPage, currentPage * postsPerPage)

  const handleSort = (column: SortColumn) => {
    if (sortColumn === column) {
      // Toggle sort direction if clicking the same column
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      // Set new sort column and default to descending
      setSortColumn(column)
      setSortDirection("desc")
    }
    // Reset to first page when sorting
    setCurrentPage(1)
  }

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <DashboardSidebar />
      <div className="flex-1">
        <DashboardHeader />
        <main className="container mx-auto p-4 md:p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold md:text-3xl">
              Content <Highlight>Analytics</Highlight>
            </h1>
            <p className="text-muted-foreground">Track your content performance across all platforms</p>
          </div>

          <AnalyticsHeader
            postCount={summary.totalPosts}
            engagement={summary.totalEngagement}
            audienceGrowth={342} // This would come from real data
            queueCount={8} // This would come from real data
          />

          <FilterBar
            dateRange={dateRange}
            setDateRange={setDateRange}
            selectedPlatforms={selectedPlatforms}
            setSelectedPlatforms={setSelectedPlatforms}
          />

          {isLoading ? (
            <div className="flex items-center justify-center rounded-lg border p-12">
              <div className="flex flex-col items-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="mt-2 text-sm text-muted-foreground">Loading analytics data...</p>
              </div>
            </div>
          ) : (
            <RecentPostsTable
              posts={paginatedPosts}
              currentPage={currentPage}
              totalPages={totalPages}
              setCurrentPage={setCurrentPage}
              sortColumn={sortColumn}
              sortDirection={sortDirection}
              onSort={handleSort}
            />
          )}
        </main>
      </div>
    </div>
  )
}
