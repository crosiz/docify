import { UploadZone } from "@/components/upload-zone"
import { UploadedFiles } from "@/components/uploaded-files"
import { UploadStats } from "@/components/upload-stats"
import { Sidebar } from "@/components/sidebar"

export default function UploadPage() {
  return (
    <div className="flex-1 w-full max-w-full overflow-y-auto">
      <main className="p-4 sm:p-6 lg:p-8">
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
      </main>
    </div>
  )
}
