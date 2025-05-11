import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { analyzeAccount } from "@/lib/ai-service"
import { db } from "@/lib/db"
import { accountAnalysis } from "@/lib/schema"
import { z } from "zod"

// Define request schema
const analyzeSchema = z.object({
  accountUrl: z.string().url(),
  platform: z.string().optional(),
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
    const { accountUrl, platform } = analyzeSchema.parse(body)

    // Analyze account
    const { results, model } = await analyzeAccount({
      accountUrl,
      platform,
    })

    // Save analysis to database
    const [analysis] = await db
      .insert(accountAnalysis)
      .values({
        userId: Number.parseInt(session.user.id),
        accountUrl,
        results,
      })
      .returning()

    return NextResponse.json({
      id: analysis.id,
      results,
      model,
    })
  } catch (error) {
    console.error("Account analysis error:", error)

    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }

    return NextResponse.json({ error: "Failed to analyze account" }, { status: 500 })
  }
}

export async function GET(req: Request) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get user's previous analyses
    const analyses = await db.query.accountAnalysis.findMany({
      where: (accountAnalysis, { eq }) => eq(accountAnalysis.userId, Number.parseInt(session.user.id)),
      orderBy: (accountAnalysis, { desc }) => [desc(accountAnalysis.createdAt)],
    })

    return NextResponse.json(analyses)
  } catch (error) {
    console.error("Error fetching analyses:", error)
    return NextResponse.json({ error: "Failed to fetch analyses" }, { status: 500 })
  }
}
