import { globalEnv } from "./global-env"

export async function parseResume(resume : File): Promise<string>{
    if (!resume || !(resume instanceof File) || resume.name.split('.').pop()?.toLowerCase() !== 'pdf' || resume.size > 5 * 1024 * 1024)
        throw new Error("Invalid file. Please upload a PDF file smaller than 5MB.");
    const formData = new FormData();
    formData.append("file", resume)
    try {
        const res = await fetch(`${globalEnv.apiUrl}/v1/resume`,{
            method: "POST",
            body: formData
        })
        if (!res.ok)
            throw new Error("Failed to parse resume. Please try again.");
        const data = await res.json();
        return data.resume_text || "";
    } catch (error) {
        console.log("Error parsing resume: ", error);
        return "";
    }
}
