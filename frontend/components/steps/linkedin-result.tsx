"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Copy, Download, RefreshCw, ExternalLink, CheckCircle, MessageCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { generateReferral } from "@/api/referral"
import { LinkedInMessage, Review } from "@/lib/types"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ReviewResult } from "./review-result"
import { FuturisticLoader } from "./futurisitic-loader"


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
  const [isGenerating, setIsGenerating] = useState(false)
  const [message, setMessage] = useState<string>("")
  const [review, setReview] = useState<Review | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    handleGenerate()
  }, [])

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

  function formatMessage(message: LinkedInMessage): string {
    if (!message) return ""
    return [
      message.greeting || "",
      message.body || "",
      message.closing || "",
      message.signature || ""
    ]
      .filter(Boolean)
      .join("\n\n")
  }

  const handleGenerate = async () => {
    if (!formData.resumeText || !formData.jobDescription) return false

    setIsGenerating(true)

    try {
      const generated = await generateReferral(formData.resumeText, formData.jobDescription, formData.recruiterInfo, "linkedin message")
      const formatted = formatMessage(generated.referral_message)
      console.log(formatted)
      setMessage(formatted)
      console.log(generated.review)
      setReview(generated.review)
    }
    catch (error) {
      // For now, generate a demo message - replace with actual API call
      const message = `Hi [Name],

I hope this message finds you well. I came across the [Job Title] position at [Company] and was immediately drawn to the opportunity.

With my background in [relevant skills from resume], I believe I could bring significant value to your team. I'm particularly excited about [specific aspect of the job/company].

Would you be open to a brief conversation about this role? I'd love to learn more about the team's current priorities and how I might contribute.

Best regards,
[Your Name]`
      console.error("Error generating LinkedIn message: ", error)
      alert("An error occurred while generating the LinkedIn message. Please try again.")
      return false
    } finally {
      setIsGenerating(false)
    }
  }
  const handleOpenLinkedIn = () => {
    window.open("https://linkedin.com/messaging", "_blank")
  }

  if (isGenerating) {
    return (
      <FuturisticLoader />
    )
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

      <Tabs defaultValue="message" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="message">Generated Message</TabsTrigger>
          <TabsTrigger value="review">Resume Review</TabsTrigger>
        </TabsList>

        <TabsContent value="message">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <CardTitle className="text-base">Email Content</CardTitle>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handleCopy}><Copy className="h-4 w-4 mr-1" /> Copy</Button>
                <Button variant="outline" size="sm" onClick={handleDownload}><Download className="h-4 w-4 mr-1" /> Download</Button>
                <Button variant="outline" size="sm" onClick={handleGenerate}><RefreshCw className="h-4 w-4 mr-1" /> Regenerate</Button>
              </div>
            </CardHeader>
            <CardContent>
              <Textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={15}
                className="font-mono text-sm"
                placeholder="Your generated email will appear here..."
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="review">
          {review ? <ReviewResult review={review} /> : <p>Review data is not available.</p>}
        </TabsContent>
      </Tabs>

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
          onClick={(e) => handleGenerate()}
          variant="outline"
          disabled={isGenerating}
          className="flex items-center gap-2 bg-transparent"
        >
          <RefreshCw className={`h-4 w-4 ${isGenerating ? "animate-spin" : ""}`} />
          {isGenerating ? "Generating..." : "Regenerate"}
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
