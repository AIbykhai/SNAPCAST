"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Textarea } from "@/components/ui/textarea"
import { format } from "date-fns"
import { CalendarIcon, Clock, Edit2, ImageIcon, X } from "lucide-react"
import type { ScheduledPost } from "@/types/scheduling"

interface SchedulingModalProps {
  isOpen: boolean
  onClose: () => void
  selectedDate: Date | null
  onSave: (post: ScheduledPost) => void
  editingPost: ScheduledPost | null
}

export function SchedulingModal({ isOpen, onClose, selectedDate, onSave, editingPost }: SchedulingModalProps) {
  const [date, setDate] = useState<Date | undefined>(selectedDate || undefined)
  const [time, setTime] = useState("12:00")
  const [content, setContent] = useState("")
  const [platform, setPlatform] = useState<string>("Twitter")
  const [image, setImage] = useState<string | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [previewImage, setPreviewImage] = useState<string | null>(null)

  useEffect(() => {
    if (selectedDate) {
      setDate(selectedDate)
      setTime(format(selectedDate, "HH:mm"))
    }
  }, [selectedDate])

  useEffect(() => {
    if (editingPost) {
      setContent(editingPost.content)
      setDate(editingPost.scheduledFor)
      setTime(format(editingPost.scheduledFor, "HH:mm"))
      setPlatform(editingPost.platform)
      setImage(editingPost.image)
      setPreviewImage(editingPost.image)
    } else {
      setContent("")
      setPlatform("Twitter")
      setImage(null)
      setPreviewImage(null)
    }
    setIsEditing(false)
  }, [editingPost, isOpen])

  const handleSave = () => {
    if (!date) return

    const [hours, minutes] = time.split(":").map(Number)
    const scheduledDate = new Date(date)
    scheduledDate.setHours(hours, minutes)

    onSave({
      id: editingPost?.id || "",
      content,
      scheduledFor: scheduledDate,
      platform,
      image,
    })
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        const result = reader.result as string
        setImage(result)
        setPreviewImage(result)
      }
      reader.readAsDataURL(file)
    }
  }

  const removeImage = () => {
    setImage(null)
    setPreviewImage(null)
  }

  const platforms = ["Twitter", "Facebook", "Instagram", "LinkedIn"]

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{editingPost ? "Edit Scheduled Post" : "Schedule New Post"}</DialogTitle>
          <DialogDescription>
            {editingPost ? "Make changes to your scheduled post" : "Schedule your post for a specific date and time"}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal" id="date">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label htmlFor="time">Time</Label>
              <div className="flex items-center">
                <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="time"
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="flex-1"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Platforms</Label>
            <div className="flex flex-wrap gap-4">
              {platforms.map((p) => (
                <div key={p} className="flex items-center space-x-2">
                  <Checkbox id={`platform-${p}`} checked={platform === p} onCheckedChange={() => setPlatform(p)} />
                  <Label htmlFor={`platform-${p}`} className="text-sm font-normal">
                    {p}
                  </Label>
                </div>
              ))}
            </div>
            <p className="text-xs text-muted-foreground">Multi-platform posting will be available in a future update</p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="content">Post Content</Label>
              {!isEditing && (
                <Button variant="ghost" size="sm" className="h-8 px-2 text-primary" onClick={() => setIsEditing(true)}>
                  <Edit2 className="mr-1 h-3 w-3" />
                  Edit
                </Button>
              )}
            </div>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[100px]"
              disabled={!isEditing && !!editingPost}
            />
          </div>

          <div className="space-y-2">
            <Label>Image (Optional)</Label>
            {previewImage ? (
              <div className="relative">
                <img
                  src={previewImage || "/placeholder.svg"}
                  alt="Preview"
                  className="max-h-[200px] rounded-md object-cover"
                />
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute right-2 top-2 h-6 w-6"
                  onClick={removeImage}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="flex items-center justify-center rounded-md border border-dashed p-4">
                <div className="text-center">
                  <ImageIcon className="mx-auto h-8 w-8 text-muted-foreground" />
                  <p className="mt-2 text-sm text-muted-foreground">
                    Drag and drop an image, or{" "}
                    <label className="cursor-pointer text-primary hover:underline">
                      browse
                      <Input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                    </label>
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!date || !content}>
            {editingPost ? "Update" : "Schedule"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
