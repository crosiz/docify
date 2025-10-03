import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, MessageSquare, Clock, TrendingUp } from "lucide-react"

const stats = [
  {
    title: "Total Documents",
    value: "1,247",
    change: "+12%",
    icon: FileText,
    description: "Indexed documents",
  },
  {
    title: "Queries Today",
    value: "89",
    change: "+23%",
    icon: MessageSquare,
    description: "AI-powered searches",
  },
  {
    title: "Avg Response Time",
    value: "1.2s",
    change: "-15%",
    icon: Clock,
    description: "Lightning fast answers",
  },
  {
    title: "Accuracy Rate",
    value: "94.5%",
    change: "+2%",
    icon: TrendingUp,
    description: "Answer relevance",
  },
]

export function StatsCards() {
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
              <span>{stat.description}</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
