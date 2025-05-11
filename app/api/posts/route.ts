import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { posts, analytics } from "@/lib/schema"
import { z } from "zod"
import { desc, eq } from "drizzle-orm"

// Define create post schema
const createPostSchema = z.object({
  content: z.string().min(1),
  platform: z.string().min(1),
  scheduledFor: z.string().datetime().optional(),
  image: z.string().optional(),
})

// Get all posts for the authenticated user
export async function GET(req: Request) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Parse query parameters
    const { searchParams } = new URL(req.url)
    const status = searchParams.get("status")
    const platform = searchParams.get("platform")
    const limit = Number.parseInt(searchParams.get("limit") || "50")
    const offset = Number.parseInt(searchParams.get("offset") || "0")

    // Build query
    let query = db
      .select()
      .from(posts)
      .where(eq(posts.userId, Number.parseInt(session.user.id)))
      .limit(limit)
      .offset(offset)
      .orderBy(desc(posts.createdAt))

    // Add filters if provided
    if (status) {
      query = query.where(eq(posts.status, status))
    }

    if (platform) {
      query = query.where(eq(posts.platform, platform))
    }

    const userPosts = await query

    return NextResponse.json(userPosts)
  } catch (error) {
    console.error("Error fetching posts:", error)
    return NextResponse.json({ error: "Failed to fetch posts" }, { status: 500 })
  }
}

// Create a new post
export async function POST(req: Request) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()

    // Validate request body
    const { content, platform, scheduledFor, image } = createPostSchema.parse(body)

    // Create post in transaction
    const [post] = await db.transaction(async (tx) => {
      // Insert post
      const [newPost] = await tx
        .insert(posts)
        .values({
          userId: Number.parseInt(session.user.id),
          content,
          platform,
          scheduledFor: scheduledFor ? new Date(scheduledFor) : null,
          image,
          status: scheduledFor ? "scheduled" : "draft",
        })
        .returning()

      // Create analytics record
      await tx.insert(analytics).values({
        postId: newPost.id,
      })

      return [newPost]
    })

    return NextResponse.json(post, { status: 201 })
  } catch (error) {
    console.error("Error creating post:", error)

    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }

    return NextResponse.json({ error: "Failed to create post" }, { status: 500 })
  }
}
