
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { ARCHERO_KNOWLEDGE_BASE } from "../constants";

export const getGeminiAI = () => {
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

export const analyzeScreenshot = async (base64Image: string, mimeType: string): Promise<string> => {
  const ai = getGeminiAI();
  const prompt = `Analyze this Archero screenshot. Strategic advice required using: ${ARCHERO_KNOWLEDGE_BASE}. Focus on Inferno Mode meta (H90+) and Zeus/Wukong synergy. Be precise with stat recommendations.`;
  
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: {
      parts: [
        { inlineData: { data: base64Image, mimeType } },
        { text: prompt }
      ]
    }
  });

  return response.text || "Analysis failed. Please try a clearer screenshot of your gear.";
};

export const chatWithAI = async (history: {role: 'user'|'model', text: string}[], message: string) => {
  const ai = getGeminiAI();
  const chat = ai.chats.create({
    model: 'gemini-3-pro-preview',
    config: {
      systemInstruction: `You are the ARCHERO ULTIMATE STRATEGIST.
      
      KNOWLEDGE BASE:
      ${ARCHERO_KNOWLEDGE_BASE}
      
      CRITICAL INSTRUCTIONS:
      1. Prioritize 'Archero Japanese Wiki' logic for formulas and mechanics.
      2. Be precise with percentages (e.g., Stutter Step = +35% speed).
      3. Focus on Inferno Mode Meta (H90+): Projectile Resistance is capped, focus on Raw HP and Collision Resistance.
      4. Stalker Staff rules: SSS with Diagonal Arrows, garbage otherwise.
      5. Zeus needs Celestial Hammer and Band.
      
      Admit if information is not in your meta database.`,
      tools: [{ googleSearch: {} }]
    }
  });

  const contextPrompt = history.length > 0 
    ? `History:\n${history.map(h => `${h.role}: ${h.text}`).join('\n')}\n\nUser: ${message}`
    : message;

  const response = await chat.sendMessage({ message: contextPrompt });
  
  return {
    text: response.text || "Wiki connection lost. Check grounding sources for external guides.",
    sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks || []
  };
};

export const findLocalAnswer = (query: string): string | null => {
  const q = query.toLowerCase();
  if (q.includes('gold') || q.includes('farm')) return "GOLD FARM: Up-Close Dangers Daily Event is the best. Hero 10 or 21 for Quick Waves.";
  if (q.includes('staff')) return "STAFF RULE: SSS God Tier with Diagonal Arrows. DO NOT pick Front Arrow (reduces DPS per shot).";
  if (q.includes('stutter')) return "STUTTER STEP: Animation cancel for +35% effective attack speed. Rhythm: Attack -> Tap -> Attack.";
  if (q.includes('inferno')) return "INFERNO META: Capped PR in H90+. Focus on Raw HP and Collision Resist. Necrogon dragon is key.";
  return null;
};
