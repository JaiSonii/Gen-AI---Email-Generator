import { globalEnv } from './global-env';

/**
 * Convert job description text or URL to structured JSON
 * @param jd - Job description text or URL (URLs must start with https://)
 * @returns Promise that resolves to structured job description JSON object
 */
export async function jdToJSON(jd: string): Promise<object> {
  if (!jd || jd.trim().length === 0) {
    throw new Error('Job description cannot be empty');
  }

  const response = await fetch(`${globalEnv.apiUrl}/v1/jd-to-json`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ jd }),
  });

  if (!response.ok) {
    const errorData = await response.text();
    throw new Error(`Failed to process job description: ${errorData}`);
  }

  return await response.json();
}