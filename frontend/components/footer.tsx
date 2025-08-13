export function Footer() {
  return (
    <footer className="bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="font-serif text-xl font-bold gradient-text">EmailCraft AI</span>
          </div>
          <p className="text-muted-foreground mb-4">Elevate your job search with AI-powered email generation</p>
          <div className="flex justify-center gap-6 text-sm text-muted-foreground">
            <a href="#" className="hover:text-foreground transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-foreground transition-colors">
              Terms of Service
            </a>
            <a href="#" className="hover:text-foreground transition-colors">
              Contact
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
