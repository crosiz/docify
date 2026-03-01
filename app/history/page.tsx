"use client"

import { useState, useEffect } from "react"
import { Sidebar } from "@/components/sidebar"
import { Card, CardContent } from "@/components/ui/card"
import { History as HistoryIcon, Search, Clock, ArrowRight, Loader2, Sparkles } from "lucide-react"
import { Input } from "@/components/ui/input"
import { formatDistanceToNow } from "date-fns"
import { AIAnswer } from "@/components/ai-answer"

interface SearchHistoryItem {
    id: string
    query: string
    answer: string | null
    createdAt: string
    results: any
}

export default function SearchHistoryPage() {
    const [history, setHistory] = useState<SearchHistoryItem[]>([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState("")
    const [expandedItem, setExpandedItem] = useState<SearchHistoryItem | null>(null)

    useEffect(() => {
        async function fetchHistory() {
            try {
                const res = await fetch("/api/search/history")
                if (res.ok) {
                    const data = await res.json()
                    setHistory(data.history || [])
                }
            } catch (error) {
                console.error("Failed to load history:", error)
            } finally {
                setLoading(false)
            }
        }
        fetchHistory()
    }, [])

    const filteredHistory = history.filter(item =>
        item.query.toLowerCase().includes(searchQuery.toLowerCase())
    )

    return (
        <div className="flex-1 w-full max-w-full overflow-y-auto">
            <main className="p-4 sm:p-6 lg:p-8">
                <div className="max-w-4xl mx-auto space-y-8">
                    <div className="space-y-1">
                        <h1 className="text-3xl font-bold tracking-tight text-foreground">Search History</h1>
                        <p className="text-muted-foreground">Review your past queries and resume conversations.</p>
                    </div>

                    <div className="relative max-w-md">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Filter your history..."
                            className="pl-9 bg-card focus-visible:ring-accent"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    {loading ? (
                        <div className="flex justify-center py-12">
                            <Loader2 className="h-8 w-8 animate-spin text-accent" />
                        </div>
                    ) : filteredHistory.length === 0 ? (
                        <Card className="border-border bg-card p-12 text-center">
                            <HistoryIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                            <h3 className="text-lg font-medium text-foreground">No history found</h3>
                            <p className="text-muted-foreground mt-2 text-balance">
                                Your future RAG searches and document questions will appear here.
                            </p>
                        </Card>
                    ) : (
                        <div className="space-y-4">
                            {filteredHistory.map((item) => (
                                <div key={item.id} className="space-y-2">
                                    <Card
                                        className={`border-border transition-colors cursor-pointer \${expandedItem?.id === item.id ? 'bg-accent/5 border-accent/20' : 'bg-card hover:bg-muted/50'}`}
                                        onClick={() => setExpandedItem(expandedItem?.id === item.id ? null : item)}
                                    >
                                        <div className="p-4 flex items-center justify-between group">
                                            <div className="flex items-center gap-4">
                                                <div className="p-2 bg-muted rounded-full text-muted-foreground">
                                                    <Clock className="h-4 w-4" />
                                                </div>
                                                <div>
                                                    <p className="font-medium text-foreground">{item.query}</p>
                                                    <p className="text-sm text-muted-foreground flex items-center gap-2">
                                                        {formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}
                                                        {item.results && Array.isArray(item.results) ? ` • \${item.results.length} sources found` : ''}
                                                    </p>
                                                </div>
                                            </div>
                                            <ArrowRight className={`h-5 w-5 text-muted-foreground transition-all \${expandedItem?.id === item.id ? 'rotate-90 text-accent' : 'opacity-0 group-hover:opacity-100'}`} />
                                        </div>
                                    </Card>

                                    {expandedItem?.id === item.id && item.answer && (
                                        <div className="pl-14 pr-4 pb-4 animate-in slide-in-from-top-2 duration-200">
                                            <div className="bg-muted/50 rounded-xl p-5 border border-border">
                                                <div className="flex items-center gap-2 mb-3">
                                                    <Sparkles className="h-4 w-4 text-accent" />
                                                    <h4 className="text-sm font-semibold text-foreground">AI Answer</h4>
                                                </div>
                                                <div className="prose prose-sm dark:prose-invert max-w-none text-muted-foreground text-sm">
                                                    {item.answer}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </div>
    )
}
