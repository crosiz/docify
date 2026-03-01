"use client"

import { useState, useRef, useEffect } from "react"
import { Sidebar } from "@/components/sidebar"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Send, Bot, User, Loader2, Plus, Paperclip, MoreVertical } from "lucide-react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { useSession } from "next-auth/react"
import { TypingEffect } from "@/components/typing-effect"

interface Message {
    id: string
    role: "user" | "assistant"
    content: string
    sources?: any[]
}

export default function ChatPage() {
    const { data: session } = useSession()
    const [messages, setMessages] = useState<Message[]>([
        {
            id: "1",
            role: "assistant",
            content: "Hello! I'm your Docify AI assistant. What would you like to ask about your documents today?",
        }
    ])
    const [input, setInput] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const messagesEndRef = useRef<HTMLDivElement>(null)

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    const handleNewChat = () => {
        setMessages([
            {
                id: Date.now().toString(),
                role: "assistant",
                content: "New conversation started. How can I help you?",
            }
        ])
    }

    const handleSend = async () => {
        if (!input.trim() || isLoading) return

        const userMessage = input.trim()
        setInput("")

        // Add user message to UI
        const newUserMsg: Message = { id: Date.now().toString(), role: "user", content: userMessage }
        setMessages(prev => [...prev, newUserMsg])
        setIsLoading(true)

        try {
            // Get user's custom API key
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

            // Query the RAG endpoint
            const response = await fetch("/api/ai/answer", {
                method: "POST",
                headers,
                body: JSON.stringify({ query: userMessage }),
            })

            if (response.ok) {
                const data = await response.json()
                setMessages(prev => [
                    ...prev,
                    {
                        id: Date.now().toString(),
                        role: "assistant",
                        content: data.answer,
                        sources: data.sources
                    }
                ])
            } else {
                const err = await response.json()
                setMessages(prev => [
                    ...prev,
                    { id: Date.now().toString(), role: "assistant", content: `Error: \${err.error || "Failed to fetch answer."}` }
                ])
            }
        } catch (error) {
            console.error("Chat error:", error)
            setMessages(prev => [
                ...prev,
                { id: Date.now().toString(), role: "assistant", content: "Sorry, I encountered an error connecting to the server." }
            ])
        } finally {
            setIsLoading(false)
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault()
            handleSend()
        }
    }

    return (
        <div className="flex-1 w-full max-w-full h-[calc(100vh-64px)] md:h-screen overflow-hidden flex flex-col relative">
            <main className="flex-1 flex flex-col h-full bg-accent/5 relative">

                {/* Chat Header */}
                <header className="h-16 flex-shrink-0 flex items-center justify-between px-6 bg-background/80 backdrop-blur-md border-b border-border z-10 sticky top-0">
                    <div className="flex items-center gap-3">
                        <div className="h-9 w-9 bg-primary/10 rounded-full flex items-center justify-center">
                            <Bot className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                            <h1 className="font-semibold text-foreground text-sm">Docify AI Assistant</h1>
                            <p className="text-xs text-muted-foreground">Always active and ready to help</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" onClick={handleNewChat} className="hidden sm:flex text-xs bg-background">
                            <Plus className="h-3 w-3 mr-2" />
                            New Chat
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                            <MoreVertical className="h-4 w-4" />
                        </Button>
                    </div>
                </header>

                {/* Chat Messages Area */}
                <div className="flex-1 overflow-y-auto p-4 sm:p-6 pb-32">
                    <div className="max-w-4xl mx-auto space-y-6">

                        {messages.map((message) => {
                            const isUser = message.role === "user"
                            return (
                                <div
                                    key={message.id}
                                    className={`flex w-full \${isUser ? "justify-end" : "justify-start"}`}
                                >
                                    <div className={`flex gap-3 max-w-[85%] md:max-w-[75%] \${isUser ? "flex-row-reverse" : ""}`}>

                                        {/* Avatar */}
                                        <div className={`h-8 w-8 shrink-0 rounded-full flex items-center justify-center mt-1 shadow-sm \${
                      isUser ? "bg-primary text-primary-foreground" : "bg-card border border-border text-primary"
                    }`}>
                                            {isUser ? (
                                                session?.user?.image ? (
                                                    <img src={session.user.image} alt="User avatar" className="h-full w-full rounded-full object-cover" />
                                                ) : (
                                                    <User className="h-4 w-4" />
                                                )
                                            ) : (
                                                <Bot className="h-4 w-4" />
                                            )}
                                        </div>

                                        {/* Message Bubble */}
                                        <div className="space-y-1.5 flex-1 min-w-0">
                                            <div className={`flex items-baseline \${isUser ? "justify-end" : "justify-start"}`}>
                                                <span className="text-xs font-medium text-muted-foreground px-1">
                                                    {isUser ? "You" : "Docify AI"}
                                                </span>
                                            </div>

                                            <div className={`rounded-2xl px-5 py-3.5 shadow-sm text-sm leading-relaxed \${
                        isUser 
                          ? "bg-primary text-primary-foreground rounded-tr-sm" 
                          : "bg-card border border-border/50 text-slate-800 dark:text-slate-200 rounded-tl-sm"
                      }`}>
                                                {isUser ? (
                                                    <div className="whitespace-pre-wrap break-words overflow-hidden">
                                                        {message.content}
                                                    </div>
                                                ) : (
                                                    <article className="prose prose-sm dark:prose-invert max-w-full break-words text-slate-800 dark:text-slate-200 prose-p:text-slate-800 dark:prose-p:text-slate-200 prose-headings:text-slate-900 dark:prose-headings:text-slate-100 prose-strong:text-slate-900 dark:prose-strong:text-slate-100 overflow-x-auto overflow-y-auto max-h-[500px] scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent prose-p:leading-relaxed prose-pre:bg-muted/50 prose-pre:border prose-pre:border-border prose-pre:max-w-full">
                                                        <TypingEffect content={message.content} speed={10} />
                                                    </article>
                                                )}

                                                {/* Sources Badge if any */}
                                                {!isUser && message.sources && message.sources.length > 0 && (
                                                    <div className="mt-4 pt-3 border-t border-border/50">
                                                        <span className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground/80 mb-2 block">Sources</span>
                                                        <div className="flex flex-wrap gap-1.5">
                                                            {message.sources.map((src, i) => (
                                                                <div key={i} className="text-[10px] bg-muted/50 hover:bg-muted text-muted-foreground px-2 py-1 rounded-md border border-border/50 transition-colors cursor-default">
                                                                    {src.name}
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}

                        {/* Loading Indicator */}
                        {isLoading && (
                            <div className="flex w-full justify-start">
                                <div className="flex gap-3 max-w-[85%] md:max-w-[75%]">
                                    <div className="h-8 w-8 shrink-0 rounded-full flex items-center justify-center mt-1 shadow-sm bg-card border border-border text-primary">
                                        <Bot className="h-4 w-4" />
                                    </div>
                                    <div className="space-y-1.5 flex-1">
                                        <div className="flex items-baseline justify-start">
                                            <span className="text-xs font-medium text-muted-foreground px-1">Docify AI</span>
                                        </div>
                                        <div className="rounded-2xl rounded-tl-sm px-5 py-4 shadow-sm bg-card border border-border/50 flex items-center gap-2 text-sm text-muted-foreground w-fit">
                                            <Loader2 className="h-4 w-4 animate-spin text-primary" />
                                            Analyzing knowledge base...
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div ref={messagesEndRef} className="h-4" />
                    </div>
                </div>

                {/* Fixed Input Area at Bottom */}
                <div className="absolute flex flex-col justify-end left-0 right-0 bottom-0 z-20">
                    {/* Gradient Mask to fade contents smoothly into input container */}
                    <div className="h-16 bg-gradient-to-b from-transparent to-accent/5 w-full pointer-events-none" />

                    <div className="bg-background/80 backdrop-blur-xl border-t border-border/50 p-4 sm:p-6 w-full shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.05)] dark:shadow-none">
                        <div className="max-w-4xl mx-auto relative group flex items-end grow gap-2 bg-card border border-border focus-within:border-primary/50 focus-within:ring-1 focus-within:ring-primary/50 rounded-[24px] p-2 transition-all shadow-sm">

                            <Button variant="ghost" size="icon" className="shrink-0 h-10 w-10 rounded-full text-muted-foreground hover:bg-muted/50 hover:text-foreground">
                                <Paperclip className="h-4 w-4" />
                            </Button>

                            <textarea
                                placeholder="Message Docify AI..."
                                className="flex max-h-32 w-full resize-none bg-transparent py-3 px-1 text-sm outline-none placeholder:text-muted-foreground min-h-[44px] scrollbar-thin scrollbar-thumb-rounded-full text-slate-900 dark:text-slate-100"
                                rows={1}
                                value={input}
                                onChange={(e) => {
                                    setInput(e.target.value)
                                    e.target.style.height = 'auto'
                                    e.target.style.height = e.target.scrollHeight + 'px'
                                }}
                                onKeyDown={handleKeyDown}
                                disabled={isLoading}
                            />

                            <Button
                                size="icon"
                                onClick={handleSend}
                                disabled={!input.trim() || isLoading}
                                className={`shrink-0 h-10 w-10 rounded-full transition-all \${input.trim() ? "bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm" : "bg-muted text-muted-foreground"}`}
                            >
                                <Send className="h-4 w-4" />
                            </Button>
                        </div>
                        <div className="text-center mt-3">
                            <p className="text-[11px] text-muted-foreground/70 tracking-wide font-medium">Docify AI can make mistakes. Verify important info before sharing.</p>
                        </div>
                    </div>
                </div>

            </main>
        </div>
    )
}
