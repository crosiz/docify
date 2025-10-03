import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Mail, MessageSquare, Clock, TrendingUp } from "lucide-react"

const stats = [
  {
    title: "Connected Inboxes",
    value: "1",
    change: "Gmail connected",
    icon: Mail,
    description: "Active email accounts",
  },
  {
    title: "Messages Indexed",
    value: "1,247",
    change: "+23 today",
    icon: MessageSquare,
    description: "Searchable emails",
  },
  {
    title: "Last Sync",
    value: "2h ago",
    change: "Auto-sync enabled",
    icon: Clock,
    description: "Real-time updates",
  },
  {
    title: "Email Queries",
    value: "34",
    change: "+12% this week",
    icon: TrendingUp,
    description: "AI-powered searches",
  },
]

export function EmailStats() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat) => (
        <Card key={stat.title} className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-card-foreground">{stat.title}</CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-card-foreground">{stat.value}</div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <span className="text-accent font-medium">{stat.change}</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
