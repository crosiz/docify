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

interface TrendingTopic {
  topic: string
  count: number
  trend: "up" | "down" | "stable"
}

export default function AIInsightsPage() {
  const [insights, setInsights] = useState<AIInsight[]>([])
  const [trendingTopics, setTrendingTopics] = useState<TrendingTopic[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [searchQuery, setSearchQuery] = useState("")

  // Load initial insights
  useEffect(() => {
    loadInsights()
    loadTrendingTopics()
  }, [])

  const loadInsights = async () => {
    setIsLoading(true)
    try {
      // Simulate API call - in production, this would fetch real insights
      const mockInsights: AIInsight[] = [
        {
          id: "1",
          question: "What is our remote work policy?",
          answer:
            "Employees can work remotely up to 3 days per week with manager approval. Full remote work requires VP approval and is evaluated quarterly based on performance metrics.",
          source: "HR Policy Manual v2.3",
          timestamp: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
          confidence: 95,
          category: "HR",
        },
        {
          id: "2",
          question: "How do I submit expense reports?",
          answer:
            "Use the Concur system accessible through the employee portal. Submit within 30 days with receipts for amounts over $25. Meals are reimbursed up to $50 per day.",
          source: "Finance Guidelines",
          timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
          confidence: 98,
          category: "Finance",
        },
        {
          id: "3",
          question: "What are the Q4 sales targets?",
          answer:
            "Q4 targets are $2.4M total revenue with 15% growth in enterprise accounts and 25% growth in SMB segment. Each rep has individual quotas based on territory.",
          source: "Q4 Sales Plan.pdf",
          timestamp: new Date(Date.now() - 12 * 60 * 1000).toISOString(),
          confidence: 92,
          category: "Sales",
        },
      ]

      setInsights(mockInsights)
    } catch (err) {
      setError("Failed to load AI insights")
    } finally {
      setIsLoading(false)
    }
  }

  const loadTrendingTopics = () => {
    const mockTopics: TrendingTopic[] = [
      { topic: "Remote Work", count: 24, trend: "up" },
      { topic: "Expense Reports", count: 18, trend: "stable" },
      { topic: "Sales Targets", count: 15, trend: "up" },
      { topic: "Benefits", count: 12, trend: "down" },
      { topic: "Training", count: 8, trend: "up" },
    ]
    setTrendingTopics(mockTopics)
  }

  const generateNewInsight = async () => {
    if (!searchQuery.trim()) return

    setIsLoading(true)
    setError("")

    try {
      console.log("[v0] Generating AI insight for:", searchQuery)

      const response = await fetch("/api/ai/answer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: searchQuery }),
      })

      if (!response.ok) {
        throw new Error("Failed to generate insight")
      }

      const data = await response.json()

      const newInsight: AIInsight = {
        id: Date.now().toString(),
        question: searchQuery,
        answer: data.answer || "I don't have enough information to provide a comprehensive answer to this question.",
        source: data.sources?.[0] || "AI Generated",
        timestamp: new Date().toISOString(),
        confidence: data.confidence || 75,
        category: "Generated",
      }

      setInsights([newInsight, ...insights])
      setSearchQuery("")
    } catch (err) {
      console.error("[v0] Error generating insight:", err)
      setError("Failed to generate AI insight. Please try again.")
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
    const colors = {
      HR: "bg-blue-100 text-blue-800",
      Finance: "bg-green-100 text-green-800",
      Sales: "bg-purple-100 text-purple-800",
      Generated: "bg-orange-100 text-orange-800",
    }
    return colors[category as keyof typeof colors] || "bg-gray-100 text-gray-800"
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />

      <main className="flex-1 p-6 lg:p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header */}
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <Brain className="h-8 w-8 text-accent" />
              <h1 className="text-3xl font-bold text-foreground text-balance">AI Insights</h1>
            </div>
            <p className="text-muted-foreground text-pretty">
              Discover patterns and get intelligent answers from your knowledge base
            </p>
          </div>

          {/* Generate New Insight */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-accent" />
                Generate New Insight
              </CardTitle>
              <CardDescription>Ask a question to generate AI-powered insights from your documents</CardDescription>
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
            {/* Recent Insights */}
            <div className="lg:col-span-2 space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-foreground">Recent Insights</h2>
                <Button variant="outline" size="sm" onClick={loadInsights} disabled={isLoading}>
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
                    <CardContent className="pt-6 text-center">
                      <Brain className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="font-medium text-foreground mb-2">No insights yet</h3>
                      <p className="text-sm text-muted-foreground">
                        Generate your first AI insight by asking a question above
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>

            {/* Trending Topics */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-foreground">Trending Topics</h2>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <TrendingUp className="h-4 w-4 text-accent" />
                    Most Asked About
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {trendingTopics.map((topic, index) => (
                    <div key={topic.topic} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-foreground">{topic.topic}</span>
                        {topic.trend === "up" && <TrendingUp className="h-3 w-3 text-green-600" />}
                        {topic.trend === "down" && <TrendingUp className="h-3 w-3 text-red-600 rotate-180" />}
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {topic.count}
                      </Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Quick Stats */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Quick Stats</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Total Insights</span>
                    <span className="text-sm font-medium">{insights.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Avg Confidence</span>
                    <span className="text-sm font-medium">
                      {insights.length > 0
                        ? Math.round(insights.reduce((acc, i) => acc + i.confidence, 0) / insights.length)
                        : 0}
                      %
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Categories</span>
                    <span className="text-sm font-medium">{new Set(insights.map((i) => i.category)).size}</span>
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
