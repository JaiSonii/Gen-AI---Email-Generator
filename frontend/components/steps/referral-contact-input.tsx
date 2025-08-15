"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

interface ReferralContactInputProps {
  value: string
  onChange: (value: string) => void
  onNext: () => void
  onPrevious: () => void
}

export function ReferralContactInput({ value, onChange, onNext, onPrevious }: ReferralContactInputProps) {
  const [contactInfo, setContactInfo] = useState(value)

  useEffect(() => {
    if (value && !contactInfo) {
      setContactInfo(value)
    }
  }, [value, contactInfo])

  const handleNext = () => {
    onChange(contactInfo)
    onNext()
  }

  const handleInfoChange = (newInfo: string) => {
    setContactInfo(newInfo)
    onChange(newInfo)
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold mb-2">Contact Information</h3>
        <p className="text-muted-foreground">Tell us about your contact who might provide a referral</p>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="contact-info">Contact Details</Label>
          <Textarea
            id="contact-info"
            placeholder="Enter information about your contact (name, relationship, how you know them, their role at the company, etc.)..."
            value={contactInfo}
            onChange={(e) => handleInfoChange(e.target.value)}
            rows={6}
            className="mt-1"
          />
          <p className="text-sm text-muted-foreground mt-1">
            Include their name, how you know them, their role at the company, and your relationship
          </p>
        </div>
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onPrevious}>
          Previous
        </Button>
        <Button onClick={handleNext} disabled={!contactInfo.trim()}>
          Generate Referral Request
        </Button>
      </div>
    </div>
  )
}
