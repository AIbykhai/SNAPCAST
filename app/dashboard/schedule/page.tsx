"use client"

import { useState, useEffect } from "react"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar"
import { CalendarView } from "@/components/scheduling/calendar-view"
import { UpcomingPostsList } from "@/components/scheduling/upcoming-posts-list"
import { SchedulingModal } from "@/components/scheduling/scheduling-modal"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Highlight } from "@/components/ui/highlight"
import { format } from "date-fns"
import { getPosts, createPost, updatePost, deletePost } from "@/lib/api-client"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"
import type { ScheduledPost } from "@/types/scheduling"

export default function SchedulePage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [scheduledPosts, setScheduledPosts] = useState<ScheduledPost[]>([])
  const [editingPost, setEditingPost] = useState<ScheduledPost | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  // Fetch scheduled posts
  useEffect(() => {
    async function fetchPosts() {
      setIsLoading(true)

      try {
        const posts = await getPosts({ status: "scheduled" })

        // Transform posts to ScheduledPost format
        const transformedPosts: ScheduledPost[] = posts.map((post: any) => ({
          id: post.id,
          content: post.content,
          scheduledFor: new Date(post.scheduledFor),
          platform: post.platform,
          image: post.image,
        }))

        setScheduledPosts(transformedPosts)
      } catch (error) {
        console.error("Error fetching scheduled posts:", error)
        toast({
          title: "Error fetching posts",
          description: "Failed to load scheduled posts",
          variant: "destructive",
        })

        // Set empty data
        setScheduledPosts([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchPosts()
  }, [toast])

  const handleDateClick = (date: Date) => {
    setSelectedDate(date)
    setEditingPost(null)
    setIsModalOpen(true)
  }

  const handleEditPost = (post: ScheduledPost) => {
    setEditingPost(post)
    setSelectedDate(post.scheduledFor)
    setIsModalOpen(true)
  }

  const handleDeletePost = async (postId: string) => {
    try {
      await deletePost(postId)

      // Update local state
      setScheduledPosts(scheduledPosts.filter((post) => post.id !== postId))

      toast({
        title: "Post deleted",
        description: "The scheduled post has been deleted",
      })
    } catch (error) {
      console.error("Error deleting post:", error)
      toast({
        title: "Error deleting post",
        description: error instanceof Error ? error.message : "Please try again",
        variant: "destructive",
      })
    }
  }

  const handleSavePost = async (post: ScheduledPost) => {
    try {
      if (editingPost) {
        // Update existing post
        await updatePost(editingPost.id, {
          content: post.content,
          platform: post.platform,
          scheduledFor: post.scheduledFor.toISOString(),
          image: post.image,
        })

        // Update local state
        setScheduledPosts(scheduledPosts.map((p) => (p.id === editingPost.id ? { ...post, id: editingPost.id } : p)))

        toast({
          title: "Post updated",
          description: "The scheduled post has been updated",
        })
      } else {
        // Create new post
        const newPost = await createPost({
          content: post.content,
          platform: post.platform,
          scheduledFor: post.scheduledFor.toISOString(),
          image: post.image,
        })

        // Update local state
        setScheduledPosts([
          ...scheduledPosts,
          {
            id: newPost.id,
            content: newPost.content,
            scheduledFor: new Date(newPost.scheduledFor),
            platform: newPost.platform,
            image: newPost.image,
          },
        ])

        toast({
          title: "Post scheduled",
          description: "Your post has been scheduled",
        })
      }

      setIsModalOpen(false)
      setEditingPost(null)
    } catch (error) {
      console.error("Error saving post:", error)
      toast({
        title: "Error saving post",
        description: error instanceof Error ? error.message : "Please try again",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <DashboardSidebar />
      <div className="flex-1">
        <DashboardHeader />
        <main className="container mx-auto p-4 md:p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold md:text-3xl">
              Content <Highlight>Schedule</Highlight>
            </h1>
            <p className="text-muted-foreground">
              {isLoading ? (
                <span className="flex items-center">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Loading scheduled posts...
                </span>
              ) : scheduledPosts.length > 0 ? (
                `You have ${scheduledPosts.length} posts scheduled. Next post on ${format(
                  scheduledPosts.sort((a, b) => a.scheduledFor.getTime() - b.scheduledFor.getTime())[0].scheduledFor,
                  "MMMM d, yyyy 'at' h:mm a",
                )}`
              ) : (
                "You don't have any posts scheduled yet."
              )}
            </p>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center rounded-lg border p-12">
              <div className="flex flex-col items-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="mt-2 text-sm text-muted-foreground">Loading scheduled posts...</p>
              </div>
            </div>
          ) : (
            <Tabs defaultValue="calendar" className="w-full">
              <TabsList className="mb-4">
                <TabsTrigger value="calendar">Calendar View</TabsTrigger>
                <TabsTrigger value="list">List View</TabsTrigger>
              </TabsList>
              <TabsContent value="calendar">
                <CalendarView scheduledPosts={scheduledPosts} onDateClick={handleDateClick} />
              </TabsContent>
              <TabsContent value="list">
                <UpcomingPostsList
                  scheduledPosts={scheduledPosts}
                  onEditPost={handleEditPost}
                  onDeletePost={handleDeletePost}
                />
              </TabsContent>
            </Tabs>
          )}

          <SchedulingModal
            isOpen={isModalOpen}
            onClose={() => {
              setIsModalOpen(false)
              setEditingPost(null)
            }}
            selectedDate={selectedDate}
            onSave={handleSavePost}
            editingPost={editingPost}
          />
        </main>
      </div>
    </div>
  )
}
