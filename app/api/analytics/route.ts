import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { posts, analytics } from "@/lib/schema"
import { eq, and, gte, lte } from "drizzle-orm"

export async function GET(req: Request) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Parse query parameters
    const { searchParams } = new URL(req.url)
    const startDate = searchParams.get("startDate")
    const endDate = searchParams.get("endDate")
    const platforms = searchParams.get("platforms")?.split(",") || []

    // Build query conditions
    let conditions = [eq(posts.userId, Number.parseInt(session.user.id))]

    if (startDate) {
      conditions.push(gte(posts.publishedAt, new Date(startDate)))
    }

    if (endDate) {
      conditions.push(lte(posts.publishedAt, new Date(endDate)))
    }

    if (platforms.length > 0) {
      // This is a simplified approach - in a real app you'd use an "in" operator
      // but we'll keep it simple for this example
      conditions = [...conditions, ...platforms.map((platform) => eq(posts.platform, platform))]
    }

    // Get posts with analytics
    const postsWithAnalytics = await db
      .select({
        post: posts,
        analytics: analytics,
      })
      .from(posts)
      .leftJoin(analytics, eq(posts.id, analytics.postId))
      .where(and(...conditions))

    // Calculate summary metrics
    const totalReach = postsWithAnalytics.reduce((sum, item) => sum + (item.analytics?.reach || 0), 0)
    const totalLikes = postsWithAnalytics.reduce((sum, item) => sum + (item.analytics?.likes || 0), 0)
    const totalComments = postsWithAnalytics.reduce((sum, item) => sum + (item.analytics?.comments || 0), 0)
    const totalShares = postsWithAnalytics.reduce((sum, item) => sum + (item.analytics?.shares || 0), 0)

    // Calculate engagement rate
    const totalEngagement = totalLikes + totalComments + totalShares
    const averageEngagementRate = totalReach > 0 ? (totalEngagement / totalReach).toFixed(4) : "0"

    return NextResponse.json({
      posts: postsWithAnalytics,
      summary: {
        totalPosts: postsWithAnalytics.length,
        totalReach,
        totalLikes,
        totalComments,
        totalShares,
        totalEngagement,
        averageEngagementRate,
      },
    })
  } catch (error) {
    console.error("Error fetching analytics:", error)
    return NextResponse.json({ error: "Failed to fetch analytics" }, { status: 500 })
  }
}
