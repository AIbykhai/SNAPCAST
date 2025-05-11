import type React from "react"
import { Highlight } from "@/components/ui/highlight"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowUp, Calendar, Users } from "lucide-react"
import Link from "next/link"

export function DashboardHeader() {
  return (
    <div className="border-b bg-background p-4 md:p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold md:text-3xl">
          Welcome back,{" "}
          <Link href="/profile" className="hover:underline">
            <Highlight>Alex</Highlight>
          </Link>
        </h1>
        <p className="text-muted-foreground">Here's what's happening with your content today.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Recent Posts"
          value="+12%"
          description="Last 30 days"
          trend="up"
          icon={<ArrowUp className="h-4 w-4" />}
        />
        <MetricCard
          title="Engagement"
          value="1.2K"
          description="Likes, comments, shares"
          trend="up"
          icon={<ArrowUp className="h-4 w-4" />}
        />
        <MetricCard
          title="Audience Growth"
          value="342"
          description="New followers"
          trend="up"
          icon={<Users className="h-4 w-4" />}
        />
        <MetricCard
          title="Content Queue"
          value="8"
          description="Scheduled posts"
          trend="neutral"
          icon={<Calendar className="h-4 w-4" />}
        />
      </div>
    </div>
  )
}

interface MetricCardProps {
  title: string
  value: string
  description: string
  trend: "up" | "down" | "neutral"
  icon: React.ReactNode
}

function MetricCard({ title, value, description, trend, icon }: MetricCardProps) {
  return (
    <Card>
      <CardContent className="flex items-center justify-between p-4">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold">{value}</p>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
        <div
          className={`flex h-8 w-8 items-center justify-center rounded-full ${
            trend === "up"
              ? "bg-green-100 text-green-600"
              : trend === "down"
                ? "bg-red-100 text-red-600"
                : "bg-gray-100 text-gray-600"
          }`}
        >
          {icon}
        </div>
      </CardContent>
    </Card>
  )
}
