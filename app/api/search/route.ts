import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { searchDocuments } from "@/lib/search"

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    const userId = session?.user?.id ?? null

    const { query, limit = 5 } = await request.json()

    if (!query || typeof query !== "string") {
      return NextResponse.json({ error: "Query is required" }, { status: 400 })
    }

    const topK = Math.min(Math.max(Number(limit) || 5, 1), 20)
    const apiKey = request.headers.get("x-openai-key")
    const results = await searchDocuments(userId, query, topK, apiKey)

    return NextResponse.json({
      success: true,
      query,
      results,
      totalResults: results.length,
    })
  } catch (error) {
    console.error("[search] Error:", error)
    return NextResponse.json(
      {
        error: "Search failed",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    )
  }
}
