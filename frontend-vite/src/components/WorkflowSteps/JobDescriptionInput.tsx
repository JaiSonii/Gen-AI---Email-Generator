import React, { useState } from 'react';
import { Link, FileText, ArrowRight, AlertCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { jdToJSON } from '../../api/jd';
import { toast } from '../../hooks/use-toast';

export function JobDescriptionInput() {
  const { state, dispatch } = useApp();
  const [inputValue, setInputValue] = useState(state.jobDescriptionInput);
  const [inputType, setInputType] = useState<'text' | 'url'>('text');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async () => {
    if (!inputValue.trim()) {
      toast({
        variant: 'destructive',
        title: 'Job description required',
        description: 'Please provide a job description or URL.',
      });
      return;
    }

    dispatch({ type: 'SET_JOB_DESCRIPTION_INPUT', payload: inputValue });
    setIsProcessing(true);
    dispatch({ type: 'SET_LOADING', payload: true });

    try {
      const jobDescriptionJSON = await jdToJSON(inputValue);
      dispatch({ type: 'SET_JOB_DESCRIPTION_JSON', payload: JSON.stringify(jobDescriptionJSON, null, 2) });
      
      toast({
        title: 'Job description processed!',
        description: 'Requirements extracted and ready for analysis.',
      });

      // Auto-advance to next step
      setTimeout(() => {
        dispatch({ type: 'NEXT_STEP' });
      }, 1500);

    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Failed to process job description' });
      toast({
        variant: 'destructive',
        title: 'Processing failed',
        description: error instanceof Error ? error.message : 'Failed to process job description',
      });
    } finally {
      setIsProcessing(false);
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const detectInputType = (value: string) => {
    const isUrl = value.trim().startsWith('https://');
    setInputType(isUrl ? 'url' : 'text');
    return isUrl;
  };

  const handleInputChange = (value: string) => {
    setInputValue(value);
    detectInputType(value);
  };

  const isUrl = inputType === 'url';

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-heading font-bold text-foreground mb-4">
          Job <span className="text-primary">Description</span>
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Provide the job description either by pasting the text directly or sharing a URL. 
          Our AI will extract key requirements, skills, and qualifications.
        </p>
      </div>

      {/* Input Type Switcher */}
      <div className="flex justify-center mb-8">
        <div className="bg-surface border border-border rounded-lg p-1 flex">
          <button
            onClick={() => setInputType('text')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 flex items-center space-x-2 ${
              inputType === 'text' 
                ? 'bg-primary text-primary-foreground shadow-glow' 
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Paste Text</span>
          </button>
          <button
            onClick={() => setInputType('url')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 flex items-center space-x-2 ${
              inputType === 'url' 
                ? 'bg-primary text-primary-foreground shadow-glow' 
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Link className="w-4 h-4" />
            <span>Job URL</span>
          </button>
        </div>
      </div>

      {/* Input Area */}
      <div className="relative">
        <div className="relative">
          {isUrl ? (
            <div className="space-y-4">
              <div className="relative">
                <input
                  type="url"
                  value={inputValue}
                  onChange={(e) => handleInputChange(e.target.value)}
                  placeholder="https://example.com/jobs/software-engineer"
                  className="w-full px-4 py-4 bg-surface border border-border rounded-xl text-foreground placeholder-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all duration-200 text-lg"
                  disabled={isProcessing}
                />
                <Link className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              </div>
            </div>
          ) : (
            <textarea
              value={inputValue}
              onChange={(e) => handleInputChange(e.target.value)}
              placeholder="Paste the complete job description here...

Example:
Software Engineer - Full Stack
Company: TechCorp
Location: San Francisco, CA

We are looking for a skilled Software Engineer to join our team...

Requirements:
- 3+ years of experience with React and Node.js
- Strong knowledge of TypeScript
- Experience with cloud platforms (AWS/GCP)
..."
              className="w-full h-96 px-4 py-4 bg-surface border border-border rounded-xl text-foreground placeholder-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all duration-200 resize-none text-lg leading-relaxed"
              disabled={isProcessing}
            />
          )}
        </div>

        {/* Character Count */}
        <div className="flex justify-between items-center mt-4 text-sm text-muted-foreground">
          <div className="flex items-center space-x-2">
            {isUrl ? (
              <span className="flex items-center space-x-1">
                <Link className="w-4 h-4" />
                <span>URL will be fetched and processed</span>
              </span>
            ) : (
              <span>{inputValue.length} characters</span>
            )}
          </div>
          <div className="text-xs">
            {isUrl ? 'Make sure URL is publicly accessible' : 'Include full job posting for best results'}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between items-center mt-8">
        <button
          onClick={() => dispatch({ type: 'PREV_STEP' })}
          className="cyber-button flex items-center space-x-2 text-muted-foreground border-muted-foreground/30 hover:border-primary hover:text-primary"
          disabled={isProcessing}
        >
          <ArrowRight className="w-4 h-4 rotate-180" />
          <span>Back</span>
        </button>

        <button
          onClick={handleSubmit}
          disabled={!inputValue.trim() || isProcessing}
          className={`cyber-button flex items-center space-x-2 ${
            isProcessing 
              ? 'opacity-50 cursor-not-allowed' 
              : 'hover:bg-primary hover:text-primary-foreground'
          }`}
        >
          <span>{isProcessing ? 'Processing...' : 'Process & Continue'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Processing Indicator */}
      {isProcessing && (
        <div className="mt-6 p-4 bg-primary/5 border border-primary/20 rounded-lg">
          <div className="flex items-center space-x-3">
            <div className="animate-glow-pulse">
              <div className="w-4 h-4 bg-primary rounded-full"></div>
            </div>
            <div>
              <p className="text-primary font-medium">
                {isUrl ? 'Fetching job posting from URL...' : 'Analyzing job requirements...'}
              </p>
              <p className="text-sm text-muted-foreground">
                Extracting key skills, qualifications, and requirements
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tips */}
      <div className="mt-8 p-4 bg-surface border border-border rounded-lg">
        <div className="flex items-start space-x-3">
          <AlertCircle className="w-5 h-5 text-accent mt-1 flex-shrink-0" />
          <div>
            <h4 className="font-medium text-foreground mb-2">For best results:</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Include the complete job posting with requirements and qualifications</li>
              <li>• Make sure URLs are publicly accessible (not behind login)</li>
              <li>• Include company information and role details when available</li>
              <li>• Copy from official job board postings for accuracy</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}