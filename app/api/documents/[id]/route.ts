import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    const userId = (session?.user as { id?: string } | undefined)?.id
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    const doc = await db.document.findFirst({
      where: { id, userId },
      select: {
        id: true,
        originalName: true,
        mimeType: true,
        size: true,
        content: true,
        uploadedAt: true,
        status: true,
      },
    })

    if (!doc) {
      return NextResponse.json({ error: "Document not found" }, { status: 404 })
    }

    return NextResponse.json({
      id: doc.id,
      name: doc.originalName,
      mimeType: doc.mimeType,
      size: doc.size,
      content: doc.content,
      uploadedAt: doc.uploadedAt,
      status: doc.status,
    })
  } catch (error) {
    console.error("[documents/[id]] Error:", error)
    return NextResponse.json({ error: "Failed to load document" }, { status: 500 })
  }
}
