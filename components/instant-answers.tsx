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
      const stored = localStorage.getItem("akop-recent-answers")
      if (stored) {
        const parsed = JSON.parse(stored)
        setRecentAnswers(Array.isArray(parsed) ? parsed.slice(0, 3) : [])
        return
      }
      const response = await fetch("/api/ai/recent-answers")
      if (response.ok) {
        const data = await response.json()
        const answers = data.answers ?? []
        setRecentAnswers(answers.slice(0, 3))
        if (answers.length > 0)
          localStorage.setItem("akop-recent-answers", JSON.stringify(answers))
      } else {
        setRecentAnswers([])
      }
    } catch (error) {
      console.error("[v0] Error loading recent answers:", error)
      setRecentAnswers([])
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
        await loadRecentAnswers()
      }
    } catch (error) {
      console.error("[v0] Error refreshing answers:", error)
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

              <p className="text-sm text-muted-foreground break-words text-pretty leading-relaxed line-clamp-3">{item.answer}</p>

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
          <p className="text-[10px] text-muted-foreground text-center">
            AI answers are generated from your uploaded documents and may not always be accurate.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
