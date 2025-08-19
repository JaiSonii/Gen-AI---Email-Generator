"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, CheckCircle, Loader2 } from "lucide-react"
import { ResumeUpload } from "@/components/steps/resume-upload"
import { JobDescriptionInput } from "@/components/steps/job-description-input"
import { RecruiterInput } from "@/components/steps/recruiter-input"
import { EmailResult } from "@/components/steps/email-result"
import { parseResume } from "@/api/resume"
import { jdToJSON } from "@/api/jd"
import { Email } from "@/lib/types"

interface EmailGeneratorProps {
  onBack: () => void
}

export function EmailGenerator({ onBack }: EmailGeneratorProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [loadingMessage, setLoadingMessage] = useState("")

  const [formData, setFormData] = useState({
    resume: null as File | null,
    jobDescription: "",
    recruiterInfo: "",
    generatedEmail: {} as Email,
  })

  const [finalData, setFinalData] = useState({
    resumeText: "",
    jobDescription: "",
    recruiterInfo: "",
    generatedEmail: {} as Email,
  })

  const steps = [
    { id: 1, title: "Upload Resume", completed: !!formData.resume },
    { id: 2, title: "Job Description", completed: !!formData.jobDescription },
    { id: 3, title: "Recruiter Info", completed: !!formData.recruiterInfo },
    { id: 4, title: "Generated Email", completed: !!formData.generatedEmail },
  ]

  const progress = ((currentStep - 1) / (steps.length - 1)) * 100

  const handleResumeApi = async (): Promise<boolean> => {
    if (!formData.resume) return false

    setIsLoading(true)
    setLoadingMessage("Analyzing your resume...")

    try {
      const resume = await parseResume(formData.resume)
      if (resume) {
        console.log("Parsed Resume Text: ", resume)
        setFinalData((prev) => ({ ...prev, resumeText: resume }))
        return true
      }
      alert("Failed to parse resume. Please try again.")
      return false
    } finally {
      setIsLoading(false)
      setLoadingMessage("")
    }
  }

  const handleJobDescriptionApi = async (): Promise<boolean> => {
    if (!formData.jobDescription) return false

    setIsLoading(true)
    setLoadingMessage("Processing job description...")

    try {
      const jd = await jdToJSON(formData.jobDescription)
      if (jd && Object.keys(jd).length > 0) {
        console.log("Parsed Job Description: ", jd)
        setFinalData((prev) => ({ ...prev, jobDescription: JSON.stringify(jd, null, 2) }))
        return true
      }
      alert("Failed to parse job description. Please ensure the text is valid.")
      return false
    } finally {
      setIsLoading(false)
      setLoadingMessage("")
    }
  }

  const handleApi = async (step: number): Promise<boolean> => {
    if (step == 1) {
      return handleResumeApi()
    }
    if (step == 2) {
      return handleJobDescriptionApi()
    }
    if (step == 3) {
      setFinalData((prev) => ({ ...prev, recruiterInfo: formData.recruiterInfo }))
      return true
    }
    return true
  }

  const handleNext = async () => {
    if (currentStep < steps.length) {
      if (await handleApi(currentStep)) setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const updateFormData = (data: Partial<typeof formData>) => {
    setFormData((prev) => ({ ...prev, ...data }))
  }

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-8">
          <Button variant="ghost" onClick={onBack} className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>

          <div className="text-center mb-8">
            <h1 className="font-serif text-3xl font-bold mb-2">Create Your Perfect Email</h1>
            <p className="text-muted-foreground">Follow these simple steps to generate a personalized outreach email</p>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <Progress value={progress} className="mb-4" />
            <div className="flex justify-between">
              {steps.map((step) => (
                <div key={step.id} className="flex items-center">
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium ${
                      step.completed
                        ? "bg-primary text-primary-foreground"
                        : currentStep === step.id
                          ? "bg-primary/20 text-primary"
                          : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {step.completed ? <CheckCircle className="h-4 w-4" /> : step.id}
                  </div>
                  <span className="ml-2 text-sm font-medium hidden sm:block">{step.title}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {isLoading && (
          <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
            <Card className="w-96">
              <CardContent className="flex flex-col items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
                <p className="text-lg font-medium mb-2">Processing...</p>
                <p className="text-sm text-muted-foreground text-center">{loadingMessage}</p>
              </CardContent>
            </Card>
          </div>
        )}

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>
              Step {currentStep}: {steps[currentStep - 1].title}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {currentStep === 1 && (
              <ResumeUpload
                value={formData.resume}
                onChange={(file) => updateFormData({ resume: file })}
                onNext={handleNext}
              />
            )}
            {currentStep === 2 && (
              <JobDescriptionInput
                value={formData.jobDescription}
                onChange={(value) => updateFormData({ jobDescription: value })}
                onNext={handleNext}
                onPrevious={handlePrevious}
              />
            )}
            {currentStep === 3 && (
              <RecruiterInput
                value={formData.recruiterInfo}
                onChange={(value) => updateFormData({ recruiterInfo: value })}
                onNext={handleNext}
                onPrevious={handlePrevious}
              />
            )}
            {currentStep === 4 && (
              <EmailResult
                formData={finalData}
                onEmailGenerated={(email) => setFinalData((prev) => ({ ...prev, generatedEmail: email }))}
                onPrevious={handlePrevious}
                onStartOver={() => {
                  setCurrentStep(1)
                  setFormData({
                    resume: null,
                    jobDescription: "",
                    recruiterInfo: "",
                    generatedEmail: {} as Email,
                  })
                  setFinalData({
                    resumeText: "",
                    jobDescription: "",
                    recruiterInfo: "",
                    generatedEmail: {} as Email,
                  })
                }}
              />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
