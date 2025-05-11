"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { format } from "date-fns"
import { Edit2, Trash2 } from "lucide-react"
import type { ScheduledPost } from "@/types/scheduling"

interface UpcomingPostsListProps {
  scheduledPosts: ScheduledPost[]
  onEditPost: (post: ScheduledPost) => void
  onDeletePost: (postId: string) => void
}

export function UpcomingPostsList({ scheduledPosts, onEditPost, onDeletePost }: UpcomingPostsListProps) {
  // Sort posts by date (earliest first)
  const sortedPosts = [...scheduledPosts].sort((a, b) => a.scheduledFor.getTime() - b.scheduledFor.getTime())

  if (sortedPosts.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center p-6 text-center">
          <p className="mb-2 text-lg font-medium">No scheduled posts</p>
          <p className="text-muted-foreground">
            Your scheduled posts will appear here. Use the calendar to schedule new posts.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {sortedPosts.map((post) => (
        <Card key={post.id} className="overflow-hidden">
          <CardContent className="p-0">
            <div className="flex flex-col border-l-4 border-primary sm:flex-row">
              <div className="flex flex-col justify-center p-4 sm:w-48">
                <p className="font-medium">{format(post.scheduledFor, "MMMM d, yyyy")}</p>
                <p className="text-sm text-muted-foreground">{format(post.scheduledFor, "h:mm a")}</p>
                <div className="mt-2 inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                  {post.platform}
                </div>
              </div>

              <div className="flex flex-1 flex-col justify-center border-l p-4">
                <p className="line-clamp-2 text-sm">{post.content}</p>
                {post.image && (
                  <div className="mt-2">
                    <div className="h-10 w-10 rounded-md bg-muted">
                      <img
                        src={post.image || "/placeholder.svg"}
                        alt="Post attachment"
                        className="h-full w-full rounded-md object-cover"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-end gap-2 p-4">
                <Button variant="ghost" size="icon" onClick={() => onEditPost(post)} title="Edit post">
                  <Edit2 className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onDeletePost(post.id)}
                  className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                  title="Delete post"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
