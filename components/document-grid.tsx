"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { FileText, Eye, Calendar, Sparkles, Loader2 } from "lucide-react"

const documents = [
  {
    id: "doc_1",
    title: "Employee Handbook 2024",
    type: "PDF",
    size: "2.4 MB",
    lastModified: "2 days ago",
    category: "HR",
    queries: 45,
    content:
      "Our comprehensive employee handbook covers remote work policies, benefits, vacation time, and company procedures. Remote work is allowed up to 3 days per week with manager approval.",
  },
  {
    id: "doc_2",
    title: "Q4 Marketing Strategy",
    type: "DOCX",
    size: "1.8 MB",
    lastModified: "1 week ago",
    category: "Marketing",
    queries: 23,
    content:
      "Q4 marketing strategy focuses on digital campaigns, customer acquisition, and brand awareness initiatives across multiple channels.",
  },
  {
    id: "doc_3",
    title: "Technical Architecture Guide",
    type: "PDF",
    size: "5.2 MB",
    lastModified: "3 days ago",
    category: "Engineering",
    queries: 67,
    content:
      "Technical architecture documentation covering system design, API specifications, database schemas, and deployment procedures.",
  },
  {
    id: "doc_4",
    title: "Sales Process Documentation",
    type: "PDF",
    size: "1.2 MB",
    lastModified: "5 days ago",
    category: "Sales",
    queries: 34,
    content:
      "Complete sales process documentation including lead qualification, proposal creation, and customer onboarding procedures.",
  },
  {
    id: "doc_5",
    title: "Budget Planning Template",
    type: "XLSX",
    size: "890 KB",
    lastModified: "1 day ago",
    category: "Finance",
    queries: 12,
    content:
      "Annual budget planning template with categories for expenses, revenue projections, and quarterly review processes.",
  },
  {
    id: "doc_6",
    title: "Project Management Guidelines",
    type: "DOCX",
    size: "3.1 MB",
    lastModified: "4 days ago",
    category: "Operations",
    queries: 28,
    content:
      "Project management best practices, timeline planning, resource allocation, and team coordination guidelines.",
  },
]

const categoryColors = {
  HR: "bg-blue-100 text-blue-800 border-blue-200",
  Marketing: "bg-green-100 text-green-800 border-green-200",
  Engineering: "bg-purple-100 text-purple-800 border-purple-200",
  Sales: "bg-orange-100 text-orange-800 border-orange-200",
  Finance: "bg-red-100 text-red-800 border-red-200",
  Operations: "bg-yellow-100 text-yellow-800 border-yellow-200",
}

export function DocumentGrid() {
  const [summarizing, setSummarizing] = useState<string | null>(null)
  const [summaries, setSummaries] = useState<Record<string, string>>({})

  const handleSummarize = async (docId: string, docTitle: string, content: string) => {
    setSummarizing(docId)

    try {
      console.log("[v0] Generating summary for:", docTitle)

      const response = await fetch("/api/ai/summarize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          documentName: docTitle,
          content: content,
        }),
      })

      if (!response.ok) {
        throw new Error("Summarization failed")
      }

      const data = await response.json()
      setSummaries((prev) => ({
        ...prev,
        [docId]: data.summary,
      }))

      console.log("[v0] Summary generated successfully")
    } catch (error) {
      console.error("[v0] Error generating summary:", error)
    } finally {
      setSummarizing(null)
    }
  }

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-card-foreground">Recent Documents</CardTitle>
          <Button variant="outline" size="sm" className="border-border bg-transparent">
            View All
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {documents.map((doc, index) => (
            <Card key={index} className="bg-muted border-border hover:shadow-md transition-shadow">
              <CardContent className="p-4 space-y-3">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-accent/10 rounded-lg">
                    <FileText className="h-4 w-4 text-accent" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm text-card-foreground text-pretty">{doc.title}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge
                        variant="outline"
                        className={`text-xs ${categoryColors[doc.category as keyof typeof categoryColors]}`}
                      >
                        {doc.category}
                      </Badge>
                      <span className="text-xs text-muted-foreground">{doc.type}</span>
                    </div>
                  </div>
                </div>

                {/* AI Summary */}
                {summaries[doc.id] && (
                  <div className="bg-accent/5 border border-accent/20 rounded-lg p-3">
                    <div className="flex items-center gap-1 mb-2">
                      <Sparkles className="h-3 w-3 text-accent" />
                      <span className="text-xs font-medium text-accent">AI Summary</span>
                    </div>
                    <p className="text-xs text-card-foreground leading-relaxed">{summaries[doc.id]}</p>
                  </div>
                )}

                <div className="space-y-2 text-xs text-muted-foreground">
                  <div className="flex items-center justify-between">
                    <span>{doc.size}</span>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {doc.lastModified}
                    </div>
                  </div>
                  <div className="text-accent font-medium">{doc.queries} queries this month</div>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button variant="outline" size="sm" className="flex-1 h-8 text-xs border-border bg-transparent">
                    <Eye className="h-3 w-3 mr-1" />
                    View
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleSummarize(doc.id, doc.title, doc.content)}
                    disabled={summarizing === doc.id}
                    className="flex-1 h-8 text-xs border-border bg-transparent"
                  >
                    {summarizing === doc.id ? (
                      <>
                        <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                        AI
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
