import { type NextRequest, NextResponse } from "next/server"

export async function GET() {
  try {
    const apiKey = process.env.OPENAI_API_KEY

    if (!apiKey) {
      return NextResponse.json({ error: "No API key configured" }, { status: 400 })
    }

    // Test the API key with a simple request
    const response = await fetch("https://api.openai.com/v1/models", {
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    })

    if (response.ok) {
      return NextResponse.json({ status: "valid" })
    } else {
      return NextResponse.json({ error: "Invalid API key" }, { status: 401 })
    }
  } catch (error) {
    console.error("[v0] API key test error:", error)
    return NextResponse.json({ error: "Failed to test API key" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { apiKey } = await request.json()

    if (!apiKey) {
      return NextResponse.json({ error: "No API key provided" }, { status: 400 })
    }

    // Test the provided API key
    const response = await fetch("https://api.openai.com/v1/models", {
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    })

    if (response.ok) {
      return NextResponse.json({ status: "valid" })
    } else {
      return NextResponse.json({ error: "Invalid API key" }, { status: 401 })
    }
  } catch (error) {
    console.error("[v0] API key test error:", error)
    return NextResponse.json({ error: "Failed to test API key" }, { status: 500 })
  }
}
