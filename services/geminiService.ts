
import { GoogleGenAI } from "@google/genai";
import { ARCHERO_KNOWLEDGE_BASE } from "../constants";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const chatWithAI = async (message: string, history: { role: 'user' | 'model', text: string }[]) => {
  const contents = [
    ...history.map(h => ({ role: h.role, parts: [{ text: h.text }] })),
    { role: 'user', parts: [{ text: message }] }
  ];

  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: contents as any,
    config: {
      systemInstruction: `You are the ZA ARMORY ARCHERO PRO AI STRATEGIST. Your knowledge is absolute and derived from deep searches and datamines.
      
      RULES:
      1. FORMAT BEAUTIFULLY: Use clear bullet points, line breaks, and bold text.
      2. BE AUTHORITATIVE: Use specific numbers (e.g., "1.8x Melee Multiplier").
      3. meta-focused: Prioritize the "Immortal Build" and "Inferno Mode" logic.
      4. HELIX ADVICE: Always recommend Meowgik and Gugu as assist slots.
      
      KNOWLEDGE BASE:
      ${ARCHERO_KNOWLEDGE_BASE}`,
      temperature: 0.7,
    },
  });

  return response.text;
};
