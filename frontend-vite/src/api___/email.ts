import { globalEnv } from './global-env';
import { EmailResponse } from '../lib/types';

/**
 * Generate a personalized email and resume review
 * @param resumeText - Extracted resume text from parseResume
 * @param jobDescription - Stringified JSON from jdToJSON
 * @param recruiterInfo - Information about the recruiter/hiring manager
 * @returns Promise that resolves to EmailResponse with email and review
 */
export async function generateEmail(
  resumeText: string,
  jobDescription: string,
  recruiterInfo: string
): Promise<EmailResponse> {
  if (!resumeText || !jobDescription) {
    throw new Error('Resume text and job description are required');
  }

  const response = await fetch(`${globalEnv.apiUrl}/v2/generate-email`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      resume_text: resumeText,
      job_description: jobDescription,
      recruiter_info: recruiterInfo || '',
    }),
  });

  if (!response.ok) {
    const errorData = await response.text();
    throw new Error(`Failed to generate email: ${errorData}`);
  }

  return await response.json();
}