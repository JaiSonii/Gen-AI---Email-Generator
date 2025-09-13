import { LinkedInResponse as LinkedIn } from "@/lib/types";
import { globalEnv } from "./global-env";

export async function generateReferral(
  resumeText: string,
  jobDescription: string,
  recruiterInfo: string,
  messageType: "email" | "linkedin message"
): Promise<LinkedIn> {
  const formData = new URLSearchParams();
  formData.append("resume_text", resumeText);
  formData.append("job_description", jobDescription);
  formData.append("recruiter_info", recruiterInfo);
  formData.append("message_type", messageType);

  try {
    const res = await fetch(`${globalEnv.apiUrl}/v1/generate-referral`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: formData
    });

    if (!res.ok) {
      throw new Error("Failed to generate referral. Please try again.");
    }

    const data = await res.json();
    return data
  } catch (error) {
    console.error("Error generating referral: ", error);
    return {} as LinkedIn;
  }
}