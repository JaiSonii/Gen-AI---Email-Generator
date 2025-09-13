import { globalEnv } from './global-env';

/**
 * Parse a resume PDF file and extract text content
 * @param resume - PDF File object (must be < 5MB)
 * @returns Promise that resolves to extracted text as string
 */
export async function parseResume(resume: File): Promise<string> {
  if (!resume || resume.type !== 'application/pdf') {
    throw new Error('File must be a PDF');
  }
  
  if (resume.size > 5 * 1024 * 1024) {
    throw new Error('File size must be less than 5MB');
  }

  const formData = new FormData();
  formData.append('resume', resume);

  const response = await fetch(`${globalEnv.apiUrl}/v1/resume`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.text();
    throw new Error(`Failed to parse resume: ${errorData}`);
  }

  return await response.text();
}