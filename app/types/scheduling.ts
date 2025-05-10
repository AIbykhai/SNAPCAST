export interface ScheduledPost {
  id: string
  content: string
  scheduledFor: Date
  platform: string
  image: string | null
}
