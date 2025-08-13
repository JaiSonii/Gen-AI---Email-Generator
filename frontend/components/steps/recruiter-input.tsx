"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LinkedinIcon, User } from "lucide-react"

interface RecruiterInputProps {
  value: string
  onChange: (value: string) => void
  onNext: () => void
  onPrevious: () => void
}

export function RecruiterInput({ value, onChange, onNext, onPrevious }: RecruiterInputProps) {
  const [inputType, setInputType] = useState<"linkedin" | "info">("linkedin")
  const [linkedinUrl, setLinkedinUrl] = useState("")
  const [recruiterInfo, setRecruiterInfo] = useState(value)

  const handleNext = () => {
    const finalValue = inputType === "linkedin" ? linkedinUrl : recruiterInfo
    onChange(finalValue)
    onNext()
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold mb-2">Recruiter Information (Optional)</h3>
        <p className="text-muted-foreground">Add recruiter details to make your email more personalized and targeted</p>
      </div>

      <Tabs value={inputType} onValueChange={(value) => setInputType(value as "linkedin" | "info")}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="linkedin" className="flex items-center gap-2">
            <LinkedinIcon className="h-4 w-4" />
            LinkedIn URL
          </TabsTrigger>
          <TabsTrigger value="info" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Manual Info
          </TabsTrigger>
        </TabsList>

        <TabsContent value="linkedin" className="space-y-4">
          <div>
            <Label htmlFor="linkedin-url">Recruiter LinkedIn Profile</Label>
            <Input
              id="linkedin-url"
              placeholder="https://linkedin.com/in/recruiter-name"
              value={linkedinUrl}
              onChange={(e) => setLinkedinUrl(e.target.value)}
              className="mt-1"
            />
            <p className="text-sm text-muted-foreground mt-1">
              Our AI will analyze their profile to personalize your outreach
            </p>
          </div>
        </TabsContent>

        <TabsContent value="info" className="space-y-4">
          <div>
            <Label htmlFor="recruiter-info">Recruiter Information</Label>
            <Textarea
              id="recruiter-info"
              placeholder="Enter any information about the recruiter, hiring manager, or company contact..."
              value={recruiterInfo}
              onChange={(e) => setRecruiterInfo(e.target.value)}
              rows={6}
              className="mt-1"
            />
            <p className="text-sm text-muted-foreground mt-1">
              Include their name, role, company, or any other relevant details
            </p>
          </div>
        </TabsContent>
      </Tabs>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onPrevious}>
          Previous
        </Button>
        <Button onClick={handleNext}>Generate Email</Button>
      </div>
    </div>
  )
}
