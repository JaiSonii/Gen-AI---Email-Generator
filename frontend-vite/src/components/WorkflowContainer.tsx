import React, { useEffect } from 'react';
import { ArrowLeft, Zap } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ResumeUpload } from './WorkflowSteps/ResumeUpload';
import { JobDescriptionInput } from './WorkflowSteps/JobDescriptionInput';
import { ContactInfo } from './WorkflowSteps/ContactInfo';
import { ResultsDisplay } from './WorkflowSteps/ResultsDisplay';
import { FuturisticLoader } from './FuturisticLoader';
import { generateEmail } from '../api/email';
import { generateReferral } from '../api/referral';
import { toast } from '../hooks/use-toast';

const stepComponents = [
  null, // Step 0 is not used
  ResumeUpload,
  JobDescriptionInput,
  ContactInfo,
  ResultsDisplay,
];

const stepTitles = [
  '',
  'Resume Upload',
  'Job Description',
  'Contact Information',
  'Results',
];

export function WorkflowContainer() {
  const { state, dispatch } = useApp();

  // Handle generation when reaching step 4
  useEffect(() => {
    if (state.currentStep === 4 && !state.generatedContent && !state.isLoading) {
      handleGeneration();
    }
  }, [state.currentStep]);

  const handleGeneration = async () => {
    if (!state.resumeText || !state.jobDescriptionJSON) return;

    dispatch({ type: 'SET_LOADING', payload: true });

    try {
      let result;
      
      if (state.currentGenerator === 'email') {
        result = await generateEmail(
          state.resumeText,
          state.jobDescriptionJSON,
          state.contactInfo
        );
        dispatch({ type: 'SET_GENERATED_CONTENT', payload: result.email });
        dispatch({ type: 'SET_RESUME_REVIEW', payload: result.review });
      } else if (state.currentGenerator === 'linkedin') {
        result = await generateReferral(
          state.resumeText,
          state.jobDescriptionJSON,
          state.contactInfo,
          'linkedin message'
        );
        dispatch({ type: 'SET_GENERATED_CONTENT', payload: result.referral_message });
        dispatch({ type: 'SET_RESUME_REVIEW', payload: result.review });
      } else if (state.currentGenerator === 'referral') {
        result = await generateReferral(
          state.resumeText,
          state.jobDescriptionJSON,
          state.contactInfo,
          'email'
        );
        dispatch({ type: 'SET_GENERATED_CONTENT', payload: result.referral_message });
        dispatch({ type: 'SET_RESUME_REVIEW', payload: result.review });
      }

      toast({
        title: 'Generation complete!',
        description: 'Your personalized content and resume analysis are ready.',
      });

    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Generation failed' });
      toast({
        variant: 'destructive',
        title: 'Generation failed',
        description: error instanceof Error ? error.message : 'An error occurred during generation',
      });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const handleBack = () => {
    dispatch({ type: 'RESET_STATE' });
  };

  const getCurrentStepComponent = () => {
    const StepComponent = stepComponents[state.currentStep];
    return StepComponent ? <StepComponent /> : null;
  };

  const getGeneratorDisplayName = () => {
    switch (state.currentGenerator) {
      case 'email': return 'Email Generator';
      case 'linkedin': return 'LinkedIn Messages';
      case 'referral': return 'Referral Requests';
      default: return '';
    }
  };

  if (state.isLoading) {
    return <FuturisticLoader />;
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/3 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/3 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-border/50 bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={handleBack}
                className="flex items-center space-x-2 text-muted-foreground hover:text-primary transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="text-sm">Back to Home</span>
              </button>
              
              <div className="h-6 w-px bg-border"></div>
              
              <div className="flex items-center space-x-2">
                <Zap className="w-5 h-5 text-primary" />
                <h1 className="text-lg font-heading font-semibold text-foreground">
                  {getGeneratorDisplayName()}
                </h1>
              </div>
            </div>

            {/* Progress Indicator */}
            {state.currentStep > 0 && state.currentStep < 4 && (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-muted-foreground">
                  Step {state.currentStep} of 3
                </span>
                <div className="flex space-x-1">
                  {[1, 2, 3].map((step) => (
                    <div
                      key={step}
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${
                        step <= state.currentStep
                          ? 'bg-primary shadow-glow'
                          : 'bg-border'
                      }`}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 container mx-auto px-6 py-12">
        {/* Step Title */}
        {state.currentStep > 0 && state.currentStep < 4 && (
          <div className="text-center mb-8">
            <div className="inline-flex items-center space-x-2 bg-surface/50 border border-primary/20 rounded-full px-4 py-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-primary animate-glow-pulse"></div>
              <span className="text-sm font-medium text-primary">
                {stepTitles[state.currentStep]}
              </span>
            </div>
          </div>
        )}

        {/* Step Content */}
        <div className="transition-all duration-500 ease-in-out">
          {getCurrentStepComponent()}
        </div>
      </main>

      {/* Error Display */}
      {state.error && (
        <div className="fixed bottom-6 right-6 bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-lg max-w-md">
          <p className="text-sm">{state.error}</p>
          <button 
            onClick={() => dispatch({ type: 'SET_ERROR', payload: null })}
            className="text-xs text-destructive/70 hover:text-destructive mt-1 underline"
          >
            Dismiss
          </button>
        </div>
      )}
    </div>
  );
}