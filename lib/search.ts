import { getOpenAIClient, generateEmbedding } from "@/lib/openai"
import { db } from "@/lib/db"
import { cosineSimilarity } from "@/lib/vectors"

export interface SearchResult {
  id: string
  documentName: string
  text: string
  type: "document"
  similarity: number
  relevanceScore: number
}

export async function searchDocuments(
  userId: string | null,
  query: string,
  limit: number = 5,
  apiKey?: string | null
): Promise<SearchResult[]> {
  if (!userId) return []

  const openaiKey = apiKey || process.env.OPENAI_API_KEY
  const embeddings = await db.embedding.findMany({
    where: { document: { userId } },
    include: { document: true },
  })

  if (embeddings.length === 0) return []

  if (!openaiKey) {
    return embeddings.slice(0, limit).map((e) => ({
      id: e.id,
      documentName: e.document.originalName,
      text: e.content,
      type: "document" as const,
      similarity: 0.5,
      relevanceScore: 50,
    }))
  }

  const queryEmbedding = await generateEmbedding(query.trim(), getOpenAIClient(openaiKey))

  const withScores = embeddings.map((e) => {
    const vec = e.embedding as number[]
    const similarity = Array.isArray(vec) ? cosineSimilarity(queryEmbedding, vec) : 0
    return {
      id: e.id,
      documentName: e.document.originalName,
      text: e.content,
      type: "document" as const,
      similarity,
    }
  })

  return withScores
    .filter((x) => x.similarity > 0.1)
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, limit)
    .map((doc) => ({
      ...doc,
      relevanceScore: Math.round(Math.min(1, Math.max(0, doc.similarity)) * 100),
    }))
}
