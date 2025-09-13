import React, { useState } from 'react';
import { Copy, Mail, ExternalLink, CheckCircle2, XCircle, TrendingUp, TrendingDown, Target, RefreshCw, Home } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Email, LinkedInMessage, Review } from '../../lib/types';
import { toast } from '../../hooks/use-toast';

export function ResultsDisplay() {
  const { state, dispatch } = useApp();
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const handleCopy = async (text: string, fieldName: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(fieldName);
      toast({
        title: 'Copied to clipboard!',
        description: `${fieldName} has been copied to your clipboard.`,
      });
      setTimeout(() => setCopiedField(null), 2000);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Copy failed',
        description: 'Could not copy to clipboard. Please try again.',
      });
    }
  };

  const handleEmailClient = () => {
    if (!state.generatedContent) return;
    
    const email = state.generatedContent as Email;
    const subject = encodeURIComponent(email.subject);
    const body = encodeURIComponent(`${email.greeting}\n\n${email.body}\n\n${email.closing}\n${email.signature}`);
    
    window.open(`mailto:?subject=${subject}&body=${body}`, '_blank');
  };

  const handleStartOver = () => {
    dispatch({ type: 'RESET_STATE' });
  };

  const renderGeneratedContent = () => {
    if (!state.generatedContent) return null;

    const isEmail = state.currentGenerator === 'email';
    const content = state.generatedContent as Email | LinkedInMessage;

    if (isEmail) {
      const email = content as Email;
      return (
        <div className="space-y-6">
          {/* Subject Line */}
          <div className="bg-surface border border-border rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-muted-foreground">Subject Line</label>
              <button
                onClick={() => handleCopy(email.subject, 'Subject')}
                className="flex items-center space-x-1 text-xs text-primary hover:text-primary/80 transition-colors"
              >
                {copiedField === 'Subject' ? (
                  <CheckCircle2 className="w-3 h-3" />
                ) : (
                  <Copy className="w-3 h-3" />
                )}
                <span>{copiedField === 'Subject' ? 'Copied!' : 'Copy'}</span>
              </button>
            </div>
            <p className="text-foreground font-medium">{email.subject}</p>
          </div>

          {/* Email Body */}
          <div className="bg-surface border border-border rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <label className="text-sm font-medium text-muted-foreground">Email Content</label>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleCopy(`${email.greeting}\n\n${email.body}\n\n${email.closing}\n${email.signature}`, 'Email')}
                  className="flex items-center space-x-1 text-xs text-primary hover:text-primary/80 transition-colors"
                >
                  {copiedField === 'Email' ? (
                    <CheckCircle2 className="w-3 h-3" />
                  ) : (
                    <Copy className="w-3 h-3" />
                  )}
                  <span>{copiedField === 'Email' ? 'Copied!' : 'Copy All'}</span>
                </button>
                <button
                  onClick={handleEmailClient}
                  className="flex items-center space-x-1 text-xs text-secondary hover:text-secondary/80 transition-colors"
                >
                  <Mail className="w-3 h-3" />
                  <span>Open in Email</span>
                </button>
              </div>
            </div>
            
            <div className="space-y-4 font-body leading-relaxed">
              <p className="text-foreground">{email.greeting}</p>
              <div className="text-foreground whitespace-pre-line">{email.body}</div>
              <p className="text-foreground">{email.closing}</p>
              <p className="text-muted-foreground text-sm">{email.signature}</p>
            </div>
          </div>
        </div>
      );
    } else {
      const message = content as LinkedInMessage;
      return (
        <div className="bg-surface border border-border rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <label className="text-sm font-medium text-muted-foreground">LinkedIn Message</label>
            <button
              onClick={() => handleCopy(`${message.greeting}\n\n${message.body}\n\n${message.closing}`, 'LinkedIn Message')}
              className="flex items-center space-x-1 text-xs text-primary hover:text-primary/80 transition-colors"
            >
              {copiedField === 'LinkedIn Message' ? (
                <CheckCircle2 className="w-3 h-3" />
              ) : (
                <Copy className="w-3 h-3" />
              )}
              <span>{copiedField === 'LinkedIn Message' ? 'Copied!' : 'Copy'}</span>
            </button>
          </div>
          
          <div className="space-y-4 font-body leading-relaxed">
            <p className="text-foreground">{message.greeting}</p>
            <div className="text-foreground whitespace-pre-line">{message.body}</div>
            <p className="text-foreground">{message.closing}</p>
          </div>
        </div>
      );
    }
  };

  const renderResumeReview = () => {
    if (!state.resumeReview) return null;

    const review = state.resumeReview as Review;

    return (
      <div className="space-y-6">
        {/* Overall Summary */}
        <div className="bg-surface border border-border rounded-lg p-6">
          <h4 className="text-lg font-heading font-semibold text-foreground mb-3">Overall Analysis</h4>
          <p className="text-muted-foreground leading-relaxed">{review.overall_summary}</p>
        </div>

        {/* ATS Score */}
        <div className="bg-surface border border-border rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-heading font-semibold text-foreground">ATS Compatibility Score</h4>
            <div className="flex items-center space-x-2">
              <div className={`text-2xl font-bold ${
                review.ats_score >= 80 ? 'text-secondary' : 
                review.ats_score >= 60 ? 'text-accent' : 'text-destructive'
              }`}>
                {review.ats_score}%
              </div>
            </div>
          </div>
          <div className="w-full bg-border rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all duration-1000 ${
                review.ats_score >= 80 ? 'bg-secondary' : 
                review.ats_score >= 60 ? 'bg-accent' : 'bg-destructive'
              }`}
              style={{ width: `${review.ats_score}%` }}
            ></div>
          </div>
        </div>

        {/* Strengths and Improvements */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-surface border border-border rounded-lg p-6">
            <div className="flex items-center space-x-2 mb-4">
              <TrendingUp className="w-5 h-5 text-secondary" />
              <h4 className="text-lg font-heading font-semibold text-foreground">Strengths</h4>
            </div>
            <ul className="space-y-2">
              {review.strengths.map((strength, index) => (
                <li key={index} className="flex items-start space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-secondary mt-1 flex-shrink-0" />
                  <span className="text-muted-foreground text-sm">{strength}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-surface border border-border rounded-lg p-6">
            <div className="flex items-center space-x-2 mb-4">
              <TrendingDown className="w-5 h-5 text-accent" />
              <h4 className="text-lg font-heading font-semibold text-foreground">Areas for Improvement</h4>
            </div>
            <ul className="space-y-2">
              {review.areas_for_improvement.map((improvement, index) => (
                <li key={index} className="flex items-start space-x-2">
                  <Target className="w-4 h-4 text-accent mt-1 flex-shrink-0" />
                  <span className="text-muted-foreground text-sm">{improvement}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Keyword Analysis */}
        <div className="bg-surface border border-border rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-heading font-semibold text-foreground">Keyword Analysis</h4>
            <div className="text-sm text-primary font-medium">
              {review.keyword_analysis.match_percentage}% Match
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Matched Keywords */}
            <div>
              <div className="flex items-center space-x-2 mb-3">
                <CheckCircle2 className="w-4 h-4 text-secondary" />
                <span className="font-medium text-foreground">Matched Keywords</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {review.keyword_analysis.matched_keywords.map((keyword, index) => (
                  <span 
                    key={index}
                    className="px-2 py-1 bg-secondary/10 text-secondary text-xs rounded-md border border-secondary/20"
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            </div>

            {/* Missing Keywords */}
            <div>
              <div className="flex items-center space-x-2 mb-3">
                <XCircle className="w-4 h-4 text-destructive" />
                <span className="font-medium text-foreground">Missing Keywords</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {review.keyword_analysis.missing_keywords.map((keyword, index) => (
                  <span 
                    key={index}
                    className="px-2 py-1 bg-destructive/10 text-destructive text-xs rounded-md border border-destructive/20"
                    title={review.keyword_analysis.keyword_suggestions[keyword] || 'Consider adding this keyword'}
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Recommendations */}
        {review.recommendations && review.recommendations.length > 0 && (
          <div className="bg-surface border border-border rounded-lg p-6">
            <h4 className="text-lg font-heading font-semibold text-foreground mb-4">Recommendations</h4>
            <ul className="space-y-3">
              {review.recommendations.map((recommendation, index) => (
                <li key={index} className="flex items-start space-x-2">
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center mt-1 flex-shrink-0">
                    <span className="text-primary font-bold text-xs">{index + 1}</span>
                  </div>
                  <span className="text-muted-foreground text-sm leading-relaxed">{recommendation}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-heading font-bold text-foreground mb-4">
          Your <span className="text-primary">Results</span> Are Ready!
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Your personalized {state.currentGenerator === 'email' ? 'email' : 
                            state.currentGenerator === 'linkedin' ? 'LinkedIn message' : 'referral request'} 
          has been generated along with a detailed analysis of your resume.
        </p>
      </div>

      {/* Results Grid */}
      <div className="grid lg:grid-cols-2 gap-8 mb-12">
        {/* Generated Content */}
        <div>
          <h3 className="text-xl font-heading font-semibold text-foreground mb-6 flex items-center space-x-2">
            <Mail className="w-5 h-5 text-primary" />
            <span>Generated Content</span>
          </h3>
          {renderGeneratedContent()}
        </div>

        {/* Resume Review */}
        <div>
          <h3 className="text-xl font-heading font-semibold text-foreground mb-6 flex items-center space-x-2">
            <Target className="w-5 h-5 text-secondary" />
            <span>Resume Analysis</span>
          </h3>
          {renderResumeReview()}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center space-x-4">
        <button
          onClick={handleStartOver}
          className="cyber-button flex items-center space-x-2 text-muted-foreground border-muted-foreground/30 hover:border-secondary hover:text-secondary"
        >
          <Home className="w-4 h-4" />
          <span>Start Over</span>
        </button>
        
        <button
          onClick={() => dispatch({ type: 'SET_STEP', payload: 1 })}
          className="cyber-button flex items-center space-x-2 text-primary border-primary hover:bg-primary hover:text-primary-foreground"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Generate Another</span>
        </button>
      </div>
    </div>
  );
}