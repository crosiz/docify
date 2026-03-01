"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { FileText, Calendar, Sparkles, Loader2, Upload } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

interface Doc {
  id: string
  name: string
  mimeType: string
  size: number
  uploadedAt: string
  status: string
}

function formatSize(bytes: number) {
  if (bytes === 0) return "0 B"
  const k = 1024
  const sizes = ["B", "KB", "MB", "GB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${Number((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`
}

function getTypeLabel(mime: string) {
  if (mime.includes("pdf")) return "PDF"
  if (mime.includes("word") || mime.includes("document")) return "DOCX"
  if (mime.includes("csv")) return "CSV"
  if (mime.includes("plain")) return "TXT"
  return "File"
}

export function DocumentGrid() {
  const [documents, setDocuments] = useState<Doc[]>([])
  const [loading, setLoading] = useState(true)
  const [summarizing, setSummarizing] = useState<string | null>(null)
  const [summaries, setSummaries] = useState<Record<string, string>>({})

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        const res = await fetch("/api/documents")
        const data = await res.json()
        if (!cancelled) setDocuments(data.documents ?? [])
      } catch {
        if (!cancelled) setDocuments([])
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [])

  const handleSummarize = async (docId: string, docName: string) => {
    setSummarizing(docId)
    try {
      const res = await fetch(`/api/documents/${docId}`)
      if (!res.ok) throw new Error("Failed to load document")
      const doc = await res.json()
      const content = (doc.content ?? "").slice(0, 8000)

      let apiKey = ""
      try {
        const stored = localStorage.getItem("akop-settings")
        if (stored) {
          const parsedSettings = JSON.parse(stored)
          if (parsedSettings.openaiApiKey) {
            apiKey = parsedSettings.openaiApiKey
          }
        }
      } catch (e) { }

      const headers: Record<string, string> = { "Content-Type": "application/json" }
      if (apiKey) {
        headers["x-openai-key"] = apiKey
      }

      const response = await fetch("/api/ai/summarize", {
        method: "POST",
        headers,
        body: JSON.stringify({ documentName: docName, content }),
      })
      if (!response.ok) throw new Error("Summarization failed")
      const data = await response.json()
      setSummaries((prev) => ({ ...prev, [docId]: data.summary }))
    } catch (error) {
      console.error("Error generating summary:", error)
    } finally {
      setSummarizing(null)
    }
  }

  if (loading) {
    return (
      <Card className="bg-card border-border">
        <CardContent className="p-12 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    )
  }

  if (documents.length === 0) {
    return (
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-card-foreground">Recent Documents</CardTitle>
        </CardHeader>
        <CardContent className="text-center py-12">
          <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="font-medium text-foreground mb-2">No documents yet</h3>
          <p className="text-sm text-muted-foreground mb-6 max-w-sm mx-auto">
            Upload PDF, DOCX, CSV, or TXT files to build your knowledge base. They will appear here and be searchable.
          </p>
          <Link href="/upload">
            <Button className="bg-accent hover:bg-accent/90 text-accent-foreground">
              <Upload className="h-4 w-4 mr-2" />
              Upload documents
            </Button>
          </Link>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-card-foreground">Recent Documents</CardTitle>
          <Link href="/upload">
            <Button variant="outline" size="sm" className="border-border bg-transparent">
              Upload more
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {documents.map((doc) => (
            <Card key={doc.id} className="bg-muted border-border hover:shadow-md transition-shadow">
              <CardContent className="p-4 space-y-3">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-accent/10 rounded-lg">
                    <FileText className="h-4 w-4 text-accent" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm text-card-foreground truncate">{doc.name}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-muted-foreground">{getTypeLabel(doc.mimeType)}</span>
                    </div>
                  </div>
                </div>

                {summaries[doc.id] && (
                  <div className="bg-accent/5 border border-accent/20 rounded-lg p-3">
                    <div className="flex items-center gap-1 mb-2">
                      <Sparkles className="h-3 w-3 text-accent" />
                      <span className="text-xs font-medium text-accent">AI Summary</span>
                    </div>
                    <p className="text-xs text-card-foreground leading-relaxed">{summaries[doc.id]}</p>
                  </div>
                )}

                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{formatSize(doc.size)}</span>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {formatDistanceToNow(new Date(doc.uploadedAt), { addSuffix: true })}
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleSummarize(doc.id, doc.name)}
                    disabled={summarizing === doc.id}
                    className="flex-1 h-8 text-xs border-border bg-transparent"
                  >
                    {summarizing === doc.id ? (
                      <>
                        <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                        Summarizing…
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-3 w-3 mr-1" />
                        Summarize
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
