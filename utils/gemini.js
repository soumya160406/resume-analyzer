import { GoogleGenAI } from "@google/genai";

function getAI() {

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
        throw new Error("GEMINI_API_KEY is not set");
    }

    return new GoogleGenAI({
        apiKey,
    });
}


export async function analyzeResume(resumeText) {

    const ai = getAI();

    const prompt = `
You are an ATS Resume Analyzer.

Analyze the following resume and return ONLY valid JSON.

{
  "resumeScore": 0,
  "atsScore": 0,
  "strengths": [],
  "weaknesses": [],
  "missingSkills": [],
  "careerSuggestions": []
}

Resume:
${resumeText}
`;

    const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
    });

    return response.text;
}

export async function matchResumeWithJob(resumeText, jobDescription) {

    const ai = getAI();

    const prompt = `
You are an ATS Resume Matcher.

Compare the resume with the job description.

Return ONLY valid JSON.

{
  "matchPercentage": 0,
  "matchingSkills": [],
  "missingSkills": [],
  "suggestions": []
}

Resume:
${resumeText}

Job Description:
${jobDescription}
`;

    const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
    });

    let text = response.text;

    text = text.replace(/```json/g, "").replace(/```/g, "").trim();

    return JSON.parse(text);
}