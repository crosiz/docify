import { EmailSetup } from "@/components/email-setup"
import { EmailStats } from "@/components/email-stats"
import { RecentEmails } from "@/components/recent-emails"
import { Sidebar } from "@/components/sidebar"

export default function EmailPage() {
  return (
    <div className="flex-1 w-full max-w-full overflow-y-auto">
      <main className="p-4 sm:p-6 lg:p-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Header */}
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-foreground text-balance">Email Integration</h1>
            <p className="text-muted-foreground text-pretty">
              Connect your email inbox to search through important messages and conversations
            </p>
          </div>

          {/* Email Stats */}
          <EmailStats />

          {/* Email Setup */}
          <EmailSetup />

          {/* Recent Emails */}
          <RecentEmails />
        </div>
      </main>
    </div>
  )
}
