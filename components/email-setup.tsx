"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Mail, CheckCircle, AlertCircle, Settings, Loader2 } from "lucide-react"

interface EmailConnection {
  id: string
  email: string
  provider: string
  status: "connected" | "disconnected" | "error"
  lastSync: string
  messageCount: number
}

export function EmailSetup() {
  const [connections, setConnections] = useState<EmailConnection[]>([
    {
      id: "conn_1",
      email: "john.doe@company.com",
      provider: "Gmail",
      status: "connected",
      lastSync: "2 hours ago",
      messageCount: 1247,
    },
  ])

  const [isConnecting, setIsConnecting] = useState(false)
  const [newEmail, setNewEmail] = useState("")

  const handleConnect = async () => {
    if (!newEmail.trim()) return

    setIsConnecting(true)
    console.log("[v0] Connecting email:", newEmail)

    try {
      // Simulate email connection process
      await new Promise((resolve) => setTimeout(resolve, 2000))

      const newConnection: EmailConnection = {
        id: `conn_${Date.now()}`,
        email: newEmail,
        provider: newEmail.includes("gmail") ? "Gmail" : "Outlook",
        status: "connected",
        lastSync: "Just now",
        messageCount: 0,
      }

      setConnections((prev) => [...prev, newConnection])
      setNewEmail("")

      console.log("[v0] Email connected successfully")
    } catch (error) {
      console.error("[v0] Email connection failed:", error)
    } finally {
      setIsConnecting(false)
    }
  }

  const handleDisconnect = (connectionId: string) => {
    setConnections((prev) => prev.filter((conn) => conn.id !== connectionId))
    console.log("[v0] Email disconnected:", connectionId)
  }

  const handleSync = async (connectionId: string) => {
    console.log("[v0] Syncing email:", connectionId)

    setConnections((prev) =>
      prev.map((conn) => (conn.id === connectionId ? { ...conn, lastSync: "Syncing..." } : conn)),
    )

    // Simulate sync process
    setTimeout(() => {
      setConnections((prev) =>
        prev.map((conn) =>
          conn.id === connectionId
            ? { ...conn, lastSync: "Just now", messageCount: conn.messageCount + Math.floor(Math.random() * 10) }
            : conn,
        ),
      )
    }, 2000)
  }

  return (
    <div className="space-y-6">
      {/* Add New Email Connection */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-card-foreground">
            <Mail className="h-5 w-5 text-accent" />
            Connect Email Account
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-card-foreground">
              Email Address
            </Label>
            <div className="flex gap-3">
              <Input
                id="email"
                type="email"
                placeholder="your.email@company.com"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                className="flex-1 bg-input border-border"
                disabled={isConnecting}
              />
              <Button
                onClick={handleConnect}
                disabled={isConnecting || !newEmail.trim()}
                className="bg-accent hover:bg-accent/90 text-accent-foreground"
              >
                {isConnecting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Connecting...
                  </>
                ) : (
                  "Connect"
                )}
              </Button>
            </div>
          </div>

          <div className="bg-muted rounded-lg p-4">
            <h4 className="font-medium text-card-foreground mb-2">Supported Providers</h4>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="border-border">
                Gmail
              </Badge>
              <Badge variant="outline" className="border-border">
                Outlook
              </Badge>
              <Badge variant="outline" className="border-border">
                Yahoo Mail
              </Badge>
              <Badge variant="outline" className="border-border">
                IMAP
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              We use OAuth 2.0 for secure authentication. Your credentials are never stored.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Connected Accounts */}
      {connections.length > 0 && (
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-card-foreground">Connected Accounts</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {connections.map((connection) => (
              <div key={connection.id} className="flex items-center gap-4 p-4 bg-muted rounded-lg">
                <div className="p-2 bg-accent/10 rounded-lg">
                  <Mail className="h-4 w-4 text-accent" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium text-card-foreground">{connection.email}</h4>
                    <Badge variant="outline" className="text-xs border-border">
                      {connection.provider}
                    </Badge>
                    {connection.status === "connected" && <CheckCircle className="h-4 w-4 text-green-600" />}
                    {connection.status === "error" && <AlertCircle className="h-4 w-4 text-red-600" />}
                  </div>

                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span>Last sync: {connection.lastSync}</span>
                    <span>{connection.messageCount.toLocaleString()} messages indexed</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleSync(connection.id)}
                    className="border-border bg-transparent"
                  >
                    <Settings className="h-3 w-3 mr-1" />
                    Sync
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDisconnect(connection.id)}
                    className="border-border bg-transparent hover:bg-destructive/10 hover:border-destructive/20"
                  >
                    Disconnect
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
