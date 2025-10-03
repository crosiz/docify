import { UploadZone } from "@/components/upload-zone"
import { UploadedFiles } from "@/components/uploaded-files"
import { UploadStats } from "@/components/upload-stats"

export default function UploadPage() {
  return (
    <div className="flex min-h-screen bg-background">
      <div className="flex-1 p-6 lg:p-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Header */}
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-foreground text-balance">Upload Documents</h1>
            <p className="text-muted-foreground text-pretty">
              Upload PDFs, Word documents, and CSV files to expand your knowledge base
            </p>
          </div>

          {/* Upload Stats */}
          <UploadStats />

          {/* Upload Zone */}
          <UploadZone />

          {/* Recently Uploaded Files */}
          <UploadedFiles />
        </div>
      </div>
    </div>
  )
}
