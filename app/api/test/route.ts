import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Return a simple JSON response
    return NextResponse.json({
      status: "ok",
      message: "API is working",
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Test API error:", error)
    return NextResponse.json({ error: "An error occurred" }, { status: 500 })
  }
}
