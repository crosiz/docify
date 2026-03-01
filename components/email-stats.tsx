"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Mail, MessageSquare, Clock, TrendingUp, Loader2 } from "lucide-react"

export function EmailStats() {
  const [stats, setStats] = useState<{ connected: number; indexed: number } | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        const res = await fetch("/api/emails/stats")
        if (res.ok) {
          const data = await res.json()
          if (!cancelled)
            setStats({
              connected: data.connectedAccounts ?? 0,
              indexed: data.indexedCount ?? 0,
            })
        } else {
          if (!cancelled) setStats({ connected: 0, indexed: 0 })
        }
      } catch {
        if (!cancelled) setStats({ connected: 0, indexed: 0 })
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
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  const connected = stats?.connected ?? 0
  const indexed = stats?.indexed ?? 0

  const cards = [
    {
      title: "Connected Inboxes",
      value: String(connected),
      change: connected === 0 ? "None connected" : "Active",
      icon: Mail,
      description: "Email accounts linked",
    },
    {
      title: "Messages Indexed",
      value: String(indexed),
      change: indexed === 0 ? "Connect inbox to sync" : "Searchable",
      icon: MessageSquare,
      description: "Emails in knowledge base",
    },
    {
      title: "Last Sync",
      value: indexed > 0 ? "—" : "—",
      change: "Sync when connected",
      icon: Clock,
      description: "Email sync status",
    },
    {
      title: "Status",
      value: connected > 0 ? "Connected" : "Not connected",
      change: connected === 0 ? "Go to Settings" : "Ready for search",
      icon: TrendingUp,
      description: "Email integration",
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
            {connected === 0 && stat.title === "Connected Inboxes" && (
              <Link href="/settings" className="inline-block mt-2 text-xs text-accent hover:underline">
                Connect in Settings →
              </Link>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
