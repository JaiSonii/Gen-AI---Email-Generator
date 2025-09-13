import { globalEnv } from './global-env';
import { LinkedInResponse } from '../lib/types';

/**
 * Generate a personalized referral request (email or LinkedIn message) and resume review
 * @param resumeText - Extracted resume text from parseResume
 * @param jobDescription - Stringified JSON from jdToJSON
 * @param recruiterInfo - Information about the contact person
 * @param messageType - Type of message: "email" | "linkedin message"
 * @returns Promise that resolves to LinkedInResponse with referral message and review
 */
export async function generateReferral(
  resumeText: string,
  jobDescription: string,
  recruiterInfo: string,
  messageType: "email" | "linkedin message"
): Promise<LinkedInResponse> {
  if (!resumeText || !jobDescription) {
    throw new Error('Resume text and job description are required');
  }

  if (!messageType || !['email', 'linkedin message'].includes(messageType)) {
    throw new Error('Message type must be "email" or "linkedin message"');
  }

  const response = await fetch(`${globalEnv.apiUrl}/v1/generate-referral`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      resume_text: resumeText,
      job_description: jobDescription,
      recruiter_info: recruiterInfo || '',
      message_type: messageType,
    }),
  });

  if (!response.ok) {
    const errorData = await response.text();
    throw new Error(`Failed to generate referral: ${errorData}`);
  }

  return await response.json();
}