// ============================================================
// lib/parsers.ts
// EXTRACT PLAIN TEXT FROM PDF / DOCX / CSV / TXT FILES
// ============================================================
//
// WHAT THIS FILE DOES:
//   Takes a raw file (as bytes/Buffer) and returns plain text.
//   We throw away ALL formatting — bold, colors, fonts, images.
//   We only care about the words.
//
// WHY DO WE NEED THIS?
//   A PDF is not text. Open a PDF in a text editor and you'll
//   see binary garbage: %%PDF-1.4 xref obj endobj stream...
//   Same with .docx — it's a ZIP file containing XML inside.
//   We need libraries to decode these formats into plain text.
//
// LIBRARIES NEEDED:
//   npm install pdf-parse mammoth
//   npm install -D @types/pdf-parse
//
// HOW IT'S CALLED:
//   const buffer = Buffer.from(await file.arrayBuffer())
//   const text = await parseDocument(buffer, file.type, file.name)
//   // text is now a plain string like "Chapter 1: Introduction..."
// ============================================================

// ── PDF Parser ────────────────────────────────────────────────────────────
//
// Uses the `pdf-parse` library.
// It reads the binary PDF structure and extracts every text element.
// Handles multi-page PDFs, columns, headers, footers.
// Does NOT handle scanned PDFs (images of text) — those need OCR.
//
export async function parsePDF(buffer: Buffer): Promise<string> {
    // Dynamic import = only loads this library when actually needed
    // This keeps your app startup time fast
    const pdfParse = (await import("pdf-parse")).default;
  
    const result = await pdfParse(buffer);
  
    return result.text
      .replace(/\x00/g, "")              // remove null characters (common in PDFs)
      .replace(/(\w)-\n(\w)/g, "$1$2")   // fix "hyphen-\nated" words split across lines
      .replace(/\n{3,}/g, "\n\n")        // max 2 blank lines in a row
      .trim();
  }
  
  // ── DOCX Parser ───────────────────────────────────────────────────────────
  //
  // Uses the `mammoth` library.
  // A .docx file is actually a ZIP containing XML files inside.
  // Mammoth unzips it, reads the XML, and returns plain text.
  // Handles: paragraphs, tables, lists, headings.
  // Ignores: colors, fonts, images, comments.
  //
  export async function parseDOCX(buffer: Buffer): Promise<string> {
    const mammoth = await import("mammoth");
  
    // extractRawText = only words, no HTML, no markdown
    const result = await mammoth.extractRawText({ buffer });
  
    // result.messages contains warnings (not errors) like "image ignored"
    // We log them so you can debug, but don't throw
    if (result.messages.length > 0) {
      console.warn("[parseDOCX] warnings:", result.messages.map(m => m.message));
    }
  
    return result.value.trim();
  }
  
  // ── CSV Parser ────────────────────────────────────────────────────────────
  //
  // No library needed — CSV is plain text with commas.
  // We convert each row into a readable sentence so the AI
  // can understand it naturally.
  //
  // Example input CSV:
  //   Name, Department, Salary
  //   Alice, Engineering, 90000
  //   Bob, Marketing, 75000
  //
  // Example output text:
  //   CSV data with columns: Name, Department, Salary
  //   Row 1: Name: Alice, Department: Engineering, Salary: 90000
  //   Row 2: Name: Bob, Department: Marketing, Salary: 75000
  //
  // Why convert to sentences?
  //   Because the AI understands "Name: Alice" better than "Alice,Engineering,90000"
  //
  export function parseCSV(buffer: Buffer): string {
    const raw = buffer.toString("utf-8");
    const lines = raw
      .split("\n")
      .map((l) => l.trim())
      .filter((l) => l.length > 0);
  
    if (lines.length === 0) return "";
  
    // First line = column headers
    const headers = lines[0]
      .split(",")
      .map((h) => h.replace(/"/g, "").trim());
  
    // Convert each data row into "Header: value, Header: value" format
    const rows = lines.slice(1).map((line, i) => {
      const values = line.split(",").map((v) => v.replace(/"/g, "").trim());
      const pairs = headers.map((h, idx) => `${h}: ${values[idx] ?? ""}`).join(", ");
      return `Row ${i + 1}: ${pairs}`;
    });
  
    return [
      `CSV data with columns: ${headers.join(", ")}`,
      "",
      ...rows,
    ].join("\n");
  }
  
  // ── TXT Parser ────────────────────────────────────────────────────────────
  //
  // Plain text files need no parsing — just decode the bytes to a string.
  //
  export function parseTXT(buffer: Buffer): string {
    return buffer.toString("utf-8").trim();
  }
  
  // ── Main dispatcher ───────────────────────────────────────────────────────
  //
  // This is the function your API route calls.
  // It auto-detects the file type from mimeType or filename extension
  // and calls the right parser above.
  //
  // Returns: plain text string
  // Throws:  if file type is unsupported
  //
  export async function parseDocument(
    buffer: Buffer,
    mimeType: string,
    fileName: string
  ): Promise<string> {
    // Get extension from filename: "report.pdf" → "pdf"
    const ext = fileName.split(".").pop()?.toLowerCase() ?? "";
  
    // Check MIME type first, fall back to extension
    // (Some browsers send wrong MIME types, so extension is the backup)
  
    if (mimeType === "application/pdf" || ext === "pdf") {
      return parsePDF(buffer);
    }
  
    if (
      mimeType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
      mimeType === "application/msword" ||
      ext === "docx" ||
      ext === "doc"
    ) {
      return parseDOCX(buffer);
    }
  
    if (mimeType === "text/csv" || ext === "csv") {
      return parseCSV(buffer);
    }
  
    if (mimeType === "text/plain" || ext === "txt") {
      return parseTXT(buffer);
    }
  
    // Unsupported file type
    throw new Error(
      `Unsupported file type: "${ext}" (${mimeType}). ` +
      `Supported types: PDF, DOCX, DOC, CSV, TXT`
    );
  }