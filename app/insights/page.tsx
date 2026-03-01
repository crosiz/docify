"use client"

import { useState, useEffect } from "react"
import { Sidebar } from "@/components/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Brain, Sparkles, TrendingUp, Clock, RefreshCw, Search, AlertCircle, CheckCircle } from "lucide-react"

interface AIInsight {
  id: string
  question: string
  answer: string
  source: string
  timestamp: string
  confidence: number
  category: string
}

export default function AIInsightsPage() {
  const [insights, setInsights] = useState<AIInsight[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    loadStoredInsights()
  }, [])

  async function loadStoredInsights() {
    try {
      const res = await fetch("/api/ai/recent-answers")
      if (res.ok) {
        const data = await res.json()
        const answers = (data.answers ?? []).map((a: any) => ({
          id: a.id,
          question: a.question,
          answer: a.answer,
          source: a.source ?? "Your documents",
          timestamp: a.timestamp,
          confidence: a.confidence ?? 85,
          category: "Generated",
        }))
        setInsights(answers)
      }
    } catch {
      setInsights([])
    }
  }

  const generateNewInsight = async () => {
    if (!searchQuery.trim()) return

    setIsLoading(true)
    setError("")

    try {
      const response = await fetch("/api/ai/answer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: searchQuery }),
      })

      if (!response.ok) {
        const data = await response.json().catch(() => ({}))
        throw new Error(data.error || "Failed to generate insight")
      }

      const data = await response.json()

      const newInsight: AIInsight = {
        id: Date.now().toString(),
        question: searchQuery,
        answer: data.answer || "I don't have enough information in your documents to answer this question. Try uploading more relevant documents.",
        source: data.sources?.[0]?.name ?? "Your documents",
        timestamp: new Date().toISOString(),
        confidence: data.confidence ?? 75,
        category: "Generated",
      }

      setInsights([newInsight, ...insights])
      setSearchQuery("")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate AI insight. Please try again.")
    } finally {
      setIsLoading(false)
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

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      HR: "bg-blue-100 text-blue-800",
      Finance: "bg-green-100 text-green-800",
      Sales: "bg-purple-100 text-purple-800",
      Generated: "bg-orange-100 text-orange-800",
    }
    return colors[category] ?? "bg-gray-100 text-gray-800"
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />

      <main className="flex-1 p-6 lg:p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <Brain className="h-8 w-8 text-accent" />
              <h1 className="text-3xl font-bold text-foreground text-balance">AI Insights</h1>
            </div>
            <p className="text-muted-foreground text-pretty">
              Ask questions and get answers from your uploaded documents. Upload files first if you have no documents.
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-accent" />
                Generate New Insight
              </CardTitle>
              <CardDescription>Ask a question to get an AI answer based on your documents</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Input
                  placeholder="Ask a question about your documents..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && generateNewInsight()}
                  className="flex-1"
                />
                <Button onClick={generateNewInsight} disabled={isLoading || !searchQuery.trim()}>
                  {isLoading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                </Button>
              </div>
              {error && (
                <Alert variant="destructive" className="mt-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-foreground">Recent Insights</h2>
                <Button variant="outline" size="sm" onClick={loadStoredInsights} disabled={isLoading}>
                  <RefreshCw className={`h-3 w-3 mr-1 ${isLoading ? "animate-spin" : ""}`} />
                  Refresh
                </Button>
              </div>

              <div className="space-y-4">
                {insights.map((insight) => (
                  <Card key={insight.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="pt-6">
                      <div className="space-y-4">
                        <div className="flex items-start justify-between gap-4">
                          <h3 className="font-medium text-foreground text-pretty">{insight.question}</h3>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground flex-shrink-0">
                            <Clock className="h-3 w-3" />
                            {formatTimestamp(insight.timestamp)}
                          </div>
                        </div>

                        <p className="text-sm text-muted-foreground text-pretty leading-relaxed">{insight.answer}</p>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">
                              {insight.source}
                            </Badge>
                            <Badge className={`text-xs ${getCategoryColor(insight.category)}`}>
                              {insight.category}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-1">
                            <CheckCircle className="h-3 w-3 text-green-600" />
                            <Badge variant="secondary" className="text-xs bg-green-100 text-green-800">
                              {insight.confidence}% confident
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {insights.length === 0 && !isLoading && (
                  <Card>
                    <CardContent className="pt-6 text-center py-10">
                      <Brain className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="font-medium text-foreground mb-2">No insights yet</h3>
                      <p className="text-sm text-muted-foreground">
                        Ask a question above to get an AI answer from your documents. Make sure you have uploaded files first.
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>

            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-foreground">Quick Stats</h2>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <TrendingUp className="h-4 w-4 text-accent" />
                    Your insights
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Total insights</span>
                    <span className="text-sm font-medium">{insights.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Avg confidence</span>
                    <span className="text-sm font-medium">
                      {insights.length > 0
                        ? Math.round(insights.reduce((acc, i) => acc + i.confidence, 0) / insights.length)
                        : 0}
                      %
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
