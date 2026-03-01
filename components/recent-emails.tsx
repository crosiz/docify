"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Mail, Settings } from "lucide-react"

export function RecentEmails() {
  const [count, setCount] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        const res = await fetch("/api/emails/list")
        if (res.ok) {
          const data = await res.json()
          if (!cancelled) setCount(data.count ?? 0)
        } else {
          if (!cancelled) setCount(0)
        }
      } catch {
        if (!cancelled) setCount(0)
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
      <Card className="bg-card border-border">
        <CardContent className="p-8 flex items-center justify-center">
          <div className="h-6 w-6 border-2 border-accent border-t-transparent rounded-full animate-spin" />
        </CardContent>
      </Card>
    )
  }

  const hasEmails = count !== null && count > 0

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-card-foreground">Recent Emails</CardTitle>
          <Link href="/settings">
            <Button variant="outline" size="sm" className="border-border bg-transparent">
              Settings
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        {!hasEmails ? (
          <div className="text-center py-10">
            <Mail className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-medium text-foreground mb-2">No emails synced yet</h3>
            <p className="text-sm text-muted-foreground mb-6 max-w-sm mx-auto">
              Connect your inbox in Settings to search through your emails. Once connected, messages will be indexed and appear here.
            </p>
            <Link href="/settings">
              <Button variant="outline" className="border-border">
                <Settings className="h-4 w-4 mr-2" />
                Connect inbox
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              {count} email{count !== 1 ? "s" : ""} indexed and searchable. Use the search bar on the Dashboard or AI Insights to ask questions about your emails.
            </p>
          </div>
        )}
        <div className="pt-4 border-t border-border mt-6">
          <p className="text-xs text-muted-foreground text-center">
            Email content is indexed and searchable through the main search interface once connected.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
