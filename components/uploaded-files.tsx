import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { FileText, Download, Trash2, Calendar, CheckCircle } from "lucide-react"

const recentUploads = [
  {
    name: "Q4 Budget Planning.pdf",
    size: "2.4 MB",
    uploadedAt: "2 hours ago",
    status: "processed",
    type: "PDF",
    category: "Finance",
  },
  {
    name: "Employee Survey Results.csv",
    size: "890 KB",
    uploadedAt: "4 hours ago",
    status: "processed",
    type: "CSV",
    category: "HR",
  },
  {
    name: "Product Roadmap 2024.docx",
    size: "1.8 MB",
    uploadedAt: "6 hours ago",
    status: "processing",
    type: "DOCX",
    category: "Product",
  },
  {
    name: "Marketing Campaign Analysis.pdf",
    size: "3.2 MB",
    uploadedAt: "1 day ago",
    status: "processed",
    type: "PDF",
    category: "Marketing",
  },
  {
    name: "Technical Specifications.docx",
    size: "5.1 MB",
    uploadedAt: "1 day ago",
    status: "processed",
    type: "DOCX",
    category: "Engineering",
  },
]

const categoryColors = {
  Finance: "bg-blue-100 text-blue-800 border-blue-200",
  HR: "bg-green-100 text-green-800 border-green-200",
  Product: "bg-purple-100 text-purple-800 border-purple-200",
  Marketing: "bg-orange-100 text-orange-800 border-orange-200",
  Engineering: "bg-red-100 text-red-800 border-red-200",
}

export function UploadedFiles() {
  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="text-card-foreground">Recently Uploaded</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentUploads.map((file, index) => (
            <div key={index} className="flex items-center gap-4 p-4 bg-muted rounded-lg">
              <div className="p-2 bg-accent/10 rounded-lg">
                <FileText className="h-4 w-4 text-accent" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-medium text-sm text-card-foreground truncate">{file.name}</h4>
                  {file.status === "processed" && <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />}
                  {file.status === "processing" && (
                    <div className="h-4 w-4 border-2 border-accent border-t-transparent rounded-full animate-spin flex-shrink-0" />
                  )}
                </div>

                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span>{file.size}</span>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {file.uploadedAt}
                  </div>
                  <Badge
                    variant="outline"
                    className={`text-xs ${categoryColors[file.category as keyof typeof categoryColors]}`}
                  >
                    {file.category}
                  </Badge>
                  <Badge variant="outline" className="text-xs border-border">
                    {file.type}
                  </Badge>
                </div>

                {file.status === "processing" && (
                  <p className="text-xs text-accent mt-1">Processing for AI search...</p>
                )}
              </div>

              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="h-8 border-border bg-transparent">
                  <Download className="h-3 w-3" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 border-border bg-transparent hover:bg-destructive/10 hover:border-destructive/20"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
