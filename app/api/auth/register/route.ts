import { NextResponse } from "next/server"
import { hash } from "bcrypt"
import { db } from "@/lib/db"
import { users, brandProfiles } from "@/lib/schema"
import { z } from "zod"

// Define request schema
const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
})

export async function POST(req: Request) {
  try {
    const body = await req.json()

    // Validate request body
    const { name, email, password } = registerSchema.parse(body)

    // Check if user already exists
    const existingUser = await db.query.users.findFirst({
      where: (users, { eq }) => eq(users.email, email),
    })

    if (existingUser) {
      return NextResponse.json({ error: "User with this email already exists" }, { status: 409 })
    }

    // Hash password
    const passwordHash = await hash(password, 10)

    // Create user in transaction
    const [user] = await db.transaction(async (tx) => {
      // Insert user
      const [newUser] = await tx
        .insert(users)
        .values({
          name,
          email,
          passwordHash,
        })
        .returning()

      // Create default brand profile
      await tx.insert(brandProfiles).values({
        userId: newUser.id,
        brandVoice: "Professional yet approachable, with a focus on clarity and expertise.",
        vocabulary: ["professional", "clear", "helpful", "engaging"],
      })

      return [newUser]
    })

    // Return success without exposing sensitive data
    return NextResponse.json(
      {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Registration error:", error)

    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }

    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
