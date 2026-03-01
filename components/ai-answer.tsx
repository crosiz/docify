"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Brain, ThumbsUp, ThumbsDown, Copy, Loader2 } from "lucide-react"
import { useState } from "react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { TypingEffect } from "@/components/typing-effect"

interface AIAnswerProps {
  query: string
  answer: string
  sources: Array<{ name: string; relevance: number }>
  confidence: number
  isLoading?: boolean
}

export function AIAnswer({ query, answer, sources, confidence, isLoading }: AIAnswerProps) {
  const [feedback, setFeedback] = useState<"up" | "down" | null>(null)
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(answer)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error("[v0] Failed to copy:", error)
    }
  }

  const handleFeedback = (type: "up" | "down") => {
    setFeedback(type)
    console.log("[v0] User feedback:", type, "for query:", query)
  }

  if (isLoading) {
    return (
      <Card className="bg-gradient-to-r from-accent/5 to-accent/10 border-accent/20">
        <CardContent className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-accent/20 rounded-lg">
              <Brain className="h-5 w-5 text-accent" />
            </div>
            <div className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin text-accent" />
              <span className="text-accent font-medium">AI is thinking...</span>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-gradient-to-r from-accent/5 to-accent/10 border-accent/20">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-accent/20 rounded-lg">
              <Brain className="h-5 w-5 text-accent" />
            </div>
            <CardTitle className="text-card-foreground">AI Answer</CardTitle>
          </div>
          <Badge variant="secondary" className="bg-accent/10 text-accent border-accent/20">
            {confidence}% confident
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-background/50 rounded-lg p-4 border border-accent/10 prose prose-slate dark:prose-invert max-w-full break-words overflow-x-auto overflow-y-auto max-h-[400px] scrollbar-thin scrollbar-thumb-accent/20 scrollbar-track-transparent prose-sm sm:prose-base text-card-foreground">
          <TypingEffect content={answer} speed={10} />
        </div>

        {sources.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-card-foreground">Sources:</h4>
            <div className="flex flex-wrap gap-2">
              {sources.map((source, index) => (
                <Badge key={index} variant="outline" className="text-xs border-accent/30">
                  {source.name} ({source.relevance}% relevant)
                </Badge>
              ))}
            </div>
          </div>
        )}

        <div className="flex items-center justify-between pt-2 border-t border-accent/10">
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Was this helpful?</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleFeedback("up")}
              className={`h-8 w-8 p-0 ${feedback === "up" ? "bg-green-100 text-green-600" : "hover:bg-green-50"}`}
            >
              <ThumbsUp className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleFeedback("down")}
              className={`h-8 w-8 p-0 ${feedback === "down" ? "bg-red-100 text-red-600" : "hover:bg-red-50"}`}
            >
              <ThumbsDown className="h-3 w-3" />
            </Button>
          </div>

          <Button variant="ghost" size="sm" onClick={handleCopy} className="h-8 px-3 text-xs">
            <Copy className="h-3 w-3 mr-1" />
            {copied ? "Copied!" : "Copy"}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
