import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { generateContent } from "@/lib/ai-service"
import { db } from "@/lib/db"
import { z } from "zod"

// Define request schema
const generateSchema = z.object({
  prompt: z.string().min(1),
  platform: z.string().optional(),
  theme: z.string().optional(),
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
    const { prompt, platform = "Instagram", theme } = generateSchema.parse(body)

    // Get user's brand profile
    const brandProfile = await db.query.brandProfiles.findFirst({
      where: (brandProfiles, { eq }) => eq(brandProfiles.userId, Number.parseInt(session.user.id)),
    })

    // Generate content
    const { text, model } = await generateContent({
      prompt,
      brandVoice: brandProfile?.brandVoice,
      platform,
      theme,
    })

    return NextResponse.json({
      content: text,
      model,
      platform,
    })
  } catch (error) {
    console.error("Content generation error:", error)

    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }

    return NextResponse.json({ error: "Failed to generate content" }, { status: 500 })
  }
}
