"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Copy, Download, RefreshCw, Mail, CheckCircle, Users } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface ReferralResultProps {
  formData: {
    resumeText: string
    jobDescription: string
    contactInfo: string
    generatedMessage: string
  }
  onMessageGenerated: (message: string) => void
  onPrevious: () => void
  onStartOver: () => void
}

export function ReferralResult({ formData, onMessageGenerated, onPrevious, onStartOver }: ReferralResultProps) {
  const [message, setMessage] = useState(formData.generatedMessage)
  const [isRegenerating, setIsRegenerating] = useState(false)
  const { toast } = useToast()

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message)
      toast({
        title: "Copied!",
        description: "Referral request copied to clipboard",
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
    a.download = "referral-request.txt"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    toast({
      title: "Downloaded!",
      description: "Referral request saved as text file",
    })
  }

  const handleRegenerate = async () => {
    setIsRegenerating(true)

    // Simulate API call - replace with actual regeneration logic
    setTimeout(() => {
      const newMessage = `Hey [Contact Name],

Hope you're doing great! I wanted to reach out about an opportunity I'm really excited about.

I saw that [Company] has an opening for [Job Title], and I remembered you work there. Based on my experience in [relevant skills], I think I could be a strong candidate for this role.

I know referrals can be a big ask, but would you be open to having a quick chat about the role and potentially putting in a good word for me? I'd be happy to send over my resume and answer any questions.

No worries at all if this isn't something you're comfortable with - I completely understand!

Thanks for considering it,
[Your Name]`

      setMessage(newMessage)
      onMessageGenerated(newMessage)
      setIsRegenerating(false)

      toast({
        title: "Message regenerated!",
        description: "Your referral request has been updated",
      })
    }, 2000)
  }

  const handleSendEmail = () => {
    const subject = encodeURIComponent("Referral Request - [Job Title] at [Company]")
    const body = encodeURIComponent(message)
    window.open(`mailto:?subject=${subject}&body=${body}`)
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <CheckCircle className="h-6 w-6 text-purple-600" />
          <h3 className="text-lg font-semibold">Your Referral Request is Ready!</h3>
        </div>
        <p className="text-muted-foreground">Review and customize your personalized referral request below</p>
      </div>

      <Card className="border-purple-200 bg-purple-50/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-purple-700">
            <Users className="h-5 w-5" />
            Generated Referral Request
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={12}
            className="font-mono text-sm bg-white"
            placeholder="Your referral request will appear here..."
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

        <Button onClick={handleSendEmail} className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700">
          <Mail className="h-4 w-4" />
          Send Email
        </Button>
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onPrevious}>
          Previous
        </Button>
        <Button onClick={onStartOver} variant="outline">
          Create Another Request
        </Button>
      </div>
    </div>
  )
}
