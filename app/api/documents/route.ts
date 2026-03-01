import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    const userId = session?.user?.id
    if (!userId) {
      return NextResponse.json({ documents: [], total: 0 })
    }

    const documents = await db.document.findMany({
      where: { userId },
      orderBy: { uploadedAt: "desc" },
      take: 50,
      select: {
        id: true,
        originalName: true,
        mimeType: true,
        size: true,
        uploadedAt: true,
        status: true,
        processedAt: true,
      },
    })

    const total = await db.document.count({ where: { userId } })
    const startOfToday = new Date()
    startOfToday.setHours(0, 0, 0, 0)
    const todayCount = await db.document.count({
      where: { userId, uploadedAt: { gte: startOfToday } },
    })

    return NextResponse.json({
      documents: documents.map((d) => ({
        id: d.id,
        name: d.originalName,
        mimeType: d.mimeType,
        size: d.size,
        uploadedAt: d.uploadedAt,
        status: d.status,
        processedAt: d.processedAt,
      })),
      total,
      todayCount,
    })
  } catch (error) {
    console.error("[documents GET] Error:", error)
    return NextResponse.json(
      { error: "Failed to list documents" },
      { status: 500 }
    )
  }
}
