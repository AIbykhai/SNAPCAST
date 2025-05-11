"use client"

import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar"
import { ContentCreator } from "@/components/content-creator/content-creator"
import { Highlight } from "@/components/ui/highlight"

export default function CreatorPage() {
  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <DashboardSidebar />
      <div className="flex-1">
        <DashboardHeader />
        <main className="container mx-auto p-4 md:p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold md:text-3xl">
              Content <Highlight>Creator</Highlight>
            </h1>
            <p className="text-muted-foreground">Create engaging content for your social media platforms</p>
          </div>
          <ContentCreator />
        </main>
      </div>
    </div>
  )
}
