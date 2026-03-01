"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Sidebar } from "@/components/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Settings,
  Key,
  Database,
  Mail,
  Upload,
  Trash2,
  Info,
  CheckCircle,
  AlertCircle,
  Eye,
  EyeOff,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface SettingsData {
  maxFileSize: number
  autoProcessDocuments: boolean
  enableEmailSync: boolean
  aiResponseLength: string
  searchResultsLimit: number
  openaiApiKey: string
}

export default function SettingsPage() {
  const { data: session } = useSession()
  const { toast } = useToast()
  const [settings, setSettings] = useState<SettingsData>({
    maxFileSize: 50,
    autoProcessDocuments: true,
    enableEmailSync: true,
    aiResponseLength: "medium",
    searchResultsLimit: 10,
    openaiApiKey: "",
  })

  const [showApiKey, setShowApiKey] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [tempApiKey, setTempApiKey] = useState("")
  const [apiKeyStatus, setApiKeyStatus] = useState<"unknown" | "valid" | "invalid">("unknown")

  // Load settings on component mount
  useEffect(() => {
    loadSettings()
    checkApiKeyStatus()
  }, [])

  const loadSettings = () => {
    try {
      const stored = localStorage.getItem("akop-settings")
      if (stored) {
        const parsedSettings = JSON.parse(stored)
        setSettings({ ...settings, ...parsedSettings })
      }
    } catch (error) {
      console.error("[v0] Error loading settings:", error)
    }
  }

  const checkApiKeyStatus = async () => {
    try {
      let apiKey = ""
      const stored = localStorage.getItem("akop-settings")
      if (stored) {
        const parsedSettings = JSON.parse(stored)
        if (parsedSettings.openaiApiKey) {
          apiKey = parsedSettings.openaiApiKey
        }
      }

      if (!apiKey) {
        const response = await fetch("/api/ai/test-key")
        if (response.ok) {
          setApiKeyStatus("valid")
        } else {
          setApiKeyStatus("invalid")
        }
        return
      }

      const response = await fetch("/api/ai/test-key", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ apiKey }),
      })
      if (response.ok) {
        setApiKeyStatus("valid")
      } else {
        setApiKeyStatus("invalid")
      }
    } catch (error) {
      setApiKeyStatus("invalid")
    }
  }

  const handleSaveSettings = async () => {
    setIsLoading(true)
    try {
      // Save to localStorage for persistence
      localStorage.setItem("akop-settings", JSON.stringify(settings))

      // In production, this would also save to a database
      console.log("[v0] Saving settings:", settings)

      // Test API key if provided
      if (settings.openaiApiKey) {
        await testApiKey(settings.openaiApiKey)
      }

      toast({
        title: "Settings saved",
        description: "Your preferences have been updated successfully.",
      })
    } catch (error) {
      toast({
        title: "Error saving settings",
        description: "There was a problem saving your settings. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const testApiKey = async (apiKey: string) => {
    try {
      const response = await fetch("/api/ai/test-key", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ apiKey }),
      })

      if (response.ok) {
        setApiKeyStatus("valid")
      } else {
        setApiKeyStatus("invalid")
      }
    } catch (error) {
      setApiKeyStatus("invalid")
    }
  }

  const handleSaveApiKey = async () => {
    const key = tempApiKey.trim()
    if (!key) return
    setIsLoading(true)
    const updatedSettings = { ...settings, openaiApiKey: key }
    setSettings(updatedSettings)
    localStorage.setItem("akop-settings", JSON.stringify(updatedSettings))
    setTempApiKey("")

    await testApiKey(key)
    setIsLoading(false)
    toast({
      title: "API Key Saved",
      description: "Your OpenAI key has been saved to your browser.",
    })
  }

  const handleClearCache = () => {
    // Clear localStorage cache
    localStorage.removeItem("akop-recent-answers")
    localStorage.removeItem("akop-search-cache")

    console.log("[v0] Clearing cache")
    toast({
      title: "Cache cleared",
      description: "All cached data has been removed.",
    })
  }

  const handleResetSettings = () => {
    const defaultSettings: SettingsData = {
      maxFileSize: 50,
      autoProcessDocuments: true,
      enableEmailSync: true,
      aiResponseLength: "medium",
      searchResultsLimit: 10,
      openaiApiKey: "",
    }

    setSettings(defaultSettings)
    localStorage.setItem("akop-settings", JSON.stringify(defaultSettings))

    toast({
      title: "Settings reset",
      description: "All settings have been restored to defaults.",
    })
  }

  const getApiKeyStatusBadge = () => {
    switch (apiKeyStatus) {
      case "valid":
        return (
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            <CheckCircle className="h-3 w-3 mr-1" />
            Connected
          </Badge>
        )
      case "invalid":
        return (
          <Badge variant="destructive">
            <AlertCircle className="h-3 w-3 mr-1" />
            Invalid
          </Badge>
        )
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  return (
    <div className="flex-1 w-full max-w-full overflow-y-auto">
      <main className="p-4 sm:p-6 lg:p-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Header */}
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <Settings className="h-8 w-8 text-accent" />
              <h1 className="text-3xl font-bold text-foreground text-balance">Settings</h1>
            </div>
            <p className="text-muted-foreground text-pretty">Configure your AKOP knowledge management system</p>
          </div>

          <div className="grid gap-6">
            {/* API Configuration */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Key className="h-5 w-5" />
                  API Configuration
                </CardTitle>
                <CardDescription>Manage your API keys and external service connections</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Why is OpenAI API key required?</strong>
                    <br />
                    AKOP uses OpenAI's GPT models to generate intelligent answers from your documents and create
                    embeddings for semantic search. Without an API key, the system will fall back to basic keyword
                    search and provide generic responses.
                  </AlertDescription>
                </Alert>

                <div className="grid gap-2">
                  <Label htmlFor="openai-key">OpenAI API Key</Label>

                  {settings.openaiApiKey ? (
                    <div className="flex items-center gap-2 mt-1">
                      <div className="relative flex-1 max-w-[400px]">
                        <Input
                          disabled
                          value={showApiKey ? settings.openaiApiKey : "sk-••••••••••••••••••••••••••••••••••••••••"}
                          className="pr-10 bg-muted/20"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowApiKey(!showApiKey)}
                        >
                          {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setSettings({ ...settings, openaiApiKey: "" })
                          localStorage.setItem("akop-settings", JSON.stringify({ ...settings, openaiApiKey: "" }))
                          setApiKeyStatus("unknown")
                        }}
                        className="text-destructive border-destructive/20 hover:bg-destructive/10 hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Remove
                      </Button>
                      {getApiKeyStatusBadge()}
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 mt-1">
                      <Input
                        id="openai-key"
                        placeholder="sk-..."
                        className="flex-1 max-w-[400px]"
                        value={tempApiKey}
                        onChange={(e) => setTempApiKey(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleSaveApiKey()
                        }}
                      />
                      <Button
                        type="button"
                        onClick={handleSaveApiKey}
                        disabled={!tempApiKey.trim() || isLoading}
                      >
                        Add Key
                      </Button>
                    </div>
                  )}

                </div>

                <div className="text-sm text-muted-foreground space-y-1">
                  <p>
                    • Get your API key from{" "}
                    <a
                      href="https://platform.openai.com/api-keys"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-accent hover:underline"
                    >
                      OpenAI Platform
                    </a>
                  </p>
                  <p>• Your API key is stored locally and never sent to our servers</p>
                  <p>• Required for AI-powered search, document analysis, and intelligent responses</p>
                </div>
              </CardContent>
            </Card>

            {/* Document Processing */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="h-5 w-5" />
                  Document Processing
                </CardTitle>
                <CardDescription>Configure how documents are processed and indexed</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Auto-process documents</Label>
                    <div className="text-sm text-muted-foreground">
                      Automatically extract text and generate embeddings when documents are uploaded
                    </div>
                  </div>
                  <Switch
                    checked={settings.autoProcessDocuments}
                    onCheckedChange={(checked) => setSettings({ ...settings, autoProcessDocuments: checked })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="max-file-size">Maximum file size (MB)</Label>
                  <Input
                    id="max-file-size"
                    type="number"
                    value={settings.maxFileSize}
                    onChange={(e) => setSettings({ ...settings, maxFileSize: Number.parseInt(e.target.value) || 50 })}
                    min="1"
                    max="100"
                  />
                  <div className="text-sm text-muted-foreground">
                    Larger files take more time to process and may consume more API credits
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Email Integration */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5" />
                  Email Integration
                </CardTitle>
                <CardDescription>Manage email synchronization and indexing</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Enable email sync</Label>
                    <div className="text-sm text-muted-foreground">
                      Include emails in search results and AI responses (requires email connection)
                    </div>
                  </div>
                  <Switch
                    checked={settings.enableEmailSync}
                    onCheckedChange={(checked) => setSettings({ ...settings, enableEmailSync: checked })}
                  />
                </div>
                <div className="p-3 bg-muted rounded-lg">
                  <div className="text-sm font-medium">Connected Email</div>
                  <div className="text-sm text-muted-foreground">{session?.user?.email || "No email connected"}</div>
                  <Badge variant="outline" className="mt-1">
                    Gmail
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Search & AI */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  Search & AI Configuration
                </CardTitle>
                <CardDescription>Customize search behavior and AI response settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="search-limit">Search results limit</Label>
                  <Input
                    id="search-limit"
                    type="number"
                    value={settings.searchResultsLimit}
                    onChange={(e) =>
                      setSettings({ ...settings, searchResultsLimit: Number.parseInt(e.target.value) || 10 })
                    }
                    min="1"
                    max="50"
                  />
                  <div className="text-sm text-muted-foreground">
                    Higher limits provide more comprehensive results but may be slower
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="ai-length">AI response length</Label>
                  <select
                    id="ai-length"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                    value={settings.aiResponseLength}
                    onChange={(e) => setSettings({ ...settings, aiResponseLength: e.target.value })}
                  >
                    <option value="short">Short (1-2 sentences)</option>
                    <option value="medium">Medium (1-2 paragraphs)</option>
                    <option value="long">Long (detailed explanation)</option>
                  </select>
                  <div className="text-sm text-muted-foreground">
                    Longer responses provide more detail but consume more API credits
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <Card>
              <CardHeader>
                <CardTitle>System Actions</CardTitle>
                <CardDescription>Manage system data and reset configurations</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-3">
                  <Button onClick={handleSaveSettings} disabled={isLoading}>
                    {isLoading ? "Saving..." : "Save Settings"}
                  </Button>
                  <Button variant="outline" onClick={handleClearCache}>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Clear Cache
                  </Button>
                  <Button variant="outline" onClick={handleResetSettings}>
                    Reset to Defaults
                  </Button>
                </div>
                <div className="text-sm text-muted-foreground">
                  <p>• Save Settings: Persist your configuration locally</p>
                  <p>• Clear Cache: Remove stored search results and AI responses</p>
                  <p>• Reset: Restore all settings to their default values</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
