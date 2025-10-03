"use client"

import type React from "react"

import { useState } from "react"
import { Search, Sparkles, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { SearchResults } from "@/components/search-results"
import { AIAnswer } from "@/components/ai-answer"

interface SearchResult {
  id: string
  documentName: string
  text: string
  similarity: number
  relevanceScore: number
}

interface AIResponse {
  query: string
  answer: string
  sources: Array<{ name: string; relevance: number }>
  confidence: number
}

export function SearchBar() {
  const [query, setQuery] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const [isGeneratingAnswer, setIsGeneratingAnswer] = useState(false)
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [aiResponse, setAiResponse] = useState<AIResponse | null>(null)
  const [hasSearched, setHasSearched] = useState(false)

  const handleSearch = async () => {
    if (!query.trim()) return

    setIsSearching(true)
    setIsGeneratingAnswer(true)
    setHasSearched(true)
    setSearchResults([])
    setAiResponse(null)

    try {
      console.log("[v0] Initiating search for:", query)

      // Search for documents
      const searchResponse = await fetch("/api/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query, limit: 5 }),
      })

      if (!searchResponse.ok) {
        throw new Error("Search failed")
      }

      const searchData = await searchResponse.json()
      console.log("[v0] Search completed, found", searchData.results.length, "results")
      setSearchResults(searchData.results)
      setIsSearching(false)

      // Generate AI answer
      console.log("[v0] Generating AI answer...")
      const aiResponse = await fetch("/api/ai/answer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query }),
      })

      if (!aiResponse.ok) {
        throw new Error("AI answer generation failed")
      }

      const aiData = await aiResponse.json()
      console.log("[v0] AI answer generated successfully")
      setAiResponse(aiData)
    } catch (error) {
      console.error("[v0] Search/AI error:", error)
      setSearchResults([])
      setAiResponse(null)
    } finally {
      setIsSearching(false)
      setIsGeneratingAnswer(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch()
    }
  }

  return (
    <div className="space-y-6">
      <Card className="p-6 bg-card border-border">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-accent" />
            <h2 className="text-lg font-semibold text-card-foreground">Ask anything about your documents</h2>
          </div>

          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="e.g., What is our vacation policy? How do I submit expenses?"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                className="pl-10 h-12 text-base bg-input border-border focus:ring-ring"
                disabled={isSearching || isGeneratingAnswer}
              />
            </div>
            <Button
              onClick={handleSearch}
              disabled={isSearching || isGeneratingAnswer || !query.trim()}
              className="h-12 px-6 bg-accent hover:bg-accent/90 text-accent-foreground"
            >
              {isSearching || isGeneratingAnswer ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  {isGeneratingAnswer ? "Thinking..." : "Searching..."}
                </>
              ) : (
                "Search"
              )}
            </Button>
          </div>

          <div className="flex flex-wrap gap-2">
            <span className="text-sm text-muted-foreground">Try:</span>
            {[
              "What is our remote work policy?",
              "How do I submit expenses?",
              "What are the Q4 sales targets?",
              "IT security requirements",
            ].map((suggestion) => (
              <Button
                key={suggestion}
                variant="outline"
                size="sm"
                onClick={() => setQuery(suggestion)}
                disabled={isSearching || isGeneratingAnswer}
                className="text-xs border-border hover:bg-muted"
              >
                {suggestion}
              </Button>
            ))}
          </div>
        </div>
      </Card>

      {/* AI Answer */}
      {hasSearched && (
        <AIAnswer
          query={query}
          answer={aiResponse?.answer || ""}
          sources={aiResponse?.sources || []}
          confidence={aiResponse?.confidence || 0}
          isLoading={isGeneratingAnswer}
        />
      )}

      {/* Search Results */}
      {hasSearched && <SearchResults results={searchResults} query={query} isLoading={isSearching} />}
    </div>
  )
}
