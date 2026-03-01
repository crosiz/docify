// ============================================================
// lib/openai.ts
// OPENAI CLIENT + EMBEDDING HELPER
// ============================================================
//
// WHAT THIS FILE DOES:
//   1. Creates an OpenAI client using the USER'S OWN api key
//   2. Has one function: turn text into 1536 numbers (embedding)
//
// WHY USER'S OWN KEY?
//   Your app (Docify) doesn't pay for OpenAI calls.
//   The user enters their own sk-... key in the settings page.
//   Your frontend sends it with every request in a header:
//     headers: { "x-openai-key": "sk-abc123..." }
//   Your API routes read it with:
//     request.headers.get("x-openai-key")
//   You NEVER store it in your database. It only lives in memory
//   for the duration of that one request.
//
// WHAT IS AN EMBEDDING?
//   It's just an array of 1536 numbers.
//   OpenAI's model reads your text and produces these numbers
//   in a way that similar texts produce similar numbers.
//   Example:
//     "refund policy"     → [0.12, -0.45, 0.88, ...]  (1536 nums)
//     "money back policy" → [0.11, -0.46, 0.87, ...]  (very close!)
//     "quarterly revenue" → [-0.9, 0.23, -0.11, ...]  (very different)
//   That closeness is how we do search.
// ============================================================

import OpenAI from "openai";

// ── Function 1: Create OpenAI client ──────────────────────────────────────
//
// Takes the user's API key and returns an OpenAI client object.
// That client is then used to call any OpenAI API (embeddings, chat, etc.)
//
export function getOpenAIClient(apiKey: string): OpenAI {
  // Basic validation before even calling OpenAI
  if (!apiKey || !apiKey.startsWith("sk-")) {
    throw new Error(
      "Invalid OpenAI API key. It must start with 'sk-'. " +
      "Get yours at platform.openai.com/api-keys"
    );
  }

  return new OpenAI({ apiKey });
}

// ── Function 2: Generate an embedding for a piece of text ─────────────────
//
// Input:  any string (a document chunk OR a user's question)
// Output: array of 1536 numbers
//
// IMPORTANT RULE: You MUST use the same model for BOTH:
//   - embedding document chunks during upload
//   - embedding the user's question during chat
// If you use different models, the numbers are incompatible
// and your search will return random garbage results.
//
// We use "text-embedding-3-small" because:
//   - It's OpenAI's cheapest embedding model
//   - Still very accurate for semantic search
//   - Costs roughly $0.00002 per 1000 words
//   - A whole 50-page PDF costs less than $0.01 to embed
//
export async function generateEmbedding(
  text: string,
  openai: OpenAI
): Promise<number[]> {
  const response = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: text
      .replace(/\n+/g, " ")   // collapse multiple newlines → space
      .trim()
      .slice(0, 8000),         // safety: max 8000 chars (well under token limit)
  });

  // response.data[0].embedding is the array of 1536 numbers
  return response.data[0].embedding;
}