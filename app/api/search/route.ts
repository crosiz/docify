import { type NextRequest, NextResponse } from "next/server"

// Enhanced mock database with email content
const mockVectorDB = [
  {
    id: "doc_1",
    documentName: "Employee Handbook 2024",
    text: "Our remote work policy allows employees to work from home up to 3 days per week with manager approval. Full remote work requires VP approval and is evaluated quarterly based on performance metrics.",
    type: "document",
    embedding: null,
    similarity: 0,
  },
  {
    id: "doc_2",
    documentName: "Expense Policy",
    text: "To submit expense reports, use the Concur system accessible through the employee portal. All expenses must be submitted within 30 days with receipts for amounts over $25. Meals are reimbursed up to $50 per day.",
    type: "document",
    embedding: null,
    similarity: 0,
  },
  {
    id: "doc_3",
    documentName: "Q4 Sales Targets",
    text: "Q4 sales targets are set at $2.4M total revenue with 15% growth in enterprise accounts and 25% growth in SMB segment. Each rep has individual quotas based on territory and experience.",
    type: "document",
    embedding: null,
    similarity: 0,
  },
  {
    id: "doc_4",
    documentName: "IT Security Requirements",
    text: "All employees must enable 2FA on company accounts. VPN is required for remote access. Password policy requires 12+ characters with special characters. Security training is mandatory quarterly.",
    type: "document",
    embedding: null,
    similarity: 0,
  },
  {
    id: "doc_5",
    documentName: "Learning and Development",
    text: "We offer comprehensive learning opportunities including online courses, workshops, and conference attendance. Each employee has a $2000 annual learning budget. Skills development plans are reviewed quarterly with managers.",
    type: "document",
    embedding: null,
    similarity: 0,
  },
  {
    id: "email_1",
    documentName: "Email: Q4 Budget Review Meeting",
    text: "Hi team, I've scheduled our Q4 budget review for next Tuesday at 2 PM. Please review the attached budget proposal and come prepared with your department's requirements. We need to finalize numbers before the board meeting.",
    type: "email",
    sender: "Sarah Johnson",
    embedding: null,
    similarity: 0,
  },
  {
    id: "email_2",
    documentName: "Email: New Employee Onboarding Process",
    text: "We've updated our employee onboarding process to include new security training modules. All managers should review the updated checklist before the next new hire starts. The new process takes effect immediately.",
    type: "email",
    sender: "HR Team",
    embedding: null,
    similarity: 0,
  },
  {
    id: "email_3",
    documentName: "Email: Security Policy Updates",
    text: "Important security policy updates effective immediately: All employees must enable 2FA on company accounts. VPN is now required for all remote access. Contact IT if you need help setting up these security measures.",
    type: "email",
    sender: "IT Security",
    embedding: null,
    similarity: 0,
  },
]

function calculateRelevanceScore(query: string, doc: any): number {
  const queryLower = query.toLowerCase()
  const textLower = doc.text.toLowerCase()
  const nameLower = doc.documentName.toLowerCase()

  let score = 0

  // Exact phrase matching (highest priority)
  if (textLower.includes(queryLower) || nameLower.includes(queryLower)) {
    score += 0.8
  }

  // Individual word matching
  const queryWords = queryLower.split(/\s+/).filter((word) => word.length > 2)
  const textWords = textLower.split(/\s+/)
  const nameWords = nameLower.split(/\s+/)

  queryWords.forEach((queryWord) => {
    // Title/name matches are more important
    if (nameWords.some((nameWord) => nameWord.includes(queryWord))) {
      score += 0.3
    }

    // Text content matches
    const textMatches = textWords.filter((textWord) => textWord.includes(queryWord)).length
    if (textMatches > 0) {
      score += Math.min(textMatches * 0.1, 0.4) // Cap text matching bonus
    }
  })

  // Boost for document type relevance
  if (queryLower.includes("email") && doc.type === "email") {
    score += 0.2
  } else if (queryLower.includes("policy") && doc.documentName.toLowerCase().includes("policy")) {
    score += 0.2
  }

  return Math.min(score, 1.0) // Cap at 1.0
}

export async function POST(request: NextRequest) {
  try {
    console.log("[v0] Search API called")
    const { query, limit = 5, includeEmails = true } = await request.json()

    if (!query) {
      console.log("[v0] No query provided")
      return NextResponse.json({ error: "Query is required" }, { status: 400 })
    }

    console.log("[v0] Searching for:", query, "includeEmails:", includeEmails)

    // Filter results based on includeEmails parameter
    const searchDatabase = includeEmails ? mockVectorDB : mockVectorDB.filter((doc) => doc.type === "document")

    const results = searchDatabase
      .map((doc) => ({
        ...doc,
        similarity: calculateRelevanceScore(query, doc),
      }))
      .filter((doc) => doc.similarity > 0.1) // Only include reasonably relevant results
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, limit)

    console.log("[v0] Found", results.length, "relevant items")

    return NextResponse.json({
      success: true,
      query,
      results: results.map((doc) => ({
        id: doc.id,
        documentName: doc.documentName,
        text: doc.text,
        type: doc.type,
        sender: doc.type === "email" ? (doc as any).sender : undefined,
        similarity: doc.similarity,
        relevanceScore: Math.round(doc.similarity * 100),
      })),
      totalResults: results.length,
    })
  } catch (error) {
    console.error("[v0] Error performing search:", error)
    return NextResponse.json(
      {
        error: "Search failed",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
