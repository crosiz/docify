import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Mail, Calendar, User, ExternalLink } from "lucide-react"

const recentEmails = [
  {
    id: "email_1",
    subject: "Q4 Budget Review Meeting",
    sender: "Sarah Johnson <sarah.johnson@company.com>",
    date: "2 hours ago",
    snippet:
      "Hi team, I've scheduled our Q4 budget review for next Tuesday at 2 PM. Please review the attached budget proposal and come prepared with your department's requirements.",
    category: "Finance",
    hasAttachment: true,
    isImportant: true,
  },
  {
    id: "email_2",
    subject: "New Employee Onboarding Process",
    sender: "HR Team <hr@company.com>",
    date: "4 hours ago",
    snippet:
      "We've updated our employee onboarding process to include new security training modules. All managers should review the updated checklist before the next new hire starts.",
    category: "HR",
    hasAttachment: false,
    isImportant: false,
  },
  {
    id: "email_3",
    subject: "Project Alpha Status Update",
    sender: "Mike Chen <mike.chen@company.com>",
    date: "6 hours ago",
    snippet:
      "Project Alpha is on track for the December deadline. We've completed the API integration and are now moving to the testing phase. The client demo is scheduled for next week.",
    category: "Engineering",
    hasAttachment: true,
    isImportant: false,
  },
  {
    id: "email_4",
    subject: "Customer Feedback Summary - October",
    sender: "Customer Success <success@company.com>",
    date: "1 day ago",
    snippet:
      "October customer feedback shows 94% satisfaction rate. Key improvement areas include response time and feature documentation. Full report attached.",
    category: "Customer Success",
    hasAttachment: true,
    isImportant: true,
  },
  {
    id: "email_5",
    subject: "Security Policy Updates",
    sender: "IT Security <security@company.com>",
    date: "1 day ago",
    snippet:
      "Important security policy updates effective immediately: All employees must enable 2FA on company accounts. VPN is now required for all remote access.",
    category: "Security",
    hasAttachment: false,
    isImportant: true,
  },
]

const categoryColors = {
  Finance: "bg-blue-100 text-blue-800 border-blue-200",
  HR: "bg-green-100 text-green-800 border-green-200",
  Engineering: "bg-purple-100 text-purple-800 border-purple-200",
  "Customer Success": "bg-orange-100 text-orange-800 border-orange-200",
  Security: "bg-red-100 text-red-800 border-red-200",
}

export function RecentEmails() {
  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-card-foreground">Recent Emails</CardTitle>
          <Button variant="outline" size="sm" className="border-border bg-transparent">
            View All
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {recentEmails.map((email) => (
          <div key={email.id} className="border-l-4 border-accent pl-4 space-y-3">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-medium text-card-foreground text-pretty">{email.subject}</h4>
                  {email.isImportant && (
                    <Badge variant="secondary" className="bg-red-100 text-red-800 border-red-200 text-xs">
                      Important
                    </Badge>
                  )}
                </div>

                <div className="flex items-center gap-3 text-xs text-muted-foreground mb-2">
                  <div className="flex items-center gap-1">
                    <User className="h-3 w-3" />
                    {email.sender}
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {email.date}
                  </div>
                  {email.hasAttachment && (
                    <Badge variant="outline" className="text-xs border-border">
                      Attachment
                    </Badge>
                  )}
                </div>
              </div>

              <Badge
                variant="outline"
                className={`text-xs flex-shrink-0 ${categoryColors[email.category as keyof typeof categoryColors]}`}
              >
                {email.category}
              </Badge>
            </div>

            <p className="text-sm text-muted-foreground text-pretty leading-relaxed">{email.snippet}</p>

            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="border-border bg-transparent">
                <Mail className="h-3 w-3 mr-1" />
                View Email
              </Button>
              <Button variant="outline" size="sm" className="border-border bg-transparent">
                <ExternalLink className="h-3 w-3 mr-1" />
                Open in Inbox
              </Button>
            </div>
          </div>
        ))}

        <div className="pt-4 border-t border-border">
          <p className="text-xs text-muted-foreground text-center">
            Email content is automatically indexed and searchable through the main search interface.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
