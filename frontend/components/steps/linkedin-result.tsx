"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Copy, Download, RefreshCw, ExternalLink, CheckCircle, MessageCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface LinkedInResultProps {
  formData: {
    resumeText: string
    jobDescription: string
    recruiterInfo: string
    generatedMessage: string
  }
  onMessageGenerated: (message: string) => void
  onPrevious: () => void
  onStartOver: () => void
}

export function LinkedInResult({ formData, onMessageGenerated, onPrevious, onStartOver }: LinkedInResultProps) {
  const [message, setMessage] = useState(formData.generatedMessage)
  const [isRegenerating, setIsRegenerating] = useState(false)
  const { toast } = useToast()

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message)
      toast({
        title: "Copied!",
        description: "LinkedIn message copied to clipboard",
      })
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Please try again",
        variant: "destructive",
      })
    }
  }

  const handleDownload = () => {
    const blob = new Blob([message], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "linkedin-message.txt"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    toast({
      title: "Downloaded!",
      description: "LinkedIn message saved as text file",
    })
  }

  const handleRegenerate = async () => {
    setIsRegenerating(true)

    // Simulate API call - replace with actual regeneration logic
    setTimeout(() => {
      const newMessage = `Hi [Name],

I noticed your post about the [Job Title] role at [Company] and wanted to reach out directly.

My experience in [relevant experience] aligns well with what you're looking for, and I'm particularly drawn to [company/role specific detail].

I'd appreciate the opportunity to discuss how my background could contribute to your team's success. Would you be available for a brief call this week?

Looking forward to connecting,
[Your Name]`

      setMessage(newMessage)
      onMessageGenerated(newMessage)
      setIsRegenerating(false)

      toast({
        title: "Message regenerated!",
        description: "Your LinkedIn message has been updated",
      })
    }, 2000)
  }

  const handleOpenLinkedIn = () => {
    window.open("https://linkedin.com/messaging", "_blank")
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <CheckCircle className="h-6 w-6 text-blue-600" />
          <h3 className="text-lg font-semibold">Your LinkedIn Message is Ready!</h3>
        </div>
        <p className="text-muted-foreground">Review and customize your personalized LinkedIn message below</p>
      </div>

      <Card className="border-blue-200 bg-blue-50/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-700">
            <MessageCircle className="h-5 w-5" />
            Generated LinkedIn Message
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={12}
            className="font-mono text-sm bg-white"
            placeholder="Your LinkedIn message will appear here..."
          />
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Button onClick={handleCopy} variant="outline" className="flex items-center gap-2 bg-transparent">
          <Copy className="h-4 w-4" />
          Copy
        </Button>

        <Button onClick={handleDownload} variant="outline" className="flex items-center gap-2 bg-transparent">
          <Download className="h-4 w-4" />
          Download
        </Button>

        <Button
          onClick={handleRegenerate}
          variant="outline"
          disabled={isRegenerating}
          className="flex items-center gap-2 bg-transparent"
        >
          <RefreshCw className={`h-4 w-4 ${isRegenerating ? "animate-spin" : ""}`} />
          {isRegenerating ? "Generating..." : "Regenerate"}
        </Button>

        <Button onClick={handleOpenLinkedIn} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700">
          <ExternalLink className="h-4 w-4" />
          Open LinkedIn
        </Button>
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onPrevious}>
          Previous
        </Button>
        <Button onClick={onStartOver} variant="outline">
          Create Another Message
        </Button>
      </div>
    </div>
  )
}
