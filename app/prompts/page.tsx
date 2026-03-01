"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Library, Plus, ChevronRight, MessageSquareCode, Wand2, Loader2, Copy, CheckCircle2 } from "lucide-react"

export default function PromptLibraryPage() {
    const defaultPrompts = [
        { title: "Summarize Meeting", category: "Meetings", description: "Extract key decisions and action items from a meeting transcript...", content: "Please read the following meeting transcript. Identify all attendees, extract any final decisions that were made, and provide a bulleted list of action items, including who is responsible for each item." },
        { title: "Draft Email Response", category: "Communication", description: "Draft a professional email reply based on company policies.", content: "Using the company's internal communication policies provided in the context, draft a polite, professional email response addressing the customer's concerns about their recent support ticket." },
        { title: "Extract Entities", category: "Data Processing", description: "Extract names, dates, and organizations from legal documents.", content: "Scan the provided legal document and extract all named entities. Group them by People, Organizations, Dates, and Monetary Values. Format the output as a JSON object." },
        { title: "Explain Code", category: "Engineering", description: "Explain technical documentation to a non-technical audience.", content: "Take the provided technical system architecture document and explain it in simple terms suitable for a non-technical product manager. Use analogies where helpful and avoid unnecessary jargon." },
    ]

    const [prompts, setPrompts] = useState(defaultPrompts)
    const [roughPrompt, setRoughPrompt] = useState("")
    const [polishedPrompt, setPolishedPrompt] = useState("")
    const [isPolishing, setIsPolishing] = useState(false)
    const [isCreatingNew, setIsCreatingNew] = useState(false)
    const [copied, setCopied] = useState(false)

    const handlePolish = async () => {
        if (!roughPrompt.trim()) return

        setIsPolishing(true)
        try {
            let apiKey = ""
            try {
                const stored = localStorage.getItem("akop-settings")
                if (stored) {
                    const parsedSettings = JSON.parse(stored)
                    if (parsedSettings.openaiApiKey) apiKey = parsedSettings.openaiApiKey
                }
            } catch (e) { }

            const headers: Record<string, string> = { "Content-Type": "application/json" }
            if (apiKey) headers["x-openai-key"] = apiKey

            const res = await fetch("/api/ai/polish-prompt", {
                method: "POST",
                headers,
                body: JSON.stringify({ prompt: roughPrompt })
            })

            if (res.ok) {
                const data = await res.json()
                setPolishedPrompt(data.polishedPrompt)
            } else {
                const error = await res.json()
                alert(error.error || "Failed to polish prompt.")
            }
        } catch (error) {
            console.error("Error polishing prompt:", error)
        } finally {
            setIsPolishing(false)
        }
    }

    const copyToClipboard = () => {
        navigator.clipboard.writeText(polishedPrompt)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    return (
        <div className="flex-1 w-full max-w-full overflow-y-auto">
            <main className="p-4 sm:p-6 lg:p-8">
                <div className="max-w-5xl mx-auto space-y-12">

                    <div className="flex items-center justify-between">
                        <div className="space-y-1">
                            <h1 className="text-3xl font-bold tracking-tight text-foreground">Prompt Library</h1>
                            <p className="text-muted-foreground">Manage, test, and optimize custom AI prompts.</p>
                        </div>
                        <Button onClick={() => setIsCreatingNew(!isCreatingNew)} className="gap-2">
                            <Plus className="h-4 w-4" /> {isCreatingNew ? "Cancel" : "New Prompt"}
                        </Button>
                    </div>

                    {/* Prompt Polisher Tool */}
                    <Card className="border-accent/30 shadow-sm bg-gradient-to-br from-card to-accent/5">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Wand2 className="h-5 w-5 text-accent" />
                                Prompt Polisher Studio
                            </CardTitle>
                            <CardDescription>
                                Write a rough idea of what you want the AI to do, and let our optimizer rewrite it for maximum effectiveness.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-foreground">Rough Idea</label>
                                    <Textarea
                                        placeholder="E.g., Read this list of emails and tell me who is angry and why"
                                        className="min-h-[150px] resize-none bg-background/50"
                                        value={roughPrompt}
                                        onChange={(e) => setRoughPrompt(e.target.value)}
                                    />
                                    <Button
                                        onClick={handlePolish}
                                        disabled={isPolishing || !roughPrompt.trim()}
                                        className="w-full bg-accent hover:bg-accent/90"
                                    >
                                        {isPolishing ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Optimizing...</> : <><Wand2 className="h-4 w-4 mr-2" /> Polish Prompt</>}
                                    </Button>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-foreground">AI-Optimized Output</label>
                                    <div className="relative">
                                        <Textarea
                                            placeholder="Your professionally structured prompt will appear here..."
                                            className="min-h-[150px] resize-none bg-background/50 border-accent/20"
                                            value={polishedPrompt}
                                            readOnly
                                        />
                                        {polishedPrompt && (
                                            <Button
                                                size="sm"
                                                variant="secondary"
                                                className="absolute bottom-3 right-3 h-8 text-xs"
                                                onClick={copyToClipboard}
                                            >
                                                {copied ? <CheckCircle2 className="h-4 w-4 mr-1 text-green-500" /> : <Copy className="h-4 w-4 mr-1" />}
                                                {copied ? "Copied" : "Copy"}
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="space-y-6">
                        <h2 className="text-xl font-semibold text-foreground">Your Saved Prompts</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {prompts.map((prompt, i) => (
                                <Card key={i} className="group hover:border-primary/50 transition-colors cursor-pointer bg-card flex flex-col">
                                    <CardHeader className="pb-3">
                                        <div className="flex justify-between items-start">
                                            <div className="p-2 bg-primary/10 rounded-lg">
                                                <MessageSquareCode className="h-5 w-5 text-primary" />
                                            </div>
                                            <span className="text-xs font-medium px-2 py-1 bg-muted rounded-full text-muted-foreground">
                                                {prompt.category}
                                            </span>
                                        </div>
                                        <CardTitle className="text-lg mt-4">{prompt.title}</CardTitle>
                                    </CardHeader>
                                    <CardContent className="flex-1">
                                        <CardDescription className="text-sm">
                                            {prompt.description}
                                        </CardDescription>
                                    </CardContent>
                                    <CardFooter className="pt-0 pb-4">
                                        <div className="flex items-center text-sm font-medium w-full text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                                            Quick Copy <ChevronRight className="h-4 w-4 ml-1" />
                                        </div>
                                    </CardFooter>
                                </Card>
                            ))}
                        </div>
                    </div>

                </div>
            </main>
        </div>
    )
}
