import React, { useState } from 'react';
import { User, ArrowRight, Info } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export function ContactInfo() {
  const { state, dispatch } = useApp();
  const [contactValue, setContactValue] = useState(state.contactInfo);

  const handleContinue = () => {
    dispatch({ type: 'SET_CONTACT_INFO', payload: contactValue });
    dispatch({ type: 'NEXT_STEP' });
  };

  const handleSkip = () => {
    dispatch({ type: 'SET_CONTACT_INFO', payload: '' });
    dispatch({ type: 'NEXT_STEP' });
  };

  const getPlaceholderText = () => {
    switch (state.currentGenerator) {
      case 'email':
        return `Example:
• Hiring Manager: Sarah Chen
• Title: Senior Engineering Manager
• Email: sarah.chen@company.com
• Found via: LinkedIn
• Mutual connection: John Smith (former colleague)
• Additional context: Recently joined from Google`;
      
      case 'linkedin':
        return `Example:
• Contact: Michael Rodriguez
• Title: Technical Lead
• Company: StartupXYZ
• LinkedIn: linkedin.com/in/michaelrodriguez
• Mutual connections: 2 (Lisa Park, David Kim)
• Recent activity: Posted about team expansion`;
      
      case 'referral':
        return `Example:
• Referral Contact: Jessica Wu
• Your relationship: Former teammate at Adobe (2019-2021)
• Their current role: Senior Product Manager at TargetCompany
• Years at company: 3 years
• Last interaction: Coffee meeting last month
• Their interests: Product innovation, team leadership`;
      
      default:
        return '';
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-heading font-bold text-foreground mb-4">
          Contact <span className="text-primary">Information</span>
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          {state.currentGenerator === 'referral' 
            ? 'Provide details about your referral contact and your relationship with them. This helps create more authentic and effective requests.'
            : 'Add information about the recruiter, hiring manager, or contact person. This helps personalize your outreach and increases response rates.'
          }
        </p>
        <div className="flex items-center justify-center mt-4 text-sm text-accent">
          <Info className="w-4 h-4 mr-2" />
          <span>This step is optional but highly recommended</span>
        </div>
      </div>

      {/* Input Area */}
      <div className="relative">
        <div className="relative">
          <textarea
            value={contactValue}
            onChange={(e) => setContactValue(e.target.value)}
            placeholder={getPlaceholderText()}
            className="w-full h-80 px-4 py-4 bg-surface border border-border rounded-xl text-foreground placeholder-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all duration-200 resize-none text-lg leading-relaxed"
          />
          <div className="absolute top-4 right-4">
            <User className="w-5 h-5 text-muted-foreground" />
          </div>
        </div>

        {/* Character Count */}
        <div className="flex justify-between items-center mt-4 text-sm text-muted-foreground">
          <span>{contactValue.length} characters</span>
          <span>More details = better personalization</span>
        </div>
      </div>

      {/* Benefits of Adding Contact Info */}
      <div className="mt-8 grid md:grid-cols-3 gap-6">
        <div className="p-4 bg-surface border border-border rounded-lg">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mb-3">
            <span className="text-primary font-bold text-sm">1</span>
          </div>
          <h4 className="font-medium text-foreground mb-2">Better Personalization</h4>
          <p className="text-sm text-muted-foreground">Mention specific details and create more engaging, targeted messages.</p>
        </div>
        
        <div className="p-4 bg-surface border border-border rounded-lg">
          <div className="w-8 h-8 rounded-full bg-secondary/10 flex items-center justify-center mb-3">
            <span className="text-secondary font-bold text-sm">2</span>
          </div>
          <h4 className="font-medium text-foreground mb-2">Higher Response Rate</h4>
          <p className="text-sm text-muted-foreground">Personalized messages get 3x more responses than generic outreach.</p>
        </div>
        
        <div className="p-4 bg-surface border border-border rounded-lg">
          <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center mb-3">
            <span className="text-accent font-bold text-sm">3</span>
          </div>
          <h4 className="font-medium text-foreground mb-2">Professional Tone</h4>
          <p className="text-sm text-muted-foreground">AI adapts language and approach based on contact seniority and relationship.</p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between items-center mt-12">
        <button
          onClick={() => dispatch({ type: 'PREV_STEP' })}
          className="cyber-button flex items-center space-x-2 text-muted-foreground border-muted-foreground/30 hover:border-primary hover:text-primary"
        >
          <ArrowRight className="w-4 h-4 rotate-180" />
          <span>Back</span>
        </button>

        <div className="flex space-x-4">
          <button
            onClick={handleSkip}
            className="cyber-button text-muted-foreground border-muted-foreground/30 hover:border-secondary hover:text-secondary"
          >
            Skip for now
          </button>
          
          <button
            onClick={handleContinue}
            className="cyber-button bg-primary text-primary-foreground hover:bg-primary/90 border-primary flex items-center space-x-2"
          >
            <span>Continue</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Tips */}
      <div className="mt-8 p-4 bg-surface border border-border rounded-lg">
        <div className="flex items-start space-x-3">
          <Info className="w-5 h-5 text-accent mt-1 flex-shrink-0" />
          <div>
            <h4 className="font-medium text-foreground mb-2">Helpful information to include:</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Contact's name, title, and company</li>
              <li>• How you found them (LinkedIn, company website, referral)</li>
              <li>• Mutual connections or shared experiences</li>
              <li>• Recent company news or achievements you can reference</li>
              <li>• Any previous interactions or context</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}