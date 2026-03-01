import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
    try {
        const apiKey = request.headers.get("x-openai-key") || process.env.OPENAI_API_KEY
        if (!apiKey) {
            return NextResponse.json({ error: "OpenAI API key is missing" }, { status: 503 })
        }

        const { prompt } = await request.json()

        if (!prompt) {
            return NextResponse.json({ error: "Prompt is required" }, { status: 400 })
        }

        const OpenAI = (await import("openai")).default
        const openai = new OpenAI({ apiKey: apiKey })

        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                {
                    role: "system",
                    content: `You are an expert prompt engineer. Your job is to take the user's rough prompt and rewrite it to be extremely professional, clear, and optimized for an AI language model to understand. 
          
Instructions:
- Expand on brief ideas to be more comprehensive.
- Add structure or bullet points if it helps clarity.
- Ensure the tone is direct and instructive.
- Return ONLY the polished prompt text. Do not add any introductory or concluding remarks like "Here is your polished prompt".`
                },
                {
                    role: "user",
                    content: `Polish this prompt:\n\n${prompt}`
                }
            ],
            temperature: 0.7,
            max_tokens: 300,
        })

        const polishedPrompt = completion.choices[0].message.content

        return NextResponse.json({
            success: true,
            polishedPrompt,
        })
    } catch (error) {
        console.error("[prompt-polish] Error:", error)
        return NextResponse.json({ error: "Failed to polish prompt" }, { status: 500 })
    }
}
