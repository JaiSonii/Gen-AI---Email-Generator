import { globalEnv } from "./global-env"

export async function jdToJSON(jd : string) {
    try {
        if (!jd)
            throw new Error("Job Description is empty");
        const isUrl = jd.startsWith("https://")
        const endpoint = `${globalEnv.apiUrl}/v1/${isUrl ? 'jd-from-url' : 'jd-from-text'}`
        const res = await fetch(endpoint,{
            method: "POST",
            headers:{
                "Content-Type" : "application/json"
            },
            body : JSON.stringify({
                ...(isUrl ? { url: jd } : { jd_text: jd })
            })
        })
        if (!res.ok)
            throw new Error("Failed to fetch job description")
        const data = await res.json()
        return data
    } catch (error) {
        console.error("Error in parsing job description : ", error)
        return {}
    }
}
