import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { generateBrandProfile } from "@/lib/ai-service"
import { db } from "@/lib/db"
import { brandProfiles } from "@/lib/schema"
import { z } from "zod"
import { eq } from "drizzle-orm"

// Define request schema
const generateBrandProfileSchema = z.object({
  contentSamples: z.array(z.string()).min(1),
})

export async function POST(req: Request) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()

    // Validate request body
    const { contentSamples } = generateBrandProfileSchema.parse(body)

    // Generate brand profile
    const { brandVoice, vocabulary, model } = await generateBrandProfile(contentSamples)

    // Get existing brand profile
    const existingProfile = await db.query.brandProfiles.findFirst({
      where: eq(brandProfiles.userId, Number.parseInt(session.user.id)),
    })

    let updatedProfile

    if (existingProfile) {
      // Update existing profile
      ;[updatedProfile] = await db
        .update(brandProfiles)
        .set({
          brandVoice,
          vocabulary,
          updatedAt: new Date(),
        })
        .where(eq(brandProfiles.id, existingProfile.id))
        .returning()
    } else {
      // Create new profile
      ;[updatedProfile] = await db
        .insert(brandProfiles)
        .values({
          userId: Number.parseInt(session.user.id),
          brandVoice,
          vocabulary,
        })
        .returning()
    }

    return NextResponse.json({
      brandProfile: updatedProfile,
      model,
    })
  } catch (error) {
    console.error("Brand profile generation error:", error)

    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }

    return NextResponse.json({ error: "Failed to generate brand profile" }, { status: 500 })
  }
}
