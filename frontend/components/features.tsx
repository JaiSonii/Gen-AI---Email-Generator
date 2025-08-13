import { Card, CardContent } from "@/components/ui/card"
import { Brain, FileText, Users, Zap, Shield, Target } from "lucide-react"

const features = [
  {
    icon: Brain,
    title: "AI-Powered Intelligence",
    description: "Advanced AI analyzes your resume and job descriptions to craft perfectly tailored emails.",
  },
  {
    icon: FileText,
    title: "Resume Analysis",
    description: "Upload your resume and let our AI extract key skills and experiences for personalization.",
  },
  {
    icon: Users,
    title: "Recruiter Insights",
    description: "LinkedIn profile analysis provides context about recruiters for more targeted outreach.",
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Generate professional emails in seconds, not hours. Save time for what matters most.",
  },
  {
    icon: Shield,
    title: "Professional Quality",
    description: "Every email is crafted with professional tone and structure that gets results.",
  },
  {
    icon: Target,
    title: "Highly Targeted",
    description: "Each email is customized based on the specific job and company you're targeting.",
  },
]

export function Features() {
  return (
    <section id="features" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="font-serif text-3xl font-bold mb-4">Why Choose EmailCraft AI?</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Our platform combines cutting-edge AI with deep understanding of recruitment to help you stand out in a
            crowded job market.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="border-0 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <feature.icon className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="ml-3 font-semibold">{feature.title}</h3>
                </div>
                <p className="text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
