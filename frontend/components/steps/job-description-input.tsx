"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Link, FileText } from "lucide-react"

interface JobDescriptionInputProps {
  value: string
  onChange: (value: string) => void
  onNext: () => void
  onPrevious: () => void
}

export function JobDescriptionInput({ value, onChange, onNext, onPrevious }: JobDescriptionInputProps) {
  const [inputType, setInputType] = useState<"url" | "text">("url")
  const [jobUrl, setJobUrl] = useState("")
  const [jobText, setJobText] = useState(value)

  const handleNext = () => {
    const finalValue = inputType === "url" ? jobUrl : jobText
    onChange(finalValue)
    onNext()
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold mb-2">Job Description</h3>
        <p className="text-muted-foreground">
          Provide the job description either by URL or by pasting the text directly
        </p>
      </div>

      <Tabs value={inputType} onValueChange={(value) => setInputType(value as "url" | "text")}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="url" className="flex items-center gap-2">
            <Link className="h-4 w-4" />
            Job URL
          </TabsTrigger>
          <TabsTrigger value="text" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Paste Text
          </TabsTrigger>
        </TabsList>

        <TabsContent value="url" className="space-y-4">
          <div>
            <Label htmlFor="job-url">Job Posting URL</Label>
            <Input
              id="job-url"
              placeholder="https://company.com/jobs/software-engineer"
              value={jobUrl}
              onChange={(e) => setJobUrl(e.target.value)}
              className="mt-1"
            />
            <p className="text-sm text-muted-foreground mt-1">
              Paste the URL from LinkedIn, Indeed, or company career pages
            </p>
          </div>
        </TabsContent>

        <TabsContent value="text" className="space-y-4">
          <div>
            <Label htmlFor="job-text">Job Description Text</Label>
            <Textarea
              id="job-text"
              placeholder="Paste the complete job description here..."
              value={jobText}
              onChange={(e) => setJobText(e.target.value)}
              rows={8}
              className="mt-1"
            />
            <p className="text-sm text-muted-foreground mt-1">
              Copy and paste the full job description including requirements and responsibilities
            </p>
          </div>
        </TabsContent>
      </Tabs>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onPrevious}>
          Previous
        </Button>
        <Button onClick={handleNext} disabled={inputType === "url" ? !jobUrl.trim() : !jobText.trim()}>
          Next Step
        </Button>
      </div>
    </div>
  )
}
