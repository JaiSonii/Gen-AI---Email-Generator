"use client"

import type React from "react"

import { useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Upload, FileText, CheckCircle } from "lucide-react"

interface ResumeUploadProps {
  value: File | null
  onChange: (file: File | null) => void
  onNext: () => void
}

export function ResumeUpload({ value, onChange, onNext }: ResumeUploadProps) {
  const handleFileChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0] || null
      if (file && file.type === "application/pdf") {
        onChange(file)
      } else {
        alert("Please select a PDF file")
      }
    },
    [onChange],
  )

  const handleDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault()
      const file = event.dataTransfer.files[0]
      if (file && file.type === "application/pdf") {
        onChange(file)
      } else {
        alert("Please select a PDF file")
      }
    },
    [onChange],
  )

  const handleDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault()
  }, [])

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold mb-2">Upload Your Resume</h3>
        <p className="text-muted-foreground">
          Upload your resume in PDF format so our AI can analyze your skills and experience
        </p>
      </div>

      <Card
        className={`border-2 border-dashed transition-colors ${
          value ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:border-primary/50"
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        <CardContent className="flex flex-col items-center justify-center py-12">
          {value ? (
            <>
              <CheckCircle className="h-12 w-12 text-primary mb-4" />
              <div className="text-center">
                <p className="font-medium text-primary mb-1">Resume uploaded successfully!</p>
                <p className="text-sm text-muted-foreground">{value.name}</p>
              </div>
            </>
          ) : (
            <>
              <Upload className="h-12 w-12 text-muted-foreground mb-4" />
              <div className="text-center">
                <p className="font-medium mb-1">Drag and drop your resume here</p>
                <p className="text-sm text-muted-foreground mb-4">or click to browse files</p>
                <Button variant="outline">
                  <FileText className="mr-2 h-4 w-4" />
                  Choose PDF File
                </Button>
              </div>
            </>
          )}
          <input
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={onNext} disabled={!value} className="min-w-24">
          Next Step
        </Button>
      </div>
    </div>
  )
}
