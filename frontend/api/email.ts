import { globalEnv } from "./global-env"

export async function generateEmail(
  resumeText: string,
  jobDescription: string,
  recruiterInfo: string
): Promise<string> {
  const formData = new URLSearchParams();
  formData.append("resume_text", resumeText);
  formData.append("job_description", jobDescription);
  formData.append("recruiter_info", recruiterInfo);

  try {
    const res = await fetch(`${globalEnv.apiUrl}/v2/generate-email`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: formData
    });

    if (!res.ok) {
      throw new Error("Failed to generate email. Please try again.");
    }

    const data = await res.json();
    return data.email || "";
  } catch (error) {
    console.error("Error generating email: ", error);
    return "";
  }
}