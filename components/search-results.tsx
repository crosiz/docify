import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { FileText, Mail, ExternalLink, Loader2, User } from "lucide-react"

interface SearchResult {
  id: string
  documentName: string
  text: string
  type: "document" | "email"
  sender?: string
  similarity: number
  relevanceScore: number
}

interface SearchResultsProps {
  results: SearchResult[]
  query: string
  isLoading: boolean
}

export function SearchResults({ results, query, isLoading }: SearchResultsProps) {
  if (isLoading) {
    return (
      <Card className="bg-card border-border">
        <CardContent className="p-8 text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-accent" />
          <p className="text-muted-foreground">Searching through your documents and emails...</p>
        </CardContent>
      </Card>
    )
  }

  if (results.length === 0) {
    return (
      <Card className="bg-card border-border">
        <CardContent className="p-8 text-center">
          <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-semibold text-card-foreground mb-2">No results found</h3>
          <p className="text-muted-foreground text-pretty">
            Try different keywords or upload more documents to expand your knowledge base.
          </p>
        </CardContent>
      </Card>
    )
  }

  // Separate documents and emails
  const documents = results.filter((r) => r.type === "document")
  const emails = results.filter((r) => r.type === "email")

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="text-card-foreground">
          Search Results for "{query}" ({results.length} found)
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Documents Section */}
        {documents.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-card-foreground flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Documents ({documents.length})
            </h3>
            {documents.map((result) => (
              <div key={result.id} className="border-l-4 border-accent pl-4 space-y-3">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-accent flex-shrink-0" />
                    <h4 className="font-medium text-card-foreground text-pretty">{result.documentName}</h4>
                  </div>
                  <Badge variant="secondary" className="bg-accent/10 text-accent border-accent/20 flex-shrink-0">
                    {result.relevanceScore}% match
                  </Badge>
                </div>

                <p className="text-sm text-muted-foreground text-pretty leading-relaxed">{result.text}</p>

                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" className="border-border bg-transparent">
                    <ExternalLink className="h-3 w-3 mr-1" />
                    View Document
                  </Button>
                  <Badge variant="outline" className="text-xs border-border">
                    Similarity: {Math.round(result.similarity * 100)}%
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Emails Section */}
        {emails.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-card-foreground flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Emails ({emails.length})
            </h3>
            {emails.map((result) => (
              <div key={result.id} className="border-l-4 border-blue-500 pl-4 space-y-3">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-blue-500 flex-shrink-0" />
                    <h4 className="font-medium text-card-foreground text-pretty">
                      {result.documentName.replace("Email: ", "")}
                    </h4>
                  </div>
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800 border-blue-200 flex-shrink-0">
                    {result.relevanceScore}% match
                  </Badge>
                </div>

                {result.sender && (
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <User className="h-3 w-3" />
                    From: {result.sender}
                  </div>
                )}

                <p className="text-sm text-muted-foreground text-pretty leading-relaxed">{result.text}</p>

                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" className="border-border bg-transparent">
                    <Mail className="h-3 w-3 mr-1" />
                    View Email
                  </Button>
                  <Button variant="outline" size="sm" className="border-border bg-transparent">
                    <ExternalLink className="h-3 w-3 mr-1" />
                    Open in Inbox
                  </Button>
                  <Badge variant="outline" className="text-xs border-border">
                    Similarity: {Math.round(result.similarity * 100)}%
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
