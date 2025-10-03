import { type NextRequest, NextResponse } from "next/server"
import OpenAI from "openai"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: NextRequest) {
  try {
    const { text, documentId, documentName } = await request.json()

    if (!text) {
      return NextResponse.json({ error: "Text is required" }, { status: 400 })
    }

    // Generate embeddings using OpenAI
    const response = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: text,
    })

    const embedding = response.data[0].embedding

    // In a real implementation, you would store this in a vector database
    // For MVP, we'll simulate storage and return the embedding
    const embeddingData = {
      id: documentId || `doc_${Date.now()}`,
      documentName: documentName || "Unknown Document",
      text: text.substring(0, 500), // Store first 500 chars for preview
      embedding,
      createdAt: new Date().toISOString(),
    }

    console.log("[v0] Generated embedding for document:", documentName)

    return NextResponse.json({
      success: true,
      data: embeddingData,
    })
  } catch (error) {
    console.error("[v0] Error generating embeddings:", error)
    return NextResponse.json({ error: "Failed to generate embeddings" }, { status: 500 })
  }
}
