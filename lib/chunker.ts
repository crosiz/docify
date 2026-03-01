export interface Chunk {
  content: string;
  index: number;
}

export function chunkText(text: string, maxWords: number = 500): Chunk[] {
  if (!text || text.trim().length === 0) return [];

  const words = text.split(/\s+/);
  const chunks: Chunk[] = [];
  let currentChunkWords: string[] = [];
  let chunkIndex = 0;

  for (const word of words) {
    currentChunkWords.push(word);
    if (currentChunkWords.length >= maxWords) {
      chunks.push({
        content: currentChunkWords.join(" "),
        index: chunkIndex++
      });
      currentChunkWords = [];
    }
  }

  if (currentChunkWords.length > 0) {
    chunks.push({
      content: currentChunkWords.join(" "),
      index: chunkIndex++
    });
  }

  return chunks;
}
