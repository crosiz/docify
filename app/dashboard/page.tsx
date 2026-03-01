import { SearchBar } from "@/components/search-bar"
import { DocumentGrid } from "@/components/document-grid"
import { InstantAnswers } from "@/components/instant-answers"
import { Sidebar } from "@/components/sidebar"
import { StatsCards } from "@/components/stats-cards"

export default function Dashboard() {
  return (
    <div className="flex-1 w-full max-w-full overflow-y-auto">
      <main className="p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header */}
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-foreground text-balance">Docify Knowledge Hub</h1>
            <p className="text-muted-foreground text-pretty">
              Find answers from your internal documents and emails instantly with AI
            </p>
          </div>

          {/* Search Section */}
          <SearchBar />

          {/* Stats Overview */}
          <StatsCards />

          {/* Instant Answers */}
          <InstantAnswers />

          {/* Recent Documents */}
          <DocumentGrid />
        </div>
      </main>
    </div>
  )
}
