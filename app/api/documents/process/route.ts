import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { fileName, fileContent, fileType } = await request.json()

    if (!fileName || !fileContent) {
      return NextResponse.json({ error: "File name and content are required" }, { status: 400 })
    }

    console.log("[v0] Processing document:", fileName)

    // Simulate document processing and text extraction
    let extractedText = ""

    switch (fileType) {
      case "application/pdf":
        // In production, use pdf-parse or similar
        extractedText = `Extracted text from PDF: ${fileName}. This would contain the actual PDF content extracted using a PDF parsing library.`
        break
      case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        // In production, use mammoth.js or similar
        extractedText = `Extracted text from DOCX: ${fileName}. This would contain the actual Word document content extracted using a DOCX parsing library.`
        break
      case "text/csv":
        // In production, parse CSV properly
        extractedText = `Extracted data from CSV: ${fileName}. This would contain structured data from the CSV file.`
        break
      default:
        extractedText = fileContent
    }

    // Generate embeddings for the extracted text
    const embeddingResponse = await fetch(`${process.env.NEXTAUTH_URL || "http://localhost:3000"}/api/embeddings`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text: extractedText,
        documentId: `doc_${Date.now()}`,
        documentName: fileName,
      }),
    })

    if (!embeddingResponse.ok) {
      throw new Error("Failed to generate embeddings")
    }

    const embeddingData = await embeddingResponse.json()

    console.log("[v0] Document processed and indexed:", fileName)

    return NextResponse.json({
      success: true,
      documentId: embeddingData.data.id,
      fileName,
      extractedText: extractedText.substring(0, 200) + "...",
      status: "processed",
    })
  } catch (error) {
    console.error("[v0] Error processing document:", error)
    return NextResponse.json({ error: "Failed to process document" }, { status: 500 })
  }
}
