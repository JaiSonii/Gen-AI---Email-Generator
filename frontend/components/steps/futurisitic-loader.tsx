// components/ui/FuturisticLoader.tsx

"use client"

import { useState, useEffect } from "react"

// The steps the "AI" is taking. You can customize these!
const loadingSteps = [
  "Initializing cognitive matrix...",
  "Parsing resume data...",
  "Analyzing job description for keywords...",
  "Cross-referencing skills and requirements...",
  "Generating persuasive opening statement...",
  "Crafting experience-driven body paragraphs...",
  "Optimizing for tone and impact...",
  "Finalizing call to action...",
]

export function FuturisticLoader() {
  const [currentStep, setCurrentStep] = useState(0)

  useEffect(() => {
    // This interval will cycle through the loading steps
    const interval = setInterval(() => {
      setCurrentStep((prevStep) => (prevStep + 1) % loadingSteps.length)
    }, 1800) // Change step every 1.8 seconds

    // Cleanup function to clear the interval when the component unmounts
    return () => clearInterval(interval)
  }, [])

  return (
    <>
      {/* We'll use a style tag for the self-contained animation CSS. 
          You can also move this to your global CSS file. */}
      <style>
        {`
          @keyframes pulse {
            0% {
              transform: scale(0.95);
              opacity: 0.7;
            }
            50% {
              transform: scale(1.1);
              opacity: 1;
            }
            100% {
              transform: scale(0.95);
              opacity: 0.7;
            }
          }
          @keyframes ripple {
            0% {
              transform: scale(0.8);
              opacity: 1;
            }
            100% {
              transform: scale(2.4);
              opacity: 0;
            }
          }
        `}
      </style>

      <div className="flex flex-col items-center justify-center py-12 text-center">
        {/* The Visual Animation */}
        <div className="relative flex h-24 w-24 items-center justify-center">
          {/* Rippling circles for a radar/sonar effect */}
          <div className="absolute h-full w-full rounded-full bg-primary/20" style={{ animation: `ripple 2s infinite ease-out` }}></div>
          <div className="absolute h-full w-full rounded-full bg-primary/20" style={{ animation: `ripple 2s infinite ease-out 0.5s` }}></div>
          
          {/* The central pulsing orb */}
          <div className="relative h-12 w-12 rounded-full bg-primary/80 shadow-lg shadow-primary/50" style={{ animation: `pulse 2s infinite ease-in-out` }}>
             {/* A small "glint" on the orb */}
            <div className="absolute top-2 left-2 h-3 w-3 rounded-full bg-white/50 blur-sm"></div>
          </div>
        </div>

        {/* The Dynamic Text */}
        <h3 className="text-lg font-semibold mt-8 mb-2 text-primary tracking-wide">
          Crafting Your Email...
        </h3>
        <p className="text-muted-foreground w-full transition-all duration-500">
          {loadingSteps[currentStep]}
        </p>
      </div>
    </>
  )
}