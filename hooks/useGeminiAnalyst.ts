import { useState, useCallback } from 'react';
import { GoogleGenAI } from '@google/genai';
import { ProcessedProfile } from '../types';

export const useGeminiAnalyst = () => {
  const [analysis, setAnalysis] = useState<{
    isLoading: boolean;
    report: string | null;
    error: string | null;
  }>({
    isLoading: false,
    report: null,
    error: null,
  });

  const analyzeProfile = useCallback(async (
    profileData: ProcessedProfile, 
    apiKey: string
  ) => {
    if (!apiKey) {
      setAnalysis({ isLoading: false, report: null, error: "API Key is required for AI Analysis" });
      return;
    }

    setAnalysis({ isLoading: true, report: null, error: null });

    try {
      const ai = new GoogleGenAI({ apiKey });

      const promptData = {
        username: profileData.user.login,
        bio: profileData.user.bio,
        stats: {
          public_repos: profileData.user.public_repos,
          followers: profileData.user.followers,
          total_stars: profileData.totalStars,
          fork_ratio: profileData.forkRatio,
        },
        top_languages: profileData.languages,
        top_repos: profileData.topRepos.map(r => ({
          name: r.name,
          desc: r.description,
          stars: r.stargazers_count,
          lang: r.language
        }))
      };

      const prompt = `
        You are a cynical, elite software recruiter looking for top 1% talent. 
        Analyze this GitHub profile JSON data: ${JSON.stringify(promptData)}.
        
        Output a "Cyberpunk Recruiter Report" in Markdown format with these sections:
        
        1.  **Archetype**: Assign a cool hacker class (e.g., "Code Ninja", "Script Kiddie", "Open Source Warlord", "React Ronin").
        2.  **Tech Stack Arsenal**: Briefly comment on their language choices.
        3.  **Strengths**: 2-3 bullet points on what they are good at based on repo stats.
        4.  **Red Flags**: 2-3 bullet points on potential weaknesses (e.g., low completion, only forks, no docs).
        5.  **Hiring Verdict**: A final harsh but fair conclusion (Hire / No Hire / Keep on Watchlist).
        
        Tone: Professional but edgy, concise, technical. Use bolding for emphasis.
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
      });

      setAnalysis({
        isLoading: false,
        report: response.text || "No analysis generated.",
        error: null,
      });

    } catch (err: any) {
      console.error(err);
      setAnalysis({
        isLoading: false,
        report: null,
        error: err.message || "Failed to contact Gemini AI.",
      });
    }
  }, []);

  return { ...analysis, analyzeProfile };
};
