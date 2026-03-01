"use client"

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { useSession, signOut } from "next-auth/react"
import { useTheme } from "next-themes"
import {
  FileText,
  Mail,
  Upload,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
  Brain,
  LogOut,
  Sun,
  Moon,
  User,
  MessageSquare,
  Library,
  Network,
  History,
  Menu,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"
import { cn } from "@/lib/utils"

const navigation = [
  { name: "Dashboard", icon: BarChart3, href: "/dashboard" },
  { name: "AI Chat", icon: MessageSquare, href: "/chat" },
  { name: "Documents", icon: FileText, href: "/documents" },
  { name: "Upload Files", icon: Upload, href: "/upload" },
  { name: "Knowledge Graph", icon: Network, href: "/graph" },
  { name: "Prompt Library", icon: Library, href: "/prompts" },
  { name: "Email Integration", icon: Mail, href: "/email" },
  { name: "Search History", icon: History, href: "/history" },
  { name: "Settings", icon: Settings, href: "/settings" },
]

function getInitials(name: string | null | undefined, email: string | null | undefined): string {
  if (name?.trim()) {
    const parts = name.trim().split(/\s+/)
    if (parts.length >= 2) return `${parts[0][0]}\${parts[parts.length - 1][0]}`.toUpperCase()
    return name.slice(0, 2).toUpperCase()
  }
  if (email) return email.slice(0, 2).toUpperCase()
  return "?"
}

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const pathname = usePathname()
  const { data: session, status } = useSession()
  const { theme, setTheme, resolvedTheme } = useTheme()
  const isDark = mounted && resolvedTheme === "dark"

  useEffect(() => {
    setMounted(true)
  }, [])

  // Auto-close mobile sheet on route change
  useEffect(() => {
    setIsMobileOpen(false)
  }, [pathname])

  // Auto-collapse sidebar on smaller screens
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setCollapsed(true)
      } else {
        setCollapsed(false)
      }
    }

    // Check on mount
    handleResize()

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const user = session?.user
  const name = user?.name ?? null
  const email = user?.email ?? null
  const image = user?.image ?? null

  const handleSignOut = async () => {
    await signOut({ redirect: false })
    await fetch("/api/auth/destroy", { method: "POST" })
    window.location.href = "/auth/signin"
  }

  // The actual contents of the sidebar
  const SidebarContents = (
    <>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-sidebar-border shrink-0">
        {!collapsed && (
          <Link href="/" className="flex items-center gap-2 min-w-0">
            <span className="font-semibold text-lg text-sidebar-foreground truncate tracking-tight">Docify</span>
          </Link>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCollapsed(!collapsed)}
          className="hidden md:flex h-8 w-8 p-0 shrink-0 hover:bg-sidebar-accent text-sidebar-foreground"
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      {/* Navigation - scrolls if many items, keeps bottom section visible */}
      <nav className="flex-1 min-h-0 p-4 space-y-1.5 overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-sidebar-border scrollbar-track-transparent">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link key={item.name} href={item.href}>
              <Button
                variant={isActive ? "default" : "ghost"}
                className={cn(
                  "w-full justify-start gap-3 h-10 transition-colors",
                  isActive
                    ? "bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90 shadow-sm"
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                  collapsed && "md:justify-center md:px-0",
                )}
              >
                <item.icon className={cn("h-4 w-4 flex-shrink-0", isActive ? "text-sidebar-primary-foreground" : "text-sidebar-foreground/70")} />
                {(!collapsed || isMobileOpen) && (
                  <div className="flex w-full justify-between items-center group-hover:pl-0.5 transition-all">
                    <span className="truncate font-medium text-[13px]">{item.name}</span>
                    {item.name === "Knowledge Graph" && (
                      <span className="text-[9px] uppercase tracking-wider font-bold bg-secondary/20 text-secondary px-1.5 py-0.5 rounded-sm">Beta</span>
                    )}
                  </div>
                )}
              </Button>
            </Link>
          )
        })}
      </nav>

      <div className="px-4 py-2 mt-auto">
        <a href="https://crosiz.com/" target="_blank" rel="noopener noreferrer" className={cn(
          "block w-full p-2.5 rounded-xl bg-accent/5 hover:bg-accent/10 transition-colors border border-accent/10",
          collapsed && !isMobileOpen ? "flex items-center justify-center p-1 w-10 h-10 mx-auto" : ""
        )}>
          {(!collapsed || isMobileOpen) ? (
            <div className="flex flex-col items-center justify-center text-center space-y-1">
              <span className="text-[10px] text-muted-foreground uppercase font-semibold tracking-wider">
                Designed & Developed by
              </span>
              <div className="flex items-center justify-center h-5 mt-1 gap-1.5">
                <img src="/logo.png" alt="Crosiz Logo" className="h-full w-auto object-contain" />
                <span className="text-[10px] font-semibold text-foreground/80 hover:text-foreground transition-colors">Read More</span>
              </div>
            </div>
          ) : (
            <img src="/logo.png" alt="Crosiz Logo" className="h-6 w-6 object-contain" />
          )}
        </a>
      </div>

      {/* Theme toggle - fixed at bottom */}
      <div className={cn("shrink-0 px-4 pb-2", collapsed && "md:flex md:justify-center")}>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setTheme(isDark ? "light" : "dark")}
          className={cn(
            "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors",
            collapsed ? "md:h-8 md:w-8 md:p-0" : "w-full justify-start gap-3",
          )}
        >
          {mounted ? (
            isDark ? (
              <Sun className="h-4 w-4 shrink-0 transition-transform hover:rotate-90" />
            ) : (
              <Moon className="h-4 w-4 shrink-0 transition-transform hover:-rotate-12" />
            )
          ) : (
            <div className="h-4 w-4 shrink-0" />
          )}
          {(!collapsed || isMobileOpen) && (
            <span className="truncate text-sm font-medium">
              {!mounted ? "Theme" : isDark ? "Light mode" : "Dark mode"}
            </span>
          )}
        </Button>
      </div>

      {/* User section & Logout - fixed at bottom */}
      <div
        className={cn(
          "shrink-0 border-t border-sidebar-border p-4",
          collapsed ? "md:flex md:flex-col md:items-center gap-2" : "space-y-2",
        )}
      >
        {status === "loading" ? (
          <div className={cn("flex items-center gap-3", collapsed && "md:justify-center")}>
            <div className="h-9 w-9 rounded-full bg-sidebar-accent/50 animate-pulse" />
            {(!collapsed || isMobileOpen) && (
              <div className="flex-1 min-w-0 space-y-1">
                <div className="h-3 w-20 bg-sidebar-accent/50 rounded animate-pulse" />
                <div className="h-3 w-28 bg-sidebar-accent/50 rounded animate-pulse" />
              </div>
            )}
          </div>
        ) : session?.user ? (
          <>
            {(collapsed && !isMobileOpen) ? (
              <div className="hidden md:block">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="h-9 w-9 rounded-full p-0 hover:bg-sidebar-accent focus:ring-0 focus-visible:ring-0"
                    >
                      <Avatar className="h-9 w-9 border-2 border-sidebar-border shadow-sm">
                        <AvatarImage src={image ?? undefined} alt={name ?? ""} />
                        <AvatarFallback className="bg-sidebar-accent/30 text-sidebar-foreground font-semibold text-xs">
                          {getInitials(name, email)}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" side="right" className="w-56 bg-popover border-border ml-2 rounded-xl shadow-lg">
                    <div className="px-3 py-2.5 bg-muted/30">
                      <p className="text-sm font-semibold text-foreground truncate">{name || "User"}</p>
                      <p className="text-xs text-muted-foreground truncate">{email}</p>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/settings" className="cursor-pointer">
                        <Settings className="h-4 w-4 mr-2" />
                        Settings
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer text-destructive focus:text-destructive hover:bg-destructive/10">
                      <LogOut className="h-4 w-4 mr-2" />
                      Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3 bg-sidebar-accent/20 p-2 rounded-xl border border-sidebar-border shadow-sm">
                  <Avatar className="h-9 w-9 shrink-0 border border-sidebar-border/50 shadow-sm">
                    <AvatarImage src={image ?? undefined} alt={name ?? ""} />
                    <AvatarFallback className="bg-sidebar-accent text-sidebar-foreground font-semibold text-xs">
                      {getInitials(name, email)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-semibold text-sidebar-foreground truncate tracking-tight">
                      {name || "User"}
                    </p>
                    <p className="text-[11px] text-sidebar-foreground/70 truncate">{email}</p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSignOut}
                  className="w-full justify-start gap-2 h-9 border-sidebar-border/60 bg-transparent text-sidebar-foreground hover:bg-destructive/10 hover:border-destructive/30 hover:text-destructive transition-colors shadow-sm"
                >
                  <LogOut className="h-4 w-4 shrink-0" />
                  <span className="font-medium">Log out</span>
                </Button>
              </div>
            )}
          </>
        ) : (
          (!collapsed || isMobileOpen) && (
            <div className="space-y-3 p-1">
              <div className="flex items-center gap-2 text-sidebar-foreground/70 px-1">
                <User className="h-4 w-4 shrink-0" />
                <span className="text-xs font-medium uppercase tracking-wider">Not signed in</span>
              </div>
              <Link href="/auth/signin">
                <Button
                  size="sm"
                  className="w-full h-9 bg-sidebar-primary hover:bg-sidebar-primary/90 text-sidebar-primary-foreground shadow-sm"
                >
                  Sign in
                </Button>
              </Link>
            </div>
          )
        )}
      </div>
    </>
  )

  // Don't render anything if it's the landing page
  if (pathname === '/' || pathname.startsWith('/auth')) {
    return null;
  }

  return (
    <>
      {/* Mobile Header & Hamburger Trigger */}
      <div className="md:hidden flex w-full items-center justify-between p-4 border-b border-border bg-background sticky top-0 z-50 shadow-sm">
        <Link href="/" className="flex items-center gap-2 min-w-0">
          <span className="font-semibold text-[15px] text-foreground truncate tracking-tight">Docify</span>
        </Link>
        <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="h-9 w-9 hover:bg-accent/10">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-[280px] bg-sidebar border-r border-sidebar-border hidden-close-button">
            <div className="h-full flex flex-col min-h-0 bg-sidebar">
              {SidebarContents}
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Persistent Sidebar */}
      <div
        className={cn(
          "hidden md:flex h-screen sticky top-0 bg-sidebar border-r border-sidebar-border transition-all duration-300 flex-col shrink-0 shadow-[4px_0_24px_-12px_rgba(0,0,0,0.1)] z-40",
          collapsed ? "w-[72px]" : "w-[260px]",
        )}
      >
        {SidebarContents}
      </div>
    </>
  )
}
