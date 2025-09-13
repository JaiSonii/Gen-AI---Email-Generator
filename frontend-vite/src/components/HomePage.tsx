import React from 'react';
import { Zap, Sparkles, Target } from 'lucide-react';
import { GeneratorCard } from './GeneratorCard';
import { GeneratorType } from '../lib/types';
import { useApp } from '../context/AppContext';

export function Homepage() {
  const { dispatch } = useApp();

  const handleGeneratorSelect = (type: GeneratorType) => {
    dispatch({ type: 'SET_GENERATOR', payload: type });
  };

  const generators = [
    {
      type: 'email' as GeneratorType,
      title: 'Email Generator',
      description: 'Craft compelling cold outreach emails that get responses from hiring managers and recruiters.',
      features: [
        'Personalized subject lines',
        'ATS-optimized content',
        'Professional tone matching',
        'Call-to-action optimization'
      ]
    },
    {
      type: 'linkedin' as GeneratorType,
      title: 'LinkedIn Messages',
      description: 'Generate engaging LinkedIn messages that stand out in crowded inboxes and build meaningful connections.',
      features: [
        'Connection request messages',
        'Follow-up sequences',
        'Informal yet professional tone',
        'Network expansion focused'
      ]
    },
    {
      type: 'referral' as GeneratorType,  
      title: 'Referral Requests',
      description: 'Create thoughtful referral requests that leverage your network to unlock hidden job opportunities.',
      features: [
        'Relationship-based messaging',
        'Mutual benefit emphasis',
        'Network leverage strategies',
        'Multiple format options'
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-glow opacity-20 rounded-full blur-3xl"></div>
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <header className="container mx-auto px-6 pt-12 pb-8">
          <div className="text-center">
            <div className="inline-flex items-center space-x-2 bg-surface/50 border border-primary/20 rounded-full px-4 py-2 mb-6">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">AI-Powered Career Acceleration</span>
            </div>
            
            <h1 className="text-6xl md:text-7xl font-heading font-black text-foreground mb-6">
              <span className="bg-gradient-primary bg-clip-text text-transparent">EmailCraft</span>
              <span className="text-foreground"> AI</span>
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed mb-4">
              Transform your job search with AI-generated outreach that gets noticed. 
              Create personalized emails, LinkedIn messages, and referral requests that 
              <span className="text-primary font-medium"> convert prospects into opportunities</span>.
            </p>

            <div className="flex items-center justify-center space-x-6 text-sm text-muted-foreground">
              <div className="flex items-center space-x-2">
                <Target className="w-4 h-4 text-secondary" />
                <span>Personalized Content</span>
              </div>
              <div className="flex items-center space-x-2">
                <Zap className="w-4 h-4 text-accent" />
                <span>AI-Powered Analysis</span>
              </div>
              <div className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-primary" />
                <span>Resume Optimization</span>
              </div>
            </div>
          </div>
        </header>

        {/* Generator Selection */}
        <main className="container mx-auto px-6 pb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-heading font-bold text-foreground mb-4">
              Choose Your <span className="text-primary">AI Assistant</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Select the type of outreach you want to create. Each generator is specifically trained 
              to optimize for different communication channels and objectives.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {generators.map((generator) => (
              <GeneratorCard
                key={generator.type}
                type={generator.type}
                title={generator.title}
                description={generator.description}
                features={generator.features}
                onSelect={handleGeneratorSelect}
              />
            ))}
          </div>

          {/* Process Preview */}
          <div className="mt-20 text-center">
            <h3 className="text-2xl font-heading font-bold text-foreground mb-8">
              How It <span className="text-primary">Works</span>
            </h3>
            
            <div className="grid md:grid-cols-4 gap-8 max-w-4xl mx-auto">
              {[
                { step: '01', title: 'Upload Resume', desc: 'Upload your PDF resume for AI analysis' },
                { step: '02', title: 'Job Details', desc: 'Provide job description or URL' },
                { step: '03', title: 'Contact Info', desc: 'Add recruiter/contact details (optional)' },
                { step: '04', title: 'Generate & Review', desc: 'Get your optimized content + insights' }
              ].map((item, index) => (
                <div key={index} className="relative">
                  <div className="w-12 h-12 rounded-full bg-gradient-primary flex items-center justify-center text-primary-foreground font-bold text-lg mb-4 mx-auto">
                    {item.step}
                  </div>
                  <h4 className="font-heading font-semibold text-foreground mb-2">{item.title}</h4>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                  
                  {index < 3 && (
                    <div className="hidden md:block absolute top-6 left-full w-8 h-0.5 bg-gradient-to-r from-primary to-transparent transform -translate-y-1/2"></div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}