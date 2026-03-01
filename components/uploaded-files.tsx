"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { FileText, Calendar, CheckCircle, Loader2, RefreshCw } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

interface Doc {
  id: string
  name: string
  mimeType: string
  size: number
  uploadedAt: string
  status: string
  processedAt: string | null
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

export function UploadedFiles() {
  const [documents, setDocuments] = useState<Doc[]>([])
  const [loading, setLoading] = useState(true)

  const fetchDocs = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/documents")
      const data = await res.json()
      setDocuments(data.documents ?? [])
    } catch {
      setDocuments([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDocs()
  }, [])

  return (
    <Card className="bg-card border-border">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-card-foreground">Recently Uploaded</CardTitle>
        <Button variant="ghost" size="sm" onClick={fetchDocs} disabled={loading}>
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
        </Button>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center py-8 text-muted-foreground">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        ) : documents.length === 0 ? (
          <p className="text-sm text-muted-foreground py-6 text-center">No documents yet. Upload files above.</p>
        ) : (
          <div className="space-y-4">
            {documents.map((file) => (
              <div key={file.id} className="flex items-center gap-4 p-4 bg-muted rounded-lg">
                <div className="p-2 bg-accent/10 rounded-lg">
                  <FileText className="h-4 w-4 text-accent" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium text-sm text-card-foreground truncate">{file.name}</h4>
                    {(file.status === "COMPLETED" || file.status === "processed") && (
                      <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                    )}
                    {file.status === "PROCESSING" && (
                      <Loader2 className="h-4 w-4 text-accent animate-spin flex-shrink-0" />
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span>{formatSize(file.size)}</span>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {formatDistanceToNow(new Date(file.uploadedAt), { addSuffix: true })}
                    </div>
                    <Badge variant="outline" className="text-xs border-border">
                      {getTypeLabel(file.mimeType)}
                    </Badge>
                  </div>
                  {file.status === "PROCESSING" && (
                    <p className="text-xs text-accent mt-1">Processing for AI search...</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
