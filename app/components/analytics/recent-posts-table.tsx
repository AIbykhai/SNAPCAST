"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ChevronLeft, ChevronRight, ArrowDown, ArrowUp } from "lucide-react"
import { format } from "date-fns"
import type { Post, SortColumn, SortDirection } from "@/types/analytics"

interface RecentPostsTableProps {
  posts: Post[]
  currentPage: number
  totalPages: number
  setCurrentPage: (page: number) => void
  sortColumn: SortColumn
  sortDirection: SortDirection
  onSort: (column: SortColumn) => void
}

export function RecentPostsTable({
  posts,
  currentPage,
  totalPages,
  setCurrentPage,
  sortColumn,
  sortDirection,
  onSort,
}: RecentPostsTableProps) {
  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1)
    }
  }

  const renderSortIcon = (column: SortColumn) => {
    if (sortColumn === column) {
      return sortDirection === "asc" ? <ArrowUp className="ml-1 h-4 w-4" /> : <ArrowDown className="ml-1 h-4 w-4" />
    }
    return null
  }

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case "Instagram":
        return "📸"
      case "Facebook":
        return "👥"
      case "LinkedIn":
        return "💼"
      case "X":
        return "🔄"
      default:
        return "📱"
    }
  }

  return (
    <Card>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">Platform</TableHead>
              <TableHead className="cursor-pointer" onClick={() => onSort("date")}>
                <div className="flex items-center">
                  Date & Time
                  {renderSortIcon("date")}
                </div>
              </TableHead>
              <TableHead className="max-w-[300px]">Content</TableHead>
              <TableHead className="cursor-pointer text-right" onClick={() => onSort("reach")}>
                <div className="flex items-center justify-end">
                  Reach
                  {renderSortIcon("reach")}
                </div>
              </TableHead>
              <TableHead className="cursor-pointer text-right" onClick={() => onSort("likes")}>
                <div className="flex items-center justify-end">
                  Likes
                  {renderSortIcon("likes")}
                </div>
              </TableHead>
              <TableHead className="cursor-pointer text-right" onClick={() => onSort("comments")}>
                <div className="flex items-center justify-end">
                  Comments
                  {renderSortIcon("comments")}
                </div>
              </TableHead>
              <TableHead className="cursor-pointer text-right" onClick={() => onSort("shares")}>
                <div className="flex items-center justify-end">
                  Shares
                  {renderSortIcon("shares")}
                </div>
              </TableHead>
              <TableHead className="cursor-pointer text-right" onClick={() => onSort("engagementRate")}>
                <div className="flex items-center justify-end">
                  Engagement Rate
                  {renderSortIcon("engagementRate")}
                </div>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {posts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center">
                  No posts found for the selected filters.
                </TableCell>
              </TableRow>
            ) : (
              posts.map((post) => (
                <TableRow key={post.id}>
                  <TableCell className="font-medium">
                    <span className="text-xl" title={post.platform}>
                      {getPlatformIcon(post.platform)}
                    </span>
                  </TableCell>
                  <TableCell>
                    {format(new Date(post.date), "MMM d, yyyy")}
                    <br />
                    <span className="text-xs text-muted-foreground">{format(new Date(post.date), "h:mm a")}</span>
                  </TableCell>
                  <TableCell className="max-w-[300px]">
                    <div className="line-clamp-2 text-sm">{post.content}</div>
                  </TableCell>
                  <TableCell className="text-right">{post.reach.toLocaleString()}</TableCell>
                  <TableCell className="text-right">{post.likes.toLocaleString()}</TableCell>
                  <TableCell className="text-right">{post.comments.toLocaleString()}</TableCell>
                  <TableCell className="text-right">{post.shares.toLocaleString()}</TableCell>
                  <TableCell className="text-right">{(post.engagementRate * 100).toFixed(2)}%</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {posts.length > 0 && (
        <div className="flex items-center justify-between p-4">
          <div className="text-sm text-muted-foreground">
            Showing {(currentPage - 1) * 20 + 1}-{Math.min(currentPage * 20, posts.length)} of {posts.length} posts
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={handlePreviousPage} disabled={currentPage === 1}>
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>
            <div className="text-sm">
              Page {currentPage} of {totalPages}
            </div>
            <Button variant="outline" size="sm" onClick={handleNextPage} disabled={currentPage === totalPages}>
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </Card>
  )
}
