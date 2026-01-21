
import { GoogleGenAI, Type } from "@google/genai";
import { ResumeData, AtsAnalysis } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const rewriteProfessionalSummary = async (data: ResumeData): Promise<string> => {
  const prompt = `
    Rewrite a professional, ATS-optimized summary for a resume based on these details:
    Experience: ${data.experience.map(e => `${e.position} at ${e.company}`).join(', ')}
    Skills: ${data.skills.map(s => s.name).join(', ')}
    
    Make it punchy, result-oriented, and use strong action verbs. Keep it under 4 sentences.
    Focus on the candidate's core strengths and professional identity derived from their work history.
    Return only the text of the summary.
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
  });

  return response.text || '';
};

export const optimizeExperienceBullet = async (bullet: string): Promise<string> => {
  const prompt = `
    The following is a bullet point from a professional resume. 
    Rewrite it to be more impactful using the STAR (Situation, Task, Action, Result) method or Google's XYZ formula. 
    Ensure it is ATS-optimized with relevant keywords.
    
    Original: "${bullet}"
    
    Return only the rewritten bullet point.
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
  });

  return response.text || bullet;
};

export const analyzeAtsScore = async (data: ResumeData): Promise<AtsAnalysis> => {
  const prompt = `
    Analyze this resume for ATS (Applicant Tracking System) compatibility.
    Candidate: ${data.personalInfo.fullName || 'Professional'}
    Focus on: Contact Info, Summary impact, Experience bullet points (quantifiable results), and Skill density.
    
    Resume Data: ${JSON.stringify(data)}
    
    Provide a score (0-100) and specific feedback items with a status (good, warning, critical) and a short "suggestion" on how to fix it.
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          score: { type: Type.NUMBER },
          feedbacks: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                category: { type: Type.STRING },
                message: { type: Type.STRING },
                status: { type: Type.STRING },
                suggestion: { type: Type.STRING }
              },
              required: ["category", "message", "status", "suggestion"]
            }
          }
        },
        required: ["score", "feedbacks"]
      }
    }
  });

  return JSON.parse(response.text || '{"score": 0, "feedbacks": []}');
};
