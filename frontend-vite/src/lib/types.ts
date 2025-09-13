// EmailCraft AI - Type Definitions

export interface AppState {
  currentGenerator: 'email' | 'linkedin' | 'referral' | null;
  currentStep: number;
  resumeFile: File | null;
  resumeText: string;
  jobDescriptionInput: string;
  jobDescriptionJSON: string;
  contactInfo: string;
  generatedContent: Email | LinkedInMessage | null;
  resumeReview: Review | null;
  isLoading: boolean;
  error: string | null;
}

export interface Email {
  subject: string;
  greeting: string;
  body: string;
  closing: string;
  signature: string;
}

export interface LinkedInMessage {
  greeting: string;
  body: string;
  closing: string;
}

export interface Review {
  overall_summary: string;
  strengths: string[];
  areas_for_improvement: string[];
  keyword_analysis: KeywordAnalysis;
  ats_score: number;
  recommendations: string[];
}

export interface KeywordAnalysis {
  matched_keywords: string[];
  missing_keywords: string[];
  keyword_suggestions: { [key: string]: string };
  match_percentage: number;
}

export interface EmailResponse {
  email: Email;
  review: Review;
}

export interface LinkedInResponse {
  referral_message: LinkedInMessage | Email;
  review: Review;
}

export type GeneratorType = 'email' | 'linkedin' | 'referral';

export interface StepData {
  id: number;
  title: string;
  description: string;
  completed: boolean;
}