"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Loader2, Copy, RefreshCw, Download, Mail } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface EmailResultProps {
  formData: {
    resumeText: string
    jobDescription: string
    recruiterInfo: string
    generatedEmail: string
  }
  onEmailGenerated: (email: string) => void
  onPrevious: () => void
  onStartOver: () => void
}

export function EmailResult({ formData, onEmailGenerated, onPrevious, onStartOver }: EmailResultProps) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [email, setEmail] = useState(formData.generatedEmail)
  const { toast } = useToast()

  useEffect(() => {
    if (!formData.generatedEmail) {
      generateEmail()
    }
  }, [])

  const generateEmail = async () => {
    setIsGenerating(true)

    try {
      const formDataToSend = new FormData()
      if (formData.resumeText) {
        formDataToSend.append("file", formData.resumeText)
      }

      // Check if job description is a URL or text
      const isUrl = formData.jobDescription.startsWith("http")
      if (isUrl) {
        formDataToSend.append("jd_url", formData.jobDescription)
      } else {
        formDataToSend.append("jd_text", formData.jobDescription)
      }

      if (formData.recruiterInfo) {
        // Check if recruiter info is a LinkedIn URL
        const isLinkedInUrl = formData.recruiterInfo.includes("linkedin.com")
        if (isLinkedInUrl) {
          formDataToSend.append("recruiter_url", formData.recruiterInfo)
        }
      }

      const response = await fetch("/api/v1/generate-email", {
        method: "POST",
        body: formDataToSend,
      })

      if (!response.ok) {
        throw new Error("Failed to generate email")
      }

      const data = await response.json()
      setEmail(data.email)
      onEmailGenerated(data.email)

      toast({
        title: "Email Generated!",
        description: "Your personalized email is ready to use.",
      })
    } catch (error) {
      console.error("Error generating email:", error)
      // Fallback demo email for development
      const demoEmail = `Subject: Application for Software Engineer Position

Dear Hiring Manager,

I hope this email finds you well. I am writing to express my strong interest in the Software Engineer position at your company.

With my background in full-stack development and experience with modern technologies, I believe I would be a valuable addition to your team. My resume highlights my expertise in React, Node.js, and cloud technologies, which align perfectly with the requirements outlined in your job posting.

I would welcome the opportunity to discuss how my skills and passion for technology can contribute to your team's success. Thank you for considering my application.

Best regards,
[Your Name]`

      setEmail(demoEmail)
      onEmailGenerated(demoEmail)

      toast({
        title: "Demo Email Generated",
        description: "Using demo email for development. Connect your backend for full functionality.",
        variant: "default",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(email)
      toast({
        title: "Copied!",
        description: "Email copied to clipboard.",
      })
    } catch (error) {
      toast({
        title: "Copy failed",
        description: "Please select and copy the text manually.",
        variant: "destructive",
      })
    }
  }

  const downloadEmail = () => {
    const blob = new Blob([email], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "generated-email.txt"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  if (isGenerating) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
        <h3 className="text-lg font-semibold mb-2">Generating Your Email...</h3>
        <p className="text-muted-foreground text-center">
          Our AI is analyzing your resume and job description to craft the perfect email
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold mb-2">Your Personalized Email</h3>
        <p className="text-muted-foreground">Review and customize your AI-generated email before sending</p>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-base">Generated Email</CardTitle>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={copyToClipboard}>
              <Copy className="h-4 w-4 mr-1" />
              Copy
            </Button>
            <Button variant="outline" size="sm" onClick={downloadEmail}>
              <Download className="h-4 w-4 mr-1" />
              Download
            </Button>
            <Button variant="outline" size="sm" onClick={generateEmail}>
              <RefreshCw className="h-4 w-4 mr-1" />
              Regenerate
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Textarea
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            rows={12}
            className="font-mono text-sm"
            placeholder="Your generated email will appear here..."
          />
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onPrevious}>
          Previous
        </Button>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onStartOver}>
            Start Over
          </Button>
          <Button className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            Open in Email Client
          </Button>
        </div>
      </div>
    </div>
  )
}
