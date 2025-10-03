import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Upload, FileText, HardDrive, Clock } from "lucide-react"

const stats = [
  {
    title: "Files Uploaded Today",
    value: "23",
    change: "+8 from yesterday",
    icon: Upload,
    description: "New documents added",
  },
  {
    title: "Total Documents",
    value: "1,247",
    change: "Across all formats",
    icon: FileText,
    description: "In knowledge base",
  },
  {
    title: "Storage Used",
    value: "2.8 GB",
    change: "of 10 GB limit",
    icon: HardDrive,
    description: "Cloud storage",
  },
  {
    title: "Processing Time",
    value: "~30s",
    change: "Average per file",
    icon: Clock,
    description: "AI indexing speed",
  },
]

export function UploadStats() {
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
