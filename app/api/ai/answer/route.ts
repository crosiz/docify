import { type NextRequest, NextResponse } from "next/server"

const fallbackResponses: Record<string, string> = {
  "remote work":
    "Based on our Employee Handbook 2024, employees can work from home up to 3 days per week with manager approval. Full remote work requires VP approval and is evaluated quarterly based on performance metrics.",
  expense:
    "According to our Expense Policy, use the Concur system through the employee portal to submit expenses. All expenses must be submitted within 30 days with receipts for amounts over $25. Meals are reimbursed up to $50 per day.",
  "sales target":
    "Our Q4 sales targets are set at $2.4M total revenue with 15% growth in enterprise accounts and 25% growth in SMB segment. Each rep has individual quotas based on territory and experience.",
  security:
    "Per our IT Security Requirements, all employees must enable 2FA on company accounts. VPN is required for remote access. Passwords must be 12+ characters with special characters, and security training is mandatory quarterly.",
  learning:
    "We offer comprehensive learning opportunities including online courses, workshops, and conference attendance. Each employee has a $2000 annual learning budget with quarterly skills development plan reviews.",
}

function generateFallbackAnswer(query: string, relevantDocs: any[]): string {
  const queryLower = query.toLowerCase()

  // Check for keyword matches in fallback responses
  for (const [keyword, response] of Object.entries(fallbackResponses)) {
    if (queryLower.includes(keyword)) {
      return response
    }
  }

  // If we have relevant documents, create a basic answer
  if (relevantDocs.length > 0) {
    const topDoc = relevantDocs[0]
    return `Based on the information in "${topDoc.documentName}", here's what I found: ${topDoc.text.substring(0, 200)}${topDoc.text.length > 200 ? "..." : ""}`
  }

  // Generic fallback
  return "I couldn't find specific information about your question in the available documents. Please try rephrasing your question or contact your manager for more details."
}

export async function POST(request: NextRequest) {
  try {
    console.log("[v0] AI Answer API called")
    const { query } = await request.json()

    if (!query) {
      console.log("[v0] No query provided")
      return NextResponse.json({ error: "Query is required" }, { status: 400 })
    }

    console.log("[v0] Generating AI answer for:", query)

    // First, search for relevant documents
    const searchResponse = await fetch(`${process.env.NEXTAUTH_URL || "http://localhost:3000"}/api/search`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query, limit: 3 }),
    })

    if (!searchResponse.ok) {
      console.error("[v0] Search failed for AI answer")
      throw new Error("Search failed")
    }

    const searchData = await searchResponse.json()
    const relevantDocs = searchData.results

    let aiAnswer: string
    let confidence: number

    try {
      // Only try OpenAI if API key is available
      if (process.env.OPENAI_API_KEY) {
        const OpenAI = (await import("openai")).default
        const openai = new OpenAI({
          apiKey: process.env.OPENAI_API_KEY,
        })

        // Prepare context from relevant documents
        const context = relevantDocs
          .map((doc: any, index: number) => `Document ${index + 1} (${doc.documentName}):\n${doc.text}`)
          .join("\n\n")

        const completion = await openai.chat.completions.create({
          model: "gpt-4o-mini",
          messages: [
            {
              role: "system",
              content: `You are Docify, an AI assistant that helps employees find information from internal company documents. 

Instructions:
- Provide concise, accurate answers based on the provided document context
- If the information isn't in the documents, say so clearly
- Include relevant document names when referencing information
- Keep answers professional and helpful
- If multiple documents contain relevant info, synthesize the information
- For policy questions, be specific about requirements and procedures`,
            },
            {
              role: "user",
              content: `Question: ${query}

Context from company documents:
${context}

Please provide a concise answer based on the available information.`,
            },
          ],
          temperature: 0.3,
          max_tokens: 500,
        })

        aiAnswer = completion.choices[0].message.content || "I couldn't generate a response."
        confidence = relevantDocs.length > 0 ? Math.max(...relevantDocs.map((d: any) => d.relevanceScore)) : 50
        console.log("[v0] OpenAI answer generated successfully")
      } else {
        throw new Error("OpenAI API key not available")
      }
    } catch (openaiError) {
      console.log("[v0] OpenAI not available, using fallback response")
      aiAnswer = generateFallbackAnswer(query, relevantDocs)
      confidence = relevantDocs.length > 0 ? Math.max(...relevantDocs.map((d: any) => d.relevanceScore)) : 30
    }

    console.log("[v0] AI answer generated successfully")

    return NextResponse.json({
      success: true,
      query,
      answer: aiAnswer,
      sources: relevantDocs.map((doc: any) => ({
        name: doc.documentName,
        relevance: doc.relevanceScore,
      })),
      confidence,
    })
  } catch (error) {
    console.error("[v0] Error generating AI answer:", error)
    return NextResponse.json(
      {
        error: "Failed to generate answer",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
