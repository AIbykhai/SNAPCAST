"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  format,
  isSameMonth,
  isSameDay,
  isToday,
  addDays,
  startOfWeek,
} from "date-fns"
import type { ScheduledPost } from "@/types/scheduling"

interface CalendarViewProps {
  scheduledPosts: ScheduledPost[]
  onDateClick: (date: Date) => void
}

export function CalendarView({ scheduledPosts, onDateClick }: CalendarViewProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date())

  const prevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1))
  }

  const nextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1))
  }

  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(monthStart)
  const startDate = startOfWeek(monthStart)
  const endDate = addDays(startOfWeek(monthEnd), 41) // 6 weeks total

  const days = eachDayOfInterval({ start: startDate, end: endDate })

  const getPostsForDate = (date: Date) => {
    return scheduledPosts.filter((post) => isSameDay(post.scheduledFor, date))
  }

  return (
    <Card className="p-4">
      <div className="mb-4 flex items-center justify-between">
        <Button variant="outline" size="icon" onClick={prevMonth}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-xl font-semibold">{format(currentMonth, "MMMM yyyy")}</h2>
        <Button variant="outline" size="icon" onClick={nextMonth}>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day} className="py-2 text-sm font-medium text-muted-foreground">
            {day}
          </div>
        ))}

        {days.map((day) => {
          const postsForDay = getPostsForDate(day)
          const isCurrentMonth = isSameMonth(day, currentMonth)
          const isCurrentDay = isToday(day)

          return (
            <div
              key={day.toString()}
              className={`relative min-h-[80px] rounded-md border p-1 ${
                isCurrentMonth ? "bg-background" : "bg-muted/30"
              } ${isCurrentDay ? "border-primary" : ""}`}
            >
              <div className="flex justify-between">
                <span
                  className={`text-sm ${
                    isCurrentMonth ? "text-foreground" : "text-muted-foreground"
                  } ${isCurrentDay ? "font-bold text-primary" : ""}`}
                >
                  {format(day, "d")}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => onDateClick(day)}
                  title={`Schedule post for ${format(day, "MMMM d, yyyy")}`}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              {postsForDay.length > 0 && (
                <div className="mt-1">
                  {postsForDay.map((post) => (
                    <div
                      key={post.id}
                      className="mb-1 truncate rounded-sm bg-primary/10 px-1 py-0.5 text-xs text-primary"
                      title={post.content}
                    >
                      {format(post.scheduledFor, "h:mm a")} - {post.platform}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </Card>
  )
}
