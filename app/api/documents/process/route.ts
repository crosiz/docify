import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { parseDocument } from "@/lib/parsers"
import { chunkText } from "@/lib/chunker"
import { getOpenAIClient, generateEmbedding } from "@/lib/openai"
import { db } from "@/lib/db"
import { DocumentStatus } from "@prisma/client"

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    const userId = (session?.user as { id?: string } | undefined)?.id
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get("file") as File | null
    if (!file) {
      return NextResponse.json(
        { error: "No file provided. Send as multipart/form-data with field 'file'." },
        { status: 400 }
      )
    }

    const fileName = file.name
    const mimeType = file.type || "application/octet-stream"
    const buffer = Buffer.from(await file.arrayBuffer())
    const size = buffer.length

    if (size === 0) {
      return NextResponse.json({ error: "File is empty" }, { status: 400 })
    }

    const openaiKey = request.headers.get("x-openai-key") || process.env.OPENAI_API_KEY
    if (!openaiKey) {
      return NextResponse.json(
        { error: "OPENAI_API_KEY is not configured. Add it in settings to process documents." },
        { status: 503 }
      )
    }

    const openai = getOpenAIClient(openaiKey)

    const extractedText = await parseDocument(buffer, mimeType, fileName)
    if (!extractedText || extractedText.trim().length < 20) {
      return NextResponse.json(
        { error: "Could not extract enough text from the document (or document is empty)." },
        { status: 400 }
      )
    }

    const chunks = chunkText(extractedText, 500)
    if (chunks.length === 0) {
      return NextResponse.json(
        { error: "Document produced no chunks after splitting." },
        { status: 400 }
      )
    }

    const doc = await db.document.create({
      data: {
        filename: `${Date.now()}_${fileName}`,
        originalName: fileName,
        mimeType,
        size,
        content: extractedText,
        userId,
        status: DocumentStatus.PROCESSING,
      },
    })

    for (const chunk of chunks) {
      const embedding = await generateEmbedding(chunk.content, openai)
      await db.embedding.create({
        data: {
          documentId: doc.id,
          content: chunk.content,
          embedding: embedding as unknown as object,
          metadata: { chunkIndex: chunk.index },
        },
      })
    }

    await db.document.update({
      where: { id: doc.id },
      data: { status: DocumentStatus.COMPLETED, processedAt: new Date() },
    })

    return NextResponse.json({
      success: true,
      documentId: doc.id,
      fileName,
      chunkCount: chunks.length,
      status: "processed",
    })
  } catch (error) {
    console.error("[documents/process] Error:", error)
    return NextResponse.json(
      {
        error: "Failed to process document",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    )
  }
}
