
import { GoogleGenAI } from "@google/genai";
import { ARCHERO_KNOWLEDGE_BASE } from "../constants";

export const chatWithAI = async (message: string, history: { role: 'user' | 'model', text: string }[]) => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const contents = [
      ...history.map(h => ({ role: h.role, parts: [{ text: h.text }] })),
      { role: 'user', parts: [{ text: message }] }
    ];

    const response = await ai.models.generateContent({
      // Switched to Flash for higher rate limits and faster response times
      model: 'gemini-3-flash-preview',
      contents: contents as any,
      config: {
        systemInstruction: `You are the ARCHERO TACTICAL MENTOR. You specialize in data synthesis and meta-build analysis.

YOUR MISSION:
When the user requests a "Synthesis" or "Build Report", generate a high-fidelity tactical readout.

REPORT STRUCTURE (REQUIRED):
1. # TACTICAL PROFILE: [HERO NAME]
   - Provide a brief summary of why this hero is chosen for the current meta.
2. ## CORE ARCHITECTURE (THE LOADOUT)
   - **Weapon**: Name (Brief reason why)
   - **Armor**: Name (Brief reason why)
   - **Rings**: Name (Brief reason why)
   - **Bracelet**: Name
   - **Locket**: Name
   - **Book**: Name
3. ## COMBAT PROTOCOL (STRATEGY)
   - Bullet points on how to play this specific build (e.g., "Stay at low HP for Melinda", "Stutter-step aggressively").
4. ## RESONANCE SYNERGY
   - Which Dragons or Relics complete this setup.
5. "MENTOR'S SECRET:" A one-sentence game-changing tip.

TONE:
- Professional, analytical, but encouraging. 
- Use "Neural Link", "Matrix", "Protocol" terminology sparingly for flavor.

KNOWLEDGE BASE:
${ARCHERO_KNOWLEDGE_BASE}

FORMATTING:
- Use Markdown headers (#, ##).
- Use **Bold** for all item names.
- Ensure high readability with clear spacing between sections.`,
        temperature: 0.6,
      },
    });

    return response.text;
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    if (error.status === 429) {
      throw new Error("RATE_LIMIT_EXCEEDED");
    }
    throw error;
  }
};
