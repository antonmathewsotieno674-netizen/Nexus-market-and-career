import { GoogleGenAI } from "@google/genai";

const getAiClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.error("API_KEY is missing from environment variables.");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

export const generateProductDescription = async (productName: string, category: string): Promise<string> => {
  const ai = getAiClient();
  if (!ai) return "AI Service Unavailable";

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Write a compelling sales description (approx 40-50 words) for a "${productName}" in the category "${category}". 
      
      After the paragraph, add a section title "Key Features:" followed by 3-4 bullet points highlighting specific benefits or specs. 
      
      Format guide:
      [Engaging Paragraph]
      
      Key Features:
      - [Feature 1]
      - [Feature 2]
      - [Feature 3]`,
    });
    return response.text || "Could not generate description.";
  } catch (error) {
    console.error("Error generating product description:", error);
    return "Error generating content. Please try again.";
  }
};

export const generateJobDescription = async (jobTitle: string, company: string): Promise<string> => {
  const ai = getAiClient();
  if (!ai) return "AI Service Unavailable";

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Write a professional and attractive job description for the position of "${jobTitle}" at "${company}". Keep it under 150 words. Include typical responsibilities and desired culture fit.`,
    });
    return response.text || "Could not generate description.";
  } catch (error) {
    console.error("Error generating job description:", error);
    return "Error generating content. Please try again.";
  }
};