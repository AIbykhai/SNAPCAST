import type React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowUp, Calendar, Users } from "lucide-react"

interface AnalyticsHeaderProps {
  postCount: number
  engagement: number
  audienceGrowth: number
  queueCount: number
}

export function AnalyticsHeader({ postCount, engagement, audienceGrowth, queueCount }: AnalyticsHeaderProps) {
  return (
    <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <MetricCard
        title="Recent Posts"
        value={`${postCount}`}
        description="Last 30 days"
        trend="up"
        percentage="+12%"
        icon={<ArrowUp className="h-4 w-4" />}
      />
      <MetricCard
        title="Engagement"
        value={engagement.toLocaleString()}
        description="Likes, comments, shares"
        trend="up"
        percentage="+18%"
        icon={<ArrowUp className="h-4 w-4" />}
      />
      <MetricCard
        title="Audience Growth"
        value={audienceGrowth.toLocaleString()}
        description="New followers"
        trend="up"
        percentage="+7%"
        icon={<Users className="h-4 w-4" />}
      />
      <MetricCard
        title="Content Queue"
        value={queueCount.toString()}
        description="Scheduled posts"
        trend="neutral"
        percentage="-2"
        icon={<Calendar className="h-4 w-4" />}
      />
    </div>
  )
}

interface MetricCardProps {
  title: string
  value: string
  description: string
  trend: "up" | "down" | "neutral"
  percentage: string
  icon: React.ReactNode
}

function MetricCard({ title, value, description, trend, percentage, icon }: MetricCardProps) {
  return (
    <Card>
      <CardContent className="flex items-center justify-between p-4">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold">{value}</p>
          <div className="flex items-center">
            <span
              className={`mr-1 text-xs ${
                trend === "up" ? "text-green-600" : trend === "down" ? "text-red-600" : "text-gray-600"
              }`}
            >
              {percentage}
            </span>
            <p className="text-xs text-muted-foreground">{description}</p>
          </div>
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
