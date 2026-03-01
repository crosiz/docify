"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Upload, FileText, HardDrive, Clock, Loader2 } from "lucide-react"

export function UploadStats() {
  const [stats, setStats] = useState<{ total: number; todayCount: number } | null>(null)

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        const res = await fetch("/api/documents")
        const data = await res.json()
        if (!cancelled) {
          setStats({
            total: data.total ?? 0,
            todayCount: data.todayCount ?? 0,
          })
        }
      } catch {
        if (!cancelled) setStats({ total: 0, todayCount: 0 })
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [])

  const total = stats?.total ?? 0
  const todayCount = stats?.todayCount ?? 0
  const storageEstimate = total > 0 ? `${(total * 0.05).toFixed(1)} MB` : "0 MB"

  const statCards = [
    {
      title: "Files Uploaded Today",
      value: stats === null ? "—" : String(todayCount),
      change: "New documents added",
      icon: Upload,
      description: "Indexed for search",
    },
    {
      title: "Total Documents",
      value: stats === null ? "—" : String(total),
      change: "In knowledge base",
      icon: FileText,
      description: "Across all formats",
    },
    {
      title: "Storage Used",
      value: storageEstimate,
      change: "Approximate",
      icon: HardDrive,
      description: "Text + embeddings",
    },
    {
      title: "Processing",
      value: "~30s",
      change: "Per file",
      icon: Clock,
      description: "Parse, chunk, embed",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statCards.map((stat) => (
        <Card key={stat.title} className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-card-foreground">{stat.title}</CardTitle>
            {stats === null && stat.icon === Upload ? (
              <Loader2 className="h-4 w-4 text-muted-foreground animate-spin" />
            ) : (
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            )}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-card-foreground">{stat.value}</div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <span className="text-accent font-medium">{stat.change}</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
