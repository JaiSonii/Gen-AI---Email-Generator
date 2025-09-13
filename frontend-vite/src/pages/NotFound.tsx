import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Home, AlertTriangle } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-destructive/5 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="relative z-10 text-center max-w-2xl mx-auto px-6">
        {/* Error Icon */}
        <div className="mb-8">
          <div className="w-24 h-24 mx-auto rounded-full bg-destructive/10 flex items-center justify-center border border-destructive/20">
            <AlertTriangle className="w-12 h-12 text-destructive" />
          </div>
        </div>

        {/* Error Text */}
        <h1 className="text-6xl font-heading font-black text-foreground mb-4">
          4<span className="text-destructive">0</span>4
        </h1>
        
        <h2 className="text-2xl font-heading font-bold text-foreground mb-4">
          Page Not Found
        </h2>
        
        <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
          The page you're looking for doesn't exist or has been moved. 
          Don't worry, let's get you back on track to creating amazing outreach content.
        </p>

        {/* CTA Button */}
        <Link 
          to="/" 
          className="cyber-button inline-flex items-center space-x-2 bg-primary text-primary-foreground hover:bg-primary/90 border-primary"
        >
          <Home className="w-4 h-4" />
          <span>Return to EmailCraft AI</span>
        </Link>

        {/* Additional Help */}
        <div className="mt-12 p-6 bg-surface border border-border rounded-lg">
          <h3 className="font-heading font-semibold text-foreground mb-3">
            Looking for something specific?
          </h3>
          <div className="grid md:grid-cols-3 gap-4 text-sm">
            <Link to="/" className="text-primary hover:text-primary/80 transition-colors">
              → Email Generator
            </Link>
            <Link to="/" className="text-secondary hover:text-secondary/80 transition-colors">
              → LinkedIn Messages
            </Link>
            <Link to="/" className="text-accent hover:text-accent/80 transition-colors">
              → Referral Requests
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;