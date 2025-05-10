"use client"

import { useState } from "react"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar"
import { CalendarView } from "@/components/scheduling/calendar-view"
import { UpcomingPostsList } from "@/components/scheduling/upcoming-posts-list"
import { SchedulingModal } from "@/components/scheduling/scheduling-modal"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Highlight } from "@/components/ui/highlight"
import { format } from "date-fns"
import type { ScheduledPost } from "@/types/scheduling"

export default function SchedulePage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [scheduledPosts, setScheduledPosts] = useState<ScheduledPost[]>([
    {
      id: "1",
      content: "Excited to announce our new AI-powered content creation tool! #AIContent #ContentCreation",
      scheduledFor: new Date(2025, 4, 15, 10, 30),
      platform: "Twitter",
      image: null,
    },
    {
      id: "2",
      content:
        "The future of content creation is here. Our platform uses advanced AI to understand your brand voice and generate content that sounds just like you. Try it today!",
      scheduledFor: new Date(2025, 4, 18, 14, 0),
      platform: "LinkedIn",
      image: null,
    },
    {
      id: "3",
      content:
        "Content creation shouldn't be a bottleneck for your marketing team. Our AI tool helps you scale your content strategy without sacrificing quality or authenticity.",
      scheduledFor: new Date(2025, 4, 22, 9, 0),
      platform: "Facebook",
      image: null,
    },
  ])
  const [editingPost, setEditingPost] = useState<ScheduledPost | null>(null)

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

  const handleDeletePost = (postId: string) => {
    setScheduledPosts(scheduledPosts.filter((post) => post.id !== postId))
  }

  const handleSavePost = (post: ScheduledPost) => {
    if (editingPost) {
      // Update existing post
      setScheduledPosts(scheduledPosts.map((p) => (p.id === editingPost.id ? { ...post, id: editingPost.id } : p)))
    } else {
      // Add new post
      const newPost = {
        ...post,
        id: Math.random().toString(36).substring(2, 9),
      }
      setScheduledPosts([...scheduledPosts, newPost])
    }
    setIsModalOpen(false)
    setEditingPost(null)
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
              {scheduledPosts.length > 0
                ? `You have ${scheduledPosts.length} posts scheduled. Next post on ${format(
                    scheduledPosts.sort((a, b) => a.scheduledFor.getTime() - b.scheduledFor.getTime())[0].scheduledFor,
                    "MMMM d, yyyy 'at' h:mm a",
                  )}`
                : "You don't have any posts scheduled yet."}
            </p>
          </div>

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
