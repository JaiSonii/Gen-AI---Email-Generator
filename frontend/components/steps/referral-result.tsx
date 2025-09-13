"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2, Copy, RefreshCw, Download, Mail } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { generateEmail } from "@/api/email"
import { Email, Review } from "@/lib/types"
import { ReviewResult } from "./review-result"
import { FuturisticLoader } from "./futurisitic-loader"
import { generateReferral } from "@/api/referral"

interface EmailResultProps {
  formData: {
    resumeText: string
    jobDescription: string
    recruiterInfo: string
    generatedEmail: string
  }
  onPrevious: () => void
  onStartOver: () => void
}

export function ReferralResult({ formData, onPrevious, onStartOver }: EmailResultProps) {
  const [isGenerating, setIsGenerating] = useState(true) // Start in generating state
  const [email, setEmail] = useState("")
  const [review, setReview] = useState<Review | null>(null) // <-- Add state for review
  const { toast } = useToast()

  useEffect(() => {
    handleGenerate()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function formatEmail(emailObj: Email): string {
    if (!emailObj) return ""
    return [
      emailObj.subject ? `Subject: ${emailObj.subject}` : "",
      emailObj.greeting || "",
      emailObj.body || "",
      emailObj.closing || "",
      emailObj.signature || "",
    ]
      .filter(Boolean)
      .join("\n\n")
  }

  const openInEmailClient = () => {
    // ... same as before
    let subject = "";
    let body = email;
    const subjectMatch = email.match(/^Subject:\s*(.*)$/m);
    if (subjectMatch) {
      subject = subjectMatch[1];
      body = email.replace(/^Subject:.*$/m, "").trim();
    }
    const mailtoLink = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(mailtoLink, "_blank");
  };


  const handleGenerate = async () => {
    if (!formData.resumeText || !formData.jobDescription) return false

    setIsGenerating(true)

    try {
      const generated = await generateReferral(formData.resumeText, formData.jobDescription, formData.recruiterInfo, "email")
      const formatted = formatEmail(generated.referral_message as Email)
      console.log(formatted)
      setEmail(formatted)
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

  const copyToClipboard = async () => {
    // ... same as before
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
    // ... same as before
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
      <FuturisticLoader />
    )
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold mb-2">Your AI-Generated Results</h3>
        <p className="text-muted-foreground">Review your personalized email and resume feedback</p>
      </div>

      <Tabs defaultValue="email" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="email">Generated Email</TabsTrigger>
          <TabsTrigger value="review">Resume Review</TabsTrigger>
        </TabsList>

        <TabsContent value="email">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <CardTitle className="text-base">Email Content</CardTitle>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={copyToClipboard}><Copy className="h-4 w-4 mr-1" /> Copy</Button>
                <Button variant="outline" size="sm" onClick={downloadEmail}><Download className="h-4 w-4 mr-1" /> Download</Button>
                <Button variant="outline" size="sm" onClick={handleGenerate}><RefreshCw className="h-4 w-4 mr-1" /> Regenerate</Button>
              </div>
            </CardHeader>
            <CardContent>
              <Textarea
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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

      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={onPrevious}>Previous</Button>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onStartOver}>Start Over</Button>
          <Button className="flex items-center gap-2" onClick={openInEmailClient}><Mail className="h-4 w-4" /> Open in Email Client</Button>
        </div>
      </div>
    </div>
  )
}