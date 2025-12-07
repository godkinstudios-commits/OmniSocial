import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const enhancePostText = async (text: string): Promise<string> => {
  if (!apiKey) return text;
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Rewrite the following social media post to be more engaging, witty, and concise. Only return the rewritten text, no explanations. Text: "${text}"`,
    });
    return response.text?.trim() || text;
  } catch (error) {
    console.error("Gemini enhancement failed", error);
    return text;
  }
};

export const generateHashtags = async (text: string): Promise<string[]> => {
  if (!apiKey) return [];

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Generate 3-5 relevant, trending hashtags for this post content. Return them as a JSON array of strings (e.g. ["#fun", "#life"]). Content: "${text}"`,
      config: {
        responseMimeType: 'application/json'
      }
    });
    
    const jsonStr = response.text?.trim();
    if (jsonStr) {
      return JSON.parse(jsonStr);
    }
    return [];
  } catch (error) {
    console.error("Gemini hashtag generation failed", error);
    return [];
  }
};
