import { DocumentGrid } from "@/components/document-grid"
import { Sidebar } from "@/components/sidebar"

export default function DocumentsPage() {
    return (
        <div className="flex-1 w-full max-w-full overflow-y-auto">
            <main className="p-4 sm:p-6 lg:p-8">
                <div className="max-w-4xl mx-auto space-y-8">
                    <div className="space-y-2">
                        <h1 className="text-3xl font-bold text-foreground text-balance">Documents</h1>
                        <p className="text-muted-foreground text-pretty">
                            View, summarize, and manage your uploaded documents
                        </p>
                    </div>
                    <DocumentGrid />
                </div>
            </main>
        </div>
    )
}
