"use client"

import { useState } from "react"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar"
import { AnalyticsHeader } from "@/components/analytics/analytics-header"
import { FilterBar } from "@/components/analytics/filter-bar"
import { RecentPostsTable } from "@/components/analytics/recent-posts-table"
import { Highlight } from "@/components/ui/highlight"
import { mockPosts } from "@/lib/mock-analytics-data"
import type { DateRange, SortDirection, SortColumn } from "@/types/analytics"

export default function AnalyticsPage() {
  const [dateRange, setDateRange] = useState<DateRange>("last30")
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(["Instagram", "Facebook", "LinkedIn", "X"])
  const [currentPage, setCurrentPage] = useState(1)
  const [sortColumn, setSortColumn] = useState<SortColumn>("date")
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc")

  // Filter and sort posts based on selected filters
  const filteredPosts = mockPosts.filter((post) => {
    // Filter by platform
    if (!selectedPlatforms.includes(post.platform)) {
      return false
    }

    // Filter by date range
    const postDate = new Date(post.date)
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())

    if (dateRange === "last7") {
      const sevenDaysAgo = new Date(today)
      sevenDaysAgo.setDate(today.getDate() - 7)
      return postDate >= sevenDaysAgo
    } else if (dateRange === "last30") {
      const thirtyDaysAgo = new Date(today)
      thirtyDaysAgo.setDate(today.getDate() - 30)
      return postDate >= thirtyDaysAgo
    } else if (dateRange === "last90") {
      const ninetyDaysAgo = new Date(today)
      ninetyDaysAgo.setDate(today.getDate() - 90)
      return postDate >= ninetyDaysAgo
    } else if (dateRange === "custom" && dateRange.startDate && dateRange.endDate) {
      return postDate >= dateRange.startDate && postDate <= dateRange.endDate
    }

    return true
  })

  // Sort posts
  const sortedPosts = [...filteredPosts].sort((a, b) => {
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

  // Calculate metrics for header cards
  const totalReach = filteredPosts.reduce((sum, post) => sum + post.reach, 0)
  const totalLikes = filteredPosts.reduce((sum, post) => sum + post.likes, 0)
  const totalComments = filteredPosts.reduce((sum, post) => sum + post.comments, 0)
  const totalShares = filteredPosts.reduce((sum, post) => sum + post.shares, 0)
  const totalEngagement = totalLikes + totalComments + totalShares
  const averageEngagementRate =
    filteredPosts.length > 0
      ? filteredPosts.reduce((sum, post) => sum + post.engagementRate, 0) / filteredPosts.length
      : 0

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
            postCount={filteredPosts.length}
            engagement={totalEngagement}
            audienceGrowth={342} // This would come from real data
            queueCount={8} // This would come from real data
          />

          <FilterBar
            dateRange={dateRange}
            setDateRange={setDateRange}
            selectedPlatforms={selectedPlatforms}
            setSelectedPlatforms={setSelectedPlatforms}
          />

          <RecentPostsTable
            posts={paginatedPosts}
            currentPage={currentPage}
            totalPages={totalPages}
            setCurrentPage={setCurrentPage}
            sortColumn={sortColumn}
            sortDirection={sortDirection}
            onSort={handleSort}
          />
        </main>
      </div>
    </div>
  )
}
