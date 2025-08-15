"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LinkedinIcon, User, Lock, Crown } from "lucide-react"

interface RecruiterInputProps {
  value: string
  onChange: (value: string) => void
  onNext: () => void
  onPrevious: () => void
}

export function RecruiterInput({ value, onChange, onNext, onPrevious }: RecruiterInputProps) {
  const [inputType, setInputType] = useState<"linkedin" | "info">("info")
  const [linkedinUrl, setLinkedinUrl] = useState("")
  const [recruiterInfo, setRecruiterInfo] = useState(value)

  useEffect(() => {
    if (value && !recruiterInfo) {
      setRecruiterInfo(value)
    }
  }, [value, recruiterInfo])

  const handleNext = () => {
    const finalValue = inputType === "linkedin" ? linkedinUrl : recruiterInfo
    onChange(finalValue)
    onNext()
  }

  const handleInfoChange = (newInfo: string) => {
    setRecruiterInfo(newInfo)
    onChange(newInfo)
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold mb-2">Recruiter Information (Optional)</h3>
        <p className="text-muted-foreground">Add recruiter details to make your email more personalized and targeted</p>
      </div>

      <Tabs value={inputType} onValueChange={(value) => setInputType(value as "linkedin" | "info")}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="info" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Manual Info
          </TabsTrigger>
          <TabsTrigger value="linkedin" className="flex items-center gap-2 relative" disabled>
            <LinkedinIcon className="h-4 w-4" />
            LinkedIn URL
            <div className="flex items-center gap-1 ml-auto">
              <Crown className="h-3 w-3 text-amber-500" />
              <span className="text-xs bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent font-semibold">
                PRO
              </span>
            </div>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="info" className="space-y-4">
          <div>
            <Label htmlFor="recruiter-info">Recruiter Information</Label>
            <Textarea
              id="recruiter-info"
              placeholder="Enter any information about the recruiter, hiring manager, or company contact..."
              value={recruiterInfo}
              onChange={(e) => handleInfoChange(e.target.value)}
              rows={6}
              className="mt-1"
            />
            <p className="text-sm text-muted-foreground mt-1">
              Include their name, role, company, or any other relevant details
            </p>
          </div>
        </TabsContent>

        <TabsContent value="linkedin" className="space-y-4">
          <div className="relative">
            <div className="absolute inset-0 bg-background/80 backdrop-blur-sm z-10 rounded-lg border-2 border-dashed border-amber-200 flex items-center justify-center">
              <div className="text-center p-6">
                <div className="flex items-center justify-center gap-2 mb-3">
                  <Lock className="h-5 w-5 text-amber-500" />
                  <Crown className="h-5 w-5 text-amber-500" />
                </div>
                <h4 className="font-semibold text-amber-700 mb-2">Premium Feature</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Unlock LinkedIn profile analysis for hyper-personalized emails
                </p>
                <Button
                  size="sm"
                  className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
                >
                  Upgrade to Pro
                </Button>
              </div>
            </div>
            <div className="opacity-50">
              <Label htmlFor="linkedin-url">Recruiter LinkedIn Profile</Label>
              <Input
                id="linkedin-url"
                placeholder="https://linkedin.com/in/recruiter-name"
                value={linkedinUrl}
                onChange={(e) => setLinkedinUrl(e.target.value)}
                className="mt-1"
                disabled
              />
              <p className="text-sm text-muted-foreground mt-1">
                Our AI will analyze their profile to personalize your outreach
              </p>
            </div>
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
