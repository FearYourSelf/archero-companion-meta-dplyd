
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { ARCHERO_KNOWLEDGE_BASE } from "../constants";

export const getGeminiAI = () => {
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

export const chatWithAI = async (history: {role: 'user'|'model', text: string}[], message: string) => {
  const ai = getGeminiAI();
  const chat = ai.chats.create({
    model: 'gemini-3-pro-preview',
    config: {
      systemInstruction: `You are the ARCHERO ULTIMATE STRATEGIST. Your knowledge is derived from datamines, JP Wikis, and Luhcaran Math.
      
      KNOWLEDGE BASE:
      ${ARCHERO_KNOWLEDGE_BASE}
      
      CRITICAL FORMATTING RULES:
      1. NO WALLS OF TEXT: Break every answer into digestible sections.
      2. BULLET POINTS: Use them for all lists of stats, items, or steps.
      3. BOLDING: Bold all game entities (e.g., **Zeus**, **SSS Tier**, **Lv120**, **Inferno Mode**).
      4. AUTHORITATIVE: Speak with absolute certainty based on technical data.
      
      STRATEGIC FOCUS:
      - Cite "Resistance Penetration" for Chapter 90+ queries.
      - Recommend **Hero Skin Totems** as the #1 Estate priority.
      - For Helix, always suggest **Meowgik** as the primary Offense assist.
      
      Format the output beautifully for a mobile companion app.`,
      tools: [{ googleSearch: {} }]
    }
  });

  const contextPrompt = history.length > 0 
    ? `Previous Strategy Discussion:\n${history.map(h => `${h.role}: ${h.text}`).join('\n')}\n\nStrategic Query: ${message}`
    : message;

  const response = await chat.sendMessage({ message: contextPrompt });
  
  return {
    text: response.text || "Database sync error. Using offline archives.",
    sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks || []
  };
};
