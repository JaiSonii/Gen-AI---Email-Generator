import React, { useCallback, useState } from 'react';
import { Upload, FileText, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { parseResume } from '../../api/resume';
import { toast } from '../../hooks/use-toast';

export function ResumeUpload() {
  const { state, dispatch } = useApp();
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileUpload = useCallback(async (file: File) => {
    if (!file) return;

    // Validate file type
    if (file.type !== 'application/pdf') {
      toast({
        variant: 'destructive',
        title: 'Invalid file type',
        description: 'Please upload a PDF file.',
      });
      return;
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        variant: 'destructive',
        title: 'File too large',
        description: 'Please upload a file smaller than 5MB.',
      });
      return;
    }

    dispatch({ type: 'SET_RESUME_FILE', payload: file });
    setIsProcessing(true);
    dispatch({ type: 'SET_LOADING', payload: true });

    try {
      const resumeText = await parseResume(file);
      dispatch({ type: 'SET_RESUME_TEXT', payload: resumeText });
      
      toast({
        title: 'Resume processed successfully!',
        description: 'Your resume has been analyzed and is ready for the next step.',
      });

      // Auto-advance to next step after a brief delay
      setTimeout(() => {
        dispatch({ type: 'NEXT_STEP' });
      }, 1500);

    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Failed to process resume' });
      toast({
        variant: 'destructive',
        title: 'Processing failed',
        description: error instanceof Error ? error.message : 'Failed to process resume',
      });
    } finally {
      setIsProcessing(false);
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [dispatch]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  }, [handleFileUpload]);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileUpload(files[0]);
    }
  }, [handleFileUpload]);

  const getUploadStatus = () => {
    if (isProcessing) return 'processing';
    if (state.resumeText) return 'complete';
    if (state.resumeFile) return 'uploaded';
    return 'idle';
  };

  const status = getUploadStatus();

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-heading font-bold text-foreground mb-4">
          Upload Your <span className="text-primary">Resume</span>
        </h2>
        <p className="text-muted-foreground">
          Upload your resume as a PDF file. Our AI will analyze your experience, 
          skills, and achievements to create personalized outreach content.
        </p>
      </div>

      {/* Upload Area */}
      <div
        className={`relative border-2 border-dashed rounded-xl p-12 text-center transition-all duration-300 ${
          isDragging 
            ? 'border-primary bg-primary/5 shadow-glow' 
            : status === 'complete'
            ? 'border-secondary bg-secondary/5'
            : 'border-border hover:border-primary/50 hover:bg-surface'
        }`}
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        onDragEnter={() => setIsDragging(true)}
        onDragLeave={() => setIsDragging(false)}
      >
        {/* Upload Icon/Status */}
        <div className="mb-6">
          {status === 'processing' && (
            <div className="scan-line">
              <FileText className="w-16 h-16 text-primary mx-auto animate-glow-pulse" />
            </div>
          )}
          {status === 'complete' && (
            <CheckCircle2 className="w-16 h-16 text-secondary mx-auto" />
          )}
          {status === 'uploaded' && (
            <FileText className="w-16 h-16 text-primary mx-auto" />
          )}
          {status === 'idle' && (
            <Upload className="w-16 h-16 text-muted-foreground mx-auto" />
          )}
        </div>

        {/* Upload Text */}
        <div className="mb-6">
          {status === 'processing' && (
            <div>
              <h3 className="text-xl font-heading font-semibold text-primary mb-2">
                Processing Resume...
              </h3>
              <p className="text-muted-foreground">Analyzing your experience and skills</p>
            </div>
          )}
          {status === 'complete' && (
            <div>
              <h3 className="text-xl font-heading font-semibold text-secondary mb-2">
                Resume Processed Successfully!
              </h3>
              <p className="text-muted-foreground">Ready to proceed to job description</p>
            </div>
          )}
          {status === 'uploaded' && (
            <div>
              <h3 className="text-xl font-heading font-semibold text-foreground mb-2">
                {state.resumeFile?.name}
              </h3>
              <p className="text-muted-foreground">Click process or upload a different file</p>
            </div>
          )}
          {status === 'idle' && (
            <div>
              <h3 className="text-xl font-heading font-semibold text-foreground mb-2">
                Drop your resume here
              </h3>
              <p className="text-muted-foreground">
                Or click to browse files • PDF only • Max 5MB
              </p>
            </div>
          )}
        </div>

        {/* File Input */}
        {status !== 'processing' && status !== 'complete' && (
          <div>
            <input
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
              className="hidden"
              id="resume-upload"
            />
            <label 
              htmlFor="resume-upload" 
              className="cyber-button inline-flex items-center space-x-2 cursor-pointer"
            >
              <Upload className="w-4 h-4" />
              <span>Choose File</span>
            </label>
          </div>
        )}

        {/* Scanning animation overlay */}
        {isProcessing && (
          <div className="absolute inset-0 rounded-xl overflow-hidden">
            <div className="absolute inset-0 bg-primary/5 animate-glow-pulse"></div>
          </div>
        )}
      </div>

      {/* File Requirements */}
      <div className="mt-6 p-4 bg-surface border border-border rounded-lg">
        <div className="flex items-start space-x-3">
          <AlertCircle className="w-5 h-5 text-accent mt-1 flex-shrink-0" />
          <div>
            <h4 className="font-medium text-foreground mb-2">Requirements:</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• PDF format only</li>
              <li>• Maximum file size: 5MB</li>
              <li>• Clear, readable text (avoid image-only PDFs)</li>
              <li>• Standard resume format recommended</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}