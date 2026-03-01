"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, MessageSquare, Clock, TrendingUp, Loader2 } from "lucide-react"
import Link from "next/link"

interface DocStats {
  total: number
  todayCount: number
}

export function StatsCards() {
  const [stats, setStats] = useState<DocStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        const res = await fetch("/api/documents")
        const data = await res.json()
        if (!cancelled)
          setStats({
            total: data.total ?? 0,
            todayCount: data.todayCount ?? 0,
          })
      } catch {
        if (!cancelled) setStats({ total: 0, todayCount: 0 })
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [])

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="bg-card border-border">
            <CardContent className="p-6 flex items-center justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  const total = stats?.total ?? 0
  const todayCount = stats?.todayCount ?? 0

  const cards = [
    {
      title: "Total Documents",
      value: String(total),
      change: total === 0 ? "Upload files to get started" : "In your knowledge base",
      icon: FileText,
      description: "Indexed for AI search",
    },
    {
      title: "Uploaded Today",
      value: String(todayCount),
      change: todayCount === 0 ? "No uploads yet today" : "New documents added",
      icon: MessageSquare,
      description: "Documents added today",
    },
    {
      title: "Search Ready",
      value: total > 0 ? "Yes" : "—",
      change: total > 0 ? "Ask questions in AI Insights" : "Upload documents first",
      icon: Clock,
      description: "Semantic search over your docs",
    },
    {
      title: "Documents Status",
      value: total > 0 ? "Active" : "—",
      change: total > 0 ? "Ready for Q&A" : "Add PDF, DOCX, CSV, or TXT",
      icon: TrendingUp,
      description: "Based on your uploads",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((stat) => (
        <Card key={stat.title} className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-card-foreground">{stat.title}</CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-card-foreground">{stat.value}</div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <span className="text-accent font-medium">{stat.change}</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
            {total === 0 && stat.title === "Total Documents" && (
              <Link href="/upload" className="inline-block mt-2 text-xs text-accent hover:underline">
                Go to Upload →
              </Link>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
