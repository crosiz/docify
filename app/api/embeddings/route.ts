import { type NextRequest, NextResponse } from "next/server"
import OpenAI from "openai"

export async function POST(request: NextRequest) {
  try {
    const { text, documentId, documentName } = await request.json()
    const apiKey = request.headers.get("x-openai-key")

    if (!apiKey) {
      return NextResponse.json({ error: "OpenAI API key is missing" }, { status: 401 })
    }

    if (!text) {
      return NextResponse.json({ error: "Text is required" }, { status: 400 })
    }

    const openai = new OpenAI({
      apiKey: apiKey,
    })

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

    console.log("Generated embedding for document:", documentName)

    return NextResponse.json({
      success: true,
      data: embeddingData,
    })
  } catch (error) {
    console.error("[v0] Error generating embeddings:", error)
    return NextResponse.json({ error: "Failed to generate embeddings" }, { status: 500 })
  }
}
