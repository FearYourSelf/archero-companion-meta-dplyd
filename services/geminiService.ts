
import { GoogleGenAI } from "@google/genai";
import { ARCHERO_KNOWLEDGE_BASE } from "../constants";

export const chatWithAI = async (message: string, history: { role: 'user' | 'model', text: string }[]) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const contents = [
    ...history.map(h => ({ role: h.role, parts: [{ text: h.text }] })),
    { role: 'user', parts: [{ text: message }] }
  ];

  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: contents as any,
    config: {
      systemInstruction: `You are the ZA ARMORY ARCHERO PRO AI STRATEGIST.
      
      OUTPUT FORMAT RULES (CRITICAL):
      1. Use a clear, hierarchical structure.
      2. Start with a "STRATEGIC OVERVIEW" summary.
      3. Use sections like "[OPTIMIZED LOADOUT]", "[TACTICAL ADVICE]", and "[SYNERGY ANALYSIS]".
      4. Use bullet points for equipment lists.
      5. Bold important stats (e.g., **+20% DR**).
      6. Keep sentences short and punchy. No long paragraphs.
      7. Be authoritative: tell the user exactly what to equip for the highest success rate.
      
      KNOWLEDGE BASE:
      ${ARCHERO_KNOWLEDGE_BASE}`,
      temperature: 0.7,
    },
  });

  return response.text;
};
