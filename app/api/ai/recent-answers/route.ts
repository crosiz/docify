import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    const userId = (session?.user as { id?: string } | undefined)?.id
    if (!userId) {
      return NextResponse.json({ answers: [] })
    }

    const searches = await db.search.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 10,
      select: {
        id: true,
        query: true,
        answer: true,
        results: true,
        createdAt: true,
      },
    })

    const answers = searches
      .filter((s) => s.answer)
      .map((s) => {
        const results = (s.results as Array<{ documentName?: string }>) ?? []
        const source = results[0]?.documentName ?? "Your documents"
        return {
          id: s.id,
          question: s.query,
          answer: s.answer ?? "",
          source,
          timestamp: s.createdAt instanceof Date ? s.createdAt.toISOString() : String(s.createdAt),
          confidence: 85,
        }
      })

    return NextResponse.json({ answers })
  } catch (error) {
    console.error("[recent-answers] Error:", error)
    return NextResponse.json({ answers: [] })
  }
}
