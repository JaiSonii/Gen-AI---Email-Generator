"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles, Zap, Target } from "lucide-react"

interface HeroProps {
  onGetStarted: () => void
}

export function Hero({ onGetStarted }: HeroProps) {
  return (
    <section className="relative overflow-hidden py-20 lg:py-32">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-1/4 h-64 w-64 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-accent/5 blur-3xl" />
      </div>

      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary animate-fade-in-up">
            <Sparkles className="h-4 w-4" />
            AI-Powered Email Generation
          </div>

          <h1 className="mb-6 font-serif text-4xl font-black tracking-tight lg:text-6xl animate-fade-in-up">
            Elevate Your Outreach:
            <span className="gradient-text block">AI-Powered Email Generation</span>
          </h1>

          <p className="mb-8 text-lg text-muted-foreground lg:text-xl max-w-2xl mx-auto animate-fade-in-up">
            Craft the perfect email in seconds—personalized for your unique journey. Unlock the power of AI to connect
            with your dream employers.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12 animate-fade-in-up">
            <Button size="lg" onClick={onGetStarted} className="group animate-pulse-glow">
              Start Crafting Emails
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
            <Button variant="outline" size="lg">
              Watch Demo
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto animate-fade-in-up">
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Zap className="h-5 w-5 text-primary mr-2" />
                <span className="font-serif text-2xl font-bold">3x</span>
              </div>
              <p className="text-sm text-muted-foreground">Faster Response Rate</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Target className="h-5 w-5 text-primary mr-2" />
                <span className="font-serif text-2xl font-bold">95%</span>
              </div>
              <p className="text-sm text-muted-foreground">Personalization Accuracy</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Sparkles className="h-5 w-5 text-primary mr-2" />
                <span className="font-serif text-2xl font-bold">10k+</span>
              </div>
              <p className="text-sm text-muted-foreground">Emails Generated</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
