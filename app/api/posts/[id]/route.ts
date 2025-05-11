import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { posts } from "@/lib/schema"
import { z } from "zod"
import { eq, and } from "drizzle-orm"

// Define update post schema
const updatePostSchema = z.object({
  content: z.string().min(1).optional(),
  platform: z.string().min(1).optional(),
  scheduledFor: z.string().datetime().optional().nullable(),
  publishedAt: z.string().datetime().optional().nullable(),
  image: z.string().optional().nullable(),
  status: z.enum(["draft", "scheduled", "published", "failed"]).optional(),
})

// Get a specific post
export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const post = await db.query.posts.findFirst({
      where: and(eq(posts.id, params.id), eq(posts.userId, Number.parseInt(session.user.id))),
      with: {
        analytics: true,
      },
    })

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 })
    }

    return NextResponse.json(post)
  } catch (error) {
    console.error("Error fetching post:", error)
    return NextResponse.json({ error: "Failed to fetch post" }, { status: 500 })
  }
}

// Update a post
export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()

    // Validate request body
    const validatedData = updatePostSchema.parse(body)

    // Check if post exists and belongs to user
    const existingPost = await db.query.posts.findFirst({
      where: and(eq(posts.id, params.id), eq(posts.userId, Number.parseInt(session.user.id))),
    })

    if (!existingPost) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 })
    }

    // Update post
    const [updatedPost] = await db
      .update(posts)
      .set({
        ...validatedData,
        scheduledFor: validatedData.scheduledFor ? new Date(validatedData.scheduledFor) : existingPost.scheduledFor,
        publishedAt: validatedData.publishedAt ? new Date(validatedData.publishedAt) : existingPost.publishedAt,
        updatedAt: new Date(),
      })
      .where(eq(posts.id, params.id))
      .returning()

    return NextResponse.json(updatedPost)
  } catch (error) {
    console.error("Error updating post:", error)

    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }

    return NextResponse.json({ error: "Failed to update post" }, { status: 500 })
  }
}

// Delete a post
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if post exists and belongs to user
    const existingPost = await db.query.posts.findFirst({
      where: and(eq(posts.id, params.id), eq(posts.userId, Number.parseInt(session.user.id))),
    })

    if (!existingPost) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 })
    }

    // Delete post (this will cascade delete analytics due to foreign key constraints)
    await db.delete(posts).where(eq(posts.id, params.id))

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting post:", error)
    return NextResponse.json({ error: "Failed to delete post" }, { status: 500 })
  }
}
