"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Sparkles, Clock, RefreshCw, Brain } from "lucide-react"
import Link from "next/link"

interface RecentAnswer {
  id: string
  question: string
  answer: string
  source: string
  timestamp: string
  confidence: number
}

export function InstantAnswers() {
  const [recentAnswers, setRecentAnswers] = useState<RecentAnswer[]>([])
  const [isRefreshing, setIsRefreshing] = useState(false)

  useEffect(() => {
    loadRecentAnswers()
  }, [])

  const loadRecentAnswers = async () => {
    try {
      // Try to load from localStorage first (for persistence)
      const stored = localStorage.getItem("akop-recent-answers")
      if (stored) {
        const parsedAnswers = JSON.parse(stored)
        setRecentAnswers(parsedAnswers.slice(0, 3)) // Show only latest 3
        return
      }

      // Fallback to mock data if no stored answers
      const mockAnswers: RecentAnswer[] = [
        {
          id: "1",
          question: "What is our remote work policy?",
          answer:
            "Employees can work remotely up to 3 days per week with manager approval. Full remote work requires VP approval and is evaluated quarterly based on performance metrics.",
          source: "HR Policy Manual v2.3",
          timestamp: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
          confidence: 95,
        },
        {
          id: "2",
          question: "How do I submit expense reports?",
          answer:
            "Use the Concur system accessible through the employee portal. Submit within 30 days with receipts for amounts over $25. Meals are reimbursed up to $50 per day.",
          source: "Finance Guidelines",
          timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
          confidence: 98,
        },
        {
          id: "3",
          question: "What are the Q4 sales targets?",
          answer:
            "Q4 targets are $2.4M total revenue with 15% growth in enterprise accounts and 25% growth in SMB segment. Each rep has individual quotas based on territory.",
          source: "Q4 Sales Plan.pdf",
          timestamp: new Date(Date.now() - 12 * 60 * 1000).toISOString(),
          confidence: 92,
        },
      ]

      setRecentAnswers(mockAnswers)
      // Store in localStorage for persistence
      localStorage.setItem("akop-recent-answers", JSON.stringify(mockAnswers))
    } catch (error) {
      console.error("[v0] Error loading recent answers:", error)
    }
  }

  const handleRefresh = async () => {
    setIsRefreshing(true)
    console.log("[v0] Refreshing recent AI answers...")

    try {
      const response = await fetch("/api/ai/recent-answers")
      if (response.ok) {
        const data = await response.json()
        setRecentAnswers(data.answers || [])
        localStorage.setItem("akop-recent-answers", JSON.stringify(data.answers || []))
      } else {
        // Fallback to reloading existing answers
        await loadRecentAnswers()
      }
    } catch (error) {
      console.error("[v0] Error refreshing answers:", error)
      // Fallback to reloading existing answers
      await loadRecentAnswers()
    } finally {
      setTimeout(() => {
        setIsRefreshing(false)
        console.log("[v0] Recent answers refreshed")
      }, 1000)
    }
  }

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / (1000 * 60))

    if (diffMins < 1) return "Just now"
    if (diffMins < 60) return `${diffMins} minutes ago`
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)} hours ago`
    return `${Math.floor(diffMins / 1440)} days ago`
  }

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-accent" />
            <CardTitle className="text-card-foreground">Recent AI Answers</CardTitle>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="border-border bg-transparent"
            >
              <RefreshCw className={`h-3 w-3 mr-1 ${isRefreshing ? "animate-spin" : ""}`} />
              Refresh
            </Button>
            <Link href="/insights">
              <Button variant="outline" size="sm" className="border-border bg-transparent">
                <Brain className="h-3 w-3 mr-1" />
                View All
              </Button>
            </Link>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {recentAnswers.length > 0 ? (
          recentAnswers.map((item) => (
            <div key={item.id} className="border-l-4 border-accent pl-4 space-y-2">
              <div className="flex items-start justify-between gap-4">
                <h4 className="font-medium text-card-foreground text-pretty">{item.question}</h4>
                <div className="flex items-center gap-1 text-xs text-muted-foreground flex-shrink-0">
                  <Clock className="h-3 w-3" />
                  {formatTimestamp(item.timestamp)}
                </div>
              </div>

              <p className="text-sm text-muted-foreground text-pretty leading-relaxed">{item.answer}</p>

              <div className="flex items-center justify-between">
                <Badge variant="outline" className="text-xs border-border">
                  {item.source}
                </Badge>
                <Badge variant="secondary" className="text-xs bg-accent/10 text-accent border-accent/20">
                  {item.confidence}% confident
                </Badge>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8">
            <Brain className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-medium text-foreground mb-2">No AI answers yet</h3>
            <p className="text-sm text-muted-foreground">Start asking questions to see AI-generated insights here</p>
          </div>
        )}

        <div className="pt-4 border-t border-border">
          <p className="text-xs text-muted-foreground text-center">
            AI answers are generated from your uploaded documents and may not always be accurate.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
