"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Hero } from "@/components/hero"
import { EmailGenerator } from "@/components/email-generator"
import { Features } from "@/components/features"
import { Footer } from "@/components/footer"

export default function HomePage() {
  const [showGenerator, setShowGenerator] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-lime-50">
      <Header />

      {!showGenerator ? (
        <>
          <Hero onGetStarted={() => setShowGenerator(true)} />
          <Features />
          <Footer />
        </>
      ) : (
        <EmailGenerator onBack={() => setShowGenerator(false)} />
      )}
    </div>
  )
}
