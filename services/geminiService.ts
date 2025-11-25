import { GoogleGenAI, Type } from "@google/genai";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export interface AICampaignStrategy {
  name: string;
  description: string;
  goal: string;
  platform: string;
  audiencePersona: string;
  keyMessage: string;
}

export const generateCampaignStrategy = async (prompt: string): Promise<AICampaignStrategy | null> => {
  if (!apiKey) {
    console.error("API Key is missing. Please configure the environment.");
    return null;
  }

  const schema = {
    type: Type.OBJECT,
    properties: {
      name: { type: Type.STRING, description: "Creative campaign title" },
      description: { type: Type.STRING, description: "Brief strategic overview (max 150 words)" },
      goal: { type: Type.STRING, enum: ["Sales", "Awareness", "Engagement", "Retention"] },
      platform: { type: Type.STRING, enum: ["WhatsApp", "Facebook", "Email", "Instagram", "Multi-Channel"] },
      audiencePersona: { type: Type.STRING, description: "Description of target audience persona" },
      keyMessage: { type: Type.STRING, description: "Primary marketing message or hook" }
    },
    required: ["name", "description", "goal", "platform", "audiencePersona", "keyMessage"]
  };

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `You are an expert marketing strategist for MarketBridge AI. 
      Create a high-impact campaign strategy based on this user request: "${prompt}".`,
      config: {
        responseMimeType: "application/json",
        responseSchema: schema,
        temperature: 0.7
      },
    });
    
    if (response.text) {
        return JSON.parse(response.text) as AICampaignStrategy;
    }
    return null;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return null;
  }
};