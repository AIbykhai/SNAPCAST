"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { CalendarIcon, Check, ChevronsUpDown } from "lucide-react"
import { format } from "date-fns"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import type { DateRange } from "@/types/analytics"

interface FilterBarProps {
  dateRange: DateRange
  setDateRange: (range: DateRange) => void
  selectedPlatforms: string[]
  setSelectedPlatforms: (platforms: string[]) => void
}

export function FilterBar({ dateRange, setDateRange, selectedPlatforms, setSelectedPlatforms }: FilterBarProps) {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false)
  const [isPlatformSelectorOpen, setIsPlatformSelectorOpen] = useState(false)
  const [date, setDate] = useState<{
    from: Date | undefined
    to: Date | undefined
  }>({
    from: undefined,
    to: undefined,
  })

  const platforms = [
    { value: "Instagram", label: "Instagram" },
    { value: "Facebook", label: "Facebook" },
    { value: "LinkedIn", label: "LinkedIn" },
    { value: "X", label: "X (Twitter)" },
  ]

  const handleDateRangeSelect = (range: DateRange) => {
    setDateRange(range)
    if (range === "custom") {
      setIsCalendarOpen(true)
    } else {
      setIsCalendarOpen(false)
    }
  }

  const handleDateSelect = (value: any) => {
    setDate(value)
    if (value.from && value.to) {
      setDateRange({
        ...dateRange,
        startDate: value.from,
        endDate: value.to,
      })
    }
  }

  const togglePlatform = (platform: string) => {
    if (selectedPlatforms.includes(platform)) {
      setSelectedPlatforms(selectedPlatforms.filter((p) => p !== platform))
    } else {
      setSelectedPlatforms([...selectedPlatforms, platform])
    }
  }

  const getDateRangeText = () => {
    if (dateRange === "last7") {
      return "Last 7 days"
    } else if (dateRange === "last30") {
      return "Last 30 days"
    } else if (dateRange === "last90") {
      return "Last 90 days"
    } else if (dateRange === "custom" && date.from && date.to) {
      return `${format(date.from, "MMM d, yyyy")} - ${format(date.to, "MMM d, yyyy")}`
    } else if (dateRange === "custom") {
      return "Custom range"
    }
    return "Select date range"
  }

  return (
    <Card className="mb-6">
      <CardContent className="flex flex-col space-y-4 p-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:space-x-4 sm:space-y-0">
          <div>
            <Label className="mb-1 block text-sm font-medium">Date Range</Label>
            <div className="flex space-x-2">
              <Button
                variant={dateRange === "last7" ? "default" : "outline"}
                size="sm"
                onClick={() => handleDateRangeSelect("last7")}
              >
                Last 7 days
              </Button>
              <Button
                variant={dateRange === "last30" ? "default" : "outline"}
                size="sm"
                onClick={() => handleDateRangeSelect("last30")}
              >
                Last 30 days
              </Button>
              <Button
                variant={dateRange === "last90" ? "default" : "outline"}
                size="sm"
                onClick={() => handleDateRangeSelect("last90")}
              >
                Last 90 days
              </Button>
              <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant={dateRange === "custom" ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleDateRangeSelect("custom")}
                    className="flex items-center"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {getDateRangeText()}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar mode="range" selected={date} onSelect={handleDateSelect} initialFocus />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>

        <div>
          <Label className="mb-1 block text-sm font-medium">Platforms</Label>
          <Popover open={isPlatformSelectorOpen} onOpenChange={setIsPlatformSelectorOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" role="combobox" className="w-[200px] justify-between">
                {selectedPlatforms.length > 0 ? `${selectedPlatforms.length} selected` : "Select platforms"}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
              <Command>
                <CommandInput placeholder="Search platform..." />
                <CommandList>
                  <CommandEmpty>No platform found.</CommandEmpty>
                  <CommandGroup>
                    {platforms.map((platform) => (
                      <CommandItem
                        key={platform.value}
                        onSelect={() => togglePlatform(platform.value)}
                        className="flex items-center space-x-2"
                      >
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id={`platform-${platform.value}`}
                            checked={selectedPlatforms.includes(platform.value)}
                            onCheckedChange={() => togglePlatform(platform.value)}
                          />
                          <Label htmlFor={`platform-${platform.value}`} className="cursor-pointer">
                            {platform.label}
                          </Label>
                        </div>
                        {selectedPlatforms.includes(platform.value) && <Check className="ml-auto h-4 w-4" />}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>
      </CardContent>
    </Card>
  )
}
