"use client"

import { useState, useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { Upload, FileText, AlertCircle, CheckCircle, X } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface UploadFile {
  file: File
  id: string
  status: "uploading" | "processing" | "success" | "error"
  progress: number
  error?: string
}

const ACCEPTED_FILE_TYPES = {
  "application/pdf": [".pdf"],
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
  "application/msword": [".doc"],
  "text/csv": [".csv"],
}

const MAX_FILE_SIZE = 50 * 1024 * 1024 // 50MB

export function UploadZone() {
  const [uploadFiles, setUploadFiles] = useState<UploadFile[]>([])

  const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: any[]) => {
    // Handle rejected files
    if (rejectedFiles.length > 0) {
      console.log("[v0] Rejected files:", rejectedFiles)
    }

    // Process accepted files
    const newFiles: UploadFile[] = acceptedFiles.map((file) => ({
      file,
      id: Math.random().toString(36).substr(2, 9),
      status: "uploading",
      progress: 0,
    }))

    setUploadFiles((prev) => [...prev, ...newFiles])

    // Process each file
    newFiles.forEach((uploadFile) => {
      processFile(uploadFile.id)
    })
  }, [])

  const processFile = async (fileId: string) => {
    const uploadFile = uploadFiles.find((f) => f.id === fileId)
    if (!uploadFile) return

    try {
      // Simulate upload progress
      const uploadInterval = setInterval(() => {
        setUploadFiles((prev) =>
          prev.map((file) => {
            if (file.id === fileId && file.status === "uploading") {
              const newProgress = Math.min(file.progress + Math.random() * 30, 100)
              if (newProgress >= 100) {
                clearInterval(uploadInterval)
                return { ...file, progress: 100, status: "processing" }
              }
              return { ...file, progress: newProgress }
            }
            return file
          }),
        )
      }, 300)

      // Wait for upload to complete
      await new Promise((resolve) => {
        const checkComplete = () => {
          const file = uploadFiles.find((f) => f.id === fileId)
          if (file?.status === "processing") {
            resolve(true)
          } else {
            setTimeout(checkComplete, 100)
          }
        }
        checkComplete()
      })

      // Process the document
      console.log("[v0] Processing file:", uploadFile.file.name)

      const response = await fetch("/api/documents/process", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fileName: uploadFile.file.name,
          fileContent: "Sample file content", // In production, read actual file content
          fileType: uploadFile.file.type,
        }),
      })

      if (!response.ok) {
        throw new Error("Processing failed")
      }

      const result = await response.json()
      console.log("[v0] File processed successfully:", result)

      setUploadFiles((prev) => prev.map((file) => (file.id === fileId ? { ...file, status: "success" } : file)))
    } catch (error) {
      console.error("[v0] Error processing file:", error)
      setUploadFiles((prev) =>
        prev.map((file) => (file.id === fileId ? { ...file, status: "error", error: "Processing failed" } : file)),
      )
    }
  }

  const removeFile = (fileId: string) => {
    setUploadFiles((prev) => prev.filter((file) => file.id !== fileId))
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: ACCEPTED_FILE_TYPES,
    maxSize: MAX_FILE_SIZE,
    multiple: true,
  })

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  return (
    <div className="space-y-6">
      {/* Drop Zone */}
      <Card className="bg-card border-border">
        <CardContent className="p-8">
          <div
            {...getRootProps()}
            className={cn(
              "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors",
              isDragActive ? "border-accent bg-accent/5" : "border-border hover:border-accent/50 hover:bg-accent/5",
            )}
          >
            <input {...getInputProps()} />
            <div className="space-y-4">
              <div className="mx-auto w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                <Upload className="h-6 w-6 text-accent" />
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-card-foreground">
                  {isDragActive ? "Drop files here" : "Upload your documents"}
                </h3>
                <p className="text-muted-foreground text-pretty">Drag and drop files here, or click to browse</p>
              </div>

              <div className="flex flex-wrap justify-center gap-2">
                <Badge variant="outline" className="border-border">
                  PDF
                </Badge>
                <Badge variant="outline" className="border-border">
                  DOCX
                </Badge>
                <Badge variant="outline" className="border-border">
                  DOC
                </Badge>
                <Badge variant="outline" className="border-border">
                  CSV
                </Badge>
              </div>

              <p className="text-xs text-muted-foreground">Maximum file size: 50MB</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Upload Progress */}
      {uploadFiles.length > 0 && (
        <Card className="bg-card border-border">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-card-foreground mb-4">Processing Files</h3>
            <div className="space-y-4">
              {uploadFiles.map((uploadFile) => (
                <div key={uploadFile.id} className="flex items-center gap-4 p-4 bg-muted rounded-lg">
                  <div className="p-2 bg-accent/10 rounded-lg">
                    <FileText className="h-4 w-4 text-accent" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-sm text-card-foreground truncate">{uploadFile.file.name}</h4>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">{formatFileSize(uploadFile.file.size)}</span>
                        {uploadFile.status === "success" && <CheckCircle className="h-4 w-4 text-green-600" />}
                        {uploadFile.status === "error" && <AlertCircle className="h-4 w-4 text-red-600" />}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFile(uploadFile.id)}
                          className="h-6 w-6 p-0 hover:bg-destructive/10"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>

                    {uploadFile.status === "uploading" && (
                      <div className="space-y-1">
                        <Progress value={uploadFile.progress} className="h-2" />
                        <p className="text-xs text-muted-foreground">{Math.round(uploadFile.progress)}% uploaded</p>
                      </div>
                    )}

                    {uploadFile.status === "processing" && (
                      <p className="text-xs text-accent">Processing and generating embeddings...</p>
                    )}

                    {uploadFile.status === "success" && <p className="text-xs text-green-600">Ready for AI search!</p>}

                    {uploadFile.status === "error" && (
                      <p className="text-xs text-red-600">{uploadFile.error || "Processing failed"}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
