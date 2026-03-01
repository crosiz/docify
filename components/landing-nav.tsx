"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useTheme } from "next-themes"
import { Moon, Sun } from "lucide-react"
import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

export function LandingNav() {
    const { theme, setTheme } = useTheme()
    const [mounted, setMounted] = useState(false)

    // Prevent hydration mismatch by only rendering theme toggle after mount
    useEffect(() => {
        setMounted(true)
    }, [])

    return (
        <nav className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex items-center gap-2">
                        <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Docify</span>
                    </div>
                    <div className="flex items-center gap-4">

                        {/* Theme Toggle Button */}
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                            className="text-foreground hover:bg-accent/10 hover:text-accent transition-colors w-9 h-9 rounded-full"
                        >
                            {mounted ? (
                                theme === "dark" ? (
                                    <Sun className="h-4 w-4 transition-transform hover:rotate-90" />
                                ) : (
                                    <Moon className="h-4 w-4 transition-transform hover:-rotate-12" />
                                )
                            ) : (
                                <div className="h-4 w-4" />
                            )}
                            <span className="sr-only">Toggle theme</span>
                        </Button>

                        <Link href="/auth/signin">
                            <Button variant="ghost" className="hover:bg-accent/10 hover:text-accent">Sign In</Button>
                        </Link>
                        <Link href="/auth/signup">
                            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm">Get Started</Button>
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    )
}
