import { type NextRequest, NextResponse } from "next/server"
import OpenAI from "openai"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: NextRequest) {
  try {
    const { documentName, content } = await request.json()

    if (!content) {
      return NextResponse.json({ error: "Content is required" }, { status: 400 })
    }

    console.log("[v0] Summarizing document:", documentName)

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You are an AI assistant that creates concise summaries of company documents. 

Instructions:
- Create a 1-2 sentence summary that captures the main purpose and key information
- Focus on what employees would need to know about this document
- Be specific about policies, procedures, or important details
- Keep it professional and actionable`,
        },
        {
          role: "user",
          content: `Please summarize this document:

Document: ${documentName}
Content: ${content}

Provide a concise 1-2 sentence summary.`,
        },
      ],
      temperature: 0.3,
      max_tokens: 150,
    })

    const summary = completion.choices[0].message.content

    console.log("[v0] Document summary generated")

    return NextResponse.json({
      success: true,
      documentName,
      summary,
    })
  } catch (error) {
    console.error("[v0] Error generating summary:", error)
    return NextResponse.json({ error: "Failed to generate summary" }, { status: 500 })
  }
}
