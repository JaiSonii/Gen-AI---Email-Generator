"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Hero } from "@/components/hero"
import { EmailGenerator } from "@/components/email-generator"
import { LinkedInGenerator } from "@/components/linkedin-generator"
import { ReferralGenerator } from "@/components/referral-generator"
import { Features } from "@/components/features"
import { Footer } from "@/components/footer"

type GeneratorMode = "email" | "linkedin" | "referral" | null

export default function HomePage() {
  const [currentGenerator, setCurrentGenerator] = useState<GeneratorMode>(null)

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-lime-50">
      <Header />

      {!currentGenerator ? (
        <>
          <Hero
            onGetStarted={() => setCurrentGenerator("email")}
            onLinkedInMessage={() => setCurrentGenerator("linkedin")}
            onReferralRequest={() => setCurrentGenerator("referral")}
          />
          <Features />
          <Footer />
        </>
      ) : (
        <>
          {currentGenerator === "email" && <EmailGenerator onBack={() => setCurrentGenerator(null)} />}
          {currentGenerator === "linkedin" && <LinkedInGenerator onBack={() => setCurrentGenerator(null)} />}
          {currentGenerator === "referral" && <ReferralGenerator onBack={() => setCurrentGenerator(null)} />}
        </>
      )}
    </div>
  )
}
