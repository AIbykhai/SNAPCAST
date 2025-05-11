import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { users, brandProfiles } from "@/lib/schema"
import { z } from "zod"
import { eq } from "drizzle-orm"

// Define profile update schema
const profileUpdateSchema = z.object({
  name: z.string().min(2).optional(),
  company: z.string().optional().nullable(),
  bio: z.string().max(160).optional().nullable(),
})

// Define brand profile update schema
const brandProfileUpdateSchema = z.object({
  brandVoice: z.string().min(10).optional(),
  vocabulary: z.array(z.string()).optional(),
})

// Get user profile
export async function GET(req: Request) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get user profile
    const user = await db.query.users.findFirst({
      where: eq(users.id, Number.parseInt(session.user.id)),
      columns: {
        id: true,
        name: true,
        email: true,
        company: true,
        bio: true,
        createdAt: true,
      },
    })

    // Get brand profile
    const brandProfile = await db.query.brandProfiles.findFirst({
      where: eq(brandProfiles.userId, Number.parseInt(session.user.id)),
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json({
      user,
      brandProfile,
    })
  } catch (error) {
    console.error("Error fetching profile:", error)
    return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 })
  }
}

// Update user profile
export async function PATCH(req: Request) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()

    // Check which type of update we're doing
    if ("name" in body || "company" in body || "bio" in body) {
      // Profile update
      const validatedData = profileUpdateSchema.parse(body)

      // Update user
      const [updatedUser] = await db
        .update(users)
        .set({
          ...validatedData,
          updatedAt: new Date(),
        })
        .where(eq(users.id, Number.parseInt(session.user.id)))
        .returning({
          id: users.id,
          name: users.name,
          email: users.email,
          company: users.company,
          bio: users.bio,
          updatedAt: users.updatedAt,
        })

      return NextResponse.json(updatedUser)
    } else if ("brandVoice" in body || "vocabulary" in body) {
      // Brand profile update
      const validatedData = brandProfileUpdateSchema.parse(body)

      // Get brand profile
      const brandProfile = await db.query.brandProfiles.findFirst({
        where: eq(brandProfiles.userId, Number.parseInt(session.user.id)),
      })

      if (!brandProfile) {
        // Create brand profile if it doesn't exist
        const [newBrandProfile] = await db
          .insert(brandProfiles)
          .values({
            userId: Number.parseInt(session.user.id),
            brandVoice: validatedData.brandVoice || "Professional yet approachable",
            vocabulary: validatedData.vocabulary || [],
          })
          .returning()

        return NextResponse.json(newBrandProfile)
      } else {
        // Update existing brand profile
        const [updatedBrandProfile] = await db
          .update(brandProfiles)
          .set({
            ...validatedData,
            updatedAt: new Date(),
          })
          .where(eq(brandProfiles.id, brandProfile.id))
          .returning()

        return NextResponse.json(updatedBrandProfile)
      }
    } else {
      return NextResponse.json({ error: "Invalid update data" }, { status: 400 })
    }
  } catch (error) {
    console.error("Error updating profile:", error)

    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }

    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 })
  }
}
