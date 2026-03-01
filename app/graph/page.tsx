import { Sidebar } from "@/components/sidebar"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Network, Search } from "lucide-react"
import { Input } from "@/components/ui/input"

export default function KnowledgeGraphPage() {
    return (
        <div className="flex-1 w-full max-w-full overflow-y-auto">
            <main className="p-4 sm:p-6 lg:p-8 flex flex-col h-full">
                <div className="max-w-6xl mx-auto w-full flex-1 flex flex-col space-y-6">
                    <div className="flex items-center justify-between">
                        <div className="space-y-1">
                            <h1 className="text-3xl font-bold tracking-tight text-foreground">Knowledge Graph</h1>
                            <p className="text-muted-foreground">Visualize connections between your documents, entities, and concepts.</p>
                        </div>
                        <div className="relative w-64">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                type="search"
                                placeholder="Search nodes..."
                                className="pl-9 bg-muted/50 border-none"
                            />
                        </div>
                    </div>

                    <Card className="flex-1 min-h-[500px] border-border bg-card relative overflow-hidden flex items-center justify-center">
                        {/* Visual Placeholder for Knowledge Graph */}
                        <div className="absolute inset-0 pattern-grid-lg text-muted/20 opacity-50 pointer-events-none" />
                        <CardContent className="text-center z-10 space-y-4">
                            <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                                <Network className="h-8 w-8 text-primary" />
                            </div>
                            <h3 className="text-xl font-medium">Graph visualization is processing</h3>
                            <p className="text-muted-foreground max-w-sm mx-auto">
                                We are currently establishing semantic links between your uploaded documents. Check back soon exploring entity relationships.
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    )
}
